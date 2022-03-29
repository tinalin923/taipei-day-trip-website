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

async function makeReservation(){
    await insertData();
    renderBooking();
}

let ID =  window.location.pathname
ID = ID.split('/')[2]





function insertData(){
    let chosenDate = document.getElementById("date").value;
    let price = document.getElementById("money").textContent;
    let time;
    if (price === "2000"){time = "上午8點到下午2點";}
    if (price === "2500"){time = "下午2點到晚上9點";}
    data = {
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
    }).catch(error=>{
        console.log("Error during fetch:"+error.message)
    });
}

function renderBooking(){
    console.log('render!');
}
