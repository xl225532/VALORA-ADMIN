ملف settings.js

"use strict";

/*
=========================================================
VALORA ADMIN SETTINGS
=========================================================

هذا الملف مسؤول عن:

1. تحميل الإعدادات.
2. حفظ إعدادات التداول.
3. حفظ إعدادات الإيداعات.
4. حفظ إعدادات السحوبات.
5. حفظ عناوين السحب.
6. حفظ إعدادات الحسابات.
7. حفظ إعدادات النظام.
8. تحديد اللغة الأساسية للموقع.
9. إجراءات إيقاف التداول والصيانة.

=========================================================
*/


/* =====================================================
   STORAGE KEYS
===================================================== */

const VALORA_SETTINGS_KEY =
    "VALORA_ADMIN_SETTINGS";

const VALORA_LANGUAGE_KEY =
    "VALORA_LANG";

const VALORA_WITHDRAW_ADDRESSES_KEY =
    "VALORA_WITHDRAW_ADDRESSES";


/* =====================================================
   DEFAULT SETTINGS
===================================================== */

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

        siteDefaultLanguage: "ar",

        globalTradingStatus: true,

        globalDepositsStatus: true,

        globalWithdrawalsStatus: true

    }

};


/* =====================================================
   DEFAULT WITHDRAWAL ADDRESSES
===================================================== */

const DEFAULT_WITHDRAWAL_ADDRESSES = {

    USDT_TRON:

        "",

    USDT_ERC20:

        "",

    BTC:

        "",

    ETH:

        "",

    TRX:

        ""

};


/* =====================================================
   GET SETTINGS
===================================================== */

function getAdminSettings() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    VALORA_SETTINGS_KEY
                )
            );

        if (
            saved &&
            typeof saved === "object"
        ) {

            return mergeSettings(
                DEFAULT_SETTINGS,
                saved
            );

        }

    }

    catch (error) {

        console.error(
            "VALORA settings load error:",
            error
        );

    }


    return cloneObject(
        DEFAULT_SETTINGS
    );

}


/* =====================================================
   MERGE SETTINGS
===================================================== */

function mergeSettings(
    defaults,
    saved
) {

    const result = {};


    Object.keys(defaults).forEach(
        function (section) {

            result[section] = {

                ...defaults[section],

                ...(
                    saved &&
                    saved[section]
                        ? saved[section]
                        : {}
                )

            };

        }
    );


    return result;

}


/* =====================================================
   CLONE OBJECT
===================================================== */

function cloneObject(object) {

    return JSON.parse(
        JSON.stringify(object)
    );

}


/* =====================================================
   SAVE SETTINGS
===================================================== */

function saveAdminSettings(
    settings
) {

    localStorage.setItem(

        VALORA_SETTINGS_KEY,

        JSON.stringify(settings)

    );

}


/* =====================================================
   GET WITHDRAWAL ADDRESSES
===================================================== */

function getWithdrawalAddresses() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    VALORA_WITHDRAW_ADDRESSES_KEY
                )
            );

        if (
            saved &&
            typeof saved === "object"
        ) {

            return {

                ...DEFAULT_WITHDRAWAL_ADDRESSES,

                ...saved

            };

        }

    }

    catch (error) {

        console.error(
            "VALORA withdrawal addresses load error:",
            error
        );

    }


    return {

        ...DEFAULT_WITHDRAWAL_ADDRESSES

    };

}


/* =====================================================
   SAVE WITHDRAWAL ADDRESSES
===================================================== */

function saveWithdrawalAddresses() {

    const addresses = {

        USDT_TRON:
            getValue(
                "withdrawAddressUSDTTRC20"
            ),

        USDT_ERC20:
            getValue(
                "withdrawAddressUSDTERC20"
            ),

        BTC:
            getValue(
                "withdrawAddressBTC"
            ),

        ETH:
            getValue(
                "withdrawAddressETH"
            ),

        TRX:
            getValue(
                "withdrawAddressTRX"
            )

    };


    localStorage.setItem(

        VALORA_WITHDRAW_ADDRESSES_KEY,

        JSON.stringify(addresses)

    );


    showSaveStatus(
        "تم حفظ عناوين السحب بنجاح."
    );

}


/* =====================================================
   LOAD WITHDRAWAL ADDRESSES
===================================================== */

