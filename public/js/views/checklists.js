/**
 * Created by deep on 11/30/16.
 */

var deleteChecklist = function (button) {
    console.log(button);
    var wc = new ChecklistController();

    var dialog = document.querySelector('dialog.delete-checklist-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
        button = null;
    });
    dialog.querySelector('.delete').addEventListener('click', function () {
        wc.deleteChecklist(button.value);
        dialog.close();
        button = null;
    });
    dialog.showModal();
};

var deleteCompartment = function (button) {
    var wc = new ChecklistController();
    var values = button.value.split(",");

    var dialog = document.querySelector('dialog.delete-compartment-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
        button = null;
    });
    dialog.querySelector('.delete').addEventListener('click', function () {
        wc.deleteCompartment(values[0], values[1]);
        dialog.close();
        button = null;
    });
    dialog.showModal();
};


var deleteField = function (button) {
    var wc = new ChecklistController();
    var values = button.value.split(",");

    var dialog = document.querySelector('dialog.delete-field-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
        button = null;
    });
    dialog.querySelector('.delete').addEventListener('click', function () {
        wc.deleteField(values[0], values[1], values[2]);
        dialog.close();
        button = null;
    });
    dialog.showModal();
};

var createCompartment = function (button) {
    var wc = new ChecklistController();

    var createDialog = document.querySelector('dialog.create-compartment-dialog');
    if (!createDialog.showModal) {
        dialogPolyfill.registerDialog(createDialog);
    }
    createDialog.querySelector('.close').addEventListener('click', function () {
        createDialog.close();
        button = null;
    });
    createDialog.querySelector('.create').addEventListener('click', function () {
        wc.addCompartment(button.value);
        createDialog.close();
        button = null;
    });
    createDialog.showModal();
};

var createField = function (button) {
    var wc = new ChecklistController();

    var values = button.value.split(",");

    var createFieldDialog = document.querySelector('dialog.create-field-dialog');
    if (!createFieldDialog.showModal) {
        dialogPolyfill.registerDialog(createFieldDialog);
    }
    createFieldDialog.querySelector('.close').addEventListener('click', function () {
        createFieldDialog.close();
        button = null;
    });
    createFieldDialog.querySelector('.create').addEventListener('click', function () {
        wc.addField(values[0], values[1]);
        createFieldDialog.close();
        button = null;
    });
    createFieldDialog.showModal();
};

$(document).ready(function () {
    var wc = new ChecklistController();

    var dialog = document.querySelector('dialog.create-checklist-dialog');
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
    dialog.querySelector('.create').addEventListener('click', function () {
        wc.attemptCreate();
        dialog.close();
    });

});
