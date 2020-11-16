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

        });;
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
    convertToFireBase(streamData);
    let PredictionMonths = [];
    for (var x = 0; x < streamData.length; x++) {
        PredictionMonths.push((streamData[x]))
    }
    if (streamData.length > 0) {
        setSearchQuery();
    }
    console.log(PredictionMonths)
    let table = document.getElementById("mainTable");
    table.innerHTML = "<tr><th>Project ID</th><th>Project Type</th><th>Description</th><th>Status</th><th>Client Email</th><th> Payout </th> <th>Due Date</th><th>Update Status</th></tr>";
    for (var i = 0; i < PredictionMonths.length; i++) {
        table.innerHTML += "<tr><td>" + PredictionMonths[i].ProjectID + "</td><td>" + PredictionMonths[i].ProjectType + "</td><td>" + PredictionMonths[i].ProjectInstructions + "</td><td>" + PredictionMonths[i].Status + "</td><td><button onclick=\"document.location=\'mailto:" + PredictionMonths[i].ClientEmail + "\'\">" + "Send Mail To Client" + "</a></td><td>R" + (0.7 * PredictionMonths[i].ClientInvoiced).toFixed(2) + "</td><td>" + PredictionMonths[i].DueDate + "</td><td><button onclick=\"updateSatus(" + PredictionMonths[i].ProjectID + ")\">Update Project Status</button></th></tr>";
        sumMonth += (0.7 * PredictionMonths[i].ClientInvoiced)
    }
    document.getElementById("user_display_name").innerHTML = "Due To You This Month: R" + sumMonth.toFixed(2)
}



function updateSatus(id) {
    for (var i = 0;)
}

function AddProject() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var projID = "blank"
    projID = document.getElementById("project_ID").value
    var developer = document.getElementById("project_developer_email").value
    var manager = document.getElementById("project_manager_email").value
    var projectType = "Website"
    var reference = document.getElementById("project_reference_email").value
    var clientName = document.getElementById("project_client_name").value
    var clientEmail = document.getElementById("project_client_email").value
    var clientInvoiced = document.getElementById("project_client_invoiced").value
    var projectStatus = "Project Registered"
    var instructions = document.getElementById("project_instructions").value
    var dueDate = document.getElementById("project_due_date").value
    today = mm + '/' + dd + '/' + yyyy;

    if (projID == "" || projID.length <= 7 || developer == "" || manager == "" || reference == "" || clientName == "" || clientEmail == "" || clientInvoiced == "" || projectStatus == "" || instructions == "" || dueDate == "") {
        alert("Please make sure all info is filled in correctly")
    } else {

        Jobs.push({
            ProjectID: projID,
            ProjectType: projectType,
            DeveloperEmail: developer,
            ManagerEmail: manager,
            ReferenceEmail: reference,
            ClientName: clientName,
            ClientEmail: clientEmail,
            ClientInvoiced: clientInvoiced,
            Status: projectStatus,
            ProjectInstructions: instructions,
            DueDate: dueDate,
        })
        loadTable(Jobs)
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