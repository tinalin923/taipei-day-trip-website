let Url = new URL(location.href);
let url = Url.pathname;
let furl = "/api"+url
window.addEventListener("DOMContentLoaded",loadData());
let datas = {};
let imageCount = 0;
//model
function getData(){
    return fetch(furl).then(res => {return res.json()
    }).then(attraction =>{
        // console.log(attraction);
        datas = attraction; 
        // console.log(datas);
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
    // console.log(dots);
    dots[0].style.backgroundColor = "black"; 
    // console.log(dots);
    let dotsArray = Array.from(dots);   //使類陣列的htmlcollection變成陣列
    // console.log(dotsArray);
    
    // dotsArray.forEach(dot => {
    //     console.log(dot);
    //     dot.addEventListener("click",()=>{
    //         dot.style.backgroundColor = "black";
    //         // if (dot.style.backgroundColor = "black"){
    //         //     dot.classList.add("off");
    //         //     dot.classList.remove("on");
    //         // }
    //         // dot.classList.add("on");
    //         // dot.classList.remove("off");
            
    //     }); 
    // })
}


let Pic = document.getElementById("img");
let dotsContainer = document.getElementsByClassName("dotsContainer")[0];
let dots = dotsContainer.children;  



function lun(img_src){
    Pic.src = img_src;
     
    // imageCount   

}

let i = 0;
function lundot(index){
    console.log(index);
    if ( index == "previous"){
        if(dots[0].style.backgroundColor == "black"){
            Pic.src = datas.data.images[imageCount-1];
            dots[imageCount-1].style.backgroundColor = "black";
            dots[0].style.backgroundColor = "white";
            console.log("倒退");
            i = imageCount-1;
        }
        else if (dots[i].style.backgroundColor == "black"){
            Pic.src = datas.data.images[i-1];
            dots[i-1].style.backgroundColor = "black";
            dots[i].style.backgroundColor = "white";
            console.log(i);
            console.log("前進");
            i = i-1 ;
        }
        
    }
    if ( index == "next"){
        if(dots[imageCount-1].style.backgroundColor == "black"){
            Pic.src = datas.data.images[0];
            dots[imageCount-1].style.backgroundColor = "white";
            dots[0].style.backgroundColor = "black";
            console.log("重來");
            i = 0;
        }
        else if(dots[i].style.backgroundColor == "black"){
            Pic.src = datas.data.images[i+1];
            dots[i].style.backgroundColor = "white";
            dots[i+1].style.backgroundColor = "black";
            console.log(i);
            i++ ;
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



