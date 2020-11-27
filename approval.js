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

window.onload = function() {
    let curDomain = window.location.href;
    let ProjectIdentification = curDomain.substr(curDomain.indexOf('#') + 1, curDomain.length);
    let data = ProjectIdentification.split("&7@!");
    id = data[0];
    developer = data[1];
    try {
        let userData = db.collection("projects").doc(developer);
        userData.get().then(function(doc) {
            if (doc.exists) {
                Jobs = doc.get("object");
                for (var i = 0; i < Jobs.length; i++) {
                    if (Jobs[i].ProjectID == id) {
                        document.getElementById("miniInvoice").value = Jobs[i].ProjectInstructions
                        document.getElementById("clientEmail").innerHTML = "Customer Email: " + Jobs[i].ClientEmail
                        document.getElementById("totalInvoiced").innerHTML = "Total Invoiced: R" + Jobs[i].ClientInvoiced
                        document.getElementById("cname").innerHTML = "Client Name " + Jobs[i].ClientName

                        if (Jobs[i].Status != "Pending Approval") {
                            window.location = "./index.html";
                        }
                    }
                }
                stopLoading();
            } else {
                window.location = "./index.html"
                    //TODO NO INFO FOUND
                stopLoading();

            }
        })
    } catch (e) {
        window.location = "./index.html"
    }
}

function approve() {
    if (document.getElementById("wave").value == "") {
        alert("Please enter a wave Invoice")
        console.log("IF")
    } else {
        let found = false;
        console.log(id)
        console.log(Jobs)

        for (var i = 0; i < Jobs.length; i++) {
            console.log(Jobs[1].ProjectID)
            console.log(Jobs[i].ProjectID)
            if (Jobs[i].ProjectID == id) {

                Jobs[i].Status = "Client Invoiced";
                Jobs[i].WaveURL = document.getElementById("wave").value
                console.log("ELSE")
                console.log(Jobs[i])

                db.collection('projects').doc(Jobs[i].DeveloperEmail).set({
                        object: Jobs,
                    }).then(function() {
                        sendMailFinance(Jobs[i].ClientName, "We just wanted to let you know that we've received your order for your website: " + Jobs[i].Domain + "! (ORDER NUMBER: " + Jobs[i].ProjectID + " ) We will keep you updated at all times. We Estimate your website will be completed on or before " + Jobs[i].DueDate + "! Before we can get started on reserving your domain name and building your website, we require you to make a deposit of R150. Your invoiced payment of R" + (1 * Jobs[i].ClientInvoiced).toFixed(2) + " may also be paid in full now if you would like to speed up the process. A Deposit of R150 Is required upfront before we can start with anything on our side. This is simply to ensure that no one disappears without paying for their website. Your Invoice can be found via this link - " + Jobs[i].WaveURL + "", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                        sendMail("Developer", "Your Project - " + Jobs[i].Domain + " Has Been Approved. (Order Number - " + Jobs[i].ProjectID + " ) Please Visit employee.jaxifysoftware.com for further instructions! If your client wants to see the invoice in a pdf format, you can download it here: " + Jobs[i].WaveURL + " - You are expected to finish this website before " + Jobs[i].DueDate, Jobs[i].DeveloperEmail, "jacovanstryp@gmail.com");
                        alert("Project Approved");

                    })
                    .catch(function(error) {
                        alert("Something went Wrong " + error)
                    });
                break;

            } else {
                console.log(Jobs[i].ProjectID + " DOES NOT MATCH " + id)
            }
        }
    }
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