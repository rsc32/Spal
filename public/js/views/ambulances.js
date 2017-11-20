/**
 * Created by deep on 11/30/16.
 */

var deleteItem = function (itemId) {
    //console.log("Delete ambulance " + itemId);
    var ac = new AmbulanceController();

    var dialog = document.querySelector('dialog.delete-ambulance-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
        itemId = null;
    });
    dialog.querySelector('.delete').addEventListener('click', function () {
        //console.log("delete");
        ac.deleteAmbulance(itemId);
        dialog.close();
        itemId = null;
    });
    dialog.showModal();

};

$(document).ready(function () {

    var ac = new AmbulanceController();

    var dialog = document.querySelector('dialog.create-ambulance-dialog');
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
        ac.attemptCreate();
        dialog.close();
    });


});
