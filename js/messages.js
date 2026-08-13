/* =========================================================
   VALORA ADMIN — SUPPORT MESSAGES
   WhatsApp-style conversations
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
                lastActivity: 3,

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
                lastActivity: 2,

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
                lastActivity: 1,

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


        selectedConversationId: null,


        activityCounter: 3

    };


    /* =====================================================
       INIT
    ===================================================== */

    function initMessages() {

        sortConversations();

        renderUsersList();

        setupReply();

    }


    /* =====================================================
       SORT CONVERSATIONS
       الأحدث دائمًا في الأعلى
    ===================================================== */

    function sortConversations() {

        messagesState.conversations.sort(
            function (a, b) {

                return (
                    b.lastActivity -
                    a.lastActivity
                );

            }
        );

    }


    /* =====================================================
       RENDER USERS LIST
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


        sortConversations();


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
                    document.createElement(
                        "button"
                    );


                button.type = "button";


                button.className =
                    "message-user-item";


                if (
                    messagesState.selectedConversationId ===
                    conversation.id
                ) {

                    button.classList.add(
                        "active"
                    );

                }


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


                    <div class="message-user-meta">

                        <span class="message-time">

                            ${escapeHTML(
                                getLastMessageTime(
                                    conversation
                                )
                            )}

                        </span>


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

                    </div>

                `;


                button.addEventListener(
                    "click",
                    function () {

                        openConversation(
                            conversation.id
                        );

                    }
                );


                list.appendChild(
                    button
                );

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


        messagesState.selectedConversationId =
            conversation.id;


        /*
        =============================================
        عند فتح المحادثة:
        الرسائل غير المقروءة تصبح صفر
        =============================================
        */

        conversation.unread = 0;


        /*
        =============================================
        نخلي المحادثة المختارة في الأعلى
        =============================================
        */

        messagesState.activityCounter++;


        conversation.lastActivity =
            messagesState.activityCounter;


        sortConversations();


        renderUsersList();


        renderChat(
            conversation
        );


    }


    /* =====================================================
       RENDER CHAT
    ===================================================== */

    function renderChat(
        conversation
    ) {

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


        /*
        =============================================
        HEADER
        =============================================
        */

        header.innerHTML = `

            <div class="chat-user-header">

                <div class="chat-user-avatar">

                    ${escapeHTML(
                        getInitial(
                            conversation.name
                        )
                    )}

                </div>


                <div class="chat-user-header-info">

                    <strong>

                        ${escapeHTML(
                            conversation.name
                        )}

                    </strong>


                    <span>

                        ${escapeHTML(
                            conversation.email
                        )}

                        —

                        #${escapeHTML(
                            conversation.userId
                        )}

                    </span>

                </div>

            </div>

        `;


        /*
        =============================================
        BODY
        =============================================
        */

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
                    document.createElement(
                        "div"
                    );


                if (
                    message.sender === "admin"
                ) {

                    messageRow.className =
                        "chat-message chat-message-admin";

                } else {

                    messageRow.className =
                        "chat-message chat-message-user";

                }


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


        /*
        =============================================
        النزول إلى آخر رسالة
        =============================================
        */

        requestAnimationFrame(
            function () {

                body.scrollTop =
                    body.scrollHeight;

            }
        );

    }


    /* =====================================================
       REPLY SETUP
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


        /*
        =============================================
        يجب اختيار مستخدم
        =============================================
        */

        if (
            !messagesState.selectedConversationId
        ) {

            alert(
                "اختر مستخدمًا أولاً."
            );

            return;

        }


        const conversation =
            messagesState.conversations.find(
                function (item) {

                    return (
                        item.id ===
                        messagesState.selectedConversationId
                    );

                }
            );


        if (!conversation) {
            return;
        }


        /*
        =============================================
        الوقت
        =============================================
        */

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


        /*
        =============================================
        إضافة الرسالة
        =============================================
        */

        conversation.messages.push({

            sender: "admin",

            text: text,

            time: time

        });


        /*
        =============================================
        تحديث النشاط
        =============================================
        */

        messagesState.activityCounter++;


        conversation.lastActivity =
            messagesState.activityCounter;


        /*
        =============================================
        الرسالة أرسلت من الإدارة
        لذلك لا نضع unread
        =============================================
        */

        conversation.unread = 0;


        /*
        =============================================
        تفريغ مربع الكتابة
        =============================================
        */

        input.value = "";


        /*
        =============================================
        إعادة ترتيب المحادثات
        =============================================
        */

        sortConversations();


        /*
        =============================================
        إعادة رسم القائمة
        =============================================
        */

        renderUsersList();


        /*
        =============================================
        إبقاء نفس المحادثة مفتوحة
        =============================================
        */

        renderChat(
            conversation
        );

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
       LAST MESSAGE TIME
    ===================================================== */

    function getLastMessageTime(
        conversation
    ) {

        if (
            !conversation.messages ||
            conversation.messages.length === 0
        ) {

            return "";

        }


        const last =
            conversation.messages[
                conversation.messages.length - 1
            ];


        return last.time || "";

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
