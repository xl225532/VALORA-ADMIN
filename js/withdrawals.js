/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   DEMO + MANUAL APPROVAL SYSTEM
========================================================= */

(function () {

    "use strict";

    /* =====================================================
       DEMO WITHDRAWAL
    ===================================================== */

    let withdrawals = [

        {
            id: "WD-DEMO-001",

            userName: "أحمد محمد",

            email: "ahmed@example.com",

            uid: "VAL-10001",

            amount: 150,

            currency: "USDT",

            balanceBefore: 850,

            balanceAfter: 700,

            wallet:
                "TQExampleWalletAddress123456789",

            network: "TRC20",

            fee: 2,

            netAmount: 148,

            date: "2026-08-14",

            time: "12:30",

            status: "pending",

            txid: "",

            notes: ""

        }

    ];


    let selectedWithdrawal = null;


    /* =====================================================
       HELPERS
    ===================================================== */

    function el(id) {

        return document.getElementById(id);

    }


    function formatAmount(value) {

        const number = Number(value || 0);

        return number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    function statusText(status) {

        const statuses = {

            pending: "قيد الانتظار",

            processing: "قيد التنفيذ",

            completed: "مكتمل",

            rejected: "مرفوض"

        };

        return statuses[status] || status;

    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderWithdrawals() {

        const body = el("withdrawalsBody");

        if (!body) return;


        if (!withdrawals.length) {

            body.innerHTML = `
                <tr>
                    <td colspan="18" class="withdrawals-empty">

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

            updateStats();

            return;
        }


        body.innerHTML = withdrawals.map(
            (withdrawal, index) => {

                return `

                <tr data-id="${escapeHtml(withdrawal.id)}">

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        <strong>
                            ${escapeHtml(withdrawal.userName)}
                        </strong>
                    </td>


                    <td dir="ltr">
                        ${escapeHtml(withdrawal.email)}
                    </td>


                    <td dir="ltr">
                        ${escapeHtml(withdrawal.uid)}
                    </td>


                    <td>
                        ${formatAmount(withdrawal.amount)}
                    </td>


                    <td>
                        ${escapeHtml(withdrawal.currency)}
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
                                ${escapeHtml(withdrawal.wallet)}
                            </span>

                            <button
                                type="button"
                                class="withdrawal-copy-button"
                                data-copy="${escapeHtml(withdrawal.wallet)}"
                            >
                                نسخ
                            </button>

                        </div>

                    </td>


                    <td>
                        ${escapeHtml(withdrawal.network)}
                    </td>


                    <td>
                        ${formatAmount(withdrawal.fee)}
                    </td>


                    <td>
                        ${formatAmount(withdrawal.netAmount)}
                    </td>


                    <td>
                        ${escapeHtml(withdrawal.date)}
                    </td>


                    <td>
                        ${escapeHtml(withdrawal.time)}
                    </td>


                    <td>

                        <span class="withdrawal-status status-${escapeHtml(withdrawal.status)}">

                            ${statusText(withdrawal.status)}

                        </span>

                    </td>


                    <td dir="ltr">

                        ${withdrawal.txid
                            ? escapeHtml(withdrawal.txid)
                            : "—"
                        }

                    </td>


                    <td>

                        ${withdrawal.notes
                            ? escapeHtml(withdrawal.notes)
                            : "—"
                        }

                    </td>


                    <td>

                        <div class="withdrawal-actions">

                            <button
                                type="button"
                                class="withdrawal-details-button"
                                data-action="details"
                                data-id="${escapeHtml(withdrawal.id)}"
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
                                    data-id="${escapeHtml(withdrawal.id)}"
                                >
                                    ✓ قبول
                                </button>


                                <button
                                    type="button"
                                    class="withdrawal-reject-button"
                                    data-action="reject"
                                    data-id="${escapeHtml(withdrawal.id)}"
                                >
                                    × رفض
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


        updateStats();

    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStats() {

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
                (sum, item) =>
                    sum + Number(item.amount || 0),
                0
            );


        const completedAmount =
            completed.reduce(
                (sum, item) =>
                    sum + Number(item.amount || 0),
                0
            );


        const rejectedAmount =
            rejected.reduce(
                (sum, item) =>
                    sum + Number(item.amount || 0),
                0
            );


        if (el("pendingWithdrawalsCount"))
            el("pendingWithdrawalsCount").textContent =
                pending.length;


        if (el("pendingWithdrawalsAmount"))
            el("pendingWithdrawalsAmount").textContent =
                formatAmount(pendingAmount) + " USDT";


        if (el("processingWithdrawalsCount"))
            el("processingWithdrawalsCount").textContent =
                processing.length;


        if (el("completedWithdrawalsCount"))
            el("completedWithdrawalsCount").textContent =
                completed.length;


        if (el("totalWithdrawnAmount"))
            el("totalWithdrawnAmount").textContent =
                formatAmount(completedAmount) + " USDT";


        if (el("rejectedWithdrawalsCount"))
            el("rejectedWithdrawalsCount").textContent =
                rejected.length;


        if (el("rejectedWithdrawalsAmount"))
            el("rejectedWithdrawalsAmount").textContent =
                formatAmount(rejectedAmount) + " USDT";


        if (el("withdrawalsResultCount"))
            el("withdrawalsResultCount").textContent =
                withdrawals.length + " طلب";

    }


    /* =====================================================
       DETAILS
    ===================================================== */

    function showDetails(id) {

        const withdrawal =
            withdrawals.find(
                item => item.id === id
            );


        if (!withdrawal) return;


        selectedWithdrawal = withdrawal;


        const card =
            el("withdrawalDetailsCard");


        if (!card) return;


        card.hidden = false;


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
            formatAmount(withdrawal.amount) + " " +
            withdrawal.currency
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
            statusText(withdrawal.status)
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
            el("withdrawalAdminNotes");


        if (notes)
            notes.value =
                withdrawal.notes || "";


        card.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function setText(id, value) {

        const element = el(id);

        if (element)
            element.textContent = value;

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
            confirm(
                "هل تريد قبول طلب السحب؟\n\n" +
                "بعد القبول يجب على المدير نسخ عنوان المحفظة وتنفيذ التحويل يدويًا."
            );


        if (!confirmed) return;


        withdrawal.status =
            "processing";


        renderWithdrawals();


        showDetails(id);


        alert(
            "تم قبول الطلب وتحويل حالته إلى «قيد التنفيذ».\n\n" +
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
            prompt(
                "اكتب سبب رفض طلب السحب:"
            );


        if (reason === null) return;


        withdrawal.status =
            "rejected";


        withdrawal.notes =
            reason.trim() ||
            "تم رفض طلب السحب من الإدارة.";


        renderWithdrawals();


        alert(
            "تم رفض طلب السحب."
        );

    }


    /* =====================================================
       COMPLETE MANUAL TRANSFER
    ===================================================== */

    function completeWithdrawal(id) {

        const withdrawal =
            withdrawals.find(
                item => item.id === id
            );


        if (!withdrawal) return;


        if (withdrawal.status !== "processing") {

            alert(
                "الطلب ليس قيد التنفيذ."
            );

            return;
        }


        const txid =
            prompt(
                "بعد تنفيذ التحويل يدويًا، أدخل TXID:"
            );


        if (!txid || !txid.trim()) {

            alert(
                "يجب إدخال TXID لإكمال الطلب."
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
       COPY
    ===================================================== */

    async function copyText(text) {

        try {

            await navigator.clipboard.writeText(text);

            alert("تم النسخ بنجاح.");

        } catch (error) {

            const textarea =
                document.createElement("textarea");

            textarea.value = text;

            document.body.appendChild(textarea);

            textarea.select();

            document.execCommand("copy");

            textarea.remove();

            alert("تم النسخ بنجاح.");

        }

    }


    /* =====================================================
       EVENTS
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


                return;

            }


            const copyButton =
                event.target.closest(
                    "[data-copy]"
                );


            if (copyButton) {

                copyText(
                    copyButton.dataset.copy
                );

            }

        }
    );


    /* =====================================================
       REFRESH
    ===================================================== */

    const refreshButton =
        el("refreshWithdrawals");


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

    const closeButton =
        el("closeWithdrawalDetails");


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                const card =
                    el("withdrawalDetailsCard");


                if (card)
                    card.hidden = true;

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "VALORA WITHDRAWALS JS LOADED"
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
