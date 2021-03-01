/*
 * XRXNetworkConfig.js
 * Copyright (C) Xerox Corporation, 2019.  All rights reserved.
 * 
 * This file contains the functions to make Network Config Web service calls.
 *
 * @revision	05/17/2019	TC	Initial version.
 *
 */
 
var XRXNetworkConfig = (function() {
	
	var XRX_NETWORKCONFIG_ACTION = 'http://xml.namespaces.xerox.com/enterprise/XConfig-Network/1';
	var XRX_NETWORKCONFIG_NAMESPACE = 'xmlns="' + XRX_NETWORKCONFIG_ACTION + '"';
	var XRX_NETWORKCONFIG_PATH = '/webservices/XConfig-Network/01';
	
	var methods = {
		
		// Network Config Get Interface Version
		
		/**
		* This function gets the interface version and returns the parsed values.
		*
		* @function xrxNetworkConfigGetInterfaceVersion
		* @param {Object} params - The parameters for calling GetInterfaceVersion.
		* @param {string} params.url - The device address.
		* @param {string} params.callback_success - function to callback upon successful completion
		* @param {string} params.callback_failure - function to callback upon failed completion
		* @param {number} [params.timeout=0] - amount of seconds to wait before calling 
		*									the callback_failure routine (0 = no timeout)
		* @return {string} Blank string or comm error beginning with "FAILURE"
		*
		*/
		xrxNetworkConfigGetInterfaceVersion: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_NETWORKCONFIG_PATH;
			var sendReq = this.xrxNetworkConfigGetInterfaceVersionRequest( url );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/**
		* This function builds the interface version request.
		*
		* @private
		*
		* @return {string}	xml request
		*/
		xrxNetworkConfigGetInterfaceVersionRequest: function( url ) {
			var result = XRX_SOAPSTART 
					+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_NETWORKCONFIG_NAMESPACE, '' ) 
					+ XRX_SOAPEND;
			var action = XRX_NETWORKCONFIG_ACTION + "/GetInterfaceVersion";
			var to = url + "/";
			result = addWsAddressingHeader( result, action, to );
			return result;
		},
		
		/**
		* This function get proxy configuration.
		*
		* @function xrxNetworkConfigGetProxy
		* @param {Object}	params - The parameters for calling GetProxy
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
		xrxNetworkConfigGetProxy: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_NETWORKCONFIG_PATH;
			var sendReq = this.xrxNetworkConfigGetProxyRequest( sendUrl, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Network Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxNetworkConfigGetProxyRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'GetProxyRequest', XRX_NETWORKCONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND;
			var action = XRX_NETWORKCONFIG_ACTION + "/GetProxy";
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
		* @return {object}	The Config node in the response
		*/
		xrxNetworkConfigParseGetProxy: function( response )
		{
			var config = xrxGetTheElement( xrxStringToDom(response), "Config" );
			return config;
		},		
		
		/**
		* This function sets proxy
		*
		* @function xrxNetworkConfigSetProxy
		* @param {Object}	params - The parameters for calling SetProxy
		* @param {string}	params.url - The device address
		* @param {string}   params.proxyConfigTag - proxy config tags as a string.
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
		xrxNetworkConfigSetProxy: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_NETWORKCONFIG_PATH;
			var sendReq = this.xrxNetworkConfigSetProxyRequest( sendUrl, params.proxyConfigTag, params.username, params.password, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, null, null, null, true );
		},  		

		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Network Config path
		* @param {string}   proxyConfigTag - proxy config tags as a string.
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxNetworkConfigSetProxyRequest: function( sendUrl, proxyConfigTag, username, password, type )
		{
			var result = XRX_SOAPSTART
				+ xrxCreateTag( 'SetProxyRequest', XRX_NETWORKCONFIG_NAMESPACE, proxyConfigTag ) 
				+ XRX_SOAPEND;
			var action = XRX_NETWORKCONFIG_ACTION + "/SetProxyEnabled";
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
		* This function get network configuration.
		*
		* @function xrxNetworkConfigGetNetworkConfig
		* @param {Object}	params - The parameters for calling GetProxy
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
		xrxNetworkConfigGetNetworkConfig: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_NETWORKCONFIG_PATH;
			var sendReq = this.xrxNetworkConfigGetNetworkConfigRequest( sendUrl, params.username, params.password, params.passwordType );
			var headers = new Array();
			headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout, headers, null, null, true );
		}, 		
		
		/**
		* This function builds the request.
		*
		* @param {string}	sendUrl 	The device address with the Network Config path
		* @param {string}	username	Admin username or network authentication username 
		* @param {string}	password	Admin password or network authentication password 
		* @param {string}  [type="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
		* @return {string}  xml request
		*/
		xrxNetworkConfigGetNetworkConfigRequest: function( sendUrl, username, password, type )
		{
			var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
				+ xrxCreateTag( 'GetNetworkConfigRequest', XRX_NETWORKCONFIG_NAMESPACE, "" ) 
				+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
			var action = XRX_NETWORKCONFIG_ACTION + "/GetNetworkConfig";
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
		* @return {string}	The NetworkConfigOptionsPayload in string form
		*/
		xrxNetworkConfigParseGetNetworkConfig: function( response )
		{
			var nwConfig = findMtomData( response, '<NetworkConfigOptionsPayload', '>' )
			return nwConfig;
		},		
	};
	return methods;
}());