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


        if (period === "today") {

            return (

                date.getFullYear() ===
                now.getFullYear()

                &&

                date.getMonth() ===
                now.getMonth()

                &&

                date.getDate() ===
                now.getDate()

            );

        }


        if (period === "week") {

            const weekStart =
                new Date(now);

            weekStart.setDate(
                now.getDate() - 7
            );


            return date >= weekStart;

        }


        if (period === "month") {

            return (

                date.getFullYear() ===
                now.getFullYear()

                &&

                date.getMonth() ===
                now.getMonth()

            );

        }


        return true;

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    function renderStatistics(
        deposits
    ) {

        const today =
            deposits.filter(
                function (deposit) {

                    return matchesPeriod(
                        deposit.date,
                        "today"
                    );

                }
            );


        const todayAmount =
            today.reduce(
                function (total, deposit) {

                    return total +
                        Number(
                            deposit.amount || 0
                        );

                },
                0
            );


        const totalAmount =
            deposits.reduce(
                function (total, deposit) {

                    return total +
                        Number(
                            deposit.amount || 0
                        );

                },
                0
            );


        setText(
            "depositsToday",
            today.length
        );


        setText(
            "depositAmountToday",
            formatMoney(
                todayAmount
            )
        );


        setText(
            "totalDeposits",
            deposits.length
        );


        setText(
            "totalDepositAmount",
            formatMoney(
                totalAmount
            )
        );

    }


    /* =====================================================
       TABLE
    ===================================================== */

    function renderTable(
        deposits
    ) {

        const body =
            document.getElementById(
                "depositsBody"
            );


        const empty =
            document.getElementById(
                "depositsEmpty"
            );


        if (!body) {
            return;
        }


        body.innerHTML = "";


        if (
            !deposits ||
            deposits.length === 0
        ) {

            if (empty) {
                empty.hidden = false;
            }

            return;

        }


        if (empty) {
            empty.hidden = true;
        }


        deposits.forEach(
            function (deposit) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="deposit-user">

                            <strong>
                                ${escapeHTML(
                                    deposit.user
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    deposit.email || ""
                                )}
                            </span>

                        </div>

                    </td>


                    <td>
                        ${escapeHTML(
                            deposit.uid
                        )}
                    </td>


                    <td>

                        <strong class="deposit-amount">
                            ${formatMoney(
                                deposit.amount
                            )}
                        </strong>

                    </td>


                    <td>

                        <span class="deposit-network">
                            ${escapeHTML(
                                deposit.network
                            )}
                        </span>

                    </td>


                    <td>

                        <div
                            class="deposit-txid"
                            title="${escapeHTML(
                                deposit.txid
                            )}"
                        >
                            ${escapeHTML(
                                deposit.txid
                            )}
                        </div>

                    </td>


                    <td>
                        ${formatDate(
                            deposit.date
                        )}
                    </td>


                    <td>

                        <span class="deposit-status">
                            مكتمل
                        </span>

                    </td>

                `;


                body.appendChild(
                    row
                );

            }
        );

    }


    /* =====================================================
       REFRESH
    ===================================================== */

    function showRefreshState() {

        const button =
            document.getElementById(
                "refreshDeposits"
            );


        if (!button) {
            return;
        }


        const originalText =
            button.textContent;


        button.textContent =
            "✓ تم التحديث";


        button.disabled = true;


        setTimeout(
            function () {

                button.textContent =
                    originalText;

                button.disabled =
                    false;

            },
            900
        );

    }


    /* =====================================================
       HELPERS
    ===================================================== */

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {
            return;
        }


        element.textContent =
            value ?? "0";

    }


    function formatMoney(
        value
    ) {

        return (
            Number(
                value || 0
            )
            .toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
            +
            " USDT"
        );

    }


    function formatDate(
        value
    ) {

        if (!value) {
            return "—";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleString(
            "ar",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    function escapeHTML(
        value
    ) {

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


})();
