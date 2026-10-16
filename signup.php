<?php

// SHOW PHP ERRORS
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "db.php";


// ========================================
// ONLY ALLOW FORM SUBMISSIONS
// ========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit();
}


// ========================================
// GET FORM INFORMATION
// ========================================

$first_name = trim($_POST["first_name"] ?? "");
$last_name = trim($_POST["last_name"] ?? "");
$student_id = trim($_POST["student_id"] ?? "");
$email = trim($_POST["email"] ?? "");
$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";
$confirm_password = $_POST["confirm_password"] ?? "";


// ========================================
// CHECK REQUIRED FIELDS
// ========================================

if (
    $first_name === "" ||
    $last_name === "" ||
    $student_id === "" ||
    $email === "" ||
    $username === "" ||
    $password === "" ||
    $confirm_password === ""
) {
    die("Please fill in all fields.");
}


// ========================================
// CHECK EMAIL
// ========================================

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Please enter a valid email address.");
}


// ========================================
// CHECK PASSWORD LENGTH
// ========================================

if (strlen($password) < 6) {
    die("Password must be at least 6 characters.");
}


// ========================================
// CHECK PASSWORD MATCH
// ========================================

if ($password !== $confirm_password) {
    die("Passwords do not match.");
}


// ========================================
// CHECK STUDENT ID
// ========================================

$checkStudent = $conn->prepare(
    "SELECT id FROM users WHERE student_id = ? LIMIT 1"
);

if (!$checkStudent) {
    die("Student ID check failed: " . $conn->error);
}

$checkStudent->bind_param("s", $student_id);
$checkStudent->execute();

$studentResult = $checkStudent->get_result();

if ($studentResult->num_rows > 0) {
    die("This Student ID is already registered.");
}

$checkStudent->close();


// ========================================
// CHECK EMAIL
// ========================================

$checkEmail = $conn->prepare(
    "SELECT id FROM users WHERE email = ? LIMIT 1"
);

if (!$checkEmail) {
    die("Email check failed: " . $conn->error);
}

$checkEmail->bind_param("s", $email);
$checkEmail->execute();

$emailResult = $checkEmail->get_result();

if ($emailResult->num_rows > 0) {
    die("This email is already registered.");
}

$checkEmail->close();


// ========================================
// CHECK USERNAME
// ========================================

$checkUsername = $conn->prepare(
    "SELECT id FROM users WHERE username = ? LIMIT 1"
);

if (!$checkUsername) {
    die("Username check failed: " . $conn->error);
}

$checkUsername->bind_param("s", $username);
$checkUsername->execute();

$usernameResult = $checkUsername->get_result();

if ($usernameResult->num_rows > 0) {
    die("This username is already taken.");
}

$checkUsername->close();


// ========================================
// HASH PASSWORD
// ========================================

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);


// ========================================
// ACCOUNT STATUS
// ========================================

$status = "active";


// ========================================
// INSERT USER INTO DATABASE
// ========================================

$stmt = $conn->prepare(
    "INSERT INTO users
    (
        first_name,
        last_name,
        student_id,
        email,
        username,
        password,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    die("Account creation failed: " . $conn->error);
}


// ========================================
// CONNECT FORM DATA TO SQL
// ========================================

$stmt->bind_param(
    "sssssss",
    $first_name,
    $last_name,
    $student_id,
    $email,
    $username,
    $hashedPassword,
    $status
);


// ========================================
// SAVE ACCOUNT
// ========================================

if ($stmt->execute()) {

    echo "
    <script>
        alert('Account created successfully!');
        window.location.href = 'index.html';
    </script>
    ";

} else {

    die(
        "Account could not be created.<br><br>" .
        "Database error: " . $stmt->error
    );
}


// ========================================
// CLOSE CONNECTION
// ========================================

$stmt->close();
$conn->close();

?>