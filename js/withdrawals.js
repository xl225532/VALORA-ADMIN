/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   COMPLETE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   STATE
========================================================= */

let withdrawals = [];

let filteredWithdrawals = [];

let selectedWithdrawal = null;


/* =========================================================
   DOM
========================================================= */

const withdrawalsBody =
    document.getElementById("withdrawalsBody");

const withdrawalDetailsCard =
    document.getElementById("withdrawalDetailsCard");

const closeWithdrawalDetails =
    document.getElementById("closeWithdrawalDetails");

const refreshWithdrawals =
    document.getElementById("refreshWithdrawals");

const withdrawalSearch =
    document.getElementById("withdrawalSearch");

const withdrawalStatus =
    document.getElementById("withdrawalStatus");

const withdrawalNetwork =
    document.getElementById("withdrawalNetwork");

const withdrawalDateFrom =
    document.getElementById("withdrawalDateFrom");

const withdrawalDateTo =
    document.getElementById("withdrawalDateTo");

const applyWithdrawalFilters =
    document.getElementById("applyWithdrawalFilters");

const resetWithdrawalFilters =
    document.getElementById("resetWithdrawalFilters");

const withdrawalsResultCount =
    document.getElementById("withdrawalsResultCount");

const withdrawalDetailsActions =
    document.getElementById("withdrawalDetailsActions");

const approveWithdrawal =
    document.getElementById("approveWithdrawal");

const rejectWithdrawal =
    document.getElementById("rejectWithdrawal");

const copyWithdrawalWallet =
    document.getElementById("copyWithdrawalWallet");

const copyWithdrawalTxid =
    document.getElementById("copyWithdrawalTxid");

const withdrawalAdminNotes =
    document.getElementById("withdrawalAdminNotes");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    hideWithdrawalActions();

    loadWithdrawals();

    setupEvents();

});


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {


    if (refreshWithdrawals) {

        refreshWithdrawals.addEventListener(
            "click",
            loadWithdrawals
        );

    }


    if (applyWithdrawalFilters) {

        applyWithdrawalFilters.addEventListener(
            "click",
            applyFilters
        );

    }


    if (resetWithdrawalFilters) {

        resetWithdrawalFilters.addEventListener(
            "click",
            resetFilters
        );

    }


    if (closeWithdrawalDetails) {

        closeWithdrawalDetails.addEventListener(
            "click",
            closeDetails
        );

    }


    if (approveWithdrawal) {

        approveWithdrawal.addEventListener(
            "click",
            approveSelectedWithdrawal
        );

    }


    if (rejectWithdrawal) {

        rejectWithdrawal.addEventListener(
            "click",
            rejectSelectedWithdrawal
        );

    }


    if (copyWithdrawalWallet) {

        copyWithdrawalWallet.addEventListener(
            "click",
            copyWallet
        );

    }


    if (copyWithdrawalTxid) {

        copyWithdrawalTxid.addEventListener(
            "click",
            copyTxid
        );

    }


    if (withdrawalSearch) {

        withdrawalSearch.addEventListener(
            "input",
            applyFilters
        );

    }

}


/* =========================================================
   LOAD WITHDRAWALS
========================================================= */

function loadWithdrawals() {

    /*
     * هنا لاحقًا سيتم جلب البيانات من قاعدة البيانات / API.
     *
     * حاليًا لا توجد بيانات وهمية حتى لا تظهر طلبات
     * غير حقيقية في لوحة الإدارة.
     */

    withdrawals = [];

    filteredWithdrawals = [];

    selectedWithdrawal = null;

    hideWithdrawalActions();

    closeDetails();

    renderWithdrawals();

    updateStatistics();

}


/* =========================================================
   RENDER TABLE
========================================================= */

