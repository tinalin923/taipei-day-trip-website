let Url = new URL(location.href);
let url = Url.pathname;
let furl = "/api"+url
window.addEventListener("DOMContentLoaded",loadData());
let datas = {};
let imageCount = 0;
//model
function getData(){
    return fetch(furl).then(res => {return res.json()}).then(attraction =>{
        console.log(attraction);
        datas = attraction; 
    })
}

//view
function render(){
    let data = datas.data;
    let Name = document.getElementsByTagName("h1")[0];
    let name = data.name;
    Name.textContent = name;
    let Type = document.getElementById("type");
    let type = data.category;
    Type.textContent = type;
    let MRT = document.getElementById("mrt")
    let mrt = data.mrt;
    MRT.textContent = mrt;
    let Description = document.getElementById("description");
    let description = data.description;
    Description.textContent = description;
    let Address = document.getElementById("address");
    let address = data.address;
    Address.textContent = address;
    let Traffic = document.getElementById("traffic");
    let traffic = data.transport;
    Traffic.textContent = traffic;
    let Pic = document.getElementById("img");
    let pic = data.images[0];
    Pic.src = pic;
    //取得總照片數
    imageCount = data.images.length;
    // console.log(imageCount);
    //carousel
    let images = data.images
    let dotsContainer = document.getElementsByClassName("dot")[0];
    //建立圓點
    images.forEach(image => {
        // console.log(image);
        dotsContainer.innerHTML += `<span onclick="lun('${image}');"></span>`;
    });
    let dot = dotsContainer.children;
    dot[0].style.backgroundColor = "black";   
}
let Pic = document.getElementById("img");
let dotsContainer = document.getElementsByClassName("dot")[0];
let dot = dotsContainer.children;  //array

function lun(img_src){
    Pic.src = img_src;
     
    imageCount   

}

let i = 0;
function lundot(index){
    console.log(index);
    for(;i < imageCount;){
        if ( index === "previous"){
            
        }
        if ( index === "next"){
            if(dot[imageCount-1].style.backgroundColor === "black"){
                Pic.src = datas.data.images[0];
            }
            else if(dot[i].style.backgroundColor === "black"){
                Pic.src = datas.data.images[i+1];
            }
        }
    }
    
}






//controller
async function loadData(){
    await getData();
    render();
}




//checkbox changing
let mornBox = document.getElementById("morning");
let evenBox = document.getElementById("evening")
let money = document.getElementById("money")

evenBox.addEventListener("click",function(){
    mornBox.checked = false;
    money.textContent = "新台幣 2500 元";
});
mornBox.addEventListener("click",function(){
    evenBox.checked = false;
    money.textContent = "新台幣 2000 元";
});



