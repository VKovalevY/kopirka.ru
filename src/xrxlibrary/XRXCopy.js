/* 
 * XRXCopy.js
 * Copyright (C) Xerox Corporation, 2012.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Copy Api Web services.
 *
 * @revision    03/08/2010 TC
 *              09/12/2012 Expanded functionality - AHB
 *              10/15/2012  AHB Updated
 *              10/19/2012  AHB Updated InitiateCopyJobRequest to place no ticket when ticket is null
 *				05/21/2018	TC	Updated comments.
 *				12/04/2018  TC  Remove the use of xrxUnescape().
 *				01/11/2019  TC  Use XRX_SOAPSTART and XRX_SOAPEND instead of 
 *              11/25/2019  DW  Added BuildCopyJob, SubmitBuildCopyJob & DeleteCurrentSegment
 *								calls to support Copy Build Job.
 */

/****************************  CONSTANTS  *******************************/

var XRX_COPY_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/CopyService/1"';

var XRX_COPY_PATH = '/webservices/CopyService/1';

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
function xrxCopyGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the interface version request.
*
* @return {string}	xml request
*/
function xrxCopyGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_COPY_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxCopyParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  Initiate Copy Job

/**
* This function initiates Copy Job.
*
* @param {string}	url					destination address
* @param {string}   copyJobTicket       copy job ticket (string of escaped xml)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*
* @example <caption>Below is the SOAP message with empty job ticket.</caption>
* <lang>markup</lang>
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope 
xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" 
xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<SOAP-ENV:Body>
<InitiateCopyJobRequest xmlns="http://xml.namespaces.xerox.com/enterprise/CopyService/1"></InitiateCopyJobRequest>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>
*
*/
function xrxCopyInitiateCopyJob( url, copyJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_COPY_PATH;
	var sendReq = xrxCopyInitiateCopyJobRequest( copyJobTicket );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate copy job request.
* 
* @param {string}	copyJobTicket       Copy job ticket in string escaped form
* @return {string}	xml request
*
*/
function xrxCopyInitiateCopyJobRequest( copyJobTicket )
{
    return XRX_SOAPSTART +
        xrxCreateTag( 'InitiateCopyJobRequest', XRX_COPY_NAMESPACE, 
            ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) ) 
        + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response 	web service response in string form
* @return {string}	jobID
*/
function xrxCopyParseInitiateCopyJob( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['InitiateCopyJobResponse','JobId'] );
	return xrxGetValue( data );
}

//  Get Copy Job Details

/**
* This function gets the details on a Copy Job.
*
* @param {string}	url					destination address
* @param {string}   jobId               job Id of desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*
*/
function xrxCopyGetCopyJobDetails( url, jobId, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_COPY_PATH;
	var sendReq = xrxCopyGetCopyJobDetailsRequest( jobId );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the initiate copy job request.
* 
* @param {string}    jobId 		job Id for desired job
* @return {string}   xml request
*/
function xrxCopyGetCopyJobDetailsRequest( jobId )
{
    return XRX_SOAPSTART +
        xrxCreateTag( 'GetCopyJobDetailsRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {object}	xml payload in DOM form
*/
function xrxCopyParseGetCopyJobDetails( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "CopyJobXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( data );
	return data;
}

//  Cancel Copy Job

/**
* This function cancels the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}  	jobId               job Id for desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxCopyCancelCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyCancelCopyJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param {string}    jobId     	job Id for desired job
* @return {string}   xml request
*/
function xrxCopyCancelCopyJobRequest( jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'CancelCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_SOAPEND;
}

//  Pause Copy Job

/**
* This function pauses the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobId               job Id for desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxCopyPauseCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyPauseCopyJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param {string}  	jobId               job Id for desired job
* @return {string}	xml request
*/
function xrxCopyPauseCopyJobRequest( jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'PauseCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_SOAPEND;
}

//  Resume Copy Job

/**
* This function resumes the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobId               job Id for desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxCopyResumeCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyResumeCopyJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param {string}   jobId               job Id for desired job
* @return {string}	xml request
*/
function xrxCopyResumeCopyJobRequest( jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'ResumeCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_SOAPEND;
}

/**
* This function continues the requested 2-sided platen job based on the passed in job identifier.
*
* @param {string}	url					destination address
* @param {string}	jobId				job Id of desired job
* @param {string}	copyJobTicket		copy job ticket (string of escaped Xml)(optional)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxCopyContinueSideTwoCopyJob( url, jobId, copyJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxCopyContinueSideTwoCopyJobRequest( jobId, copyJobTicket );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the continue side two copy job request.
* 
* @param {string}   jobId			    job Id of desired job
* @param {string}   copyJobTicket	    Copy job ticket in string escaped form
* @return {string}  xml request
*/
function xrxCopyContinueSideTwoCopyJobRequest( jobId, copyJobTicket )
{
    return XRX_SOAPSTART +
        xrxCreateTag( 'ContinueSideTwoCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', jobId ) +
            ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) )
        + XRX_SOAPEND;
}

/**
* This function starts or adds a segment to a copy build job depending on if a job identifier is passed in.
*
* @param {string}   url                 destination address
* @param {string}   jobId               job Id of already started copy build job 
* @param {string}   copyJobTicket       copy job ticket (string of escaped Xml)(optional)
* @param {string}   callback_success    function to callback upon successful completion
* @param {string}   callback_failure    function to callback upon failed completion
* @param {number}   [timeout=0]         amount of seconds to wait before calling 
*                                       the callback_failure routine (0 = no timeout)
*/
function xrxBuildCopyJob( url, jobId, copyJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxBuildCopyJobRequest( jobId, copyJobTicket );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the copy build job request.
* 
* @param {string}   jobId               job Id of already started copy build job
* @param {string}   copyJobTicket       copy job ticket (string of escaped Xml)
* @return {string}  xml request
*/
function xrxBuildCopyJobRequest( jobId, copyJobTicket )
{
    if(typeof(jobId) == 'undefined' || jobId == null || jobId == ''){
        return XRX_SOAPSTART +
            xrxCreateTag( 'BuildCopyJobRequest', XRX_COPY_NAMESPACE, 
                ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) )
            + XRX_SOAPEND;
    } else {
        return XRX_SOAPSTART +
            xrxCreateTag( 'BuildCopyJobRequest', XRX_COPY_NAMESPACE, 
                xrxCreateTag( 'JobId', '', jobId ) +
                ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) )
            + XRX_SOAPEND;
    }

   
}

