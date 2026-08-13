/* =========================================================
   VALORA ADMIN — TRADE CODES
   ========================================================= */

(function () {

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    initTradeCodes
);


/* =========================================================
   STATE
========================================================= */

const tradeState = {

    codes: [],

    activeCode: null,

    timer: null

};


/* =========================================================
   INIT
========================================================= */

function initTradeCodes() {

    loadCodes();

    setupGenerator();

    renderHistory();

    updateCurrentTrade();

}


/* =========================================================
   GENERATE BUTTON
========================================================= */

function setupGenerator() {

    const button =
        document.getElementById(
            "generateCode"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        generateNewCode
    );

}


/* =========================================================
   GENERATE NEW CODE
========================================================= */

function generateNewCode() {

    /*
    لا نسمح بوجود كود فعال آخر
    في نفس الوقت.
    */

    if (tradeState.activeCode) {

        const stillActive =
            tradeState.activeCode.expiresAt >
            Date.now();

        if (stillActive) {

            showMessage(
                "يوجد كود فعال حالياً. انتظر انتهاء صلاحيته."
            );

            return;

        }

    }


    const tradeNumber =
        getNextTradeNumber();


    const profit =
        getProfitPercent(
            tradeNumber
        );


    const code =
        createRandomCode();


    const createdAt =
        Date.now();


    const expiresAt =
        createdAt +
        (15 * 60 * 1000);


    const trade = {

        id:
            Date.now().toString(),

        code:

            code,

        tradeNumber:

            tradeNumber,

        profit:

            profit,

        createdAt:

            createdAt,

        expiresAt:

            expiresAt,

        status:

            "active",

        used:

            false

    };


    tradeState.codes.unshift(
        trade
    );


    tradeState.activeCode =
        trade;


    saveCodes();


    renderCurrentTrade();


    renderHistory();


    startTimer();


}


/* =========================================================
   TRADE NUMBER
========================================================= */

function getNextTradeNumber() {

    /*
    تجريبيًا:
    الصفقة 1 ثم 2 ثم 3 ثم 4 ثم 5
    وبعد الخامسة نعود للأولى.
    */

    const lastTrade =
        tradeState.codes[0];


    if (!lastTrade) {

        return 
