/* =========================================================
   VALORA ADMIN PANEL
   GLOBAL LAYOUT JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   فتح وإغلاق القائمة في الهاتف
========================================================= */

function openAdminSidebar() {

    const sidebar =
        document.querySelector(".admin-sidebar");

    const overlay =
        document.querySelector(".admin-overlay");

    if (!sidebar) return;

    sidebar.classList.add("open");

    if (overlay) {
        overlay.classList.add("open");
    }

}


function closeAdminSidebar() {

    const sidebar =
        document.querySelector(".admin-sidebar");

    const overlay =
        document.querySelector(".admin-overlay");

    if (!sidebar) return;

    sidebar.classList.remove("open");

    if (overlay) {
        overlay.classList.remove("open");
    }

}


function toggleAdminSidebar() {

    const sidebar =
        document.querySelector(".admin-sidebar");

    if (!sidebar) return;

    if (sidebar.classList.contains("open")) {

        closeAdminSidebar();

    } else {

        openAdminSidebar();

    }

}


/* =========================================================
   تحديد الصفحة الحالية تلقائياً
========================================================= */

function setActiveAdminPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const links =
        document.querySelectorAll(
            ".admin-nav a"
        );

    links.forEach(function(link) {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const linkPage =
            href
                .split("/")
                .pop()
                .split("?")[0]
                .toLowerCase();

        link.classList.remove("active");

        if (
            linkPage === currentPage
        ) {

            link.classList.add("active");

        }

    });

}


/* =========================================================
   إغلاق القائمة عند الضغط على رابط
   في الهاتف
========================================================= */

function setupAdminNavigation() {

    const links =
        document.querySelectorAll(
            ".admin-nav a"
        );

    links.forEach(function(link) {

        link.addEventListener(
            "click",
            function() {

                closeAdminSidebar();

            }
        );

    });

}


/* =========================================================
   منع مشاكل الروابط الفارغة
========================================================= */

function setupAdminButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-admin-action]"
        );

    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const action =
                    button.dataset.adminAction;

                if (!action) return;

                if (
                    action === "logout"
                ) {

                    logoutAdmin();

                }

            }
        );

    });

}


/* =========================================================
   تسجيل الخروج
========================================================= */

function logoutAdmin() {

    localStorage.removeItem(
        "VALORA_ADMIN_LOGIN"
    );

    window.location.href =
        "index.html";

}


/* =========================================================
   حماية صفحات الإدارة
========================================================= */

function protectAdminPage() {

    const loggedIn =
        localStorage.getItem(
            "VALORA_ADMIN_LOGIN"
        );

    if (
        loggedIn !== "true"
    ) {

        window.location.href =
            "index.html";

        return false;

    }

    return true;

}


/* =========================================================
   زر القائمة للموبايل
========================================================= */

function createMobileMenuButton() {

    const topbar =
        document.querySelector(
            ".admin-topbar"
        );

    if (!topbar) return;

    let button =
        document.querySelector(
            ".admin-mobile-menu"
        );

    if (button) return;

    button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "admin-mobile-menu";

    button.innerHTML = "☰";

    button.setAttribute(
        "aria-label",
        "فتح القائمة"
    );

    button.addEventListener(
        "click",
        toggleAdminSidebar
    );


    topbar.insertBefore(
        button,
        topbar.firstChild
    );

}


/* =========================================================
   إنشاء Overlay
========================================================= */

function createAdminOverlay() {

    let overlay =
        document.querySelector(
            ".admin-overlay"
        );

    if (overlay) return;

    overlay =
        document.createElement("div");

    overlay.className =
        "admin-overlay";

    overlay.addEventListener(
        "click",
        closeAdminSidebar
    );

    document.body.appendChild(
        overlay
    );

}


/* =========================================================
   إغلاق القائمة عند تغيير حجم الشاشة
========================================================= */

function setupResizeHandler() {

    window.addEventListener(
        "resize",
        function() {

            if (
                window.innerWidth > 800
            ) {

                closeAdminSidebar();

            }

        }
    );

}


/* =========================================================
   تشغيل النظام
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createAdminOverlay();

        createMobileMenuButton();

        setActiveAdminPage();

        setupAdminNavigation();

        setupAdminButtons();

        setupResizeHandler();

    }
);


/* =========================================================
   إتاحة الدوال للصفحات
========================================================= */

window.openAdminSidebar =
    openAdminSidebar;

window.closeAdminSidebar =
    closeAdminSidebar;

window.toggleAdminSidebar =
    toggleAdminSidebar;

window.logoutAdmin =
    logoutAdmin;

window.protectAdminPage =
    protectAdminPage;
