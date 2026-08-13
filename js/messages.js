/* =========================================================
   VALORA ADMIN — MESSAGES
   نظام محادثات الدعم
   ========================================================= */

(function () {

    "use strict";


    document.addEventListener(
        "DOMContentLoaded",
        initMessages
    );


    /* =====================================================
       STATE
    ===================================================== */

    const messagesState = {

        conversations: [

            {
                id: "1",

                userId: "1001",

                name: "أحمد محمد",

                email: "ahmed@test.com",

                unread: 2,

                messages: [

                    {
                        sender: "user",
                        text: "السلام عليكم، لدي مشكلة في الإيداع.",
                        time: "10:30"
                    },

                    {
                        sender: "user",
                        text: "ممكن تساعدوني؟",
                        time: "10:31"
                    }

                ]

            },


            {
                id: "2",

                userId: "1002",

                name: "مستخدم تجريبي",

                email: "user@example.com",

                unread: 1,

                messages: [

                    {
                        sender: "user",
                        text: "مرحبا، أريد الاستفسار عن حسابي.",
                        time: "11:15"
                    }

                ]

            }

        ],

        selectedConversation: null

    };


    /* =====================================================
       INIT
    ===================================================== */

    function initMessages() {

        renderConversationList();

        setupSendMessage();

        setupMessageInput();

    }


    /* =====================================================
       RENDER CONVERSATION LIST
    ===================================================== */

    function renderConversationList() {

        const list =
            document.getElementById(
                "messagesList"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        if (
            messagesState.conversations.length === 0
        ) {

            list.innerHTML = `

                <div class="messages-empty">

                    <div class="messages-empty-icon">
                        ▱
                    </div>

                    <h3>
                        لا توجد محادثات
                    </h3>

                    <p>
                        ستظهر هنا رسائل المستخدمين عند وصولها.
                    </p>

                </div>

            `;

            return;
        }


        messagesState.conversations.forEach(
            function (conversation) {

                const item =
                    document.createElement("button");


                item.type = "button";

                item.className =
                    "message-conversation";


                item.dataset.id =
                    conversation.id;


                item.innerHTML = `

                    <div class="message-conversation-avatar">

                        ${escapeHTML(
                            getInitial(
                                conversation.name
                            )
                        )}

                    </div>


                    <div class="message-conversation-info">

                        <strong>
                            ${escapeHTML(
                                conversation.name
                            )}
                        </strong>

                        <span>
                            #${escapeHTML(
                                conversation.userId
                            )}
                        </span>

                        <small>
                            ${escapeHTML(
                                getLastMessage(
                                    conversation
                                )
                            )}
                        </small>

                    </div>


                    ${
                        conversation.unread > 0
                        ?
                        `
                        <span class="message-unread">
                            ${conversation.unread}
                        </span>
                        `
                        :
                        ""
                    }

                `;


                item.addEventListener(
                    "click",
                    function () {

                        selectConversation(
                            conversation.id
                        );

                    }
                );


                list.appendChild(item);

            }
        );

    }


    /* =====================================================
       SELECT CONVERSATION
    ===================================================== */

    function selectConversation(id) {

        const conversation =
            messagesState.conversations.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!conversation) {
            return;
        }


        messagesState.selectedConversation =
            conversation;


        conversation.unread = 0;


        renderConversationList();

        renderConversation(conversation);

    }


    /* =====================================================
       RENDER CONVERSATION
    ===================================================== */

    function renderConversation(conversation) {

        const empty =
            document.getElementById(
                "messagesEmpty"
            );


        const header =
            document.getElementById(
                "messageUserName"
            );


        const email =
            document.getElementById(
                "messageUserEmail"
            );


        const userId =
            document.getElementById(
                "messageUserId"
            );


        const body =
            document.getElementById(
                "messagesBody"
            );


        if (empty) {

            empty.style.display = "none";

        }


        if (header) {

            header.textContent =
                conversation.name;

        }


        if (email) {

            email.textContent =
                conversation.email;

        }


        if (userId) {

            userId.textContent =
                "#" + conversation.userId;

        }


        if (!body) {
            return;
        }


        body.innerHTML = "";


        conversation.messages.forEach(
            function (message) {

                const row =
                    document.createElement("div");


                row.className =
                    message.sender === "admin"
                    ?
                    "message-row message-row-admin"
                    :
                    "message-row message-row-user";


                row.innerHTML = `

                    <div class="message-bubble">

                        <p>
                            ${escapeHTML(
                                message.text
                            )}
                        </p>

                        <small>
                            ${escapeHTML(
                                message.time
                            )}
                        </small>

                    </div>

                `;


                body.appendChild(row);

            }
        );


        body.scrollTop =
            body.scrollHeight;

    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    function setupSendMessage() {

        const button =
            document.getElementById(
                "sendMessage"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            sendMessage
        );

    }


    function sendMessage() {

        const input =
            document.getElementById(
                "messageInput"
            );


        if (!input) {
            return;
        }


        const text =
            input.value.trim();


        if (!text) {
            return;
        }


        if (
            !messagesState.selectedConversation
        ) {

            showMessage(
                "اختر محادثة أولاً."
            );

            return;

        }


        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                "ar",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        messagesState
            .selectedConversation
            .messages
            .push({

                sender: "admin",

                text: text,

                time: time

            });


        input.value = "";


        updateCharacterCount();

        renderConversation(
            messagesState.selectedConversation
        );

    }


    /* =====================================================
       INPUT
    ===================================================== */

    function setupMessageInput() {

        const input =
            document.getElementById(
                "messageInput"
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            updateCharacterCount
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    /* =====================================================
       CHARACTER COUNT
    ===================================================== */

    function updateCharacterCount() {

        const input =
            document.getElementById(
                "messageInput"
            );


        const counter =
            document.getElementById(
                "messageCharacterCount"
            );


        if (!input || !counter) {
            return;
        }


        counter.textContent =
            input.value.length;

    }


    /* =====================================================
       LAST MESSAGE
    ===================================================== */

    function getLastMessage(
        conversation
    ) {

        if (
            !conversation.messages ||
            conversation.messages.length === 0
        ) {

            return "لا توجد رسائل";

        }


        const last =
            conversation.messages[
                conversation.messages.length - 1
            ];


        return last.text;

    }


    /* =====================================================
       INITIAL
    ===================================================== */

    function getInitial(
        name
    ) {

        if (!name) {
            return "?";
        }


        return String(name)
            .trim()
            .charAt(0)
            .toUpperCase();

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* =====================================================
       MESSAGE ALERT
    ===================================================== */

    function showMessage(
        text
    ) {

        alert(text);

    }


})();
