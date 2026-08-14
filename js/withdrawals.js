/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   COMPLETE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const WITHDRAWAL_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    REJECTED: "rejected"
};


/* =========================================================
   DEMO DATA
   طلب تجريبي للتأكد من ظهور الأزرار
========================================================= */

let withdrawals = [

    {
        id: "WD-DEMO-001",

        userName: "أحمد محمد",

        email: "ahmed@example.com",

        uid: "VAL-10001",

        amount: 150,

        currency: "USDT",

        balanceBefore: 650,

        balanceAfter: 500,

        wallet:
            "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

        network: "TRC20",

        fee: 1,

        netAmount: 149,

        date: "2026-08-14",

        time: "10:30",

        status: WITHDRAWAL_STATUS.PENDING,

        txid: "",

        notes: "",

        createdAt:
            "2026-08-14T10:30:00"

    }

];


/* =========================================================
   STATE
========================================================= */

let filteredWithdrawals = [];

let selectedWithdrawal = null;


/* =========================================================
   DOM
========================================================= */

const bodyElement =
    document.getElementById("withdrawalsBody");

const searchInput =
    document.getElementById("withdrawalSearch");

const statusSelect =
    document.getElementById("withdrawalStatus");

const networkSelect =
    document.getElementById("withdrawalNetwork");

const dateFromInput =
    document.getElementById("withdrawalDateFrom");

const dateToInput =
    document.getElementById("withdrawalDateTo");

const resultCount =
    document.getElementById("withdrawalsResultCount");


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        bindEvents();

        applyFilters();

    }
);


/* =========================================================
   EVENTS
========================================================= */

function bindEvents() {


    const refreshButton =
        document.getElementById("refreshWithdrawals");


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                applyFilters();

                showMessage(
                    "تم تحديث قائمة السحوبات",
                    "success"
                );

            }
        );

    }



    const applyButton =
        document.getElementById(
            "applyWithdrawalFilters"
        );


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            applyFilters
        );

    }



    const resetButton =
        document.getElementById(
            "resetWithdrawalFilters"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilters
        );

    }



    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }



    if (statusSelect) {

        statusSelect.addEventListener(
            "change",
            applyFilters
        );

    }



    if (networkSelect) {

        networkSelect.addEventListener(
            "change",
            applyFilters
        );

    }



    if (dateFromInput) {

        dateFromInput.addEventListener(
            "change",
            applyFilters
        );

    }



    if (dateToInput) {

        dateToInput.addEventListener(
            "change",
            applyFilters
        );

    }



    const closeDetails =
        document.getElementById(
            "closeWithdrawalDetails"
        );


    if (closeDetails) {

        closeDetails.addEventListener(
            "click",
            closeWithdrawalDetails
        );

    }



    const copyWallet =
        document.getElementById(
            "copyWithdrawalWallet"
        );


    if (copyWallet) {

        copyWallet.addEventListener(
            "click",
            function () {

                if (
                    selectedWithdrawal &&
                    selectedWithdrawal.wallet
                ) {

                    copyText(
                        selectedWithdrawal.wallet
                    );

                }

            }
        );

    }



    const copyTxid =
        document.getElementById(
            "copyWithdrawalTxid"
        );


    if (copyTxid) {

        copyTxid.addEventListener(
            "click",
            function () {

                if (
                    selectedWithdrawal &&
                    selectedWithdrawal.txid
                ) {

                    copyText(
                        selectedWithdrawal.txid
                    );

                }

            }
        );

    }



    if (bodyElement) {

        bodyElement.addEventListener(
            "click",
            handleTableClick
        );

    }

}


/* =========================================================
   FILTERS
========================================================= */

