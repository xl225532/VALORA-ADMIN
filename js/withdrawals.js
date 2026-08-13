/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body =
        document.getElementById("withdrawalsBody");

    const searchInput =
        document.getElementById("withdrawalSearch");

    const statusFilter =
        document.getElementById("withdrawalStatus");

    const networkFilter =
        document.getElementById("withdrawalNetwork");

    const refreshButton =
        document.getElementById("refreshWithdrawals");

    const resultCount =
        document.getElementById("withdrawalsResultCount");

    const pendingCount =
        document.getElementById("pendingWithdrawalsCount");

    const pendingAmount =
        document.getElementById("pendingWithdrawalsAmount");

    const completedCount =
        document.getElementById("completedWithdrawalsCount");

    const totalAmount =
        document.getElementById("totalWithdrawnAmount");


    /* =====================================================
       DATA
       
       مهم:
       لا توجد بيانات وهمية هنا.
       لاحقًا سيتم استبدال هذا المصدر بقاعدة البيانات.
    ===================================================== */

    let withdrawals = [];


    /* =====================================================
       STATUS TEXT
    ===================================================== */

    const statusNames = {

        pending:
            "قيد الانتظار",

        processing:
            "قيد التنفيذ",

        completed:
            "مكتمل",

        rejected:
            "مرفوض"

    };


    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    function formatAmount(value) {

        const number =
            Number(value) || 0;

        return number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       FILTER DATA
    ===================================================== */

    function getFilteredWithdrawals() {

        const search =
            (searchInput?.value || "")
                .trim()
                .toLowerCase();

        const status =
            statusFilter?.value || "all";

        const network =
            networkFilter?.value || "all";


        return withdrawals.filter(function (item) {

            const searchableText = [

                item.name,
                item.email,
                item.uid,
                item.wallet,
                item.txid

            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(search);


            const matchesStatus =
                status === "all" ||
                item.status === status;


            const matchesNetwork =
                network === "all" ||
                item.network === network;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesNetwork
            );

        });

    }


    /* =====================================================
       RENDER EMPTY
    ===================================================== */

    function renderEmpty() {

        if (!body) {
            return;
        }


        body.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="withdrawals-empty"
                >

                    <div class="withdrawals-empty-icon">
                        −
                    </div>

                    <strong>
                        لا توجد طلبات سحب
                    </strong>

                    <span>
                        ستظهر طلبات السحب القادمة من الموقع الرسمي هنا.
                    </span>

                </td>

            </tr>

        `;

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTable() {

        if (!body) {
            return;
        }


        const filtered =
            getFilteredWithdrawals();


        if (!filtered.length) {

            renderEmpty();

        } else {

            body.innerHTML =
                filtered.map(function (item) {

                    const status =
                        statusNames[item.status] ||
                        item.status ||
                        "غير معروف";


                    const actions =
                        item.status === "pending"
                            ? `

                                <div class="withdrawal-actions">

                                    <button
                                        type="button"
                                        class="withdrawal-action-btn"
                                        data-action="review"
                                        data-id="${escapeHTML(item.id)}"
                                    >
                                        مراجعة
                                    </button>

                                </div>

                              `
                            : `

                                <div class="withdrawal-actions">

                                    <button
                                        type="button"
                                        class="withdrawal-action-btn"
                                        data-action="review"
                                        data-id="${escapeHTML(item.id)}"
                                    >
                                        عرض
                                    </button>

                                </div>

                              `;


                   
