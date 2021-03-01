/*
 * XRXWorkflowManagement.js
 * Copyright (C) Xerox Corporation, 2017.  All rights reserved.
 *
 * This file provides a module that encapsulates the Xerox Workflow Management Web service methods.
 * 
 * @revision	09/28/2017 	TC	Created.
 *				05/21/2018	TC	Updated comments.
 *				01/03/2019  TC  Use XRX_SOAPSTART instead of XRX_SOAPSTART_MTOM.
 *				04/24/2019  TC  Added the xrxWorkflowManagementParseNextPageToken() function.
 *
 */
 
 var XRXWorkflowManagement = (function() {
	
	var XRX_WORKFLOWMANAGEMENT_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/WorkflowManagement/1"';
	var XRX_WORKFLOWMANAGEMENT_PATH = '/webservices/WorkflowManagement/1';
	
	function xrxEscape( text )
	{
		text = xrxReplaceChars( text, "<", "&lt;" );
		text = xrxReplaceChars( text, ">", "&gt;" );
		return text;
	}
	
	var methods = {
		
		// GetInterfaceVersion
		
		/**
		* This method calls Workflow Management Web service GetInterfaceVersion.
		*
		* @function xrxWorkflowManagementGetInterfaceVersion
		* @param {Object} params - The parameters for calling GetInterfaceVersion.
		* @param {string} params.url - The device address.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @param {boolean} [params.async=true] - make asynchronous call if true,
		* 										make synchronous call if false
		* @return {string} Blank string or comm error beginning with "FAILURE" if async == true,
		*           		response or comm error beginning with "FAILURE" if async == false.
		*/
		xrxWorkflowManagementGetInterfaceVersion: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_WORKFLOWMANAGEMENT_PATH;
			var sendReq = this.xrxWorkflowManagementGetInterfaceVersionRequest();
			xrxCallWebservice( sendUrl, sendReq, 
						params.callback_success, 
						params.callback_failure, 
						params.timeout );
		},
		
		/**
		*@function xrxWorkflowManagementGetInterfaceVersionRequest
		* @return {string} SOAP request for Workflow Management GetInterfaceVersion.
		*
		*/
		xrxWorkflowManagementGetInterfaceVersionRequest: function() {
			return XRX_SOAPSTART +
				xrxCreateTag( 'GetInterfaceVersionRequest', XRX_WORKFLOWMANAGEMENT_NAMESPACE, '' ) +
				XRX_SOAPEND;
		},
		
		/**
		* This method parse the GetInterfaceVersion response.
		*
		* @function xrxWorkflowManagementParseGetInterfaceVersion
		* @param {string} response - GetInterfaceVersion response
		* @returns {string} Version number in the format of Major.Minor.Revision
		*/
		xrxWorkflowManagementParseGetInterfaceVersion: function( response ) {
			var data = xrxStringToDom( response );
			return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
				+ xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
				+ xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
		},
		
		// ListFiles
		
		/**
		* This method calls ListFiles().
		*
		* @function xrxWorkflowManagementListFiles
		* @param {Object} params - The parameters for calling ListFiles
		* @param {string} params.url - The device address
		* @param {Object} params.payloadParams - The elements for building the ListFilesRequestPayload
		* @param {string} params.payloadParams.SourceUrl - the URL of the file or directory to retrieve 
		*							a listing for in accordance with RFC 1738.
		* @param {number} params.payloadParams.RequestTimeout - (optional) amount of seconds the MFD should
		*							wait for the external device to return the directory listing, 
		* 							default is 300, range is 30 to 432000.
		* @param {number} params.payloadParams.EntryCount - (optional) the number of entries to be returned 
		*                     		per call.
		* @param {string} params.payloadParams.NextPageToken - (optional) a token that the client provides 
		*							to indicate the next page of results to retrieve from the MFD. 
		*							The value is populated with the NextPageToken value returned by 
		*							the MFD in the ListFilesResponsePayload.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @param {boolean} [params.async=true] - make asynchronous call if true,
		* 										make synchronous call if false
		* @return {string} Blank string or comm error beginning with "FAILURE" if async == true,
		*           		response or comm error beginning with "FAILURE" if async == false.
		*
		*/
		xrxWorkflowManagementListFiles: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_WORKFLOWMANAGEMENT_PATH;
			var sendReq = this.xrxWorkflowManagementListFilesRequest( params.payloadParams );
			var headers = new Array();
			headers[0] = ['Content-Type', 'multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			return xrxCallWebservice( sendUrl, sendReq, 
						params.callback_success, 
						params.callback_failure, 
						params.timeout, headers );
		},
		
		/**
		*
		* @function xrxWorkflowManagementListFilesRequest
		* @param {Object} params - The elements for building the ListFilesRequestPayload
		* @param {string} params.SourceUrl - the URL of the file or directory to retrieve 
		*							a listing for in accordance with RFC 1738.
		* @param {number} params.RequestTimeout - (optional) amount of seconds the MFD should
		*							wait for the external device to return the directory listing, 
		* 							default is 300, range is 30 to 432000.
		* @param {number} params.EntryCount - (optional) the number of entries to be returned 
		*                     		per call.
		* @param {string} params.NextPageToken - (optional) a token that the client provides 
		*							to indicate the next page of results to retrieve from the MFD. 
		*							The value is populated with the NextPageToken value returned by 
		*							the MFD in the ListFilesResponsePayload.
		* @return {string} SOAP request for WorkflowManagement ListFiles.
		*
		*/
		xrxWorkflowManagementListFilesRequest: function( params ) {
			var payloadTags = xrxCreateTag( 'SourceUrl', '', params.SourceUrl );
			payloadTags += xrxCreateTag( 'RequestTimeout', '', params.RequestTimeout || '' );
			payloadTags += xrxCreateTag( 'EntryCount', '', params.EntryCount || '' );
			payloadTags += xrxCreateTag( 'NextPageToken', '', params.NextPageToken || '' );
			
			var payloadStr = '<?xml version="1.0" encoding="utf-8"?>' + 
				xrxCreateTag( 'ListFilesRequestPayload', XRX_WORKFLOWMANAGEMENT_NAMESPACE, payloadTags );
				
			return XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART +
				xrxCreateTag( 'ListFilesRequest', XRX_WORKFLOWMANAGEMENT_NAMESPACE, 
					xrxCreateTag( 'WorkflowManagementSchema_ListFilesRequestPayload', '', 
					xrxEscape( payloadStr ))) +
				XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
		},
		
		/**
		*
		* @function xrxWorkflowManagementParseListFiles
		* @param {string} response - ListFiles response
		* @return {array}  an array of objects representing directory entry
		*
		*/
		xrxWorkflowManagementParseListFiles: function( response ) {
			var entries = [];

			var list = xrxStringToDom( findMtomData( response, "<ListFilesResponsePayload", ">" ) );
			while ((list != null) && ( list.childNodes[0] != null ) && ((list.childNodes[0].localName != "DirEntry" ))) {
				list = list.firstChild;
			}
		
			if ( list != null ) {
				var size = list.childNodes.length;
					
				for (var i = 0; i < size; i++) {
					if(list.childNodes[i].localName == "DirEntry") {
						var eNode = list.childNodes[i];
						var entry = {};
						var attrList = xrxFindElements( eNode, 'Attribute' );
						for (var j = 0; j < attrList.length; j++) {
							var attrName = xrxGetValue(xrxFindElement(attrList[j], ['AttrName']));
							entry[attrName] = xrxGetValue(xrxFindElement(attrList[j], ['AttrValue']));
						}
						entry.FileType = xrxGetValue(xrxFindElement(eNode, ['FileType']));
						entry.FileName = xrxGetValue(xrxFindElement(eNode, ['FileName']));
						entries.push( entry );
					}
				}
			}
			
			return entries;
		},
		
		/**
		*
		* @function xrxWorkflowManagementParseNextPageToken
		* @param {string} response - ListFiles response
		* @return {string}  The NextPageToken string
		*
		*/
		xrxWorkflowManagementParseNextPageToken: function( response ) {
			var resNode = xrxStringToDom( findMtomData( response, "<?xml", ">" ) );
			var nextPageToken = xrxGetElementValue( resNode, "NextPageToken" );
			return nextPageToken;
		},
		
		// InitiateJob
		
		/**
		*
		* @function xrxWorkflowManagementInitiateJob
		* @param {Object} params - The parameters for calling InitiateJob
		* @param {string} params.url - The device address
		* @param {string} params.jobTicket - The Workflow Management Job Ticket in escaped XML.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @param {boolean} [params.async=true] - make asynchronous call if true,
		* 										make synchronous call if false
		* @return {string} Blank string or comm error beginning with "FAILURE" if async == true,
		*           		response or comm error beginning with "FAILURE" if async == false.
		*
		*/
		xrxWorkflowManagementInitiateJob: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_WORKFLOWMANAGEMENT_PATH;
			var sendReq = this.xrxWorkflowManagementInitiateJobRequest( params.jobTicket );
			return xrxCallWebservice( sendUrl, sendReq, 
						params.callback_success, 
						params.callback_failure, 
						params.timeout );
		},
		
		/**
		*
		* @function xrxWorkflowManagementInitiateJobRequest
		* @param {string} jobTicket - The Workflow Management Job Ticket in escaped form.
		* @return {string} SOAP request for Workflow Management InitiateJob.
		*
		*/
		xrxWorkflowManagementInitiateJobRequest: function( jobTicket ) {
			return XRX_SOAPSTART +
					xrxCreateTag( 'InitiateJobRequest', XRX_WORKFLOWMANAGEMENT_NAMESPACE, 
						xrxCreateTag( 'JobModelSchemaCommon_WorkflowJobTicket', '', xrxEscape(jobTicket) ) ) +
					XRX_SOAPEND;
		},
		
		/**
		*
		* @function xrxWorkflowManagementParseInitiateJob
		* @param {string} response - Workflow Management InitiateJob response
		* @return {string} jobId
		*/
		xrxWorkflowManagementParseInitiateJob: function( response ) {
			var data = xrxFindElement( xrxStringToDom( response ), ['InitiateJobResponse', 'JobId'] );
			return xrxGetValue( data );
		},
		
		// CreateDirectory
		
		/**
		* This method calls CreateDirectory()
		*
		* @function xrxWorkflowManagementCreateDirectory
		* @param {Object} params - The parameters for calling CreateDirectory
		* @param {string} params.url - The device address
		* @param {Object} params.payloadParams - The elements for building the ListFilesRequestPayload
		* @param {string} params.payloadParams.SourceUrl - the URL of the file or directory to retrieve 
		*							a listing for in accordance with RFC 1738.
		* @param {number} params.payloadParams.RequestTimeout - (optional) amount of seconds the MFD should
		*							wait for the external device to return the directory listing, 
		* 							default is 300, range is 30 to 432000.
		* @param {number} params.payloadParams.EntryCount - (optional) the number of entries to be returned 
		*                     		per call.
		* @param {string} params.payloadParams.NextPageToken - (optional) a token that the client provides 
		*							to indicate the next page of results to retrieve from the MFD. 
		*							The value is populated with the NextPageToken value returned by 
		*							the MFD in the ListFilesResponsePayload.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @param {boolean} [params.async=true] - make asynchronous call if true,
		* 										make synchronous call if false
		* @return {string} Blank string or comm error beginning with "FAILURE" if async == true,
		*           		response or comm error beginning with "FAILURE" if async == false.
		*
		*/ 
		xrxWorkflowManagementCreateDirectory: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_WORKFLOWMANAGEMENT_PATH;
			var sendReq = this.xrxWorkflowManagementCreateDirectoryRequest( params.payloadParams );
			return xrxCallWebservice( sendUrl, sendReq, 
						params.callback_success, 
						params.callback_failure, 
						params.timeout ); 	
		},
		
		/**
		* @function xrxWorkflowManagementCreateDirectoryRequest
		* @param {Object} params - The elements for building the ListFilesRequestPayload
		* @param {string} params.SourceUrl - the URL of the file or directory to retrieve 
		*							a listing for in accordance with RFC 1738.
		* @param {number} params.RequestTimeout - (optional) amount of seconds the MFD should
		*							wait for the external device to return the directory listing, 
		* 							default is 300, range is 30 to 432000.
		* @param {number} params.EntryCount - (optional) the number of entries to be returned 
		*                     		per call.
		* @param {string} params.NextPageToken - (optional) a token that the client provides 
		*							to indicate the next page of results to retrieve from the MFD. 
		*							The value is populated with the NextPageToken value returned by 
		*							the MFD in the ListFilesResponsePayload.
		* @return {string} SOAP request for WorkflowManagement ListFiles.
		*
		*/
		xrxWorkflowManagementCreateDirectoryRequest: function( params ) {
			var payloadTags = xrxCreateTag( 'SourceUrl', '', params.SourceUrl );
			payloadTags += xrxCreateTag( 'RequestTimeout', '', params.RequestTimeout || '' );
			payloadTags += xrxCreateTag( 'EntryCount', '', params.EntryCount || '' );
			payloadTags += xrxCreateTag( 'NextPageToken', '', params.NextPageToken || '' );
			
			var payloadStr = '<?xml version="1.0" encoding="utf-8"?>' + 
				xrxCreateTag( 'ListFilesRequestPayload', XRX_WORKFLOWMANAGEMENT_NAMESPACE, payloadTags );
				
			return XRX_SOAPSTART +
				xrxCreateTag( 'CreateDirectoryRequest', XRX_WORKFLOWMANAGEMENT_NAMESPACE, 
					xrxCreateTag( 'WorkflowManagementSchema_ListFilesRequestPayload', '', 
					xrxEscape( payloadStr ))) +
				XRX_SOAPEND; 
		},
		
		/**
		* @function xrxWorkflowManagementParseCreateDirectory
		* @param {string} response - ListFiles response
		* @return {array}  an array of objects representing directory entry
		*
		*/
		xrxWorkflowManagementParseCreateDirectory: function( response ) {
			var entries = [];
			var data = xrxStringToDom( response );
			var payload = xrxGetValue( xrxFindElement( data, ['CreateDirectoryResponse', 'WorkflowManagementSchema_ListFilesRequestPayload'] ) );
			var list = xrxStringToDom( unescape( payload ) );
			while ((list != null) && ( list.childNodes[0] != null ) && ((list.childNodes[0].localName != "DirEntry" ))) {
				list = list.firstChild;
			}
		
			if ( list != null ) {
				var size = list.childNodes.length;
					
				for (var i = 0; i < size; i++) {
					if(list.childNodes[i].localName == "DirEntry") {
						var eNode = list.childNodes[i];
						var entry = {};
						var attrList = xrxFindElements( eNode, 'Attribute' );
						for (var j = 0; j < attrList.length; j++) {
							var attrName = xrxGetValue(xrxFindElement(attrList[j], ['AttrName']));
							entry[attrName] = xrxGetValue(xrxFindElement(attrList[j], ['AttrValue']));
						}
						entry.FileType = xrxGetValue(xrxFindElement(eNode, ['FileType']));
						entry.FileName = xrxGetValue(xrxFindElement(eNode, ['FileName']));
						entries.push( entry );
					}
				}
			}
			
			return entries;
		},
	};
	return methods;
 }());