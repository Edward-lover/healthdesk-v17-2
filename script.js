// ========================================
// HEALTHDESK
// MAIN JAVASCRIPT
// ========================================


// ========================================
// HELPER FUNCTIONS
// ========================================

function getAppointments() {

    return JSON.parse(
        localStorage.getItem("healthdeskAppointments") || "[]"
    );

}


function saveAppointments(appointments) {

    localStorage.setItem(
        "healthdeskAppointments",
        JSON.stringify(appointments)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("healthdeskCurrentUser") || "null"
    );

}


function showMessage(element, message, type = "error") {

    if (!element) return;

    element.textContent = message;
    element.style.display = "block";

    if (type === "success") {

        element.style.color = "#16a34a";

    } else {

        element.style.color = "#dc2626";

    }

}


// ========================================
// LOGIN / SIGN UP
// ========================================

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginSection =
    document.getElementById("loginSection");

const signupSection =
    document.getElementById("signupSection");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");


// ========================================
// SHOW SIGN UP
// ========================================

if (showSignup) {

    showSignup.addEventListener(
        "click",
        function () {

            if (loginSection) {

                loginSection.classList.add("hidden");

            }

            if (signupSection) {

                signupSection.classList.remove("hidden");

            }

        }
    );

}


// ========================================
// SHOW LOGIN
// ========================================

if (showLogin) {

    showLogin.addEventListener(
        "click",
        function () {

            if (signupSection) {

                signupSection.classList.add("hidden");

            }

            if (loginSection) {

                loginSection.classList.remove("hidden");

            }

        }
    );

}


// ========================================
// LOGIN / SIGNUP
// ========================================
//
// IMPORTANT:
// Do NOT use preventDefault() here.
//
// The forms must be allowed to send
// the information to PHP:
//
// Sign Up → signup.php
// Sign In → login.php
//
// ========================================


// ========================================
// PROTECT USER PAGES
// ========================================

const protectedPages = [

    "dashboard.html",
    "appointment.html",
    "appointments.html"

];


const currentPage =
    window.location.pathname
        .split("/")
        .pop();


// NOTE:
// Authentication is now handled by PHP.
// Do not use the old localStorage login system here.


// ========================================
// LOG OUT
// ========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "healthdeskCurrentUser"
            );

            window.location.href =
                "index.html";

        }
    );

}


// ========================================
// DASHBOARD
// ========================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

const studentNameDisplay =
    document.getElementById("studentNameDisplay");

const totalAppointments =
    document.getElementById("totalAppointments");

const pendingAppointments =
    document.getElementById("pendingAppointments");

const nextAppointment =
    document.getElementById("nextAppointment");


function loadDashboard() {

    const user =
        getCurrentUser();

    if (!user) return;


    if (welcomeMessage) {

        welcomeMessage.textContent =
            "Welcome, " + user.name + " 👋";

    }


    if (studentNameDisplay) {

        studentNameDisplay.textContent =
            user.name;

    }


    const appointments =
        getAppointments().filter(
            appointment =>
                appointment.userEmail === user.email
        );


    if (totalAppointments) {

        totalAppointments.textContent =
            appointments.length;

    }


    if (pendingAppointments) {

        pendingAppointments.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Pending"
            ).length;

    }


    if (nextAppointment) {

        if (appointments.length === 0) {

            nextAppointment.innerHTML = `
                <div class="empty-dashboard">

                    <span>📅</span>

                    <p>
                        You don't have any appointments yet.
                    </p>

                    <a
                        href="appointment.html"
                        class="btn primary-btn">
                        Book Appointment
                    </a>

                </div>
            `;

            return;

        }


        const upcoming =
            appointments
                .filter(
                    appointment =>
                        appointment.status !== "Rejected" &&
                        appointment.status !== "Completed"
                )
                .sort(
                    (a, b) =>
                        new Date(
                            a.date + "T" + a.time
                        ) -
                        new Date(
                            b.date + "T" + b.time
                        )
                )[0];


        if (!upcoming) {

            nextAppointment.innerHTML = `
                <div class="empty-dashboard">

                    <span>✅</span>

                    <p>
                        No upcoming appointments.
                    </p>

                </div>
            `;

            return;

        }


        nextAppointment.innerHTML = `

            <div class="next-card">

                <div class="next-card-header">

                    <h3>
                        Clinic Appointment
                    </h3>

                    <span class="next-status">
                        ${upcoming.status}
                    </span>

                </div>


                <div class="next-details">

                    <p>
                        Date
                        <strong>
                            ${upcoming.date}
                        </strong>
                    </p>

                    <p>
                        Time
                        <strong>
                            ${upcoming.time}
                        </strong>
                    </p>

                    <p>
                        Reason
                        <strong>
                            ${upcoming.reason}
                        </strong>
                    </p>

                </div>

            </div>

        `;

    }

}


