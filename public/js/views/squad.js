/**
 * Created by deep on 12/2/16.
 */

var deleteUser = function (button) {
    var sc = new SquadController();

    var dialog = document.querySelector('dialog.delete-user-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
        button = null;
    });
    dialog.querySelector('.delete').addEventListener('click', function () {
        sc.deleteUser(button.value);
        dialog.close();
        button = null;
    });
    dialog.showModal();
};

$(document).ready(function () {
    var sc = new SquadController();

    //handle create
    var createDialog = document.querySelector('dialog.create-squad-user-dialog');
    var fab = document.querySelector('#fab-add');

    if (!createDialog.showModal) {
        dialogPolyfill.registerDialog(createDialog);
    }
    fab.addEventListener('click', function() {
        createDialog.showModal();
    });
    createDialog.querySelector('.close').addEventListener('click', function (){
        createDialog.close();
    });
    createDialog.querySelector('.create').addEventListener('click', function(){
        sc.attemptCreate();
        createDialog.close();
    });

    //handle edit
    var editDialog = document.querySelector('dialog.edit-squad-dialog');
    var editBtn = document.querySelector('#edit-btn');

    if (!createDialog.showModal) {
        dialogPolyfill.registerDialog(editDialog);
    }
    editBtn.addEventListener('click', function() {
        editDialog.showModal();
    });
    editDialog.querySelector('.close').addEventListener('click', function (){
        editDialog.close();
    });
    editDialog.querySelector('.edit').addEventListener('click', function(){
        sc.editSquadInfo();
        editDialog.close();
    })


});
