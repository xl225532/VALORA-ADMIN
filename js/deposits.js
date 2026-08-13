/* =========================================================
   VALORA ADMIN — DEPOSITS
   واجهة الإيداعات — جاهزة للربط مع API لاحقًا
========================================================= */

(function () {

    "use strict";


    document.addEventListener(
        "DOMContentLoaded",
        initDeposits
    );


    /* =====================================================
       STATE
    ===================================================== */

    const depositsState = {

        deposits: [],

        search: "",

        period: "all"

    };


    /* =====================================================
       INIT
    ===================================================== */

    function initDeposits() {

        setupEvents();

        render();

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    function setupEvents() {

        const search =
            document.getElementById(
                "depositSearch"
            );


        const period =
            document.getElementById(
                "depositPeriod"
            );


        const refresh =
            document.getElementById(
                "refreshDeposits"
            );


        if (search) {

            search.addEventListener(
                "input",
                function () {

                    depositsState.search =
                        this.value
                            .trim()
                            .toLowerCase();

                    render();

                }
            );

        }


        if (period) {

            period.addEventListener(
                "change",
                function () {

                    depositsState.period =
                        this.value;

                    render();

                }
            );

        }


        if (refresh) {

            refresh.addEventListener(
                "click",
                function () {

                    render();

                    showRefreshState();

                }
            );

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function render() {

        const deposits =
            getFilteredDeposits();


        renderStatistics(
            deposits
        );


        renderTable(
            deposits
        );

    }


    /* =====================================================
       FILTER
    ===================================================== */

    function getFilteredDeposits() {

        let result =
            depositsState.deposits.slice();


        const search =
            depositsState.search;


        if (search) {

            result =
                result.filter(
                    function (deposit) {

                        return (

                            String(
                                deposit.user
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                deposit.uid
                            )
                            .toLowerCase()
                            .includes(search)

                            ||

                            String(
                                deposit.txid
                            )
                            .toLowerCase()
                            .includes(search)

                        );

                    }
                );

        }


        if (
            depositsState.period !==
            "all"
        ) {

            result =
                result.filter(
                    function (deposit) {

                        return matchesPeriod(
                            deposit.date,
                            depositsState.period
                        );

                    }
                );

        }


        return result;

    }


    /* =====================================================
       PERIOD
    ===================================================== */

    function matchesPeriod(
        dateValue,
        period
    ) {

        if (!dateValue) {
            return false;
        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return false;

        }


        const now =
            new Date();


        if (period === "today
