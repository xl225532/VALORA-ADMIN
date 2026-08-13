(function () {

"use strict";


/*
=========================================================
VALORA ADMIN — MESSAGES
=========================================================

نسخة تجريبية لقسم الدعم.

المهام:
- عرض محادثات المستخدمين.
- اختيار محادثة.
- عرض الرسائل.
- إرسال رد من الإدارة.
- إظهار عدد الرسائل غير المقروءة.
- البحث عن مستخدم.
- تحديث واجهة المحادثة.
- لاحقًا يمكن استبدال البيانات التجريبية بـ API.

=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    initMessages
);


/*
=========================================================
STATE
=========================================================
*/

const messagesState = {

    conversations: [],

    selectedConversationId: null,

    searchValue: ""

};


/*
=========================================================
INIT
=========================================================
*/

function initMessages() {

    loadDemoConversations();

    setupSearch();

    setupSendMessage();

    setupRefresh();

    renderConversations();

    selectFirstConversation();

}


/*
=========================================================
DEMO DATA
=========================================================
*/

function loadDemoConversations() {

    messagesState.conversations = [

        {

            id: "1",

            userId: "1001",

            name: "أحمد محمد",

            email: "ahmed@test.com",

            unread: 2,

            online: true,

            messages: [

                {

                    id: 1,

                    sender: "user",

                    text: "السلام عليكم، لدي استفسار بخصوص حسابي.",

                    time: "10:20"

                },

                {

                    id: 2,

                    sender: "user",

                    text: "هل يمكنكم مساعدتي؟",

                    time: "10:21"

                }

            ]

        },


        {

            id: "2",

            userId: "1002",

            name: "مستخدم تجريبي",

            email: "user@example.com",

            unread: 1,

            online: false,

            messages: [

                {

                    id: 1,

                    sender: "user",

                    text: "أريد معرفة حالة الإيداع الخاص بي.",

                    time: "09:45"

                }

            ]

        },


        {

            id: "3",

            userId: "1003",

            name: "محمد علي",

            email: "mohamed@test.com",

            unread: 0,

            online: true,

            messages: [

                {

                    id: 1,

                    sender: "user",

                    text: "شكرًا لكم على الدعم.",

                    time: "أمس"

                },

                {

                    id: 2,

                    sender: "admin",

                    text: "العفو، نحن هنا لمساعدتك.",

                    time: "أمس"

                }

            ]

        }

    ];

}


/*
=========================================================
SEARCH
=========================================================
*/

function setupSearch() {

    const input =
        document.getElementById(
            "messageSearch"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        function () {

            messagesState.searchValue =
                input.value
                    .trim()
                    .toLowerCase();


            renderConversations();

        }
    );

}


/*
=========================================================
RENDER CONVERSATIONS
=========================================================
*/

function renderConversations() {

    const list =
        document.getElementById(
            "messagesList"
        );


    if (!list) {

        return;

    }


    const search =
        messagesState.searchValue;


    const conversations =
        messagesState.conversations.filter(
            function (conversation) {

                if (!search) {

                    return true;

                }


                return (

                    conversation.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    conversation.email
                        .toLowerCase()
                        .includes(search)

                    ||

                    conversation.userId
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    list.innerHTML = "";


    if (
        conversations.length === 0
    ) {

        list.innerHTML = `

            <div class="messages-empty">

                <div class="messages-empty-icon">
                    ◌
                </div>

                <h3>
                    لا توجد محادثات
                </h3>

                <p>
                    لم يتم العثور على مستخدم مطابق.
                </p>

            </div>

        `;

        return;

    }


    conversations.forEach(
        function (conversation) {

            const item =
                document.createElement(
                    "button"
                );


            item.type = "button";


            item.className =
                "message-conversation";


            if (
                conversation.id ===
                messagesState.selectedConversationId
            ) {

                item.classList.add(
                    "active"
                );

            }


            const lastMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];


            item.innerHTML = `

                <div class="message-conversation-avatar">

                    ${escapeHTML(
                        getInitial(
                            conversation.name
                        )
                    )}

                </div>


                <div class="message-conversation-info">

                    <div class="message-conversation-top">

                        <strong>
                            ${escapeHTML(
                                conversation.name
                            )}
                        </strong>


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


                    <span class="message-conversation-id">

                        #${escapeHTML(
                            conversation.userId
                        )}

                    </span>


                    <p class="message-conversation-preview">

                        ${escapeHTML(
                            lastMessage
                            ? lastMessage.text
                            : "لا توجد رسائل"
                        )}

                    </p>

                </div>

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


/*
=========================================================
SELECT FIRST CONVERSATION
=========================================================
*/

function selectFirstConversation() {

    if (
        messagesState.conversations.length === 0
    ) {

        return;

    }


    selectConversation(
        messagesState.conversations[0].id
    );

}


/*
=========================================================
SELECT CONVERSATION
=========================================================
*/

function selectConversation(
    id
) {

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
        id;


    conversation.unread = 0;


    renderConversations();

    renderConversation(
        conversation
    );

}


/*
=========================================================
RENDER CONVERSATION
=========================================================
*/

function renderConversation(
    conversation
) {

    setText(
        "messageUserName",
        conversation.name
    );


    setText(
        "messageUserEmail",
        conversation.email
    );


    setText(
        "messageUserId",
        "#" + conversation.userId
    );


    setText(
        "messageUserAvatar",
        getInitial(
            conversation.name
        )
    );


    const status =
        document.getElementById(
            "messageUserStatus"
        );


    if (status) {

        status.textContent =
            conversation.online
            ? "متصل الآن"
            : "غير متصل";

        status.className =
            "message-user-status " +
            (
                conversation.online
                ? "online"
                : "offline"
            );

    }


    const body =
        document.getElementById(
            "messagesBody"
        );


    if (!body) {

        return;

    }


    body.innerHTML = "";


    if (
        conversation.messages.length === 0
    ) {

        body.innerHTML = `

            <div class="messages-empty">

                <div class="messages-empty-icon">
                    ◌
                </div>

                <h3>
                    لا توجد رسائل
                </h3>

                <p>
                    لم تبدأ هذه المحادثة بعد.
                </p>

            </div>

        `;

        return;

    }


    conversation.messages.forEach(
        function (message) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "message-row " +
                (
                    message.sender === "admin"
                    ? "admin"
                    : "user"
                );


            row.innerHTML = `

                <div class="message-bubble">

                    <p>
                        ${escapeHTML(
                            message.text
                        )}
                    </p>

                    <span class="message-time">

                        ${escapeHTML(
                            message.time
                        )}

                    </span>

                </div>

            `;


            body.appendChild(row);

        }
    );


    body.scrollTop =
        body.scrollHeight;

}


/*
=========================================================
SEND MESSAGE
=========================================================
*/

function setupSendMessage() {

    const button =
        document.getElementById(
            "sendMessage"
        );


    const input =
        document.getElementById(
            "messageInput"
        );


    if (!button || !input) {

        return;

    }


    button.addEventListener(
        "click",
        sendMessage
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
                &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


/*
=========================================================
SEND
=========================================================
*/

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

        showResult(
            "اختر محادثة أولاً."
        );

        return;

    }


    conversation.messages.push({

        id:
            Date.now(),

        sender:
            "admin",

        text:
            text,

        time:
            getCurrentTime()

    });


    input.value = "";


    renderConversation(
        conversation
    );


    renderConversations();


    showResult(
        "تم إرسال الرد بنجاح."
    );

}


/*
=========================================================
REFRESH
=========================================================
*/

function setupRefresh() {

    const button =
        document.getElementById(
            "refreshMessages"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            renderConversations();


            if (
                messagesState.selectedConversationId
            ) {

                const conversation =
                    messagesState.conversations.find(
                        function (item) {

                            return (
                                item.id ===
                                messagesState.selectedConversationId
                            );

                        }
                    );


                if (conversation) {

                    renderConversation(
                        conversation
                    );

                }

            }


            showResult(
                "تم تحديث المحادثات."
            );

        }
    );

}


/*
=========================================================
RESULT
=========================================================
*/

function showResult(
    message
) {

    const result =
        document.getElementById(
            "messageResult"
        );


    if (!result) {

        return;

    }


    result.hidden = false;

    result.textContent =
        message;


    clearTimeout(
        showResult.timer
    );


    showResult.timer =
        setTimeout(
            function () {

                result.hidden = true;

            },
            3000
        );

}


/*
=========================================================
HELPERS
=========================================================
*/

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ?? "—";

}


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


function getCurrentTime() {

    const now =
        new Date();


    return now.toLocaleTimeString(
        "ar",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function escapeHTML(
    value
) {

    return String(value ?? "")

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