/**
* This function returns the parsed values.
*
* @param {string}   response    web service response in string form
* @return {string}  jobID
*/
function xrxCopyParseBuildCopyJob( response )
{
    var data = xrxFindElement( xrxStringToDom( response ), ['InitiateCopyJobResponse','JobId'] );
    return xrxGetValue( data );
}

/**
* This function submits a copy build job once all the segments are added via the xrxBuildCopyJob function.
*
* @param {string}   url                 destination address
* @param {string}   jobId               job Id of already started copy build job 
* @param {string}   copyJobTicket       copy job ticket (string of escaped Xml)(optional)
* @param {string}   callback_success    function to callback upon successful completion
* @param {string}   callback_failure    function to callback upon failed completion
* @param {number}   [timeout=0]         amount of seconds to wait before calling 
*                                       the callback_failure routine (0 = no timeout)
*/
function xrxSubmitBuildCopyJob( url, jobId, copyJobTicket, callback_success, callback_failure, timeout)
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxSubmitBuildCopyJobRequest( jobId, copyJobTicket );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the submit copy build job request.
* 
* @param {string}   jobId               job Id of already started copy build job
* @param {string}   copyJobTicket       copy job ticket (string of escaped Xml)
* @return {string}  xml request
*/
function xrxSubmitBuildCopyJobRequest( jobId, copyJobTicket )
{
    
    return XRX_SOAPSTART +
        xrxCreateTag( 'SubmitBuildCopyJobRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag('JobId', '', 
                xrxCreateTag('JobIdentifierType', '', 'JobId' ) +
                xrxCreateTag('JobIdentifierString', '', jobId )
            ) +
            ((copyJobTicket != null)? xrxCreateTag( 'CopyJobTicketXmlDocument', '', copyJobTicket ) : '' ) )
        + XRX_SOAPEND;
}


/**
* This function deletes the last (current) segment of a copy build job referenced by the given ID.
*
* @param {string}   url                 destination address
* @param {string}   jobId               job Id for desired job
* @param {string}   callback_success    function to callback upon successful completion
* @param {string}   callback_failure    function to callback upon failed completion
* @param {number}   [timeout=0]         amount of seconds to wait before calling 
*                                       the callback_failure routine (0 = no timeout)
*/
function xrxDeleteCurrentSegment( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_COPY_PATH;
    var sendReq = xrxDeleteCurrentSegmentRequest( jobId );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param {string}   jobId               job Id for desired job
* @return {string}  xml request
*/
function xrxDeleteCurrentSegmentRequest( jobId )
{
    return XRX_SOAPSTART +
        xrxCreateTag( 'DeleteCurrentSegmentRequest', XRX_COPY_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_SOAPEND;
}


/*************************  End of File  *****************************/
