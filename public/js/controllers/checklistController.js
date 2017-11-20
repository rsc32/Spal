/**
 * Created by deep on 11/30/16.
 */

function ChecklistController() {

    let that = this;

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.validateForm = function () {
        if ($('#tf-checklist-title').val() == '') {
            this.showToast('Title cannot be empty');
            return false;
        }

        var ambulanceId = null;
        ambulanceId = $('input[name = "ambulance-options"]:checked').val();
        if (ambulanceId == null) {
            this.showToast('Select an ambulance');
            return false;
        }

        return true;
    };

    this.attemptCreate = function () {

        var isValidated = this.validateForm();
        //console.log("isvalid" + isValidated);

        if (isValidated) {

            var title = $('#tf-checklist-title').val();

            var ambulanceId = null;
            ambulanceId = $('input[name = "ambulance-options"]:checked').val();
            if (ambulanceId == null) {
                this.showToast('Select an ambulance');
                return false;
            }

            $.ajax({
                url: "/checklists",
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    title: title,
                    ambulanceId: ambulanceId
                },
                success: function (data) {
                    location.reload();
                    return;
                    that.showToast('Successfully created new checklist ' + data.title);

                    var new_card = document.createElement('div');
                    new_card.classList.add("checklist-card");
                    new_card.classList.add("mdl-shadow--2dp");
                    new_card.classList.add("mdl-color--white");
                    new_card.classList.add("mdl-cell");
                    new_card.classList.add("mdl-card");
                    new_card.classList.add("mdl-card--12-col");

                    //add new list item to the screen
                    $('#main-content-container').append(new_card);

                    $('#tf-title').val(null);
                    $('ambulance-options').val(null);

                    var emptyText = $('#empty-text');
                    if (emptyText) emptyText.remove();
                },
                error: function (jqXHR) {
                    console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                    that.showToast('Error created new checklist');
                }
            });
        }

    };

    this.addCompartment = function (checklistId) {

        var name = $('#tf-compartment-name').val();
        if (!name) {
            that.showToast('Title cannot be empty.');
            return false;
        }

        $.ajax({
            url: "/checklists/" + checklistId + "/compartments",
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                checklistId: checklistId,
                name: name
            },
            success: function (data) {
                //console.log(data);
                location.reload();

                //$('#checklist-' + data.id).remove();

                that.showToast("Successfully created compartment");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error adding a compartment');
            }
        });
    };

    this.addField = function (checklistId, compartmentId) {

        var name = $('#tf-field-name').val();
        if (!name) {
            that.showToast('Title cannot be empty.');
            return false;
        }

        $.ajax({
            url: "/checklists/" + checklistId + "/compartments/" + compartmentId,
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                name: name
            },
            success: function (data) {
                //console.log(data);
                location.reload();

                //$('#checklist-' + data.id).remove();

                that.showToast("Successfully created compartment");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error adding a field');
            }
        });
    };

    this.deleteChecklist = function (checklistId) {
        $.ajax({
            url: "/checklists/" + checklistId,
            type: "DELETE",
            contentType: "application/x-www-form-urlencoded",
            data: {
                //checklistId: checklistId
            },
            success: function (data) {
                //console.log(data);
                //location.reload();

                $('#checklist-' + data.id).remove();

                that.showToast("Successfully deleted checklist");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error deleting the checklist');
            }
        });
    };

    this.deleteCompartment = function (checklistId, compartmentId) {
        $.ajax({
            url: "/checklists/" + checklistId + "/compartments/" + compartmentId,
            type: "DELETE",
            contentType: "application/x-www-form-urlencoded",
            data: {
                //checklistId: checklistId
            },
            success: function (data) {
                location.reload();
                //console.log(data);

                //$('#checklist-' + data.id).remove();

                that.showToast("Successfully deleted checklist");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error deleting the compartment');
            }
        });
    };

    this.deleteField = function (checklistId, compartmentId, fieldId) {
        $.ajax({
            url: "/checklists/" + checklistId + "/compartments/" + compartmentId + "/fields/" + fieldId,
            type: "DELETE",
            contentType: "application/x-www-form-urlencoded",
            data: {
                //checklistId: checklistId
            },
            success: function (data) {
                //console.log(data);
                location.reload();

                $('#checklist-' + data.id).remove();

                that.showToast("Successfully deleted checklist");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error deleting field');
            }
        });
    };

}