function loadWithdrawalAddresses() {

    const addresses =
        getWithdrawalAddresses();


    setValue(
        "withdrawAddressUSDTTRC20",
        addresses.USDT_TRON
    );


    setValue(
        "withdrawAddressUSDTERC20",
        addresses.USDT_ERC20
    );


    setValue(
        "withdrawAddressBTC",
        addresses.BTC
    );


    setValue(
        "withdrawAddressETH",
        addresses.ETH
    );


    setValue(
        "withdrawAddressTRX",
        addresses.TRX
    );

}


/* =====================================================
   LOAD SETTINGS INTO FORM
===================================================== */

function loadAdminSettings() {

    const settings =
        getAdminSettings();


    /* =========================
       TRADING
    ========================= */

    setChecked(
        "tradingEnabled",
        settings.trading.tradingEnabled
    );


    setValue(
        "minimumTradeAmount",
        settings.trading.minimumTradeAmount
    );


    setValue(
        "maximumTradeAmount",
        settings.trading.maximumTradeAmount
    );


    setValue(
        "minimumTradingBalance",
        settings.trading.minimumTradingBalance
    );


    setValue(
        "tradeDuration",
        settings.trading.tradeDuration
    );


    setValue(
        "profitReleaseDelay",
        settings.trading.profitReleaseDelay
    );


    setValue(
        "defaultProfitRate",
        settings.trading.defaultProfitRate
    );


    setValue(
        "dailyTradeLimit",
        settings.trading.dailyTradeLimit
    );


    /* =========================
       DEPOSITS
    ========================= */

    setChecked(
        "depositsEnabled",
        settings.deposits.depositsEnabled
    );


    setValue(
        "minimumDepositAmount",
        settings.deposits.minimumDepositAmount
    );


    setValue(
        "maximumDepositAmount",
        settings.deposits.maximumDepositAmount
    );


    setValue(
        "requiredDepositConfirmations",
        settings.deposits.requiredDepositConfirmations
    );


    /* =========================
       WITHDRAWALS
    ========================= */

    setChecked(
        "withdrawalsEnabled",
        settings.withdrawals.withdrawalsEnabled
    );


    setChecked(
        "withdrawalsManualReview",
        settings.withdrawals.withdrawalsManualReview
    );


    setValue(
        "minimumWithdrawalAmount",
        settings.withdrawals.minimumWithdrawalAmount
    );


    setValue(
        "maximumWithdrawalAmount",
        settings.withdrawals.maximumWithdrawalAmount
    );


    setValue(
        "dailyWithdrawalLimit",
        settings.withdrawals.dailyWithdrawalLimit
    );


    setValue(
        "withdrawalFee",
        settings.withdrawals.withdrawalFee
    );


    /* =========================
       ACCOUNTS
    ========================= */

    setChecked(
        "registrationEnabled",
        settings.accounts.registrationEnabled
    );


    setValue(
        "minimumAccountBalance",
        settings.accounts.minimumAccountBalance
    );


    setValue(
        "maximumAccountBalance",
        settings.accounts.maximumAccountBalance
    );


    setValue(
        "accountDailyTradeLimit",
        settings.accounts.accountDailyTradeLimit
    );


    setValue(
        "dailyWithdrawalRequestsLimit",
        settings.accounts.dailyWithdrawalRequestsLimit
    );


    /* =========================
       SYSTEM
    ========================= */

    setChecked(
        "maintenanceMode",
        settings.system.maintenanceMode
    );


    setValue(
        "platformName",
        settings.system.platformName
    );


    setValue(
        "defaultCurrency",
        settings.system.defaultCurrency
    );


    setValue(
        "platformTimezone",
        settings.system.platformTimezone
    );


    setValue(
        "siteDefaultLanguage",
        settings.system.siteDefaultLanguage
    );


    setChecked(
        "globalTradingStatus",
        settings.system.globalTradingStatus
    );


    setChecked(
        "globalDepositsStatus",
        settings.system.globalDepositsStatus
    );


    setChecked(
        "globalWithdrawalsStatus",
        settings.system.globalWithdrawalsStatus
    );


    /* =========================
       WITHDRAWAL ADDRESSES
    ========================= */

    loadWithdrawalAddresses();

}


