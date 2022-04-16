window.addEventListener("DOMContentLoaded",checkStatus);
let booking = document.getElementById("booking")
booking.addEventListener("click",function(){
    if(memberStatus.textContent === "登入/註冊"){
        filter.style.display = "flex" ;
        signIn.style.display = "flex" ;
        signUp.style.display = "none" ;
    }
    else{ 
        window.location.href = "/booking"; 
    }
})

let userUrl = '/api/user';
let filter = document.getElementById("filter");
let memberStatus = document.getElementById("signinup");
let signIn = document.querySelector(".filter__block--signin");
let signUp = document.querySelector(".filter__block--signup");
let inToUp = document.querySelector(".filter__block--other--in");
let upToIn = document.querySelector(".filter__block--other--up");
let closebtns = document.querySelectorAll(".filter__block--closebtn");

let signinbtn = document.getElementById("signinbtn");
let signupbtn = document.getElementById("signupbtn");

let inemail = document.getElementById("inEmail");
let inpassword = document.getElementById("inPassword");
let upname = document.getElementById("upName");
let upemail = document.getElementById("upEmail");
let uppassword = document.getElementById("upPassword");

let inerror = document.querySelector(".filter__block--errorMessage--in");
let uperror = document.querySelector(".filter__block--errorMessage--up");


signinbtn.addEventListener("blur", (clean)=>{ inerror.textContent = "";});
signupbtn.addEventListener("blur", (clean)=>{ uperror.textContent = "";});

let hello_name = document.getElementById("hello_name");
let orderName = document.getElementById("inform_name");
let orderEmail = document.getElementById("inform_email");
let memberName = document.getElementById("mName");
let memberEmail = document.getElementById("mEmail");
function checkStatus(){
    fetch(userUrl, {
        method:'GET',
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response =>{ return response.json();
    }).then(res =>{
        if (res.data == null){
            if(window.location.pathname === '/booking'){
                window.location.replace('/');
            } else if (window.location.pathname === '/thankyou'){
                window.location.replace('/');
            } else if (window.location.pathname === '/member'){
                window.location.replace('/');
            } else{
                memberStatus.textContent = "登入/註冊";
            }
        }
        else{
            memberStatus.textContent = "會員專區";
            if (window.location.pathname === '/booking'){
                hello_name.textContent = res.data.name;   //設定 /booking頁面的招呼名稱
                orderName.value = res.data.name;
                orderEmail.value = res.data.email;
                renderBooking();
            }
            else if (window.location.pathname === '/member'){
                memberName.textContent = res.data.name;
                memberEmail.textContent = res.data.email;
                renderMember();
            }
        }
    });
}
memberStatus.addEventListener("click", function(){
    if (memberStatus.textContent === "登入/註冊"){
        filter.style.display = "flex" ;
        signIn.style.display = "flex" ;
        signUp.style.display = "none" ;
    }
    if (memberStatus.textContent === "會員專區"){
        window.location.href = "/member";
    }
});


closebtns.forEach((closebtn) => {
    closebtn.addEventListener("click",function(){
    inerror.textContent = "";
    uperror.textContent = "";
    inemail.value = "";
    inpassword.value = "";
    upname.value = "";
    upemail.value = "";
    uppassword.value = "";
    inemail.classList.remove("valid","invalid");
    inpassword.classList.remove("valid","invalid");
    upname.classList.remove("valid","invalid");
    upemail.classList.remove("valid","invalid");
    uppassword.classList.remove("valid","invalid");
    filter.style.display = "none" ;
    });
}
);

inToUp.addEventListener("click",function(){
    inemail.value = "";
    inemail.classList.remove("valid","invalid");
    inpassword.value = "";
    inpassword.classList.remove("valid","invalid");
    inerror.textContent = "";
    signIn.style.display = "none";
    signUp.style.display = "flex" ;

});

upToIn.addEventListener("click",function(){
    upname.value = "";
    upname.classList.remove("valid","invalid");
    upemail.value = "";
    upemail.classList.remove("valid","invalid");
    uppassword.value = "";
    uppassword.classList.remove("valid","invalid");
    uperror.textContent = "";
    signIn.style.display = "flex";
    signUp.style.display = "none" ;
});


//frontend validation
let Regex = {
    emailPattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
}
// let emailPattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
const eamilRegex = new RegExp(Regex.emailPattern);


let inputs = document.querySelectorAll(".filter__block--info");
let emailInputs = document.querySelectorAll("input[type=email]");

inputs.forEach(input => { input.addEventListener("input", () => {
        if (input.value.length <= 2 ){
            input.classList.add("invalid");
            input.classList.remove("valid");
        }  
        if (input.value.length > 2){
            input.classList.remove("invalid");
            input.classList.add("valid");
        }        
    })
});

emailInputs.forEach(eInput => { eInput.addEventListener("input", () => {
        if (!eamilRegex.test(inemail.value) || !eamilRegex.test(upemail.value)){
            eInput.classList.add("invalid");
            eInput.classList.remove("valid");
        }  
        if (eamilRegex.test(inemail.value) || eamilRegex.test(upemail.value)){
            eInput.classList.remove("invalid");
            eInput.classList.add("valid");
        }
    })
});



signinbtn.addEventListener('click', () => {
    if (inemail.value.length === 0 || inpassword.value.length === 0 ){
        inerror.textContent = "請輸入信箱密碼";
    }
    else if (!eamilRegex.test(inemail.value)){
        inerror.textContent = "請輸入正確信箱格式";
    }
    else{
        fetch(userUrl, {
            method:'PATCH',
            body:JSON.stringify({
                "email": inemail.value,
                "password":inpassword.value
            }),
            headers:{
                'Content-type': 'application/json'
            }
        }).then(response =>{ return response.json();
        }).then( res =>{ 
            if (res.error == true){
                inerror.textContent = res.message;
            }
            else{
                location.reload();
            }
        }).catch(error =>{
            console.log("Error during fetch:"+ error.message);
        });
    }
});

signupbtn.addEventListener("click", function(){
    if (upname.value.length == 0 || upemail.value.length == 0 || uppassword.value.length == 0 ){
        uperror.textContent = "請輸入資料";
    }
    else if (!eamilRegex.test(upemail.value)){
        uperror.textContent = "請輸入正確信箱格式";
    }
    else{
        fetch(userUrl, {
            method:'POST',
            body:JSON.stringify({
                "name": upname.value,
                "email": upemail.value,
                "password": uppassword.value
            }),
            headers:{'Content-type':'application/json'}
        }).then(response =>{ return response.json();
        }).then(res =>{
            if (res.error == true){
                uperror.textContent = res.message;
            }else{
                uperror.textContent = "註冊成功";
            }
        }).catch(error =>{
            console.log("Error during fetch:"+ error.message);
        });
    }
});