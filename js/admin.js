/*
====================================================
VALORA ADMIN
ADMIN CORE
====================================================

مسؤول عن:
- القائمة الجانبية
- قائمة الجوال
- الإشعارات
- تسجيل الخروج
- معلومات المدير
====================================================
*/


document.addEventListener("DOMContentLoaded", function () {


    /*
    ====================================================
    ELEMENTS
    ====================================================
    */

    const mobileMenu =
        document.getElementById("mobileMenu");

    const sidebar =
        document.querySelector(".admin-sidebar");

    const notificationButton =
        document.getElementById("notificationButton");

    const notificationCount =
        document.getElementById("notificationCount");

    const logoutButton =
        document.getElementById("logoutButton");



    /*
    ====================================================
    MOBILE SIDEBAR
    ====================================================
    */

    if (mobileMenu && sidebar) {

        mobileMenu.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }



    /*
    ====================================================
    CLOSE SIDEBAR
    WHEN CLICKING A LINK
    ====================================================
    */

    if (sidebar) {

        const sidebarLinks =
            sidebar.querySelectorAll(
                ".nav-item"
            );


        sidebarLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        if (
                            window.innerWidth <= 768
                        ) {

                            sidebar.classList.remove(
                                "mobile-open"
                            );

                        }

                    }
                );

            }
        );

    }



    /*
    ====================================================
    CLOSE SIDEBAR
    WHEN RESIZING TO DESKTOP
    ====================================================
    */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 768 &&
                sidebar
            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );

            }

        }
    );



    /*
    ====================================================
    NOTIFICATIONS
    ====================================================
    */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                /*
                لاحقًا سنفتح هنا
                قائمة الإشعارات الحقيقية
                */

                console.log(
                    "Notifications clicked"
                );

            }
        );

    }



    /*
    ====================================================
    NOTIFICATION COUNT
    ====================================================
    */

    window.setNotificationCount =
        function (count) {

            if (!notificationCount) {
                return;
            }


            const value =
                Number(count);


            if (
                Number.isNaN(value) ||
                value <= 0
            ) {

                notificationCount.textContent =
                    "0";

                notificationCount.style.display =
                    "none";

                return;

            }


            notificationCount.textContent =
                value > 99
                ? "99+"
                : value;


            notificationCount.style.display =
                "flex";

        };



    /*
    ====================================================
    LOGOUT
    ====================================================
    */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "هل تريد تسجيل الخروج من لوحة الإدارة؟"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                إزالة جلسة الإدارة
                لاحقًا سيتم استبدالها
                بعملية Logout من السيرفر
                */

                localStorage.removeItem(
                    "admin_token"
                );

                sessionStorage.removeItem(
                    "admin_token"
                );


                /*
                العودة إلى تسجيل الدخول
                */

                window.location.href =
                    "login.html";

            }
        );

    }



    /*
    ====================================================
    ACTIVE MENU
    ====================================================
    */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (sidebar) {

        const links =
            sidebar.querySelectorAll(
                ".nav-item"
            );


        links.forEach(
            function (link) {

                const href =
                    link.getAttribute("href");


                if (
                    href &&
                    href !== "#" &&
                    href === currentPage
                ) {

                    links.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }



});