function renderWithdrawals() {

    if (!withdrawalsBody) {
        return;
    }


    withdrawalsBody.innerHTML = "";


    if (!filteredWithdrawals.length) {

        withdrawalsBody.innerHTML = `

            <tr>

                <td
                    colspan="18"
                    class="withdrawals-empty"
                >

                    <div class="withdrawals-empty-icon">
                        −
                    </div>

                    <strong>
                        لا توجد طلبات سحب حاليًا
                    </strong>

                    <span>
                        ستظهر طلبات السحب هنا عند وصولها من الموقع الرسمي.
                    </span>

                </td>

            </tr>

        `;

        updateResultCount();

        return;
    }


    filteredWithdrawals.forEach(
        (withdrawal, index) => {

            const row =
                createWithdrawalRow(
                    withdrawal,
                    index
                );

            withdrawalsBody.appendChild(row);

        }
    );


    updateResultCount();

}


/* =========================================================
   CREATE TABLE ROW
========================================================= */

function createWithdrawalRow(
    withdrawal,
    index
) {

    const tr =
        document.createElement("tr");


    tr.className =
        "withdrawal-row";


    tr.dataset.id =
        withdrawal.id;


    tr.innerHTML = `

        <td>
            ${index + 1}
        </td>

        <td>
            ${escapeHTML(withdrawal.userName)}
        </td>

        <td>
            ${escapeHTML(withdrawal.email)}
        </td>

        <td dir="ltr">
            ${escapeHTML(withdrawal.uid)}
        </td>

        <td>
            ${formatAmount(withdrawal.amount)}
        </td>

        <td>
            ${escapeHTML(withdrawal.currency)}
        </td>

        <td>
            ${formatAmount(withdrawal.balanceBefore)}
        </td>

        <td>
            ${formatAmount(withdrawal.balanceAfter)}
        </td>

        <td
            dir="ltr"
            class="withdrawal-wallet-cell"
        >
            ${escapeHTML(withdrawal.wallet)}
        </td>

        <td>
            ${escapeHTML(withdrawal.network)}
        </td>

        <td>
            ${formatAmount(withdrawal.fee)}
        </td>

        <td>
            ${formatAmount(withdrawal.netAmount)}
        </td>

        <td>
            ${escapeHTML(withdrawal.date)}
        </td>

        <td>
            ${escapeHTML(withdrawal.time)}
        </td>

        <td>
            ${getStatusHTML(withdrawal.status)}
        </td>

        <td
            dir="ltr"
            class="withdrawal-txid-cell"
        >
            ${escapeHTML(withdrawal.txid || "—")}
        </td>

        <td>
            ${escapeHTML(withdrawal.notes || "—")}
        </td>

        <td>

            <button
                type="button"
                class="withdrawal-view-button"
                data-withdrawal-id="${withdrawal.id}"
            >
                عرض
            </button>

        </td>

    `;


    const viewButton =
        tr.querySelector(
            ".withdrawal-view-button"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                openWithdrawalDetails(
                    withdrawal.id
                );

            }
        );

    }


    return tr;

}


/* =========================================================
   STATUS
========================================================= */

function getStatusHTML(status) {

    const statuses = {

        pending: {
            text: "قيد الانتظار",
            className: "pending"
        },

        processing: {
            text: "قيد التنفيذ",
            className: "processing"
        },

        completed: {
            text: "مكتمل",
            className: "completed"
        },

        rejected: {
            text: "مرفوض",
            className: "rejected"
        }

    };


    const current =
        statuses[status] ||
        statuses.pending;


    return `

        <span
            class="withdrawal-status withdrawal-status-${current.className}"
        >
            ${current.text}
        </span>

    `;

}


/* =========================================================
   OPEN DETAILS
========================================================= */

