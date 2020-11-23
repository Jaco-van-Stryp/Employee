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




window.onload = function() {
    console.log("Loaded")
}

function setSearchQuery() {
    var info = getCookie("user")
    console.log(info)
}
//This function takes cookies and decodes them to get the name
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return (c.substring(name.length, c.length)).toLowerCase();
        }
    }
    return "";
}

function convertToFireBase(obj) {
    const smartVal = semail;
    db.collection('projects').doc(smartVal).set({
            object: obj,
        }).then(function() {

        })
        .catch(function(error) {

        });
    loadTable(obj)
}
let Jobs = [];
let fname, semail, photoUrl, uid, emailVerified;
try {
    var user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (user != null) {
                fname = user.displayName;
                semail = user.email;
                photoUrl = user.photoURL;
                emailVerified = user.emailVerified;
                uid = user.uid;
                console.log("User Signed IN")


                const smartVal = semail
                console.log(smartVal)
                userData = db.collection("projects").doc(smartVal);
                userData.get().then(function(doc) {
                    if (doc.exists) {
                        Jobs = doc.get("object");
                        loadTable(Jobs);
                        setSearchQuery();
                        stopLoading();
                    } else {
                        console.log("No such document!");
                        //TODO NO INFO FOUND
                        stopLoading();

                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                    //TODO NO INFO FOUND

                    stopLoading();

                });
            }
        } else {
            console.log("No User Signed In")
            document.location = "./index.html"

        }
    });
} catch (exception) {
    console.log(exception)
        //TODO NO INFO FOUND

}

let sumMonth = 0;

function loadTable(streamData) {
    var d = new Date();

    sumMonth = 0;
    let PredictionMonths = [];
    for (var x = 0; x < streamData.length; x++) {
        PredictionMonths.push((streamData[x]))
    }
    if (streamData.length > 0) {
        setSearchQuery();
    }
    console.log(PredictionMonths)
    let table = document.getElementById("mainTable");
    table.innerHTML = "<tr><th>Date Started</th><th>Project Type</th><th>Client Name</th><th>Status</th><th>Client Email</th><th> Payout </th> <th>Due Date</th><th>View Invoice</th><th>Update Status</th><th>Cancel Project</th><th>Edit Website</th></tr>";
    for (var i = 0; i < PredictionMonths.length; i++) {

        if (PredictionMonths[i].Status == "Website Completed") {
            const date1 = new Date(PredictionMonths[i].DateCompleted);

            const d = new Date();
            console.log(date1)
            console.log(d)

            if (date1.getFullYear() != d.getFullYear() || date1.getMonth() != d.getMonth() || date1.getDay() > 25) {

            } else {
                table.innerHTML += "<tr><td>" + PredictionMonths[i].DateStarted + "</td><td>" + PredictionMonths[i].ProjectType + "</td><td>" + PredictionMonths[i].ClientName + "</td><td>" + PredictionMonths[i].Status + "</td><td><button onclick=\"document.location=\'mailto:" + PredictionMonths[i].ClientEmail + "\'\">" + "Send Mail To Client" + "</a></td><td>R" + (0.7 * PredictionMonths[i].ClientInvoiced).toFixed(2) + "</td><td>" + PredictionMonths[i].DueDate + "</td><td><button onclick=\"document.location=\'" + PredictionMonths[i].WaveURL + "\'\">View Invoice</button></td><td><button onclick=\"updateStatus('" + PredictionMonths[i].ProjectID + "')\">" + getNextStatus(PredictionMonths[i].ProjectID) + "</button></td><td><button style=\"background-color: red;\" onclick=\"delProject(\'" + PredictionMonths[i].ProjectID + "\')\">Cancel Project</button></td><td><button style=\"background-color: purple;\" onclick=\"document.location=\'https://" + PredictionMonths[i].Domain + "/wp-admin\'\">Edit Website</button></td></tr>";
                if (PredictionMonths[i].Status == "Website Completed") {
                    sumMonth += (0.7 * PredictionMonths[i].ClientInvoiced)
                }
            }
        } else {
            table.innerHTML += "<tr><td>" + PredictionMonths[i].DateStarted + "</td><td>" + PredictionMonths[i].ProjectType + "</td><td>" + PredictionMonths[i].ClientName + "</td><td>" + PredictionMonths[i].Status + "</td><td><button onclick=\"document.location=\'mailto:" + PredictionMonths[i].ClientEmail + "\'\">" + "Send Mail To Client" + "</a></td><td>R" + (0.7 * PredictionMonths[i].ClientInvoiced).toFixed(2) + "</td><td>" + PredictionMonths[i].DueDate + "</td><td><button onclick=\"document.location=\'" + PredictionMonths[i].WaveURL + "\'\">View Invoice</button></td><td><button onclick=\"updateStatus('" + PredictionMonths[i].ProjectID + "')\">" + getNextStatus(PredictionMonths[i].ProjectID) + "</button></td><td><button style=\"background-color: red;\" onclick=\"delProject(\'" + PredictionMonths[i].ProjectID + "\')\">Delete Project</button></td><td><button style=\"background-color: purple;\" onclick=\"document.location=\'https://" + PredictionMonths[i].Domain + "/wp-admin\'\">Edit Website</button></td></tr>";

            if (PredictionMonths[i].Status == "Website Completed") {
                sumMonth += (0.7 * PredictionMonths[i].ClientInvoiced)
            }
        }

    }
    document.getElementById("user_display_name").innerHTML = "Due To You This Month: R" + sumMonth.toFixed(2)
}

