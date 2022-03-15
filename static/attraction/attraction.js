let ID = {{id}};
let url = "/api/attraction/"+ID;
let datas;


//model
function getData(){
    return fetch(url).then(res => {return res.json()}).then(attraction =>{
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
}

//controller
async function loadData(){
    await getData();
    render();
}




//checkbox changing
let mornBox = document.getElementById("morning");
let evenBox = document.getElementById("evening")
// evenBox.addEventListener("click",function(){


// })


