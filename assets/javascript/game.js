$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCGj8S4SfLrnDfAQmI1E_4ugpujTWYBufI",
        authDomain: "https://tech-english-8cef7.firebaseapp.com/",
        databaseURL: "https://tech-english-8cef7.firebaseio.com/",
        projectId: "tech-english-8cef7"
    }
    firebase.initializeApp(config)

    var db = firebase.database()

    db.ref("students").on("value", function (snap) {
        var students = snap.val()
        var arr = []

        for (i in students) {
            arr.push(students[i])
        }

        for (let i = 1; i < arr.length; i++) {
            while (i>0 && arr[i].rating > arr[i - 1].rating) {
                let x = arr[i]
                arr[i] = arr[i - 1]
                arr[i - 1] = x
                i--
            }
        }

        $("#table-body").empty()
        for (let i=0; i<arr.length; i++) {
            let column = $("<tr>").append($("<th scope='row'>").text(i+1))
            column.append($("<td>").text(arr[i].name))
            column.append($("<td>").text(arr[i].rating))
            $("#table-body").append(column)
        }

    })

    $(".student-login-btn").on("click", function () {
        $(".student-login").removeClass("d-none")
        $(".teacher-login").addClass("d-none")
    })

    $("#stud-up-btn").on("click", function () {
        $("#stud-up-div").removeClass("d-none")
        $("#stud-in-div").addClass("d-none")
    })

    $("#stud-in-btn").on("click", function () {
        $("#stud-up-div").addClass("d-none")
        $("#stud-in-div").removeClass("d-none")
    })

    $(".teacher-login-btn").on("click", function () {
        $(".teacher-login").removeClass("d-none")
        $(".student-login").addClass("d-none")
    })

    $("#teacher-form").on("submit", function (event) {
        event.preventDefault()
        let name = $(".teacher-login #name").val()
        let pass = $(".teacher-login #pass").val()
        console.log(name, pass)

        db.ref("teachers").once("value", function (snap) {
            var obj = snap.val()
            var enter = false
            for (i in obj) {
                if (name == obj[i].name && pass == obj[i].pass) {
                    console.log("girdin")
                    enter = true
                    break
                }
            }
            if (enter == false) {
                console.log("Hesabin yoxdu")
            }
        })
    })

    $("#sign-in-form").on("submit", function (event) {
        event.preventDefault()
        let name = $("#sign-in-form #name").val()
        let pass = $("#sign-in-form #pass").val()
        console.log(name, pass)

        db.ref("students").once("value", function (snap) {
            var obj = snap.val()
            var enter = false
            for (i in obj) {
                if (name == obj[i].name && pass == obj[i].pass) {
                    console.log("girdin")
                    enter = true
                    break
                }
            }
            if (enter == false) {
                console.log("Hesabin yoxdu")
            }
        })
    })

    $("#sign-up-form").on("submit", function (event) {
        event.preventDefault()
        let name = $("#sign-up-form #name").val()
        let pass = $("#sign-up-form #pass").val()
        console.log(name, pass)

        db.ref("students").push({
            name,
            pass,
            rating: 0
        })
    })

})