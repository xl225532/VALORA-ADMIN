(function () {
    "use strict";

    /*
    =========================================================
    VALORA ADMIN — DASHBOARD
    =========================================================

    المرحلة الحالية:
    - واجهة الإدارة فقط.
    - لا توجد قاعدة بيانات مرتبطة بعد.
    - لا يتم إنشاء أو عرض أي بيانات وهمية.
    - الخانات تبقى فارغة حتى يتم الربط الحقيقي.

    لاحقًا:
    سيتم استبدال القيم الفارغة ببيانات API / Database حقيقية.
    =========================================================
    */


    document.addEventListener(
        "DOMContentLoaded",
        initDashboard
    );


    function initDashboard() {

        /*
        لا نضع أي بيانات تجريبية هنا.

        الصفحة نفسها تحتوي على القيم الافتراضية:
        —
        جاري الفحص
        لا توجد بيانات

        وعند الربط مع قاعدة البيانات سنقوم بتحديثها
        من المصدر الحقيقي.
        */

        clearDashboardData();

        setupRefreshButton();

        setupActivityButton();
    }


    /*
    =========================================================
    CLEAR DASHBOARD
    =========================================================
    */

    function clearDashboardData() {

        /*
        الإحصائيات
        */

        setText("usersCount", "—");
        setText("usersGrowth", "—");

        setText("depositsCount", "—");
        setText("depositsGrowth", "—");

        setText("transactionsCount", "—");
        setText("transactionsMeta", "—");

        setText("systemStatus", "—");


        /*
        الخدمات

        لا نقول "متصل" أو "غير متصل"
        لأننا لم نربط قاعدة البيانات/API بعد.
        */

        setText(
            "databaseStatus",
            "غير مرتبط"
        );

        setText(
            "apiStatus",
            "غير مرتبط"
        );

        setText(
            "storageStatus",
            "غير مرتبط"
        );


        updateStatusClasses();


        /*
        الإشعارات

        لا يوجد مصدر حقيقي بعد.
        لذلك لا نعرض رقمًا.
        */

        clearNotificationCount();


        /*
        الإيداعات المعلقة

        لا يوجد مصدر حقيقي بعد.
        لذلك نخفي العداد.
        */

        clearPendingDeposits();


        /*
        النشاطات

        لا نضع نشاطات وهمية.
        */

        renderEmptyActivities();
    }


    /*
    =========================================================
    EMPTY ACTIVITIES
    =========================================================
    */

    function renderEmptyActivities() {

        const container =
            document.getElementById(
                "activityList"
            );


        if (!container) {
            return;
        }


        container.innerHTML = `
            <div class="admin-empty">

                <div
                    class="admin-empty-icon"
                    aria-hidden="true"
                >
                    ◌
                </div>

                <h3 class="admin-empty-title">
                    لا توجد بيانات بعد
                </h3>

                <p class="admin-empty-description">
                    ستظهر آخر النشاطات هنا بعد ربط لوحة التحكم بقاعدة البيانات.
                </p>

            </div>
        `;
    }


    /*
    =========================================================
    STATUS
    =========================================================
    */

    function updateStatusClasses() {

        const statusIds = [
            "databaseStatus",
            "apiStatus",
            "storageStatus"
        ];


        statusIds.forEach(function (id) {

            const element =
                document.getElementById(id);


            if (!element) {
                return;
            }


            element.classList.remove(
                "admin-status-success",
                "admin-status-warning",
                "admin-status-danger",
                "admin-status-info"
            );


            element.classList.add(
                "admin-status-info"
            );
        });
    }


    /*
    =========================================================
    NOTIFICATIONS
    =========================================================
    */

    function clearNotificationCount() {

        const element =
            document.getElementById(
                "notificationCount"
            );


        if (!element) {
            return;
        }


        element.textContent = "";

        element.hidden = true;
    }


    /*
    =========================================================
    PENDING DEPOSITS
    =========================================================
    */

    function clearPendingDeposits() {

        const element =
            document.getElementById(
                "pendingDepositsCount"
            );


        if (!element) {
            return;
        }


        element.textContent = "";

        element.hidden = true;
    }


    /*
    =========================================================
    REFRESH
    =========================================================

    حاليًا زر التحديث لا يجلب بيانات،
    لأنه لا يوجد API متصل بعد.

    عندما نصل لمرحلة الربط:
    سيتم وضع fetch / API هنا.
    =========================================================
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

                /*
                لا نقوم بتوليد بيانات وهمية.
                فقط نعيد الحالة الفارغة الحالية.
                */

                clearDashboardData();
            }
        );
    }


    /*
    =========================================================
    VIEW ALL ACTIVITY
    =========================================================
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
    =========================================================
    HELPER
    =========================================================
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

})();
