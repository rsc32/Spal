/**
 * Created by deep on 12/9/16.
 */

function NewRigchecksController() {

    var that = this;

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.saveData = function () {


        var comment = $('#rig-check-comment').val();
        var fieldValues = [];

        $("td label").each(function (i, row) {
            var checkbox = $(row).find('input');
            var selected = checkbox.is(':checked');
            var value = checkbox.val().split(',');

            var obj = {
                checklistId: value[0],
                compartmentId: value[1],
                fieldId: value[2],
                isSelected: selected
            };

            //data.fieldValues = JSON.stringify(obj);
            fieldValues[i] = JSON.stringify(obj);

            console.log(value + "," + selected);

        });


        console.log(fieldValues);

        $.ajax({
            url: window.location.href,
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                data: JSON.stringify({
                    comment: comment,
                    fieldValues: JSON.stringify(fieldValues)
                })
            },
            success: function (data) {

                window.location.href = "/rigchecks";

            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error saving rigcheck');
            }
        });
    }
}


$(document).ready(function () {

    var controller = new NewRigchecksController();

    document.querySelector('#save-btn').addEventListener('click', function () {
        controller.saveData();
    });

});
