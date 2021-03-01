/* 
 * XRXRegistration.js
 * Copyright (C) Xerox Corporation, 2015.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Registration Api Web services.
 *
 * @revision 02/26/2015		TC	 	Creation.
 *			 06/11/2015		TC		Use XRX_SOAP11_SOAPSTART instead of XRX_SOAPSTART.
 *			 03/23/2018     TC      Add PutRegistration.
 *			 05/21/2018		TC		Updated comments.
 *			 01/04/2019     TC      Call addWsSecurityHeader() instead of addWsSecurity().
 */

var XRXRegistration = (function() {

	var XRX_REGISTRATION_ACTION = 'http://www.xerox.com/webservices/office/cuiregistration/1';
	var XRX_REGISTRATION_NAMESPACE = 'xmlns="' + XRX_REGISTRATION_ACTION + '"';
	var XRX_REGISTRATION_PATH = '/webservices/office/cuiregistration/1';

	var methods = {
		
		//  Registration Get Interface Version

		/**
		* This function gets the interface version and returns the parsed values.
		*
		* @function xrxRegistrationGetInterfaceVersion
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
		*
		*/
		xrxRegistrationGetInterfaceVersion: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_REGISTRATION_PATH;
			var sendReq = this.xrxRegistrationGetInterfaceVersionRequest();
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/**
		* This function returns the parsed values.
		* 
		* @function xrxRegistrationParseGetInterfaceVersion
		* @param	{string} 	response	web service response in string form
		* @return	{string}	Major.Minor.Revision
		*/
		xrxRegistrationParseGetInterfaceVersion: function( response ) {
			var data = xrxStringToDom( response );
			return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
				+ xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
				+ xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
		},

		/**
		* This function builds the interface version request.
		*
		* @function xrxRegistrationGetInterfaceVersionRequest
		* @return	{string}	xml request
		*/
		xrxRegistrationGetInterfaceVersionRequest: function() {
			var result = XRX_SOAP11_SOAPSTART 
					+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_REGISTRATION_NAMESPACE, '' ) 
					+ XRX_SOAPEND;
			
			return result;
		},


		// List Registration

		/**
		* This function makes the ListRegistrations web service call
		*
		* @function xrxRegistrationListRegistrations
		* @param {Object} params - The parameters for calling ListRegistrations.
		* @param {string} params.url - The device address.
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
		xrxRegistrationListRegistrations: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_REGISTRATION_PATH;
			var sendReq = this.xrxRegistrationListRegistrationsRequest();
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/**
		* This function returns the parsed values.
		*
		* @function xrxRegistrationParseListRegistrations
		* @param	{string} 	response	web service response in string form
		* @return	{array} 	array of Registration elements or an empty array
		*/
		xrxRegistrationParseListRegistrations: function( response ) {
			var registrations = [];
			var rNodes = xrxFindElements( xrxStringToDom( response ), "element" );
			rNodes.forEach( function (node) {
				var registration = {
					name: null,
					checksum: null
				};
				registration.name = xrxGetValue(xrxFindElement(node, ['name']));
				registration.checksum = xrxGetValue(xrxFindElement(node, ['checksum']));
				registrations.push( registration );
			});
			return registrations;
		},

		/**
		* This function builds the list registrations request.
		*
		* @function xrxRegistrationListRegistrationsRequest
		* @return	{string}	xml request
		*/
		xrxRegistrationListRegistrationsRequest: function() {
			var result = XRX_SOAP11_SOAPSTART 
					+ xrxCreateTag( 'ListRegistrationsRequest', XRX_REGISTRATION_NAMESPACE, '' ) 
					+ XRX_SOAPEND;
		
			return result;
		},


		// Get Registration

		/**
		* This function makes the GetRegistration web service call
		*
		* @function xrxRegistrationGetRegistration
		* @param {Object} params - The parameters for calling GetRegistration.
		* @param {string} params.url - The device address.
		* @param {string} params.name - registration name as a string
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
		xrxRegistrationGetRegistration: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_REGISTRATION_PATH;
			var sendReq = this.xrxRegistrationGetRegistrationRequest( params.name );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},
		
		/**
		* This function returns the parsed values.
		*
		* @function xrxRegistrationParseGetRegistration
		* @param	{string}	response	web service response in string form
		* @return	{object} 	A registration object
		*/
		xrxRegistrationParseGetRegistration: function( response ) {
			var root = xrxStringToDom( response );
			var registration = {
				Name: '',
				Description: '',
				VendorName: '',
				IsNative: '',
				SmallIconUrl: '',
				ToolsIconUrl: '',
				Url: '',
				DescriptionUrl: '',
				IsDisabled: false,
				Provides: [],
				checksum: null,
				RegistrationType: '',
				BrowserType: '',
				Uses: [],
				AllowSoftKeypad: null
			};
		
			registration.Name = xrxGetFirstElementValue( root, ['Name'] );
			registration.Description = xrxGetFirstElementValue( root, ['Description'] );
			registration.VendorName = xrxGetFirstElementValue( root, ['VendorName'] );
			registration.IsNative = xrxGetFirstElementValue( root, ['IsNative'] );
			registration.SmallIconUrl = xrxGetFirstElementValue( root, ['SmallIconUrl'] );
			registration.ToolsIconUrl = xrxGetFirstElementValue( root, ['ToolsIconUrl'] );
			registration.Url = xrxGetFirstElementValue( root, ['Url'] );
			registration.DescriptionUrl = xrxGetFirstElementValue( root, ['DescriptionUrl'] );
			registration.IsDisabled = xrxGetFirstElementValue( root, ['IsDisabled'] );
			registration.checksum = xrxGetFirstElementValue( root, ['checksum'] );
			registration.RegistrationType = xrxGetFirstElementValue( root, ['RegistrationType'] );
			registration.BrowserType = xrxGetFirstElementValue( root, ['BrowserType'] );
			registration.AllowSoftKeypad = xrxGetFirstElementValue( root, ['AllowSoftKeypad'] );
			var provides = xrxFindElements( root, "Provides" );
			if ( provides !== null && provides !== undefined && provides != '' ) {
				provides.forEach( function( node ) {
					var Provide = {
						Type: '',
						MustProvide: false
					};
					Provide.Type = xrxGetValue(xrxFindElement( node, ['Type'] ));
					Provide.MustProvide = xrxGetValue(xrxFindElement( node, ['MustProvide'] ));
					registration.Provides.push( Provide );
				});
			}
			var uses = xrxFindElements( root, "Uses" );
			if ( uses !== null && uses !== undefined && uses !== '' ) {
				uses.forEach( function( node ) {
					var use = xrxGetValue( xrxFindElement( node, ['Use'] ));
					registration.Uses.push( use );
				});
			}
			return registration;
		},

		/**
		* This function builds the get registration request.
		*
		* @function xrxRegistrationGetRegistrationRequest
		* @return	{string}	xml request
		*/
		xrxRegistrationGetRegistrationRequest: function( name ) {
			var result = XRX_SOAP11_SOAPSTART 
					+ xrxCreateTag( 'GetRegistrationRequest', XRX_REGISTRATION_NAMESPACE, xrxCreateTag( 'name', '', name) ) 
					+ XRX_SOAPEND;
			
			return result;
		},
		
		
		// Put Registration
		
		
		/** 
		* This function makes the PutRegistration web service call
		*
		* @function xrxRegistrationPutRegistration
		* @param {object} params - The parameters for calling PutRegistration
		* @param {string} params.url - The device address.
		* @param {string} params.registration - registration object
		* @param {string} params.admin - admin username (blank will not be included)
		* @param {string} params.adminPassword - admin password (blank will not be included)
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
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
		xrxRegistrationPutRegistration: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_REGISTRATION_PATH;
			var sendReq = this.xrxRegistrationPutRegistrationRequest( params.registration,
									params.admin, params.adminPassword, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},
		
		/** 
		* This is a helper function that creates the PutRegistration request
		*
		* @function xrxRegistrationPutRegistrationRequest
		* @param {object} registration - The registration object
		* @param {string} admin - admin username (blank will not be included)
		* @param {string} adminPassword - admin password (blank will not be included)
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} [sendUrl=''] - wsa:To
		* @return {string} xml request
		*
		*/
		xrxRegistrationPutRegistrationRequest: function( registration, admin, adminPassword, passwordType, sendUrl ) {
			var providesTag = '';
			registration.Provides.forEach( function (item) {
				providesTag += xrxCreateTag( 'Provides', '', xrxCreateTag( 'Type', '', item.Type ) + xrxCreateTag( 'MustProvide', '', item.MustProvide ) );
			});
			var usesTag = '';
			registration.Uses.forEach( function(item) { 
				usesTag += xrxCreateTag( 'Use', '', item ); 
			}); 
			var allowSoftKeypadTag = '';
			if ( registration.AllowSoftKeypad !== undefined ) {
				allowSoftKeypadTag += xrxCreateTag( 'AllowSoftKeypad', '', registration.AllowSoftKeypad );
			}
			var registrationTag = xrxCreateTag( 'entry', '', 
										xrxCreateTag( 'Name', '', registration.Name || '' ) + 
										xrxCreateTag( 'Description', '', registration.Description || '' ) +
										xrxCreateTag( 'VendorName', '', registration.VendorName || '' ) + 
										xrxCreateTag( 'SmallIconUrl', '', registration.SmallIconUrl || '' ) +
										xrxCreateTag( 'ToolsIconUrl', '', registration.ToolsIconUrl || '' ) +
										xrxCreateTag( 'Url', '', registration.Url || '' ) + 
										xrxCreateTag( 'DescriptionUrl', '', registration.DescriptionUrl || '' ) +
										xrxCreateTag( 'IsDisabled', '', registration.IsDisabled || false ) +
										xrxCreateTag( 'IsNative', '', registration.IsNative || false ) +
										providesTag +
										xrxCreateTag( 'Uses', '', usesTag ) +
										allowSoftKeypadTag
								);
			var result = XRX_SOAP11_SOAPSTART 
					+ xrxCreateTag( 'PutRegistrationRequest', XRX_REGISTRATION_NAMESPACE, registrationTag +
											xrxCreateTag( 'BrowserType', '', registration.BrowserType ) ) 
					+ XRX_SOAPEND;
			try
			{
				if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
				{
					result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
				}
			}
			catch(e)
			{}
			return result;
		},
		

		// Update Registration
		
		
		/** 
		* This function makes the UpdateRegistration web service call
		*
		* @function xrxRegistrationUpdateRegistration
		* @param {object} params - The parameters for calling PutRegistration
		* @param {string} params.url - The device address.
		* @param {string} params.registration - registration object
		* @param {string} params.admin - admin username (blank will not be included)
		* @param {string} params.adminPassword - admin password (blank will not be included)
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
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
		xrxRegistrationUpdateRegistration: function( params ) {
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_REGISTRATION_PATH;
			var sendReq = this.xrxRegistrationUpdateRegistrationRequest( params.registration, 
									params.admin, params.adminPassword, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/** 
		* This is a helper function that creates the PutRegistration request
		*
		* @function xrxRegistrationUpdateRegistrationRequest
		* @param {object} registration - The registration object
		* @param {string} admin - admin username (blank will not be included)
		* @param {string} adminPassword - admin password (blank will not be included)
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} [sendUrl=''] - wsa:To
		* @return {string} xml request
		*
		*/		
		xrxRegistrationUpdateRegistrationRequest: function( registration, admin, adminPassword, passwordType, sendUrl ) {
			var providesTag = '';
			registration.Provides.forEach( function (item) {
				providesTag += xrxCreateTag( 'Provides', '', xrxCreateTag( 'Type', '', item.Type ) + xrxCreateTag( 'MustProvide', '', item.MustProvide ) );
			});
			var usesTag = '';
			registration.Uses.forEach( function(item) { 
				usesTag += xrxCreateTag( 'Use', '', item ); 
			}); 
			var allowSoftKeypadTag = '';
			if ( registration.AllowSoftKeypad !== '' ) {
				allowSoftKeypadTag += xrxCreateTag( 'AllowSoftKeypad', '', registration.AllowSoftKeypad );
			}
			var registrationTag = xrxCreateTag( 'entry', '', 
										xrxCreateTag( 'Name', '', registration.Name || '' ) + 
										xrxCreateTag( 'Description', '', registration.Description || '' ) +
										xrxCreateTag( 'VendorName', '', registration.VendorName || '' ) + 
										xrxCreateTag( 'SmallIconUrl', '', registration.SmallIconUrl || '' ) +
										xrxCreateTag( 'ToolsIconUrl', '', registration.ToolsIconUrl || '' ) +
										xrxCreateTag( 'Url', '', registration.Url || '' ) + 
										xrxCreateTag( 'DescriptionUrl', '', registration.DescriptionUrl || '' ) +
										xrxCreateTag( 'IsDisabled', '', registration.IsDisabled || false ) +
										xrxCreateTag( 'IsNative', '', registration.IsNative || false ) +
										providesTag +
										xrxCreateTag( 'Uses', '', usesTag ) +
										allowSoftKeypadTag
								);
			var result = XRX_SOAP11_SOAPSTART 
					+ xrxCreateTag( 'UpdateRegistrationRequest', XRX_REGISTRATION_NAMESPACE, registrationTag + 
														 xrxCreateTag( 'checksum', '', registration.checksum ) +
														xrxCreateTag( 'BrowserType', '', registration.BrowserType ) ) 
					+ XRX_SOAPEND;
			try
			{
				if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
				{
					result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
				}
			}
			catch(e)
			{}
			return result;
		},

		// Delete Registration

		/**
		* This function makes the DeleteRegistration web service call
		*
		* @function xrxRegistrationDeleteRegistration
		* @param {Object} params - The parameters for calling DeleteRegistration.
		* @param {string} params.url - The device address.
		* @param {string} params.name - registration name as a string
		* @param {string} params.checksum - checksum as a string
		* @param {string} params.admin - admin username (blank will not be included)
		* @param {string} params.adminPassword - admin password (blank will not be included)
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*										Supported values are "PasswordDigest" and "PasswordText".
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
		xrxRegistrationDeleteRegistration: function( params )
		{
			var url = params.url || "http://127.0.0.1";
			var sendUrl = url + XRX_REGISTRATION_PATH;
			var sendReq = this.xrxRegistrationDeleteRegistrationRequest( params.name, params.checksum, 
									params.admin, params.adminPassword, params.passwordType );
			return xrxCallWebservice( sendUrl, sendReq, params.callback_success, params.callback_failure, params.timeout );
		},

		/**
		* This function builds the delete registrations request.
		*
		* @function xrxRegistrationDeleteRegistrationRequest
		* @param {string} name - registration name as a string
		* @param {string} checksum - checksum as a string
		* @param {string} admin - admin username (blank will not be included)
		* @param {string} adminPassword - admin password (blank will not be included)
		* @param {string} [params.passwordType="PasswordDigest"] - Ws-Security password type. 
		*								Supported values are "PasswordDigest" and "PasswordText".
		* @param {string} [sendUrl=''] - wsa:To
		* @return	{string}	xml request
		*/
		xrxRegistrationDeleteRegistrationRequest: function( name, checksum, admin, adminPassword, passwordType, sendUrl )
		{
			var result = XRX_SOAP11_SOAPSTART 
					+ xrxCreateTag( 'DeleteRegistrationRequest', XRX_REGISTRATION_NAMESPACE, xrxCreateTag( 'name', '', name) + xrxCreateTag( 'checksum', '', checksum ) ) 
					+ XRX_SOAPEND;
			try
			{
				if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
				{
					result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
				}
			}
			catch(e)
			{}
			return result;
		}
	};
	return methods;
}());
 
/*************************  End of File  *****************************/
