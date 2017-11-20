/**
 * Created by deep on 12/2/16.
 */


function SquadController() {

    // bind event listeners to button clicks //
    var that = this;

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.validateCreateForm = function () {
        var first = $('#tf-first').val();
        var last = $('#tf-last').val();
        var email = $('#tf-email').val();
        var phone = $('#tf-phone').val();
        var username = $('#tf-username').val();
        var password = $('#tf-password').val();

        if (!first) {
            that.showToast('First name should not be empty');
            return false;
        }
        if (!last) {
            that.showToast('Last name should not be empty');
            return false;
        }
        if (!email) {
            that.showToast('Email should not be empty');
            return false;
        }
        if (!phone) {
            that.showToast('Phone should not be empty');
            return false;
        }
        if (!username) {
            that.showToast('Username should not be empty');
            return false;
        }
        if (!password) {
            that.showToast('Password should not be empty');
            return false;
        }

        var userRole = null;
        userRole = $('input[name = "user-role-options"]:checked').val();
        if (userRole == null) {
            this.showToast('Select an ambulance');
            return false;
        }

        return true;
    };

    this.validateSquadForm = function () {
        var squadNumber = $('#tf-squad-number').val();
        var squadName = $('#tf-squad-name').val();
        var street = $('#tf-squad-street').val();
        var city = $('#tf-squad-city').val();
        var state = $('#tf-squad-state').val();
        var zip = $('#tf-squad-zip').val();
        var phone = $('#tf-squad-phone').val();
        var companyName = $('#tf-squad-company-name').val();

        if (!squadNumber) {
            that.showToast('Squad number cannot be empty.');
            return false;
        }

        if (!squadName) {
            that.showToast('Squad name cannot be empty.');
            return false;
        }

        if (!street) {
            that.showToast('Street cannot be empty.');
            return false;
        }

        if (!city) {
            that.showToast('City cannot be empty.');
            return false;
        }

        if (!state) {
            that.showToast('State cannot be empty.');
            return false;
        }

        if (!zip) {
            that.showToast('Zip cannot be empty.');
            return false;
        }

        if (!phone) {
            that.showToast('Phone cannot be empty.');
            return false;
        }

        if (!companyName) {
            that.showToast('Company name cannot be empty.');
            return false;
        }


        return true;
    };

    this.editSquadInfo = function () {

        var isValidated = this.validateSquadForm();
        //console.log("isvalid" + isValidated);

        if (isValidated) {

            var squadNumber = $('#tf-squad-number').val();
            var squadName = $('#tf-squad-name').val();
            var street = $('#tf-squad-street').val();
            var city = $('#tf-squad-city').val();
            var state = $('#tf-squad-state').val();
            var zip = $('#tf-squad-zip').val();
            var phone = $('#tf-squad-phone').val();
            var companyName = $('#tf-squad-company-name').val();

            $.ajax({
                url: "/squad",
                type: "PUT",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    squadNumber: squadNumber,
                    name: squadName,
                    street: street,
                    city: city,
                    state: state,
                    zip: zip,
                    phone: phone,
                    companyName: companyName
                },
                success: function (data) {
                    location.reload();
                    return;
                    that.showToast('Successfully update the squad information');

                    var strVar = "";

                    //add item to the main page
                    //$('#main-content-container').append(strVar);

                    //remove the
                    var emptyText = $('#empty-text');
                    if (emptyText) emptyText.remove();

                    $('#user-profile-firstlast').val(data.last + data.first);
                    $('#user-profile-email').val(data.email);
                    //$('#user-profile-username').val(data.username);
                    $('#user-profile-phone').val(data.phone);

                    document.getElementById('user-profile-firstlast').innerHTML =
                        data.last + ", " + data.first;
                    document.getElementById('user-profile-email').innerHTML = data.email;
                    document.getElementById('user-profile-phone').innerHTML = data.phone;


                    $('#tf-first').val(data.first);
                    $('#tf-last').val(data.last);
                    $('#tf-email').val(data.email);
                    //$('#tf-username').val(data.username);
                    $('#tf-phone').val(data.phone);
                },
                error: function (jqXHR) {
                    console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                    that.showToast('Error updating info');
                }
            });
        }
    };

    this.attemptCreate = function () {

        var isValidated = this.validateCreateForm();
        //console.log("isvalid" + isValidated);

        if (isValidated) {

            var first = $('#tf-first').val();
            var last = $('#tf-last').val();
            var email = $('#tf-email').val();
            var phone = $('#tf-phone').val();
            var username = $('#tf-username').val();
            var password = $('#tf-password').val();
            var userRole = $('input[name = "user-role-options"]:checked').val();

            $.ajax({
                url: "/squad",
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    first: first,
                    last: last,
                    email: email,
                    phone: phone,
                    username: username,
                    password: password,
                    role: userRole
                },
                success: function (data) {
                    location.reload();
                    //TODO maybe make it so this populates the list
                    that.showToast('Successfully Created user');

                    //TODO add item to the main page
                    //$('#main-content-container').append(strVar);

                    //remove the
                    var emptyText = $('#empty-text');
                    if (emptyText) emptyText.remove();

                    $('#tf-first').val("");
                    $('#tf-last').val("");
                    $('#tf-email').val("");
                    $('#tf-phone').val("");
                    $('#tf-username').val("");
                    $('#tf-password').val("");

                },
                error: function (jqXHR) {
                    console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                    if (jqXHR.responseText == 'email-taken') {
                        that.showToast('A user with that email already exists please chose another email');
                    } else if (jqXHR.responseText == 'username-taken') {
                        that.showToast('A user with that username already exists please select another username');
                    }
                }
            });
        }

    };

    this.deleteUser = function (userId) {

        $.ajax({
            url: "/squad",
            type: "DELETE",
            contentType: "application/x-www-form-urlencoded",
            data: {
                userId: userId
            },
            success: function (data) {
                //console.log(data);

                $('#user-' + data.id).remove();

                var card = $('user-card');
                if (!card) {
                    //show empty list text
                }


                that.showToast("Successfully deleted user");
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                that.showToast('Error deleting user');
            }
        });
    };
}