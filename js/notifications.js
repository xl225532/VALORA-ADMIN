/* =========================================================
   VALORA ADMIN — NOTIFICATIONS
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STATE
    ===================================================== */

    const notificationState = {

        users: [],

        history: []

    };


    /* =====================================================
       INIT
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initNotifications
    );


    function initNotifications() {

        loadUsers();

        setupTargetSelector();

        setupCharacterCounter();

        setupPreview();

        setupClearButton();

        setupSendButton();

        loadHistory();

        renderUsers();

    }


    /* =====================================================
       DEMO USERS
       ===================================================== */

    function loadUsers() {

        /*
         * هذه بيانات مؤقتة للاختبار فقط.
         * لاحقًا سيتم استبدالها ببيانات API.
         */

        notificationState.users = [

            {
                id: "1001",
                name: "أحمد محمد",
                email: "ahmed@test.com",
                balance: 500,
                deposits: 1000
            },

            {
                id: "1002",
                name: "مستخدم تجريبي",
                email: "user@example.com",
                balance: 0,
                deposits: 0
            }

        ];

    }


    /* =====================================================
       TARGET SELECTOR
    ===================================================== */

    function setupTargetSelector() {

        const target =
            document.getElementById(
                "notificationTarget"
            );


        if (!target) {
            return;
        }


        target.addEventListener(
            "change",
            function () {

                renderUsers();

                hideResult();

            }
        );

    }


    /* =====================================================
       RENDER USERS
    ===================================================== */

    function renderUsers() {

        const field =
            document.getElementById(
                "selectedUsersField"
            );


        if (!field) {
            return;
        }


        const target =
            document.getElementById(
                "notificationTarget"
            );


        if (!target) {
            return;
        }


        /*
         * إخفاء جدول المستخدمين إذا لم يتم اختيار
         * التحديد اليدوي.
         */

        if (target.value !== "selected") {

            field.hidden = true;

            return;

        }


        field.hidden = false;


        /*
         * البحث عن صندوق المستخدمين.
         */

        let box =
            field.querySelector(
                ".notification-users-box"
            );


        if (!box) {

            box =
                document.createElement(
                    "div"
                );

            box.className =
                "notification-users-box";

            field.appendChild(box);

        }


        /*
         * تنظيف المحتوى القديم.
         */

        box.innerHTML = "";


        /*
         * عنوان تحديد الكل.
         */

        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "notification-users-controls";


        controls.innerHTML = `

            <label class="notification-select-all">

                <input
                    type="checkbox"
                    id="selectAllNotificationUsers"
                >

                <span>
                    تحديد جميع المستخدمين
                </span>

            </label>

            <span
                class="notification-selected-count"
                id="notificationSelectedCount"
            >
                0 مستخدم محدد
            </span>

        `;


        box.appendChild(controls);


        /*
         * قائمة المستخدمين.
         */

        const list =
            document.createElement(
                "div"
            );

        list.className =
            "notification-users-list";


        box.appendChild(list);


        /*
         * إذا لم توجد بيانات.
         */

        if (
            notificationState.users.length === 0
        ) {

            list.innerHTML = `

                <div class="notification-users-empty">

                    لا يوجد مستخدمون متاحون حاليًا.

                </div>

            `;

            return;

        }


        /*
         * إنشاء صف لكل مستخدم.
         */

        notificationState.users.forEach(
            function (user) {

                const label =
                    document.createElement(
                        "label"
                    );

                label.className =
                    "notification-user-option";


                label.innerHTML = `

                    <input
                        type="checkbox"
                        name="notificationUsers"
                        value="${escapeHTML(user.id)}"
                    >

                    <span>

                        <strong>
                            ${escapeHTML(user.name)}
                        </strong>

                        <small>
                            ${escapeHTML(user.email)}
                            — #${escapeHTML(user.id)}
                        </small>

                    </span>

                `;


                list.appendChild(label);

            }
        );


        setupUserSelection();

    }


    /* =====================================================
       USER SELECTION
    ===================================================== */

    function setupUserSelection() {

        const selectAll =
            document.getElementById(
                "selectAllNotificationUsers"
            );


        const checkboxes =
            document.querySelectorAll(
                'input[name="notificationUsers"]'
            );


        if (selectAll) {

            selectAll.addEventListener(
                "change",
                function () {

                    checkboxes.forEach(
                        function (checkbox) {

                            checkbox.checked =
                                selectAll.checked;

                        }
                    );


                    updateSelectedCount();

                }
            );

        }


        checkboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        updateSelectAllState();

                        updateSelectedCount();

                    }
                );

            }
        );


        updateSelectedCount();

    }


    /* =====================================================
       UPDATE SELECT ALL
    ===================================================== */

    function updateSelectAllState() {

        const selectAll =
            document.getElementById(
                "selectAllNotificationUsers"
            );


        const checkboxes =
            document.querySelectorAll(
                'input[name="notificationUsers"]'
            );


        if (
            !selectAll ||
            checkboxes.length === 0
        ) {
            return;
        }


        const checked =
            document.querySelectorAll(
                'input[name="notificationUsers"]:checked'
            );


        selectAll.checked =
            checked.length === checkboxes.length;

    }


    /* =====================================================
       SELECTED COUNT
    ===================================================== */

    function updateSelectedCount() {

        const countElement =
            document.getElementById(
                "notificationSelectedCount"
            );


        if (!countElement) {
            return;
        }


        const count =
            document.querySelectorAll(
                'input[name="notificationUsers"]:checked'
            ).length;


        countElement.textContent =
            count + " مستخدم محدد";

    }


    /* =====================================================
       CHARACTER COUNTER
    ===================================================== */

    function setupCharacterCounter() {

        const textarea =
            document.getElementById(
                "notificationMessage"
            );


        const counter =
            document.getElementById(
                "notificationCharacterCount"
            );


        if (
            !textarea ||
            !counter
        ) {
            return;
        }


        function updateCounter() {

            counter.textContent =
                textarea.value.length;

        }


        textarea.addEventListener(
            "input",
            updateCounter
        );


        updateCounter();

    }


    /* =====================================================
       LIVE PREVIEW
    ===================================================== */

    function setupPreview() {

        const titleInput =
            document.getElementById(
                "notificationTitle"
            );


        const messageInput =
            document.getElementById(
                "notificationMessage"
            );


        const previewTitle =
            document.getElementById(
                "previewTitle"
            );


        const previewMessage =
            document.getElementById(
                "previewMessage"
            );


        if (titleInput) {

            titleInput.addEventListener(
                "input",
                function () {

                    if (!previewTitle) {
                        return;
                    }


                    previewTitle.textContent =
                        titleInput.value.trim()
                        ||
                        "عنوان الإشعار";

                }
            );

        }


        if (messageInput) {

            messageInput.addEventListener(
                "input",
                function () {

                    if (!previewMessage) {
                        return;
                    }


                    previewMessage.textContent =
                        messageInput.value.trim()
                        ||
                        "سيظهر نص الإشعار هنا.";

                }
            );

        }

    }


    /* =====================================================
       CLEAR
    ===================================================== */

    function setupClearButton() {

        const button =
            document.getElementById(
                "clearNotification"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                clearNotificationForm();

                showResult(
                    "تم مسح بيانات الإشعار.",
                    "success"
                );

            }
        );

    }


    function clearNotificationForm() {

        const title =
            document.getElementById(
                "notificationTitle"
            );


        const message =
            document.getElementById(
                "notificationMessage"
            );


        if (title) {
            title.value = "";
        }


        if (message) {
            message.value = "";
        }


        const checkboxes =
            document.querySelectorAll(
                'input[name="notificationUsers"]'
            );


        checkboxes.forEach(
            function (checkbox) {

                checkbox.checked = false;

            }
        );


        const selectAll =
            document.getElementById(
                "selectAllNotificationUsers"
            );


        if (selectAll) {
            selectAll.checked = false;
        }


        updateSelectedCount();


        const counter =
            document.getElementById(
                "notificationCharacterCount"
            );


        if (counter) {
            counter.textContent = "0";
        }


        const previewTitle =
            document.getElementById(
                "previewTitle"
            );


        const previewMessage =
            document.getElementById(
                "previewMessage"
            );


        if (previewTitle) {
            previewTitle.textContent =
                "عنوان الإشعار";
        }


        if (previewMessage) {
            previewMessage.textContent =
                "سيظهر نص الإشعار هنا.";
        }

    }


    /* =====================================================
       SEND
    ===================================================== */

    function setupSendButton() {

        const button =
            document.getElementById(
                "sendNotification"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            sendNotification
        );

    }


    function sendNotification() {

        const target =
            document.getElementById(
                "notificationTarget"
            );


        const title =
            document.getElementById(
                "notificationTitle"
            );


        const message =
            document.getElementById(
                "notificationMessage"
            );


        if (
            !target ||
            !title ||
            !message
        ) {
            return;
        }


        const titleValue =
            title.value.trim();


        const messageValue =
            message.value.trim();


        /*
         * التحقق من العنوان.
         */

        if (!titleValue) {

            showResult(
                "يرجى كتابة عنوان الإشعار.",
                "error"
            );

            title.focus();

            return;

        }


        /*
         * التحقق من الرسالة.
         */

        if (!messageValue) {

            showResult(
                "يرجى كتابة نص الإشعار.",
                "error"
            );

            message.focus();

            return;

        }


        /*
         * المستخدمون المحددون يدويًا.
         */

        let selectedUsers = [];


        if (
            target.value === "selected"
        ) {

            const checked =
                document.querySelectorAll(
                    'input[name="notificationUsers"]:checked'
                );


            checked.forEach(
                function (checkbox) {

                    selectedUsers.push(
                        checkbox.value
                    );

                }
            );


            if (
                selectedUsers.length === 0
            ) {

                showResult(
                    "يرجى اختيار مستخدم واحد على الأقل.",
                    "error"
                );

                return;

            }

        }


        /*
         * تحديد عدد المستلمين.
         */

        let recipientCount = 0;


        if (
            target.value === "all"
        ) {

            recipientCount =
                notificationState.users.length;

        }


        if (
            target.value === "deposited"
        ) {

            recipientCount =
                notificationState.users.filter(
                    function (user) {

                        return Number(
                            user.deposits || 0
                        ) > 0;

                    }
                ).length;

        }


        if (
            target.value === "no-deposit"
        ) {

            recipientCount =
                notificationState.users.filter(
                    function (user) {

                        return Number(
                            user.deposits || 0
                        ) <= 0;

                    }
                ).length;

        }


        if (
            target.value === "selected"
        ) {

            recipientCount =
                selectedUsers.length;

        }


        /*
         * إنشاء سجل الإشعار.
         */

        const notification = {

            id:
                Date.now(),

            title:
                titleValue,

            message:
                messageValue,

            target:
                getTargetLabel(
                    target.value
                ),

            recipientCount:
                recipientCount,

            date:
                new Date().toLocaleString(
                    "ar"
                )

        };


        notificationState.history.unshift(
            notification
        );


        saveHistory();


        renderHistory();


        showResult(
            "تم إرسال الإشعار بنجاح إلى " +
            recipientCount +
            " مستخدم.",
            "success"
        );

    }


    /* =====================================================
       TARGET LABEL
    ===================================================== */

    function getTargetLabel(
        value
    ) {

        switch (value) {

            case "all":

                return "جميع المستخدمين";


            case "deposited":

                return "لديهم إيداع";


            case "no-deposit":

                return "ليس لديهم إيداع";


            case "selected":

                return "مستخدمون محددون";


            default:

                return "غير محدد";

        }

    }


    /* =====================================================
       RESULT MESSAGE
    ===================================================== */

    function showResult(
        message,
        type
    ) {

        const result =
            document.getElementById(
                "notificationResult"
            );


        if (!result) {
            return;
        }


        result.hidden = false;


        result.className =
            "notification-result " +
            (
                type === "error"
                    ? "error"
                    : "success"
            );


        result.textContent =
            message;

    }


    function hideResult() {

        const result =
            document.getElementById(
                "notificationResult"
            );


        if (!result) {
            return;
        }


        result.hidden = true;

    }


    /* =====================================================
       HISTORY
    ===================================================== */

    function saveHistory() {

        try {

            localStorage.setItem(
                "valora_notification_history",
                JSON.stringify(
                    notificationState.history
                )
            );

        } catch (error) {

            console.warn(
                "تعذر حفظ سجل الإشعارات",
                error
            );

        }

    }


    function loadHistory() {

        try {

            const saved =
                localStorage.getItem(
                    "valora_notification_history"
                );


            if (!saved) {

                notificationState.history = [];

                renderHistory();

                return;

            }


            const data =
                JSON.parse(saved);


            if (
                Array.isArray(data)
            ) {

                notificationState.history =
                    data;

            } else {

                notificationState.history =
                    [];

            }

        } catch (error) {

            notificationState.history = [];

        }


        renderHistory();

    }


    /* =====================================================
       RENDER HISTORY
    ===================================================== */

    function renderHistory() {

        const container =
            document.getElementById(
                "notificationHistory"
            );


        if (!container) {
            return;
        }


        if (
            notificationState.history.length === 0
        ) {

            container.innerHTML = `

                <div class="notification-history-empty">

                    <div class="notification-history-icon">
                        ◉
                    </div>

                    <h3>
                        لا توجد إشعارات مرسلة
                    </h3>

                    <p>
                        ستظهر الإشعارات التي يتم إرسالها هنا.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        notificationState.history.forEach(
            function (item) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "notification-history-item";


                card.innerHTML = `

                    <div class="notification-history-main">

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        <p>
                            ${escapeHTML(item.message)}
                        </p>

                    </div>

                    <div class="notification-history-meta">

                        <span>
                            ${escapeHTML(item.target)}
                        </span>

                        <span>
                            ${escapeHTML(
                                String(item.recipientCount)
                            )}
                            مستخدم
                        </span>

                        <small>
                            ${escapeHTML(item.date)}
                        </small>

                    </div>

                `;


                container.appendChild(card);

            }
        );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

    }


})();
