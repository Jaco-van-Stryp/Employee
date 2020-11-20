// Our web app's Firebase configuration
startLoading()
var firebaseConfig = {
    apiKey: "AIzaSyA9979-Um1TwPLskZr72_2bfiEJDpt2jSM",
    authDomain: "jaxify-software-administration.firebaseapp.com",
    databaseURL: "https://jaxify-software-administration.firebaseio.com",
    projectId: "jaxify-software-administration",
    storageBucket: "jaxify-software-administration.appspot.com",
    messagingSenderId: "202323429712",
    appId: "1:202323429712:web:b0ac3661a5b8a00a330455",
    measurementId: "G-HDPSLJ18QK"
}; // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
//Initialize Firestore
const db = firebase.firestore();
let Jobs = [];
let idIndex = 0;
let id, developer;
let pass = generatePassword();

window.onload = function () {
    let curDomain = window.location.href;
    let ProjectIdentification = curDomain.substr(curDomain.indexOf('#') + 1, curDomain.length);
    let data = ProjectIdentification.split("&7@!");
    id = data[0];
    developer = data[1];
    try {
        let userData = db.collection("projects").doc(developer);
        userData.get().then(function (doc) {
            if (doc.exists) {
                Jobs = doc.get("object");
                for (var i = 0; i < Jobs.length; i++) {
                    if (Jobs[i].ProjectID == id) {
                        if (Jobs[i].Status != "Client Invoiced") {
                            window.location = "./index.html";
                        }
                    }
                }
            } else {
                window.location = "./index.html"
                //TODO NO INFO FOUND

            }
        }).then((data) => {
            approve();
        })
    } catch (e) {
        window.location = "./index.html"
    }
}

function approve() {

    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            Jobs[i].Status = "Client Paid";
            db.collection('projects').doc(Jobs[i].DeveloperEmail).set({
                object: Jobs,
            }).then(function () {
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that we've received your payment of R" + Jobs[i].ClientInvoiced + " for your website: " + Jobs[i].Domain + "! We will keep you updated!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                sendMail("Developer", "You Legend! You Made A Sale (" + Jobs[i].Domain + ")! Please visit employee.jaxifysoftware.com to confirm the domain that needs to be purchased.", Jobs[i].DeveloperEmail, "jacovanstryp@gmail.com");
                setTimeout(() => { closeWindow(); }, 2000);
            })
                .catch(function (error) {
                    alert("Something went Wrong")
                });
        }
        break;
    }
}

function closeWindow() {
    window.location = "./index.html"
}

function sendMailFinance(client, Themessage, emailAddress, devEmail) {
    emailjs.send("service_2hqig97", "finance", {
        from_name: "Jaxify Software",
        to_name: client,
        message: Themessage,
        email: emailAddress,
        reply_to: devEmail,
    });
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function generatePassword() {
    var length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function sendMail(client, Themessage, emailAddress, devEmail) {
    emailjs.send("service_2hqig97", "template_7u9h78e", {
        from_name: "Domain Approval - Jaxify Software",
        to_name: client,
        message: Themessage,
        email: emailAddress,
        reply_to: devEmail,
    });
}

function startLoading() {
    document.getElementById('loader').style.display = "block";
    document.getElementById('loading').style.display = "block";
    document.getElementById('overlay').style.display = "block";
}

function stopLoading() {
    document.getElementById('loader').style.display = "none";
    document.getElementById('loading').style.display = "none";
    document.getElementById('overlay').style.display = "none";
}