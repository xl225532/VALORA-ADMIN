/* =========================================================
   VALORA ADMIN — IDENTITY VERIFICATION
   MANUAL REVIEW SYSTEM
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       VERIFICATION REQUESTS
    ===================================================== */

    let verificationRequests = [];


    let selectedRequest = null;


    /* =====================================================
       HELPERS
    ===================================================== */

    function el(id) {

        return document.getElementById(id);

    }


    function escapeHtml(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    function setText(id, value) {

        const element = el(id);

        if (element) {

            element.textContent =
                value ?? "—";

        }

    }


    function statusText(status) {

        const statuses = {

            pending: "قيد الانتظار",

            approved: "موثق ومقبول",

            rejected: "مرفوض"

        };

        return statuses[status] || status;

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderRequests() {

        const body =
            el("verificationBody");


        if (!body) {

            console.warn(
                "verificationBody غير موجود في HTML"
            );

            return;

        }


        if (!verificationRequests.length) {

            body.innerHTML = `

                <tr>

                    <td
                        colspan="10"
                        class="verification-empty"
                    >

                        <div
                            class="verification-empty-icon"
                        >
                            ✓
                        </div>

                        <strong>
                            لا توجد طلبات توثيق حاليًا
                        </strong>

                        <span>
                            ستظهر طلبات توثيق الهوية هنا عند وصولها.
                        </span>

                    </td>

                </tr>

            `;

            updateStats();

            return;

        }


        body.innerHTML =
            verificationRequests.map(
                (request, index) => {

                    return `

                        <tr
                            data-id="${escapeHtml(request.id)}"
                        >

                            <td>
                                ${index + 1}
                            </td>


                            <td>

                                <strong>
                                    ${escapeHtml(
                                        request.userName
                                    )}
                                </strong>

                            </td>


                            <td dir="ltr">
                                ${escapeHtml(
                                    request.email
                                )}
                            </td>


                            <td dir="ltr">
                                ${escapeHtml(
                                    request.uid
                                )}
                            </td>


                            <td>
                                ${escapeHtml(
                                    request.documentType
                                )}
                            </td>


                            <td>
                                ${escapeHtml(
                                    request.country
                                )}
                            </td>


                            <td>
                                ${escapeHtml(
                                    request.submittedDate
                                )}
                            </td>


                            <td>
                                ${escapeHtml(
                                    request.submittedTime
                                )}
                            </td>


                            <td>

                                <span
                                    class="verification-status status-${escapeHtml(
                                        request.status
                                    )}"
                                >

                                    ${statusText(
                                        request.status
                                    )}

                                </span>

                            </td>


                            <td>

                                <div
                                    class="verification-actions"
                                >

                                    <button
                                        type="button"
                                        class="verification-details-button"
                                        data-action="details"
                                        data-id="${escapeHtml(
                                            request.id
                                        )}"
                                    >
                                        التفاصيل
                                    </button>


                                    ${
                                        request.status === "pending"

                                        ?

                                        `

                                            <button
                                                type="button"
                                                class="verification-approve-button"
                                                data-action="approve"
                                                data-id="${escapeHtml(
                                                    request.id
                                                )}"
                                            >
                                                ✓ قبول
                                            </button>


                                            <button
                                                type="button"
                                                class="verification-reject-button"
                                                data-action="reject"
                                                data-id="${escapeHtml(
                                                    request.id
                                                )}"
                                            >
                                                × رفض
                                            </button>

                                        `

                                        :

                                        ""

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
            verificationRequests.filter(
                item =>
                    item.status === "pending"
            );


        const approved =
            verificationRequests.filter(
                item =>
                    item.status === "approved"
            );


        const rejected =
            verificationRequests.filter(
                item =>
                    item.status === "rejected"
            );


        /*
         * نحاول دعم أكثر من ID
         * حتى لو كان HTML مختلفًا قليلًا.
         */

        const possibleIds = {

            pending: [
                "pendingVerificationCount",
                "pendingVerificationsCount",
                "verificationPendingCount"
            ],

            approved: [
                "approvedVerificationCount",
                "approvedVerificationsCount",
                "verificationApprovedCount"
            ],

            rejected: [
                "rejectedVerificationCount",
                "rejectedVerificationsCount",
                "verificationRejectedCount"
            ],

            total: [
                "totalVerificationCount",
                "totalVerificationsCount",
                "verificationResultCount"
            ]

        };


        setFirstAvailable(
            possibleIds.pending,
            pending.length
        );


        setFirstAvailable(
            possibleIds.approved,
            approved.length
        );


        setFirstAvailable(
            possibleIds.rejected,
            rejected.length
        );


        setFirstAvailable(
            possibleIds.total,
            verificationRequests.length
        );

    }


    function setFirstAvailable(ids, value) {

        for (
            let i = 0;
            i < ids.length;
            i++
        ) {

            const element =
                el(ids[i]);


            if (element) {

                element.textContent =
                    value;

                return;

            }

        }

    }


    /* =====================================================
       SHOW DETAILS
    ===================================================== */

    function showDetails(id) {

        const request =
            verificationRequests.find(
                item =>
                    item.id === id
            );


        if (!request) {

            return;

        }


        selectedRequest =
            request;


        /*
         * ندعم أكثر من ID
         * ليتوافق الملف مع اختلاف HTML.
         */

        showElement(
            [
                "verificationDetailsCard",
                "verification-details-card"
            ]
        );


        setFirstAvailable(
            [
                "detailVerificationUserName",
                "verificationDetailUserName",
                "detailUserName"
            ],
            request.userName
        );


        setFirstAvailable(
            [
                "detailVerificationEmail",
                "verificationDetailEmail",
                "detailUserEmail"
            ],
            request.email
        );


        setFirstAvailable(
            [
                "detailVerificationUID",
                "verificationDetailUID",
                "detailUserUID"
            ],
            request.uid
        );


        setFirstAvailable(
            [
                "detailDocumentType",
                "verificationDetailDocumentType"
            ],
            request.documentType
        );


        setFirstAvailable(
            [
                "detailDocumentNumber",
                "verificationDetailDocumentNumber"
            ],
            request.documentNumber
        );


        setFirstAvailable(
            [
                "detailCountry",
                "verificationDetailCountry"
            ],
            request.country
        );


        setFirstAvailable(
            [
                "detailVerificationDate",
                "verificationDetailDate"
            ],
            request.submittedDate
        );


        setFirstAvailable(
            [
                "detailVerificationTime",
                "verificationDetailTime"
            ],
            request.submittedTime
        );


        setFirstAvailable(
            [
                "detailVerificationStatus",
                "verificationDetailStatus"
            ],
            statusText(
                request.status
            )
        );


        /*
         * صورة الهوية
         */

        setImage(
            [
                "detailIdentityImage",
                "verificationIdentityImage",
                "identityImagePreview"
            ],
            request.identityImage
        );


        /*
         * صورة السيلفي
         */

        setImage(
            [
                "detailSelfieImage",
                "verificationSelfieImage",
                "selfieImagePreview"
            ],
            request.selfieImage
        );


        /*
         * الملاحظات
         */

        const notes =
            findFirstElement([
                "verificationAdminNotes",
                "verificationNotes",
                "adminVerificationNotes"
            ]);


        if (notes) {

            notes.value =
                request.notes || "";

        }


        /*
         * تمرير الصفحة إلى التفاصيل
         */

        const card =
            findFirstElement([
                "verificationDetailsCard",
                "verification-details-card"
            ]);


        if (card) {

            card.hidden = false;


            card.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =====================================================
       IMAGE
    ===================================================== */

    function setImage(ids, src) {

        const image =
            findFirstElement(ids);


        if (!image) {

            return;

        }


        image.src =
            src || "";


        image.alt =
            "صورة مستند التوثيق";


        image.style.display =
            src ? "block" : "none";

    }


    /* =====================================================
       APPROVE
    ===================================================== */

    function approveVerification(id) {

        const request =
            verificationRequests.find(
                item =>
                    item.id === id
            );


        if (!request) {

            return;

        }


        if (
            request.status !==
            "pending"
        ) {

            alert(
                "هذا الطلب تمت معالجته مسبقًا."
            );

            return;

        }


        const confirmed =
            confirm(
                "هل أنت متأكد من قبول توثيق هذا المستخدم؟\n\n" +
                "بعد القبول سيتم اعتبار حساب المستخدم موثقًا."
            );


        if (!confirmed) {

            return;

        }


        request.status =
            "approved";


        request.notes =
            "تم قبول التوثيق من الإدارة.";


        renderRequests();


        showDetails(id);


        alert(
            "تم قبول طلب التوثيق بنجاح."
        );

    }


    /* =====================================================
       REJECT
    ===================================================== */

    function rejectVerification(id) {

        const request =
            verificationRequests.find(
                item =>
                    item.id === id
            );


        if (!request) {

            return;

        }


        if (
            request.status !==
            "pending"
        ) {

            alert(
                "هذا الطلب تمت معالجته مسبقًا."
            );

            return;

        }


        const reason =
            prompt(
                "اكتب سبب رفض توثيق الهوية:"
            );


        if (reason === null) {

            return;

        }


        const cleanReason =
            reason.trim();


        if (!cleanReason) {

            alert(
                "يجب كتابة سبب الرفض."
            );

            return;

        }


        request.status =
            "rejected";


        request.notes =
            cleanReason;


        renderRequests();


        showDetails(id);


        alert(
            "تم رفض طلب التوثيق."
        );

    }


    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    function closeDetails() {

        const card =
            findFirstElement([
                "verificationDetailsCard",
                "verification-details-card"
            ]);


        if (card) {

            card.hidden = true;

        }


        selectedRequest =
            null;

    }


    /* =====================================================
       REFRESH
    ===================================================== */

    function refreshRequests() {

        /*
         * حاليًا يقوم بإعادة عرض البيانات.
         *
         * عند الربط الحقيقي سيتم استبدال هذا
         * باستدعاء قاعدة البيانات / API.
         */

        renderRequests();

    }


    /* =====================================================
       FILTER
    ===================================================== */

    function applyFilters() {

        /*
         * هذه النسخة تحافظ على البيانات الأصلية.
         * يمكن لاحقًا ربطها بقاعدة البيانات.
         */

        const searchInput =
            findFirstElement([
                "verificationSearch",
                "searchVerification",
                "verificationQuery"
            ]);


        const statusInput =
            findFirstElement([
                "verificationStatus",
                "verificationFilterStatus"
            ]);


        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const status =
            statusInput
                ? statusInput.value
                : "all";


        const filtered =
            verificationRequests.filter(
                request => {

                    const matchesSearch =
                        !search ||

                        String(
                            request.userName
                        )
                        .toLowerCase()
                        .includes(search)

                        ||

                        String(
                            request.email
                        )
                        .toLowerCase()
                        .includes(search)

                        ||

                        String(
                            request.uid
                        )
                        .toLowerCase()
                        .includes(search);


                    const matchesStatus =
                        status === "all" ||
                        request.status === status;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );


        renderFilteredRequests(
            filtered
        );

    }


    /* =====================================================
       RENDER FILTERED
    ===================================================== */

    function renderFilteredRequests(
        requests
    ) {

        const body =
            el("verificationBody");


        if (!body) {

            return;

        }


        if (!requests.length) {

            body.innerHTML = `

                <tr>

                    <td
                        colspan="10"
                        class="verification-empty"
                    >

                        <strong>
                            لا توجد نتائج
                        </strong>

                    </td>

                </tr>

            `;

            return;

        }


        body.innerHTML =
            requests.map(
                (request, index) => {

                    return `

                        <tr
                            data-id="${escapeHtml(
                                request.id
                            )}"
                        >

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                <strong>
                                    ${escapeHtml(
                                        request.userName
                                    )}
                                </strong>
                            </td>

                            <td dir="ltr">
                                ${escapeHtml(
                                    request.email
                                )}
                            </td>

                            <td dir="ltr">
                                ${escapeHtml(
                                    request.uid
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    request.documentType
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    request.country
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    request.submittedDate
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    request.submittedTime
                                )}
                            </td>

                            <td>

                                <span
                                    class="verification-status status-${escapeHtml(
                                        request.status
                                    )}"
                                >
                                    ${statusText(
                                        request.status
                                    )}
                                </span>

                            </td>

                            <td>

                                <div
                                    class="verification-actions"
                                >

                                    <button
                                        type="button"
                                        class="verification-details-button"
                                        data-action="details"
                                        data-id="${escapeHtml(
                                            request.id
                                        )}"
                                    >
                                        التفاصيل
                                    </button>

                                    ${
                                        request.status === "pending"
                                        ?

                                        `

                                        <button
                                            type="button"
                                            class="verification-approve-button"
                                            data-action="approve"
                                            data-id="${escapeHtml(
                                                request.id
                                            )}"
                                        >
                                            ✓ قبول
                                        </button>

                                        <button
                                            type="button"
                                            class="verification-reject-button"
                                            data-action="reject"
                                            data-id="${escapeHtml(
                                                request.id
                                            )}"
                                        >
                                            × رفض
                                        </button>

                                        `

                                        :

                                        ""

                                    }

                                </div>

                            </td>

                        </tr>

                    `;

                }
            ).join("");

    }


    /* =====================================================
       FIND ELEMENT
    ===================================================== */

    function findFirstElement(ids) {

        for (
            let i = 0;
            i < ids.length;
            i++
        ) {

            const element =
                el(ids[i]);


            if (element) {

                return element;

            }

        }


        return null;

    }


    function showElement(ids) {

        const element =
            findFirstElement(ids);


        if (element) {

            element.hidden = false;

            element.style.display =
                "";

        }

    }


    function setFirstAvailable(
        ids,
        value
    ) {

        const element =
            findFirstElement(ids);


        if (element) {

            element.textContent =
                value ?? "—";

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


                else if (
                    action === "approve"
                ) {

                    approveVerification(id);

                }


                else if (
                    action === "reject"
                ) {

                    rejectVerification(id);

                }


                return;

            }


            /*
             * إغلاق التفاصيل
             */

            if (
                event.target.closest(
                    "#closeVerificationDetails"
                )
            ) {

                closeDetails();

            }

        }
    );


    /* =====================================================
       REFRESH BUTTON
    ===================================================== */

    const refreshButton =
        findFirstElement([
            "refreshVerification",
            "refreshVerifications"
        ]);


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshRequests
        );

    }


    /* =====================================================
       FILTER BUTTON
    ===================================================== */

    const applyButton =
        findFirstElement([
            "applyVerificationFilters",
            "applyVerificationFilter"
        ]);


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            applyFilters
        );

    }


    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const resetButton =
        findFirstElement([
            "resetVerificationFilters",
            "resetVerificationFilter"
        ]);


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                const searchInput =
                    findFirstElement([
                        "verificationSearch",
                        "searchVerification",
                        "verificationQuery"
                    ]);


                const statusInput =
                    findFirstElement([
                        "verificationStatus",
                        "verificationFilterStatus"
                    ]);


                if (searchInput) {

                    searchInput.value = "";

                }


                if (statusInput) {

                    statusInput.value = "all";

                }


                renderRequests();

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        console.log(
            "VALORA VERIFICATION JS LOADED"
        );


        renderRequests();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }

    else {

        init();

    }


})();