/* =====================================================
   SAVE SECTION
===================================================== */

function saveSettingsSection(
    section
) {

    const settings =
        getAdminSettings();


    switch (section) {


        /* =========================
           TRADING
        ========================= */

        case "trading":

            settings.trading = {

                tradingEnabled:
                    getChecked(
                        "tradingEnabled"
                    ),

                minimumTradeAmount:
                    getNumber(
                        "minimumTradeAmount"
                    ),

                maximumTradeAmount:
                    getNumber(
                        "maximumTradeAmount"
                    ),

                minimumTradingBalance:
                    getNumber(
                        "minimumTradingBalance"
                    ),

                tradeDuration:
                    getNumber(
                        "tradeDuration"
                    ),

                profitReleaseDelay:
                    getNumber(
                        "profitReleaseDelay"
                    ),

                defaultProfitRate:
                    getNumber(
                        "defaultProfitRate"
                    ),

                dailyTradeLimit:
                    getNumber(
                        "dailyTradeLimit"
                    )

            };


            saveAdminSettings(
                settings
            );


            showSaveStatus(
                "تم حفظ إعدادات التداول."
            );

            break;


        /* =========================
           DEPOSITS
        ========================= */

        case "deposits":

            settings.deposits = {

                depositsEnabled:
                    getChecked(
                        "depositsEnabled"
                    ),

                minimumDepositAmount:
                    getNumber(
                        "minimumDepositAmount"
                    ),

                maximumDepositAmount:
                    getNumber(
                        "maximumDepositAmount"
                    ),

                requiredDepositConfirmations:
                    getNumber(
                        "requiredDepositConfirmations"
                    )

            };


            saveAdminSettings(
                settings
            );


            showSaveStatus(
                "تم حفظ إعدادات الإيداعات."
            );

            break;


        /* =========================
           WITHDRAWALS
        ========================= */

        case "withdrawals":

            settings.withdrawals = {

                withdrawalsEnabled:
                    getChecked(
                        "withdrawalsEnabled"
                    ),

                withdrawalsManualReview:
                    getChecked(
                        "withdrawalsManualReview"
                    ),

                minimumWithdrawalAmount:
                    getNumber(
                        "minimumWithdrawalAmount"
                    ),

                maximumWithdrawalAmount:
                    getNumber(
                        "maximumWithdrawalAmount"
                    ),

                dailyWithdrawalLimit:
                    getNumber(
                        "dailyWithdrawalLimit"
                    ),

                withdrawalFee:
                    getNumber(
                        "withdrawalFee"
                    )

            };


            saveAdminSettings(
                settings
            );


            showSaveStatus(
                "تم حفظ إعدادات السحوبات."
            );

            break;


        /* =========================
           WITHDRAWAL ADDRESSES
        ========================= */

        case "withdrawalAddresses":

            saveWithdrawalAddresses();

            break;


        /* =========================
           ACCOUNTS
        ========================= */

        case "accounts":

            settings.accounts = {

                registrationEnabled:
                    getChecked(
                        "registrationEnabled"
                    ),

                minimumAccountBalance:
                    getNumber(
                        "minimumAccountBalance"
                    ),

                maximumAccountBalance:
                    getNumber(
                        "maximumAccountBalance"
                    ),

                accountDailyTradeLimit:
                    getNumber(
                        "accountDailyTradeLimit"
                    ),

                dailyWithdrawalRequestsLimit:
                    getNumber(
                        "dailyWithdrawalRequestsLimit"
                    )

            };


            saveAdminSettings(
                settings
            );


            showSaveStatus(
                "تم حفظ إعدادات الحسابات."
            );

            break;


        /* =========================
           SYSTEM
        ========================= */

        case "system":

            let language =
                getValue(
                    "siteDefaultLanguage"
                );


            if (
                language !== "ar" &&
                language !== "en"
            ) {

                language = "ar";

            }


            settings.system = {

                maintenanceMode:
                    getChecked(
                        "maintenanceMode"
                    ),

                platformName:
                    getValue(
                        "platformName"
                    ) || "VALORA",

                defaultCurrency:
                    getValue(
                        "defaultCurrency"
                    ) || "USDT",

                platformTimezone:
                    getValue(
                        "platformTimezone"
                    ) || "Asia/Baghdad",

                siteDefaultLanguage:
                    language,

                globalTradingStatus:
                    getChecked(
                        "globalTradingStatus"
                    ),

                globalDepositsStatus:
                    getChecked(
                        "globalDepositsStatus"
                    ),

                globalWithdrawalsStatus:
                    getChecked(
                        "globalWithdrawalsStatus"
                    )

            };


            saveAdminSettings(
                settings
            );


            /*
            =================================================
            LANGUAGE
            =================================================

            هذا المفتاح هو الذي تستخدمه صفحات الموقع
            التي تعتمد على language.js.

            =================================================
            */

            localStorage.setItem(
                VALORA_LANGUAGE_KEY,
                language
            );


            applyDocumentLanguage(
                language
            );


            showSaveStatus(
                "تم حفظ إعدادات النظام واللغة."
            );

            break;

    }

}


