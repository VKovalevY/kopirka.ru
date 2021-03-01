/*
 * XRXUIConfig.js
 * Copyright (C) Xerox Corporation, 2019.  All rights reserved.
 * 
 * This file contains the functions to make UI Config Web service calls.
 *
 * @revision	03/13/2019	TC	Initial version.
 *
 */
 
var XRXUIConfig = (function() {
	
	var XRX_UICONFIG_ACTION = 'http://xml.namespaces.xerox.com/enterprise/XConfig-UI/1';
	var XRX_UICONFIG_NAMESPACE = 'xmlns="' + XRX_UICONFIG_ACTION + '"';
	var XRX_UICONFIG_PATH = '/webservices/XConfig-UI/01';
	
	var methods = {
		
		// UI Config Get Interface Version
		
		/**
		* This function gets the interface version and returns the parsed values.
		*
		* @function xrxUIConfigGetInterfaceVersion
		* @param {Object} params - The parameters for calling GetInterfaceVersion.
		* @param {string} params.url - The device address.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxUIConfigGetInterfaceVersion: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigGetInterfaceVersionRequest( url );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/**
		* This function builds the interface version request.
		*
		* @private
		*
		* @return {string}	xml request
		*/
		xrxUIConfigGetInterfaceVersionRequest: function( url ) {
			var result = XRX_SOAPSTART 
					+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_UICONFIG_NAMESPACE, '' ) 
					+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/GetInterfaceVersion";
			var to = url + "/";
			result = addWsAddressingHeader( result, action, to );
			return result;
		},
		
		/**
		* This function gets the list of pathways.
		*
		* @function xrxWsXConfigEnumeratePathwayList
		* @param {Object}	params - The parameters for calling EnumeratePathwayList
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
		xrxUIConfigEnumeratePathwayList: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigEnumeratePathwayListRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigEnumeratePathwayListRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'EnumeratePathwayListRequest', XRX_UICONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/EnumeratePathwayList";
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
		* @return {array}   an array of pathway names
		*/
		xrxUIConfigParseEnumeratePathwayList: function( response )
		{
			var result = new Array();
			var list = xrxFindElements( xrxStringToDom( response ), "Pathway" );
			if(list == null) {
				list = new Array();
			}
			for(var i = 0; i < list.length; i++) {
				result[i] = xrxGetElementValue( list[i], "Name" );
			}
			return result;
		},		
		
		/**
		* This function gets the default pathway.
		*
		* @function xrxWsXConfigGetDefaultPathway
		* @param {Object}	params - The parameters for calling GetDefaultPathway
		* @param {string}	params.url - The device address
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
		xrxUIConfigGetDefaultPathway: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigGetDefaultPathwayRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigGetDefaultPathwayRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetDefaultPathwayRequest', XRX_UICONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/GetDefaultPathway";
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
		* @return {string}   the default pathway
		*/
		xrxUIConfigParseGetDefaultPathway: function( response )
		{
			var data = xrxFindElement( xrxStringToDom( response ), ["Pathway","Name"] );
			return xrxGetValue( data );
		},		
		
		/**
		* This function sets the default pathway.
		*
		* @function xrxWsXConfigSetDefaultPathway
		* @param {Object}	params - The parameters for calling GetDefaultPathway
		* @param {string}	params.url - The device address
		* @param {string}	params.pathway - Name of the pathway
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
		xrxUIConfigSetDefaultPathway: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigSetDefaultPathwayRequest( sendUrl, params.pathway, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigSetDefaultPathwayRequest: function( sendUrl, pathway, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'SetDefaultPathwayRequest', XRX_UICONFIG_NAMESPACE, 
					xrxCreateTag( 'Pathway', '', xrxCreateTag( 'Name', '', pathway ) ) )
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/SetDefaultPathway";
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
		* This function gets the list of applications.
		*
		* @function xrxUIConfigEnumerateApplicationList
		* @param {Object}	params - The parameters for calling EnumeratePathwayList
		* @param {string}	params.url - The device address
		* @param {string}	params.pathway - The pathway name
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
		xrxUIConfigEnumerateApplicationList: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigEnumerateApplicationListRequest( sendUrl, params.pathway, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	pathway		The pathway name
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigEnumerateApplicationListRequest: function( sendUrl, pathway, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'EnumerateApplicationListRequest', XRX_UICONFIG_NAMESPACE, 
					xrxCreateTag( 'Pathway', '', xrxCreateTag( 'Name', '', pathway ) ) ) 
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/EnumerateApplicationList";
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
		* @return {array}   an array of application object: {name: nameVal, vendor: [vendorVal, isNative: isNativeVal}
		*/
		xrxUIConfigParseEnumerateApplicationList: function( response )
		{
			var applications = [];
			var nodes = xrxFindElements( xrxStringToDom( response ), "Application" );
			nodes.forEach( function(node) {
				var application = {
					name: null,
					vendor: null,
					isNative: true
				};
				application.name = xrxGetValue(xrxFindElement(node, ['Name']));
				application.vendor = xrxGetValue(xrxFindElement(node, ['Vendor']));
				application.isNative = xrxGetValue(xrxFindElement(node, ['IsNative']));
				applications.push( application );
			});
			return applications;
		},	

		/**
		* This function gets the default pathway.
		*
		* @function xrxWsXConfigGetDefaultPathway
		* @param {Object}	params - The parameters for calling GetDefaultPathway
		* @param {string}	params.url - The device address
		* @param {string}	params.pathway - The pathway name
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
		xrxUIConfigGetPathwayDefaultApplication: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigGetPathwayDefaultApplicationRequest( sendUrl, params.pathway, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the GetPathwayDefaultApplication request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	pathway 	The pathway name
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigGetPathwayDefaultApplicationRequest: function( sendUrl, pathway, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetPathwayDefaultApplicationRequest', XRX_UICONFIG_NAMESPACE, 
					xrxCreateTag( 'Pathway', '', xrxCreateTag( 'Name', '', pathway ) ) )
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/GetPathwayDefaultApplication";
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
		* @return {object}   the default application for a given pathway: {name: nameVal, vendor: [vendorVal, isNative: isNativeVal}
		*/
		xrxUIConfigParseGetPathwayDefaultApplication: function( response )
		{
			var application = {
				name: null,
				vendor: null,
				isNative: false
			};
			application.name = xrxGetValue(xrxFindElement( xrxStringToDom( response ), ["GetPathwayDefaultApplicationResponse", "Name"] ));
			application.vendor = xrxGetValue(xrxFindElement( xrxStringToDom( response ), ["GetPathwayDefaultApplicationResponse", "Vendor"] ));
			application.isNative = xrxGetValue(xrxFindElement( xrxStringToDom( response ), ["GetPathwayDefaultApplicationResponse", "IsNative"] ));
			return application;
		},	

		/**
		* This function sets the default pathway.
		*
		* @function xrxWsXConfigGetDefaultPathway
		* @param {Object}	params - The parameters for calling GetDefaultPathway
		* @param {string}	params.url - The device address
		* @param {string}	params.pathway - The pathway name
		* @param {object}	params.application - The application object
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
		xrxUIConfigSetPathwayDefaultApplication: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigSetPathwayDefaultApplicationRequest( sendUrl, params.pathway, params.application, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the SetPathwayDefaultApplication request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	pathway 	The pathway name
		* @param {object}	application The application object
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigSetPathwayDefaultApplicationRequest: function( sendUrl, pathway, application, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'SetPathwayDefaultApplicationRequest', XRX_UICONFIG_NAMESPACE,
					xrxCreateTag( 'Pathway', '', 
						xrxCreateTag( 'Name', '', pathway ) )
					+ xrxCreateTag( 'Application', '', 
						xrxCreateTag( 'Name', '', application.name )
						+ xrxCreateTag( 'Vendor', '', application.vendor )
						+ xrxCreateTag( 'IsNative','', application.isNative ) ) )
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/SetPathwayDefaultApplication";
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
		* This function gets the default DADH application
		*
		* @function xrxWsXConfigGetDefaultPathway
		* @param {Object}	params - The parameters for calling GetDefaultPathway
		* @param {string}	params.url - The device address
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
		xrxUIConfigGetDADHDefaultApplication: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigGetDADHDefaultApplicationRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the GetDADHDefaultApplication request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigGetDADHDefaultApplicationRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetDADHDefaultApplicationRequest', XRX_UICONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/GetDADHDefaultApplication";
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
		* @return {object}   the default DADH application
		*/
		xrxUIConfigParseGetDADHDefaultApplication: function( response )
		{
			var application = {
				name: null,
				vendor: null,
				isNative: false
			};
			application.name = xrxGetValue(xrxFindElement( xrxStringToDom( response ), ["GetDADHDefaultApplicationResponse", "Name"] ));
			application.vendor = xrxGetValue(xrxFindElement( xrxStringToDom( response ), ["GetDADHDefaultApplicationResponse", "Vendor"] ));
			application.isNative = xrxGetValue(xrxFindElement( xrxStringToDom( response ), ["GetDADHDefaultApplicationResponse", "IsNative"] ));
			return application;
		},		

		/**
		* This function sets the default DADH application
		*
		* @function xrxWsXConfigGetDefaultPathway
		* @param {Object}	params - The parameters for calling GetDefaultPathway
		* @param {string}	params.url - The device address
		* @param {Object}	params.application - The default DADH application object
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
		xrxUIConfigSetDADHDefaultApplication: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_UICONFIG_PATH;
			var sendReq = this.xrxUIConfigSetDADHDefaultApplicationRequest( sendUrl, params.application, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the GetDADHDefaultApplication request.
		*
		* @param {string}	sendUrl 	The device address with the UI Config path
		* @param {object}	application The application object
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxUIConfigSetDADHDefaultApplicationRequest: function( sendUrl, application, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'SetDADHDefaultApplicationRequest', XRX_UICONFIG_NAMESPACE, 
					xrxCreateTag( 'Application', '', 
						xrxCreateTag( 'Name', '', application.name )
						+ xrxCreateTag( 'Vendor', '', application.vendor )
						+ xrxCreateTag( 'IsNative', '', application.isNative ) ) )
				+ XRX_SOAPEND;
			var action = XRX_UICONFIG_ACTION + "/SetDADHDefaultApplication";
			var to = sendUrl + "/";
			try {
				result = addWsSecurityHeader( result, username, password, type);
				result = addWsAddressingHeader( result, action, to);
			} catch(err){
				console.log("Error in addWsSecurityHeader() or addWsAddressingHeader()" + err.message);
			}
			return result;
		},		
	};
	return methods;
}());