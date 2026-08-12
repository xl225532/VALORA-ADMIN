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
        نتأكد أن الصفحة هي Dashboard
        */

        if (
            !document.getElementById("usersCount")
        ) {
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
                           
