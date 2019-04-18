$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCGj8S4SfLrnDfAQmI1E_4ugpujTWYBufI",
        authDomain: "https://tech-english-8cef7.firebaseapp.com/",
        databaseURL: "https://tech-english-8cef7.firebaseio.com/",
        projectId: "tech-english-8cef7"
    }
    firebase.initializeApp(config)

    //    var allwords = "ability,able,about,above,accept,according,account,across,act,action,activity,actually,add,address,administration,admit,adult,affect,after,again,against,age,agency,agent,ago,agree,agreement,ahead,air,all,allow,almost,alone,along,already,also,although,always,American,among,amount,analysis,and,animal,another,answer,any,anyone,anything,appear,apply,approach,area,argue,arm,around,arrive,art,article,artist".split(',')

    var db = firebase.database()
    var enter = false
    var words = []
    var current_word = ""

    if (localStorage.getItem("user")) {
        var user = JSON.parse(localStorage.getItem("user"))
        var name = user.name
        var pass = user.pass

        db.ref("students").once("value", function (snap) {
            var obj = snap.val()
            for (i in obj) {
                if (name == obj[i].name && pass == obj[i].pass) {
                    key = i
                    enter = true
                    break
                }
            }
            if (enter == false) {
                alert("Wrong username or password.")
            } else {
                $("#user-name span").text(name)
                $("#log-btns").addClass("d-none")
                $("#profil-btns").removeClass("d-none")
                $(".student-login").addClass("d-none")

                after_login()
            }
        })
    }

    function after_login() {
        db.ref("students/" + key).on("value", function (snap) {
            var user = snap.val()
            words = user.unknownwords
        })
    }

    db.ref("students").on("value", function (snap) {
        var students = snap.val()
        var arr = []

        for (i in students) {
            arr.push(students[i])
        }

        for (let i = 1; i < arr.length; i++) {
            while (i > 0 && arr[i].rating > arr[i - 1].rating) {
                let x = arr[i]
                arr[i] = arr[i - 1]
                arr[i - 1] = x
                i--
            }
        }

        $("#table-body").empty()
        for (let i = 0; i < arr.length; i++) {
            let column = $("<tr>").append($("<th scope='row'>").text(i + 1))
            column.append($("<td>").text(arr[i].name))
            column.append($("<td>").text(arr[i].rating))
            $("#table-body").append(column)
        }

        /*        for (i in students) {
                    db.ref("students/"+i).update({
                        knownwords: [],
                        unknownwords: allwords
                    })
                }*/

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

        db.ref("students").once("value", function (snap) {
            var obj = snap.val()
            for (i in obj) {
                if (name == obj[i].name && pass == obj[i].pass) {
                    key = i
                    enter = true
                    break
                }
            }
            if (enter == false) {
                alert("Wrong username or password.")
            } else {
                $("#user-name span").text(name)
                $("#log-btns").addClass("d-none")
                $("#profil-btns").removeClass("d-none")
                $(".student-login").addClass("d-none")

                user = {
                    name,
                    pass
                }

                localStorage.setItem("user", JSON.stringify(user))

                after_login()
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

    $(".student-login #close").on("click", function () {
        $(".student-login").addClass("d-none")
    })

    $(".teacher-login #close").on("click", function () {
        $(".teacher-login").addClass("d-none")
    })

    $(".logout-btn").on("click", function () {
        $("#log-btns").removeClass("d-none")
        $("#profil-btns").addClass("d-none")
        localStorage.removeItem("user")
    })

    $("#wg-btn").on("click", function () {
        if ($("#word-game").data("condition") == "none") {
            $("#word-game").removeClass("d-none")
            $("#word-game").data("condition", "display")
        } else if ($("#word-game").data("condition") == "display") {
            $("#word-game").addClass("d-none")
            $("#word-game").data("condition", "none")
        }
    })

    $("#next-word").on("click", function () {
        $("#next-word").addClass("d-none")
        $("#letters").empty()
        current_word = words[Math.floor(Math.random() * words.length)]
        console.log(current_word)
        letters = current_word.split("")
        len = letters.length
        for (let i = 0; i < letters.length; i++) {
            let span = $("<span id='" + i + "'>").text("_ ")
            $("#letters").append(span)
        }
    })

    function lose_func() {
        alert("you lose")
    }

    function win_func() {
        db.ref("students/"+key).once("value", function(snap) {
            var rating = snap.val().rating+5

            db.ref("students/"+key).update({
                rating
            })
            $("#next-word").removeClass("d-none")

        })
    }

    function key_click(event) {

        var chanses = 6
        var guesses = []
        var right_guesses = []

        var guess = String.fromCharCode(event.keyCode).toLowerCase()

        if (guesses.indexOf(guess) === -1 && letters.indexOf(guess) === -1) {
            if (chanses > 1) {
                chanses--
                guesses.push(guess)
                let guess_space = document.querySelector("#guesses")
                if (guesses.length > 1) {
                    guess_space.innerHTML += ", " + guess
                } else {
                    guess_space.innerHTML += guess
                }
                chanses_space = document.querySelector("#chanses")
                chanses_space.innerHTML = chanses
            } else {
                lose_func()
            }

            // Dogru harf girildiginde
        } else if (right_guesses.indexOf(guess) === -1 && letters.indexOf(guess) !== -1) {
            right_guesses.push(guess)
            var i = 0;
            while (letters.indexOf(guess, i) >= 0) {
                var a = letters.indexOf(guess, i)
                $("#"+a).text(guess)
                len--
                i = a + 1
            }
            if (len === 0) {
                win_func()
            }
        }


    }

    window.onkeypress = key_click
})