// ==========================================
// VALORA ADMIN SETTINGS
// ==========================================

"use strict";


// ==========================================
// STORAGE KEYS
// ==========================================

const VALORA_SETTINGS_KEY =
    "VALORA_ADMIN_SETTINGS";

const VALORA_LANGUAGE_KEY =
    "VALORA_LANG";


// ==========================================
// DEFAULT SETTINGS
// ==========================================

const DEFAULT_SETTINGS = {

    trading: {

        tradingEnabled: true,

        minimumTradeAmount: 10,

        maximumTradeAmount: 1000,

        minimumTradingBalance: 10,

        tradeDuration: 15,

        profitReleaseDelay: 15,

        defaultProfitRate: 80,

        dailyTradeLimit: 50

    },


    deposits: {

        depositsEnabled: true,

        minimumDepositAmount: 10,

        maximumDepositAmount: 10000,

        requiredDepositConfirmations: 3

    },


    withdrawals: {

        withdrawalsEnabled: true,

        withdrawalsManualReview: true,

        minimumWithdrawalAmount: 10,

        maximumWithdrawalAmount: 5000,

        dailyWithdrawalLimit: 10000,

        withdrawalFee: 2

    },


    accounts: {

        registrationEnabled: true,

        minimumAccountBalance: 0,

        maximumAccountBalance: 100000,

        accountDailyTradeLimit: 50,

        dailyWithdrawalRequestsLimit: 5

    },


    system: {

        maintenanceMode: false,

        platformName: "VALORA",

        defaultCurrency: "USDT",

        platformTimezone: "Asia/Baghdad",

        globalTradingStatus: true,

        globalDepositsStatus: true,

        globalWithdrawalsStatus: true,

        siteDefaultLanguage: "ar"

    }

};


// ==========================================
// LOAD SETTINGS
// ==========================================

function loadAdminSettings() {

    let savedSettings = {};

    try {

        savedSettings =
            JSON.parse(
                localStorage.getItem(
                    VALORA_SETTINGS_KEY
                )
            ) || {};

    } catch (error) {

        savedSettings = {};

    }


    return mergeSettings(
        DEFAULT_SETTINGS,
        savedSettings
    );

}


// ==========================================
// MERGE SETTINGS
// ==========================================

function mergeSettings(defaults, saved) {

    const result = {};


    Object.keys(defaults).forEach(
        function (section) {

            result[section] = {

                ...defaults[section],

                ...(saved[section] || {})

            };

        }
    );


    return result;

}


// ==========================================
// SAVE SETTINGS
// ==========================================

function saveAdminSettings(settings) {

    try {

        localStorage.setItem(

            VALORA_SETTINGS_KEY,

            JSON.stringify(settings)

        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save VALORA settings:",
            error
        );

        return false;

    }

}


// ==========================================
// SET LANGUAGE
// ==========================================

function saveDefaultLanguage(language) {

    if (
        language !== "ar" &&
        language !== "en"
    ) {

        language = "ar";

    }


    const settings =
        loadAdminSettings();


    settings.system.siteDefaultLanguage =
        language;


    saveAdminSettings(
        settings
    );


    /*
    ==========================================
    TEMPORARY LANGUAGE BRIDGE

    The official website can read VALORA_LANG
    during the frontend testing stage.

    Later this setting will move to the
    server/database.
    ==========================================
    */

    localStorage.setItem(
        VALORA_LANGUAGE_KEY,
        language
    );


    applyDocumentLanguage(
        language
    );

}


// ==========================================
// APPLY DOCUMENT LANGUAGE
// ==========================================

function applyDocumentLanguage(language) {

    if (
        language !== "ar" &&
        language !== "en"
    ) {

        language = "ar";

    }


    document.documentElement.lang =
        language;


    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    if (
        typeof window.applyLanguage ===
        "function"
    ) {

        try {

            window.applyLanguage(
                language
            );

        } catch (error) {

            console.warn(
                "applyLanguage() error:",
                error
            );

        }

    }

}


// ==========================================
// GET ELEMENT
// ==========================================

function getSettingsElement(id) {

    return document.getElementById(id);

}


// ==========================================
// SET VALUE
// ==========================================

function setSettingsValue(
    id,
    value
) {

    const element =
        getSettingsElement(id);


    if (!element) {

        return;

    }


    if (
        element.type ===
        "checkbox"
    ) {

        element.checked =
            Boolean(value);

    }

    else {

        element.value =
            value ?? "";

    }

}


// ==========================================
// GET VALUE
// ==========================================

function getSettingsValue(id) {

    const element =
       
