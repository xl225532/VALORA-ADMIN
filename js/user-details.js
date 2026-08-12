/* =========================================================
   VALORA ADMIN
   USER DETAILS + REFERRALS
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const API_BASE_URL = "";

    const USER_API_ENDPOINT = "/api/users";

    const REFERRALS_ENDPOINT = "/referrals";


    /* =====================================================
       HELPERS
    ===================================================== */

    function getUserId() {

        const params =
            new URLSearchParams(
                window.location.search
            );

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

        const element =
            getElement(id);

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

        const number =
            Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        return new Intl.NumberFormat(
            "ar-SA",
            {
                maximumFractionDigits: 2
            }
        ).format(number);

    }


    function formatCurrency(
        value,
        currency = "USD"
    ) {

        const number =
            Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        try {

            return new Intl.NumberFormat(
                "ar-SA",
                {
                    style: "currency",
                    currency: currency,
                    maximumFractionDigits: 2
                }
            ).format(number);

        } catch(error) {

            return (
                formatNumber(number)
                +
                " "
                +
                currency
            );

        }

    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return new Intl.DateTimeFormat(
            "ar-SA",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        ).format(date);

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

            inactive: "غير نشط"

        };


        return (
            statuses[status]
            ||
            status
            ||
            "—"
        );

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
       RENDER USER
    ===================================================== */

    function renderUser(user) {

        if (!user) {
            return;
        }


        const fullName =
            user.fullName ||
            user.name ||
            "—";


        const email =
            user.email ||
            "—";


        const id =
            user.id ||
            user.userId ||
            user._id ||
            "—";


        setText(
            "userName",
            fullName
        );


        setText(
            "userEmail",
            email
        );


        setText(
            "userId",
            id
        );


        setText(
            "detailFullName",
            fullName
        );


        setText(
            "detailEmail",
            email
        );


        setText(
            "detailUserId",
            id
        );


        const avatar =
            getElement("userAvatar");


        if (avatar) {

            avatar.textContent =
                fullName
                !== "—"
                    ? fullName
                        .charAt(0)
                        .toUpperCase()
                    : "—";

        }


        const status =
            user.status ||
            "active";


        setText(
            "userStatus",
            getStatusText(status)
        );


        setText(
            "userBalance",
            formatCurrency(
                user.balance
            )
        );


        setText(
            "userDeposits",
            formatCurrency(
                user.totalDeposits ||
                user.deposits
            )
        );


        setText(
            "userWithdrawals",
            formatCurrency(
                user.totalWithdrawals ||
                user.withdrawals
            )
        );


        setText(
            "userTransactions",
            formatNumber(
                user.transactionCount
            )
        );


        setText(
            "detailCreatedAt",
            formatDate(
                user.createdAt
            )
        );


        setText(
            "detailLastActivity",
            formatDate(
                user.lastActivity
            )
        );


        setText(
            "detailVerification",
            getVerificationText(
                user.verified
            )
        );


        setText(
            "emailVerified",
            getVerificationText(
                user.emailVerified
            )
        );


        setText(
            "lastLogin",
            formatDate(
                user.lastLogin
            )
        );


        setText(
            "lastIp",
            user.lastIp
        );


        renderTransactions(
            user.transactions || []
        );


        renderActivity(
            user.activities || []
        );

    }


    /* =====================================================
       LOAD USER API
    ===================================================== */

    async function loadUser() {

        const userId =
            getUserId();


        if (!userId) {

            showError(
                "لم يتم تحديد رقم المستخدم"
            );

            return;

        }


        try {

            const response =
                await fetch(
                    API_BASE_URL +
                    USER_API_ENDPOINT +
                    "/" +
                    encodeURIComponent(userId),
                    {
                        credentials:
                            "include"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    response.status
                );

            }


            const data =
                await response.json();


            const user =
                data.user ||
                data.data ||
                data;


            renderUser(user);


            loadUserReferrals(userId);


        } catch(error) {

            console.error(
                "User details error",
                error
            );


            showError(
                "تعذر تحميل بيانات المستخدم"
            );

        }

    }
       /* =====================================================
       TRANSACTIONS
    ===================================================== */

    function renderTransactions(transactions) {

        const body =
            getElement(
                "userTransactionsBody"
            );

        const empty =
            getElement(
                "userTransactionsEmpty"
            );


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


        transactions.forEach(function(transaction){

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        transaction.type ||
                        "—"
                    )}
                </td>

                <td dir="ltr">
                    ${escapeHtml(
                        formatCurrency(
                            transaction.amount
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        getStatusText(
                            transaction.status
                        )
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formatDate(
                            transaction.createdAt
                        )
                    )}
                </td>

                <td dir="ltr">
                    ${escapeHtml(
                        transaction.id ||
                        "—"
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
            getElement(
                "userActivityList"
            );


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


        activities.forEach(function(activity){

            const item =
                document.createElement("div");


            item.className =
                "user-details-activity-item";


            item.innerHTML = `

                <strong>
                    ${escapeHtml(
                        activity.title ||
                        activity.action ||
                        "نشاط"
                    )}
                </strong>


                <p>
                    ${escapeHtml(
                        activity.description ||
                        ""
                    )}
                </p>


                <time>
                    ${escapeHtml(
                        formatDate(
                            activity.createdAt
                        )
                    )}
                </time>

            `;


            container.appendChild(item);

        });

    }



    /* =====================================================
       REFERRALS
       المستخدمون الذين دعاهم هذا المستخدم
    ===================================================== */

    async function loadUserReferrals(userId) {


        const body =
            getElement(
                "userReferralsBody"
            );


        const empty =
            getElement(
                "userReferralsEmpty"
            );


        if (!body) {
            return;
        }


        try {


            const response =
                await fetch(
                    API_BASE_URL +
                    USER_API_ENDPOINT +
                    "/" +
                    encodeURIComponent(userId) +
                    REFERRALS_ENDPOINT,
                    {
                        credentials:
                            "include"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    response.status
                );

            }


            const data =
                await response.json();


            const referrals =
                data.users ||
                data.data ||
                data.referrals ||
                [];


            body.innerHTML = "";


            if (
                !Array.isArray(referrals) ||
                referrals.length === 0
            ) {


                if (empty) {

                    empty.style.display =
                        "block";

                }


                return;

            }



            if (empty) {

                empty.style.display =
                    "none";

            }



            referrals.forEach(function(user){


                const row =
                    document.createElement("tr");



                row.innerHTML = `


                    <td>

                        <strong>
                            ${escapeHtml(
                                user.name ||
                                user.fullName ||
                                "—"
                            )}
                        </strong>


                        <br>


                        <small>
                            ${escapeHtml(
                                user.email ||
                                ""
                            )}
                        </small>

                    </td>



                    <td dir="ltr">

                        ${escapeHtml(
                            user.id ||
                            user.userId ||
                            "—"
                        )}

                    </td>



                    <td>

                        ${escapeHtml(
                            formatCurrency(
                                user.balance
                            )
                        )}

                    </td>



                    <td>

                        ${escapeHtml(
                            formatDate(
                                user.createdAt
                            )
                        )}

                    </td>



                    <td>

                        ${escapeHtml(
                            getStatusText(
                                user.status
                            )
                        )}

                    </td>


                `;



                body.appendChild(row);



            });



        }
        catch(error) {


            console.error(
               
