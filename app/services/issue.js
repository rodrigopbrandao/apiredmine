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

async function execSprRptIssues(params) { 
  try { 

    const config = await getConfig();

    //Get possible filters
    const {
      dtStart,			  // P_DT_START_CREATED
      dtFinish,			    // P_DT_FINISH_CREATED
      nmResquestType, 	// P_ID_CUSTOM_VALUE_1
      nuDoneRatio,		  // P_DONE_RATIO
      id,					      // P_ID_ISSUE
      nmAssigned,			  // P_NM_ASSIGNED
      nmAuthor,			    // P_NM_AUTHOR
      nmStatus,			    // P_NM_STATUS
      nmAssignedBd,		  // P_NM_ASSIGNED_BD
      nmAssignednApp,		// P_NM_ASSIGNED_NET
      nmAssignednTest,	// P_NM_ASSIGNED_TEST
      nmAssignednAneg,	// P_NM_ASSIGNED_ANEG
      nmAssignednAreq,	// P_NM_ASSIGNED_AREQ
      nmAssignednInf,		// P_NM_ASSIGNED_INF
      deSubject,			  // P_DE_SUBJECT
      deDescription,	  // P_DE_DESCRIPTION
      nmClient,			    // P_NM_CLIENT      
    } = params;


    //Connect to database
    await sql.connect(config); 

    // Stored Procedure and Parameters setup
    const request = new sql.Request();
    await request.input('P_DT_START_CREATED', dtStart  );
    await request.input('P_DT_FINISH_CREATED',  dtFinish );
    await request.input('P_ID_CUSTOM_VALUE_1', nmResquestType  );
    await request.input('P_DONE_RATIO', nuDoneRatio  );
    await request.input('P_ID_ISSUE',  id );
    await request.input('P_NM_ASSIGNED', nmAssigned  );
    await request.input('P_NM_AUTHOR',  nmAuthor );
    await request.input('P_NM_STATUS', nmStatus  );
    await request.input('P_NM_ASSIGNED_BD', nmAssignedBd  );
    await request.input('P_NM_ASSIGNED_NET', nmAssignednApp  );
    await request.input('P_NM_ASSIGNED_TEST',nmAssignednTest   );
    await request.input('P_NM_ASSIGNED_ANEG', nmAssignednAneg  );
    await request.input('P_NM_ASSIGNED_AREQ', nmAssignednAreq  );
    await request.input('P_NM_ASSIGNED_INF',  nmAssignednInf );
    await request.input('P_DE_SUBJECT',  deSubject );
    await request.input('P_DE_DESCRIPTION',deDescription   );
    await request.input('P_NM_CLIENT', nmClient  );

 
    const result =  await request.execute('SPR_RPT_ISSUE')          
    console.log("result SPR_RPT_ISSUE:");
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
    }
    if (  (params.dtStart !== null && params.dtFinish === null) || (params.dtStart === null && params.dtFinish !== null) ) {
      response.statusCode = 400;
      response.success = false;
      response.jsonBody = 'Bad Request. dtStart must be defined with dtFinish.';
    }    

    let rowsAffected = 0;

    await execSprRptIssues(params).then((sqlResult) => { 

      if (sqlResult === undefined || sqlResult === null )  {
        response.statusCode = 400;
        response.success = false;
        response.jsonBody = 'Bad Request.';
      }

      if (sqlResult.recordset != undefined && sqlResult.recordset != null )  {
        rowsAffected = sqlResult.recordset.length;
      }      

      const returnJson = {        
        rowsAffected,
        issues: sqlResult.recordset
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
