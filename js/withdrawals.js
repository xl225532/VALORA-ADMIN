/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   Manual Withdrawal Management
   Compatible with withdrawals.html
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const STORAGE_KEY = "valora_admin_withdrawals";


    /* =====================================================
       STATE
    ===================================================== */

    let withdrawals = [];

    let selectedWithdrawalId = null;

    let filteredWithdrawals = [];


    /* =====================================================
       DOM
    ===================================================== */

    const $ = (selector) => document.querySelector(selector);


    const elements = {

        body:
            $("#withdrawalsBody"),

        search:
            $("#withdrawalSearch"),

        status:
            $("#withdrawalStatus"),

        network:
            $("#withdrawalNetwork"),

        dateFrom:
            $("#withdrawalDateFrom"),

        dateTo:
            $("#withdrawalDateTo"),

        applyFilters:
            $("#applyWithdrawalFilters"),

        resetFilters:
            $("#resetWithdrawalFilters"),

        refresh:
            $("#refreshWithdrawals"),

        resultCount:
            $("#withdrawalsResultCount"),


        pendingCount:
            $("#pendingWithdrawalsCount"),

        pendingAmount:
            $("#pendingWithdrawalsAmount"),

        processingCount:
            $("#processingWithdrawalsCount"),

        completedCount:
            $("#completedWithdrawalsCount"),

        totalAmount:
            $("#totalWithdrawnAmount"),

        rejectedCount:
            $("#rejectedWithdrawalsCount"),

        rejectedAmount:
            $("#rejectedWithdrawalsAmount"),


        detailsCard:
            $("#withdrawalDetailsCard"),

        closeDetails:
            $("#closeWithdrawalDetails"),

        cancelDetails:
            $("#cancelWithdrawalDetails"),


        approve:
            $("#approveWithdrawal"),

        complete:
            $("#markWithdrawalCompleted"),


        actionResult:
            $("#withdrawalActionResult"),


        userName:
            $("#detailUserName"),

        userEmail:
            $("#detailUserEmail"),

        userUID:
            $("#detailUserUID"),

        amount:
            $("#detailAmount"),

        currency:
            $("#detailCurrency"),

        balance:
            $("#detailBalance"),

        balanceBefore:
            $("#detailBalanceBefore"),

        balanceAfter:
            $("#detailBalanceAfter"),

        fee:
            $("#detailFee"),

        netAmount:
            $("#detailNetAmount"),

        networkDetail:
            $("#detailNetwork"),

        date:
            $("#detailDate"),

        time:
            $("#detailTime"),

        statusDetail:
            $("#detailStatus"),

        wallet:
            $("#detailWallet"),

        txid:
            $("#detailTxid"),

        txidInput:
            $("#withdrawalTxidInput"),

        adminNotes:
            $("#withdrawalAdminNotes"),

        copyWallet:
            $("#copyWithdrawalWallet"),

        copyTxid:
            $("#copyWithdrawalTxid")

    };


    /* =====================================================
       HELPERS
    ===================================================== */

    function generateId() {

        return (
            "WD-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 7)
                .toUpperCase()
        );

    }


    function formatAmount(value) {

        const number = Number(value) || 0;

        return number.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function getStatusText(status) {

        const statuses = {

            pending:
                "قيد الانتظار",

            processing:
                "قيد التنفيذ",

            completed:
                "مكتمل",

            rejected:
                "مرفوض"

        };

        return statuses[status] || status;

    }


    function getStatusClass(status) {

        return `withdrawal-status withdrawal-status-${status}`;

    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("ar-SA");

    }


    function formatTime(dateValue) {

        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit"
        });

    }


    function copyText(text) {

        if (!text || text === "—") {
            return Promise.reject();
        }


        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            return navigator.clipboard.writeText(text);

        }


        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        try {

            document.execCommand("copy");

        } finally {

            textarea.remove();

        }

        return Promise.resolve();

    }


    function showActionResult(message, type = "success") {

        if (!elements.actionResult) {
            return;
        }

        elements.actionResult.hidden = false;

        elements.actionResult.textContent = message;

        elements.actionResult.className =
            `withdrawal-action-result ${type}`;

    }


    function hideActionResult() {

        if (!elements.actionResult) {
            return;
        }

        elements.actionResult.hidden = true;

        elements.actionResult.textContent = "";

        elements.actionResult.className =
            "withdrawal-action-result";

    }


    /* =====================================================
       STORAGE
    ===================================================== */

    function saveWithdrawals() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(withdrawals)
            );

        } catch (error) {

            console.warn(
                "Unable to save withdrawals:",
                error
            );

        }

    }


    function loadWithdrawals() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {

                withdrawals = [];

                return;

            }


            const parsed =
                JSON.parse(saved);

            withdrawals =
                Array.isArray(parsed)
                    ? parsed
                    : [];

        } catch (error) {

            console.warn(
                "Unable to load withdrawals:",
                error
            );

            withdrawals = [];

        }

    }


    /* =====================================================
       OPTIONAL DEMO DATA
       Disabled by default.
    ===================================================== */

    function createDemoWithdrawal() {

        const now = new Date();

        return {

            id:
                generateId(),

            userName:
                "مستخدم تجريبي",

            email:
                "demo@example.com",

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

            requestedAt:
                now.toISOString(),

            status:
                "pending",

            txid:
                "",

            adminNotes:
                ""

        };

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTable() {

        if (!elements.body) {
            return;
        }


        elements.body.innerHTML = "";


        if (!filteredWithdrawals.length) {

            elements.body.innerHTML = `

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

            updateResultCount();

            return;

        }


        filteredWithdrawals.forEach(
            (withdrawal, index) => {

                const row =
                    document.createElement("tr");

                row.dataset.withdrawalId =
                    withdrawal.id;


                row.innerHTML = `

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


                    <td>
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
                        <strong>
                            ${formatAmount(
                                withdrawal.amount
                            )}
                        </strong>
                    </td>


                    <td>
                        ${escapeHTML(
                            withdrawal.currency
                        )}
                    </td>


                    <td>
                        ${formatAmount(
                            withdrawal.balanceBefore
                        )}
                    </td>


                    <td>
                        ${formatAmount(
                            withdrawal.balanceAfter
                        )}
                    </td>


                    <td>

                        <span
                            class="withdrawal-wallet-cell"
                            dir="ltr"
                            title="${escapeHTML(
                                withdrawal.wallet
                            )}"
                        >
                            ${escapeHTML(
                                shortenWallet(
                                    withdrawal.wallet
                                )
                            )}
                        </span>

                    </td>


                    <td>
                        ${escapeHTML(
                            withdrawal.network
                        )}
                    </td>


                    <td>
                        ${formatAmount(
                            withdrawal.fee
                        )}
                    </td>


                    <td>
                        ${formatAmount(
                            withdrawal.netAmount
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            withdrawal.requestedAt
                        )}
                    </td>


                    <td>
                        ${formatTime(
                            withdrawal.requestedAt
                        )}
                    </td>


                    <td>

                        <span
                            class="${getStatusClass(
                                withdrawal.status
                            )}"
                        >
                            ${getStatusText(
                                withdrawal.status
                            )}
                        </span>

                    </td>


                    <td dir="ltr">

                        ${
                            withdrawal.txid
                                ? escapeHTML(
                                    shortenTxid(
                                        withdrawal.txid
                                    )
                                )
                                : "—"
                        }

                    </td>


                    <td>

                        ${
                            withdrawal.adminNotes
                                ? escapeHTML(
                                    withdrawal.adminNotes
                                )
                                : "—"
                        }

                    </td>


                    <td>

                        <button
                            type="button"
                            class="withdrawal-view-button"
                            data-action="view"
                            data-id="${escapeHTML(
                                withdrawal.id
                            )}"
                        >
                            التفاصيل
                        </button>

                    </td>

                `;


                elements.body.appendChild(row);

            }
        );


        updateResultCount();

    }


    function shortenWallet(wallet) {

        if (!wallet) {
            return "—";
        }

        if (wallet.length <= 22) {
            return wallet;
        }

        return (
            wallet.substring(0, 10) +
            "..." +
            wallet.substring(wallet.length - 8)
        );

    }


    function shortenTxid(txid) {

        if (!txid) {
            return "—";
        }

        if (txid.length <= 22) {
            return txid;
        }

        return (
            txid.substring(0, 9) +
            "..." +
            txid.substring(txid.length - 8)
        );

    }


    /* =====================================================
       FILTERS
    ===================================================== */

    function applyFilters() {

        const search =
            (
                elements.search?.value || ""
            )
            .trim()
            .toLowerCase();


        const status =
            elements.status?.value || "all";


        const network =
            elements.network?.value || "all";


        const dateFrom =
            elements.dateFrom?.value || "";


        const dateTo =
            elements.dateTo?.value || "";


        filteredWithdrawals =
            withdrawals.filter(
                (withdrawal) => {


                    /* SEARCH */

                    if (search) {

                        const searchable = [

                            withdrawal.userName,

                            withdrawal.email,

                            withdrawal.uid,

                            withdrawal.wallet,

                            withdrawal.txid,

                            withdrawal.id

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



                    /* DATE */

                    if (dateFrom) {

                        const withdrawalDate =
                            new Date(
                                withdrawal.requestedAt
                            );

                        const fromDate =
                            new Date(
                                `${dateFrom}T00:00:00`
                            );


                        if (
                            withdrawalDate < fromDate
                        ) {

                            return false;

                        }

                    }



                    if (dateTo) {

                        const withdrawalDate =
                            new Date(
                                withdrawal.requestedAt
                            );

                        const toDate =
                            new Date(
                                `${dateTo}T23:59:59`
                            );


                        if (
                            withdrawalDate > toDate
                        ) {

                            return false;

                        }

                    }


                    return true;

                }
            );


        renderTable();

    }


    function resetFilters() {

        if (elements.search) {
            elements.search.value = "";
        }

        if (elements.status) {
            elements.status.value = "all";
        }

        if (elements.network) {
            elements.network.value = "all";
        }

        if (elements.dateFrom) {
            elements.dateFrom.value = "";
        }

        if (elements.dateTo) {
            elements.dateTo.value = "";
        }


        applyFilters();

    }


    function updateResultCount() {

        if (!elements.resultCount) {
            return;
        }


        const count =
            filteredWithdrawals.length;


        elements.resultCount.textContent =
            `${count} ${count === 1 ? "طلب" : "طلبات"}`;

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
                    total + Number(item.netAmount || 0),
                0
            );


        const rejectedAmount =
            rejected.reduce(
                (total, item) =>
                    total + Number(item.amount || 0),
                0
            );


        if (elements.pendingCount) {

            elements.pendingCount.textContent =
                pending.length;

        }


        if (elements.pendingAmount) {

            elements.pendingAmount.textContent =
                `${formatAmount(
                    pendingAmount
                )} USDT`;

        }


        if (elements.processingCount) {

            elements.processingCount.textContent =
                processing.length;

        }


        if (elements.completedCount) {

            elements.completedCount.textContent =
                completed.length;

        }


        if (elements.totalAmount) {

            elements.totalAmount.textContent =
                `${formatAmount(
                    completedAmount
                )} USDT`;

        }


        if (elements.rejectedCount) {

            elements.rejectedCount.textContent =
                rejected.length;

        }


        if (elements.rejectedAmount) {

            elements.rejectedAmount.textContent =
                `${formatAmount(
                    rejectedAmount
                )} USDT`;

        }

    }


    /* =====================================================
       FIND WITHDRAWAL
    ===================================================== */

    function findWithdrawal(id) {

        return withdrawals.find(
            item => item.id === id
        );

    }


    /* =====================================================
       OPEN DETAILS
    ===================================================== */

    function openDetails(id) {

        const withdrawal =
            findWithdrawal(id);


        if (!withdrawal) {
            return;
        }


        selectedWithdrawalId =
            withdrawal.id;


        hideActionResult();


        fillDetails(withdrawal);


        if (elements.detailsCard) {

            elements.detailsCard.hidden =
                false;


            elements.detailsCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    function fillDetails(withdrawal) {

        setText(
            elements.userName,
            withdrawal.userName
        );


        setText(
            elements.userEmail,
            withdrawal.email
        );


        setText(
            elements.userUID,
            withdrawal.uid
        );


        setText(
            elements.amount,
            `${formatAmount(
                withdrawal.amount
            )} ${withdrawal.currency}`
        );


        setText(
            elements.currency,
            withdrawal.currency
        );


        setText(
            elements.balance,
            `${formatAmount(
                withdrawal.balanceAfter
            )} ${withdrawal.currency}`
        );


        setText(
            elements.balanceBefore,
            `${formatAmount(
                withdrawal.balanceBefore
            )} ${withdrawal.currency}`
        );


        setText(
            elements.balanceAfter,
            `${formatAmount(
                withdrawal.balanceAfter
            )} ${withdrawal.currency}`
        );


        setText(
            elements.fee,
            `${formatAmount(
                withdrawal.fee
            )} ${withdrawal.currency}`
        );


        setText(
            elements.netAmount,
            `${formatAmount(
                withdrawal.netAmount
            )} ${withdrawal.currency}`
        );


        setText(
            elements.networkDetail,
            withdrawal.network
        );


        setText(
            elements.date,
            formatDate(
                withdrawal.requestedAt
            )
        );


        setText(
            elements.time,
            formatTime(
                withdrawal.requestedAt
            )
        );


        setText(
            elements.statusDetail,
            getStatusText(
                withdrawal.status
            )
        );


        setText(
            elements.wallet,
            withdrawal.wallet
        );


        setText(
            elements.txid,
            withdrawal.txid || "—"
        );


        if (elements.txidInput) {

            elements.txidInput.value =
                withdrawal.txid || "";

        }


        if (elements.adminNotes) {

            elements.adminNotes.value =
                withdrawal.adminNotes || "";

        }


        updateActionButtons(
            withdrawal
        );

    }


    function setText(element, value) {

        if (!element) {
            return;
        }

        element.textContent =
            value || "—";

    }


    /* =====================================================
       ACTION BUTTONS
    ===================================================== */

    function updateActionButtons(withdrawal) {

        if (!withdrawal) {
            return;
        }


        if (elements.approve) {

            elements.approve.hidden =
                withdrawal.status !== "pending";

        }


        if (elements.complete) {

            elements.complete.hidden =
                withdrawal.status !== "processing";

        }

    }


    /* =====================================================
       APPROVE
    ===================================================== */

    function approveWithdrawal() {

        if (!selectedWithdrawalId) {
            return;
        }


        const withdrawal =
            findWithdrawal(
                selectedWithdrawalId
            );


        if (!withdrawal) {
            return;
        }


        if (
            withdrawal.status !== "pending"
        ) {

            showActionResult(
                "هذا الطلب لم يعد قيد الانتظار.",
                "error"
            );

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
            "processing";


        withdrawal.approvedAt =
            new Date().toISOString();


        saveCurrentNotes(
            withdrawal
        );


        saveWithdrawals();


        updateStatistics();

        applyFilters();

        fillDetails(
            withdrawal
        );


        showActionResult(
            "تم قبول طلب السحب وأصبح الآن قيد التنفيذ. قم بالتحويل يدويًا إلى عنوان المستخدم.",
            "success"
        );

    }


    /* =====================================================
       COMPLETE
    ===================================================== */

    function completeWithdrawal() {

        if (!selectedWithdrawalId) {
            return;
        }


        const withdrawal =
            findWithdrawal(
                selectedWithdrawalId
            );


        if (!withdrawal) {
            return;
        }


        if (
            withdrawal.status !== "processing"
        ) {

            showActionResult(
                "الطلب ليس في حالة قيد التنفيذ.",
                "error"
            );

            return;

        }


        const txid =
            elements.txidInput?.value.trim();


        if (!txid) {

            showActionResult(
                "أدخل TXID الخاص بالتحويل قبل إكمال السحب.",
                "error"
            );

            if (elements.txidInput) {
                elements.txidInput.focus();
            }

            return;

        }


        const confirmed =
            window.confirm(
                "هل تم تنفيذ التحويل اليدوي بالفعل؟\n\nسيتم تغيير حالة الطلب إلى مكتمل."
            );


        if (!confirmed) {
            return;
        }


        withdrawal.txid =
            txid;


        withdrawal.status =
            "completed";


        withdrawal.completedAt =
            new Date().toISOString();


        saveCurrentNotes(
            withdrawal
        );


        saveWithdrawals();


        updateStatistics();

        applyFilters();

        fillDetails(
            withdrawal
        );


        showActionResult(
            "تم تسجيل التحويل وإكمال طلب السحب.",
            "success"
        );

    }


    /* =====================================================
       NOTES
    ===================================================== */

    function saveCurrentNotes(withdrawal) {

        if (!withdrawal) {
            return;
        }


        if (elements.adminNotes) {

            withdrawal.adminNotes =
                elements.adminNotes.value.trim();

        }

    }


    /* =====================================================
       COPY WALLET
    ===================================================== */

    function handleCopyWallet() {

        if (!selectedWithdrawalId) {
            return;
        }


        const withdrawal =
            findWithdrawal(
                selectedWithdrawalId
            );


        if (!withdrawal?.wallet) {
            return;
        }


        copyText(
            withdrawal.wallet
        )
        .then(() => {

            showActionResult(
                "تم نسخ عنوان محفظة المستخدم.",
                "success"
            );

        })
        .catch(() => {

            showActionResult(
                "تعذر نسخ العنوان.",
                "error"
            );

        });

    }


    /* =====================================================
       COPY TXID
    ===================================================== */

    function handleCopyTxid() {

        let value = "";


        if (
            elements.txidInput &&
            elements.txidInput.value.trim()
        ) {

            value =
                elements.txidInput.value.trim();

        } else if (
            elements.txid?.textContent
        ) {

            value =
                elements.txid.textContent.trim();

        }


        if (!value || value === "—") {

            showActionResult(
                "لا يوجد TXID لنسخه.",
                "error"
            );

            return;

        }


        copyText(value)
            .then(() => {

                showActionResult(
                    "تم نسخ TXID.",
                    "success"
                );

            })
            .catch(() => {

                showActionResult(
                    "تعذر نسخ TXID.",
                    "error"
                );

            });

    }


    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    function closeDetails() {

        if (elements.detailsCard) {

            elements.detailsCard.hidden =
                true;

        }


        selectedWithdrawalId =
            null;


        hideActionResult();

    }


    /* =====================================================
       TABLE CLICK
    ===================================================== */

    function handleTableClick(event) {

        const button =
            event.target.closest(
                "[data-action='view']"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        openDetails(id);

    }


    /* =====================================================
       REFRESH
    ===================================================== */

    function refreshWithdrawals() {

        loadWithdrawals();

        updateStatistics();

        applyFilters();


        if (selectedWithdrawalId) {

            const current =
                findWithdrawal(
                    selectedWithdrawalId
                );


            if (current) {

                fillDetails(
                    current
                );

            }

        }

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    function bindEvents() {

        if (elements.applyFilters) {

            elements.applyFilters.addEventListener(
                "click",
                applyFilters
            );

        }


        if (elements.resetFilters) {

            elements.resetFilters.addEventListener(
                "click",
                resetFilters
            );

        }


        if (elements.refresh) {

            elements.refresh.addEventListener(
                "click",
                refreshWithdrawals
            );

        }


        if (elements.body) {

            elements.body.addEventListener(
                "click",
                handleTableClick
            );

        }


        if (elements.approve) {

            elements.approve.addEventListener(
                "click",
                approveWithdrawal
            );

        }


        if (elements.complete) {

            elements.complete.addEventListener(
                "click",
                completeWithdrawal
            );

        }


        if (elements.closeDetails) {

            elements.closeDetails.addEventListener(
                "click",
                closeDetails
            );

        }


        if (elements.cancelDetails) {

            elements.cancelDetails.addEventListener(
                "click",
                closeDetails
            );

        }


        if (elements.copyWallet) {

            elements.copyWallet.addEventListener(
                "click",
                handleCopyWallet
            );

        }


        if (elements.copyTxid) {

            elements.copyTxid.addEventListener(
                "click",
                handleCopyTxid
            );

        }


        if (elements.adminNotes) {

            elements.adminNotes.addEventListener(
                "input",
                () => {

                    const withdrawal =
                        findWithdrawal(
                            selectedWithdrawalId
                        );


                    if (!withdrawal) {
                        return;
                    }


                    withdrawal.adminNotes =
                        elements.adminNotes.value;

                    saveWithdrawals();

                }
            );

        }


        /* ENTER SEARCH */

        if (elements.search) {

            elements.search.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        applyFilters();

                    }

                }
            );

        }

    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        loadWithdrawals();

        bindEvents();

        updateStatistics();

        applyFilters();

    }


    /* =====================================================
       PUBLIC API
       Useful later for Backend integration
    ===================================================== */

    window.ValoraWithdrawals = {

        getAll: () =>
            [...withdrawals],

        getById: (id) =>
            findWithdrawal(id),

        refresh:
            refreshWithdrawals,

        open:
            openDetails,

        approve:
            approveWithdrawal,

        complete:
            completeWithdrawal

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
