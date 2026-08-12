/* =========================================================
   VALORA ADMIN
   USERS MANAGEMENT
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const API_BASE_URL = "";

    const USERS_ENDPOINT = "/api/users";


    /* =====================================================
       STATE
    ===================================================== */

    let allUsers = [];

    let filteredUsers = [];

    let currentPage = 1;

    const usersPerPage = 10;


    /* =====================================================
       DOM
    ===================================================== */

    const tableBody =
        document.getElementById("usersTableBody");

    const emptyState =
        document.getElementById("usersEmpty");

    const pagination =
        document.getElementById("usersPagination");

    const paginationInfo =
        document.getElementById("usersPaginationInfo");

    const paginationButtons =
        document.getElementById("usersPaginationButtons");

    const searchInput =
        document.getElementById("userSearch");

    const statusFilter =
        document.getElementById("userStatusFilter");

    const verificationFilter =
        document.getElementById("verificationFilter");

    const refreshButton =
        document.getElementById("refreshUsers");


    /* =====================================================
       HELPERS
    ===================================================== */

    function escapeHtml(value) {

        if (
            value === undefined ||
            value === null
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function formatNumber(value) {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        return new Intl.NumberFormat("ar-SA", {
            maximumFractionDigits: 2
        }).format(number);

    }


    function formatCurrency(
        value,
        currency = "USD"
    ) {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        try {

            return new Intl.NumberFormat("ar-SA", {
                style: "currency",
                currency: currency,
                maximumFractionDigits: 2
            }).format(number);

        } catch (error) {

            return (
                formatNumber(number) +
                " " +
                currency
            );

        }

    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return new Intl.DateTimeFormat(
            "ar-SA",
            {
                dateStyle: "medium"
           
