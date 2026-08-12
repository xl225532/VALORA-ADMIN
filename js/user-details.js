/* =========================================================
   VALORA ADMIN
   USER DETAILS
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const API_BASE_URL = "";

    const USER_API_ENDPOINT = "/api/users";


    /* =====================================================
       HELPERS
    ===================================================== */

    function getUserId() {

        const params = new URLSearchParams(window.location.search);

        return (
            params.get("id") ||
            params.get("userId") ||
            params.get("user_id")
        );

    }


    function getElement(id) {

        return document.getElementById(id);

    }


    function setText(id, value) {

        const element = getElement(id);

        if (!element) {
            return;
        }

        element.textContent =
            value !== undefined &&
            value !== null &&
            value !== ""
                ? value
                : "—";

    }


    function escapeHtml(value) {

        if (value === undefined || value === null) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function formatNumber(value) {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        return new Intl.NumberFormat("ar-SA", {
            maximumFractionDigits: 2
        }).format(number);

    }


    function formatCurrency(value, currency = "USD") {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        try {

            return new Intl.NumberFormat("ar-SA", {
                style: "currency",
                currency: currency,
                maximumFractionDigits: 2
            }).format(number);

        } catch (error) {

            return formatNumber(number) + " " + currency;

        }

    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("ar-SA", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function getStatusText(status) {

        const statuses = {

            active: "نشط",

            pending: "بانتظار التحقق",

            suspended: "موقوف",

            blocked: "محظور",

            inactive: "غير نشط",

            verified: "موثق",

            unverified: "غير موثق"

        };

        return statuses[status] || status || "—";

    }


    function getVerificationText(value) {

        if (
            value === true ||
            value === 1 ||
            value === "true" ||
            value === "verified"
        ) {
            return "موثق";
        }

        if (
            value === false ||
            value === 0 ||
            value === "false" ||
            value === "unverified"
        ) {
            return "غير موثق";
        }

        return value || "—";

    }


    /* =====================================================
       PROFILE
    ===================================================== */

    function renderUser(user) {

        if (!user) {
            return;
        }


        const fullName =
            user.fullName ||
            user.name ||
            (
                user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "—"
            );


        const email =
            user.email ||
            user.emailAddress ||
            "—";


        const id =
            user.id ||
            user.userId ||
            user._id ||
            "—";


        const avatar =
            user.avatar ||
            user.image ||
            user.profileImage ||
            "";


        /* =================================================
           PROFILE IDENTITY
        ================================================= */

        setText("userName", fullName);

        setText("userEmail", email);

        setText("userId", id);

        setText("detailFullName", fullName);

        setText("detailEmail", email);

        setText("detailUserId", id);


        /* =================================================
           AVATAR
        ================================================= */

        const avatarElement =
            getElement("userAvatar");

        if (avatarElement) {

            if (avatar) {

                avatarElement.innerHTML =
                    `<img src="${escapeHtml(avatar)}" alt="">`;

            } else {

                avatarElement.textContent =
                    fullName !== "—"
                        ? fullName.charAt(0).toUpperCase()
                        : "—";

            }

        }


        /* =================================================
           STATUS
        ================================================= */

        const statusElement =
            getElement("userStatus");

        if (statusElement) {

            const status =
                user.status ||
                user.accountStatus ||
                "—";

            statusElement.textContent =
                getStatusText(status);

            statusElement.dataset.status =
                status;

        }


        /* =================================================
           BALANCE
        ================================================= */

        const currency =
            user.currency ||
            user.balanceCurrency ||
            "USD";


        setText(
            "userBalance",
            formatCurrency(
                user.balance,
                currency
            )
        );


        setText(
            "userDeposits",
            formatCurrency(
                user.totalDeposits ??
                user.deposits,
                currency
            )
        );


        setText(
            "userWithdrawals",
            formatCurrency(
                user.totalWithdrawals ??
                user.withdrawals,
                currency
            )
        );


        setText(
            "userTransactions",
            formatNumber(
                user.transactionCount ??
                user.transactionsCount ??
                user.transactions?.length
            )
        );


        /* =================================================
           ACCOUNT INFORMATION
        ================================================= */

        setText(
            "detailCreatedAt",
            formatDate(
                user.createdAt ||
                user.registeredAt ||
                user.registrationDate
            )
        );


        setText(
            "detailLastActivity",
            formatDate(
                user.lastActivity ||
                user.lastActiveAt ||
                user.updatedAt
            )
        );


        setText(
            "detailVerification",
            getVerificationText(
                user.verified ??
                user.isVerified ??
                user.verificationStatus
            )
        );


        /* =================================================
           SECURITY
        ================================================= */

        setText(
            "emailVerified",
            getVerificationText(
                user.emailVerified ??
                user.isEmailVerified
            )
        );


        setText(
            "twoFactorStatus",
            (
                user.twoFactorEnabled ??
                user.isTwoFactorEnabled
            )
                ? "مفعّل"
                : "غير مفعّل"
        );


        setText(
            "lastLogin",
            formatDate(
                user.lastLogin ||
                user.lastLoginAt
            )
        );


        setText(
            "lastIp",
            user.lastIp ||
            user.lastIP ||
            user.lastLoginIp ||
            "—"
        );


        /* =================================================
           TRANSACTIONS
        ================================================= */

        renderTransactions(
            user.transactions ||
            user.recentTransactions ||
            []
        );


        /* =================================================
           ACTIVITY
        ================================================= */

        renderActivity(
            user.activities ||
            user.activity ||
            user.activityLog ||
            []
        );

    }


    /* =====================================================
       TRANSACTIONS
    ===================================================== */

    function renderTransactions(transactions) {

        const body =
            getElement("userTransactionsBody");

        const empty =
            getElement("userTransactionsEmpty");


        if (!body) {
            return;
        }


        body.innerHTML = "";


        if (
            !Array.isArray(transactions) ||
            transactions.length === 0
        ) {

            if (empty) {
                empty.style.display = "";
            }

            return;

        }


        if (empty) {
            empty.style.display = "none";
        }


        transactions.forEach(function (transaction) {

            const row =
                document.createElement("tr");


            const type =
                transaction.type ||
                transaction.operation ||
                transaction.transactionType ||
                "—";


            const amount =
                transaction.amount ??
                transaction.value;


            const status =
                transaction.status ||
                "—";


            const date =
                transaction.createdAt ||
                transaction.date ||
                transaction.timestamp;


            const transactionId =
                transaction.id ||
                transaction.transactionId ||
                transaction._id ||
                "—";


            const currency =
                transaction.currency ||
                "USD";


            row.innerHTML = `

                <td>
                    ${escapeHtml(type)}
                </td>

                <td dir="ltr">
                    ${escapeHtml(
                        formatCurrency(
                            amount,
                            currency
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        getStatusText(status)
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formatDate(date)
                    )}
                </td>

                <td dir="ltr">
                    ${escapeHtml(
                        transactionId
                    )}
                </td>

            `;


            body.appendChild(row);

        });

    }


    /* =====================================================
       ACTIVITY
    ===================================================== */

    function renderActivity(activities) {

        const container =
            getElement("userActivityList");


        if (!container) {
            return;
        }


        if (
            !Array.isArray(activities) ||
            activities.length === 0
        ) {

            return;

        }


        container.innerHTML = "";


        activities.forEach(function (activity) {

            const item =
                document.createElement("div");

            item.className =
                "user-details-activity-item";


            const title =
                activity.title ||
                activity.action ||
                activity.type ||
                "نشاط";


            const description =
                activity.description ||
                activity.details ||
                "";


            const date =
                activity.createdAt ||
                activity.date ||
                activity.timestamp;


            item.innerHTML = `

                <div
                    class="user-details-activity-content"
                >

                    <strong>
                        ${escapeHtml(title)}
                    </strong>

                    ${
                        description
                            ? `
                                <p>
                                    ${escapeHtml(description)}
                                </p>
                              `
                            : ""
                    }

                </div>

                <time>
                    ${escapeHtml(
                        formatDate(date)
                    )}
                </time>

            `;


            container.appendChild(item);

        });

    }


    /* =====================================================
       API
    ===================================================== */

    async function loadUser() {

        const userId =
            getUserId();


        if (!userId) {

            showError(
                "لم يتم تحديد رقم المستخدم."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}${USER_API_ENDPOINT}/${encodeURIComponent(userId)}`,
                    {
                        method: "GET",
                        headers: {
                            "Accept": "application/json"
                        },
                        credentials: "include"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            const user =
                data.user ||
                data.data ||
                data;


            renderUser(user);


        } catch (error) {

            console.error(
                "User details error:",
                error
            );


            showError(
                "تعذر تحميل بيانات المستخدم."
            );

        }

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function showError(message) {

        const elements = [

            "userName",
            "userEmail",
            "userId",
            "userBalance",
            "userDeposits",
            "userWithdrawals",
            "userTransactions"

        ];


        elements.forEach(function (id) {

            setText(id, "—");

        });


        const name =
            getElement("userName");

        if (name) {
            name.textContent = message;
        }

    }


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    function setupBackButton() {

        const buttons =
            document.querySelectorAll(
                'a[href="users.html"]'
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (
                        window.history.length > 1
                    ) {

                        // نترك الرابط يعمل بشكل طبيعي
                        // ولا نمنع الانتقال.

                    }

                }
            );

        });

    }


    /* =====================================================
       INIT
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            setupBackButton();

            loadUser();

        }
    );


})();
