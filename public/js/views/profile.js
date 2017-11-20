var enableEdit = function (itemId) {
    var pc = new ProfileController();

    //var dialog = document.querySelector('dialog.edit-profile-dialog');
    var dialog = document.getElementById('profile-edit-id');

    var fab = document.querySelector('#fab-add');

    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
        itemId = null;

    });
    //must match the button (querySelector)
    dialog.querySelector('.edit').addEventListener('click', function () {
        //console.log("delete");
        pc.editSquadInfo(itemId);
        dialog.close();
        itemId = null;
    });
    dialog.showModal();
};


$(document).ready(function () {

    var pc = new ProfileController();

    var logoutDialog = document.querySelector('dialog.logout-dialog');
    var editDialog = document.querySelector('dialog.edit-profile-dialog');

    var logoutBtn = document.querySelector('#logout-btn');
    var fab = document.querySelector('#edit-btn');

    if (!logoutDialog.showModal) {
        dialogPolyfill.registerDialog(logoutDialog);
    }
    if (!editDialog.showModal) {
        dialogPolyfill.registerDialog(editDialog);
    }
    logoutBtn.addEventListener('click', function () {
        logoutDialog.showModal();
    });
    fab.addEventListener('click', function() {
        editDialog.showModal();
    });
    logoutDialog.querySelector('.close').addEventListener('click', function () {
        logoutDialog.close();
    });
    logoutDialog.querySelector('.accept').addEventListener('click', function () {
        pc.attemptLogout();
    });
    editDialog.querySelector('.closeEdit').addEventListener('click', function (){
        document.getElementById('profile-edit-id').close();
        //dialog.close();
    });
    editDialog.querySelector('.edit').addEventListener('click', function(userId){
        pc.editSquadInfo(userId);
        document.getElementById('profile-edit-id').close();
        //dialog.closeEdit();
    })

});
