document.addEventListener("load",loadData(0));

function get(url){
    let promise =new Promise((resolve, reject) => {
    fetch(url).then(res => {return res.json();
    }).then(response => {console.log(response);resolve(response);
    }).catch(error => {
        console.log("Error during fetch:"+ error.message);
        reject(error);})
    });
    return promise;
}


async function loadData(page){
    let url="/api/attractions?page="+page;
    let attractions=await get(url);
    let nextPage = attractions["nextpage"];
    console.log(nextPage);
    for(let i=0; i<13; i++ ){
        let attraction= attractions["data"][i];
        let introduc= document.getElementById("list");
        let place= document.createElement("div");
        place.className= "attraction";
        let fragment= document.createDocumentFragment();
        fragment.appendChild(place);
        let site= document.createElement("div");
        site.className="figure";
        let pic= document.createElement('img');
        pic.src= attraction["images"][0];
        let caption= document.createElement("figcaption");
        caption.textContent= attraction["name"];
        site.appendChild(pic);
        site.appendChild(caption);
        let type= document.createElement("div");
        type.className= "sort";
        let left= document.createElement("div");
        left.className= "left"
        left.textContent= attraction["mrt"];
        let right= document.createElement("div");
        right.className= "right";
        right.textContent= attraction["category"];
        type.appendChild(left);
        type.appendChild(right);
        place.appendChild(site);
        place.appendChild(type);
        introduc.appendChild(fragment);
    }  
    return nextPage;
}
// let nextIndex=function(number){
//     return loadData(number)
// };

// console.log(nextIndex(0));

// let nextpage=loadData(0);  //nextpage == 1

// //發生滾輪動作的時候，就執行loadNext(1)
// window.addEventListener("scroll",()=>{
//     const box=document.getElementById("wrapper");
//     if (box.getBoundingClientRect().bottom < window.innerHeight){
//     loadData(1);
    
    
//     }}); 


// async function loadNext(page){
//     const box=document.getElementById("wrapper");
//     console.log(window.innerHeight)
//     console.log(box.getBoundingClientRect())
//     if (box.getBoundingClientRect().bottom < window.innerHeight){
//         let nextPage= await loadData(page);  //nextPage==2
//         console.log(nextpage);
//         loadNext(nextPage);
//     }
// }

// let infScroll = new InfiniteScroll( '#wrapper', {
//     path:function(){
//         if (box.getBoundingClientRect().bottom < window.innerHeight){
//             let nextIndex= this.loadCount+1;
//             return loadData(nextIndex);
//         }
//     },
//     append:".attraction",
//     prefill: false,
//     status: '.scroller-status'

// });

// 首先我們需要創造一個 observer 物件並指定 root：
const root = document.querySelector("wrapper");
const options = {
    root,
    rootMargin: "0px",
    threshold:0.75,
};


// 接下來我們要用 observer.observe() 指定欲觀察的 target：
const target = document.querySelector("observed")
observer.oberve(target);

//設定callback函式
const callback = (entries,observer)=>{

}


const observer = new IntersectionObserver(callback,options);