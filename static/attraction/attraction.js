let Url = new URL(window.location.href);
let url = Url.pathname;
let furl = "/api"+url ;
window.addEventListener("DOMContentLoaded",loadData());
let datas = {};
let imageCount = 0;
let dotIndex = 0;
let date = document.getElementById("date");    //設定input = date的範圍
date.min = new Date().toLocaleDateString('en-ca');   //用en-US沒用

//controller
async function loadData(){
    await getData();
    render();
}

//model
function getData(){
    return fetch(furl).then(res => {return res.json();
    }).then(attraction =>{
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
    //carousel
    let images = data.images
    let dotsContainer = document.getElementsByClassName("dotsContainer")[0];
    //建立圓點
    images.forEach(image => {
        dotsContainer.innerHTML += `<span class="off" onclick="lun('${image}');"></span>`;
        // dotsContainer.innerHTML += `<input type="checkbox" onclick="lun('${image}');"><label></label>`;
    });
    let dots = dotsContainer.children;
    dots[0].style.backgroundColor = "black"; 
    let dotsArray = Array.from(dots);   //使類陣列的htmlcollection變成陣列
    dotsArray.forEach(dot => {
        dot.addEventListener("click",()=>{
            for (let i=0; i<imageCount; i++){                 //先讓所有都先變白
                dots[i].style.backgroundColor = "white";}
            dot.style.backgroundColor = "black";            //被點選的變黑
            let number = dotsArray.indexOf(dot);     //取得被點選的點的index值
            dotIndex = number;
            // for (let n=0; n<imageCount; n++){            // 另一個取得被點選的點的index值的方法
            //     if (dots[n].style.backgroundColor == "black"){
            //         dotIndex = n;
            //     }
            // }
        }); 
    })
}



let Pic = document.getElementById("img");
let dotsContainer = document.getElementsByClassName("dotsContainer")[0];
let dots = dotsContainer.children;  

//use dots to change picture
function lun(img_src){
    Pic.src = img_src;
}

//use arrows to change picture
function lundot(index){
    console.log(index);
    if ( index == "previous"){
        if(dots[0].style.backgroundColor == "black"){
            Pic.src = datas.data.images[imageCount-1];
            dots[imageCount-1].style.backgroundColor = "black";
            dots[0].style.backgroundColor = "white";
            dotIndex = imageCount-1;
        }
        else {
            Pic.src = datas.data.images[dotIndex-1];
            dots[dotIndex-1].style.backgroundColor = "black";
            dots[dotIndex].style.backgroundColor = "white";
            dotIndex = dotIndex-1 ;
        }        
    }
    if ( index == "next"){
        if(dots[imageCount-1].style.backgroundColor == "black"){
            Pic.src = datas.data.images[0];
            dots[imageCount-1].style.backgroundColor = "white";
            dots[0].style.backgroundColor = "black";
            dotIndex = 0;
        }
        else {
            Pic.src = datas.data.images[dotIndex+1];
            dots[dotIndex].style.backgroundColor = "white";
            dots[dotIndex+1].style.backgroundColor = "black";
            dotIndex++ ;
        }
    }
}




//checkbox changing
let mornBox = document.getElementById("morning");
let evenBox = document.getElementById("evening")
let money = document.getElementById("money")

evenBox.addEventListener("click",function(){
    mornBox.checked = false;
    money.textContent = 2500;
});
mornBox.addEventListener("click",function(){
    evenBox.checked = false;
    money.textContent = 2000;
});


// start to make a reservation
let bookingButton = document.getElementById("startBooking");
bookingButton.addEventListener("click",startBooking);

//controller
function startBooking(){
    let result = checkSignin();
    if (result === false){
        pleaseSignin();
    }
    if (result === true){
        makeReservation();
    }
}


function checkSignin(){
    if (memberStatus.textContent === "登入/註冊"){
        return false;
    }
    if(memberStatus.textContent === "登出系統"){
        return true;
    }
}

function pleaseSignin(){
    filter.style.display = "flex" ;
    signIn.style.display = "flex" ;
    signUp.style.display = "none" ;
}

let ID =  window.location.pathname
ID = ID.split('/')[2]

function makeReservation(){
    let chosenDate = document.getElementById("date").value;
    let price = document.getElementById("money").textContent;
    price = Number(price);
    let time;
    if (price === 2000){time = "上午8點到下午2點";}
    if (price === 2500){time = "下午2點到晚上9點";}
    let data = {
        "attractionId": ID,
        "date":chosenDate,
        "time":time,
        "price":price
    };
    console.log(data);
    fetch("/api/booking", {
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-type': 'application/json'
        }
    }).then(response => { return response.json();
    }).then(res =>{
        console.log(res);
        if(res.error === true){
            console.log("請選擇預定日期");
        }
        if (res.ok === true ){
            alert("預約成功");
            window.location.href = '/booking';
        }
    }).catch(error=>{
        console.log("Error during fetch:"+error.message)
    });
}