if (
    currentPage === "dashboard.html"
) {

    loadDashboard();

}


// ========================================
// APPOINTMENT FORM
// ========================================

const appointmentForm =
    document.getElementById(
        "appointmentForm"
    );


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (!user) {

                window.location.href =
                    "index.html";

                return;

            }


            const appointmentType =
                document.getElementById(
                    "appointmentType"
                )?.value || "Public";


            const date =
                document.getElementById(
                    "appointmentDate"
                )?.value;


            const time =
                document.getElementById(
                    "appointmentTime"
                )?.value;


            const reason =
                document.getElementById(
                    "appointmentReason"
                )?.value.trim();


            if (!date || !time || !reason) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            const appointment = {

                id: Date.now(),

                userEmail:
                    user.email,

                studentName:
                    user.name,

                studentId:
                    user.studentId,

                type:
                    appointmentType,

                date:
                    date,

                time:
                    time,

                reason:
                    reason,

                status:
                    "Pending",

                createdAt:
                    new Date().toISOString()

            };


            const appointments =
                getAppointments();


            appointments.push(
                appointment
            );


            saveAppointments(
                appointments
            );


            alert(
                "Appointment submitted successfully!"
            );


            window.location.href =
                "appointments.html";

        }
    );

}


// ========================================
// MY APPOINTMENTS
// ========================================

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );


