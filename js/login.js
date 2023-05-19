import { validate_email, validate_password } from "/js/validators.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    update,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAc0N0ArnZ5ugMUT4Zbq_VfHaJWzgMkm8",
    authDomain: "music-hub-d33a2.firebaseapp.com",
    projectId: "music-hub-d33a2",
    storageBucket: "music-hub-d33a2.appspot.com",
    messagingSenderId: "708159979362",
    appId: "1:708159979362:web:267a6197fa1635cb0d763b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const auth = getAuth(app);
console.log(auth);
const database = getDatabase(app);
console.log(database);

const but = document.getElementById("login_form_submit");

but.addEventListener("click", (e) => {
    let email = document.getElementById("user_email").value;
    let password = document.getElementById("user_password").value;
    const loginErrorMsg = document.getElementById("incorrect_h3");

    console.log(email, password);

    if (validate_email(email) == false) {
        alert('Email is not correct')
    }

    if (validate_password(password) == false) {
        alert('Password is not correct')
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            const dt = new Date();
            update(ref(database, "users/" + user.uid), {
                last_login: dt,
            });

            alert("User loged in!");

            setTimeout(function () {
                window.location.href = "index.html";
            }, 2 * 1000);

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
            loginErrorMsg.style.visibility = "visible";
        });
});