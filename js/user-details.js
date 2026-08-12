/* =========================================================
   VALORA ADMIN — USER DETAILS
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

// غيّر هذا المسار فقط إذا كان API المستخدمين لديك في مسار مختلف.
const USER_DETAILS_API = "/api/users";


/* =========================================================
   HELPERS
========================================================= */

function getUserId() {
    const params = new URLSearchParams(window.location.search);

    return (
        params.get("id") ||
        params.get("userId") ||
        params.get("user_id")
    );
}


function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent =
        value === null ||
        value === undefined ||
        value === ""
            ? "—"
            : String(value);
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


function getInitials(name) {
    if (!name) {
        return "—";
    }

    const words = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (!words.length) {
        return "—";
    }

    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}


/* =========================================================
   STATUS
========================================================= */

function setUserStatus(status) {
    const element = document.getElementById("userStatus");

    if (!element) return;

    const value = String(status || "")
        .toLowerCase()
        .trim();

    element.className = "user-status";

    if (
        value === "active" ||
        value === "enabled" ||
        value === "verified"
    ) {
        element.classList.add("success");
        element.textContent = "نشط";
        return;
    }

    if (
        value === "blocked" ||
        value === "banned" ||
        value === "disabled"
    ) {
        element.classList.add("danger");
        element.textContent = "محظور";
        return;
    }

    if (
        value === "pending" ||
        value === "pending_verification"
    ) {
        element.classList.add("warning");
        element.textContent = "قيد المراجعة";
        return;
    }

    element.classList.add("info");

    element.textContent =
        status || "غير معروف";
}


/* =========================================================
   BOOLEAN STATUS
========================================================= */

function formatBoolean(value) {
    if (
        value === true ||
        value === 1 ||
        value === "1" ||
        value === "true"
    ) {
        return "مفعّل";
    }

    if (
        value === false ||
        value === 0 ||
        value === "0" ||
        value === "false"
    ) {
        return "غير مفعّل";
    }

    return "—";
}


/* =========================================================
   RENDER USER
========================================================= */

function renderUser(user) {

    const name =
        user.name ||
        user.full_name ||
        user.fullName ||
        "—";

    const email =
        user.email ||
        "—";

    const id =
        user.id ||
        user.user_id ||
        user.userId ||
        "—";


    /* Profile */

    setText("userAvatar", getInitials(name));
    setText("userName", name);
    setText("userEmail", email);
    setText("userId", id);

    setUserStatus(
        user.status ||
        user.account_status
    );


    /* Statistics */

    setText(
        "userBalance",
        formatNumber(
            user.balance ??
            user.current_balance
        )
    );

    setText(
        "userDeposits",
        formatNumber(
            user.total_deposits ??
            user.deposits
        )
    );

    setText(
        "userWithdrawals",
        formatNumber(
            user.total_withdrawals ??
            user.withdrawals
        )
    );

    setText(
        "userTransactions",
        user.transaction_count ??
        user.transactions_count ??
        user.transactions?.length
    );


    /* Account information */

    setText(
        "detailFullName",
        name
    );

    setText(
        "detailEmail",
        email
    );

    setText(
        "detailUserId",
        id
    );

    setText(
        "detailCreatedAt",
        formatDate(
            user.created_at ||
            user.createdAt ||
            user.registration_date
        )
    );

    setText(
        "detailLastActivity",
        formatDate(
            user.last_activity ||
            user.lastActivity
        )
    );

    setText(
        "detailVerification",
        formatBoolean(
            user.verified ??
            user.is_verified ??
            user.email_verified
        )
    );


    /* Security */

    setText(
        "emailVerified",
        formatBoolean(
            user.email_verified ??
            user.emailVerified
        )
    );

    setText(
        "twoFactorStatus",
        formatBoolean(
            user.two_factor_enabled ??
            user.twoFactorEnabled ??
            user.two_factor
        )
    );

    setText(
        "lastLogin",
        formatDate(
            user.last_login ||
            user.lastLogin
        )
    );

    setText(
        "lastIp",
        user.last_ip ||
        user.lastIp
    );


    /* Transactions */

    renderTransactions(
        user.transactions ||
        user.recent_transactions ||
        []
    );


    /* Activity */

    renderActivity(
        user.activity ||
        user.activities ||
        []
    );
}


/* =========================================================
   TRANSACTIONS
========================================================= */

function renderTransactions(transactions) {

    const body =
        document.getElementById(
            "userTransactionsBody"
        );

    const empty =
        document.getElementById(
            "userTransactionsEmpty"
        );

    if (!body) return;

    body.innerHTML = "";

    if (
        !Array.isArray(transactions) ||
        transactions.length === 0
    ) {
        if (empty) {
            empty.style.display = "flex";
        }

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }


    transactions.forEach(transaction => {

        const row =
            document.createElement("tr");

        const type =
            transaction.type ||
            transaction.transaction_type ||
            "—";

        const amount =
            transaction.amount ?? "—";

        const status =
            transaction.status ||
            "—";

        const date =
            transaction.created_at ||
            transaction.date;

        const transactionId =
            transaction.id ||
            transaction.transaction_id ||
            "—";


        row.innerHTML = `
            <td>${escapeHtml(type)}</td>
            <td>${escapeHtml(formatNumber(amount))}</td>
            <td>${escapeHtml(status)}</td>
            <td>${escapeHtml(formatDate(date))}</td>
            <td dir="ltr">${escapeHtml(transactionId)}</td>
        `;

        body.appendChild(row);
    });
}


/* =========================================================
   ACTIVITY
========================================================= */

function renderActivity(activities) {

    const container =
        document.getElementById(
            "userActivityList"
        );

    if (!container) return;

    container.innerHTML = "";


    if (
        !Array.isArray(activities) ||
        activities.length === 0
    ) {

        container.innerHTML = `
            <div class="user-details-empty">

                <div
                    class="user-details-empty-icon"
                    aria-hidden="true"
                >
                    ◌
                </div>

                <h3>
                    لا توجد بيانات
                </h3>

                <p>
                    لا توجد أنشطة مسجلة لهذا المستخدم.
                </p>

            </div>
        `;

        return;
    }


    activities.forEach(activity => {

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
            "";

        const date =
            activity.created_at ||
            activity.date;


        item.innerHTML = `
            <div>
                <strong>
                    ${escapeHtml(title)}
                </strong>

                ${
                    description
                        ? `<p>${escapeHtml(description)}</p>`
                        : ""
                }
            </div>

            <time>
                ${escapeHtml(formatDate(date))}
            </time>
        `;

        container.appendChild(item);
    });
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   LOAD USER
========================================================= */

async function loadUserDetails() {

    const userId = getUserId();

    if (!userId) {
        console.error(
            "User ID is missing from the URL."
        );

        setText(
            "userName",
            "لم يتم تحديد المستخدم"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${USER_DETAILS_API}/${encodeURIComponent(userId)}`,
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


        const result =
            await response.json();


        /*
         * يدعم:
         * { user: {...} }
         * أو
         * { data: {...} }
         * أو
         * {...}
         */

        const user =
            result.user ||
            result.data ||
            result;


        if (!user || typeof user !== "object") {
            throw new Error(
                "Invalid user response."
            );
        }


        renderUser(user);

    } catch (error) {

        console.error(
            "Failed to load user details:",
            error
        );

        setText(
            "userName",
            "تعذر تحميل بيانات المستخدم"
        );

        setText(
            "userEmail",
            "تحقق من اتصال API"
        );
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadUserDetails();
    }
);
