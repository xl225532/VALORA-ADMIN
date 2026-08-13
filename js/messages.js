/* =========================================================
   VALORA ADMIN — SUPPORT MESSAGES
   نظام دعم المستخدمين
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

            },


            {
                id: "3",

                userId: "1003",

                name: "محمد علي",

                email: "mohamed@test.com",

                unread: 0,

                messages: [

                    {
                        sender: "user",
                        text: "متى يتم تنفيذ عملية السحب؟",
                        time: "09:45"
                    },

                    {
                        sender: "admin",
                        text: "سيتم مراجعة طلبك من فريق الدعم.",
                        time: "09:50"
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

        renderUsersList();

        setupReply();

    }


    /* =====================================================
       RENDER USERS
    ===================================================== */

    function renderUsersList() {

        const list =
            document.getElementById(
                "messagesUsersList"
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
                        ستظهر رسائل المستخدمين هنا.
                    </p>

                </div>

            `;

            return;
        }


        messagesState.conversations.forEach(
            function (conversation) {

                const button =
                    document.createElement("button");


                button.type = "button";

                button.className =
                    "message-user-item";


                button.dataset.id =
                    conversation.id;


                button.innerHTML = `

                    <div class="message-user-avatar">

                        ${escapeHTML(
                            getInitial(
                                conversation.name
                            )
                        )}

                    </div>


                    <div class="message-user-info">

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


                button.addEventListener(
                    "click",
                    function () {

                        openConversation(
                            conversation.id
                        );

                    }
                );


                list.appendChild(button);

            }
        );

    }


    /* =====================================================
       OPEN CONVERSATION
    ===================================================== */

    function openConversation(id) {

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


        renderUsersList();

        renderChat(conversation);

    }


    /* =====================================================
       RENDER CHAT
    ===================================================== */

    function renderChat(conversation) {

        const header =
            document.getElementById(
                "chatHeader"
            );


        const body =
            document.getElementById(
                "chatBody"
            );


        if (!header || !body) {
            return;
        }


        /* HEADER */

        header.innerHTML = `

            <div class="chat-user-header">

                <div class="chat-user-avatar">

                    ${escapeHTML(
                        getInitial(
                            conversation.name
                        )
                    )}

                </div>


                <div>

                    <strong>
                        ${escapeHTML(
                            conversation.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            conversation.email
                        )}
                        — #${escapeHTML(
                            conversation.userId
                        )}
                    </span>

                </div>

            </div>

        `;


        /* BODY */

        body.innerHTML = "";


        if (
            !conversation.messages ||
            conversation.messages.length === 0
        ) {

            body.innerHTML = `

                <div class="chat-empty">
                    لا توجد رسائل
                </div>

            `;

            return;

        }


        conversation.messages.forEach(
            function (message) {

                const messageRow =
                    document.createElement("div");


                messageRow.className =
                    message.sender === "admin"
                    ?
                    "chat-message chat-message-admin"
                    :
                    "chat-message chat-message-user";


                messageRow.innerHTML = `

                    <div class="chat-message-bubble">

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


                body.appendChild(
                    messageRow
                );

            }
        );


        body.scrollTop =
            body.scrollHeight;

    }


    /* =====================================================
       REPLY
    ===================================================== */

    function setupReply() {

        const button =
            document.getElementById(
                "sendReply"
            );


        const input =
            document.getElementById(
                "replyMessage"
            );


        if (!button || !input) {
            return;
        }


        button.addEventListener(
            "click",
            sendReply
        );


        input.addEventListener(
            "keydown",
            function (event) {

                /*
                 Enter = إرسال
                 Shift + Enter = سطر جديد
                */

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendReply();

                }

            }
        );

    }


    /* =====================================================
       SEND REPLY
    ===================================================== */

    function sendReply() {

        const input =
            document.getElementById(
                "replyMessage"
            );


        if (!input) {
            return;
        }


        const text =
            input.value.trim();


        if (!text) {

            alert(
                "اكتب الرسالة أولاً."
            );

            return;

        }


        if (
            !messagesState.selectedConversation
        ) {

            alert(
                "اختر مستخدمًا أولاً."
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


        renderChat(
            messagesState.selectedConversation
        );


        renderUsersList();

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


})();
