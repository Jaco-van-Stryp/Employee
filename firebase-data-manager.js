(function() {
    // Our web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyA9979-Um1TwPLskZr72_2bfiEJDpt2jSM",
        authDomain: "jaxify-software-administration.firebaseapp.com",
        databaseURL: "https://jaxify-software-administration.firebaseio.com",
        projectId: "jaxify-software-administration",
        storageBucket: "jaxify-software-administration.appspot.com",
        messagingSenderId: "202323429712",
        appId: "1:202323429712:web:b0ac3661a5b8a00a330455",
        measurementId: "G-HDPSLJ18QK"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    //Initialize Firestore
    const db = firebase.firestore();
    var fbuser = "";
    firebase.auth().onAuthStateChanged(firebaseUser => {
        startLoading();

        if (firebaseUser) {
            userData = db.collection("employees").doc(firebaseUser.email);
            userData.get().then(function(doc) {
                if (doc.exists) {
                    auth_role = (doc.get("emp_job"));
                    if (auth_role != "Director") {
                        document.location = 'index.html';

                    } else {
                        stopLoading();
                        fbuser = firebaseUser.email;

                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    document.location = 'index.html';


                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
                document.location = 'index.html';


            });
        } else {

            document.location = 'index.html';
            stopLoading();
        }
    });


    var newUser = false;
    const hireEmp = document.getElementById("btn_hire_new_emp");
    const regProject = document.getElementById("final_add_project");

    const developerMode = document.getElementById("dev_mode");
    developerMode.addEventListener('click', e => {
            document.location = "development.html"
        })
        //Creating new employee
    hireEmp.addEventListener('click', e => {

        startLoading();
        const email = document.getElementById("emp_email").value;
        const password = document.getElementById('emp_password').value;
        const employee_ID = document.getElementById('emp_id').value;
        const name = document.getElementById('emp_name').value;
        const surname = document.getElementById('emp_surname').value;
        const earn_start = document.getElementById('earn_start').value;
        const earn_stop = document.getElementById('earn_stop').value;
        console.log(email)
        var emp_role = "Developer" //Todo Add button Switches
        var fine = true;
        var auth_role = "";

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        sendMail(name + " " + surname, "Welcome To The Jaxify Software Team! Please Use The Following Login Information To Access Your Employee Dashboard: Email: " + email + " Password: " + password + " - You can use the following link to access this dashboard: employee.jaxifysoftware.com", email, "jaxifybusiness@gmail.com")

        db.collection("employees").doc(email).set({
                id: employee_ID,
                email: email,
                name: name,
                surname: surname,
                emp_job: emp_role,
                salary_pers_min: earn_start,
                salary_pers_max: earn_stop,
                active_projects: 0,
                completed_projects: 0,
                cur_prj_id: "N/A",
                status: "Hired",
                date_hired: today,
                hired_by: fbuser,

            }).then(function() {

                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage)

                });


            })
            .catch(function(error) {

            });

        db.collection("emp_data").doc("emps").update({

                Employees: firebase.firestore.FieldValue.arrayUnion(email),

            }).then(function() {

                db.collection('projects').doc(email).set({
                        object: [],
                    }).then(function() {})
                    .catch(function(error) {

                    });

                //    firebase.auth().signOut().then(function() {
                // window.location.replace("https://employee.jaxifysoftware.com");
                //     }).catch(function(error) {});
            })
            .catch(function(error) {

            });
        stopLoading();


    });
}());


function sendMail(client, Themessage, emailAddress, devEmail) {
    emailjs.send("service_2hqig97", "template_7u9h78e", {
        from_name: "Onboarding - Jaxify Software",
        to_name: client,
        message: Themessage,
        email: emailAddress,
        reply_to: devEmail,
    });

}


const signoutbtn = document.getElementById("sign_out_user");
signoutbtn.addEventListener('click', e => {
    firebase.auth().signOut().then(function() {
        window.location = 'index.html';
        // console.log("Signed Out")
    }).catch(function(error) {
        alert.window.log("Could Not Sign You Out")
    });
});


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