function applyFilters() {

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        statusSelect
            ? statusSelect.value
            : "all";


    const network =
        networkSelect
            ? networkSelect.value
            : "all";


    const dateFrom =
        dateFromInput
            ? dateFromInput.value
            : "";


    const dateTo =
        dateToInput
            ? dateToInput.value
            : "";



    filteredWithdrawals =
        withdrawals.filter(
            function (withdrawal) {


                /* SEARCH */

                if (search) {

                    const searchable = [

                        withdrawal.id,

                        withdrawal.userName,

                        withdrawal.email,

                        withdrawal.uid,

                        withdrawal.wallet,

                        withdrawal.txid,

                        withdrawal.network

                    ]
                    .join(" ")
                    .toLowerCase();


                    if (
                        !searchable.includes(search)
                    ) {

                        return false;

                    }

                }



                /* STATUS */

                if (
                    status !== "all" &&
                    withdrawal.status !== status
                ) {

                    return false;

                }



                /* NETWORK */

                if (
                    network !== "all" &&
                    withdrawal.network !== network
                ) {

                    return false;

                }



                /* DATE FROM */

                if (
                    dateFrom &&
                    withdrawal.date < dateFrom
                ) {

                    return false;

                }



                /* DATE TO */

                if (
                    dateTo &&
                    withdrawal.date > dateTo
                ) {

                    return false;

                }



                return true;

            }
        );


    renderWithdrawals();

    updateStatistics();

}


/* =========================================================
   RESET
========================================================= */

function resetFilters() {

    if (searchInput) {

        searchInput.value = "";

    }


    if (statusSelect) {

        statusSelect.value = "all";

    }


    if (networkSelect) {

        networkSelect.value = "all";

    }


    if (dateFromInput) {

        dateFromInput.value = "";

    }


    if (dateToInput) {

        dateToInput.value = "";

    }


    applyFilters();

}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderWithdrawals() {


    if (!bodyElement) {

        return;

    }



    if (
        !filteredWithdrawals.length
    ) {

        bodyElement.innerHTML = `

            <tr>

                <td
                    colspan="18"
                    class="withdrawals-empty"
                >

                    <div class="withdrawals-empty-icon">
                        −
                    </div>

                    <strong>
                        لا توجد طلبات سحب
                    </strong>

                    <span>
                        لا توجد نتائج مطابقة للبحث الحالي.
                    </span>

                </td>

            </tr>

        `;


        updateResultCount(0);

        return;

    }



    bodyElement.innerHTML =
        filteredWithdrawals
            .map(
                function (withdrawal, index) {

                    return createWithdrawalRow(
                        withdrawal,
                        index
                    );

                }
            )
            .join("");


    updateResultCount(
        filteredWithdrawals.length
    );

}


/* =========================================================
   CREATE ROW
========================================================= */

