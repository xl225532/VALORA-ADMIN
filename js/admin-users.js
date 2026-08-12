/* =========================================================
   VALORA ADMIN
   ADMIN USERS SYSTEM
   js/admin-users.js
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const VALORA_ADMIN_USERS_KEY = "VALORA_ADMIN_USERS";


/* =========================================================
   إنشاء UID
========================================================= */

function generateAdminUID() {

    const randomNumber =
        Math.floor(
            10000000 +
            Math.random() * 90000000
        );

    return "VA" + randomNumber;
}


/* =========================================================
   إنشاء كود دعوة
========================================================= */

function generateReferralCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "VA";

    for (let i = 0; i < 6; i++) {

        code +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];

    }

    return code;
}


/* =========================================================
   إنشاء مستخدم
========================================================= */

function createUser(data = {}) {

    return {

        uid:
            data.uid ||
            generateAdminUID(),

        referralCode:
            data.referralCode ||
            generateReferralCode(),

        email:
            data.email ||
            "member@valora.com",

        phone:
            data.phone ||
            "",

        balance:
            Number(data.balance || 0),

        totalDeposit:
            Number(data.totalDeposit || 0),

        hasDeposit:
            Number(data.totalDeposit || 0) > 0,

        invitedCount:
            Number(data.invitedCount || 0),

        activeMembers:
            Number(data.activeMembers || 0),

        status:
            data.status ||
            "active",

        securityCode:
            data.securityCode ||
            "",

        verificationStatus:
            data.verificationStatus ||
            "unverified",

        createdAt:
            data.createdAt ||
            new Date().toISOString(),

        lastLogin:
            data.lastLogin ||
            null,

        deposits:
            Array.isArray(data.deposits)
                ? data.deposits
                : [],

        withdrawals:
            Array.isArray(data.withdrawals)
                ? data.withdrawals
                : [],

        trades:
            Array.isArray(data.trades)
                ? data.trades
                : [],

        profits:
            Array.isArray(data.profits)
                ? data.profits
                : [],

        referrals:
            Array.isArray(data.referrals)
                ? data.referrals
                : [],

        messages:
            Array.isArray(data.messages)
                ? data.messages
                : [],

        notifications:
            Array.isArray(data.notifications)
                ? data.notifications
                : []

    };

}


/* =========================================================
   قراءة المستخدمين
========================================================= */

function getAdminUsers() {

    const saved =
        localStorage.getItem(
            VALORA_ADMIN_USERS_KEY
        );


    if (!saved) {

        return [];

    }


    try {

        const users =
            JSON.parse(saved);


        if (!Array.isArray(users)) {

            return [];

        }


        return users;

    } catch (error) {

        console.error(
            "VALORA USERS ERROR:",
            error
        );

        return [];

    }

}


/* =========================================================
   حفظ المستخدمين
========================================================= */

function saveAdminUsers(users) {

    if (!Array.isArray(users)) {

        return false;

    }


    try {

        localStorage.setItem(
            VALORA_ADMIN_USERS_KEY,
            JSON.stringify(users)
        );

        return true;

    } catch (error) {

        console.error(
            "خطأ في حفظ المستخدمين:",
            error
        );

        return false;

    }

}


/* =========================================================
   إضافة مستخدم
========================================================= */

function addAdminUser(userData) {

    const users =
        getAdminUsers();


    const user =
        createUser(userData);


    const exists =
        users.some(
            item =>
                item.uid === user.uid
        );


    if (exists) {

        return false;

    }


    users.push(user);


    saveAdminUsers(users);


    return user;

}


/* =========================================================
   إنشاء أعضاء تجريبيين
========================================================= */

function createDemoUsers() {

    const users =
        getAdminUsers();


    /*
       إذا كان هناك أعضاء بالفعل
       لا ننشئ أعضاء إضافيين.
    */

    if (users.length > 0) {

        return users;

    }


    const demoUsers = [

        createUser({

            uid: "VA10000001",

            referralCode: "VA8K2M7",

            email: "ahmad@valora.com",

            phone: "0500000001",

            balance: 1250,

            totalDeposit: 1000,

            invitedCount: 12,

            activeMembers: 8,

            status: "active",

            securityCode: "1234",

            verificationStatus: "verified"

        }),


        createUser({

            uid: "VA10000002",

            referralCode: "VA7P4X9",

            email: "member@valora.com",

            phone: "0500000002",

            balance: 0,

            totalDeposit: 0,

            invitedCount: 3,

            activeMembers: 1,

            status: "active",

            securityCode: "5678",

            verificationStatus: "unverified"

        }),


        createUser({

            uid: "VA10000003",

            referralCode: "VA5N8Q3",

            email: "user@valora.com",

            phone: "0500000003",

            balance: 750,

            totalDeposit: 500,

            invitedCount: 24,

            activeMembers: 20,

            status: "active",

            securityCode: "9012",

            verificationStatus: "verified"

        })

    ];


    saveAdminUsers(demoUsers);


    return demoUsers;

}


