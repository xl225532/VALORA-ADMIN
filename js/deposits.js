/* =========================================================
   VALORA ADMIN — DEPOSITS JS
   واجهة تجريبية مؤقتة — جاهزة للربط مع API لاحقًا
========================================================= */

(function () {

    "use strict";

    document.addEventListener(
        "DOMContentLoaded",
        initDeposits
    );


    /* =====================================================
       INIT
    ===================================================== */

    function initDeposits() {

        renderDeposits();

    }


    /* =====================================================
       DEMO DATA
       سيتم حذفها عند ربط قاعدة البيانات الحقيقية
    ===================================================== */

    const demoDeposits = [

        {
            user: "—",
            uid: "—",
            amount: 0,
            network: "—",
            txid: "—",
            date: "لا توجد إيداعات",
            status: "—"
        }

    ];


    /* =====================================================
       RENDER
    ===================================================== */

    function renderDeposits() {

        const body =
            document.getElementById(
                "depositsBody"
            );


        if (!body) {
            return;
        }


        body.innerHTML = "";


        /*
         * حاليًا لا نعرض أعضاء وهميين.
         * الجدول يبقى فارغًا حتى يصل إيداع حقيقي.
         */

        if (
            !demoDeposits ||
            demoDeposits.length === 0
        ) {

            renderEmptyState(body);

            return;

        }


        /*
         * إذا كانت البيانات مجرد حالة فارغة،
         * نعرض رسالة واضحة بدل بيانات وهمية.
         */

        if (
            demoDeposits.length === 1 &&
            demoDeposits[0].amount === 0
        ) {

            renderEmptyState(body);

            return;

        }


        demoDeposits.forEach(
            function (deposit) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <div class="deposit-user">

                            <strong>
                                ${escapeHTML(deposit.user)}
                            </strong>

                            <span>
                                UID: ${escapeHTML(deposit.uid)}
                            </span>

                        </div>

                    </td>


                    <td dir="ltr">
                        ${escapeHTML(deposit.uid)}
                    </td>


                    <td>

                        <strong class="deposit-amount">
                            ${formatMoney(deposit.amount)}
                        </strong>

                    </td>


                    <td>

                        <span class="deposit-network">
                            ${escapeHTML(deposit.network)}
                        </span>

                    </td>


                    <td>

                        <div
                            class="deposit-txid"
                            title="${escapeHTML(deposit.txid)}"
                        >
                            ${escapeHTML(deposit.txid)}
                        </div>

                    </td>


                    <td>
                        ${escapeHTML(deposit.date)}
                    </td>


                    <td>

                        <span class="deposit-status">
                            ${escapeHTML(deposit.status)}
                        </span>

                    </td>

                `;


                body.appendChild(row);

            }
        );

    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function renderEmptyState(body) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td
                colspan="7"
                style="
                    text-align:center;
                    padding:55px 20px;
                    color:var(--va-text-muted);
                "
            >

                <div
                    style="
                        font-size:28px;
                        margin-bottom:10px;
                    "
                >
                    ＋
                </div>


                <strong
                    style="
                        display:block;
                        color:var(--va-text);
                        margin-bottom:6px;
                    "
                >
                    لا توجد إيداعات
                </strong>


                <span>
                    ستظهر الإيداعات هنا تلقائيًا بعد وصولها وتأكيدها من الشبكة.
                </span>

            </td>

        `;


        body.appendChild(row);

    }


    /* =====================================================
       MONEY
    ===================================================== */

    function formatMoney(value) {

        return (
            Number(value || 0)
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


})();