function createWithdrawalRow(
    withdrawal,
    index
) {


    const actionButtons =
        createActionButtons(
            withdrawal
        );


    return `

        <tr data-withdrawal-id="${escapeHTML(
            withdrawal.id
        )}">

            <td>
                ${index + 1}
            </td>


            <td>
                <strong>
                    ${escapeHTML(
                        withdrawal.userName
                    )}
                </strong>
            </td>


            <td dir="ltr">
                ${escapeHTML(
                    withdrawal.email
                )}
            </td>


            <td dir="ltr">
                ${escapeHTML(
                    withdrawal.uid
                )}
            </td>


            <td>
                ${formatNumber(
                    withdrawal.amount
                )}
            </td>


            <td>
                ${escapeHTML(
                    withdrawal.currency
                )}
            </td>


            <td>
                ${formatNumber(
                    withdrawal.balanceBefore
                )}
            </td>


            <td>
                ${formatNumber(
                    withdrawal.balanceAfter
                )}
            </td>


            <td
                dir="ltr"
                class="withdrawal-wallet-cell"
            >
                ${escapeHTML(
                    withdrawal.wallet
                )}
            </td>


            <td>
                ${escapeHTML(
                    withdrawal.network
                )}
            </td>


            <td>
                ${formatNumber(
                    withdrawal.fee
                )}
            </td>


            <td>
                ${formatNumber(
                    withdrawal.netAmount
                )}
            </td>


            <td>
                ${escapeHTML(
                    withdrawal.date
                )}
            </td>


            <td>
                ${escapeHTML(
                    withdrawal.time
                )}
            </td>


            <td>
                ${getStatusBadge(
                    withdrawal.status
                )}
            </td>


            <td
                dir="ltr"
                class="withdrawal-txid-cell"
            >
                ${withdrawal.txid
                    ? escapeHTML(
                        withdrawal.txid
                    )
                    : "—"
                }
            </td>


            <td>
                ${withdrawal.notes
                    ? escapeHTML(
                        withdrawal.notes
                    )
                    : "—"
                }
            </td>


            <td>

                <div class="withdrawal-actions">

                    ${actionButtons}

                </div>

            </td>

        </tr>

    `;

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

function createActionButtons(
    withdrawal
) {


    let html = `

        <button
            type="button"
            class="withdrawal-action-button withdrawal-view-button"
            data-action="view"
            data-id="${escapeHTML(
                withdrawal.id
            )}"
        >
            التفاصيل
        </button>

    `;



    if (
        withdrawal.status ===
        WITHDRAWAL_STATUS.PENDING
    ) {

        html += `

            <button
                type="button"
                class="withdrawal-action-button withdrawal-approve-button"
                data-action="approve"
                data-id="${escapeHTML(
                    withdrawal.id
                )}"
            >
                ✓ قبول السحب
            </button>


            <button
                type="button"
                class="withdrawal-action-button withdrawal-reject-button"
                data-action="reject"
                data-id="${escapeHTML(
                    withdrawal.id
                )}"
            >
                × رفض السحب
            </button>

        `;

    }



    if (
        withdrawal.status ===
        WITHDRAWAL_STATUS.PROCESSING
    ) {

        html += `

            <button
                type="button"
                class="withdrawal-action-button withdrawal-complete-button"
                data-action="complete"
                data-id="${escapeHTML(
                    withdrawal.id
                )}"
            >
                ✓ تأكيد التحويل
            </button>

        `;

    }



    return html;

}


/* =========================================================
   TABLE CLICK HANDLER
========================================================= */

function handleTableClick(event) {


    const button =
        event.target.closest(
            "[data-action]"
        );


    if (!button) {

        return;

    }


    const action =
        button.dataset.action;


    const id =
        button.dataset.id;


    const withdrawal =
        withdrawals.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!withdrawal) {

        return;

    }



    if (action === "view") {

        openWithdrawalDetails(
            withdrawal
        );

        return;

    }



    if (action === "approve") {

        approveWithdrawal(
            withdrawal
        );

        return;

    }



    if (action === "reject") {

        rejectWithdrawal(
            withdrawal
        );

        return;

    }



    if (action === "complete") {

        completeWithdrawal(
            withdrawal
        );

    }

}


/* =========================================================
   APPROVE
========================================================= */

function approveWithdrawal(
    withdrawal
) {


    if (
        withdrawal.status !==
        WITHDRAWAL_STATUS.PENDING
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "هل تريد قبول طلب السحب وتحويله إلى قيد التنفيذ؟"
        );


    if (!confirmed) {

        return;

    }


    withdrawal.status =
        WITHDRAWAL_STATUS.PROCESSING;


    openWithdrawalDetails(
        withdrawal
    );


    applyFilters();


    showMessage(
        "تم قبول طلب السحب وأصبح قيد التنفيذ. يمكنك الآن نسخ عنوان المحفظة وإجراء التحويل يدويًا.",
        "success"
    );

}


/* =========================================================
   REJECT
========================================================= */

function rejectWithdrawal(
    withdrawal
) {


    if (
        withdrawal.status !==
        WITHDRAWAL_STATUS.PENDING
    ) {

        return;

    }


    const reason =
        window.prompt(
            "اكتب سبب رفض طلب السحب:"
        );


    if (
        reason === null
    ) {

        return;

    }


    withdrawal.status =
        WITHDRAWAL_STATUS.REJECTED;


    withdrawal.notes =
        reason.trim() ||
        "تم رفض طلب السحب من الإدارة";


    if (
        selectedWithdrawal &&
        selectedWithdrawal.id ===
        withdrawal.id
    ) {

        openWithdrawalDetails(
            withdrawal
        );

    }


    applyFilters();


    showMessage(
        "تم رفض طلب السحب.",
        "success"
    );

}


/* =========================================================
   COMPLETE
========================================================= */

function completeWithdrawal(
    withdrawal
) {


    if (
        withdrawal.status !==
        WITHDRAWAL_STATUS.PROCESSING
    ) {

        return;

    }


    const txid =
        window.prompt(
            "