function loadAppointments() {

    if (!appointmentsList) return;


    const user =
        getCurrentUser();


    if (!user) return;


    const appointments =
        getAppointments().filter(
            appointment =>
                appointment.userEmail ===
                user.email
        );


    if (appointments.length === 0) {

        appointmentsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No Appointments
                </h2>

                <p>
                    You don't have any clinic appointments yet.
                </p>

                <a
                    href="appointment.html"
                    class="btn primary-btn">
                    Book Appointment
                </a>

            </div>

        `;

        return;

    }


    appointmentsList.innerHTML = "";


    appointments
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt
                ) -
                new Date(
                    a.createdAt
                )
        )
        .forEach(
            appointment => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "appointment-card";


                card.innerHTML = `

                    <div class="appointment-header">

                        <h2>
                            Clinic Appointment
                        </h2>

                        <span
                            class="appointment-status status-${appointment.status.toLowerCase()}">

                            ${appointment.status}

                        </span>

                    </div>


                    <div class="appointment-details">

                        <p>

                            <strong>
                                Type:
                            </strong>

                            ${appointment.type}

                        </p>


                        <p>

                            <strong>
                                Date:
                            </strong>

                            ${appointment.date}

                        </p>


                        <p>

                            <strong>
                                Time:
                            </strong>

                            ${appointment.time}

                        </p>


                        <p>

                            <strong>
                                Reason:
                            </strong>

                            ${appointment.reason}

                        </p>

                    </div>


                    ${
                        appointment.status === "Pending"
                            ? `

                                <button
                                    class="cancel-btn"
                                    onclick="cancelAppointment(${appointment.id})">

                                    Cancel Appointment

                                </button>

                              `
                            : ""
                    }

                `;


                appointmentsList.appendChild(
                    card
                );

            }
        );

}


function cancelAppointment(
    appointmentId
) {

    const appointments =
        getAppointments();


    const appointment =
        appointments.find(
            item =>
                item.id === appointmentId
        );


    if (!appointment) return;


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!confirmCancel) return;


    appointment.status =
        "Rejected";


    saveAppointments(
        appointments
    );


    loadAppointments();

}


window.cancelAppointment =
    cancelAppointment;


if (
    currentPage === "appointments.html"
) {

    loadAppointments();

}


// ========================================
// ADMIN LOGIN
// ========================================

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "adminEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            if (
                email ===
                    "admin@healthdesk.com" &&
                password ===
                    "admin123"
            ) {

                localStorage.setItem(
                    "healthdeskAdmin",
                    "true"
                );


                window.location.href =
                    "admin.html";

            }

            else {

                alert(
                    "Incorrect admin email or password."
                );

            }

        }
    );

}


// ========================================
// ADMIN PAGE PROTECTION
// ========================================

if (
    currentPage === "admin.html" &&
    localStorage.getItem(
        "healthdeskAdmin"
    ) !== "true"
) {

    window.location.href =
        "admin-login.html";

}


// ========================================
// ADMIN LOGOUT
// ========================================

const adminLogoutBtn =
    document.getElementById(
        "adminLogoutBtn"
    );


if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "healthdeskAdmin"
            );


            window.location.href =
                "admin-login.html";

        }
    );

}


// ========================================
// ADMIN DASHBOARD
// ========================================

const adminTotal =
    document.getElementById(
        "adminTotal"
    );

const adminPending =
    document.getElementById(
        "adminPending"
    );

const adminApproved =
    document.getElementById(
        "adminApproved"
    );

const adminAppointments =
    document.getElementById(
        "adminAppointments"
    );


function loadAdminDashboard() {

    if (!adminAppointments) return;


    const appointments =
        getAppointments();


    if (adminTotal) {

        adminTotal.textContent =
            appointments.length;

    }


    if (adminPending) {

        adminPending.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Pending"
            ).length;

    }


    if (adminApproved) {

        adminApproved.textContent =
            appointments.filter(
                appointment =>
                    appointment.status === "Approved"
            ).length;

    }


    if (appointments.length === 0) {

        adminAppointments.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No Appointments
                </h2>

                <p>
                    There are no student appointments yet.
                </p>

            </div>

        `;

        return;

    }


    adminAppointments.innerHTML = "";


    appointments
        .sort(
            (a, b) =>
                new Date(
                    b.createdAt
                ) -
                new Date(
                    a.createdAt
                )
        )
        .forEach(
            appointment => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-appointment";


                card.innerHTML = `

                    <div class="admin-appointment-header">

                        <h3>
                            ${appointment.studentName}
                        </h3>

                        <span
                            class="admin-status status-${appointment.status.toLowerCase()}">

                            ${appointment.status}

                        </span>

                    </div>


                    <div class="admin-details">

                        <strong>
                            Student ID:
                        </strong>

                        ${appointment.studentId}

                        <br>


                        <strong>
                            Email:
                        </strong>

                        ${appointment.userEmail}

                        <br>


                        <strong>
                            Type:
                        </strong>

                        ${appointment.type}

                        <br>


                        <strong>
                            Date:
                        </strong>

                        ${appointment.date}

                        <br>


                        <strong>
                            Time:
                        </strong>

                        ${appointment.time}

                        <br>


                        <strong>
                            Reason:
                        </strong>

                        ${appointment.reason}

                    </div>


                    <div class="admin-actions">

                        ${
                            appointment.status === "Pending"
                                ? `

                                    <button
                                        class="approve-btn"
                                        onclick="updateAppointmentStatus(${appointment.id}, 'Approved')">

                                        Approve

                                    </button>


                                    <button
                                        class="reject-btn"
                                        onclick="updateAppointmentStatus(${appointment.id}, 'Rejected')">

                                        Reject

                                    </button>

                                  `
                                : ""
                        }


                        ${
                            appointment.status === "Approved"
                                ? `

                                    <button
                                        class="complete-btn"
                                        onclick="updateAppointmentStatus(${appointment.id}, 'Completed')">

                                        Complete

                                    </button>

                                  `
                                : ""
                        }

                    </div>

                `;


                adminAppointments.appendChild(
                    card
                );

            }
        );

}


function updateAppointmentStatus(
    appointmentId,
    newStatus
) {

    const appointments =
        getAppointments();


    const appointment =
        appointments.find(
            item =>
                item.id === appointmentId
        );


    if (!appointment) return;


    appointment.status =
        newStatus;


    saveAppointments(
        appointments
    );


    loadAdminDashboard();

}


