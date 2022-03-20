let filter = document.getElementById("filter");
let sign = document.getElementsByClassName("nav__item")[1];
let signIn = document.querySelector(".filter__block--signin");
let signUp = document.querySelector(".filter__block--signup");
let inToUp = document.querySelector(".filter__block--other--in");
let upToIn = document.querySelector(".filter__block--other--up");
let closebtns = document.querySelectorAll(".filter__block--closebtn");

sign.addEventListener("click",function(){
    filter.style.display = "flex" ;
    signIn.style.display = "flex" ;
    signUp.style.display = "none" ;
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

