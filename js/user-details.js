/* =========================================================
   VALORA ADMIN — USER DETAILS
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



],

referrals: [

    {
        id: "2001",
        name: "محمد علي",
        balance: 120,
        created_at: "2026-02-01"
    },

    {
        id: "2002",
        name: "سارة أحمد",
        balance: 300,
        created_at: "2026-02-05"
    }

]

        operations:

        [

            {

                type:"إيداع",

                amount:500,

                status:"مكتمل",

                date:"2026-02-01",

                id:"TX10001"

            },


            {

                type:"ربح",

                amount:150,

                status:"مكتمل",

                date:"2026-02-10",

                id:"TX10002"

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
        function(person){


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
${escapeHTML(person.email)}
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
   TRANSACTIONS TABLE
========================================================= */


function renderTransactions(
    operations
) {


    const body =
        document.getElementById(
            "userTransactionsBody"
        );


    if (!body) {

        return;

    }



    body.innerHTML = "";



    operations.forEach(
        function(item){



            const row =
                document.createElement(
                    "tr"
                );



            row.innerHTML = `

<td>
${escapeHTML(item.type)}
</td>


<td>
${formatMoney(item.amount)}
</td>


<td>
${escapeHTML(item.status)}
</td>


<td>
${escapeHTML(item.date)}
</td>


<td>
${escapeHTML(item.id)}
</td>

`;



            body.appendChild(row);



        }
    );


}






/* =========================================================
   BALANCE EDITOR
========================================================= */


function createBalanceEditor(){


    const container =
        document.querySelector(
            ".user-details-stats-grid"
        );



    if(!container){

        return;

    }



    const box =
        document.createElement(
            "section"
        );


    box.className =
        "admin-card";



    box.style.marginTop =
        "20px";



    box.innerHTML = `

<div class="admin-card-header">

<h2 class="admin-card-title">

تعديل الرصيد يدوياً

</h2>

</div>


<div class="admin-card-body">


<div style="display:flex;gap:10px;align-items:center">


<input

id="balanceAmount"

type="number"

placeholder="أدخل المبلغ"

style="padding:10px;border-radius:8px;border:1px solid #444"

>


<button

id="addBalanceButton"

class="admin-btn admin-btn-primary"

>

إضافة

</button>


</div>


</div>

`;



    container.after(box);



    setupBalanceEdit();


}








function setupBalanceEdit(){


    const button =
        document.getElementById(
            "addBalanceButton"
        );


    const input =
        document.getElementById(
            "balanceAmount"
        );



    if(!button || !input){

        return;

    }




    button.addEventListener(
        "click",
        function(){


            const amount =
                Number(
                    input.value
                );



            if(
                !amount ||
                amount <=0
            ){

                return;

            }



            userDetailsState.user.balance += amount;



            setText(

                "userBalance",

                formatMoney(
                    userDetailsState.user.balance
                )

            );



            input.value="";


        }
    );


}







/* =========================================================
   HELPERS
========================================================= */


function setText(
    id,
    value
){

    const element =
        document.getElementById(id);


    if(!element){

        return;

    }


    element.textContent =
        value ?? "—";


}






function formatMoney(
    value
){

    return (

        Number(value || 0)

        .toLocaleString()

        +

        " USDT"

    );

}





function getInitial(
    name
){

    if(!name){

        return "?";

    }


    return String(name)

    .trim()

    .charAt(0)

    .toUpperCase();


}






function escapeHTML(
    value
){

    return String(value ?? "")

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;")

    .replace(/'/g,"&#039;");


}





})();  
