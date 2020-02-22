$(document).ready(() => {
    $("#deleteCampground").on("click", () =>
        confirm("Are you sure you want to delete this campground?")
    );
});
