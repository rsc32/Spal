function LoginValidator() {
// bind a simple alert window to this controller to display any errors //
    this.loginErrors = $('.modal-alert');

    this.showLoginError = function (title, message) {
        $('.modal-alert .modal-header h4').text(title);
        $('.modal-alert .modal-body').html(message);
        this.loginErrors.modal('show');
    }
}

LoginValidator.prototype.validateForm = function () {
    if ($('#user-tf').val() == '') {
        this.showLoginError('Whoops!', 'Please enter a valid username');
        return false;
    } else if ($('#pass-tf').val() == '') {
        this.showLoginError('Whoops!', 'Please enter a valid password');
        return false;
    } else {
        return true;
    }
}