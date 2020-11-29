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
    var name = document.getElementById("name").value;
    var country = document.getElementById("country").value;

    var donestorage = window.localStorage;
    donestorage.setItem('name', name);
    donestorage.setItem('country', country);
    
}

function saveToDBStorage() {
    var dname = document.getElementById("name").value;
    var dcountry = document.getElementById("country").value;

    db.transaction(function (tx) { 
        tx.executeSql('CREATE TABLE IF NOT EXISTS Users2 (name, country)', 
         
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        ); 
        tx.executeSql(`INSERT INTO Users2 (name, country) VALUES ("${dname}", "${dcountry}")`,
          
            null,
            function(tx,error){
                console.error("Error: " + error.message);
            }
        ); 
     }); 
}

function showLocalStorageAlert() {
    var donestorage = window.localStorage;
    var data = donestorage.getItem('name') + " belongs to " +
    donestorage.getItem('country')  ;

    navigator.notification.alert(
        data, 
        null,     
        'Loaded From Local Storage!',  
        'Done'               
    );
    // document.getElementById("name").value = "";
    // document.getElementById("country").value = "";
}

function showDatabaseAlert() {
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM Users2', [], function (tx, results) { 
            var data = '';
            var len = results.rows.length, i; 
            data = 'Found rows: ' + len + '</br>'; 
       
            for (i = 0; i < len; i++) { 
                data += 'Entry #' + (i + 1) + '\n';
                data += results.rows.item(i).name + " belongs to " + '\n'; 
                data += results.rows.item(i).country + '\n'; 
                data += '</br>';
            }   
    document.getElementById("print").innerHTML = data;

        }, function(tx,error){
            console.error("Error: " + error.message);
        }); 
     });

    //  document.getElementById("name").value = "";
    //  document.getElementById("country").value = "";
}