function signOut() {
    firebase.auth().signOut();
    document.location = "./index.html"
}

function delProject(id) {
    let conf = confirm("Are you sure you want to cancel this project?");
    if (conf == true) {
        for (var i = 0; i < Jobs.length; i++) {
            if (Jobs[i].ProjectID == id) {
                sendMail(Jobs[i].ClientName, "We're sad to see you go! This is just an update to let you know that your website has been canceled, and will no longer be worked on. If you believe this is a mistake or would like to continue working with us, please let us know!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                Jobs.splice(i)
            }
            convertToFireBase(Jobs);
        }
    }

}


function getNextStatus(id) {
    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            let status = Jobs[i].Status;
            if (status == "Project Registered") {
                return "Invoice Client";
            } else if (status == "Client Invoiced") {
                return "Mark As Paid";
            } else if (status == "Client Paid") {
                return "Request Domain Purchase";
            } else if (status == "Domain Purchase Request Forwarded To Manager") {
                return "";
            } else if (status == "Domain Purchased") {
                return "I've Changed The DNS Records";
            } else if (status == "DNS A Record / Nameservers Changed To BlueHost") {
                return "I'm Ready To Start Working On The Project";
            } else if (status == "Website Work Started") {
                return "I've Completed The Project";
            } else return ""
        }
    }
}

function updateStatus(id) {
    startLoading();
    console.log(id)
    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            let status = Jobs[i].Status;
            console.log("CHANGING STATUS")
            if (status == "Project Registered") {
                Jobs[i].Status = "Client Invoiced";
                //  sendMail(Jobs[i].ClientName, "We just wanted to let you know that we've sent you an invoice for your website: " + Jobs[i].Domain + "! It can be viewed here - " + Jobs[i].WaveURL + "\nOnce We Receive Payment, you'll receive a notification!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
            } else if (status == "Client Invoiced") {
                Jobs[i].Status = "Client Paid";
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that we've received your payment of R" + Jobs[i].ClientInvoiced + " for your website: " + Jobs[i].Domain + "! We will keep you updated!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
            } else if (status == "Client Paid") {
                let dm = prompt("Please enter / confirm the domain address you want to reserve for this client\nPlease make sure not to include www or https. Just (for example) google.com").toLowerCase()
                if (dm != Jobs[i].Domain.toLowerCase()) {
                    dm = prompt("The Domain you entered does not match the domain you first entered\nPlease double check and enter the domain you want to use for this client. The Domain You enter now, is the final set domain and can not be changed later.").toLowerCase();
                    Jobs[i].Domain = dm;
                }
                Jobs[i].Status = "Domain Purchase Request Forwarded To Manager";
                sendMail("Jaco van Stryp", "Domain Purchase Request - employee.jaxifysoftware.com/purchase.html#" + Jobs[i].ProjectID + "&7@!" + Jobs[i].DeveloperEmail, "jacovanstryp@gmail.com", Jobs[i].DeveloperEmail);
                alert("Your Purchase Request has been forwarded to a manager!")
            } else if (status == "Domain Approved") {
                Jobs[i].Status = "Website Work Started";
                let f = false;
                while (f != true) {
                    f = confirm("After the website ownership has been verified on bluehost,\nchange both the name servers to NS1.BLUEHOST.COM and NS2.BLUEHOST.COM")
                }
                window.open("https://dcc.godaddy.com/manage/dns?domainName=" + Jobs[i].Domain)
            } else if (status == "DNS A Record / Nameservers Changed To BlueHost") {
                Jobs[i].Status = "Website Work Started";
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that your website domain " + Jobs[i].Domain + " is now live on the public internet, we're still building your website and will let you know when everything is completed!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                window.open("https://my.bluehost.com/hosting/app/#/create/wordpress")
            } else if (status == "Website Work Started") {
                Jobs[i].Status = "Website Completed";
                sendMail(Jobs[i].ClientName, "We have Great News! Your website " + Jobs[i].Domain + " is all completed and ready for you and your customers to use! Should you want a course on maintaining your own website, we explain everything in detail here on how to manage, maintain and build your own pages! - https://www.jaxifysoftware.com/shop/course/ - To sign into the dashboard of your website, please use the following address " + Jobs[i].Domain + "/wp-admin - You'll click on forgot password, and reset it with your email account. It was really nice working with you, and we'd love it if you could review our services! - https://www.facebook.com/jaxifysoftware/reviews", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                let d = new Date;
                Jobs[i].DateCompleted = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                window.open("https://" + Jobs[i].Domain + "/wp-admin/user-new.php")

            } else {

            }
            convertToFireBase(Jobs);
        }
        stopLoading();

    }
}

