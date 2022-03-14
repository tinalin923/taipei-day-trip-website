let page = 0 ;       
let key_page = 0 ;
let keyword = "" ;          //先前使用者輸入的關鍵字
let key_word = "" ;         //後來使用者輸入的關鍵字
let flag = true;            //管控是否可以連線
let footer = document.getElementsByTagName("footer")[0];
let button = document.querySelector("button");
button.addEventListener("click",search); 
window.addEventListener("DOMContentLoaded",loadData());
window.addEventListener("scroll",()=>{
    let options = {
        root:null,
        rootMargins:"0px",
        threshold:0.25
    };
    const observer = new IntersectionObserver(callback,options);
    observer.observe(footer);   
},{once:true});       //使註冊事件在第一次滾動後發生，且只發生一次

//用unobserve似乎無法完整關不掉observer (用disconnect?)
function callback(entries){
    console.log("看到底部");
    if (flag == false){return ; }    
    else if (!entries[0].isIntersecting){return ;}
    else{
        if (key_word == "" && page !== null){loadData();}    //還有下一頁
        else if (key_word == "" && page == null){console.log("沒有下一頁了");return ;}   //首頁已滑到底
        else if (key_word == "" && key_page!== 0){return ;} 
        // else if (key_word !== "" && key_page == 0){console.log("被看到了但沒用");return ;}   //防止找不到資料時看到footer重新呼叫
        else if (key_word !== "" && key_page !== null){console.log("被看到了");search();}
        else if (key_word !== "" && key_page == null){console.log("沒有下一頁了");return ;}
        // else{observer.unobserve(entries[0].target);return ;}    
}}

function loadData(){
    if(flag == false){return;}
    flag = false; 
    console.log("1"+flag) ;                       
    let url = "/api/attractions?page="+page;
    fetch(url).then(res => {
        return res.json();      
    }).then(attractions => {
        flag = true;                 
        console.log("2"+flag)  ;          // bool = true
        let nextPage = attractions.nextpage;
        page = nextPage;
        let introduc= document.getElementById("list");
        let fragment= document.createDocumentFragment();
        for(let i=0; i<attractions.data.length; i++ ){
            let attraction= attractions.data[i];
            let place= document.createElement("div");
            place.className= "attraction";
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
            introduc.appendChild(fragment);}
        // flag = true;                 // 為何放在這裡會沒有反應
        // console.log("2"+flag)  ;  
    })
    // console.log("完成了");   //會和1false一起出來
}

function search(){
    if (flag == false){return;}
    console.log("search!");
    keyword = document.querySelector("input").value;   //用let 會重新設一個變數，傳不到外面的全域變數
    if (keyword == ""){return ;}               //key_word一定不會等於" "
    else if (keyword !== "" && key_page == 0){        //有輸入word 第一次搜尋 有無資料//搜尋無資料 空點
        flag = false;     
        console.log("s1 "+flag) ;   //bool = false;
        key_word = keyword;
        let url ="/api/attractions?keyword="+key_word+"&page="+ key_page;
        // console.log (url);
        fetch(url).then(res => {return res.json();
        }).then(attractions => {
            flag = true; 
            console.log("s2 "+flag) ;   //bool = true;
            let introduc= document.getElementById("list");
            introduc.innerHTML="";
            let fragment= document.createDocumentFragment();
            let nextPage = attractions.nextpage;   
            key_page = nextPage;                        //有可能有下一頁或等於null
            if (attractions.data == ""){            // 查無資料 
                introduc.textContent="查無相關景點";}
            else{                                //有資料 
                for(let i=0; i < attractions.data.length; i++ ){
                    let attraction= attractions.data[i];
                    let place= document.createElement("div");
                    place.className= "attraction";
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
            }     
        })
    }
    else if (keyword == key_word && key_page !==0){     //word不變 空點  //word不變.footer被觀察到.key_page !==null: 有無資料
        if (key_page == null ){console.log("無資料 請不要一直點");return ;}
        else if (key_page !== null && 
            footer.getBoundingClientRect().top > window.innerHeight ){console.log("請不要一直點");return ;} //防止連續點擊會自動載入
        else{ console.log("載入下一頁");
            flag = false;     
            console.log("s1 "+flag) ;   //bool = false;
            let url ="/api/attractions?keyword="+key_word+"&page="+ key_page;
            fetch(url).then(res => {return res.json();
                }).then(attractions => {
                    flag = true; 
                    console.log("s2 "+flag) ;   //bool = true;
                    let nextPage = attractions.nextpage;
                    key_page = nextPage;
                    let introduc= document.getElementById("list");
                    let fragment= document.createDocumentFragment();
                    for(let i = 0; i < attractions.data.length; i++ ){
                        let attraction = attractions.data[i];
                        let place = document.createElement("div");
                        place.className= "attraction";
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
    }
    else if( keyword !== key_word) {
        flag = false;     
        console.log("s1 "+flag) ;   //bool = false;
        key_word = keyword;
        key_page = 0;     //做新的搜尋，頁數歸零
        let introduc= document.getElementById("list");
        introduc.innerHTML="";
        let url ="/api/attractions?keyword="+key_word+"&page="+key_page;
        fetch(url).then(res => {return res.json();
        }).then(attractions => {
            flag = true; 
            console.log("s2 "+flag) ;   //bool = true;
            let nextPage = attractions.nextpage
            key_page = nextPage;
            let fragment= document.createDocumentFragment();
            if (attractions.data == ""){            // 查無資料 key_page==null
                introduc.textContent="查無相關景點";}
            else{                                //有資料 有變key_page
                for(let i=0; i < attractions.data.length; i++ ){
                    let attraction= attractions.data[i];
                    let place= document.createElement("div");
                    place.className= "attraction";
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
            }
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