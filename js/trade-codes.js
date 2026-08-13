/* =========================================================
   VALORA ADMIN — TRADE CODES
========================================================= */

(function(){

"use strict";


document.addEventListener(
"DOMContentLoaded",
initTradeCodes
);


let activeCode = null;
let timer = null;



function initTradeCodes(){


const button =
document.getElementById("generateCode");


if(!button){
return;
}



button.addEventListener(
"click",
generateTradeCode
);


}





function generateTradeCode(){


const type =
document.getElementById("tradeType").value;



activeCode =
createCode();



showCode(activeCode,type);



startTimer();



}




function createCode(){


const chars =
"ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


let code="";


for(let i=0;i<8;i++){

code +=
chars[
Math.floor(
Math.random()*chars.length
)
];

}


return code;


}





function showCode(code,type){


let box =
document.getElementById(
"generatedCodeBox"
);



if(!box){


box =
document.createElement("div");

box.id =
"generatedCodeBox";


box.className =
"generated-code-box";



document
.querySelector(".admin-content")
.prepend(box);



}



box.innerHTML = `


<h3>
الكود الحالي
</h3>


<div class="trade-code-display">

${code}

</div>


<p>
الصفقة:
${type}
</p>


<p id="codeTimer">
الصلاحية: 15:00
</p>


<button id="copyTradeCode"
class="admin-btn admin-btn-primary">

نسخ الكود

</button>


`;




document
.getElementById("copyTradeCode")
.onclick =
function(){

navigator.clipboard.writeText(code);

this.innerText="تم النسخ";

};



}







function startTimer(){


let seconds = 15*60;


clearInterval(timer);



timer =
setInterval(
function(){


seconds--;



let min =
Math.floor(seconds/60);


let sec =
seconds%60;



const timerBox =
document.getElementById(
"codeTimer"
);



if(timerBox){


timerBox.innerText =
"الصلاحية: "
+
String(min).padStart(2,"0")
+
":"
+
String(sec).padStart(2,"0");


}



if(seconds<=0){


clearInterval(timer);


activeCode=null;



if(timerBox){

timerBox.innerText =
"انتهى الكود";

}


}



},
1000
);



}





})();
