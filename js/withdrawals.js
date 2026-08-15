/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   MANUAL WITHDRAWAL MANAGEMENT
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DATA
       للتجربة فقط — لا يوجد ربط حقيقي بعد
    ===================================================== */

    let withdrawals = [];


    let selectedWithdrawal = null;


    /* =====================================================
       ELEMENT
    ===================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* =====================================================
       FORMAT
    ===================================================== */

    function formatAmount(value) {

        return Number(value || 0).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    function statusLabel(status) {

        const labels = {

            pending: "قيد الانتظار",

            processing: "قيد التنفيذ",

            completed: "مكتمل",

            rejected: "مرفوض"

        };

        return labels[status] || status;

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function setText(id, value) {

        const element = $(id);

        if (element) {

            element.textContent = value;

        }

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function renderWithdrawals() {

        const body = $("withdrawalsBody");

        if (!body) {

            console.error(
                "VALORA: withdrawalsBody غير موجود في HTML"
            );

            return;

        }


        if (withdrawals.length === 0) {

            body.innerHTML = `

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
                            ستظهر الطلبات هنا عند وصولها.
                        </span>

                    </td>

                </tr>

            `;

            updateStatistics();

            return;

        }


        body.innerHTML = withdrawals.map(
            function (withdrawal, index) {

                return `

                <tr data-withdrawal-id="${escapeHTML(withdrawal.id)}">

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <strong>
                            ${escapeHTML(withdrawal.userName)}
                        </strong>

                    </td>


                    <td dir="ltr">
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


                    <td dir="ltr">

                        <div class="withdrawal-wallet-cell">

                            <span>
                                ${escapeHTML(withdrawal.wallet)}
                            </span>

                            <button
                                type="button"
                                class="withdrawal-copy-button"
                                data-copy-wallet="${escapeHTML(withdrawal.wallet)}"
                            >
                                نسخ
                            </button>

                        </div>

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

                        <span
                            class="withdrawal-status status-${escapeHTML(withdrawal.status)}"
                        >

                            ${statusLabel(withdrawal.status)}

                        </span>

                    </td>


                    <td dir="ltr">

                        ${
                            withdrawal.txid
                                ? escapeHTML(withdrawal.txid)
                                : "—"
                        }

                    </td>


                    <td>

                        ${
                            withdrawal.notes
                                ? escapeHTML(withdrawal.notes)
                                : "—"
                        }

                    </td>


                    <td>

                        <div class="withdrawal-actions">


                            <button
                                type="button"
                                class="withdrawal-details-button"
                                data-action="details"
                                data-id="${escapeHTML(withdrawal.id)}"
                            >
                                التفاصيل
                            </button>


                            ${
                                withdrawal.status === "pending"

                                    ?

                                `

                                <button
                                    type="button"
                                    class="withdrawal-approve-button"
                                    data-action="approve"
                                    data-id="${escapeHTML(withdrawal.id)}"
                                >
                                    ✓ قبول
                                </button>


                                <button
                                    type="button"
                                    class="withdrawal-reject-button"
                                    data-action="reject"
                                    data-id="${escapeHTML(withdrawal.id)}"
                                >
                                    × رفض
                                </button>

                                `

                                    : ""

                            }


                            ${
                                withdrawal.status === "processing"

                                    ?

                                `

                                <button
                                    type="button"
                                    class="withdrawal-complete-button"
                                    data-action="complete"
                                    data-id="${escapeHTML(withdrawal.id)}"
                                >
                                    ✓ تم التحويل
                                </button>

                                `

                                    : ""

                            }

                        </div>

                    </td>

                </tr>

                `;

            }
        ).join("");


        updateStatistics();

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

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
                    total + Number(item.amount || 0),
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
            formatAmount(pendingAmount) + " USDT"
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
            formatAmount(completedAmount) + " USDT"
        );


        setText(
            "rejectedWithdrawalsCount",
            rejected.length
        );


        setText(
            "rejectedWithdrawalsAmount",
            formatAmount(rejectedAmount) + " USDT"
        );


        setText(
            "withdrawalsResultCount",
            withdrawals.length + " طلب"
        );

    }


    /* =====================================================
       SHOW DETAILS
    ===================================================== */

    function showDetails(id) {

        const withdrawal =
            withdrawals.find(
                item => item.id === id
            );


        if (!withdrawal) return;


        selectedWithdrawal =
            withdrawal;


        const detailsCard =
            $("withdrawalDetailsCard");


        if (!detailsCard) {

            console.warn(
                "VALORA: withdrawalDetailsCard غير موجود"
            );

            return;

        }


        detailsCard.hidden = false;


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
            + " "
            + withdrawal.currency
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
            statusLabel(withdrawal.status)
        );


        setText(
            "detailWallet",
            withdrawal.wallet
        );


        setText(
            "detailTxid",
            withdrawal.txid || "—"
        );


        const notes =
            $("withdrawalAdminNotes");


        if (notes) {

            notes.value =
                withdrawal.notes || "";

        }


        detailsCard.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }


    /* =====================================================
       APPROVE
    ===================================================== */

    function approveWithdrawal(id) {

        const withdrawal =
            withdrawals.find(
                item => item.id === id
            );


        if (!withdrawal) return;


        if (withdrawal.status !== "pending") {

            alert(
                "هذا الطلب لم يعد قيد الانتظار."
            );

            return;

        }


        const confirmed =
            window.confirm(

                "هل تريد قبول طلب السحب؟\n\n" +

                "سيصبح الطلب قيد التنفيذ، وبعدها تقوم بتحويل المبلغ يدويًا."

            );


        if (!confirmed) return;


        withdrawal.status =
            "processing";


        renderWithdrawals();


        showDetails(id);


        alert(

            "تم قبول طلب السحب.\n\n" +

            "الحالة الآن: قيد التنفيذ.\n\n" +

            "انسخ عنوان المحفظة ونفذ التحويل يدويًا."

        );

    }


    /* =====================================================
       REJECT
    ===================================================== */

    function rejectWithdrawal(id) {

        const withdrawal =
            withdrawals.find(
                item => item.id === id
            );


        if (!withdrawal) return;


        if (withdrawal.status !== "pending") {

            alert(
                "لا يمكن رفض هذا الطلب الآن."
            );

            return;

        }


        const reason =
            window.prompt(

                "اكتب سبب رفض طلب السحب:"

            );


        if (reason === null) {

            return;

        }


        withdrawal.status =
            "rejected";


        withdrawal.notes =
            reason.trim()
            ||
            "تم رفض طلب السحب من الإدارة.";


        renderWithdrawals();


        showDetails(id);

    }


    /* =====================================================
       COMPLETE AFTER MANUAL TRANSFER
    ===================================================== */

    function completeWithdrawal(id) {

        const withdrawal =
            withdrawals.find(
                item => item.id === id
            );


        if (!withdrawal) return;


        if (withdrawal.status !== "processing") {

            alert(
                "يجب قبول الطلب أولًا."
            );

            return;

        }


        const txid =
            window.prompt(

                "أدخل TXID بعد تنفيذ التحويل اليدوي:"

            );


        if (!txid || !txid.trim()) {

            alert(
                "لم يتم إكمال الطلب. يجب إدخال TXID."
            );

            return;

        }


        withdrawal.txid =
            txid.trim();


        withdrawal.status =
            "completed";


        renderWithdrawals();


        showDetails(id);


        alert(
            "تم تسجيل السحب كمكتمل."
        );

    }


    /* =====================================================
       COPY WALLET
    ===================================================== */

    async function copyWallet(wallet) {

        try {

            await navigator.clipboard.writeText(
                wallet
            );


            alert(
                "تم نسخ عنوان المحفظة."
            );

        } catch (error) {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                wallet;


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

            } catch (copyError) {

                console.error(
                    copyError
                );

            }


            textarea.remove();


            alert(
                "تم نسخ عنوان المحفظة."
            );

        }

    }


    /* =====================================================
       COPY DETAIL WALLET
    ===================================================== */

    const copyWalletButton =
        $("copyWithdrawalWallet");


    if (copyWalletButton) {

        copyWalletButton.addEventListener(
            "click",
            function () {

                if (
                    selectedWithdrawal &&
                    selectedWithdrawal.wallet
                ) {

                    copyWallet(
                        selectedWithdrawal.wallet
                    );

                }

            }
        );

    }


    /* =====================================================
       COPY DETAIL TXID
    ===================================================== */

    const copyTxidButton =
        $("copyWithdrawalTxid");


    if (copyTxidButton) {

        copyTxidButton.addEventListener(
            "click",
            function () {

                if (
                    selectedWithdrawal &&
                    selectedWithdrawal.txid
                ) {

                    copyWallet(
                        selectedWithdrawal.txid
                    );

                }

            }
        );

    }


    /* =====================================================
       TABLE EVENTS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {


            const actionButton =
                event.target.closest(
                    "[data-action]"
                );


            if (actionButton) {

                const action =
                    actionButton.dataset.action;


                const id =
                    actionButton.dataset.id;


                if (action === "details") {

                    showDetails(id);

                }


                if (action === "approve") {

                    approveWithdrawal(id);

                }


                if (action === "reject") {

                    rejectWithdrawal(id);

                }


                if (action === "complete") {

                    completeWithdrawal(id);

                }


                return;

            }


            const walletButton =
                event.target.closest(
                    "[data-copy-wallet]"
                );


            if (walletButton) {

                copyWallet(
                    walletButton.dataset.copyWallet
                );

            }

        }
    );


    /* =====================================================
       REFRESH
    ===================================================== */

    const refreshButton =
        $("refreshWithdrawals");


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function () {

                renderWithdrawals();

            }
        );

    }


    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    const closeDetailsButton =
        $("closeWithdrawalDetails");


    if (closeDetailsButton) {

        closeDetailsButton.addEventListener(
            "click",
            function () {

                const card =
                    $("withdrawalDetailsCard");


                if (card) {

                    card.hidden = true;

                }

            }
        );

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    function applyFilters() {

        const search =
            ($("withdrawalSearch")?.value || "")
                .trim()
                .toLowerCase();


        const status =
            $("withdrawalStatus")?.value
            || "all";


        const network =
            $("withdrawalNetwork")?.value
            || "all";


        const dateFrom =
            $("withdrawalDateFrom")?.value
            || "";


        const dateTo =
            $("withdrawalDateTo")?.value
            || "";


        const filtered =
            withdrawals.filter(
                function (item) {


                    const searchable = [

                        item.userName,

                        item.email,

                        item.uid,

                        item.wallet,

                        item.txid

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
                        item.status !== status
                    ) {

                        return false;

                    }


                    if (
                        network !== "all" &&
                        item.network !== network
                    ) {

                        return false;

                    }


                    if (
                        dateFrom &&
                        item.date < dateFrom
                    ) {

                        return false;

                    }


                    if (
                        dateTo &&
                        item.date > dateTo
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        renderFilteredWithdrawals(
            filtered
        );

    }


    function renderFilteredWithdrawals(
        list
    ) {

        const body =
            $("withdrawalsBody");


        if (!body) return;


        if (!list.length) {

            body.innerHTML = `

                <tr>

                    <td
                        colspan="18"
                        class="withdrawals-empty"
                    >

                        <div class="withdrawals-empty-icon">
                            −
                        </div>

                        <strong>
                            لا توجد نتائج
                        </strong>

                        <span>
                            لم يتم العثور على طلبات مطابقة.
                        </span>

                    </td>

                </tr>

            `;


            setText(
                "withdrawalsResultCount",
                "0 طلب"
            );


            return;

        }


        /*
         * نستخدم renderWithdrawals مؤقتًا
         * بعد استبدال القائمة.
         */

        const original =
            withdrawals;


        withdrawals =
            list;


        renderWithdrawals();


        withdrawals =
            original;

    }


    const applyFilterButton =
        $("applyWithdrawalFilters");


    if (applyFilterButton) {

        applyFilterButton.addEventListener(
            "click",
            applyFilters
        );

    }


    const resetFilterButton =
        $("resetWithdrawalFilters");


    if (resetFilterButton) {

        resetFilterButton.addEventListener(
            "click",
            function () {


                if ($("withdrawalSearch"))
                    $("withdrawalSearch").value = "";


                if ($("withdrawalStatus"))
                    $("withdrawalStatus").value = "all";


                if ($("withdrawalNetwork"))
                    $("withdrawalNetwork").value = "all";


                if ($("withdrawalDateFrom"))
                    $("withdrawalDateFrom").value = "";


                if ($("withdrawalDateTo"))
                    $("withdrawalDateTo").value = "";


                renderWithdrawals();

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "VALORA ADMIN — withdrawals.js loaded"
        );


        renderWithdrawals();

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