/* =====================================================
   APPLY DOCUMENT LANGUAGE
===================================================== */

function applyDocumentLanguage(
    language
) {

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

}


/* =====================================================
   GET VALUE
===================================================== */

function getValue(
    id
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/* =====================================================
   SET VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.value =
        value ?? "";

}


/* =====================================================
   GET NUMBER
===================================================== */

function getNumber(
    id
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return 0;

    }


    const value =
        Number(
            element.value
        );


    if (
        !Number.isFinite(value)
    ) {

        return 0;

    }


    return value;

}


/* =====================================================
   GET CHECKED
===================================================== */

function getChecked(
    id
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return false;

    }


    return Boolean(
        element.checked
    );

}


/* =====================================================
   SET CHECKED
===================================================== */

function setChecked(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.checked =
        Boolean(value);

}


/* =====================================================
   SAVE STATUS
===================================================== */

function showSaveStatus(
    message
) {

    const status =
        document.getElementById(
            "settingsSaveStatus"
        );


    if (!status) {

        return;

    }


    status.textContent =
        "آخر حالة: " + message;


    status.classList.add(
        "is-saved"
    );


    clearTimeout(
        window.valoraSaveStatusTimer
    );


    window.valoraSaveStatusTimer =
        setTimeout(
            function () {

                status.classList.remove(
                    "is-saved"
                );

            },
            3000
        );

}


/* =====================================================
   DANGER ACTIONS
===================================================== */

function setupDangerActions() {


    const disableTrading =
        document.getElementById(
            "disableAllTrading"
        );


    if (disableTrading) {

        disableTrading.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "هل تريد إيقاف التداول بالكامل؟"
                    );


                if (!confirmed) {

                    return;

                }


                const settings =
                    getAdminSettings();


                settings.trading.tradingEnabled =
                    false;


                settings.system.globalTradingStatus =
                    false;


                saveAdminSettings(
                    settings
                );


                setChecked(
                    "tradingEnabled",
                    false
                );


                setChecked(
                    "globalTradingStatus",
                    false
                );


                showSaveStatus(
                    "تم إيقاف التداول."
                );

            }
        );

    }


    const enableMaintenance =
        document.getElementById(
            "enableMaintenance"
        );


    if (enableMaintenance) {

        enableMaintenance.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "هل تريد تفعيل وضع الصيانة؟"
                    );


                if (!confirmed) {

                    return;

                }


                const settings =
                    getAdminSettings();


                settings.system.maintenanceMode =
                    true;


                saveAdminSettings(
                    settings
                );


                setChecked(
                    "maintenanceMode",
                    true
                );


                showSaveStatus(
                    "تم تفعيل وضع الصيانة."
                );

            }
        );

    }

}


/* =====================================================
   BUTTONS
===================================================== */

function setupSaveButtons() {

    document
        .querySelectorAll(
            ".settings-save-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const section =
                            button.dataset.section;


                        saveSettingsSection(
                            section
                        );

                    }
                );

            }
        );

}


/* =====================================================
   LANGUAGE PREVIEW
===================================================== */

function setupLanguageSelector() {

    const selector =
        document.getElementById(
            "siteDefaultLanguage"
        );


    if (!selector) {

        return;

    }


    selector.addEventListener(
        "change",
        function () {

            const language =
                selector.value;


            applyDocumentLanguage(
                language
            );

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminSettings();

        setupSaveButtons();

        setupDangerActions();

        setupLanguageSelector();

    }
);
