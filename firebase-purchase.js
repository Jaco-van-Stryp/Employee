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

function moveOn() {
    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            if (Jobs[i].Status != "Domain Purchase Request Forwarded To Manager") {
                window.location = "./index.html"
            } else {
                let btnValue = document.getElementById("mainbtn").innerHTML.trim();
                console.log(btnValue)
                if (btnValue == "Get Started") {
                    window.open("https://za.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=" + Jobs[i].Domain);
                    document.getElementById("mainbtn").innerHTML = "I've Purchased The Domain";
                } else if (btnValue == "I've Purchased The Domain") {
                    copyToClipboard("50.87.177.72");
                    window.open("https://dcc.godaddy.com/manage/dns?domainName=" + Jobs[i].Domain)
                    document.getElementById("mainbtn").innerHTML = "I've Changed The A Record To 50.87.177.72";
                } else if (btnValue == "I've Changed The A Record To 50.87.177.72") {
                    window.open("https://my.bluehost.com/cgi/hosting/assign/" + Jobs[i].Domain)
                    document.getElementById("mainbtn").innerHTML = "I've Assigned The Domain To BlueHost";
                } else if (btnValue == "I've Assigned The Domain To BlueHost") {
                    document.getElementById("mainbtn").innerHTML = "I've changed the name servers to NS1.BLUEHOST.COM and NS2.BLUEHOST.COM";
                    window.open("https://dcc.godaddy.com/manage/dns?domainName=" + Jobs[i].Domain)
                } else if (btnValue == "I've changed the name servers to NS1.BLUEHOST.COM and NS2.BLUEHOST.COM") {
                    window.open("https://my.bluehost.com/hosting/app/#/create/wordpress")
                    document.getElementById("mainbtn").innerHTML = "I've Created The Website";
                } else if (btnValue == "I've Created The Website") {
                    sendMail(Jobs[i].ClientName, "We just wanted to let you know that your website domain " + Jobs[i].Domain + " is now live on the public internet, we're still building your website and will let you know when everything is completed!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                    copyToClipboard(pass);
                    window.open("https://" + Jobs[i].Domain + "/wp-admin/user-new.php")
                    document.getElementById("mainbtn").innerHTML = ("I've Added The Following User:\nUsername: " + Jobs[i].DeveloperEmail + "\nPassword: " + pass);
                } else if (btnValue == ("I've Added The Following User:\nUsername: " + Jobs[i].DeveloperEmail + "\nPassword: " + pass)) {
                    window.open("https://" + Jobs[i].Domain + "/wp-admin/options-permalink.php")
                    document.getElementById("mainbtn").innerHTML = ("I've Changed The Permalink to Post Name");
                } else if (btnValue == ("I've Changed The Permalink to Post Name")) {
                    window.open("https://" + Jobs[i].Domain + "/wp-admin/plugin-install.php?s=brizy&tab=search&type=term")
                    document.getElementById("mainbtn").innerHTML = ("I've Installed Brizy and Brizy Pro");
                } else if (btnValue == ("I've Installed Brizy and Brizy Pro")) {
                    Jobs[i].Status = "Website Work Started";
                    db.collection('projects').doc(Jobs[i].DeveloperEmail).set({
                            object: Jobs,
                        }).then(function() {
                            sendMail("Developer", "Your Domain Request Has Been Approved! To start Working, please visit this link - " + Jobs[i].Domain + "/wp-admin - username: " + Jobs[i].DeveloperEmail + " password: " + pass, Jobs[i].DeveloperEmail, "jacovanstryp@gmail.com");
                            document.getElementById("mainbtn").innerHTML = ("Setup Complete");
                            window.location = "./index.html";
                        })
                        .catch(function(error) {
                            alert("Something went Wrong")
                        });
                }
                break;
            }
        }
    }
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