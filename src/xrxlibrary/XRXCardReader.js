/* 
 * XRXCardReader.js
 * Copyright (C) Xerox Corporation, 2009.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Session Api Web services.
 *
 * @revision    02/22/2010
 *              10/15/2012  AHB Updated
 *				05/21/2018	TC	Updated comments.
 *				12/04/2018  TC  Removed the use of xrxUnescape().
 *				12/14/2018  TC  Updated the XRX_CARDREADER_SOAPSTART, XRX_CARDREADER_SOAPEND 
 *								and XRX_CARDREADER_NAMESPACE;
 * 				01/03/2019  TC  Removed XRX_CARDREADER_SOAPSTART and XRX_CARDREADER_SOAPEND. 
 *								Updated the code to use XRX_SOAPSTART and XRX_SOAPEND.
 */

/****************************  CONSTANTS  *******************************/

var XRX_CARDREADER_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/CardReader/1"';

var XRX_CARDREADER_PATH = '/webservices/CardReader/1';

/****************************  FUNCTIONS  *******************************/

//  Interface Version

/**
* This function gets the interface version and returns the parsed values.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxCardReaderGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_CARDREADER_PATH;
    var sendReq = xrxCardReaderGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the interface version request.
*
* @return {string}	xml request
*/
function xrxCardReaderGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_CARDREADER_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxCardReaderParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  SetCardDataClient

/**
* This function sets the device's card data listener
*
* @param {string}	url					destination address
* @param {strubg}	server_url			server address to set the device to
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
* @example <caption>Soap message for SetCardDataClient</caption>
*	<lang>markup</lang>
	<?xml version="1.0" encoding="UTF-8"?>
    <SOAP-ENV:Envelope
     xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"
     xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
     xmlns:cardreader="http://xml.namespaces.xerox.com/enterprise/CardReader/1"
     xmlns:rdngcrd="http://xml.namespaces.xerox.com/enterprise/ReadingCardEvent/1">
     <SOAP-ENV:Body>
       <cardreader:SetCardDataClientRequestArgs>X</cardreader:SetCardDataClientRequestArgs>
     </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
*/
function xrxCardReaderSetCardDataClient( url, server_url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_CARDREADER_PATH;
	var sendReq = xrxCardReaderSetCardDataClientRequest(server_url);
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the request.
*
* @param {string}	server_url			server address to set the device to
* @return {string} 	xml request
*/
function xrxCardReaderSetCardDataClientRequest( server_url )
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'SetCardDataClientRequestArgs', XRX_CARDREADER_NAMESPACE, server_url ) 
			+ XRX_SOAPEND;
}

//  ClearCardDataClient

/**
* This function clears the device's card reader data.
*
* @param {string}	url					destination address
* @param {string}	server_url			server address to set the device to
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxCardReaderClearCardDataClient( url, server_url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_CARDREADER_PATH;
	var sendReq = xrxCardReaderClearCardDataClientRequest( server_url );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the request.
*
* @param {string}	server_url			server address to set the device to
* @return {string}	xml request
*/
function xrxCardReaderClearCardDataClientRequest( server_url )
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'ClearCardDataClientRequestArgs', XRX_CARDREADER_NAMESPACE, server_url ) 
			+ XRX_SOAPEND;
}

// SetCardDataclientExt

/**
* This function sets the device's card data listener to the card reader with the specified device_number(i.e. peripheral id)
*
* @param {string}	url					destination address
* @param {string}	server_url			server address to set the device to
* @param {number}   device_number       peripheral id of the Card Reader to listen to
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxCardReaderSetCardDataClientExt(url, server_url, device_number, callback_success, callback_failure, timeout) {
    if ((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_CARDREADER_PATH;
    var sendReq = xrxCardReaderSetCardDataClientExtRequest(server_url, device_number);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the request.
*
* @param {string}	server_url			server address to set the device to
* @param {number}   device_number       peripheral id of the Card Reader to listen to
* @return {string} 	xml request
*/
function xrxCardReaderSetCardDataClientExtRequest(server_url, device_number) {
    return XRX_SOAPSTART
			+ xrxCreateTag('SetCardDataClientExtRequestArgs', XRX_CARDREADER_NAMESPACE, 
			  xrxCreateTag('URLofClient', '', server_url) + xrxCreateTag('DeviceNumber', '', device_number))
			+ XRX_SOAPEND;
}

//  ClearCardDataClientExt

/**
* This function clears the device's card reader data.
*
* @param {string}	url					destination address
* @param {string}	server_url			server address to set the device to
* @param {number}   device_number       peripheral id of the Card Reader to listen to
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxCardReaderClearCardDataClientExt(url, server_url, device_number, callback_success, callback_failure, timeout) {
    if ((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_CARDREADER_PATH;
    var sendReq = xrxCardReaderClearCardDataClientRequestExt(server_url, device_number);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the request.
*
* @param {string}	server_url			server address to set the device to
* @param {number}   device_number       peripheral id of the Card Reader to listen to
* @return {string}	xml request
*/
function xrxCardReaderClearCardDataClientRequestExt(server_url, device_number) {
    return XRX_SOAPSTART
			+ xrxCreateTag('ClearCardDataClientExtRequestArgs', XRX_CARDREADER_NAMESPACE, 
			  xrxCreateTag('URLofClient', '', server_url) + xrxCreateTag('DeviceNumber', '', device_number))
			+ XRX_SOAPEND;
}


//  GetPeripheralsInfo

/**
* This function gets the peripheral's info.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxCardReaderGetPeripheralsInfoClient( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_CARDREADER_PATH;
	var sendReq = xrxCardReaderGetPeripheralsInfoRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the request.
*
* @return {string}	xml request
*/
function xrxCardReaderGetPeripheralsInfoRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetPeripheralsInfoRequestArgs', XRX_CARDREADER_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {object}	xml payload in DOM form
*/
function xrxCardReaderParseGetPeripheralsInfo( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "hwInfo" );
	if(data != null) 
	    data = xrxStringToDom( data );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param {string}	response	web service response in string form
* @return {string}	escaped xml payload in string form
*/
function xrxCardReaderParseGetPeripheralsInfoPayload( response )
{
	return xrxParsePayload( response, "hwInfo" );
}

/*************************  End of File  *****************************/
