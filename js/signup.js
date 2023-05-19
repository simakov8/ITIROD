import { validate_email, validate_field, validate_password } from "/js/validators.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import {
    getDatabase,
    set,
    ref,
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

const but = document.getElementById("sign_up_submit");

but.addEventListener("click", (e) => {
    let email = document.getElementById("user_email").value;
    let username = document.getElementById("user_name").value;
    let password = document.getElementById("user_password").value;

    console.log(email, username, password);

    if (validate_field(username) == false) {
        alert('Username is not correct')
    }

    if (validate_email(email) == false) {
        alert('Email is not correct')
    }

    if (validate_password(password) == false) {
        alert('Password is not correct')
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(database, "users/" + user.uid), {
                username: username,
                email: email,
            });
            alert("user created!");
            setTimeout(function () {
                window.location.href = "login.html";
            }, 1 * 1000);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage);
        });
});