/*
=========================================================
VALORA ADMIN
ADMIN CORE
=========================================================

مسؤول عن الوظائف المشتركة في لوحة الإدارة:

- Sidebar
- Mobile Sidebar
- Overlay
- Active Navigation
- Notifications
- Admin Menu
- Logout Demo
- Keyboard / Accessibility helpers

ملاحظة:
هذا الملف لا يحتوي على منطق خاص بالمستخدمين
أو الإيداعات أو Dashboard.
=========================================================
*/

(function () {
    "use strict";


    /*
    =====================================================
    CONFIGURATION
    =====================================================
    */

    const CONFIG = {
        mobileBreakpoint: 768,

        loginPage: "index.html",

        storageKeys: {
            adminToken: "valora_admin_token",
            adminSession: "valora_admin_session",
            notificationCount: "valora_admin_notification_count"
        }
    };


    /*
    =====================================================
    DOM READY
    =====================================================
    */

    document.addEventListener("DOMContentLoaded", init);


    /*
    =====================================================
    INITIALIZATION
    =====================================================
    */

    function init() {
        setupMobileSidebar();
        setupNavigation();
        setupNotifications();
        setupAdminMenu();
        setupLogout();
        setupKeyboardSupport();
        restoreNotificationCount();
    }


    /*
    =====================================================
    MOBILE SIDEBAR
    =====================================================
    */

    function setupMobileSidebar() {

        const sidebar =
            document.querySelector(".admin-sidebar");

        if (!sidebar) {
            return;
        }


        const toggleButton =
            document.querySelector(
                "#mobileMenu, .admin-menu-toggle"
            );


        const overlay =
            document.querySelector(
                ".admin-sidebar-overlay"
            );


        /*
        -------------------------------------------------
        OPEN / CLOSE BUTTON
        -------------------------------------------------
        */

        if (toggleButton) {

            toggleButton.addEventListener(
                "click",
                function () {

                    toggleSidebar();

                }
            );

        }


        /*
        -------------------------------------------------
        OVERLAY CLICK
        -------------------------------------------------
        */

        if (overlay) {

            overlay.addEventListener(
                "click",
                function () {

                    closeSidebar();

                }
            );

        }


        /*
        -------------------------------------------------
        SIDEBAR LINKS
        -------------------------------------------------
        */

        const links =
            sidebar.querySelectorAll(
                "a[href]"
            );


        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <=
                        CONFIG.mobileBreakpoint
                    ) {

                        closeSidebar();

                    }

                }
            );

        });


        /*
        -------------------------------------------------
        RESIZE
        -------------------------------------------------
        */

        window.addEventListener(
            "resize",
            function () {

                if (
                    window.innerWidth >
                    CONFIG.mobileBreakpoint
                ) {

                    closeSidebar();

                }

            }
        );


        /*
        -------------------------------------------------
        ESCAPE KEY
        -------------------------------------------------
        */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {

                    closeSidebar();

                }

            }
        );
    }


    /*
    =====================================================
    SIDEBAR STATE
    =====================================================
    */

    function toggleSidebar() {

        const sidebar =
            document.querySelector(".admin-sidebar");

        if (!sidebar) {
            return;
        }


        const isOpen =
            document.body.classList.contains(
                "admin-sidebar-open"
            );


        if (isOpen) {

            closeSidebar();

        } else {

            openSidebar();

        }
    }


    function openSidebar() {

        const sidebar =
            document.querySelector(".admin-sidebar");

        if (!sidebar) {
            return;
        }


        document.body.classList.add(
            "admin-sidebar-open"
        );


        const toggle =
            document.querySelector(
                "#mobileMenu, .admin-menu-toggle"
            );


        if (toggle) {

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

        }
    }


    function closeSidebar() {

        document.body.classList.remove(
            "admin-sidebar-open"
        );


        const toggle =
            document.querySelector(
                "#mobileMenu, .admin-menu-toggle"
            );


        if (toggle) {

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }
    }


    /*
    =====================================================
    NAVIGATION
    =====================================================
    */

    function setupNavigation() {

        const sidebar =
            document.querySelector(".admin-sidebar");

        if (!sidebar) {
            return;
        }


        const links =
            sidebar.querySelectorAll(
                "a[href]"
            );


        const currentPage =
            getCurrentPage();


        links.forEach(function (link) {

            const href =
                link.getAttribute("href");


            if (!href || href === "#") {
                return;
            }


            const targetPage =
                getPageFromHref(href);


            /*
            ------------------------------------------------
            ACTIVE PAGE
            ------------------------------------------------
            */

            if (
                targetPage &&
                targetPage === currentPage
            ) {

                setActiveNavigation(link);

            }


            /*
            ------------------------------------------------
            KEYBOARD SUPPORT
            ------------------------------------------------
            */

            link.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        link.click();

                    }

                }
            );

        });
    }


    /*
    =====================================================
    ACTIVE NAVIGATION
    =====================================================
    */

    function setActiveNavigation(activeLink) {

        const sidebar =
            document.querySelector(".admin-sidebar");

        if (!sidebar) {
            return;
        }


        const links =
            sidebar.querySelectorAll(
                "a[href]"
            );


        links.forEach(function (link) {

            link.classList.remove(
                "active"
            );

            link.removeAttribute(
                "aria-current"
            );

        });


        activeLink.classList.add(
            "active"
        );


        activeLink.setAttribute(
            "aria-current",
            "page"
        );
    }


    /*
    =====================================================
    CURRENT PAGE
    =====================================================
    */

    function getCurrentPage() {

        let page =
            window.location.pathname
                .split("/")
                .pop();


        if (!page) {
            page = "index.html";
        }


        /*
        localhost root
        */

        if (
            page === "" ||
            page === "/"
        ) {

            page = "index.html";

        }


        return page.toLowerCase();
    }


    /*
    =====================================================
    PAGE FROM HREF
    =====================================================
    */

    function getPageFromHref(href) {

        try {

            const url =
                new URL(
                    href,
                    window.location.href
                );


            return (
                url.pathname
                    .split("/")
                    .pop()
                    .toLowerCase()
            );

        } catch (error) {

            return href
                .split("?")[0]
                .split("#")[0]
                .split("/")
                .pop()
                .toLowerCase();

        }
    }


    /*
    =====================================================
    NOTIFICATIONS
    =====================================================
    */

    function setupNotifications() {

        const notificationButton =
            document.querySelector(
                "#notificationButton, .admin-notification-button"
            );


        if (!notificationButton) {
            return;
        }


        notificationButton.setAttribute(
            "aria-label",
            notificationButton.getAttribute(
                "aria-label"
            ) || "الإشعارات"
        );


        notificationButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                handleNotificationClick();

            }
        );
    }


    /*
    =====================================================
    NOTIFICATION CLICK
    =====================================================
    */

    function handleNotificationClick() {

        /*
        سيتم لاحقًا استبدال هذا
        بصفحة / Dropdown الإشعارات الحقيقي.
        */

        const notificationPanel =
            document.querySelector(
                ".admin-notification-panel"
            );


        if (notificationPanel) {

            notificationPanel.classList.toggle(
                "open"
            );

            return;
        }


        /*
        إذا لم توجد قائمة إشعارات بعد،
        ننتقل إلى صفحة الإشعارات عند توفرها.
        */

        const notificationsPage =
            "notifications.html";


        /*
        لا ننتقل الآن إذا كانت الصفحة
        غير موجودة في مرحلة التصميم الحالية.
        */

        if (
            isKnownAdminPage(
                notificationsPage
            )
        ) {

            window.location.href =
                notificationsPage;

        } else {

            console.info(
                "VALORA ADMIN: Notifications UI is not created yet."
            );

        }
    }


    /*
    =====================================================
    NOTIFICATION COUNT
    =====================================================
    */

    function setNotificationCount(count) {

        const badge =
            document.querySelector(
                "#notificationCount, .admin-notification-badge"
            );


        const numericCount =
            Number(count);


        /*
        -------------------------------------------------
        SAVE
        -------------------------------------------------
        */

        if (
            Number.isFinite(numericCount)
        ) {

            localStorage.setItem(
                CONFIG.storageKeys.notificationCount,
                String(
                    Math.max(
                        0,
                        numericCount
                    )
                )
            );

        }


        if (!badge) {
            return;
        }


        /*
        -------------------------------------------------
        HIDE WHEN ZERO
        -------------------------------------------------
        */

        if (
            !Number.isFinite(numericCount) ||
            numericCount <= 0
        ) {

            badge.textContent = "";
            badge.style.display = "none";

            return;
        }


        /*
        -------------------------------------------------
        DISPLAY
        -------------------------------------------------
        */

        badge.textContent =
            numericCount > 99
                ? "99+"
                : String(numericCount);


        badge.style.display =
            "inline-flex";
    }


    /*
    =====================================================
    RESTORE NOTIFICATION COUNT
    =====================================================
    */

    function restoreNotificationCount() {

        const saved =
            localStorage.getItem(
                CONFIG.storageKeys.notificationCount
            );


        if (saved === null) {

            setNotificationCount(0);

            return;
        }


        setNotificationCount(
            Number(saved)
        );
    }


    /*
    =====================================================
    ADMIN MENU
    =====================================================
    */

    function setupAdminMenu() {

        const adminMenuButton =
            document.querySelector(
                "#adminMenuButton, .admin-admin-button"
            );


        const adminMenu =
            document.querySelector(
                ".admin-admin-menu"
            );


        if (!adminMenuButton) {
            return;
        }


        adminMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        adminMenuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                if (!adminMenu) {
                    return;
                }


                const isOpen =
                    adminMenu.classList.contains(
                        "open"
                    );


                adminMenu.classList.toggle(
                    "open",
                    !isOpen
                );


                adminMenuButton.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

            }
        );


        /*
        -------------------------------------------------
        CLICK OUTSIDE
        -------------------------------------------------
        */

        document.addEventListener(
            "click",
            function (event) {

                if (!adminMenu) {
                    return;
                }


                if (
                    !adminMenu.contains(
                        event.target
                    ) &&
                    !adminMenuButton.contains(
                        event.target
                    )
                ) {

                    adminMenu.classList.remove(
                        "open"
                    );


                    adminMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );
    }


    /*
    =====================================================
    LOGOUT
    =====================================================
    */

    function setupLogout() {

        const logoutButtons =
            document.querySelectorAll(
                "#logoutButton, [data-admin-logout]"
            );


        if (!logoutButtons.length) {
            return;
        }


        logoutButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    performLogout();

                }
            );

        });
    }


    /*
    =====================================================
    PERFORM LOGOUT
    =====================================================
    */

    function performLogout() {

        const confirmed =
            window.confirm(
                "هل تريد تسجيل الخروج من لوحة الإدارة؟"
            );


        if (!confirmed) {
            return;
        }


        /*
        -------------------------------------------------
        DEMO SESSION CLEANUP
        -------------------------------------------------
        */

        localStorage.removeItem(
            CONFIG.storageKeys.adminToken
        );

        localStorage.removeItem(
            CONFIG.storageKeys.adminSession
        );

        sessionStorage.removeItem(
            CONFIG.storageKeys.adminToken
        );

        sessionStorage.removeItem(
            CONFIG.storageKeys.adminSession
        );


        /*
        -------------------------------------------------
        RESET UI STATE
        -------------------------------------------------
        */

        document.body.classList.remove(
            "admin-sidebar-open"
        );


        /*
        -------------------------------------------------
        REDIRECT
        -------------------------------------------------
        */

        window.location.href =
            CONFIG.loginPage;
    }


    /*
    =====================================================
    KEYBOARD SUPPORT
    =====================================================
    */

    function setupKeyboardSupport() {

        document.addEventListener(
            "keydown",
            function (event) {

                /*
                Ctrl / Cmd + B
                Toggle sidebar on desktop/mobile.
                */

                if (
                    (event.ctrlKey ||
                        event.metaKey) &&
                    event.key.toLowerCase() === "b"
                ) {

                    event.preventDefault();

                    toggleSidebar();

                }

            }
        );
    }


    /*
    =====================================================
    ADMIN PAGE CHECK
    =====================================================
    */

    function isKnownAdminPage(page) {

        const adminPages = [
            "index.html",
            "dashboard.html",
            "users.html",
            "user-details.html",
            "deposits.html",
            "withdrawals.html",
            "transactions.html",
            "trade-codes.html",
            "verification.html",
            "notifications.html",
            "messages.html",
            "settings.html"
        ];


        return adminPages.includes(
            page.toLowerCase()
        );
    }


    /*
    =====================================================
    PUBLIC API
    =====================================================

    يسمح لبقية ملفات المشروع باستخدام
    وظائف Admin الأساسية بدون تكرارها.
    =====================================================
    */

    window.VALORA_ADMIN = {

        openSidebar: openSidebar,

        closeSidebar: closeSidebar,

        toggleSidebar: toggleSidebar,

        setNotificationCount:
            setNotificationCount,

        getCurrentPage:
            getCurrentPage,

        performLogout:
            performLogout,

        setActiveNavigation:
            setActiveNavigation
    };

})();
