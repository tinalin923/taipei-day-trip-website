document.addEventListener("load",loadData());

async function loadData(){
    let url="/api/attractions?page=0";
    let attractions=await get(url);
    for(let i=0; i<13; i++ ){
        let attraction=attractions["data"][i];
        let intro= document.getElementById("wrapper");
        let place= document.createElement("div");
        place.className="attraction";
        let fragment= document.createDocumentFragment();
        fragment.appendChild(place);
        let site= document.createElement("div");
        site.className="figure";
        let pic= document.createElement('img');
        pic.src= attraction["images"][0];
        let caption= document.createElement("figcaption");
        caption.textContent=attraction["name"];
        site.appendChild(pic);
        site.appendChild(caption);
        let type= document.createElement("div");
        type.className="sort";
        let left= document.createElement("div");
        left.className="left"
        left.textContent=attraction["mrt"];
        let right= document.createElement("div");
        right.className="right";
        right.textContent=attraction["category"];
        type.appendChild(left);
        type.appendChild(right);
        place.appendChild(site);
        place.appendChild(type);
        intro.appendChild(fragment);
    }
}


function get(url){
    let promise =new Promise((resolve, reject) => {
    fetch(url).then(res => {return res.json();
    }).then(response => {console.log(response);resolve (response);
    }).catch(error => {
        console.log("Error during fetch:"+ error.message);
    })
    })
    return promise;
}