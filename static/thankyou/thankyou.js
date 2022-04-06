let searchParams = new URLSearchParams(window.location.search);
let number = searchParams.get('number');
let place = document.getElementById("number");
place.textContent = number;

let homebtn = document.getElementById("keepgoing");
homebtn.addEventListener("click",()=>{
    window.location.href = "/";
});



