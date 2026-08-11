/* ==========================================
   VALORA ADMIN
   LOGIN SYSTEM
========================================== */

"use strict";


/* ==========================================
   إعدادات الإدارة التجريبية
========================================== */

const ADMIN_EMAIL = "admin@valora.com";
const ADMIN_PASSWORD = "123456";


/* ==========================================
   عناصر الصفحة
========================================== */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


/* ==========================================
   رسالة للمستخدم
========================================== */

function showLoginMessage(message) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className = "message error";
}


/* ==========================================
   تسجيل الدخول
========================================== */

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const emailElement =
            document.getElementById("email");

        const passwordElement =
            document.getElementById("password");


        if (!emailElement || !passwordElement) {
            return;
        }


        const email =
            emailElement.value.trim();

        const password =
            passwordElement.value;


        /* التحقق من الحقول */

        if (!email || !password) {

            showLoginMessage(
                "يرجى إدخال البريد الإلكتروني وكلمة المرور."
            );

            return;
        }


        /* بيانات الدخول التجريبية */

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            /*
             * حفظ حالة دخول المدير
             */

            localStorage.setItem(
                "VALORA_ADMIN_LOGIN",
                "true"
            );


            /*
             * حفظ وقت تسجيل الدخول
             */

            localStorage.setItem(
                "VALORA_ADMIN_LOGIN_TIME",
                Date.now().toString()
            );


            /*
             * الانتقال إلى لوحة التحكم
             */

            window.location.href =
                "dashboard.html";

            return;
        }


        /* بيانات خاطئة */

        showLoginMessage(
            "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        );

    });

}


/* ==========================================
   التحقق من تسجيل دخول المدير
========================================== */

function isAdminLoggedIn() {

    return (
        localStorage.getItem(
            "VALORA_ADMIN_LOGIN"
        ) === "true"
    );

}


/* ==========================================
   حماية صفحات الإدارة
========================================== */

function protectAdminPage() {

    if (!isAdminLoggedIn()) {

        window.location.href =
            "index.html";

    }

}


/* ==========================================
   تسجيل الخروج
========================================== */

function logoutAdmin() {

    localStorage.removeItem(
        "VALORA_ADMIN_LOGIN"
    );

    localStorage.removeItem(
        "VALORA_ADMIN_LOGIN_TIME"
    );


    window.location.href =
        "index.html";

}


/* ==========================================
   إتاحة الدوال لباقي الصفحات
========================================== */

window.isAdminLoggedIn =
    isAdminLoggedIn;

window.protectAdminPage =
    protectAdminPage;

window.logoutAdmin =
    logoutAdmin;
