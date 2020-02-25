$(document).ready(() => {
    $("#deleteUser").on("click", function() {
        confirm("Are you sure you want to permanently delete your account?");
    });

    $("#deleteCampground").on("click", function() {
        confirm("Are you sure you want to delete this campground?");
    });

    $(".btn-delete").on("click", function() {
        confirm("Are you sure you want to delete it?");
    });

    // Campgrounds Index
    $("#sidebarOpen").on("click", function() {
        $(".sidebar").addClass("open");
        $(".div-overlay").addClass("active");
    });

    $(".dismiss, .div-overlay").on("click", function() {
        $(".sidebar").removeClass("open");
        $(".div-overlay").removeClass("active");
    });
});
