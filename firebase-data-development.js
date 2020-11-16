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
    table.innerHTML = "<tr><th>Date Started</th><th>Project Type</th><th>Description</th><th>Status</th><th>Client Email</th><th> Payout </th> <th>Due Date</th><th>View Invoice</th><th>Update Status</th><th>Delete Project</th><th>Edit Website</th></tr>";
    for (var i = 0; i < PredictionMonths.length; i++) {

        if (PredictionMonths[i].Status == "Website Completed") {
            const date1 = new Date(PredictionMonths[i].DateCompleted);
            const d = new Date();
            console.log(date1)
            console.log(d)

            if (date1.getFullYear() != d.getFullYear() || date1.getMonth() != d.getMonth() || date1.getDay() > 25) {

            } else {
                table.innerHTML += "<tr><td>" + PredictionMonths[i].DateStarted + "</td><td>" + PredictionMonths[i].ProjectType + "</td><td>" + PredictionMonths[i].ProjectInstructions + "</td><td>" + PredictionMonths[i].Status + "</td><td><button onclick=\"document.location=\'mailto:" + PredictionMonths[i].ClientEmail + "\'\">" + "Send Mail To Client" + "</a></td><td>R" + (0.7 * PredictionMonths[i].ClientInvoiced).toFixed(2) + "</td><td>" + PredictionMonths[i].DueDate + "</td><td><button onclick=\"document.location=\'" + PredictionMonths[i].WaveURL + "\'\">View Invoice</button></td><td><button onclick=\"updateStatus('" + PredictionMonths[i].ProjectID + "')\">Update Project Status</button></td><td><button style=\"background-color: red;\" onclick=\"delProject(\'" + PredictionMonths[i].ProjectID + "\')\">Delete Project</button></td><td><button style=\"background-color: purple;\" onclick=\"document.location=\'https://" + PredictionMonths[i].Domain + "/wp-admin\'\">Edit Website</button></td></tr>";
                if (PredictionMonths[i].Status == "Website Completed") {
                    sumMonth += (0.7 * PredictionMonths[i].ClientInvoiced)
                }
            }
        } else {
            table.innerHTML += "<tr><td>" + PredictionMonths[i].DateStarted + "</td><td>" + PredictionMonths[i].ProjectType + "</td><td>" + PredictionMonths[i].ProjectInstructions + "</td><td>" + PredictionMonths[i].Status + "</td><td><button onclick=\"document.location=\'mailto:" + PredictionMonths[i].ClientEmail + "\'\">" + "Send Mail To Client" + "</a></td><td>R" + (0.7 * PredictionMonths[i].ClientInvoiced).toFixed(2) + "</td><td>" + PredictionMonths[i].DueDate + "</td><td><button onclick=\"document.location=\'" + PredictionMonths[i].WaveURL + "\'\">View Invoice</button></td><td><button onclick=\"updateStatus('" + PredictionMonths[i].ProjectID + "')\">Update Project Status</button></td><td><button style=\"background-color: red;\" onclick=\"delProject(\'" + PredictionMonths[i].ProjectID + "\')\">Delete Project</button></td><td><button style=\"background-color: purple;\" onclick=\"document.location=\'https://" + PredictionMonths[i].Domain + "/wp-admin\'\">Edit Website</button></td></tr>";

            if (PredictionMonths[i].Status == "Website Completed") {
                sumMonth += (0.7 * PredictionMonths[i].ClientInvoiced)
            }
        }

    }
    document.getElementById("user_display_name").innerHTML = "Due To You This Month: R" + sumMonth.toFixed(2)
}


function delProject(id) {
    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            sendMail(Jobs[i].ClientName, "We're sad to see you go! This is just an update to let you know that your website has been canceled, and will no longer be worked on. If you believe this is a mistake or would like to continue working with us, please let us know!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
            Jobs.splice(Jobs[i])
        }
        convertToFireBase(Jobs);
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
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that we've sent you an invoice for your website: " + Jobs[i].Domain + "! It can be viewed here - " + Jobs[i].WaveURL + "\nOnce We Receive Payment, you'll receive a notification!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);

            } else if (status == "Client Invoiced") {
                Jobs[i].Status = "Client Paid";
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that we've received your payment of R" + Jobs[i].ClientInvoiced + " for your website: " + Jobs[i].Domain + "! We will keep you updated!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
            } else if (status == "Client Paid") {
                Jobs[i].Status = "Domain Purchased";
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that your domain:" + Jobs[i].Domain + " has been reserved as yours, we will begin the process of linking it to your website!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
            } else if (status == "Domain Purchased") {
                Jobs[i].Status = "DNS A Record / Nameservers Changed To BlueHost";
            } else if (status == "DNS A Record / Nameservers Changed To BlueHost") {
                Jobs[i].Status = "Website Work Started";
                sendMail(Jobs[i].ClientName, "We just wanted to let you know that your website domain " + Jobs[i].Domain + " is now live on the public internet, we're still building your website and will let you know when everything is completed!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
            } else if (status == "Website Work Started") {
                Jobs[i].Status = "Website Completed";
                sendMail(Jobs[i].ClientName, "We have Great News! Your website " + Jobs[i].Domain + " is all completed and ready for you and your customers to use! Should you have any questions or want anything to change, please feel free to reply to this email! Should you want a course on maintaining your own website, we explain everything in detail here on how to manage, maintain and build your own pages! - https://www.jaxifysoftware.com/shop/course/ - To sign into the dashboard of your website, please use the following address " + Jobs[i].Domain + "/wp-admin - You'll click on forgot password, and reset it with your email account. It was really nice working with you!", Jobs[i].ClientEmail, Jobs[i].DeveloperEmail);
                let d = new Date;
                Jobs[i].DateCompleted = d;
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
    var projectStatus = "Project Registered"
    var instructions = document.getElementById("project_instructions").value
    var dueDate = document.getElementById("project_due_date").value
    var wave = document.getElementById("invoice_URL").value
    var address = document.getElementById("domain").value


    today = mm + '/' + dd + '/' + yyyy;

    if (projID == "" || projID.length <= 7 || developer == "" || clientName == "" || clientEmail == "" || clientInvoiced == "" || projectStatus == "" || instructions == "" || dueDate == "") {
        alert("Please make sure all info is filled in correctly")
    } else {
        var d = new Date();
        let sDate = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();
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
            WaveURL: wave,
            Domain: address,
        })
        document.getElementById("project_ID").value = "";
        document.getElementById("project_developer_email").value = "";
        document.getElementById("project_client_name").value = "";
        document.getElementById("project_client_email").value = "";
        document.getElementById("project_client_invoiced").value = "";
        document.getElementById("project_instructions").value = "";
        document.getElementById("project_due_date").value = "";
        document.getElementById("invoice_URL").value = "";
        document.getElementById("domain").value = "";

        convertToFireBase(Jobs);
        window.scrollTo(0, 0);
        alert("New Project Added Successfully")

        sendMail(clientName, "We just wanted to let you know that we've started work on your website: " + address + "! We will keep you updated at all times. We Estimate your website will be completed on " + dueDate + " or earlier!", clientEmail, developer);
        sendMail("Developer", "A new website project has been assigned to your name --> " + address + "! Please ensure you complete it before " + dueDate + " or earlier! Instructions are as follows:" + instructions + ". You will be paid: R" + (0.7 * clientInvoiced).toFixed(2) + " when the project is completed. Please view and update the project as you go via employee.jaxifysoftware.com", developer, "jaxifybusiness@gmail.com");
    }

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