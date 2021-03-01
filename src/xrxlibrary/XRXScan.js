/* 
 * XrxScan.js
 * Copyright (C) Xerox Corporation, 2007.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Scan Api Web services.
 *
 * @revision    10/07/2007
 *              10/15/2012  AHB Removed GetResourceSimple
 *				08/27/2013  NS	Scan Extension API is renamed to ScanExtension(Version1) API in EIP 3.0 SDK
 *				05/21/2018	TC	Updated comments.
 *				01/04/2019  TC  Use XRX_SOAP11_SOAPSTART and XRX_SOAPEND instead of XRX_SCAN_SOAPSTART and 
 *								XRX_SCAN_SOAPEND. Cleaned up XRX_SCAN_EXTRAATTRIBS.
 *
 */

/****************************  GLOBALS  *******************************/

var XRX_SCAN_EXTRAATTRIBS = '<wsa:To></wsa:To>'
	+ '<ServiceId xmlns="http://schemas.xmlsoap.org/ws/2006/02/devprof"></ServiceId>'
	+ '<wsa:Action></wsa:Action>'
	+ '<wsa:MessageID></wsa:MessageID>';

var XRX_SCAN_NAMESPACE = 'xmlns="http://schemas.xerox.com/office/wsd"';

var XRX_SCAN_PATH = '/webservices/office/wsdxrxscan/1';

/****************************  FUNCTIONS  *******************************/

//  Scan Interface Version

/**
* This function gets the Scan interface version and returns the parsed values.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxScanGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SCAN_PATH;
    var sendReq = xrxScanGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Scan interface version request.
*
* @return {string}	xml request
*/
function xrxScanGetInterfaceVersionRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SCAN_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

//  Initiate Scan

/**
* This function initiates a Scan.
*
* @param {string}	url					destination address
* @param {string}	template			name of template
* @param {boolean}	isPool				flag to determine if template in pool (true)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxScanInitiateScan( url, template, isPool, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SCAN_PATH;
	var sendReq = xrxScanInitiateScanRequest( template, isPool );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}   

/**
* This function builds the Initiate Scan request.
*
* @param {string}	template			name of template
* @param {boolean}	isPool				flag to determine if template in pool (true)
* @return {string}  xml request
*/
function xrxScanInitiateScanRequest( template, isPool )
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'InitiateScanRequest', XRX_SCAN_NAMESPACE,
			xrxCreateTag( 'ScanTemplateID', XRX_XML_TYPE_NONE, template ) 
			+ xrxCreateTag( 'IsFromTemplatePool', '', isPool ) 
			+ XRX_SCAN_EXTRAATTRIBS ) + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string} 	jobID
*/
function xrxScanParseInitiateScan( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["InitiateScanResponse","JobID"] );
	return xrxGetValue( data );
}
 
/*************************  End of File  *****************************/
