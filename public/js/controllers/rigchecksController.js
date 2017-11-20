/**
 * Created by deep on 12/8/16.
 */

function RigchecksController() {

    var that = this;

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.checklistSelected = function () {
        var checklistId = $('input[name = "checklist-options"]:checked').val();
        if (!checklistId) {
            that.showToast('Please select a checklist');
            return;
        }

        window.location.href = "/rigchecks/new/" + checklistId;

    };
}