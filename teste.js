var Connection = require('tedious').Connection;  


  
var config = {  
   // server: '172.30.0.19',  
   server: '172.30.0.19', 
   authentication: {
        type: 'default',
        options: {
            userName: 'rodrigo.brandao', 
            password: 'bdaytyfull'
        }
    },
    options: {
        encrypt: false,
        database: 'IAESTIMATOR' , 
        trustedConnection: true,
        instanceName: 'sql2017'
    }
}; 
var connection = new Connection(config);  

//Associando um evento que ocorre após connect
connection.on('connect', function(err) {  
    // If no error, then good to proceed.
    console.log(err);  
    console.log("Connected");  
    executeStatement();    
});  

connection.connect();

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

function executeStatement() {
      
    request = new Request("SELECT top 5 * from syn_issues;", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}   