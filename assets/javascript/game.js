$(".student-login-btn").on("click", function() {
    $(".student-login").removeClass("d-none")
    $(".teacher-login").addClass("d-none")
})

$(".teacher-login-btn").on("click", function() {
    $(".teacher-login").removeClass("d-none")
    $(".student-login").addClass("d-none")
})