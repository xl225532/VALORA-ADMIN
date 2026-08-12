/* ==========================================
   VALORA ADMIN
   USERS DATA SYSTEM
========================================== */

"use strict";


/*
    مفتاح بيانات المستخدمين في لوحة الإدارة.

    حالياً نستخدمه للتجربة فقط.
    لاحقاً سيتم استبداله بقاعدة البيانات/API
    بدون تغيير شكل بيانات المستخدم.
*/

const VALORA_ADMIN_USERS_KEY = "VALORA_ADMIN_USERS";


/* ==========================================
   إنشاء UID
========================================== */

function generateAdminUID() {

    const random =
        Math.floor(100000 + Math.random() * 900000);

    return "VA" + random;
}


/* ==========================================
   إنشاء مستخدم تجريبي
========================================== */

function createDemoUser() {

    return {

        uid: generateAdminUID(),

        referralCode: "VA" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase(),

        email: "member@valora.com",

        phone: "",

        balance: 0,

        totalDeposit: 0,

        hasDeposit: false,

        invitedCount: 0,

        activeMembers: 0,

        status: "active",

        verificationStatus: "unverified",

        createdAt:
            new Date().toISOString(),

        lastLogin:
            null,

        /*
            هذه المصفوفات ستكون مهمة لاحقاً
            للإيداعات والسحوبات والأرباح
            والصفقات.
        */

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

    const savedUsers =
        localStorage.getItem(
            VALORA_ADMIN_USERS_KEY
        );


    if (!savedUsers) {

        return [];

    }


    try {

        const users =
            JSON.parse(savedUsers);


        if (!Array.isArray(users)) {

            return [];

        }


        return users;

    } catch (error) {

        console.error(
            "خطأ في قراءة بيانات المستخدمين:",
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

        console.error(
            "بيانات المستخدمين غير صحيحة"
        );

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

    if (!user || typeof user !== "object") {

        return false;

    }


    const users =
        getAdminUsers();


    /*
        منع تكرار UID
    */

    const exists =
        users.some(
            existingUser =>
                existingUser.uid === user.uid
        );


    if (exists) {

        console.warn(
            "المستخدم موجود مسبقاً:",
            user.uid
        );

        return false;

    }


    users.push(user);


    saveAdminUsers(users);


    return true;
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
   تحديث مستخدم
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
   حساب الإحصائيات
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
                Number(user.totalDeposit || 0) > 0
        ).length;


    const today =
        new Date();


    const todayString =
        today.toISOString()
            .split("T")[0];


    const todayUsers =
        users.filter(user => {

            if (!user.createdAt) {

                return false;

            }


            return user.createdAt
                .startsWith(todayString);

        }).length;


    return {

        totalUsers,

        activeUsers,

        depositUsers,

        todayUsers

    };

}


/* ==========================================
   حساب أهلية الصفقات
========================================== */

/*
    هذه الدالة لا تضيف الأرباح.

    وظيفتها فقط معرفة الصفقات التي يستطيع
    العضو الحصول عليها.

    القواعد الحالية:

    الصفقة 1:
    لديه إيداع.

    الصفقة 2:
    لديه إيداع.

    الصفقة 3:
    لديه إيداع.

    الصفقة 4:
    لديه إيداع 500 أو أكثر.

    الصفقة 5:
    لديه 20 عضو نشط أو أكثر.

    العضو الذي لديه إيداع + 20 عضو نشط
    يستطيع الحصول على الصفقات المناسبة
    لكل شرط.

    لاحقاً سننقل هذه القواعد إلى إعدادات
    لوحة الإدارة حتى تستطيع تغييرها بدون
    تعديل الكود.
*/

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
        Number(user.totalDeposit || 0);


    const activeMembers =
        Number(user.activeMembers || 0);


    const hasDeposit =
        deposit > 0;


    const has500Deposit =
        deposit >= 500;


    const has20ActiveMembers =
        activeMembers >= 20;


    return {

        trade1: hasDeposit,

        trade2: hasDeposit,

        trade3: hasDeposit,

        trade4: has500Deposit,

        trade5: has20ActiveMembers

    };

}


/* ==========================================
   إنشاء عضو تجريبي لأول تجربة
========================================== */

function createFirstDemoUser() {

    const users =
        getAdminUsers();


    /*
        لا ننشئ مستخدم تجريبي إذا كانت
        هناك بيانات موجودة بالفعل.
    */

    if (users.length > 0) {

        return users[0];

    }


    const user =
        createDemoUser();


    addAdminUser(user);


    return user;

}


/* ==========================================
   تصدير الدوال للصفحات
========================================== */

window.VALORA_ADMIN_USERS = {

    get: getAdminUsers,

    save: saveAdminUsers,

    add: addAdminUser,

    find: findAdminUser,

    update: updateAdminUser,

    stats: getAdminUserStats,

    tradeEligibility:
        getUserTradeEligibility,

    createDemo:
        createDemoUser,

    createFirstDemo:
        createFirstDemoUser

};