function openWithdrawalDetails(id) {

    const withdrawal =
        withdrawals.find(
            item => String(item.id) === String(id)
        );


    if (!withdrawal) {
        return;
    }


    selectedWithdrawal =
        withdrawal;


    fillWithdrawalDetails(
        withdrawal
    );


    showWithdrawalActions(
        withdrawal
    );


    if (withdrawalDetailsCard) {

        withdrawalDetailsCard.hidden =
            false;

        withdrawalDetailsCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   FILL DETAILS
========================================================= */

function fillWithdrawalDetails(
    withdrawal
) {


    setText(
        "detailUserName",
        withdrawal.userName
    );


    setText(
        "detailUserEmail",
        withdrawal.email
    );


    setText(
        "detailUserUID",
        withdrawal.uid
    );


    setText(
        "detailAmount",
        formatAmount(withdrawal.amount)
    );


    setText(
        "detailCurrency",
        withdrawal.currency
    );


    setText(
        "detailBalance",
        formatAmount(withdrawal.balanceBefore)
    );


    setText(
        "detailFee",
        formatAmount(withdrawal.fee)
    );


    setText(
        "detailNetAmount",
        formatAmount(withdrawal.netAmount)
    );


    setText(
        "detailNetwork",
        withdrawal.network
    );


    setText(
        "detailDate",
        withdrawal.date
    );


    setText(
        "detailTime",
        withdrawal.time
    );


    setText(
        "detailStatus",
        getStatusText(
            withdrawal.status
        )
    );


    setText(
        "detailWallet",
        withdrawal.wallet
    );


    setText(
        "detailTxid",
        withdrawal.txid || "—"
    );


    if (withdrawalAdminNotes) {

        withdrawalAdminNotes.value =
            withdrawal.notes || "";

    }

}


/* =========================================================
   SHOW / HIDE ACTIONS
========================================================= */

function showWithdrawalActions(
    withdrawal
) {

    if (!withdrawalDetailsActions) {
        return;
    }


    /*
     * الأزرار تظهر فقط للطلب المحدد.
     *
     * إذا كان مكتملًا أو مرفوضًا:
     * لا نعرض أزرار اتخاذ القرار مرة أخرى.
     */


    if (
        withdrawal.status === "completed" ||
        withdrawal.status === "rejected"
    ) {

        withdrawalDetailsActions.hidden =
            true;

        return;

    }


    withdrawalDetailsActions.hidden =
        false;


    /*
     * إذا كان الطلب قيد التنفيذ:
     * لا نحتاج إلى قبول جديد.
     */

    if (approveWithdrawal) {

        approveWithdrawal.hidden =
            withdrawal.status === "processing";

    }


    if (rejectWithdrawal) {

        rejectWithdrawal.hidden =
            withdrawal.status === "processing";

    }

}


function hideWithdrawalActions() {

    if (withdrawalDetailsActions) {

        withdrawalDetailsActions.hidden =
            true;

    }

}


/* =========================================================
   CLOSE DETAILS
========================================================= */

function closeDetails() {

    selectedWithdrawal =
        null;


    hideWithdrawalActions();


    if (withdrawalDetailsCard) {

        withdrawalDetailsCard.hidden =
            true;

    }

}


/* =========================================================
   APPROVE
========================================================= */

function approveSelectedWithdrawal() {

    if (!selectedWithdrawal) {

        showMessage(
            "يرجى اختيار طلب سحب أولًا.",
            "error"
        );

        return;

    }


    if (
        selectedWithdrawal.status === "completed" ||
        selectedWithdrawal.status === "rejected"
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "هل تريد قبول طلب السحب والانتقال إلى مرحلة التنفيذ اليدوي؟"
        );


    if (!confirmed) {
        return;
    }


    /*
     * في النظام الحقيقي:
     *
     * هنا سيتم إرسال طلب إلى Backend
     * لتغيير الحالة إلى processing.
     */


    selectedWithdrawal.status =
        "processing";


    selectedWithdrawal.notes =
        withdrawalAdminNotes
            ? withdrawalAdminNotes.value.trim()
            : selectedWithdrawal.notes;


    fillWithdrawalDetails(
        selectedWithdrawal
    );


    showWithdrawalActions(
        selectedWithdrawal
    );


    renderWithdrawals();

    updateStatistics();


    showMessage(
        "تم قبول طلب السحب وأصبح قيد التنفيذ. يمكنك نسخ عنوان المحفظة وشحن المستخدم يدويًا.",
        "success"
    );

}


/* =========================================================
   REJECT
========================================================= */

function rejectSelectedWithdrawal() {

    if (!selectedWithdrawal) {

        showMessage(
            "يرجى اختيار طلب سحب أولًا.",
            "error"
        );

        return;

    }


    if (
        selectedWithdrawal.status === "completed" ||
        selectedWithdrawal.status === "rejected"
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "هل أنت متأكد من رفض طلب السحب؟ سيتم اعتبار المبلغ مرفوضًا ويجب على النظام الحقيقي إعادة الرصيد للمستخدم."
        );


    if (!confirmed) {
        return;
    }


    /*
     * في النظام الحقيقي:
     *
     * يجب تنفيذ عملية إعادة الرصيد
     * داخل Backend بشكل آمن وذرّي.
     */


    selectedWithdrawal.status =
        "rejected";


    selectedWithdrawal.notes =
        withdrawalAdminNotes
            ? withdrawalAdminNotes.value.trim()
            : selectedWithdrawal.notes;


    fillWithdrawalDetails(
        selectedWithdrawal
    );


    hideWithdrawalActions();


    renderWithdrawals();

    updateStatistics();


    showMessage(
        "تم رفض طلب السحب.",
        "success"
    );

}


/* =========================================================
   COPY WALLET
========================================================= */

async function copyWallet() {

    if (!selectedWithdrawal) {
        return;
    }


    await copyText(
        selectedWithdrawal.wallet
    );


    showMessage(
        "تم نسخ عنوان المحفظة.",
        "success"
    );

}


/* =========================================================
   COPY TXID
========================================================= */

async function copyTxid() {

    if (!selectedWithdrawal) {
        return;
    }


    if (!selectedWithdrawal.txid) {

        showMessage(
            "لا يوجد TXID لهذا الطلب.",
            "error"
        );

        return;

    }


    await copyText(
        selectedWithdrawal.txid
    );


    showMessage(
        "تم نسخ TXID.",
        "success"
    );

}


/* =========================================================
   FILTERS
========================================================= */

function applyFilters() {

    const search =
        withdrawalSearch
            ? withdrawalSearch.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        withdrawalStatus
            ? withdrawalStatus.value
            : "all";


    const network =
        withdrawalNetwork
            ? withdrawalNetwork.value
            : "all";


    const dateFrom =
        withdrawalDateFrom
            ? withdrawalDateFrom.value
            : "";


    const dateTo =
        withdrawalDateTo
            ? withdrawalDateTo.value
            : "";


    filteredWithdrawals =
        withdrawals.filter(
            withdrawal => {


                const searchable =
                    [

                        withdrawal.userName,

                        withdrawal.email,

                        withdrawal.uid,

                        withdrawal.wallet,

                        withdrawal.txid

                    ]
                    .join(" ")
                    .toLowerCase();


                if (
                    search &&
                    !searchable.includes(search)
                ) {

                    return false;

                }


                if (
                    status !== "all" &&
                    withdrawal.status !== status
                ) {

                    return false;

                }


                if (
                    network !== "all" &&
                    withdrawal.network !== network
                ) {

                    return false;

                }


                if (
                    dateFrom &&
                    withdrawal.date < dateFrom
                ) {

                    return false;

                }


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

}


/* =========================================================
   RESET FILTERS
========================================================= */

function resetFilters() {


    if (withdrawalSearch) {

        withdrawalSearch.value =
            "";

    }


    if (withdrawalStatus) {

        withdrawalStatus.value =
            "all";

    }


    if (withdrawalNetwork) {

        withdrawalNetwork.value =
            "all";

    }


    if (withdrawalDateFrom) {

        withdrawalDateFrom.value =
            "";

    }


    if (withdrawalDateTo) {

        withdrawalDateTo.value =
            "";

    }


    filteredWithdrawals =
        [...withdrawals];


    renderWithdrawals();

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {


    const pending =
        withdrawals.filter(
            item => item.status === "pending"
        );


    const processing =
        withdrawals.filter(
            item => item.status === "processing"
        );


    const completed =
        withdrawals.filter(
            item => item.status === "completed"
        );


    const rejected =
        withdrawals.filter(
            item => item.status === "rejected"
        );


    const pendingAmount =
        pending.reduce(
            (total, item) =>
                total + Number(item.amount || 0),
            0
        );


    const completedAmount =
        completed.reduce(
            (total, item) =>
                total + Number(item.netAmount || 0),
            0
        );


    const rejectedAmount =
        rejected.reduce(
            (total, item) =>
                total + Number(item.amount || 0),
            0
        );


    setText(
        "pendingWithdrawalsCount",
        pending.length
    );


    setText(
        "pendingWithdrawalsAmount",
        `${formatAmount(pendingAmount)} USDT`
    );


    setText(
        "processingWithdrawalsCount",
        processing.length
    );


    setText(
        "completedWithdrawalsCount",
        completed.length
    );


    setText(
        "totalWithdrawnAmount",
        `${formatAmount(completedAmount)} USDT`
    );


    setText(
        "rejectedWithdrawalsCount",
        rejected.length
    );


    setText(
        "rejectedWithdrawalsAmount",
        `${formatAmount(rejectedAmount)} USDT`
    );

}


/* =========================================================
   RESULT COUNT
========================================================= */

function updateResultCount() {

    if (!withdrawalsResultCount) {
        return;
    }


    const count =
        filteredWithdrawals.length;


    withdrawalsResultCount.textContent =
        `${count} طلب`;

}


/* =========================================================
   STATUS TEXT
========================================================= */

function getStatusText(status) {

    const map = {

        pending:
            "قيد الانتظار",

        processing:
            "قيد التنفيذ",

        completed:
            "مكتمل",

        rejected:
            "مرفوض"

    };


    return map[status] || "غير معروف";

}


/* =========================================================
   FORMAT AMOUNT
========================================================= */

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


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "—";

}


/* =========================================================
   COPY
========================================================= */

async function copyText(text) {

    if (!text) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            String(text)
        );

        return;

    } catch (error) {

        /*
         * fallback
         */

    }


    const textarea =
        document.createElement("textarea");


    textarea.value =
        String(text);


    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );

    }


    textarea.remove();

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type = "success"
) {

    let element =
        document.getElementById(
            "withdrawalResultMessage"
        );


    if (!element) {

        element =
            document.createElement(
                "div"
            );


        element.id =
            "withdrawalResultMessage";


        element.className =
            "trade-result";


        if (withdrawalDetailsCard) {

            withdrawalDetailsCard.appendChild(
                element
            );

        } else {

            document.body.appendChild(
                element
            );

        }

    }


    element.className =
        `trade-result ${type}`;


    element.hidden =
        false;


    element.textContent =
        message;


    window.clearTimeout(
        element._hideTimer
    );


    element._hideTimer =
        window.setTimeout(
            () => {

                element.hidden =
                    true;

            },
            4000
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   OPTIONAL TEST FUNCTION
========================================================= */

/*
 * لا يتم إنشاء طلبات وهمية تلقائيًا.
 *
 * إذا أردت اختبار الواجهة فقط من المتصفح،
 * يمكنك تشغيل:
 *
 * addTestWithdrawal()
 *
 * من Console.
 */

function addTestWithdrawal() {

    const now =
        new Date();


    const withdrawal = {

        id:
            Date.now(),

        userName:
            "مستخدم تجريبي",

        email:
            "user@example.com",

        uid:
            "VAL-10001",

        amount:
            100,

        currency:
            "USDT",

        balanceBefore:
            850,

        balanceAfter:
            750,

        wallet:
            "TExampleWalletAddress123456789",

        network:
            "TRC20",

        fee:
            1,

        netAmount:
            99,

        date:
            now.toISOString()
                .slice(0, 10),

        time:
            now.toLocaleTimeString(
                "ar",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        status:
            "pending",

        txid:
            "",

        notes:
            ""

    };


    withdrawals.unshift(
        withdrawal
    );


    filteredWithdrawals =
        [...withdrawals];


    renderWithdrawals();

    updateStatistics();

}


/* =========================================================
   GLOBAL ACCESS FOR TESTING
========================================================= */

window.VALORAWithdrawals = {

    load:
        loadWithdrawals,

    addTestWithdrawal:
        addTestWithdrawal,

    open:
        openWithdrawalDetails

};
