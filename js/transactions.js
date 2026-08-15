/* =========================================================
   VALORA ADMIN — TRANSACTIONS
   TRANSACTIONS MANAGEMENT
========================================================= */

(function () {

    "use strict";


    /* =====================================================
        DATA
    ===================================================== */

    let transactions = [];


    let selectedTransaction = null;


    /* =====================================================
       ELEMENT HELPER
    ===================================================== */

    function el(id) {

        return document.getElementById(id);

    }



    /* =====================================================
       FORMAT AMOUNT
    ===================================================== */

    function formatAmount(value) {

        const number =
            Number(value || 0);


        return number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }



    /* =====================================================
       TYPE TEXT
    ===================================================== */

    function typeText(type) {

        const types = {

            deposit: "إيداع",

            withdrawal: "سحب",

            trade: "تداول",

            credit: "إضافة رصيد",

            debit: "خصم رصيد",

            fee: "رسوم"

        };


        return types[type] || type;

    }



    /* =====================================================
       STATUS TEXT
    ===================================================== */

    function statusText(status) {

        const statuses = {

            pending: "قيد الانتظار",

            processing: "قيد التنفيذ",

            completed: "مكتملة",

            rejected: "مرفوضة"

        };


        return statuses[status] || status;

    }



    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }



    /* =====================================================
       TYPE CLASS
    ===================================================== */

    function typeClass(type) {

        return "transaction-type-" +
            escapeHtml(type);

    }



    /* =====================================================
       AMOUNT CLASS
    ===================================================== */

    function amountClass(type) {

        if (
            type === "deposit" ||
            type === "credit"
        ) {

            return "transaction-amount-positive";

        }


        if (
            type === "withdrawal" ||
            type === "debit" ||
            type === "fee"
        ) {

            return "transaction-amount-negative";

        }


        return "";

    }



    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTransactions(list) {

        const body =
            el("transactionsBody");


        if (!body) return;


        if (!list.length) {

            body.innerHTML = `

                <tr>

                    <td
                        colspan="15"
                        class="transactions-empty"
                    >

                        <div class="transactions-empty-icon">
                            ⇄
                        </div>

                        <strong>
                            لا توجد معاملات
                        </strong>

                        <span>
                            لم يتم العثور على معاملات مطابقة للبحث.
                        </span>

                    </td>

                </tr>

            `;


            updateStats();


            updateResultCount(0);


            return;

        }



        body.innerHTML =
            list.map(
                function (transaction, index) {

                    return `

                        <tr
                            data-id="${escapeHtml(transaction.id)}"
                        >

                            <td>
                                ${index + 1}
                            </td>


                            <td>

                                <strong
                                    dir="ltr"
                                >
                                    ${escapeHtml(transaction.id)}
                                </strong>

                            </td>


                            <td>

                                <strong>
                                    ${escapeHtml(transaction.userName)}
                                </strong>

                            </td>


                            <td dir="ltr">
                                ${escapeHtml(transaction.uid)}
                            </td>


                            <td>

                                <span
                                    class="transaction-type ${typeClass(transaction.type)}"
                                >
                                    ${typeText(transaction.type)}
                                </span>

                            </td>


                            <td>

                                <strong
                                    class="transaction-amount ${amountClass(transaction.type)}"
                                >
                                    ${formatAmount(transaction.amount)}
                                </strong>

                            </td>


                            <td>
                                ${escapeHtml(transaction.currency)}
                            </td>


                            <td>
                                ${formatAmount(transaction.balanceBefore)}
                            </td>


                            <td>
                                ${formatAmount(transaction.balanceAfter)}
                            </td>


                            <td>

                                <span
                                    class="transaction-status status-${escapeHtml(transaction.status)}"
                                >
                                    ${statusText(transaction.status)}
                                </span>

                            </td>


                            <td>
                                ${escapeHtml(transaction.date)}
                            </td>


                            <td>
                                ${escapeHtml(transaction.time)}
                            </td>


                            <td>

                                <div
                                    class="transaction-reference"
                                    title="${escapeHtml(transaction.reference)}"
                                >
                                    ${escapeHtml(transaction.reference)}
                                </div>

                            </td>


                            <td>

                                ${
                                    transaction.notes
                                    ? escapeHtml(transaction.notes)
                                    : "—"
                                }

                            </td>


                            <td>

                                <div
                                    class="transaction-actions"
                                >

                                    <button
                                        type="button"
                                        class="transaction-details-button"
                                        data-action="details"
                                        data-id="${escapeHtml(transaction.id)}"
                                    >
                                        التفاصيل
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }
            ).join("");


        updateResultCount(list.length);

    }



    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStats() {

        const total =
            transactions.length;


        const deposits =
            transactions.filter(
                item =>
                    item.type === "deposit"
            ).length;


        const withdrawals =
            transactions.filter(
                item =>
                    item.type === "withdrawal"
            ).length;


        const trades =
            transactions.filter(
                item =>
                    item.type === "trade"
            ).length;


        const credits =
            transactions.filter(
                item =>
                    item.type === "credit"
            ).length;


        const debits =
            transactions.filter(
                item =>
                    item.type === "debit"
            ).length;



        if (el("totalTransactionsCount")) {

            el("totalTransactionsCount")
                .textContent = total;

        }


        if (el("depositTransactionsCount")) {

            el("depositTransactionsCount")
                .textContent = deposits;

        }


        if (el("withdrawalTransactionsCount")) {

            el("withdrawalTransactionsCount")
                .textContent = withdrawals;

        }


        if (el("tradeTransactionsCount")) {

            el("tradeTransactionsCount")
                .textContent = trades;

        }


        if (el("creditTransactionsCount")) {

            el("creditTransactionsCount")
                .textContent = credits;

        }


        if (el("debitTransactionsCount")) {

            el("debitTransactionsCount")
                .textContent = debits;

        }

    }



    /* =====================================================
       RESULT COUNT
    ===================================================== */

    function updateResultCount(count) {

        const element =
            el("transactionsResultCount");


        if (!element) return;


        element.textContent =
            count + " عملية";

    }



    /* =====================================================
       FILTER TRANSACTIONS
    ===================================================== */

    function filterTransactions() {

        const search =
            (
                el("transactionSearch")?.value ||
                ""
            )
            .trim()
            .toLowerCase();


        const type =
            el("transactionType")?.value ||
            "all";


        const status =
            el("transactionStatus")?.value ||
            "all";


        const currency =
            el("transactionCurrency")?.value ||
            "all";


        const dateFrom =
            el("transactionDateFrom")?.value ||
            "";


        const dateTo =
            el("transactionDateTo")?.value ||
            "";



        const filtered =
            transactions.filter(
                function (transaction) {


                    /* ==========================
                       SEARCH
                    ========================== */

                    if (search) {

                        const searchable = [

                            transaction.id,

                            transaction.userName,

                            transaction.email,

                            transaction.uid,

                            transaction.reference,

                            transaction.wallet,

                            transaction.notes

                        ]
                        .join(" ")
                        .toLowerCase();


                        if (
                            !searchable.includes(search)
                        ) {

                            return false;

                        }

                    }



                    /* ==========================
                       TYPE
                    ========================== */

                    if (
                        type !== "all" &&
                        transaction.type !== type
                    ) {

                        return false;

                    }



                    /* ==========================
                       STATUS
                    ========================== */

                    if (
                        status !== "all" &&
                        transaction.status !== status
                    ) {

                        return false;

                    }



                    /* ==========================
                       CURRENCY
                    ========================== */

                    if (
                        currency !== "all" &&
                        transaction.currency !== currency
                    ) {

                        return false;

                    }



                    /* ==========================
                       DATE FROM
                    ========================== */

                    if (
                        dateFrom &&
                        transaction.date < dateFrom
                    ) {

                        return false;

                    }



                    /* ==========================
                       DATE TO
                    ========================== */

                    if (
                        dateTo &&
                        transaction.date > dateTo
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        renderTransactions(filtered);

    }



    /* =====================================================
       RESET FILTERS
    ===================================================== */

    function resetFilters() {

        const search =
            el("transactionSearch");


        const type =
            el("transactionType");


        const status =
            el("transactionStatus");


        const currency =
            el("transactionCurrency");


        const dateFrom =
            el("transactionDateFrom");


        const dateTo =
            el("transactionDateTo");


        if (search)
            search.value = "";


        if (type)
            type.value = "all";


        if (status)
            status.value = "all";


        if (currency)
            currency.value = "all";


        if (dateFrom)
            dateFrom.value = "";


        if (dateTo)
            dateTo.value = "";


        renderTransactions(
            transactions
        );

    }



    /* =====================================================
       SHOW DETAILS
    ===================================================== */

    function showDetails(id) {

        const transaction =
            transactions.find(
                item =>
                    item.id === id
            );


        if (!transaction) return;


        selectedTransaction =
            transaction;


        const card =
            el("transactionDetailsCard");


        if (!card) return;


        card.hidden = false;



        setText(
            "detailTransactionId",
            transaction.id
        );


        setText(
            "detailTransactionUser",
            transaction.userName
        );


        setText(
            "detailTransactionUID",
            transaction.uid
        );


        setText(
            "detailTransactionEmail",
            transaction.email
        );


        setText(
            "detailTransactionType",
            typeText(transaction.type)
        );


        setText(
            "detailTransactionAmount",
            formatAmount(transaction.amount)
            + " "
            + transaction.currency
        );


        setText(
            "detailTransactionCurrency",
            transaction.currency
        );


        setText(
            "detailTransactionBalanceBefore",
            formatAmount(
                transaction.balanceBefore
            )
        );


        setText(
            "detailTransactionBalanceAfter",
            formatAmount(
                transaction.balanceAfter
            )
        );


        setText(
            "detailTransactionStatus",
            statusText(transaction.status)
        );


        setText(
            "detailTransactionDate",
            transaction.date
        );


        setText(
            "detailTransactionTime",
            transaction.time
        );


        setText(
            "detailTransactionReference",
            transaction.reference
        );


        setText(
            "detailTransactionNotes",
            transaction.notes || "—"
        );



        card.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }



    /* =====================================================
       SET TEXT
    ===================================================== */

    function setText(id, value) {

        const element =
            el(id);


        if (element) {

            element.textContent =
                value;

        }

    }



    /* =====================================================
       CLICK EVENTS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {


            const actionButton =
                event.target.closest(
                    "[data-action]"
                );


            if (!actionButton) {

                return;

            }


            const action =
                actionButton.dataset.action;


            const id =
                actionButton.dataset.id;



            if (
                action === "details"
            ) {

                showDetails(id);

            }

        }
    );



    /* =====================================================
       REFRESH
    ===================================================== */

    const refreshButton =
        el("refreshTransactions");


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                renderTransactions(
                    transactions
                );

            }
        );

    }



    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const applyButton =
        el("applyTransactionFilters");


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            function () {

                filterTransactions();

            }
        );

    }



    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const resetButton =
        el("resetTransactionFilters");


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                resetFilters();

            }
        );

    }



    /* =====================================================
       LIVE SEARCH
    ===================================================== */

    const searchInput =
        el("transactionSearch");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                filterTransactions();

            }
        );

    }



    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    const closeButton =
        el("closeTransactionDetails");


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                const card =
                    el("transactionDetailsCard");


                if (card) {

                    card.hidden = true;

                }


                selectedTransaction =
                    null;

            }
        );

    }



    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "VALORA TRANSACTIONS JS LOADED"
        );


        updateStats();


        renderTransactions(
            transactions
        );

    }



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
