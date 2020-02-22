$(document).ready(() => {
    $("#deleteCampground").on("click", () =>
        confirm("Are you sure you want to delete this campground?")
    );

    $(".btn-delete").on("click", () =>
        confirm("Are you sure you want to delete it?")
    );
});
