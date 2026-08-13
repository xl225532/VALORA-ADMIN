/* =========================================================
   VALORA ADMIN — NOTIFICATIONS JS
   ========================================================= */

(function () {

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    initNotifications
);


/* =========================================================
   STATE
========================================================= */

const notificationsState = {

    history: []

};


/* =========================================================
   INIT
========================================================= */

function initNotifications() {

    setupTargetSelector();

    setupMessagePreview();

    setupClearButton();

    setupSendButton();

    loadNotificationHistory();

}


/* =========================================================
   TARGET SELECTOR
========================================================= */

function setupTargetSelector() {

    const target =
        document.getElementById(
            "notificationTarget"
        );


    const selectedUsersField =
        document.getElementById(
            "selectedUsersField"
        );


    if (!target || !selectedUsersField) {

        return;

    }


    target.addEventListener(
        "change",
        function () {

            if (
                target.value === "selected"
            ) {

                selectedUsersField.hidden =
                    false;

            } else {

                selectedUsersField.hidden =
                    true;

                clearSelectedUsers();

            }

        }
    );

}


/* =========================================================
   MESSAGE PREVIEW
========================================================= */

function setupMessagePreview() {

    const title =
        document.getElementById(
            "notificationTitle"
        );


    const message =
        document.getElementById(
            "notificationMessage"
        );


    const previewTitle =
        document.getElementById(
            "previewTitle"
        );


    const previewMessage =
        document.getElementById(
            "previewMessage"
        );


    const characterCount =
        document.getElementById(
            "notificationCharacterCount"
        );


    if (title) {

        title.addEventListener(
            "input",
            function () {

                if (previewTitle) {

                    previewTitle.textContent =
                        title.value.trim()
                        || "عنوان الإشعار";

                }

            }
        );

    }


    if (message) {

        message.addEventListener(
            "input",
            function () {

                if (previewMessage) {

                    previewMessage.textContent =
                        message.value.trim()
                        || "سيظهر نص الإشعار هنا.";

                }


                if (characterCount) {

                    characterCount.textContent =
                        message.value.length;

                }

            }
        );

    }

}


/* =========================================================
   CLEAR
========================================================= */

function setupClearButton() {

    const button =
        document.getElementById(
            "clearNotification"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        clearNotificationForm
    );

}


function clearNotificationForm() {

    const title =
        document.getElementById(
            "notificationTitle"
        );


    const message =
        document.getElementById(
