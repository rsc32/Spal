function ProfileController() {

    // bind event listeners to button clicks //
    var that = this;

    this.attemptLogout = function () {
        var that = this;
        $.ajax({
            url: "/logout",
            type: "POST",
            data: {logout: true},
            success: function (data) {
                //that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
                window.location.href = '/';
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    };

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.showErrorToast = function () {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: 'Something went wrong, couldn\'t update profile.'};

        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.showSuccessToast = function () {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: 'Successfully edited profile.'};

        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.validateForm = function () {
        if ($('#tf-first').val() == '') {
            this.showToast('First name cannot be empty');
            return false;
        }
        if ($('#tf-last').val() == '') {
            this.showToast('Last name cannot be empty');
            return false;
        }
        if ($('#tf-email').val() == '') {
            this.showToast('Email cannot be empty');
            return false;
        }
        if ($('#tf-username').val() == '') {
            this.showToast('Username cannot be empty');
            return false;
        }
        if ($('#tf-phone').val() == '') {
            this.showToast('Phone cannot be empty');
            return false;
        }

        return true;
    };

    this.editSquadInfo = function (itemId) {

        var isValidated = this.validateForm();
        //console.log("isvalid" + isValidated);

        if (isValidated) {

            var first = $('#tf-first').val();
            var last = $('#tf-last').val();
            var email = $('#tf-email').val();
            //var username = $('#tf-username').val();
            var phone = $('#tf-phone').val();

            $.ajax({
                url: "/profile",
                type: "PUT",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    first: first,
                    last: last,
                    email: email,
                    //username: username,
                    phone: phone
                },
                success: function (data) {
                    that.showSuccessToast();

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
                    that.showErrorToast();
                }
            });
        } else {
            that.showErrorToast();
        }
    };

}
