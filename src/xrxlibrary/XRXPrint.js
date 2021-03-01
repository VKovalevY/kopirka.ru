/* 
 * XRXPrint.js
 * Copyright (C) Xerox Corporation, 2011.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Print Api Web services.
 *
 * @revision 	10/03/2011	TC	Created.
 * 				10/22/2012  TC 	Added xrxPrintParseGetInterfaceVersion() function,
 *								added error checking and comments.
 *				05/21/2018	TC	Updated comments.
 *				01/04/2019  TC  Use XRX_SOAPSTART and XRX_SOAPEND instead of 
 *								XRX_PRINT_SOAPSTART and XRX_PRINT_SOAPEND.
 */

/****************************  CONSTANTS  *******************************/

var XRX_PRINT_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/WS-PrintService/1"';

var XRX_PRINT_PATH = '/webservices/WS-PrintService/1';

/****************************  FUNCTIONS  *******************************/

//  Print Interface Version

/**
* This function gets the print interface version.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxPrintGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
	if((url == null) || (url == ""))
		url = "http://127.0.0.1";
    var sendUrl = url + XRX_PRINT_PATH;
    var sendReq = xrxPrintGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the get interface version request.
* 
* @return {string}	xml request
*/
function xrxPrintGetInterfaceVersionRequest()
{
	return XRX_SOAPSTART 
		+ xrxCreateTag('GetInterfaceVersionRequest', XRX_PRINT_NAMESPACE, '') 
		+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxPrintParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  Initiate Print Job

/**
* This function initiates a Print Job.
*
* @param {string}	url					WS-PrintService device destination address
* @param {string}   printJobUrl    		the url that contains the files to be printed
* @param {string}   username      		username for login to printJobUrl if authentication is required,
										'' if authentication is not required
* @param {string}   password  			password for login to printJobUrl if authentication is required,
*										'' if authentication is not required
* @param {string}   printJobTicket		print job ticket (string of escaped xml)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxPrintInitiatePrintJobURL( url, printJobUrl, username, password, printJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_PRINT_PATH;
	var sendReq = xrxPrintInitiatePrintJobURLRequest( printJobUrl, username, password, printJobTicket );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate print job request.
* 
* @param {string}   printJobUrl        	the url that contains the files to be printed
* @param {string}   username           	username for login to printJobUrl if authentication is required,
										'' if authentication is not required
* @param {string}   password           	password for login to printJobUrl if authentication is required,	
*										'' if authentication is not required
* @param {string}   printJobTicket     	print job ticket (string of escaped xml)
* @return {string}	xml request
*/
function xrxPrintInitiatePrintJobURLRequest( printJobUrl, username, password, printJobTicket )
{
	var printJobUrlTag = xrxCreateTag('PrintDocumentURL', '', printJobUrl);
	var usernameTag = ""; 
	var passwordTag = "";

	if (username != "")
	{
		usernameTag = xrxCreateTag('UserName', '', username);
		passwordTag = xrxCreateTag('Password', '', password);
    }

	var printJobTicketTag = (printJobTicket != null)? xrxCreateTag( 'JobModelSchemaCommon_PrintJobTicket', '', printJobTicket ) : '';

	return XRX_SOAPSTART 
		+ xrxCreateTag('InitiatePrintJobURLRequest', XRX_PRINT_NAMESPACE, printJobUrlTag + printJobTicketTag + usernameTag + passwordTag) 
		+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	jobID
*/
function xrxPrintParseInitiatePrintJobURL( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['InitiatePrintJobURLResponse','JobId'] );
	var jobID = xrxGetValue( data );

	return jobID;
}



/*************************  End of File  *****************************/
