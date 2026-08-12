/* ==========================================
   VALORA ADMIN
   USERS SYSTEM
========================================== */

"use strict";


const VALORA_ADMIN_USERS_KEY =
    "VALORA_ADMIN_USERS";


/* ==========================================
   إنشاء UID
========================================== */

function generateAdminUID() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return "VA" + random;

}


/* ==========================================
   إنشاء كود دعوة
========================================== */

function generateReferralCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "VA";

    for (let i = 0; i < 6; i++) {

        code +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }

    return code;

}


/* ==========================================
   إنشاء مستخدم
========================================== */

function createDemoUser() {

    return {

        uid:
            generateAdminUID(),

        referralCode:
            generateReferralCode(),

        email:
            "member@valora.com",

        phone:
            "0500000000",

        balance:
            0,

        totalDeposit:
            0,

        hasDeposit:
            false,

        invitedCount:
            0,

        activeMembers:
            0,

        status:
            "active",

        verificationStatus:
            "unverified",

        createdAt:
            new Date().toISOString(),

        lastLogin:
            null,

        deposits: [],

        withdrawals: [],

        trades: [],

        profits: [],

        referrals: [],

        messages: [],

        notifications: []

    };

}


/* ==========================================
   جلب المستخدمين
========================================== */

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


        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.error(
            "خطأ في بيانات المستخدمين:",
            error
        );

        return [];

    }

}


/* ==========================================
   حفظ المستخدمين
========================================== */

function saveAdminUsers(users) {

    if (!Array.isArray(users)) {

        return false;

    }


    localStorage.setItem(

        VALORA_ADMIN_USERS_KEY,

        JSON.stringify(users)

    );


    return true;

}


/* ==========================================
   إضافة مستخدم
========================================== */

function addAdminUser(user) {

    if (!user) {

        return false;

    }


    const users =
        getAdminUsers();


    const exists =
        users.some(
            existing =>
                existing.uid === user.uid
        );


    if (exists) {

        return false;

    }


    users.push(user);


    saveAdminUsers(users);


    return true;

}


/* ==========================================
   إنشاء عضو تجريبي
========================================== */

function createFirstDemoUser() {

    const users =
        getAdminUsers();


    if (users.length > 0) {

        return;

    }


    const demoUser =
        createDemoUser();


    addAdminUser(
        demoUser
    );

}


/* ==========================================
   البحث عن مستخدم
========================================== */

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


/* ==========================================
   تحديث المستخدم
========================================== */

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


    saveAdminUsers(users);


    return true;

}


/* ==========================================
   إحصائيات المستخدمين
========================================== */

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
        new Date()
            .toISOString()
            .split("T")[0];


    const todayUsers =
        users.filter(user => {

            return String(
                user.createdAt || ""
            ).startsWith(today);

        }).length;


    return {

        totalUsers,

        activeUsers,

        depositUsers,

        todayUsers

    };

}


/* ==========================================
   أهلية الصفقات
========================================== */

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


    const hasDeposit =
        deposit > 0;


    const has500Deposit =
        deposit >= 500;


    const has20ActiveMembers =
        activeMembers >= 20;


    return {

        trade1:
            hasDeposit,

        trade2:
            hasDeposit,

        trade3:
            hasDeposit,

        trade4:
            has500Deposit,

        trade5:
            has20ActiveMembers

    };

}


/* ==========================================
   حماية النص
========================================== */

function escapeAdminHTML(value) {

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


/* ==========================================
   إنشاء صف المستخدم
========================================== */

function createUserRow(user) {

    const row =
        document.createElement("tr");


    const balance =
        Number(
            user.balance || 0
        );


    const deposit =
        Number(
            user.totalDeposit || 0
        );


    const status =
        user.status === "active";


    row.innerHTML = `

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

            ${escapeAdminHTML(
                user.phone || "-"
            )}

        </td>


        <td>

            ${balance.toFixed(2)}

        </td>


        <td>

            ${deposit.toFixed(2)}

        </td>


        <td>

            ${Number(
                user.invitedCount || 0
            )}

        </td>


        <td>

            ${Number(
                user.activeMembers || 0
            )}

        </td>


        <td>

            <span
                class="status ${
                    status
                        ? "active"
                        : "blocked"
                }"
            >

                ${
                    status
                        ? "نشط"
                        : "محظور"
                }

            </span>

        </td>


        <td>

            <a
                href="user-details.html?uid=${encodeURIComponent(
                    user.uid
                )}"
                class="view-button"
            >

                عرض التفاصيل

            </a>

        </td>

    `;


    return row;

}


/* ==========================================
   عرض المستخدمين
========================================== */

function renderAdminUsers(users) {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    const count =
        document.getElementById(
            "usersCount"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    if (!users.length) {

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


        if (count) {

            count.textContent =
                "0 مستخدم";

        }


        return;

    }


    users.forEach(user => {

        tableBody.appendChild(
            createUserRow(user)
        );

    });


    if (count) {

        count.textContent =
            `${users.length} مستخدم`;

    }

}


/* ==========================================
   تحديث الإحصائيات
========================================== */

function updateUserStatistics() {

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


/* ==========================================
   تحميل الصفحة
========================================== */

function loadAdminUsers() {

    /*
        هذه هي النقطة التي كانت ناقصة.
        إنشاء العضو التجريبي عند أول تشغيل.
    */

    createFirstDemoUser();


    const users =
        getAdminUsers();


    renderAdminUsers(
        users
    );


    updateUserStatistics();

}


/* ==========================================
   البحث والفلترة
========================================== */

function searchUsers() {

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
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusSelect
            ? statusSelect.value
            : "all";


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

                selectedStatus === "all"

                ||

                user.status ===
                    selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    renderAdminUsers(
        filtered
    );

}


/* ==========================================
   التشغيل
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminUsers();


        const searchInput =
            document.getElementById(
                "userSearch"
            );


        const statusSelect =
            document.getElementById(
                "userStatus"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchUsers
            );

        }


        if (statusSelect) {

            statusSelect.addEventListener(
                "change",
                searchUsers
            );

        }

    }
);


/* ==========================================
   إتاحة النظام للصفحات الأخرى
========================================== */

window.VALORA_ADMIN_USERS = {

    get:
        getAdminUsers,

    save:
        saveAdminUsers,

    add:
        addAdminUser,

    find:
        findAdminUser,

    update:
        updateAdminUser,

    stats:
        getAdminUserStats,

    tradeEligibility:
        getUserTradeEligibility,

    createDemo:
        createDemoUser,

    createFirstDemo:
        createFirstDemoUser

};
