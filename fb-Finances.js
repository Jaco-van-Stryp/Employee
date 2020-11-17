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


let AllEmployees = []

window.onload = function() {
    startLoading();
    let temp = [];
    userData = db.collection("emp_data").doc("emps");
    userData.get().then(function(doc) {
        if (doc.exists) {
            temp = doc.get("Employees");
            AllEmployees = temp;
            getPersOfTotal(0.1, AllEmployees);
        } else {
            stopLoading();
        }

    })
}

function loadProfiles() {
    for (var i = 0; i < AllEmployees.length; i++) {
        AddProject(AllEmployees[i]);
    }
    stopLoading();

}

function setSearchQuery() {
    var info = getCookie("user")
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
let Employees = [];
let fname, semail, photoUrl, uid, emailVerified;


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
    let table = document.getElementById("mainTable");
    table.innerHTML = "<tr><th>Employee Email</th><th>Total Projects Completed</th><th>Payout Due</th><th>Confirm Payment</th></tr>";
    for (var i = 0; i < PredictionMonths.length; i++) {

        table.innerHTML += "<tr><td>" + PredictionMonths[i].EmpEmail + "</td><td>" + PredictionMonths[i].TotalCompletedProjects + "</td><td>R" + (1 * PredictionMonths[i].PayoutDue).toFixed(2) + "</td><td><button id=\"" + PredictionMonths[i].EmpEmail + "\" onclick=\"sendMail(\'" + PredictionMonths[i].EmpEmail + "\',\'" + PredictionMonths[i].PayoutDue + "\',\'" + PredictionMonths[i].TotalCompletedProjects + "\')\">Confirm Payment</button></td><tr>";
        sumMonth += PredictionMonths[i].PayoutDue
        document.getElementById("user_display_name").innerHTML = "Payout Due This Month R" + sumMonth.toFixed(2)
    }
    stopLoading();

}

function signOut() {
    firebase.auth().signOut();
    document.location = "./index.html"
}




function sendMail(emailAddress, payout, total) {
    emailjs.send("service_2hqig97", "template_7u9h78e", {
        from_name: "Salary - Jaxify Software",
        to_name: "Developer",
        message: "This Email is to inform you that you've been paid for your services. You've earned a total of R" + (1 * payout).toFixed(2) + " This Month and completed a total of " + total + " projects! Thank you for working at Jaxify Software",
        email: emailAddress,
        reply_to: "sales@jaxifysoftware.com",
    });
    document.getElementById(emailAddress).innerHTML = "Email Sent"
}

function doesIDExist(id) {
    for (var i = 0; i < Jobs.length; i++) {
        if (Jobs[i].ProjectID == id) {
            return true;
        }
    }
    return false;
}
let final = 0;

function getPersOfTotal(pers, bigObj) {
    let tempObj = [];
    let next = false;
    let counter = 0;
    for (var i = 0; i < bigObj.length; i++) {
        userData = db.collection("projects").doc(bigObj[i]);
        userData.get().then(function(doc) {
            if (doc.exists) {
                tempObj = doc.get("object");
                if (tempObj.length >= 1) {
                    for (var x = 0; x < tempObj.length; x++) {
                        final = final + (pers * tempObj[x].ClientInvoiced)
                    }
                }
                stopLoading();
            } else {
                stopLoading();
            }
        }).then(function(data) {
            counter++;
            if (counter == bigObj.length) {
                loadProfiles();
            }
        })

    }



}

function AddProject(UserPushEmail) {
    let EmployeeManagementSystemExtra = 0;
    let push = false;
    let tempObj = [];
    let userData;
    userData = db.collection("projects").doc(UserPushEmail);
    userData.get().then(function(doc) {
        if (doc.exists) {
            tempObj = doc.get("object");

            push = true;
            stopLoading();
        } else {
            stopLoading();
        }
        let total = 0;
        let sumPayout = 0;

        for (var i = 0; i < tempObj.length; i++) {

            const date1 = new Date(tempObj[i].DateCompleted);
            const d = new Date();


            if (date1.getFullYear() == d.getFullYear() && date1.getMonth() == d.getMonth() && date1.getDay() <= 25) {
                total++;
                sumPayout += (0.7 * tempObj[i].ClientInvoiced)
            }

        }
        if (UserPushEmail == "jacovanstryp@gmail.com") {
            sumPayout += final;
        }


        if (push == true) {
            Employees.push({
                EmpEmail: UserPushEmail,
                TotalCompletedProjects: total,
                PayoutDue: sumPayout,
            })
        }
        loadTable(Employees);
    })
}

stopLoading();

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