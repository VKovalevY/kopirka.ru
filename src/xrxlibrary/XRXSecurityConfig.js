/*
 * XRXSecurityConfig.js
 * Copyright (C) Xerox Corporation, 2019.  All rights reserved.
 * 
 * This file contains the functions to make Security Config Web service calls.
 *
 * @revision	11/15/2018	TC	Initial version.
 *
 */
 
var XRXSecurityConfig = (function() {
	
	var XRX_SECURITYCONFIG_ACTION = 'http://xml.namespaces.xerox.com/enterprise/XConfig-Security/1';
	var XRX_SECURITYCONFIG_NAMESPACE = 'xmlns="' + XRX_SECURITYCONFIG_ACTION + '"';
	var XRX_SECURITYCONFIG_PATH = '/webservices/XConfig-Security/01';
	
	var DEFAULT_URL = "http://127.0.0.1";
	
	var methods = {
		
		// GetInterfaceVersion()
		
		/**
		* This function gets the interface version and returns the parsed values.
		*
		* @function xrxSecurityConfigGetInterfaceVersion
		* @param {Object} params - The parameters for calling GetInterfaceVersion.
		* @param {string} params.url - The device address.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigGetInterfaceVersion: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigGetInterfaceVersionRequest( url );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/**
		* This function builds the interface version request.
		*
		* @private
		*
		* @return {string}	xml request
		*/
		xrxSecurityConfigGetInterfaceVersionRequest: function( url ) {
			var result = XRX_SOAPSTART 
					+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SECURITYCONFIG_NAMESPACE, '' ) 
					+ XRX_SOAPEND;
			var action = XRX_SECURITYCONFIG_ACTION + "/GetInterfaceVersion";
			var to = url + "/";
			result = addWsAddressingHeader( result, action, to );
			return result;
		},
		
		// GetSSLStatus()
		
		/**
		* This function gets the SSL Status
		*
		* @function xrxWsXConfigGetSSLStatus
		* @param {Object}	params - The parameters for calling GetSSLStatus
		* @param {string}	params.url - The device address
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or  authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigGetSSLStatus: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigGetSSLStatusRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigGetSSLStatusRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetSSLStatusRequest', XRX_SECURITYCONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_SECURITYCONFIG_ACTION + "/GetSSLStatus";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},

		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @return {string}	Response data
		*/
		xrxSecurityConfigParseGetSSLStatus: function( response )
		{
			return xrxGetElementValue( xrxStringToDom(response), "ResponseData" );
		},	

		// SetSSLStatus()
		
		/**
		* This function sets the SSL Status
		*
		* @function xrxSecurityConfigSetSSLStatus
		* @param {Object}	params - The parameters for calling SetSSLStatus
		* @param {string}	params.url - The device address
		* @param {boolean}   params.sslState - the desired state of SSL
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} 	[params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} 	params.callback_success - function to callback upon successful completion
		* @param {string} 	params.callback_failure - function to callback upon failed completion
		* @param {number} [	params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigSetSSLStatus: function( params )
		{
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigSetSSLStatusRequest( sendUrl, params.sslState, params.username, params.password, params.passwordType );
			console.log(sendReq);
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {boolean}  sslState 	the desired state of SSL
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigSetSSLStatusRequest: function( sendUrl, sslState, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'SetSSLStatusRequest', XRX_SECURITYCONFIG_NAMESPACE, xrxCreateTag( 'ProvidedData', '', sslState) ) 
				+ XRX_SOAPEND;
			var action = XRX_SECURITYCONFIG_ACTION + "/SetSSLStatus";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},

		// GetFIPSCapability()

		/**
		* This function gets the FIPS Capability
		*
		* @function xrxSecurityConfigGetFIPSCapability
		* @param {Object}	params - The parameters for calling GetFIPSCapability
		* @param {string}	params.url - The device address
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigGetFIPSCapability: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigGetFIPSCapabilityRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigGetFIPSCapabilityRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetFIPSCapabilityRequest', XRX_SECURITYCONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_SECURITYCONFIG_ACTION + "/GetFIPSCapability";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @return {string}	Response data
		*/
		xrxSecurityConfigParseGetFIPSCapability: function( response )
		{
			var node = xrxStringToDom( response );
			return xrxGetElementValue( node, 'ResponseData' );
		},	

		// GetFIPSMode()

		/**
		* This function gets the FIPS Mode
		*
		* @function xrxSecurityConfigGetFIPSMode
		* @param {Object}	params - The parameters for calling GetFIPSMode
		* @param {string}	params.url - The device address
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigGetFIPSMode: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigGetFIPSCapabilityRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		
		
		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigGetFIPSModeRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetFIPSModeRequest', XRX_SECURITYCONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_SECURITYCONFIG_ACTION + "/GetFIPSMode";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @return {string}	Response data
		*/
		xrxSecurityConfigParseGetFIPSMode: function( response )
		{
			var node = xrxStringToDom( response );
			return xrxGetElementValue( node, 'ResponseData' );
		},		
		
		// GetServerCertificate()

		/**
		* This function gets the server certificate
		*
		* @function xrxSecurityConfigGetServerCertificate
		* @param {Object}	params - The parameters for calling GetServerCertificate
		* @param {string}	params.url - The device address
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigGetServerCertificate: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigGetServerCertificateRequest( sendUrl, params.username, params.password, params.passwordType );
			console.log(sendReq);
			var headers = new Array();
			headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, headers, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigGetServerCertificateRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
				+ xrxCreateTag( 'GetServerCertificateRequest', XRX_SECURITYCONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			var action = XRX_SECURITYCONFIG_ACTION + "/GetServerCertificate";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			console.log("result: " + result);
			return result;
		},
		
		
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @param {string}   beginStr    beginning string of the certificate, e.g. "----BEGIN CERTIFICATE----"
		* @param {string}   endStr      end string of the certificate, e.g. "----END CERTIFICATE----"
		* @return {string}  the certificate or an empty string if the certificate isn't found
		*/
		xrxSecurityConfigParseGetServerCertificate: function( response, beginStr, endStr )
		{
			var index = response.indexOf( beginStr );
			var str = response.substring(index);

			if(index > 0){
				return str.substring( 0, str.indexOf( endStr ) + endStr.length );
			} else {
				return '';
			}
		},		
		
		// CreateSelfSignedCertificate()

		/**
		* This function sets the server certificate
		*
		* @function xrxSecurityConfigCreateSelfSignedCertificate
		* @param {Object}	params - The parameters for calling CreateSelfSignedCertificate
		* @param {string}	params.url - The device address
		* @param {string}  	params.certTag	- certification tags as a string.
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigCreateSelfSignedCertificate: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigCreateSelfSignedCertificateRequest( params.certTag, sendUrl, params.username, params.password, params.passwordType );
			
			var headers = new Array();
			headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, headers, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}   certTag		A xml string that contains the certificate tags in the request
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigCreateSelfSignedCertificateRequest: function( certTag, sendUrl, username, password, type )
		{
			var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
				+ xrxCreateTag( 'CreateSelfSignedCertificateRequest', XRX_SECURITYCONFIG_NAMESPACE, certTag ) 
				+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			var action = XRX_SECURITYCONFIG_ACTION + "/CreateSelfSignedCertificate";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @param {string}   beginStr    beginning string of the certificate, e.g. "----BEGIN CERTIFICATE----"
		* @param {string}   endStr      end string of the certificate, e.g. "----END CERTIFICATE----"
		* @return {string}  the certificate or an empty string if the certificate isn't found
		*/
		xrxSecurityConfigParseCreateSelfSignedCertificate: function( response, beginStr, endStr )
		{
			var index = response.indexOf( beginStr );
			var str = response.substring(index);

			if(index > 0){
				return str.substring( 0, str.indexOf( endStr ) + endStr.length );
			} else {
				return '';
			}
		},
				
		
		// AddCertificate()

		/**
		* This function uploads a certificate to the device, regardless of the type
		*
		* @function xrxSecurityConfigAddCertificate
		* @param {Object}	params - The parameters for calling AddCertificate
		* @param {string}	params.url - The device address
		* @param {string}   params.cert - The binary certificate to upload
		* @param {string}	[params.certPassword=""] - An optional element to specify a password to access the certificate
		* @param {string}	[params.friendlyName=""] - An optional element to specify the friendly name of the certificate
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigAddCertificate: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigAddCertificateRequest( params.cert, params.certPassword, params.friendlyName, sendUrl, params.username, params.password, params.passwordType );
			
			var headers = new Array();
			headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, headers, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}   cert	The binary certificate to upload
		* @param {string}	[certPassword=""]	An optional element to specify a password to access the certificate
		* @param {string}	[friendlyName=""]	An optional element to specify the friendlyName of the certificate
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigAddCertificateRequest: function( cert, certPassword, friendlyName, sendUrl, username, password, type )
		{
			var XRX_MIME_HEADER_TWO = 'content-id: <1.635101843208985196@example.org>\r\n'
				+ 'content-type: application/octet-stream\r\n'
				+ 'content-transfer-encoding: binary\r\n\r\n';
				
			var XRX_MIME_BOUNDARY_END_TWO = '\r\n----MIMEBoundary635101843208985196--\r\n';
			
			var XRX_BYTES_CID = '<xop:Include href="cid:1.635101843208985196@example.org" />';

			var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART_MTOM_V2
				+ xrxCreateTag( 'AddCertificateRequest', XRX_SECURITYCONFIG_NAMESPACE, 
					xrxCreateTag('Bytes', '', XRX_BYTES_CID) + xrxCreateTag('passWordCertificate', '', certPassword) + xrxCreateTag('friendlyName', '', friendlyName) )
				+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END + XRX_MIME_HEADER_TWO + cert + XRX_MIME_BOUNDARY_END_TWO;
		
			var action = XRX_SECURITYCONFIG_ACTION + "/AddCertificate";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},		
		
		// GetCertificate()
		
		/**
		* This function gets the certificate
		*
		* @function xrxSecurityConfigGetCertificate
		* @param {Object}	params - The parameters for calling GetServerCertificate
		* @param {string}	params.url - The device address
		* @param {string}   params.certInfoTag - The CertificateInfo tag as a string
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigGetCertificate: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigGetCertificateRequest( params.certInfoTag, sendUrl, params.username, params.password, params.passwordType );
			
			var headers = new Array();
			headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, headers, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}   certInfoTag The CertificateInfo tag as a string
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigGetCertificateRequest: function( certInfoTag, sendUrl, username, password, type )
		{
			var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
				+ xrxCreateTag( 'GetCertificateRequest', XRX_SECURITYCONFIG_NAMESPACE, certInfoTag ) 
				+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			var action = XRX_SECURITYCONFIG_ACTION + "/GetCertificate";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @param {string}   beginStr    beginning string of the certificate, e.g. "----BEGIN CERTIFICATE----"
		* @param {string}   endStr      end string of the certificate, e.g. "----END CERTIFICATE----"
		* @return {string}  the certificate or an empty string if the certificate isn't found
		*/
		xrxSecurityConfigParseGetCertificate: function( response, beginStr, endStr )
		{
			var index = response.indexOf( beginStr );
			var str = response.substring(index);

			if(index > 0){
				return str.substring( 0, str.indexOf( endStr ) + endStr.length );
			} else {
				return '';
			}
		},		


		// RemoveCertificate()
		
		/**
		* This function gets the certificate
		*
		* @function xrxSecurityConfigRemoveCertificate
		* @param {Object}	params - The parameters for calling RemoveCertificate
		* @param {string}	params.url - The device address
		* @param {string}   params.certInfoTag - The CertificateInfo tag as a string
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigRemoveCertificate: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigRemoveCertificateRequest( params.certInfoTag, sendUrl, params.username, params.password, params.passwordType );
			
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}   certInfoTag The CertificateInfo tag as a string
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigRemoveCertificateRequest: function( certInfoTag, sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'RemoveCertificateRequest', XRX_SECURITYCONFIG_NAMESPACE, certInfoTag ) 
				+ XRX_SOAPEND;
			var action = XRX_SECURITYCONFIG_ACTION + "/RemoveCertificate";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @param {string}   beginStr    beginning string of the certificate, e.g. "----BEGIN CERTIFICATE----"
		* @param {string}   endStr      end string of the certificate, e.g. "----END CERTIFICATE----"
		* @return {string}  the certificate or an empty string if the certificate isn't found
		*/
		xrxSecurityConfigParseRemoveCertificate: function( response, beginStr, endStr )
		{
			var index = response.indexOf( beginStr );
			var str = response.substring(index);

			if(index > 0){
				return str.substring( 0, str.indexOf( endStr ) + endStr.length );
			} else {
				return '';
			}
		},
		
		// ListCertificates()
		
		/**
		* This function lists the certificates
		*
		* @function xrxSecurityConfigListCertificates
		* @param {Object}	params - The parameters for calling ListCertificates
		* @param {string}	params.url - The device address
		* @param {string}   params.certInfoTag - The CertificateInfo tag as a string
		* @param {string}	params.username	- Admin username or network authentication username.
		* @param {string}	params.password	- Admin password or network authentication password.
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxSecurityConfigListCertificates: function( params ) {
			var url = params.url || DEFAULT_URL;
			var sendUrl = url + XRX_SECURITYCONFIG_PATH;
			var sendReq = this.xrxSecurityConfigListCertificatesRequest( params.certInfoTag, sendUrl, params.username, params.password, params.passwordType );
			
			var headers = new Array();
			headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, headers, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}   certInfoTag The CertificateInfo tag as a string
		* @param {string}	sendUrl 	The device address with the Security Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxSecurityConfigListCertificatesRequest: function( certInfoTag, sendUrl, username, password, type )
		{
			var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
				+ xrxCreateTag( 'ListCertificatesRequest', XRX_SECURITYCONFIG_NAMESPACE, certInfoTag ) 
				+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			var action = XRX_SECURITYCONFIG_ACTION + "/ListCertificates";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},
		
		/**
		* This function returns the parsed values.
		*
		* @param {string}	response	web service response in string form
		* @return {array}   An array of nodes with element name 'CertificateInfoList' 
		*/
		xrxSecurityConfigParseListCertificates: function( response )
		{
			return findMtomData( response, '<?xml version="1.0"', '>');
		},		
		
	};
	return methods;
}());