/* =========================================================
   البحث عن مستخدم
========================================================= */

function findAdminUser(searchValue) {

    const search =
        String(searchValue || "")
            .trim()
            .toLowerCase();


    if (!search) {

        return null;

    }


    const users =
        getAdminUsers();


    return users.find(user => {

        return (

            String(user.uid || "")
                .toLowerCase()
                .includes(search)

            ||

            String(user.email || "")
                .toLowerCase()
                .includes(search)

            ||

            String(user.phone || "")
                .toLowerCase()
                .includes(search)

            ||

            String(user.referralCode || "")
                .toLowerCase()
                .includes(search)

        );

    }) || null;

}


/* =========================================================
   تحديث مستخدم
========================================================= */

function updateAdminUser(uid, updates) {

    const users =
        getAdminUsers();


    const index =
        users.findIndex(
            user =>
                user.uid === uid
        );


    if (index === -1) {

        return false;

    }


    users[index] = {

        ...users[index],

        ...updates

    };


    /*
       تحديث حالة الإيداع تلقائياً
    */

    users[index].hasDeposit =
        Number(
            users[index].totalDeposit || 0
        ) > 0;


    saveAdminUsers(users);


    return true;

}


/* =========================================================
   حذف مستخدم
========================================================= */

function deleteAdminUser(uid) {

    const users =
        getAdminUsers();


    const filtered =
        users.filter(
            user =>
                user.uid !== uid
        );


    if (
        filtered.length ===
        users.length
    ) {

        return false;

    }


    saveAdminUsers(filtered);


    return true;

}


/* =========================================================
   إحصائيات المستخدمين
========================================================= */

function getAdminUserStats() {

    const users =
        getAdminUsers();


    const totalUsers =
        users.length;


    const activeUsers =
        users.filter(
            user =>
                user.status === "active"
        ).length;


    const depositUsers =
        users.filter(
            user =>
                Number(
                    user.totalDeposit || 0
                ) > 0
        ).length;


    const today =
        new Date();


    const todayString =
        today
            .toISOString()
            .split("T")[0];


    const todayUsers =
        users.filter(user => {

            if (!user.createdAt) {

                return false;

            }


            return user.createdAt
                .startsWith(
                    todayString
                );

        }).length;


    return {

        totalUsers,

        activeUsers,

        depositUsers,

        todayUsers

    };

}


/* =========================================================
   أهلية الصفقات
========================================================= */

function getUserTradeEligibility(user) {

    if (!user) {

        return {

            trade1: false,

            trade2: false,

            trade3: false,

            trade4: false,

            trade5: false

        };

    }


    const deposit =
        Number(
            user.totalDeposit || 0
        );


    const activeMembers =
        Number(
            user.activeMembers || 0
        );


    /*
       حسب القاعدة التي اتفقنا عليها:

       لديه إيداع
       يستطيع أخذ الصفقات الأساسية.

       لديه 500 أو أكثر
       يستطيع الصفقة الخاصة.

       لديه 20 عضو نشط
       يستطيع الصفقة الخاصة.

       وإذا كان لديه إيداع + 20 عضو نشط
       يستفيد من جميع الصفقات.
    */


    const hasDeposit =
        deposit > 0;


    const has500 =
        deposit >= 500;


    const has20Active =
        activeMembers >= 20;


    return {

        trade1:
            hasDeposit,

        trade2:
            hasDeposit,

        trade3:
            hasDeposit,

        trade4:
            has500,

        trade5:
            has20Active

    };

}


/* =========================================================
   تنسيق الأرقام
========================================================= */

