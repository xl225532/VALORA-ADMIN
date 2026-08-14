/* =========================================================
   VALORA ADMIN — USER DETAILS
   ADD + DEDUCT BALANCE
========================================================= */

(function () {

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    initUserDetails
);


/* =========================================================
   STATE
========================================================= */

const userDetailsState = {

    id: null,

    user: null

};


/* =========================================================
   INIT
========================================================= */

function initUserDetails() {

    userDetailsState.id =
        getUserIdFromURL();

    loadUserDetails();

    createBalanceEditor();

}


/* =========================================================
   GET USER ID
========================================================= */

function getUserIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* =========================================================
   DEMO USER DATA
========================================================= */

function loadUserDetails() {

    const demoUser = {

        id:
            userDetailsState.id || "1001",

        name:
            "أحمد محمد",

        email:
            "ahmed@test.com",

        status:
            "active",

        balance:
            500,

        deposits:
            1200,

        withdrawals:
            200,

        profits:
            350,

        transactions:
            18,

        created_at:
            "2026-01-01",

        referrals: [

            {
                id: "2001",

                name: "محمد علي",

                email: "mohamed@test.com",

                balance: 120,

                created_at: "2026-02-01"
            },

            {
                id: "2002",

                name: "سارة أحمد",

                email: "sara@test.com",

                balance: 300,

                created_at: "2026-02-05"
            }

        ],

        operations: [

            {

                type: "إيداع",

                amount: 500,

                status: "مكتمل",

                date: "2026-02-01",

                id: "TX10001"

            },

            {

                type: "ربح",

                amount: 150,

                status: "مكتمل",

                date: "2026-02-10",

                id: "TX10002"

            }

        ]

    };


    userDetailsState.user =
        demoUser;


    renderUser(
        demoUser
    );

}


/* =========================================================
   RENDER USER
========================================================= */

function renderUser(user) {

    setText(
        "userName",
        user.name
    );


    setText(
        "userEmail",
        user.email
    );


    setText(
        "userId",
        "UID #" + user.id
    );


    setText(
        "userBalance",
        formatMoney(user.balance)
    );


    setText(
        "userDeposits",
        formatMoney(user.deposits)
    );


    setText(
        "userWithdrawals",
        formatMoney(user.withdrawals)
    );


    setText(
        "userTransactions",
        user.transactions
    );


    setText(
        "userReferralsCount",
        user.referrals.length
    );


    setText(
        "userAvatar",
        getInitial(user.name)
    );


    setText(
        "detailFullName",
        user.name
    );


    setText(
        "detailEmail",
        user.email
    );


    setText(
        "detailUserId",
        user.id
    );


    setText(
        "detailCreatedAt",
        user.created_at
    );


    setText(
        "detailVerification",
        "موثق"
    );


    setText(
        "userStatus",
        "نشط"
    );


    setText(
        "emailVerified",
        "نعم"
    );


    setText(
        "twoFactorStatus",
        "غير مفعل"
    );


    renderReferrals(
        user.referrals
    );


    renderTransactions(
        user.operations
    );

}


/* =========================================================
   REFERRALS TABLE
========================================================= */

function renderReferrals(
    referrals
) {

    const body =
        document.getElementById(
            "userReferralsBody"
        );


    if (!body) {

        return;

    }


    body.innerHTML = "";


    if (
        !referrals ||
        referrals.length === 0
    ) {

        return;

    }


    referrals.forEach(
        function (person) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

<td>

<strong>
${escapeHTML(person.name)}
</strong>

<br>

<small>
${escapeHTML(person.email || "")}
</small>

</td>


<td>
${escapeHTML(person.id)}
</td>


<td>
${formatMoney(person.balance)}
</td>


<td>
${escapeHTML(person.created_at)}
</td>


<td>

<a

href="user-details.html?id=${encode
