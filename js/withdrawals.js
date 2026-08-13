/* =========================================================
   VALORA ADMIN — WITHDRAWALS
   FRONT-END MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const tableBody =
        document.getElementById("withdrawalsTableBody");

    const searchInput =
        document.getElementById("withdrawalSearch");

    const statusFilter =
        document.getElementById("withdrawalStatus");

    const networkFilter =
        document.getElementById("withdrawalNetwork");

    const refreshButton =
        document.getElementById("refreshWithdrawals");

    const resetButton =
        document.getElementById("resetWithdrawalFilters");

    const resultCount =
        document.getElementById("withdrawalsResultCount");

    const detailsCard =
        document.getElementById("withdrawalDetails");

    const closeDetails =
        document.getElementById("closeWithdrawalDetails");


    /* =====================================================
       DEMO DATA
       لاحقاً يتم استبدالها ببيانات قاعدة البيانات
    ===================================================== */

    let withdrawals = [
        {
            id: 10001,
            userId: 1001,
            name: "أحمد محمد",
            email: "ahmed@test.com",
            amount: 250,
            fee: 5,
            net: 245,
            network: "TRC20",
            wallet: "TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            status: "pending",
            txid: "",
            createdAt: "2026-08-13 10:30",
            processedAt: ""
        },

        {
            id: 10002,
            userId: 1002,
            name: "محمد علي",
            email: "user@example.com",
            amount: 500,
            fee: 10,
            net: 490,
            network: "BEP20",
            wallet: "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            status: "processing",
            txid: "",
            createdAt: "2026-08-13 09:45",
            processedAt: ""
        },

        {
            id: 10003,
            userId: 1003,
            name: "مستخدم تجريبي",
            email: "demo@example.com",
            amount: 120,
            fee: 2,
            net: 118,
            network: "TRC20",
            wallet: "TYXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            status: "completed",
            txid: "DEMO_TX_9F72A1",
            createdAt: "2026-08-12 18:20",
            processedAt: "2026-08-12 18:32"
        }
    ];


    /* =====================================================
       STATUS LABELS
    ===================================================== */

    const statusLabels = {
        pending: "قيد الانتظار",
        processing: "جاري المعالجة",
        completed: "مكتمل",
        rejected: "مرفوض"
    };


    /* =====================================================
       FORMAT MONEY
    ===================================================== */

    function formatMoney(value) {

        const number = Number(value) || 0;

        return number.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

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
       SHORT ADDRESS
    ===================================================== */

    function shortAddress(address, length = 18) {

        if (!address) {
            return "—";
        }

        if (address.length <= length) {
            return address;
        }

        return (
            address.substring(0, 8) +
            "..." +
            address.substring(address.length - 7)
        );

    }


    /* =====================================================
       STATUS HTML
    ===================================================== */

    function getStatusHTML(status) {

        const label =
            statusLabels[status] ||
            status;

        return `
            <span class="withdrawal-status ${escapeHTML(status)}">
                ${escapeHTML(label)}
            </span>
        `;

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTable(list = withdrawals) {

        if (!tableBody) {
            return;
        }


        if (!list.length) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="20"
                        class="withdrawals-empty"
                    >

                        <div class="withdrawals-empty-icon">
                            ◉
                        </div>

                        <strong>
                            لا توجد طلبات سحب
                        </strong>

                        <span>
                            لا توجد نتائج مطابقة للفلاتر الحالية.
                        </span>

                    </td>
                </tr>
            `;

            updateCount(0);

            return;
        }


        tableBody.innerHTML =
            list.map(item => {

                return `
                    <tr>

                        <td>
                            #${escapeHTML(item.id)}
                        </td>

                        <td>
                            ${escapeHTML
