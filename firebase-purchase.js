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
window.onload = function() {
    let pass = generatePassword();
    let curDomain = window.location.href;
    let ProjectIdentification = curDomain.substr(curDomain.indexOf('#') + 1, curDomain.length);
    let id, developer;
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
                        alert("Set Up Domain - " + Jobs[i].Domain)
                        idIndex = i;
                        window.open("https://za.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=" + Jobs[i].Domain);
                        let c = confirm("I've Purchased The Domain")
                        while (c != true) {

                        }
                        c = false;
                        window.open("https://dcc.godaddy.com/manage/dns?domainName=" + Jobs[i].Domain)
                        c = confirm("I've Changed The A Record To 50.87.177.72")
                        while (c != true) {

                        }
                        c = false;
                        window.open("https://my.bluehost.com/cgi/hosting/assign/" + Jobs[i].Domain)
                        c = confirm("I've Assigned The Domain To BlueHost")
                        while (c != true) {

                        }
                        c = false;
                        window.open("https://dcc.godaddy.com/manage/dns?domainName=" + Jobs[i].Domain)
                        c = confirm("I've changed the name servers to NS1.BLUEHOST.COM and NS2.BLUEHOST.COM")
                        while (c != true) {

                        }
                        c = false;
                        window.open("https://my.bluehost.com/hosting/app/#/create/wordpress")
                        c = confirm("I've Created The Website")
                        while (c != true) {

                        }
                        c = false;
                        sendMail(Jobs[i].ClientName, "We just wanted to let you know that your website domain " + Jobs[i].Domain + " is now live on the public internet, we're still building your website and will let you know when everything is completed!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                        window.open("https://" + Jobs[i].Domain + "/wp-admin/user-new.php")
                        c = confirm("I've Added The Following User:\nUsername: " + Jobs[i].DeveloperEmail + "\nPassword: " + pass)
                        while (c != true) {

                        }
                        c = false;
                        window.open("https://" + Jobs[i].Domain + "/wp-admin/options-permalink.php")
                        c = prompt("I've Changed The Permalink to Post Name")
                        while (c != true) {

                        }
                        c = false;
                        window.open("https://" + Jobs[i].Domain + "/wp-admin/plugin-install.php?s=brizy&tab=search&type=term")
                        c = prompt("I've Installed Brizy & Brizy Pro")
                        while (c != true) {

                        }
                        c = false;

                        Jobs[i].Status = "Website Work Started";
                        db.collection('projects').doc(Jobs[i].DeveloperEmail).set({
                                object: Jobs,
                            }).then(function() {
                                sendMail("Developer", "Your Domain Request Has Been Approved! To start Working, please visit this link - " + Jobs[i].Domain + "/wp-admin - username: " + Jobs[i].DeveloperEmail + " password: " + pass, Jobs[i].DeveloperEmail, "jacovanstryp@gmail.com");
                                alert("Setup Complete!")
                                window.close();

                            })
                            .catch(function(error) {
                                alert("Something went Wrong")
                            });
                        break;
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