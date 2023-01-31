import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9itFVgnaTtABW-vtr8h00vYAWZOpz_cY",
  authDomain: "imager-3247f.firebaseapp.com",
  projectId: "imager-3247f",
  storageBucket: "imager-3247f.appspot.com",
  messagingSenderId: "162552235643",
  appId: "1:162552235643:web:4ec6b2268893e49cc304de",
  measurementId: "G-G1YWV3B49W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
const realdb = getDatabase();
//VARIABLES
var files = [];
var namebox = document.getElementById("namebox");

var myimg = document.getElementById("myimg");
var imager = document.getElementById("imager");
var prog = document.getElementById("progressbar");
var showdetail = document.getElementById("uploader");
var SelBtn = document.getElementById("selbtn");
var UpBtn = document.getElementById("upbtn");
var DownBtn = document.getElementById("downbtn");
var input = document.createElement("input");
var extns;

//SELECTION
input.type = "file";
input.onchange = (e) => {
  files = e.target.files;
  var extension = GetFileExt(files[0]);
  extns = extension;
  var name = GetFileName(files[0]);
  namebox.innerHTML = name + extension;
  namebox.value = name;

  if (files.length != 0) {
    showdetail.removeAttribute("hidden");
  }
};
function GetFileExt(file) {
  var temp = file.name.split(".");
  var ext = temp.slice(temp.length - 1, temp.length);
  return "." + ext[0];
}
function GetFileName(file) {
  var temp = file.name.split(".");
  var fname = temp.slice(0, -1).join(".");
  return fname;
}

//UPLOAD
async function UploadProcess(userdetail) {
  var ImgToUpload = files[0];
  prog.removeAttribute("hidden");
  var ImgName = namebox.value;
  const storage = getStorage();
  const storageRef = sRef(storage, userdetail + "/Images/" + ImgName);
  const UploadTask = uploadBytesResumable(storageRef, ImgToUpload);
  if (!ValidateName()) {
    alert("Name cannot contain '.','#','$','[',or ']'");
    return;
  }
  UploadTask.on(
    "state-changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      prog.value = Math.round(progress);
    },
    (error) => {
      alert("error: image not uploaded!");
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
        SaveURLtoRealtimDB(downloadURL, userdetail);
        console.log(downloadURL);
        alert("Image Uploaded Sucessfully");
      });
    }
  );
}
//Save
function SaveURLtoRealtimDB(URL, username) {
  var name = namebox.value;
  var ext = extns;

  set(ref(realdb, "Users/" + username + "/ImagesLinks/" + name), {
    ImageName: name + ext,
    Imgurl: URL,
  });
}
var count = 0;
function GetUrlfromRealtimDB(username) {
  var imagediv = document.createElement("div");
  imager.appendChild(imagediv);
  imagediv.id = "image-sec";
  imagediv.classList.add("flip-card-back");
  imagediv.classList.add("divstyle");
  var dbRef = ref(realdb);
  get(child(dbRef, "Users/" + username + "/ImagesLinks/")).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach(function (childSnapshot) {
        createScreen();
        function createScreen() {
          count++;
          console.log("count=", count);
          var childData = childSnapshot.val();
          var el = document.createElement("img");
          el.classList.add("pop-btn-open");
          el.classList.add("img-style");
          el.src = childData["Imgurl"];
          for (var i of open_btn) {
            i.addEventListener("click", function () {
              console.log("working");
              img_name.innerText = childData["ImageName"];
              img_src.src = childData["Imgurl"];
              popup.classList.add("open-popup");
            });
          }
          imagediv.appendChild(el);
        }
      });
    }
  });
}
var popup = document.getElementById("popup");
var open_btn = document.getElementsByClassName("pop-btn-open");
var img_name = document.getElementById("img-name");
var img_src = document.getElementById("popup-img");
var pop_btn_close = document.getElementById("pop-btn-close");
//can't contain ".", "#", "$", "[", or "]"
function ValidateName() {
  var regex = /[\.$\[\]]/;
  return !regex.test(namebox.value);
}