function sendMail(client, Themessage, emailAddress, devEmail) {
    emailjs.send("service_2hqig97", "template_7u9h78e", {
        from_name: "Jaxify Software",
        to_name: client,
        message: Themessage,
        email: emailAddress,
        reply_to: devEmail,
    });
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

function doesIDExist(id) {
    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            return true;
        }
    }
    return false;
}

function AddProject() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var projID = "blank"
    projID = document.getElementById("project_ID").value
    var developer = document.getElementById("project_developer_email").value

    var projectType = "Website"

    var clientName = document.getElementById("project_client_name").value
    var clientEmail = document.getElementById("project_client_email").value
    var clientInvoiced = document.getElementById("project_client_invoiced").value
    var projectStatus = "Pending Approval"
    var instructions = document.getElementById("project_instructions").value
    var dueDate = document.getElementById("project_due_date").value
    var address = document.getElementById("domain").value
    if ((1 * clientInvoiced) < 300) {
        alert("You need to charge at least R300 or more per project")
    } else {
        today = mm + '/' + dd + '/' + yyyy;
        if (projID == "" || projID.length <= 7 || developer == "" || clientName == "" || clientEmail == "" || clientInvoiced == "" || projectStatus == "" || instructions == "" || dueDate == "") {
            alert("Please make sure all info is filled in correctly")
        } else if (doesIDExist(projID) == false) {
            var d = new Date();
            let sDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
            console.log(sDate);
            Jobs.push({
                ProjectID: projID,
                ProjectType: projectType,
                DeveloperEmail: developer,
                ClientName: clientName,
                ClientEmail: clientEmail,
                ClientInvoiced: clientInvoiced,
                Status: projectStatus,
                ProjectInstructions: instructions,
                DueDate: dueDate,
                DateStarted: sDate,
                DateCompleted: null,
                WaveURL: "",
                Domain: address,
            })
            document.getElementById("project_ID").value = "";
            document.getElementById("project_developer_email").value = "";
            document.getElementById("project_client_name").value = "";
            document.getElementById("project_client_email").value = "";
            document.getElementById("project_client_invoiced").value = "";
            document.getElementById("project_instructions").value = "";
            document.getElementById("project_due_date").value = "";
            document.getElementById("domain").value = "";
            sendMail("Jaco van Stryp", "Project Approval Request for " + developer + " with the client being: " + clientName + " Invoiced: R" + clientInvoiced + "" - employee.jaxifysoftware.com / approve.html# " + projID + " & 7 @!" + developer + " | Confirm Payment Received - employee.jaxifysoftware.com / pop.html# " + projID + " & 7 @!" + developer, "
                jacovanstryp @gmail.com ", developer);
                convertToFireBase(Jobs); window.scrollTo(0, 0);

                alert("New Project Added Successfully\nYour project has been forwarded to a manager so they can add an invoice. When The Client Pays, Please Update The Status Of The Project!")

            }
            else {
                alert("This ID Already Exists!")
            }
        }


    }

    function genR() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        uuid = uuid.substr(0, 8);
        document.getElementById("project_ID").value = uuid;

    }
    const genRandom = document.getElementById("auto_generate");
    genRandom.addEventListener('click', e => {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        uuid = uuid.substr(0, 8);
        document.getElementById("project_ID").value = uuid;
    });


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

    /*
    <style>

    </style>
    <section>
    <p style="text-align: left;">Good Day {{to_name}},</p>
    <p style="text-align: left;">We trust all is well!</p>
    <p style="text-align: left;">{{message}}</p>
    <p style="text-align: left;">If you have any other questions, feel free to reply to this email and we'll gladly help!</p>
    <p style="text-align: left;">Best wishes,<br />www.jaxifysoftware.com</p>

    </section>
    */