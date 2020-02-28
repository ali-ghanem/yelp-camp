$(document).ready(() => {
    function showEditForm(editButton) {
        showEditForm.called = true;

        let clickedButton = $(editButton);
        let campgroundId = clickedButton.attr("data-campground-id");
        let commentId = clickedButton.attr("data-comment-id");
        let container = clickedButton.parents(".comment-container");
        let commentBody = container.find(".comment-body");
        let oldComment = commentBody.find(".comment-text");
        let text = oldComment.text();

        let formAction = `/campgrounds/${campgroundId}/comments/${commentId}?_method=PUT`;
        let textInput = `<input class="form-control my-1" type="text" name="comment" value="${text}">`;
        let saveInput = `<input class="btn btn-primary btn-sm" type="submit" value="Save" >`;
        let cancelButton = `<button class="btn btn-secondary btn-sm btn-cancel-edit" type="button" >Cancel</button>`;
        let form = `<form class="edit-form" action="${formAction}" method="post" > ${textInput}  ${saveInput} ${cancelButton} </form> `;

        commentBody.append(form);
        
        oldComment.hide();
    }

    function cancelEdit() {
        let container = $(this).parents(".comment-container");
        let form = container.find(".edit-form");
        form.remove();
        let oldComment = container.find(".comment-body .comment-text");
        oldComment.show();
        showEditForm.called = false;
    }

    $(".comments-container").on("click", ".btn-edit-comment", function() {
        if (!showEditForm.called) {
            showEditForm(this);
        }
    });

    $(".comments-container").on("click", ".btn-cancel-edit", cancelEdit);
});
