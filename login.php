<?php

session_start();

require_once "db.php";

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit();
}

// Get form data
$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

// Check if fields are empty
if ($username === "" || $password === "") {
    die("Please enter your username and password.");
}

// Find the user
$stmt = $conn->prepare(
    "SELECT id, username, password, status
     FROM users
     WHERE username = ?
     LIMIT 1"
);

$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();

// Check if username exists
if ($result->num_rows === 0) {
    die("Invalid username or password.");
}

$user = $result->fetch_assoc();

// Check account status
if ($user["status"] !== "active") {
    die("Your account is not active.");
}

// Check password
if (!password_verify($password, $user["password"])) {
    die("Invalid username or password.");
}

// Create login session
$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];

// Login successful
header("Location: dashboard.html");
exit();

?>