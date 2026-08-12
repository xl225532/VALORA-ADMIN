(function () {

"use strict";


/*
=========================================================
VALORA ADMIN — USERS
=========================================================

الحالة الحالية:

- واجهة إدارة المستخدمين فقط.
- لا توجد قاعدة بيانات مرتبطة.
- لا توجد بيانات وهمية.
- البيانات ستأتي لاحقًا من API.

المهام:
- عرض المستخدمين.
- البحث.
- الفلترة.
- الانتقال إلى تفاصيل المستخدم.

=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    initUsers
);





/*
=========================================================
STATE
=========================================================
*/


const usersState = {

    users: [],

    filteredUsers: [],

    currentPage: 1,

    pageSize: 10

};





/*
=========================================================
INIT
=========================================================
*/


function initUsers() {


    clearUsersPage();


    setupSearch();


    setupFilters();


    setupRefresh();


    setupPagination();


}







/*
=========================================================
CLEAR PAGE
=========================================================
*/


function clearUsersPage() {


    usersState.users = [];


    usersState.filteredUsers = [];


    updateStatistics();


    renderUsers();


}







/*
=========================================================
STATISTICS
=========================================================
*/


function updateStatistics() {


    setText(
        "totalUsers",
        "—"
    );


    setText(
        "activeUsers",
        "—"
    );


    setText(
        "pendingUsers",
        "—"
    );


    setText(
        "suspendedUsers",
        "—"
    );


}
/*
=========================================================
RENDER USERS
=========================================================
*/


function renderUsers() {


    const tbody = document.getElementById(
        "usersTableBody"
    );


    if (!tbody) {
        return;
    }



    tbody.innerHTML = "";



    if (
        usersState.filteredUsers.length === 0
    ) {


        tbody.innerHTML = `

        <tr class="users-empty-row">

            <td colspan="8">

                <div class="users-empty">

                    <div class="users-empty-icon">
                        ♙
                    </div>


                    <h3>
                        لا توجد بيانات مستخدمين
                    </h3>


                    <p>
                        سيتم عرض المستخدمين بعد ربط النظام بمصدر البيانات.
                    </p>


                </div>

            </td>

        </tr>

        `;


        updatePagination();


        return;

    }





    usersState.filteredUsers.forEach(
        function (user) {


            const row =
                createUserRow(user);



            tbody.appendChild(row);


        }
    );



    updatePagination();


}







/*
=========================================================
CREATE USER ROW
=========================================================
*/


function createUserRow(user) {


    const tr =
        document.createElement(
            "tr"
        );



    tr.innerHTML = `


<td>


<div class="user-cell">


<div class="user-avatar">

${escapeHTML(
    getInitial(user.name)
)}

</div>



<div class="user-info">


<strong>

${escapeHTML(
    user.name || "—"
)}

</strong>


<span>

${escapeHTML(
    user.email || "—"
)}

</span>



</div>


</div>


</td>





<td>

<span class="user-id">

#${escapeHTML(
    user.id || "—"
)}

</span>


</td>





<td>


<span class="user-status ${getStatusClass(user.status)}">

${escapeHTML(
    user.status || "—"
)}

</span>


</td>





<td>


<span class="user-verification">


${escapeHTML(
    user.verification || "—"
)}


</span>


</td>





<td>


<strong class="user-balance">

${escapeHTML(
    user.balance || "—"
)}

</strong>


</td>





<td>

${escapeHTML(
    user.created_at || "—"
)}

</td>





<td>

${escapeHTML(
    user.last_activity || "—"
)}

</td>





<td>


<a

href="user-details.html?id=${encodeURIComponent(user.id)}"

class="user-view-button"

>

عرض

</a>


</td>


`;



    return tr;


}







/*
=========================================================
SEARCH
=========================================================
*/


function setupSearch() {


    const input =
        document.getElementById(
            "userSearch"
        );



    if (!input) {
        return;
    }



    input.addEventListener(
        "input",
        function () {


            applyFilters();


        }
    );


}
/*
=========================================================
FILTERS
=========================================================
*/


function setupFilters() {


    const status =
        document.getElementById(
            "userStatusFilter"
        );


    const verification =
        document.getElementById(
            "verificationFilter"
        );



    if (status) {

        status.addEventListener(
            "change",
            applyFilters
        );

    }



    if (verification) {

        verification.addEventListener(
            "change",
            applyFilters
        );

    }


}







function applyFilters() {


    const search =
        document.getElementById(
            "userSearch"
        );



    const status =
        document.getElementById(
            "userStatusFilter"
        );



    const verification =
        document.getElementById(
            "verificationFilter"
        );




    const searchValue =
        search
        ? search.value
            .trim()
            .toLowerCase()
        : "";



    const statusValue =
        status
        ? status.value
        : "all";



    const verificationValue =
        verification
        ? verification.value
        : "all";





    usersState.filteredUsers =
        usersState.users.filter(
            function (user) {



                const name =
                    String(
                        user.name || ""
                    )
                    .toLowerCase();



                const email =
                    String(
                        user.email || ""
                    )
                    .toLowerCase();



                const id =
                    String(
                        user.id || ""
                    )
                    .toLowerCase();




                const matchesSearch =

                    !searchValue ||

                    name.includes(searchValue) ||

                    email.includes(searchValue) ||

                    id.includes(searchValue);





                const matchesStatus =

                    statusValue === "all" ||

                    user.status === statusValue;





                const matchesVerification =

                    verificationValue === "all" ||

                    user.verification === verificationValue;





                return (

                    matchesSearch &&

                    matchesStatus &&

                    matchesVerification

                );


            }
        );



    usersState.currentPage = 1;


    renderUsers();


}








/*
=========================================================
REFRESH
=========================================================
*/


function setupRefresh() {


    const button =
        document.getElementById(
            "refreshUsers"
        );



    if (!button) {
        return;
    }



    button.addEventListener(
        "click",
        function () {


            clearUsersPage();


        }
    );


}








/*
=========================================================
PAGINATION
=========================================================
*/


function setupPagination() {


    const previous =
        document.getElementById(
            "previousPage"
        );



    const next =
        document.getElementById(
            "nextPage"
        );



    if (previous) {


        previous.addEventListener(
            "click",
            function () {


                if (
                    usersState.currentPage > 1
                ) {

                    usersState.currentPage--;

                    renderUsers();

                }


            }
        );


    }






    if (next) {


        next.addEventListener(
            "click",
            function () {


                usersState.currentPage++;


                renderUsers();


            }
        );


    }


}







function updatePagination() {


    setText(
        "usersFrom",
        "0"
    );


    setText(
        "usersTo",
        "0"
    );


    setText(
        "usersTotal",
        "0"
    );


    setText(
        "currentPage",
        usersState.currentPage
    );


}
/*
=========================================================
API PLACEHOLDER
=========================================================

لاحقًا عند ربط قاعدة البيانات:

سيتم استبدال هذه الدالة بـ:

fetch()
أو
Axios

لجلب المستخدمين الحقيقيين.

=========================================================
*/


async function loadUsersFromAPI() {


    /*
    
    مثال مستقبلي:

    const response =
        await fetch("/api/users");


    const data =
        await response.json();


    usersState.users = data;


    usersState.filteredUsers = data;


    renderUsers();


    */


    clearUsersPage();


}







/*
=========================================================
HELPERS
=========================================================
*/


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
        value ?? "";

}







function getInitial(
    name
) {


    if (!name) {

        return "?";

    }


    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();


}







function getStatusClass(
    status
) {


    switch (status) {


        case "active":

            return "active";



        case "pending":

            return "pending";



        case "suspended":

            return "suspended";



        default:

            return "";

    }


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
