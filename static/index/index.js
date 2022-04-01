let page = 0;       
let key_page = 0;
let keyword = "";          //後來使用者新輸入的關鍵字
let key_word = "";         //先前使用者輸入的關鍵字
// let url =  "/api/attractions?page=${page}";
// let surl ="/api/attractions?keyword="+key_word+"&page="+key_page;
let Attractions = {};
let isLoading = false;            //管控是否可以連線
let loader = document.getElementById("loader");
let footer = document.getElementsByTagName("footer")[0];
let searchButton = document.querySelector(".search__button");

let introduc = document.getElementById("list");

searchButton.addEventListener("click",search); 

window.addEventListener("DOMContentLoaded",loadDatas());

window.addEventListener("scroll",()=>{
    let options = {
        root:null,
        rootMargins:"0px",
        threshold:0.25
    };
    const observer = new IntersectionObserver(callback,options);
    observer.observe(footer);   
},{once:true});       //使註冊事件在第一次滾動後發生，且只發生一次

//用unobserve似乎無法完整關掉observer (用disconnect?)
function callback(entries){
    if (!entries[0].isIntersecting){return ;}   
    else if (isLoading == true){return ; } 
    else{
        if ( !key_word && page !== null){loadDatas();}    //還有下一頁
        else if ( !key_word && page == null){console.log("沒有下一頁了");return ;}   //首頁已滑到底
        else if ( !key_word && key_page !== 0){return ;} 
        else if ( key_word && key_page !== null){console.log("載入下一頁");search();}
        else if ( key_word && key_page == null){console.log("沒有下一頁了");return ;}
        // else{observer.unobserve(entries[0].target);return ;}    
}}


function render(){
    let fragment = document.createDocumentFragment();
    for(let i = 0; i < Attractions.data.length; i++ ){
        let attraction = Attractions.data[i];
        let ID = attraction.id
        let place = document.createElement("div");
        place.className = "attraction";
        // place.setAttribute("href","/attraction/"+ID);
        // place.setAttribute("onclick",)
        // place.href = "/attraction/"+ID;
        place.onclick = function(){window.location.href = "/attraction/"+ID}
        fragment.appendChild(place);
        let site= document.createElement("div");
        site.className ="figure";
        let pic = document.createElement('img');
        pic.src = attraction.images[0];
        let caption = document.createElement("figcaption");
        caption.textContent = attraction.name;
        site.appendChild(pic);
        site.appendChild(caption);
        let type = document.createElement("div");
        type.className= "sort";
        let left = document.createElement("div");
        left.className = "left"
        left.textContent = attraction.mrt;
        let right = document.createElement("div");
        right.className = "right";
        right.textContent = attraction.category;
        type.appendChild(left);
        type.appendChild(right);
        place.appendChild(site);
        place.appendChild(type);
        loader.style.display = "none";
        introduc.appendChild(fragment);
        
    }
}

// function fetch(){


// }


function loadDatas(){
    if(isLoading == true){return ; }
    loader.style.display = "block";
    isLoading = true;                        
    let url = "/api/attractions?page="+page;
    fetch(url).then(res => {
        return res.json();      
    }).then(attractions => {
        Attractions = attractions;
        isLoading = false;                 
        let nextPage = attractions.nextpage;
        page = nextPage;
        render();  
    })
    // console.log("完成了");   //會和1false一起出來
}

function search(){
    if (isLoading == true){return;}
    console.log("search!");
    keyword = document.querySelector(".search__input").value;   //用let 會重新設一個變數，傳不到外面的全域變數
    if ( !keyword ){return ;}               //key_word一定不會等於" "
    else if ( keyword  && key_page == 0){        //有輸入word 第一次搜尋 有無資料//搜尋無資料 空點
        isLoading = true;     
        key_word = keyword;
        let url ="/api/attractions?keyword="+key_word+"&page="+ key_page;
        fetch(url).then(res => {return res.json();
        }).then(attractions => {
            isLoading = false;   
            Attractions = attractions;
            let nextPage = attractions.nextpage;   
            key_page = nextPage;
            introduc.innerHTML = "";
            if (attractions.data == "" ){            // 查無資料 
                introduc.textContent="查無相關景點";}
            else{                                //有資料 
                render();
            }     
        })
    }
    else if (keyword == key_word && key_page !==0){     //word不變 空點  //word不變.footer被觀察到.key_page !==null: 有無資料
        if (key_page == null ){console.log("無資料 請不要一直點");return ;}
        else if (key_page !== null && 
            footer.getBoundingClientRect().top > window.innerHeight ){console.log("請不要一直點");return ;} //防止連續點擊會自動載入
        else{ console.log("載入下一頁");
            isLoading = true;     
            let url ="/api/attractions?keyword="+key_word+"&page="+ key_page;
            fetch(url).then(res => {return res.json();
                }).then(attractions => {
                    isLoading = false; 
                    Attractions = attractions;
                    let nextPage = attractions.nextpage;
                    key_page = nextPage;
                    render();
                })
        }
    }
    else if( keyword !== key_word) {            //做新的搜尋，頁數歸零
        isLoading = true;     
        key_word = keyword;
        key_page = 0;     
        let url ="/api/attractions?keyword="+key_word+"&page="+key_page;
        fetch(url).then(res => {return res.json();
            }).then(attractions => {
                isLoading = false; 
                Attractions = attractions;
                let nextPage = attractions.nextpage
                key_page = nextPage;
                introduc.innerHTML = "";
                if (attractions.data == ""){            // 查無資料 key_page==null
                    introduc.textContent="查無相關景點";}
                else{                                //有資料 有變key_page
                    render();}
            })
    }       
}
      









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



// let body = document.body;
// body.addEventListener('input',function(e){console.log(e);},false);







// let at = document.getElementsByClassName("attraction");

// // attraction.addEventListener("click",) 
// // let ID = Attractions.data.id
// let arr = Array.from(at);
// // var arr = Array.prototype.slice.call(attractions);
// console.log(arr);
// console.log(at);
// console.log(at[11]);
// Array.from(at).forEach((e)=>{console.log(e);})
// Array.prototype.filter.call(arr,function(e){console.log(e);})
// // arr.forEach(function call(attraction){
// //     console.log(attraction);
// //     attraction.addEventListener("click",function(e){
// //         console.log("click")
// //         console.log(e);


// //     })


// // })

// let x = document.getElementsByTagName("p");
// console.log(x);
// console.log(x.length);  // 1
// Array.from(x).forEach((e)=>{console.log(e);})

// let y = document.getElementById("list")
// console.log(typeof(y.childNodes));
// let z = y.childNodes;
// console.log(z);
// console.log(z.length);   // 1
// Array.from(z).forEach((e)=>{console.log(e);});  // " "