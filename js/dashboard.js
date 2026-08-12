/*
=========================================================
VALORA ADMIN
DASHBOARD
=========================================================

هذا الملف مسؤول عن:

- إحصائيات Dashboard
- النشاطات الأخيرة
- حالة الخدمات
- الإيداعات المعلقة
- عداد الإشعارات
- زر تحديث البيانات
- Demo Data فقط

ملاحظة:
لا توجد قاعدة بيانات أو API في هذه المرحلة.
عند الربط لاحقًا سنستبدل مصدر البيانات فقط.
=========================================================
*/

(function () {
    "use strict";


    /*
    =====================================================
    DEMO DATA
    =====================================================
    */

    const DASHBOARD_DATA = {

        statistics: {
            users: 12842,
            usersGrowth: "+8.4% هذا الشهر",

            deposits: "$284,650",
            depositsGrowth: "+12.6% هذا الشهر",

            transactions: 1842,
            transactionsMeta: "خلال آخر 24 ساعة",

            systemStatus: "متصل"
        },


        pendingDeposits: 7,


        notifications: 4,


        services: {
            database: {
                status: "operational",
                label: "متصل"
            },

            api: {
                status: "operational",
                label: "متصل"
            },

            storage: {
                status: "operational",
                label: "متصل"
            }
        },


        activities: [

            {
                id: 1,
                type: "deposit",
                title: "تم تسجيل إيداع جديد",
                description: "المستخدم VA-10482 أضاف إيداعًا بقيمة $2,500",
                time: "منذ 5 دقائق",
                status: "success"
            },

            {
                id: 2,
                type: "user",
                title: "مستخدم جديد",
                description: "تم إنشاء حساب جديد برقم VA-10483",
                time: "منذ 12 دقيقة",
                status: "info"
            },

            {
                id: 3,
                type: "withdrawal",
                title: "طلب سحب جديد",
                description: "طلب سحب بقيمة $850 يحتاج إلى مراجعة",
                time: "منذ 24 دقيقة",
                status: "warning"
            },

            {
                id: 4,
                type: "verification",
                title: "طلب تحقق جديد",
                description: "المستخدم VA-10391 أرسل مستندات التحقق",
                time: "منذ 38 دقيقة",
                status: "info"
            },

            {
                id: 5,
                type: "trade",
                title: "عملية تداول مكتملة",
                description: "تم تنفيذ عملية تداول للمستخدم VA-10274",
                time: "منذ ساعة",
                status: "success"
            }

        ]

    };


    /*
    =====================================================
    INITIALIZATION
    =====================================================
    */

    document.addEventListener(
        "DOMContentLoaded",
        initDashboard
    );


    function initDashboard() {

        /*
        -------------------------------------------------
        نتأكد أن الصفحة هي Dashboard
        -------------------------------------------------
        */

        if (!document.getElementById("usersCount")) {
            return;
        }


        renderDashboard();

        setupRefreshButton();

        setupActivityButton();

        updateServicesStatus();
    }


    /*
    =====================================================
    RENDER DASHBOARD
    =====================================================
    */

    function renderDashboard() {

        renderStatistics();

        renderActivities();

        renderPendingDeposits();

        renderNotifications();

        updateServicesStatus();
    }


    /*
    =====================================================
    STATISTICS
    =====================================================
    */

    function renderStatistics() {

        setText(
            "usersCount",
            formatNumber(
                DASHBOARD_DATA.statistics.users
            )
        );


        setText(
            "usersGrowth",
            DASHBOARD_DATA.statistics.usersGrowth
        );


        setText(
            "depositsCount",
            DASHBOARD_DATA.statistics.deposits
        );


        setText(
            "depositsGrowth",
            DASHBOARD_DATA.statistics.depositsGrowth
        );


        setText(
            "transactionsCount",
            formatNumber(
                DASHBOARD_DATA.statistics.transactions
            )
        );


        setText(
            "transactionsMeta",
            DASHBOARD_DATA.statistics.transactionsMeta
        );


        setText(
            "systemStatus",
            DASHBOARD_DATA.statistics.systemStatus
        );
    }


    /*
    =====================================================
    ACTIVITIES
    =====================================================
    */

    function renderActivities() {

        const container =
            document.getElementById(
                "activityList"
            );


        if (!container) {
            return;
        }


        const activities =
            DASHBOARD_DATA.activities;


        if (!activities.length) {

            container.innerHTML = createEmptyState(
                "لا توجد نشاطات",
                "لم يتم تسجيل أي نشاطات حديثة."
            );

            return;
        }


        container.innerHTML =
            activities
                .map(createActivityHTML)
                .join("");
    }


    /*
    =====================================================
    ACTIVITY HTML
    =====================================================
    */

    function createActivityHTML(activity) {

        const icon =
            getActivityIcon(
                activity.type
            );


        const statusClass =
            getActivityStatusClass(
                activity.status
            );


        const statusLabel =
            getActivityStatusLabel(
                activity.status
            );


        return `
            <div
                class="dashboard-activity"
                data-activity-id="${escapeHTML(activity.id)}"
                style="
                    display:flex;
                    align-items:flex-start;
                    gap:12px;
                    padding:14px 0;
                    border-bottom:1px solid var(--va-border);
                "
            >

                <div
                    class="dashboard-activity-icon"
                    style="
                        width:38px;
                        height:38px;
                        flex:0 0 38px;
                        display:grid;
                        place-items:center;
                        border-radius:10px;
                        background:rgba(212,175,55,.08);
                        color:var(--va-gold-light);
                        font-size:15px;
                    "
                    aria-hidden="true"
                >
                    ${icon}
                </div>


                <div
                    style="
                        min-width:0;
                        flex:1;
                    "
                >

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            gap:10px;
                        "
                    >

                        <strong
                            style="
                                color:var(--va-text);
                                font-size:12px;
                                font-weight:700;
                            "
                        >
                            ${escapeHTML(activity.title)}
                        </strong>


                        <span
                            style="
                                color:var(--va-text-muted);
                                font-size:9px;
                                white-space:nowrap;
                            "
                        >
                            ${escapeHTML(activity.time)}
                        </span>

                    </div>


                    <p
                        style="
                            margin:4px 0 0;
                            color:var(--va-text-muted);
                            font-size:10px;
                            line-height:1.7;
                        "
                    >
                        ${escapeHTML(activity.description)}
                    </p>


                    <span
                        class="admin-status ${statusClass}"
                        style="
                            display:inline-flex;
                            margin-top:7px;
                        "
                    >
                        ${escapeHTML(statusLabel)}
                    </span>

                </div>

            </div>
        `;
    }


    /*
    =====================================================
    ACTIVITY ICONS
    =====================================================
    */

    function getActivityIcon(type) {

        const icons = {

            deposit: "＋",

            withdrawal: "−",

            user: "♙",

            verification: "✓",

            trade: "↔",

            default: "•"

        };


        return icons[type] || icons.default;
    }


    /*
    =====================================================
    ACTIVITY STATUS
    =====================================================
    */

    function getActivityStatusClass(status) {

        const classes = {

            success: "admin-status-success",

            warning: "admin-status-warning",

            danger: "admin-status-danger",

            info: "admin-status-info"

        };


        return classes[status] || "admin-status-info";
    }


    function getActivityStatusLabel(status) {

        const labels = {

            success: "مكتمل",

            warning: "مراجعة مطلوبة",

            danger: "مشكلة",

            info: "معلومات"

        };


        return labels[status] || "معلومات";
    }


    /*
    =====================================================
    PENDING DEPOSITS
    =====================================================
    */

    function renderPendingDeposits() {

        const element =
            document.getElementById(
                "pendingDepositsCount"
            );


        if (!element) {
            return;
        }


        const count =
            Number(
                DASHBOARD_DATA.pendingDeposits
            ) || 0;


        element.textContent =
            formatNumber(count);


        element.hidden =
            count <= 0;
    }


    /*
    =====================================================
    NOTIFICATIONS
    =====================================================
    */

    function renderNotifications() {

        const element =
            document.getElementById(
                "notificationCount"
            );


        if (!element) {
            return;
        }


        const count =
            Number(
                DASHBOARD_DATA.notifications
            ) || 0;


        element.textContent =
            formatNumber(count);


        /*
        إذا كان العنصر يدعم hidden،
        نخفيه عندما لا توجد إشعارات.
        */

        if ("hidden" in element) {
            element.hidden = count <= 0;
        }
    }


    /*
    =====================================================
    SERVICES STATUS
    =====================================================
    */

    function updateServicesStatus() {

        updateService(
            "databaseStatus",
            DASHBOARD_DATA.services.database
        );


        updateService(
            "apiStatus",
            DASHBOARD_DATA.services.api
        );


        updateService(
            "storageStatus",
            DASHBOARD_DATA.services.storage
        );
    }


    function updateService(
        elementId,
        service
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (!element) {
            return;
        }


        element.textContent =
            service.label;


        element.classList.remove(
            "admin-status-success",
            "admin-status-warning",
            "admin-status-danger",
            "admin-status-info"
        );


        const statusClass =
            getServiceStatusClass(
                service.status
            );


        element.classList.add(
            statusClass
        );
    }


    function getServiceStatusClass(status) {

        const classes = {

            operational:
                "admin-status-success",

            warning:
                "admin-status-warning",

            down:
                "admin-status-danger",

            info:
                "admin-status-info"

        };


        return classes[status] ||
            "admin-status-info";
    }


    /*
    =====================================================
    REFRESH BUTTON
    =====================================================
    */

    function setupRefreshButton() {

        const button =
            document.getElementById(
                "refreshDashboard"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                if (
                    button.dataset.refreshing ===
                    "true"
                ) {
                    return;
                }


                button.dataset.refreshing =
                    "true";


                const originalHTML =
                    button.innerHTML;


                button.disabled = true;


                button.innerHTML = `
                    <span
                        aria-hidden="true"
                        style="display:inline-block;"
                    >
                        ↻
                    </span>
                    جارٍ التحديث...
                `;


                /*
                Demo mode:
                لا يوجد API حاليًا،
                لذلك نعيد رسم البيانات فقط.
                */

                window.setTimeout(
                    function () {

                        renderDashboard();


                        button.innerHTML =
                            originalHTML;


                        button.disabled =
                            false;


                        button.dataset.refreshing =
                            "false";

                    },
                    350
                );
            }
        );
    }


    /*
    =====================================================
    VIEW ALL ACTIVITY
    =====================================================
    */

    function setupActivityButton() {

        const button =
            document.getElementById(
                "viewAllActivity"
            );


        const container =
            document.getElementById(
                "activityList"
            );


        if (!button || !container) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                container.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );
    }


    /*
    =====================================================
    EMPTY STATE
    =====================================================
    */

    function createEmptyState(
        title,
        description
    ) {

        return `
            <div class="admin-empty">

                <div
                    class="admin-empty-icon"
                    aria-hidden="true"
                >
                    ◌
                </div>

                <h3 class="admin-empty-title">
                    ${escapeHTML(title)}
                </h3>

                <p class="admin-empty-description">
                    ${escapeHTML(description)}
                </p>

            </div>
        `;
    }


    /*
    =====================================================
    DOM HELPERS
    =====================================================
    */

    function setText(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (!element) {
            return;
        }


        element.textContent =
            value ?? "";
    }


    function formatNumber(value) {

        const number =
            Number(value);


        if (!Number.isFinite(number)) {
            return "0";
        }


        return new Intl.NumberFormat(
            "en-US"
        ).format(number);
    }


    /*
    =====================================================
    SECURITY
    =====================================================
    */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


})();
