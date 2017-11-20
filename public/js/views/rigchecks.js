/**
 * Created by deep on 12/8/16.
 */


$(document).ready(function () {

    var rc = new RigchecksController();

    var dialog = document.querySelector('dialog.select-checklist-dialog');
    var fab = document.querySelector('#fab-add');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    fab.addEventListener('click', function () {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
    dialog.querySelector('.okay').addEventListener('click', function () {
        rc.checklistSelected();
        dialog.close();
    });

    document.querySelector('save-btn').addEventListener('click', function () {
        rc.saveData();
    });

});
