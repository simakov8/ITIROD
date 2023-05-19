const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("incorrect_h3");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.user_name.value;
    const password = loginForm.user_password.value;

    if (username === "user" && password === "user") {
        setTimeout(function(){
            window.location.href = 'index.html';
          }, 2 * 1000);
    } else {
        loginErrorMsg.style.visibility = "visible";
    }
})