pop_btn_close.addEventListener("click", closepop);
function closepop() {
  popup.classList.remove("open-popup");
}

document.getElementById("flip-card-btn-turn-to-back").style.visibility =
  "visible";

document.getElementById("flip-card-btn-turn-to-front").style.visibility =
  "visible";

document.getElementById("flip-card-btn-turn-to-back").onclick = function () {
  document.getElementById("flip-card-auth").classList.toggle("do-flip");
};

document.getElementById("flip-card-btn-turn-to-front").onclick = function () {
  document.getElementById("flip-card-auth").classList.toggle("do-flip");
};

//Authentication-Signup
const username = document.getElementById("userInp");
const email = document.getElementById("emailInp");
const log_username = document.getElementById("userLog");
const log_pass = document.getElementById("passLog");
const pass = document.getElementById("passInp");
const submit = document.getElementById("sub_btn");
const logbtn = document.getElementById("log_btn");
//Validate fields
function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}
function Validation() {
  let emailregex = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;
  let userregex = /^[a-zA-Z0-9]{5,}$/;
  if (
    isEmptyOrSpaces(email.value) ||
    isEmptyOrSpaces(username.value) ||
    isEmptyOrSpaces(pass.value)
  ) {
    alert("you cannot leave any field empty");
    return false;
  }
  if (!emailregex.test(email.value)) {
    alert("Enter a valid email");
    return false;
  }
  if (!userregex.test(username.value)) {
    alert(
      "Username can only be alphanumeric \n-username must be aleast 5 characters\n-username cannot contain"
    );
    return false;
  }
  return true;
}
//Register
function RegisterUser() {
  if (!Validation()) {
    return;
  }
  const dbRef = ref(realdb);
  get(child(dbRef, "Users/" + username.value)).then((snapshot) => {
    if (snapshot.exists()) {
      alert("Account Already Exist!");
    } else {
      set(ref(realdb, "Users/" + username.value), {
        email: email.value,
        username: username.value,
        password: pass.value,
      })
        .then(() => {
          alert("User added successfully");
        })
        .catch((error) => {
          alert("error" + error);
        });
    }
  });

  console.log("on");
}
//Authentication-LogIn
function AuthenticateUser() {
  const dbref = ref(realdb);
  get(child(dbref, "Users/" + log_username.value)).then((snapshot) => {
    if (snapshot.exists()) {
      let dbpass = snapshot.val().password;
      if (dbpass == log_pass.value) {
        login(snapshot.val());
      } else {
        alert("User does not exist");
      }
    } else {
      alert("Username or Password is invalid");
    }
  });
}

function login(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
  window.location = "index.html";
  localStorage.setItem("keepLoggedIn", "yes");
  localStorage.setItem("user", JSON.stringify(user));
  window.location = "index.html";
}
var currentUser = null;
function getUserName() {
  currentUser = JSON.parse(localStorage.getItem("user"));
  currentUser = JSON.parse(sessionStorage.getItem("user"));
}
function SignOut() {
  sessionStorage.removeItem("user");
  window.location = "index.html";
}
var userlink = document.getElementById("userlink");
var signoutlink = document.getElementById("signoutlink");
var div = document.getElementById("flip-card-3D-wrapper");
window.onload = function () {
  getUserName();

  if (currentUser == null) {
    userlink.innerText = "You are not logged in";
    div.style.display = "flex";
  } else {
    userlink.innerText = "Logged in as " + currentUser.username;
    signoutlink.innerText = "SignOut";
    signoutlink.onclick = SignOut;
    SelBtn.onclick = function () {
      input.click();
    };
    UpBtn.addEventListener("click", function () {
      UploadProcess(currentUser.username);
    });
    DownBtn.addEventListener("mouseenter", function () {
      GetUrlfromRealtimDB(currentUser.username);
    });
  }
};

submit.addEventListener("click", function (e) {
  e.preventDefault();
  RegisterUser();
});
logbtn.addEventListener("click", function (e) {
  e.preventDefault();
  AuthenticateUser();
});
