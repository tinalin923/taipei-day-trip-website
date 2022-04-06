//我在common.js特別設定在 "/booking頁面點登出系統" 以及"未登入"時會發生的事情(導回首頁)
//招呼名稱&一開始就填好的emial 在common.js的checkStatus
//進入此頁面後會先執行common.js的checkStatus 然後才renderBooking
let bookingData = {};
let bookingUrl = '/api/booking';

//controller
async function renderBooking(){
    await getBookingData();
    renderBookingData();
}

//model
function getBookingData(){
    return fetch(bookingUrl, {
        method:'GET',
        headers:{'Content-type':'application/json'}
    }).then(response =>{ return response.json();
    }).then(res =>{
        bookingData = res;
    }).catch(error =>{
        console.log("Error during fetch:"+ error.message);
    })
}

//view
let booking_data_0 = document.getElementById("booking_data-0")
let booking_data_1 = document.getElementById("booking_data-1");

let image = document.getElementById("schedule_figure");
let title = document.getElementById("schedule_result-title");
let date = document.getElementById("schedule_result-date");
let time = document.getElementById("schedule_result-time");
let price = document.getElementById("schedule_result-fee");
let place = document.getElementById("schedule_result-place");
let fee = document.getElementById("check_fee");
let bookloader = document.getElementById("loader");
let view = document.querySelector(".booking");

function renderBookingData(){
    let booking = bookingData.data;
    if (booking === null){
        booking_data_1.style.display = "none";
        bookloader.style.display = "none";
        booking_data_0.textContent = "目前沒有任何待預訂的行程";
        view.style.display = "block"
    }
    else{
        let attraction = booking.attraction;
        image.src = attraction.image;
        title.textContent = attraction.name;
        date.textContent = booking.date;
        time.textContent = booking.time;
        price.textContent = booking.price;
        place.textContent = attraction.address;
        fee.textContent = booking.price;
        bookloader.style.display = "none";
        view.style.display = "block";
    }
}



//delete booking data function
let deletion = document.getElementById("delete");
deletion.addEventListener("click",deleteBooking);

//controller
async function deleteBooking(){
    await deleteBookingData();
    renderBookingData();
}
//model
function deleteBookingData(){
    return fetch(bookingUrl,{
        method:'DELETE',
        headers:{'Content-type':'application/json'}
    }).then(response =>{
        return response.json();
    }).then(res =>{
        if(res.ok === true){
            bookingData = {"data" : null};
        }
    }).catch(error =>{
        console.log("Error during fetch:"+ error.message);
    })
}



//TapPay
TPDirect.setupSDK(123974, 'app_Su0QGyWrBn4npBIkbwdCDBpbvYg1W9VYarqyLmKJOeDvytFEFL8ChREYbfGU', 'sandbox')
const fields = {
    number:{
        element: document.getElementById("card_number"),
        placeholder: '**** **** **** ****'
    },
    expirationDate:{
        element: document.getElementById("card_expirdate"),
        placeholder: 'MM / YY'
    },
    ccv:{
        element: document.getElementById("card_ccv"),
        placeholder: 'ccv'
    }
}
const styles = {
    'input':{
        'color': 'gray',
    },
    ':focus': {
        'color': 'black'
    },
    '.valid': {
        'color': 'green'
    },
    '.invalid': {
        'color': 'red'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: styles
})

let submitbtn = document.getElementById("submit");
TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        submitbtn.removeAttribute('disabled');
    } else {
        // Disable submit Button to get prime.
        submitbtn.setAttribute('disabled', true)
    }
})





submitbtn.addEventListener("click",getPrime);
function getPrime(){
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    if (tappayStatus.canGetPrime === false){
        console.log("cann't get prime");
        return ;
    } 
    TPDirect.card.getPrime((result)=>{
        if (result.status !== 0){
            console.log("get prime error"+result.msg);
            return ;
        } 
        console.log("get prime 成功");
        let prime = result.card.prime;
        let booking = bookingData.data;
        let attraction = booking.attraction;
        let oName = document.getElementById("inform_name").value;
        let oEmail = document.getElementById("inform_email").value;
        let oPhone = document.getElementById("inform_phone").value;
        let orderData = {
            "prime":prime,
            "order":{
                "price":booking.price,
                "trip":{
                    "attraction":{
                        "id":attraction.id,
                        "name":attraction.name,
                        "address":attraction.address,
                        "image":attraction.image
                    },
                    "date":booking.date,
                    "time":booking.time
                },
                "contact":{
                    "name": oName,
                    "email": oEmail,
                    "phone": oPhone
                }
            }
        };
        finishOrder(orderData);

    })
}
let orderNumber = "";
function finishOrder(data){
    fetch("/api/orders",{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body:JSON.stringify(data)
    }).then (response =>{return response.json();
    }).then (res=>{
        if (res.data.payment.status === 0){
            let paramsObj = {number:res.data.number};
            let serachParams = new URLSearchParams(paramsObj).toString();
            window.location.replace("/thankyou?"+serachParams);
        } else if (res.data.payment.status === 1){
            orderNumber = res.data.number;
            window.location.reload();
            
        } else {
            console.log(res);
        }
    }).catch(error =>{
        console.log("Error during fetch:"+error.message);
    })
}
