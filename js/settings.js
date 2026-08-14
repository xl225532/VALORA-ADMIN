/* =========================================================
   VALORA ADMIN — SETTINGS
   Global Settings Management
========================================================= */

(function () {

    "use strict";

    /* =====================================================
       DEFAULT SETTINGS
    ===================================================== */

    const DEFAULT_SETTINGS = {

        /* =========================
           GENERAL
        ========================= */

        siteName: "VALORA",

        siteStatus: "active",

        maintenanceMessage:
            "الموقع تحت الصيانة حاليًا. يرجى المحاولة لاحقًا.",


        /* =========================
           TRADING
        ========================= */

        tradingEnabled: true,

        minimumTradeAmount: 10,

        maximumTradeAmount: 100000,

        tradingFee: 0.10,


        /* =========================
           DEPOSIT
        ========================= */

        depositsEnabled: true,

        minimumDeposit: 10,

        maximumDeposit: 100000,


        /* =========================
           WITHDRAWAL
        ========================= */

        withdrawalsEnabled: true,

        minimumWithdrawal: 10,

        maximumWithdrawal: 100000,

        withdrawalFee: 2,


        /* =========================
           KYC
        ========================= */

        kycEnabled: true,

        kycRequiredForTrading: true,

        kycRequiredForWithdrawal: true,

        kycMinimumWithdrawal: 1000,


        /* =========================
           SECURITY
        ========================= */

        loginAttempts: 5,

        sessionTimeout: 60,


        /* =========================
           NOTIFICATIONS
        ========================= */

        emailNotifications: true,

        systemNotifications: true,


        /* =========================
           SAVE DATE
        ========================= */

        updatedAt: null

    };


    /* =====================================================
       STORAGE KEY
    ===================================================== */

    const STORAGE_KEY =
        "valora_admin_settings";


    /* =====================================================
       ELEMENT HELPER
    ===================================================== */

    function el(id) {

        return document.getElementById(id);

    }


    /* =====================================================
       LOAD SETTINGS
    ===================================================== */

    function loadSettings() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!saved) {

                return {
                    ...DEFAULT_SETTINGS
                };

            }


            const parsed =
                JSON.parse(saved);


            return {

                ...DEFAULT_SETTINGS,

                ...parsed

            };

        } catch (error) {

            console.error(
                "VALORA SETTINGS LOAD ERROR:",
                error
            );


            return {
                ...DEFAULT_SETTINGS
            };

        }

    }


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    function saveSettings(settings) {

        try {

            settings.updatedAt =
                new Date().toISOString();


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );


            return true;

        } catch (error) {

            console.error(
                "VALORA SETTINGS SAVE ERROR:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       SET INPUT VALUE
    ===================================================== */

    function setValue(
        id,
        value
    ) {

        const element =
            el(id);


        if (!element) return;


        if (
            element.type ===
            "checkbox"
        ) {

            element.checked =
                Boolean(value);

            return;

        }


        element.value =
            value ?? "";

    }


    /* =====================================================
       GET INPUT VALUE
    ===================================================== */

    function getValue(id) {

        const element =
            el(id);


        if (!element) {

            return null;

        }


        if (
            element.type ===
            "checkbox"
        ) {

            return element.checked;

        }


        if (
            element.type ===
            "number"
        ) {

            const value =
                Number(element.value);


            return Number.isFinite(value)
                ? value
                : 0;

        }


        return element.value;

    }


    /* =====================================================
       APPLY SETTINGS TO FORM
    ===================================================== */

    function applySettings(settings) {


        /* GENERAL */

        setValue(
            "siteName",
            settings.siteName
        );


        setValue(
            "siteStatus",
            settings.siteStatus
        );


        setValue(
            "maintenanceMessage",
            settings.maintenanceMessage
        );


        /* TRADING */

        setValue(
            "tradingEnabled",
            settings.tradingEnabled
        );


        setValue(
            "minimumTradeAmount",
            settings.minimumTradeAmount
        );


        setValue(
            "maximumTradeAmount",
            settings.maximumTradeAmount
        );


        setValue(
            "tradingFee",
            settings.tradingFee
        );


        /* DEPOSIT */

        setValue(
            "depositsEnabled",
            settings.depositsEnabled
        );


        setValue(
            "minimumDeposit",
            settings.minimumDeposit
        );


        setValue(
            "maximumDeposit",
            settings.maximumDeposit
        );


        /* WITHDRAWAL */

        setValue(
            "withdrawalsEnabled",
            settings.withdrawalsEnabled
        );


        setValue(
            "minimumWithdrawal",
            settings.minimumWithdrawal
        );


        setValue(
            "maximumWithdrawal",
            settings.maximumWithdrawal
        );


        setValue(
            "withdrawalFee",
            settings.withdrawalFee
        );


        /* KYC */

        setValue(
            "kycEnabled",
            settings.kycEnabled
        );


        setValue(
            "kycRequiredForTrading",
            settings.kycRequiredForTrading
        );


        setValue(
            "kycRequiredForWithdrawal",
            settings.kycRequiredForWithdrawal
        );


        setValue(
            "kycMinimumWithdrawal",
            settings.kycMinimumWithdrawal
        );


        /* SECURITY */

        setValue(
            "loginAttempts",
            settings.loginAttempts
        );


        setValue(
            "sessionTimeout",
            settings.sessionTimeout
        );


        /* NOTIFICATIONS */

        setValue(
            "emailNotifications",
            settings.emailNotifications
        );


        setValue(
            "systemNotifications",
            settings.systemNotifications
        );


        updateLastSaved(
            settings.updatedAt
        );

    }


    /* =====================================================
       COLLECT FORM SETTINGS
    ===================================================== */

    function collectSettings() {

        return {

            /* GENERAL */

            siteName:
                getValue("siteName"),

            siteStatus:
                getValue("siteStatus"),

            maintenanceMessage:
                getValue("maintenanceMessage"),


            /* TRADING */

            tradingEnabled:
                getValue("tradingEnabled"),

            minimumTradeAmount:
                getValue("minimumTradeAmount"),

            maximumTradeAmount:
                getValue("maximumTradeAmount"),

            tradingFee:
                getValue("tradingFee"),


            /* DEPOSIT */

            depositsEnabled:
                getValue("depositsEnabled"),

            minimumDeposit:
                getValue("minimumDeposit"),

            maximumDeposit:
                getValue("maximumDeposit"),


            /* WITHDRAWAL */

            withdrawalsEnabled:
                getValue("withdrawalsEnabled"),

            minimumWithdrawal:
                getValue("minimumWithdrawal"),

            maximumWithdrawal:
                getValue("maximumWithdrawal"),

            withdrawalFee:
                getValue("withdrawalFee"),


            /* KYC */

            kycEnabled:
                getValue("kycEnabled"),

            kycRequiredForTrading:
                getValue("kycRequiredForTrading"),

            kycRequiredForWithdrawal:
                getValue("kycRequiredForWithdrawal"),

            kycMinimumWithdrawal:
                getValue("kycMinimumWithdrawal"),


            /* SECURITY */

            loginAttempts:
                getValue("loginAttempts"),

            sessionTimeout:
                getValue("sessionTimeout"),


            /* NOTIFICATIONS */

            emailNotifications:
                getValue("emailNotifications"),

            systemNotifications:
                getValue("systemNotifications")

        };

    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateSettings(settings) {


        if (
            settings.minimumTradeAmount < 0 ||
            settings.maximumTradeAmount < 0
        ) {

            return {
                valid: false,
                message:
                    "مبالغ التداول لا يمكن أن تكون سالبة."
            };

        }


        if (
            settings.minimumTradeAmount >
            settings.maximumTradeAmount
        ) {

            return {
                valid: false,
                message:
                    "الحد الأدنى للتداول يجب أن يكون أقل من الحد الأقصى."
            };

        }


        if (
            settings.minimumDeposit < 0 ||
            settings.maximumDeposit < 0
        ) {

            return {
                valid: false,
                message:
                    "مبالغ الإيداع غير صحيحة."
            };

        }


        if (
            settings.minimumDeposit >
            settings.maximumDeposit
        ) {

            return {
                valid: false,
                message:
                    "الحد الأدنى للإيداع يجب أن يكون أقل من الحد الأقصى."
            };

        }


        if (
            settings.minimumWithdrawal < 0 ||
            settings.maximumWithdrawal < 0
        ) {

            return {
                valid: false,
                message:
                    "مبالغ السحب غير صحيحة."
            };

        }


        if (
            settings.minimumWithdrawal >
            settings.maximumWithdrawal
        ) {

            return {
                valid: false,
                message:
                    "الحد الأدنى للسحب يجب أن يكون أقل من الحد الأقصى."
            };

        }


        if (
            settings.tradingFee < 0
        ) {

            return {
                valid: false,
                message:
                    "رسوم التداول لا يمكن أن تكون سالبة."
            };

        }


        if (
            settings.withdrawalFee < 0
        ) {

            return {
                valid: false,
                message:
                    "رسوم السحب لا يمكن أن تكون سالبة."
            };

        }


        if (
            settings.loginAttempts < 1
        ) {

            return {
                valid: false,
                message:
                    "عدد محاولات الدخول يجب أن يكون على الأقل 1."
            };

        }


        if (
            settings.sessionTimeout < 1
        ) {

            return {
                valid: false,
                message:
                    "مدة الجلسة يجب أن تكون أكبر من صفر."
            };

        }


        return {
            valid: true
        };

    }


    /* =====================================================
       SAVE BUTTON
    ===================================================== */

    function handleSave() {

        const settings =
            collectSettings();


        const validation =
            validateSettings(
                settings
            );


        if (!validation.valid) {

            showMessage(
                validation.message,
                "error"
            );

            return;

        }


        const saved =
            saveSettings(settings);


        if (!saved) {

            showMessage(
                "حدث خطأ أثناء حفظ الإعدادات.",
                "error"
            );

            return;

        }


        updateLastSaved(
            settings.updatedAt
        );


        showMessage(
            "تم حفظ الإعدادات بنجاح.",
            "success"
        );


        console.log(
            "VALORA SETTINGS SAVED:",
            settings
        );

    }


    /* =====================================================
       RESET SETTINGS
    ===================================================== */

    function handleReset() {

        const confirmed =
            window.confirm(
                "هل تريد إعادة جميع الإعدادات إلى القيم الافتراضية؟"
            );


        if (!confirmed) return;


        const defaults = {
            ...DEFAULT_SETTINGS
        };


        saveSettings(defaults);


        applySettings(
            defaults
        );


        showMessage(
            "تمت إعادة الإعدادات الافتراضية.",
            "success"
        );

    }


    /* =====================================================
       STATUS MESSAGE
    ===================================================== */

    function showMessage(
        message,
        type
    ) {

        let box =
            el("settingsMessage");


        if (!box) {

            box =
                document.createElement(
                    "div"
                );


            box.id =
                "settingsMessage";


            box.className =
                "settings-message";


            const content =
                document.querySelector(
                    ".admin-content"
                );


            if (content) {

                content.prepend(box);

            } else {

                document.body.prepend(box);

            }

        }


        box.textContent =
            message;


        box.dataset.type =
            type;


        box.hidden = false;


        clearTimeout(
            box._timer
        );


        box._timer =
            setTimeout(
                function () {

                    box.hidden = true;

                },
                4000
            );

    }


    /* =====================================================
       LAST SAVED
    ===================================================== */

    function updateLastSaved(
        date
    ) {

        const element =
            el("settingsLastSaved");


        if (!element) return;


        if (!date) {

            element.textContent =
                "لم يتم الحفظ بعد";

            return;

        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            element.textContent =
                "—";

            return;

        }


        element.textContent =
            parsed.toLocaleString(
                "ar",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );

    }


    /* =====================================================
       TOGGLE DEPENDENCIES
    ===================================================== */

    function updateDependencies() {


        const trading =
            el("tradingEnabled");


        const tradingFields = [

            "minimumTradeAmount",

            "maximumTradeAmount",

            "tradingFee"

        ];


        if (trading) {

            tradingFields.forEach(
                function (id) {

                    const element =
                        el(id);

                    if (element) {

                        element.disabled =
                            !trading.checked;

                    }

                }
            );

        }


        const deposits =
            el("depositsEnabled");


        const depositFields = [

            "minimumDeposit",

            "maximumDeposit"

        ];


        if (deposits) {

            depositFields.forEach(
                function (id) {

                    const element =
                        el(id);

                    if (element) {

                        element.disabled =
                            !deposits.checked;

                    }

                }
            );

        }


        const withdrawals =
            el("withdrawalsEnabled");


        const withdrawalFields = [

            "minimumWithdrawal",

            "maximumWithdrawal",

            "withdrawalFee",

            "kycMinimumWithdrawal"

        ];


        if (withdrawals) {

            withdrawalFields.forEach(
                function (id) {

                    const element =
                        el(id);

                    if (element) {

                        element.disabled =
                            !withdrawals.checked;

                    }

                }
            );

        }


        const kyc =
            el("kycEnabled");


        const kycFields = [

            "kycRequiredForTrading",

            "kycRequiredForWithdrawal",

            "kycMinimumWithdrawal"

        ];


        if (kyc) {

            kycFields.forEach(
                function (id) {

                    const element =
                        el(id);

                    if (element) {

                        element.disabled =
                            !kyc.checked;

                    }

                }
            );

        }

    }


    /* =====================================================
       ADD EVENT LISTENERS
    ===================================================== */

    function bindEvents() {


        /* SAVE */

        const saveButton =
            el("saveSettings");


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                handleSave
            );

        }


        /* RESET */

        const resetButton =
            el("resetSettings");


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                handleReset
            );

        }


        /* TOGGLES */

        [

            "tradingEnabled",

            "depositsEnabled",

            "withdrawalsEnabled",

            "kycEnabled"

        ].forEach(
            function (id) {

                const element =
                    el(id);


                if (!element) return;


                element.addEventListener(
                    "change",
                    updateDependencies
                );

            }
        );


        /* SAVE WITH CTRL + S */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    (event.ctrlKey ||
                     event.metaKey) &&
                    event.key.toLowerCase() === "s"
                ) {

                    event.preventDefault();

                    handleSave();

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "VALORA SETTINGS JS LOADED"
        );


        const settings =
            loadSettings();


        applySettings(
            settings
        );


        bindEvents();


        updateDependencies();

    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
