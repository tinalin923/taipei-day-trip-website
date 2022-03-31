//我在common.js特別設定在 "/booking頁面點登出系統" 以及"未登入"時會發生的事情(導回首頁)
//招呼名稱在common.js的checkStatus
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

function renderBookingData(){
    let booking = bookingData.data;
    if (booking === null){
        booking_data_1.style.display = "none";
        booking_data_0.textContent = "目前沒有任何待預定的行程";
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