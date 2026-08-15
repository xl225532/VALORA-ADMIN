/* =========================================================
   VALORA ADMIN — USER DETAILS
   EMPTY DATA STATE
   ========================================================= */

(function () {

    "use strict";

    document.addEventListener(
        "DOMContentLoaded",
        initUserDetails
    );


    function initUserDetails() {

        const userId =
            getUserIdFromURL();

        renderEmptyUser(userId);

    }


    function getUserIdFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        return params.get("id") || "";

    }


    function renderEmptyUser(userId) {

        setText("userName", "—");
        setText("userEmail", "—");
        setText(
            "userId",
            userId ? "UID #" + userId : "—"
        );

        setText("userStatus", "—");
        setText("userBalance", "—");
        setText("userDeposits", "—");
        setText("userWithdrawals", "—");
        setText("userTransactions", "—");
        setText("userReferralsCount", "0");

        setText("detailFullName", "—");
        setText("detailEmail", "—");
        setText("detailUserId", userId || "—");
        setText("detailCreatedAt", "—");
        setText("detailLastActivity", "—");
        setText("detailVerification", "—");
        setText("emailVerified", "—");
        setText("twoFactorStatus", "—");
        setText("lastLogin", "—");
        setText("lastIp", "—");

        setText("userAvatar", "—");

        clearTable("userReferralsBody");
        clearTable("userTransactionsBody");
        clearTable("userActivityList");

    }


    function clearTable(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.innerHTML = "";

    }


    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent =
                value ?? "—";
        }

    }

})();
