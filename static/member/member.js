let memberAll = document.getElementById("member_all")
function renderMember(){

    getPassword();
    getOrderList();
}
let memberPassword = document.getElementById("mPassword");
function getPassword(){
    fetch('/api/password').then(response => { return response.json();
    }).then(res => {
        memberPassword.value = res.password;
    }).catch(error => {console.log('Error during fetch:'+error.message)})
}

function getOrderList(){
    fetch('/api/orders').then(response => { return response.json();
    }).then(res => {
        res.forEach(order => {
            console.log(order);
        });

        renderOrderList();
    }).catch(error => {console.log('Error during fetch:'+error.message);
    })
}

//load order list
let memberPreLoader = document.getElementById("loader");
function renderOrderList(){
    


    memberAll.style.display = "block";
    memberPreLoader.style.display = "none";
}



// log out
let logOut = document.getElementById("logout");
logOut.addEventListener("click",() => {
    fetch(userUrl, {
        method:'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    }).then( response =>{ return response.json();
    }).then( res =>{ window.location.href = "/";
    });
});

//change password
let change = document.getElementById("changePassword");
change.addEventListener("click", () => {
    change.style.display = "none";
    save.style.display = "block";
    memberPassword.removeAttribute("readonly");
    memberPassword.style.borderStyle = "inset";
});

let save = document.getElementById("savePassword");
let errorPassword = document.getElementById("error_password");

save.addEventListener("click", () => {
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



