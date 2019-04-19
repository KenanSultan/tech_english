$(document).ready(function () {
    function firebase_init() {
        var config = {
            apiKey: "AIzaSyCGj8S4SfLrnDfAQmI1E_4ugpujTWYBufI",
            authDomain: "https://tech-english-8cef7.firebaseapp.com/",
            databaseURL: "https://tech-english-8cef7.firebaseio.com/",
            projectId: "tech-english-8cef7"
        }
        firebase.initializeApp(config)
        return firebase.database()
    }

    var db = firebase_init()
    var words = "ability,able,about,above,accept,according,account,across,act,action,activity,actually,add,address,administration,admit,adult,affect,after,again,against,age,agency,agent,ago,agree,agreement,ahead,air,all,allow,almost,alone,along,already,also,although,always,among,amount,analysis,and,animal,another,answer,any,anyone,anything,appear,apply,approach,area,argue,arm,around,arrive,art,article,artist".split(',')
    var enter = false

    function reset_function() {
        game = false
        current_word = ""
        chanses = 6
        guesses = []
        right_guesses = []
        $("#chanses span").text(chanses)
        $("#guesses").text("")
    }

    reset_function()

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

    $(".student-login #close").on("click", function () {
        $(".student-login").addClass("d-none")
    })

    $(".teacher-login #close").on("click", function () {
        $(".teacher-login").addClass("d-none")
    })

    $("#word-game #close").on("click", function() {
        reset_function()
        $("#word-game").addClass("d-none")
    })

    $(".logout-btn").on("click", function () {
        $("#log-btns").removeClass("d-none")
        $("#profil-btns").addClass("d-none")
        localStorage.removeItem("user")
        reset_function()
    })

    $("#wg-btn").on("click", function () {
        $("#word-game").removeClass("d-none")
        $("#word-game").data("condition", "display")
        game = true
        start_game()
    })

    $("#next-word").on("click", function () {
        $("#next-word").addClass("d-none")
        game = true
        start_game()
    })

    $("#teacher-form").on("submit", function (event) {
        event.preventDefault()
        let name = $(".teacher-login #name").val()
        let pass = $(".teacher-login #pass").val()

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

    function lose_func() {
        reset_function()
        alert("you lose")
        $("#next-word").removeClass("d-none")
    }

    function win_func() {
        if (enter == true) {
            db.ref("students/" + key).once("value", function (snap) {
                var rating = snap.val().rating + 1

                db.ref("students/" + key).update({
                    rating
                })
            })
        } else {
            alert("you win")
        }
        reset_function()
        $("#next-word").removeClass("d-none")
    }

    function start_game() {

        $("#letters").empty()
        current_word = words[Math.floor(Math.random() * words.length)]
        console.log(current_word)
        letters = current_word.split("")
        len = letters.length
        for (let i = 0; i < letters.length; i++) {
            let span = $("<span id='" + i + "'>").text("_ ")
            $("#letters").append(span)
        }

        function key_click(event) {
            if (game) {
                var guess = String.fromCharCode(event.keyCode).toLowerCase()

                if (guesses.indexOf(guess) === -1 && letters.indexOf(guess) === -1) {
                    if (chanses > 1) {
                        chanses--
                        guesses.push(guess)
                        let eski = $("#guesses").text()
                        $("#guesses").text(""+ eski + guess + ", ")
                        $("#chanses span").text(chanses)
                    } else {
                        lose_func()
                    }

                    // Dogru harf girildiginde
                } else if (right_guesses.indexOf(guess) === -1 && letters.indexOf(guess) !== -1) {
                    right_guesses.push(guess)
                    var i = 0;
                    while (letters.indexOf(guess, i) >= 0) {
                        var a = letters.indexOf(guess, i)
                        $("#" + a).text(guess)
                        len--
                        i = a + 1
                    }
                    if (len === 0) {
                        win_func()
                    }
                }
            }

        }
        window.onkeypress = key_click
    }
})