window.updateAppointmentStatus =
    updateAppointmentStatus;


if (
    currentPage === "admin.html"
) {

    loadAdminDashboard();

}


// ========================================
// HEALTHDESK PWA INSTALL
// ========================================

let deferredPrompt = null;


const installBtn =
    document.getElementById("installBtn");


const downloadOverlay =
    document.getElementById("downloadOverlay");


const downloadMessage =
    document.getElementById("downloadMessage");


const downloadCountdown =
    document.getElementById("downloadCountdown");


const downloadProgressBar =
    document.getElementById(
        "downloadProgressBar"
    );


// ========================================
// CHECK INSTALL MODE
// ========================================

const isStandalone =
    window.matchMedia(
        "(display-mode: standalone)"
    ).matches ||

    window.matchMedia(
        "(display-mode: fullscreen)"
    ).matches ||

    window.navigator.standalone === true;


// ========================================
// INSTALL BUTTON
// ========================================

if (installBtn) {

    if (isStandalone) {

        installBtn.style.display =
            "none";

    }

    else {

        installBtn.style.display =
            "block";


        window.addEventListener(
            "beforeinstallprompt",
            function (event) {

                event.preventDefault();

                deferredPrompt =
                    event;

                installBtn.style.display =
                    "block";

            }
        );


        installBtn.addEventListener(
            "click",
            function () {

                startHealthDeskDownload();

            }
        );

    }

}


// ========================================
// START DOWNLOAD / PREPARATION
// ========================================

function startHealthDeskDownload() {

    if (!downloadOverlay) {

        if (deferredPrompt) {

            deferredPrompt.prompt();

        }

        return;

    }


    downloadOverlay.classList.add(
        "show"
    );


    let secondsLeft = 5;


    if (downloadCountdown) {

        downloadCountdown.textContent =
            "5 seconds";

    }


    if (downloadMessage) {

        downloadMessage.textContent =
            "Preparing HealthDesk for installation...";

    }


    if (downloadProgressBar) {

        downloadProgressBar.style.width =
            "0%";

    }


    const downloadTimer =
        setInterval(
            async function () {

                secondsLeft--;


                const progress =
                    ((5 - secondsLeft) / 5) *
                    100;


                if (downloadCountdown) {

                    downloadCountdown.textContent =
                        secondsLeft +
                        (
                            secondsLeft === 1
                                ? " second"
                                : " seconds"
                        );

                }


                if (downloadProgressBar) {

                    downloadProgressBar.style.width =
                        progress + "%";

                }


                if (secondsLeft <= 0) {

                    clearInterval(
                        downloadTimer
                    );


                    if (downloadProgressBar) {

                        downloadProgressBar.style.width =
                            "100%";

                    }


                    if (downloadMessage) {

                        downloadMessage.textContent =
                            "Opening installation...";

                    }


                    // Automatically open the
                    // browser installation prompt
                    if (deferredPrompt) {

                        try {

                            await deferredPrompt.prompt();

                            await deferredPrompt.userChoice;

                            deferredPrompt =
                                null;

                        }

                        catch (error) {

                            console.error(
                                "Installation error:",
                                error
                            );

                        }

                    }

                    else {

                        const isIOS =
                            /iphone|ipad|ipod/i.test(
                                navigator.userAgent
                            );


                        if (isIOS) {

                            alert(
                                "To install HealthDesk on your iPhone or iPad:\n\n" +
                                "1. Tap the Share button in Safari.\n" +
                                "2. Select 'Add to Home Screen'.\n" +
                                "3. Tap 'Add'."
                            );

                        }

                        else {

                            alert(
                                "Open your browser menu and select 'Install App' or 'Add to Home Screen'."
                            );

                        }

                    }


                    hideDownloadOverlay();

                }

            },
            1000
        );

}


// ========================================
// HIDE DOWNLOAD OVERLAY
// ========================================

function hideDownloadOverlay() {

    if (downloadOverlay) {

        downloadOverlay.classList.remove(
            "show"
        );

    }

}


// ========================================
// APP INSTALLED
// ========================================

window.addEventListener(
    "appinstalled",
    function () {

        console.log(
            "HealthDesk has been installed!"
        );


        hideDownloadOverlay();

    }
);