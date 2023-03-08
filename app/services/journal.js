"use strict";

/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable security/detect-object-injection */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
const appConfig = require('../config/app.config');
const dotenv = require( "dotenv" );
const sql = require('mssql');

async function getConfig() { 
    // read in the .env file
    dotenv.config();

    // capture the environment variables the application needs
    const {
      SQL_SERVER,
      SQL_DATABASE,
      SQL_USER,
      SQL_PASSWORD, 
      SQL_INSTANCE,
      SQL_ENCRYPT,
      SQL_TRUSTED_CONNECTION,
    } = process.env;

    var config = {  
      server: SQL_SERVER, 
      authentication: {
          type: 'default',
          options: {
              userName: SQL_USER, 
              password: SQL_PASSWORD
          }
      },
      options: {
          encrypt: false,
          database: SQL_DATABASE , 
          trustedConnection: SQL_TRUSTED_CONNECTION,
          instanceName: SQL_INSTANCE
      }
    };   
    return config;
}


async function execSprRptJournals(params) { 
  try { 

    const config = await getConfig();

    //Get possible filters
    const {
      dtStart,
      dtFinish,
      id,
      deNotes
    } = params;

    //Connect to database
    await sql.connect(config); 

    // Stored Procedure and Parameters setup
    const request = new sql.Request();
    await request.input('P_DT_START', dtStart  );
    await request.input('P_DT_FINISH',  dtFinish );
    await request.input('P_ID_ISSUE',  id );
    await request.input('P_DE_NOTES',deNotes   );
 
    const result =  await request.execute('SPR_RPT_JOURNALS')          
    console.log("result SPR_RPT_JOURNALS:");
    console.log(result);

    return result;

  } catch (err) { 
    console.error(err); 
  } finally { 
    
    // Close
    sql.close(); 
  } 
}

exports.FindByParams = async (req) => {

 
  //Default response
  const response = {
    statusCode: 404, success: false, jsonBody: 'Not Found',
  };
  
  //Params validations:
  if (req === null || req === undefined) {
    response.statusCode = 400;
    response.success = false;
    response.jsonBody = 'Body request cannot be empty.';
    return response;
  }  else if (req.body === null || req.body === undefined) {
    response.statusCode = 400;
    response.success = false;
    response.jsonBody = 'Body request cannot be empty.';
    return response;
  } 
  // id Validation
  else if (req.body.id != null && req.body.id != undefined) {
    const parsedId = parseInt(req.body.id, 10) ;
    //Checks the id 
    if (isNaN(parsedId)) {
      response.statusCode = 400;
      response.success = false;
      response.jsonBody = 'Invalid id, must be a valid integer.';
      return response;
    } 
  }

 
  //Connects, runs the SQL Query and gets you the result Dataset.
  try {
    
    //Stored Procedure Params
    const params = req.body;
    if (params === null || params === undefined) {
      response.statusCode = 400;
      response.success = false;
      response.jsonBody = 'Bad Request.';   
      return response;   
    }
    if (  (params.dtStart !== undefined && params.dtFinish === undefined) || (params.dtStart === undefined && params.dtFinish !== undefined) ) {
      response.statusCode = 400;
      response.success = false;
      response.jsonBody = 'Bad Request. dtStart must be defined with dtFinish.';
      return response;
    }


    let rowsAffected = 0;

    await execSprRptJournals(params).then((sqlResult) => { 

      if (sqlResult === undefined || sqlResult === null )  {
        response.statusCode = 400;
        response.success = false;
        response.jsonBody = 'Bad Request.';
      }

      if (sqlResult.recordset != undefined || sqlResult.recordset != null )  {
        rowsAffected = sqlResult.recordset.length;
      }      

      const returnJson = {        
        rowsAffected,
        journals: sqlResult.recordset
      }

      console.log(sqlResult); 
      response.statusCode = 200;
      response.success = true;
      response.jsonBody = returnJson;
  
    }) .catch((err) => { console.error(err); });


  } catch (error) {

    // eslint-disable-next-line no-console
    console.error(error);
    response.statusCode = 500;
    response.success = false;
    response.jsonBody = 'Internal Server Error';

  }

  return response;

};
