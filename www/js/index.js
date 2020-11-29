document.addEventListener("deviceready", onDeviceReady, false);

var db;

function onDeviceReady() {  
    var saveLocalButton = document.getElementById("save-input-local-button");
    saveLocalButton.addEventListener("click", saveToLocalStorage, false);

    var saveDBButton = document.getElementById("save-input-db-button");
    saveDBButton.addEventListener("click", saveToDBStorage, false);

    var loadLocalButton = document.getElementById("load-input-local-button");
    loadLocalButton.addEventListener("click", showLocalStorageAlert, false);

    var loadDBButton = document.getElementById("load-input-db-button");
    loadDBButton.addEventListener("click", showDatabaseAlert, false);

    db = window.openDatabase('myExampleDB', '1.0', 'ExampleDB', 2 * 1024 * 1024);
}


function saveToLocalStorage() {
    var firstName = document.getElementById("firstName").value;
    var lastfirstName = document.getElementById("lastfirstName").value;

    var donestorage = window.localStorage;
    donestorage.setItem('firstName', firstName);
    donestorage.setItem('lastfirstName', lastfirstName);
    
}


function saveToDBStorage() {
    var dfirstName = document.getElementById("firstName").value;
    var dlastfirstName = document.getElementById("lastfirstName").value;

    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users2 (firstName, lastfirstName)', 
         
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        ); 
        tx.executeSql(`INSERT INTO Users2 (firstName, lastfirstName) VALUES ("${dfirstName}", "${dlastfirstName}")`,
          
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        ); 
     }); 
}


function showLocalStorageAlert() {
    var donestorage = window.localStorage;
    var data = donestorage.getItem('firstName') + " belongs to " +
    donestorage.getItem('lastfirstName')  ;

    navigator.notification.alert(
        data, 
        null,     
        'Loaded From Local Storage!',  
        'Done'               
    );
    // document.getElementById("firstName").value = "";
    // document.getElementById("lastfirstName").value = "";
}


function showDatabaseAlert() {
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM Users2', [], function (tx, results) { 
            var data = '';
            var len = results.rows.length, i; 
            data = 'Found rows: ' + len + '</br>'; 
       
            for (i = 0; i < len; i++) { 
                data += 'Entry #' + (i + 1) + '\n';
                data += results.rows.item(i).firstName + " belongs to " + '\n'; 
                data += results.rows.item(i).lastfirstName + '\n'; 
                data += '</br>';
            }   
    document.getElementById("print").innerHTML = data;

        }, function(tx,error){
            console.error("Error: " + error.message);
        }); 
     });

    //  document.getElementById("firstName").value = "";
    //  document.getElementById("lastfirstName").value = "";
}