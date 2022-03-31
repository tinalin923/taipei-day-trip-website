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
            }
            else{
                memberStatus.textContent = "登入/註冊";
            }
        }
        else{
            memberStatus.textContent = "登出系統";
            if(window.location.pathname === '/booking'){
                hello_name.textContent = res.data.name;   //設定 /booking頁面的招呼名稱
                renderBooking();
            }
            
            
        }
    });
}
memberStatus.addEventListener("click", function(){
    if(memberStatus.textContent === "登入/註冊"){
        filter.style.display = "flex" ;
        signIn.style.display = "flex" ;
        signUp.style.display = "none" ;
    }
    if(memberStatus.textContent === "登出系統"){
        console.log("登出系統!");
        fetch(userUrl, {
            method:'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        }).then( response =>{ return response.json();
        }).then( res =>{ 
            if(window.location.pathname === "/booking"){window.location.href = "/"}
            else{window.location.reload();}
        });
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
    filter.style.display = "none" ;
    });
}
);

inToUp.addEventListener("click",function(){
    inemail.value = "";
    inpassword.value = "";
    inerror.textContent = "";
    signIn.style.display = "none";
    signUp.style.display = "flex" ;
});

upToIn.addEventListener("click",function(){
    upname.value = "";
    upemail.value = "";
    uppassword.value = "";
    uperror.textContent = "";
    signIn.style.display = "flex";
    signUp.style.display = "none" ;
});


let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ ;
const regex = new RegExp(pattern);

signinbtn.addEventListener('click',function(){
    if (inemail.value.length == 0 || inpassword.value.length == 0 ){
        inerror.textContent = "請輸入信箱密碼";
    }
    else if (!regex.test(inemail.value)){
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
    else if (!regex.test(upemail.value)){
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