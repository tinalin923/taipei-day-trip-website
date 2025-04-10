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

function callback(entries){
    if (!entries[0].isIntersecting){return ;}   
    else if (isLoading == true){return ; } 
    else {
        if ( !key_word && page !== null){loadDatas();}    //還有下一頁
        else if ( !key_word && page == null){return ;}   //首頁已滑到底
        else if ( !key_word && key_page !== 0){return ;} 
        else if ( key_word && key_page !== null){search();}
        else if ( key_word && key_page == null){return ;}    
}}

function render(){
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < Attractions.data.length; i++){
        let attraction = Attractions.data[i];
        let ID = attraction.id
        let place = document.createElement("div");
        place.className = "attraction";
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

function loadDatas(){
    if (isLoading == true){return ; }
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
}

function search(){
    if (isLoading == true){return;}
    keyword = document.querySelector(".search__input").value;   //用let 會重新設一個變數，傳不到外面的全域變數
    if (!keyword){return ;}               //key_word一定不會等於" "
    else if (keyword && key_page == 0){        //有輸入word 第一次搜尋 有無資料//搜尋無資料 空點
        isLoading = true;
        introduc.innerHTML = "";
        loader.style.display = "block";     
        key_word = keyword;
        let url = "/api/attractions?keyword="+key_word+"&page="+ key_page;
        fetch(url).then(res => {return res.json();
        }).then(attractions => {
            isLoading = false;   
            Attractions = attractions;
            let nextPage = attractions.nextpage;   
            key_page = nextPage;
            if (attractions.data == ""){            // 查無資料 
                loader.style.display = "none"; 
                introduc.textContent="查無相關景點";}
            else {                                //有資料 
                render();
            }     
        })
    }
    else if (keyword == key_word && key_page !==0){     //word不變 空點  //word不變.footer被觀察到.key_page !==null: 有無資料
        if (key_page == null){return ;}
        else if (key_page !== null && 
            footer.getBoundingClientRect().top > window.innerHeight){return ;} //防止連續點擊會自動載入
        else { 
            isLoading = true; 
            loader.style.display = "block";  
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
    else if (keyword !== key_word) {            //做新的搜尋，頁數歸零
        isLoading = true;
        introduc.innerHTML = "";   
        loader.style.display = "block";
        key_word = keyword;
        key_page = 0;     
        let url = "/api/attractions?keyword="+key_word+"&page="+key_page;
        fetch(url).then(res => {return res.json();
            }).then(attractions => {
                isLoading = false; 
                Attractions = attractions;
                let nextPage = attractions.nextpage;
                key_page = nextPage;
                if (attractions.data == ""){            // 查無資料 key_page==null
                    loader.style.display = "none"; 
                    introduc.textContent="查無相關景點";}
                else {                                //有資料 有變key_page
                    render();}
            })
    }       
}