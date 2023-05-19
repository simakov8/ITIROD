const signUpForm = document.getElementById("sign_up-form");
const signUpButton = document.getElementById("sign_up_submit");

signUpButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = signUpForm.user_name.value;
    const password = signUpForm.user_password.value;

    localStorage.setItem('name', username);
    localStorage.setItem('password', password);

    window.location.href = 'login.html';
})