function formatAdminNumber(value) {

    const number =
        Number(value || 0);


    return number.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   عرض حالة المستخدم
========================================================= */

function getUserStatusHTML(status) {

    if (status === "blocked") {

        return `
            <span class="status blocked">
                محظور
            </span>
        `;

    }


    return `
        <span class="status active">
            نشط
        </span>
    `;

}


/* =========================================================
   رسم جدول المستخدمين
========================================================= */

function renderAdminUsers(users) {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    if (!tableBody) {

        return;

    }


    if (
        !Array.isArray(users) ||
        users.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty-row"
                >

                    لا توجد بيانات مستخدمين

                </td>

            </tr>

        `;

        updateUsersCount(0);

        return;

    }


    tableBody.innerHTML =
        users.map(user => {

            const deposit =
                Number(
                    user.totalDeposit || 0
                );


            return `

                <tr>

                    <td>

                        <span class="uid">

                            ${escapeAdminHTML(
                                user.uid
                            )}

                        </span>

                    </td>


                    <td>

                        ${escapeAdminHTML(
                            user.email
                        )}

                    </td>


                    <td>

                        ${
                            user.phone
                            ?
                            escapeAdminHTML(
                                user.phone
                            )
                            :
                            "—"
                        }

                    </td>


                    <td>

                        <strong>

                            ${formatAdminNumber(
                                user.balance
                            )}

                        </strong>

                    </td>


                    <td>

                        ${
                            deposit > 0
                            ?
                            `
                            <span class="status active">
                                ${formatAdminNumber(deposit)}
                            </span>
                            `
                            :
                            `
                            <span
                                style="
                                    color:#777;
                                "
                            >
                                0
                            </span>
                            `
                        }

                    </td>


                    <td>

                        ${formatAdminNumber(
                            user.invitedCount
                        )}

                    </td>


                    <td>

                        ${formatAdminNumber(
                            user.activeMembers
                        )}

                    </td>


                    <td>

                        ${getUserStatusHTML(
                            user.status
                        )}

                    </td>


                    <td>

                        <a
                            class="view-button"
                            href="user-details.html?uid=${encodeURIComponent(user.uid)}"
                        >

                            التفاصيل

                        </a>

                    </td>

                </tr>

            `;

        }).join("");


    updateUsersCount(
        users.length
    );

}


/* =========================================================
   تحديث عدد المستخدمين
========================================================= */

function updateUsersCount(count) {

    const element =
        document.getElementById(
            "usersCount"
        );


    if (!element) {

        return;

    }


    element.textContent =
        `${count} مستخدم`;

}


/* =========================================================
   تحديث الإحصائيات
========================================================= */

function renderUserStats() {

    const stats =
        getAdminUserStats();


    const total =
        document.getElementById(
            "totalUsers"
        );


    const active =
        document.getElementById(
            "activeUsers"
        );


    const deposits =
        document.getElementById(
            "depositUsers"
        );


    const today =
        document.getElementById(
            "todayUsers"
        );


    if (total) {

        total.textContent =
            stats.totalUsers;

    }


    if (active) {

        active.textContent =
            stats.activeUsers;

    }


    if (deposits) {

        deposits.textContent =
            stats.depositUsers;

    }


    if (today) {

        today.textContent =
            stats.todayUsers;

    }

}


/* =========================================================
   تنفيذ البحث والفلترة
========================================================= */

function searchAdminUsers() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    const statusSelect =
        document.getElementById(
            "userStatus"
        );


    const search =
        searchInput
            ?
            searchInput.value
                .trim()
                .toLowerCase()
            :
            "";


    const status =
        statusSelect
            ?
            statusSelect.value
            :
            "all";


    const users =
        getAdminUsers();


    const filtered =
        users.filter(user => {

            const matchesSearch =

                !search

                ||

                String(
                    user.uid || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.email || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.phone || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    user.referralCode || ""
                )
                .toLowerCase()
                .includes(search);


            const matchesStatus =

                status === "all"

                ||

                user.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderAdminUsers(
        filtered
    );

}


/* =========================================================
   حماية النصوص من HTML
========================================================= */

function escapeAdminHTML(value) {

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


/* =========================================================
   نسخ النص
========================================================= */

function copyAdminText(text) {

    if (
        !navigator.clipboard
    ) {

        return;

    }


    navigator.clipboard
        .writeText(text)
        .then(() => {

            console.log(
                "تم النسخ"
            );

        })
        .catch(error => {

            console.error(
                "فشل النسخ:",
                error
            );

        });

}


/* =========================================================
   تحميل صفحة المستخدمين
========================================================= */

function initAdminUsersPage() {

    /*
       ننشئ الأعضاء التجريبيين
       إذا لم توجد بيانات.
    */

    createDemoUsers();


    /*
       قراءة البيانات
    */

    const users =
        getAdminUsers();


    /*
       عرض الجدول
    */

    renderAdminUsers(
        users
    );


    /*
       عرض الإحصائيات
    */

    renderUserStats();


    /*
       البحث أثناء الكتابة
    */

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchAdminUsers
        );

    }


    /*
       فلترة الحالة
    */

    const statusSelect =
        document.getElementById(
            "userStatus"
        );


    if (statusSelect) {

        statusSelect.addEventListener(
            "change",
            searchAdminUsers
        );

    }

}


/* =========================================================
   تشغيل الصفحة
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initAdminUsersPage();

    }
);


/* =========================================================
   تصدير الدوال
========================================================= */

window.VALORA_ADMIN_USERS = {

    get:
        getAdminUsers,

    save:
        saveAdminUsers,

    add:
        addAdminUser,

    createUser:
        createUser,

    createDemo:
        createDemoUsers,

    find:
        findAdminUser,

    update:
        updateAdminUser,

    delete:
        deleteAdminUser,

    stats:
        getAdminUserStats,

    tradeEligibility:
        getUserTradeEligibility,

    render:
        renderAdminUsers,

    search:
        searchAdminUsers

};


/* =========================================================
   توافق مع users.html
========================================================= */

window.searchUsers =
    searchAdminUsers;
