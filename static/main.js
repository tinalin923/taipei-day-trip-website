let page = 0 ;
let key_page = 0 ;
let key_word = "" ;
let button = document.querySelector("button");
window.addEventListener("DOMContentLoaded",loadData());
window.addEventListener("scroll",()=>{
    let options = {
        root:null,
        rootMargins:"0px",
        threshold:0.25
    };
    const observer = new IntersectionObserver(callback,options);
    observer.observe(document.querySelector("footer"));   
},{once:true});       //使註冊事件在第一次滾動後發生，且只發生一次

function loadData(){
    let url = "/api/attractions?page="+page;
    fetch(url).then(res => {return res.json();
    }).then(attractions => {
    let nextPage = attractions.nextpage;
    // console.log(page);
    page = nextPage;
    // console.log(page);
    for(let i=0; i<13; i++ ){
        let attraction= attractions.data[i];
        let introduc= document.getElementById("list");
        let place= document.createElement("div");
        place.className= "attraction";
        let fragment= document.createDocumentFragment();
        fragment.appendChild(place);
        let site= document.createElement("div");
        site.className="figure";
        let pic= document.createElement('img');
        pic.src= attraction.images[0];
        let caption= document.createElement("figcaption");
        caption.textContent= attraction.name;
        site.appendChild(pic);
        site.appendChild(caption);
        let type= document.createElement("div");
        type.className= "sort";
        let left= document.createElement("div");
        left.className= "left"
        left.textContent= attraction.mrt;
        let right= document.createElement("div");
        right.className= "right";
        right.textContent= attraction.category;
        type.appendChild(left);
        type.appendChild(right);
        place.appendChild(site);
        place.appendChild(type);
        introduc.appendChild(fragment);
        
        }
    })
    
}

//用unobserve似乎無法完整關不掉observer (用disconnect?)
function callback(entries){
    // console.log(entries);    
    if (!entries[0].isIntersecting){return ;}
    else{
        // console.log("hello");
        // console.log(key_page);
        if (key_word !== "" && key_page !== null){ search(); }
        else if (key_word !== "" && key_page == null){return ;}
        else if (key_word == ""){loadData(); 
            // console.log(page);
        }
        else if (key_word == "" && key_page!== 0){return ;}
        else{observer.unobserve(entries[0].target);return ;}    
}}

