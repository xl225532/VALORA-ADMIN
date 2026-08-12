/* =========================================================
   VALORA ADMIN
   USERS MANAGEMENT
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const API_BASE_URL = "";

    const USERS_ENDPOINT = "/api/users";

    const USER_DETAILS_PAGE = "user-details.html";

    const usersPerPage = 10;


    /* =====================================================
       STATE
    ===================================================== */

    let allUsers = [];

    let filteredUsers = [];

    let currentPage = 1;


    /* =====================================================
       DOM
    ===================================================== */

    const tableBody =
        document.getElementById("usersTableBody");

    const emptyState =
        document.getElementById("usersEmpty");

    const pagination =
        document.getElementById("usersPagination");

    const paginationInfo =
        document.getElementById("usersPaginationInfo");

    const paginationButtons =
        document.getElementById("usersPaginationButtons");

    const searchInput =
        document.getElementById("userSearch");

    const statusFilter =
        document.getElementById("userStatusFilter");

    const verificationFilter =
        document.getElementById("verificationFilter");

    const refreshButton =
        document.getElementById("refreshUsers");

    const totalUsersElement =
        document.getElementById("totalUsers");

    const activeUsersElement =
        document.getElementById("activeUsers");

    const pendingUsersElement =
        document.getElementById("pendingUsers");

    const suspendedUsersElement =
        document.getElementById("suspendedUsers");


    /* =====================================================
       HELPERS
    ===================================================== */

    function escapeHtml(value) {

        if (
            value === undefined ||
            value === null
        ) {
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


    function formatCurrency(
        value,
        currency = "USD"
    ) {

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

            return (
                formatNumber(number) +
                " " +
                currency
            );

        }

    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return escapeHtml(value);
        }

        return new Intl.DateTimeFormat(
            "ar-SA",
            {
                dateStyle: "medium"
            }
        ).format(date);

    }


    function getUserId(user) {

        return (
            user.id ??
            user.userId ??
            user._id ??
            user.uuid ??
            ""
        );

    }


    function getUserName(user) {

        return (
            user.name ??
            user.fullName ??
            user.username ??
            user.displayName ??
            "بدون اسم"
        );

    }


    function getUserEmail(user) {

        return (
            user.email ??
            ""
        );

    }


    function getUserStatus(user) {

        return String(
            user.status ??
            user.accountStatus ??
            "active"
        ).toLowerCase();

    }


    function getVerificationStatus(user) {

        if (
            user.verified === true ||
            user.isVerified === true ||
            user.emailVerified === true
        ) {
            return "verified";
        }

        return "unverified";

    }


    function getUserBalance(user) {

        return (
            user.balance ??
            user.currentBalance ??
            0
        );

    }


    function getCreatedAt(user) {

        return (
            user.createdAt ??
            user.created_at ??
            user.registrationDate ??
            user.created
        );

    }


    function getLastActivity(user) {

        return (
            user.lastActivity ??
            user.last_activity ??
            user.updatedAt ??
            user.updated_at
        );

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function getStatusLabel(status) {

        switch (status) {

            case "active":
                return "نشط";

            case "pending":
                return "بانتظار التحقق";

            case "suspended":
                return "موقوف";

            case "blocked":
                return "محظور";

            default:
                return status || "غير معروف";

        }

    }


    function getStatusClass(status) {

        switch (status) {

            case "active":
                return "success";

            case "pending":
                return "warning";

            case "suspended":
            case "blocked":
                return "danger";

            default:
                return "";

        }

    }


    function getVerificationLabel(status) {

        return status === "verified"
            ? "موثق"
            : "غير موثق";

    }


    /* =====================================================
       USER DETAILS URL
    ===================================================== */

    function getUserDetailsUrl(user) {

        const userId =
            getUserId(user);

        if (!userId) {
            return USER_DETAILS_PAGE;
        }

        return (
            USER_DETAILS_PAGE +
            "?id=" +
            encodeURIComponent(userId)
        );

    }


    /* =====================================================
       LOAD USERS
    ===================================================== */

    async function loadUsers() {

        setLoadingState(true);

        try {

            const response = await fetch(
                API_BASE_URL +
                USERS_ENDPOINT,
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
                    "HTTP " +
                    response.status
                );

            }

            const data =
                await response.json();


            if (Array.isArray(data)) {

                allUsers = data;

            } else if (
                Array.isArray(data.users)
            ) {

                allUsers = data.users;

            } else if (
                Array.isArray(data.data)
            ) {

                allUsers = data.data;

            } else {

                allUsers = [];

            }


            updateStatistics();

            applyFilters();

        } catch (error) {

            console.error(
                "Users loading error:",
                error
            );

            allUsers = [];

            updateStatistics();

            renderUsers();

            showEmptyState(
                "تعذر تحميل المستخدمين",
                "تأكد من اتصال مصدر البيانات ثم حاول تحديث الصفحة."
            );

        } finally {

            setLoadingState(false);

        }

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    function applyFilters() {

        const search =
            (
                searchInput?.value ||
                ""
            )
            .trim()
            .toLowerCase();

        const selectedStatus =
            statusFilter?.value ||
            "all";

        const selectedVerification =
            verificationFilter?.value ||
            "all";


        filteredUsers =
            allUsers.filter(function (user) {

                const id =
                    String(
                        getUserId(user)
                    ).toLowerCase();

                const name =
                    String(
                        getUserName(user)
                    ).toLowerCase();

                const email =
                    String(
                        getUserEmail(user)
                    ).toLowerCase();

                const status =
                    getUserStatus(user);

                const verification =
                    getVerificationStatus(user);


                const matchesSearch =
                    !search ||
                    name.includes(search) ||
                    email.includes(search) ||
                    id.includes(search);


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                const matchesVerification =
                    selectedVerification === "all" ||
                    verification === selectedVerification;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesVerification
                );

            });


        currentPage = 1;

        renderUsers();

    }


    /* =====================================================
       RENDER USERS
    ===================================================== */

    function renderUsers() {

        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        if (!filteredUsers.length) {

            if (pagination) {
                pagination.hidden = true;
            }

            showEmptyState();

            return;

        }


        hideEmptyState();


        const start =
            (currentPage - 1) *
            usersPerPage;

        const end =
            start +
            usersPerPage;

        const pageUsers =
            filteredUsers.slice(
                start,
                end
            );


        pageUsers.forEach(
            function (user) {

                const row =
                    createUserRow(user);

                tableBody.appendChild(row);

            }
        );


        renderPagination();

    }


    /* =====================================================
       CREATE USER ROW
    ===================================================== */

    function createUserRow(user) {

        const row =
            document.createElement("tr");


        const userId =
            getUserId(user);

        const name =
            getUserName(user);

        const email =
            getUserEmail(user);

        const status =
            getUserStatus(user);

        const verification =
            getVerificationStatus(user);

        const balance =
            getUserBalance(user);

        const createdAt =
            getCreatedAt(user);

        const lastActivity =
            getLastActivity(user);

        const detailsUrl =
            getUserDetailsUrl(user);


        row.innerHTML = `

            <td>

                <div class="users-user-cell">

                    <div
                        class="users-user-avatar"
                        aria-hidden="true"
                    >
                        ${escapeHtml(
                            name
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </div>

                    <div class="users-user-info">

                        <strong>
                            ${escapeHtml(name)}
                        </strong>

                        <span>
                            ${escapeHtml(email)}
                        </span>

                    </div>

                </div>

            </td>


            <td dir="ltr">

                ${escapeHtml(userId || "—")}

            </td>


            <td>

                <span
                    class="users-status ${getStatusClass(status)}"
                >

                    ${escapeHtml(
                        getStatusLabel(status)
                    )}

                </span>

            </td>


            <td>

                <span
                    class="users-verification ${
                        verification === "verified"
                            ? "verified"
                            : "unverified"
                    }"
                >

                    ${escapeHtml(
                        getVerificationLabel(
                            verification
                        )
                    )}

                </span>

            </td>


            <td dir="ltr">

                ${formatCurrency(
                    balance
                )}

            </td>


            <td>

                ${formatDate(
                    createdAt
                )}

            </td>


            <td>

                ${formatDate(
                    lastActivity
                )}

            </td>


            <td>

                <a
                    href="${escapeHtml(detailsUrl)}"
                    class="admin-btn admin-btn-secondary users-details-button"
                    aria-label="عرض تفاصيل ${escapeHtml(name)}"
                >
                    تفاصيل المستخدم
                </a>

            </td>

        `;


        return row;

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStatistics() {

        const total =
            allUsers.length;

        const active =
            allUsers.filter(function (user) {

                return (
                    getUserStatus(user) ===
                    "active"
                );

            }).length;

        const pending =
            allUsers.filter(function (user) {

                return (
                    getUserStatus(user) ===
                    "pending"
                );

            }).length;

        const suspended =
            allUsers.filter(function (user) {

                const status =
                    getUserStatus(user);

                return (
                    status === "suspended" ||
                    status === "blocked"
                );

            }).length;


        if (totalUsersElement) {

            totalUsersElement.textContent =
                formatNumber(total);

        }

        if (activeUsersElement) {

            activeUsersElement.textContent =
                formatNumber(active);

        }

        if (pendingUsersElement) {

            pendingUsersElement.textContent =
                formatNumber(pending);

        }

        if (suspendedUsersElement) {

            suspendedUsersElement.textContent =
                formatNumber(suspended);

        }

    }
   /* =====================================================
   PAGINATION
===================================================== */

function renderPagination() {

    if (!pagination) {
        return;
    }


    const totalPages =
        Math.ceil(
            filteredUsers.length /
            usersPerPage
        );


    if (totalPages <= 1) {

        pagination.hidden = true;

        return;

    }


    pagination.hidden = false;


    if (paginationInfo) {

        paginationInfo.textContent =
            `صفحة ${currentPage} من ${totalPages}`;

    }


    if (paginationButtons) {

        paginationButtons.innerHTML = "";


        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "users-page-button";


            if (
                page === currentPage
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                page;


            button.addEventListener(
                "click",
                function () {

                    currentPage = page;

                    renderUsers();

                }
            );


            paginationButtons.appendChild(
                button
            );

        }

    }

}


/* =====================================================
   EMPTY STATE
===================================================== */

function showEmptyState(
    title = "لا توجد بيانات مستخدمين",
    message = "لا توجد بيانات مستخدمين متاحة حاليًا."
) {

    if (!emptyState) {
        return;
    }


    const heading =
        emptyState.querySelector("h3");

    const paragraph =
        emptyState.querySelector("p");


    if (heading) {

        heading.textContent =
            title;

    }


    if (paragraph) {

        paragraph.textContent =
            message;

    }


    emptyState.style.display =
        "flex";

}



function hideEmptyState() {

    if (!emptyState) {
        return;
    }


    emptyState.style.display =
        "none";

}


/* =====================================================
   LOADING
===================================================== */

function setLoadingState(
    loading
) {

    if (!tableBody) {
        return;
    }


    if (loading) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align:center"
                >

                    جاري تحميل المستخدمين...

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   EVENTS
===================================================== */


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            applyFilters();

        }
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}


if (verificationFilter) {

    verificationFilter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );

}


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            loadUsers();

        }
    );

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUsers();

    }
);


})();
