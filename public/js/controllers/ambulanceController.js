/**
 * Created by deep on 11/30/16.
 */

function AmbulanceController() {
    let that = this;

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.showErrorToast = function () {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: 'Something went wrong, couldn\'t create ambulance.'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.showSuccessToast = function () {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: 'Successfully added an ambulance.'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.validateForm = function () {
        if ($('#tf-make').val() == '') {
            this.showToast('Make cannot be empty');
            return false;
        }

        if ($('#tf-model').val() == '') {
            this.showToast('Model cannot be empty');
            return false;
        }

        if ($('#tf-color').val() == '') {
            this.showToast('Color cannot be empty');
            return false;
        }

        if ($('#tf-license-plate').val() == '') {
            this.showToast('License plate cannot be empty');
            return false;
        }

        if ($('#tf-truck-number').val() == '') {
            this.showToast('Truck number cannot be empty');
            return false;
        }

        return true;
    };

    this.attemptCreate = function () {

        var isValidated = this.validateForm();
        //console.log("isvalid" + isValidated);

        if (isValidated) {

            var make = $('#tf-make').val();
            var model = $('#tf-model').val();
            var color = $('#tf-color').val();
            var licensePlate = $('#tf-license-plate').val();
            var truckNumber = $('#tf-truck-number').val();

            $.ajax({
                url: "/ambulances",
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    make: make,
                    model: model,
                    color: color,
                    licensePlate: licensePlate,
                    truckNumber: truckNumber
                },
                success: function (data) {
                    that.showSuccessToast();

                    var strVar = "";
                    strVar += "<div id=\"ambulance-" + data.id + "\"";
                    strVar += "                 class=\"ambulance-card mdl-shadow--2dp mdl-color--white mdl-cell mdl-card mdl-cell--4-col\">";
                    strVar += "               <div class=\"mdl-card__title mdl-card--expand mdl-color--red-300\">";
                    strVar += "                  <h5>Ambulance " + data.truckNumber + "<\/h5>";
                    strVar += "               <\/div>";
                    strVar += "               <div class=\"mdl-card__supporting-text mdl-color-text--grey-600\">";
                    strVar += "                  Make: " + data.make + " <br> Model: " + data.model + " <br> Color: " + data.color + "<br> License Plate: " + data.licensePlate + "";
                    strVar += "               <\/div>";
                    strVar += "               <div class=\"mdl-card__actions mdl-card--border \">";
                    strVar += "                  <button id=\"delete-btn\" class=\"right mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon\"";
                    strVar += "                          onclick='deleteItem(" + data.id + ")'>";
                    strVar += "                     <i class=\"material-icons\">delete<\/i>";
                    strVar += "                  <\/button>";
                    strVar += "               <\/div>";
                    strVar += "            <\/div>";


                    //add item to the main page
                    $('#main-content-container').append(strVar);

                    //remove the
                    var emptyText = $('#empty-text');
                    if (emptyText) emptyText.remove();

                    $('#tf-make').val("");
                    $('#tf-model').val("");
                    $('#tf-color').val("");
                    $('#tf-license-plate').val("");
                    $('#tf-truck-number').val("");
                },
                error: function (jqXHR) {
                    console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                    that.showErrorToast();
                }
            });
        }

    };

    this.deleteAmbulance = function (ambulanceId) {
        $.ajax({
            url: "/ambulances",
            type: "DELETE",
            contentType: "application/x-www-form-urlencoded",
            data: {
                ambulanceId: ambulanceId
            },
            success: function (data) {

                $('#ambulance-' + data.id).remove();

                var card = $('ambulance-card');
                if (!card) {

                }

                that.showToast("Successfully deleted ambulance ");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error deleting ambulance.');
            }
        });

        ambulanceId = null;
    };
}