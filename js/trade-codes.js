/* =========================================================
   VALORA ADMIN — TRADE CODES
   ========================================================= */

(function () {

"use strict";


document.addEventListener(
    "DOMContentLoaded",
    initTradeCodes
);



const tradeState = {

    codes: []

};





function initTradeCodes(){


    loadSavedCodes();


    const button =
        document.getElementById(
            "generateCode"
        );


    if(button){

        button.addEventListener(
            "click",
            generateTradeCode
        );

    }


    renderCodes();


}






function generateTradeCode(){


    const type =
        document.getElementById(
            "tradeType"
        ).value;



    const code =
        createCode();



    const item = {


        id:
            Date.now(),


        code:
            code,


        trade:
            type,


        created:
            new Date()
                .getTime(),


        expires:
            new Date()
                .getTime()
            +
            (15 * 60 * 1000),


        used:
            false


    };



    tradeState.codes.unshift(
        item
    );


    saveCodes();


    renderCodes();



}







function createCode(){


    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let result =
        "";


    for(
        let i = 0;
        i < 8;
        i++
    ){

        result +=
            chars[
                Math.floor(
                    Math.random()
                    *
                    chars.length
                )
            ];

    }


    return result;


}






function renderCodes(){


    const body =
        document.getElementById(
            "tradeCodesBody"
        );


    if(!body){
        return;
    }



    body.innerHTML = "";



    if(
        tradeState.codes.length === 0
    ){

        body.innerHTML = `

        <tr>

        <td colspan="5">

        لا توجد أكواد

        </td>

        </tr>

        `;

        return;

    }





    tradeState.codes.forEach(
        function(item){


            const expired =
                Date.now()
                >
                item.expires;



            const row =
                document.createElement(
                    "tr"
                );



            row.innerHTML = `


<td dir="ltr">

<strong>
${item.code}
</strong>

</td>


<td>

الصفقة ${item.trade}

</td>


<td>

${getRemaining(item.expires)}

</td>


<td>

<span>

${
expired
?
"منتهي"
:
(
item.used
?
"مستخدم"
:
"صالح"
)
}

</span>

</td>



<td>

<button
class="trade-copy-btn"
data-code="${item.code}"
>

نسخ

</button>

</td>


`;



            body.appendChild(row);


        }

    );



    setupCopyButtons();


}







function getRemaining(time){


    const diff =
        time
        -
        Date.now();



    if(diff <= 0){

        return "انتهت";

    }



    const minutes =
        Math.floor(
            diff
            /
            60000
        );



    return minutes + " دقيقة";


}







function setupCopyButtons(){


    document
    .querySelectorAll(
        ".trade-copy-btn"
    )
    .forEach(
        function(button){


            button.addEventListener(
                "click",
                function(){


                    navigator.clipboard.writeText(
                        button.dataset.code
                    );


                    button.textContent =
                        "تم النسخ";


                    setTimeout(
                        function(){

                            button.textContent =
                                "نسخ";

                        },
                        1500
                    );


                }
            );


        }
    );


}







function saveCodes(){


    localStorage.setItem(

        "valora_trade_codes",

        JSON.stringify(
            tradeState.codes
        )

    );


}





function loadSavedCodes(){


    const saved =
        localStorage.getItem(
            "valora_trade_codes"
        );



    if(saved){

        tradeState.codes =
            JSON.parse(
                saved
            );

    }


}





})();
