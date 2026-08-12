/* =========================================================
   VALORA ADMIN — USER DETAILS JS
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


    setupBalanceEdit();


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
   LOAD USER
========================================================= */


function loadUserDetails() {


    /*
        لاحقًا هنا API

        fetch(
          "/api/users/" + id
        )

    */


    const demoUser = {


        id:
            userDetailsState.id || "—",


        name:
            "مستخدم جديد",


        email:
            "user@example.com",


        status:
            "active",


        balance:
            500,


        deposits:
            1000,


        withdrawals:
            200,


        profits:
            150,


        transactions:
            12,


        referrals:
            []

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
        "#" + user.id
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
        "detailVerification",
        "غير متحقق"
    );


    setText(
        "emailVerified",
        "نعم"
    );


    setText(
        "twoFactorStatus",
        "غير مفعل"
    );


    setText(
        "userAvatar",
        getInitial(user.name)
    );



    renderReferrals(
        user.referrals
    );


}





/* =========================================================
   REFERRALS
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
${escapeHTML(person.name)}
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
href="user-details.html?id=${encodeURIComponent(person.id)}"
class="user-view-button"
>
عرض
</a>

</td>


`;


            body.appendChild(row);


        }
    );


}







/* =========================================================
   BALANCE EDIT
========================================================= */


function setupBalanceEdit() {


    const button =
        document.getElementById(
            "addBalanceButton"
        );


    if (!button) {
        return;
    }




    button.addEventListener(
        "click",
        function () {


            const input =
                document.getElementById(
                    "balanceAmount"
                );


            if (!input) {
                return;
            }



            const amount =
                Number(
                    input.value
                );



            if (
                isNaN(amount)
                ||
                amount <= 0
            ) {

                return;

            }



            userDetailsState.user.balance += amount;



            setText(
                "userBalance",
                formatMoney(
                    userDetailsState.user.balance
                )
            );


            input.value = "";


        }
    );


}






/* =========================================================
   HELPERS
========================================================= */


function setText(
    id,
    value
) {


    const element =
        document.getElementById(id);



    if (!element) {
        return;
    }


    element.textContent =
        value ?? "—";


}





function formatMoney(
    value
) {


    return (
        Number(value || 0)
        .toLocaleString()
        +
        " USDT"
    );


}




function getInitial(
    name
) {


    if (!name) {
        return "?";
    }


    return name
        .charAt(0)
        .toUpperCase();


}





function escapeHTML(
    value
) {


    return String(value ?? "")

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