button.addEventListener("click",search);
function search(){
    let keyword = document.querySelector("input").value;
    if (keyword == "" && page == 1 & key_page == 0){console.log("click!");return ;}     //沒有輸入word
    else if (keyword == ""){loadData();}
    // else if (keyword == null && key_page !== 0 && key_word !==""){
    //     let url = "/api/attractions?keyword=&page=0";
    //     fetch(url).then(res =>{return res.json()
    //     }).then(attractions =>{
    //         let wrap = document.querySelector(".wrapper");
    //         let oldIntroduc= document.getElementById("list");
    //         oldIntroduc.textContent="";
    //         let nextPage = attractions.nextpage;
    //         page = nextPage; 
    //         for (i=0; i<13; i++ ){
    //             let attraction= attractions.data[i];
    //             let place= document.createElement("div");
    //             place.className= "attraction";
    //             let fragment= document.createDocumentFragment();
    //             fragment.appendChild(place);
    //             let site= document.createElement("div");
    //             site.className="figure";
    //             let pic= document.createElement('img');
    //             pic.src= attraction.images[0];
    //             let caption= document.createElement("figcaption");
    //             caption.textContent= attraction.name;
    //             site.appendChild(pic);
    //             site.appendChild(caption);
    //             let type= document.createElement("div");
    //             type.className= "sort";
    //             let left= document.createElement("div");
    //             left.className= "left"
    //             left.textContent= attraction.mrt;
    //             let right= document.createElement("div");
    //             right.className= "right";
    //             right.textContent= attraction.category;
    //             type.appendChild(left);
    //             type.appendChild(right);
    //             place.appendChild(site);
    //             place.appendChild(type);
    //             oldIntroduc.appendChild(fragment);
    //             wrap.appendChild(oldIntroduc);
    //         }
    //     })
    // }
    else if (keyword !== "" && key_page == 0){        //有輸入word 第一次搜尋 有無資料
        key_word = keyword;
        let url ="/api/attractions?keyword="+key_word+"&page="+ key_page;
        // console.log (url);
        fetch(url).then(res => {return res.json();
        }).then(attractions => {
            if (attractions.data == ""){            // 查無資料 key_page沒變
                let oldIntroduc= document.querySelector("#list");
                oldIntroduc.textContent="查無相關景點";}
            else{                                //有資料 有變key_page
                let nextPage = attractions.nextpage;   //有可能有下一頁或等於null
                key_page = nextPage;
                // console.log(key_page);
                let wrap = document.querySelector(".wrapper")
                let oldIntroduc= document.querySelector("#list");
                wrap.removeChild(oldIntroduc);
                let introduc= document.createElement("div");
                introduc.setAttribute("id","list");
                for(let i=0; i < attractions.data.length; i++ ){
                    let attraction= attractions.data[i];
                    let place= document.createElement("div");
                    place.className= "attraction";
                    let fragment= document.createDocumentFragment();
                    fragment.appendChild(place);
                    let site= document.createElement("div");
                    site.className="figure";
                    let pic= document.createElement('img');
                    pic.src= attraction.images[0];
                    let caption= document.createElement("figcaption");
                    caption.textContent= attraction.name;
                    site.appendChild(pic);
                    site.appendChild(caption);
                    let type= document.createElement("div");
                    type.className= "sort";
                    let left= document.createElement("div");
                    left.className= "left"
                    left.textContent= attraction.mrt;
                    let right= document.createElement("div");
                    right.className= "right";
                    right.textContent= attraction.category;
                    type.appendChild(left);
                    type.appendChild(right);
                    place.appendChild(site);
                    place.appendChild(type);
                    introduc.appendChild(fragment);
                    wrap.appendChild(introduc);
                }
            }     
        })
    }
    else if (keyword == key_word && key_page !==0){     //word不變 空點  //word不變 footer被觀察到 有無資料
        if (key_page == null){return ;}
        else{
            let url ="/api/attractions?keyword="+key_word+"&page="+ key_page;
            fetch(url).then(res => {return res.json();
                }).then(attractions => {
                    let nextPage = attractions.nextpage;
                    key_page = nextPage;
                    // console.log(key_page);
                    let wrap = document.querySelector(".wrapper");
                    for(let i = 0; i < attractions.data.length; i++ ){
                        let introduc= document.querySelector("#list");
                        let attraction = attractions.data[i];
                        // console.log(introduc);
                        let place = document.createElement("div");
                        place.className= "attraction";
                        let fragment= document.createDocumentFragment();
                        fragment.appendChild(place);
                        let site= document.createElement("div");
                        site.className="figure";
                        let pic= document.createElement('img');
                        pic.src= attraction.images[0];
                        let caption= document.createElement("figcaption");
                        caption.textContent= attraction.name;
                        site.appendChild(pic);
                        site.appendChild(caption);
                        let type= document.createElement("div");
                        type.className= "sort";
                        let left= document.createElement("div");
                        left.className= "left"
                        left.textContent= attraction.mrt;
                        let right= document.createElement("div");
                        right.className= "right";
                        right.textContent= attraction.category;
                        type.appendChild(left);
                        type.appendChild(right);
                        place.appendChild(site);
                        place.appendChild(type);
                        introduc.appendChild(fragment);
                        wrap.appendChild(introduc);}
                })
        }
    }
    else if( keyword !== key_word) {
        let wrap = document.querySelector(".wrapper");
        let oldIntroduc= document.getElementById("list");
        oldIntroduc.textContent="";
        key_word = keyword;
        // console.log(key_page);
        let url ="/api/attractions?keyword="+key_word+"&page=0";
        // console.log(url);
        fetch(url).then(res => {return res.json();
        }).then(attractions => {
            if (attractions.data == ""){            // 查無資料 key_page沒變
                // let oldIntroduc= document.getElementById("list");
                oldIntroduc.textContent="查無相關景點";}
            else{                                //有資料 有變key_page
                for(let i=0; i < attractions.data.length; i++ ){
                    let nextPage = attractions.nextpage
                    key_page = nextPage;
                    let attraction= attractions.data[i];
                    let place= document.createElement("div");
                    place.className= "attraction";
                    let fragment= document.createDocumentFragment();
                    fragment.appendChild(place);
                    let site= document.createElement("div");
                    site.className="figure";
                    let pic= document.createElement('img');
                    pic.src= attraction.images[0];
                    let caption= document.createElement("figcaption");
                    caption.textContent= attraction.name;
                    site.appendChild(pic);
                    site.appendChild(caption);
                    let type= document.createElement("div");
                    type.className= "sort";
                    let left= document.createElement("div");
                    left.className= "left"
                    left.textContent= attraction.mrt;
                    let right= document.createElement("div");
                    right.className= "right";
                    right.textContent= attraction.category;
                    type.appendChild(left);
                    type.appendChild(right);
                    place.appendChild(site);
                    place.appendChild(type);
                    oldIntroduc.appendChild(fragment);
                    wrap.appendChild(oldIntroduc);
                }
            }
        })
    }       
}
      
    





    
//     if (key_page == 0){
//         fetch(url).then(res => {return res.json();
//         }).then(attractions => {
//         let nextPage = attractions.nextpage;
//         console.log(key_page);
//         key_page = nextPage;
//         console.log(key_page);
//         let wrap = document.querySelector(".wrapper")
//         let oldIntroduc= document.querySelector("#list");
//         wrap.removeChild(oldIntroduc);
//         let introduc= document.createElement("div");
//         introduc.setAttribute("id","list");
//         for(let i=0; i < attractions.data.length; i++ ){
//             let attraction= attractions.data[i];
//             let place= document.createElement("div");
//             place.className= "attraction";
//             let fragment= document.createDocumentFragment();
//             fragment.appendChild(place);
//             let site= document.createElement("div");
//             site.className="figure";
//             let pic= document.createElement('img');
//             pic.src= attraction.images[0];
//             let caption= document.createElement("figcaption");
//             caption.textContent= attraction.name;
//             site.appendChild(pic);
//             site.appendChild(caption);
//             let type= document.createElement("div");
//             type.className= "sort";
//             let left= document.createElement("div");
//             left.className= "left"
//             left.textContent= attraction.mrt;
//             let right= document.createElement("div");
//             right.className= "right";
//             right.textContent= attraction.category;
//             type.appendChild(left);
//             type.appendChild(right);
//             place.appendChild(site);
//             place.appendChild(type);
//             introduc.appendChild(fragment);
//             wrap.appendChild(introduc);
//             }
//         })
//     }
//     else{
//         fetch(url).then(res => {return res.json();
//         }).then(attractions => {
//             let nextPage = attractions.nextpage;
//             key_page = nextPage;
//             let wrap = document.querySelector(".wrapper");
//             for(let i = 0; i < attractions.data.length; i++ ){
//                 let introduc= document.querySelector("#list");
//                 let attraction = attractions.data[i];
//                 // console.log(introduc);
//                 let place = document.createElement("div");
//                 place.className= "attraction";
//                 let fragment= document.createDocumentFragment();
//                 fragment.appendChild(place);
//                 let site= document.createElement("div");
//                 site.className="figure";
//                 let pic= document.createElement('img');
//                 pic.src= attraction.images[0];
//                 let caption= document.createElement("figcaption");
//                 caption.textContent= attraction.name;
//                 site.appendChild(pic);
//                 site.appendChild(caption);
//                 let type= document.createElement("div");
//                 type.className= "sort";
//                 let left= document.createElement("div");
//                 left.className= "left"
//                 left.textContent= attraction.mrt;
//                 let right= document.createElement("div");
//                 right.className= "right";
//                 right.textContent= attraction.category;
//                 type.appendChild(left);
//                 type.appendChild(right);
//                 place.appendChild(site);
//                 place.appendChild(type);
//                 introduc.appendChild(fragment);
//                 wrap.appendChild(introduc);}
//             })
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