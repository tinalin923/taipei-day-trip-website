let memberAll = document.getElementById("member_all");
let memberPreLoader = document.getElementById("loader");

function renderMember(){
    getPassword();
    getOrderLists();
}

let memberPassword = document.getElementById("mPassword");
function getPassword(){
    fetch('/api/password').then(response => { return response.json();
    }).then(res =>{
        memberPassword.value = res.password;
    }).catch(error =>{
        console.log('Error during fetch:'+error.message);
    })
}
let listsContainer = document.getElementById("order_list_body");

function getOrderLists(){
    fetch('/api/orders').then(response => { return response.json();
    }).then(res =>{
        if (res.data === null){
            listsContainer.textContent = "尚無預訂項目";
            memberAll.style.display = "block";
            memberPreLoader.style.display = "none";
        }
        else{res.forEach(order => {
            let tNumber = order.data.orderNumber;
            let tDate = order.data.date;
            let tPlace = order.data.place;
            let tPrice = order.data.price;
            renderOrderLists(tNumber,tDate,tPlace,tPrice);
        });
        memberAll.style.display = "block";
        memberPreLoader.style.display = "none";
        }
    }).catch(error =>{console.log('Error during fetch:'+error.message);
    })
}

//render order list
function renderOrderLists(tNumber,tDate,tPlace,tPrice){
    let listRow = document.createElement("div");
    listRow.classList.add("order_list_body_row");
    let listRowItemNumber = document.createElement("div");
    listRowItemNumber.classList.add("order_list_body_row_number");
    listRowItemNumber.textContent = tNumber;
    listRowItemNumber.addEventListener("click",()=>{
        getOrderDetail(listRowItemNumber.textContent);
    });
    let listRowItemDate = document.createElement("div");
    listRowItemDate.textContent = tDate;
    let listRowItemPlace = document.createElement("div");
    listRowItemPlace.textContent = tPlace;
    let listRowItemPrice = document.createElement("div");
    listRowItemPrice.textContent = tPrice;
    listRow.appendChild(listRowItemNumber);
    listRow.appendChild(listRowItemDate);
    listRow.appendChild(listRowItemPlace);
    listRow.appendChild(listRowItemPrice);
    listsContainer.appendChild(listRow);
}

function getOrderDetail(memberOrderNumber){
    details.style.display = "none";
    memberPreLoader.style.display = "block";
    fetch("/api/order/"+memberOrderNumber).then(response =>{
        return response.json();
    }).then(res =>{
        renderOrderDetails(res.data);
    }).catch(error =>{console.log('Error during fetch:'+error.message);})
}
let details = document.querySelector(".order_details");
let dNumber = document.getElementById("d_number");
let dImage = document.getElementById("d_image");
let dDate = document.getElementById("d_date");
let dTime = document.getElementById("d_time");
let dPlace = document.getElementById("d_place");
let dAddress = document.getElementById("d_address");
let dName = document.getElementById("d_name");
let dPhone = document.getElementById("d_phone");
let dStatus = document.getElementById("d_status");
function renderOrderDetails(data){
    dNumber.textContent = data.number;
    dImage.setAttribute("src",data.trip.attraction.image);
    dDate.textContent = data.trip.date;
    dTime.textContent = data.trip.time;
    dPlace.textContent = data.trip.attraction.name;
    dAddress.textContent = data.trip.attraction.address;
    dName.textContent = data.contact.name;
    dPhone.textContent = data.contact.phone;
    if (data.status === 0){dStatus.textContent = "已付款";}
    else {dStatus.textContent = "尚未付款";}
    memberPreLoader.style.display = "none"
    details.style.display = "block";
}
// log out
let logOut = document.getElementById("logout");
logOut.addEventListener("click",() =>{
    fetch(userUrl, {
        method:'DELETE',
        headers: {'Content-type': 'application/json'},
    }).then( response =>{ return response.json();
    }).then( res =>{ window.location.href = "/";
    });
});

//change password
let change = document.getElementById("changePassword");
change.addEventListener("click", () =>{
    change.style.display = "none";
    save.style.display = "block";
    memberPassword.removeAttribute("readonly");
    memberPassword.style.borderStyle = "inset";
});

let save = document.getElementById("savePassword");
let errorPassword = document.getElementById("error_password");

save.addEventListener("click", () =>{
    if (memberPassword.value.length === 0){
        errorPassword.textContent = "請輸入密碼";
    } else if (memberPassword.value.length < 3){
        errorPassword.textContent = "請輸入至少三個字";
    } else {
        errorPassword.textContent = "";
        fetch('/api/password', {
            method:'PATCH',
            body:JSON.stringify({
                "newPassword":memberPassword.value
            }),
            headers:{
                'Content-type':'application/json'
            }
        }).then(response => { return response.json();
        }).then(res =>{
            if (res.ok === true){
                save.style.display = "none";
                change.style.display = "block";
                memberPassword.readOnly = "true";
                memberPassword.style.borderStyle = "none";
            } else {
                errorPassword.textContent = "更新失敗";
            }
        }).catch(error => { 
            errorPassword.textContent = "更新失敗";
            console.log("Error during fetch:"+error.message);
        })
    }
});



