let filter = document.getElementById("filter");
// let sign = document.getElementsByClassName("nav__item")[1];
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

window.addEventListener("reload",checkStatus());
function checkStatus(){
    fetch('/api/user',{
        method:'GET'
    }).then(response => { return response.json();
    }).then(res => {
        if (res.data == null){
            memberStatus.textContent = "登入/註冊";
        }
        else{
            memberStatus.textContent = "登出系統";
        }
    });
}
memberStatus.addEventListener("click", function(){
    if(memberStatus.textContent == "登入/註冊"){
        filter.style.display = "flex" ;
        signIn.style.display = "flex" ;
        signUp.style.display = "none" ;
    }
    else if(memberStatus.textContent == "登出系統"){
        console.log("登出系統!");
        fetch('/api/user',{
            method:'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        }).then( response =>{ return response.json();
        }).then( res =>{ 
            console.log(res);
            location.reload();
        });
    }
    
});



closebtns.forEach((closebtn) => {
    closebtn.addEventListener("click",function(){
    filter.style.display = "none" ;
    });
}
);

inToUp.addEventListener("click",function(){
    signIn.style.display = "none";
    signUp.style.display = "flex" ;
});

upToIn.addEventListener("click",function(){
    signIn.style.display = "flex";
    signUp.style.display = "none" ;
});






signinbtn.addEventListener('click',function(){
    console.log(inemail.value,inpassword.value)
    fetch('/api/user',{
        method:'PATCH',
        body:{
            "email": inemail.value,
            "password":inpassword.value
        },
        headers:{
            'Content-type': 'application/json'
        }
    }).then(response =>{ return response.json();
    }).then( res =>{ 
        console.log(res);
        location.reload();

    }).catch(error =>{
        console.log(error);
        inerror.textContent = error.message;
    })
})

signupbtn.addEventListener("click", function(){
    fetch('/api/user',{
        method:'POST',
        body:{
            "name": upname.value,
            "email": upemail.value,
            "password": uppassword.value
        },
        headers:{'Content-type':'application/json'}
    }).then(response =>{ return response.json();
    }).then(res =>{
        console.log(res);
        location.reload();
    }).catch(error =>{
        console.log(error);
        uperror.textContent = error.message;
    })
})