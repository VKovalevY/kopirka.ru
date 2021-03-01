/* 
 * XRXMassStorage.js
 * Copyright (C) Xerox Corporation, 2010.  All rights reserved.
 *
 * This file encapsulates the functions that call the Xerox MassStorage Web services methods.
 *
 * @revision    03/20/2010
 *              10/15/2012  AHB Updated
 *              09/23/2016  TC  Added other methods.
 *				05/21/2018	TC	Updated comments.
 *				08/10/2018  TC  Rearrange the order of the parameters for GetPartitionsInfo,  
 *                              GetDirectoryListing, CreateDirectory, DeleteDirectory and 
 *                              DeleteFile so the parameters are in sequence.
 *				04/08/2019  DW  Added partitionLocation, partitionSize, partitionUsed, & partitionFree 
 *								to the object returned by the xrxMassStorageParsePartitions function
 */

/****************************  CONSTANTS  *******************************/

var XRX_MASSSTORAGE_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/MassStorage/1"';

var XRX_MASSSTORAGE_PATH = '/webservices/MassStorage/1';

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
function xrxMassStorageGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the interface version request.
*
* @return {string}	xml request
*/
function xrxMassStorageGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequestArgs', XRX_MASSSTORAGE_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxMassStorageParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

// Lock

/**
* This function locks the Mass Storage device
*
* @param {string}	url					destination address, localhost only
* @param {string}    peripheralId        peripheral id
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageLock( url, peripheralId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_MASSSTORAGE_PATH;
	var sendReq = xrxMassStorageLockRequest( peripheralId );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Lock request.
*
* @return {string}	xml request
*/
function xrxMassStorageLockRequest( peripheralId )
{
	return	XRX_SOAPSTART +
		    xrxCreateTag( 'LockRequestArgs', XRX_MASSSTORAGE_NAMESPACE, xrxCreateTag('DeviceNumber', '', peripheralId )) +
		    XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	key
*/
function xrxMassStorageParseLock( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['Key'] );
	return xrxGetValue( data );
}

/**
* This LEGACY function returns the parsed values.
*
* @param	response	web service response in string form
* @return	string	key
*/
function xrxMassStorageParseKey( response )
{
	return xrxMassStorageParseLock( response )
}

// UnLock

/**
* This function unlocks the Mass Storage device
*
* @param {string}	url					destination address
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock, it must be provided when calling unlock method
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageUnlock( url, peripheralId, key, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_MASSSTORAGE_PATH;
	var sendReq = xrxMassStorageUnlockRequest( peripheralId, key );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Unlock request.
*
* @return	string	xml request
*/
function xrxMassStorageUnlockRequest( peripheralId, key )
{
	return XRX_SOAPSTART +
	        xrxCreateTag( 'UnLockRequestArgs', XRX_MASSSTORAGE_NAMESPACE, 
	        xrxCreateTag( 'DeviceNumber', '', peripheralId) + xrxCreateTag( 'Key' , '', key )) +
	        XRX_SOAPEND;
}

// GetPeripheralsInfo

/**
* This function queries the Mass Storage device for peripherals info
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageGetPeripheralsInfo(url, callback_success, callback_failure, timeout) {
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageGetPeripheralsInfoRequest();
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the GetPeripheralsInfo request
*
* @return {string}	xml request
*/
function xrxMassStorageGetPeripheralsInfoRequest() {
    return XRX_SOAPSTART +
		xrxCreateTag('GetPeripheralsInfoRequestArgs', XRX_MASSSTORAGE_NAMESPACE, '') +
		XRX_SOAPEND;
}


/**
* This function returns the parsed values.
*
* @param {string}	response		web service response in string form
* @return {array}	    	an array of objects representing each found peripheral
*/
function xrxMassStorageParsePeripherals(response) {
	var peripherals = [];
	
    var peripheralsInfo = xrxGetValue(xrxFindElement(xrxStringToDom(response), ['peripheralsInfo']));
    var pNodes = xrxFindElements(xrxStringToDom(peripheralsInfo), 'peripheral');

	if ( pNodes != null ) {
		for (var i = 0; i < pNodes.length; i++) {
			var peripheral = {
				peripheralId: "",
				peripheralName: "",
				hwVendorId: "",
				hwProductId: "",
				hwManufacturerName: "",
				connectionType: "",
				hwType: "" 
			};
			
			peripheral.peripheralId = xrxGetValue(xrxFindElement(pNodes[i], ['peripheralId']));
			peripheral.peripheralName = xrxGetValue(xrxFindElement(pNodes[i], ['peripheralName']));
			peripheral.hwVendorId = xrxGetValue(xrxFindElement(pNodes[i], ['hwVendorId']));
			peripheral.hwProductId = xrxGetValue(xrxFindElement(pNodes[i], ['hwProductId']));
			peripheral.hwManufacturerName = xrxGetValue(xrxFindElement(pNodes[i], ['hwManufacturerName']));
			peripheral.connectionType = xrxGetValue(xrxFindElement(pNodes[i], ['connectionType']));
			peripheral.hwType = xrxGetValue(xrxFindElement(pNodes[i], ['hwType']));
			
			peripherals.push( peripheral );
		}
	}
    return peripherals;
}

// GetPartitionsInfo

/**
* This function gets the partition info for a device
*
* @param {string}	url					destination address
* @param {string}   peripheralId        peripheral id
* @param {string}  	key                 key returned by lock
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageGetPartitionsInfo(url, peripheralId, key, callback_success, callback_failure, timeout) {
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageGetPartitionsInfoRequest(peripheralId, key);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the GetPartitionsInfo request.
*
* @param {string}   peripheralId        peripheral id
* @param {string}  	key                 key returned by lock
* @return {string}	xml request
*/
function xrxMassStorageGetPartitionsInfoRequest(peripheralId, key) {
    return XRX_SOAPSTART +
			    xrxCreateTag('GetPartitionsInfoRequestArgs', XRX_MASSSTORAGE_NAMESPACE,
			    xrxCreateTag('DeviceNumber', '', peripheralId) + 
				xrxCreateTag('Key', '', key)) +
			    XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {array}	an array of objects representing each found partition
*/
function xrxMassStorageParsePartitions(response) {
	var partitions = [];
	
    var partitionsInfo = xrxGetValue(xrxFindElement(xrxStringToDom(response), ['partitionsInfo']));
    var pNodes = xrxFindElements(xrxStringToDom(partitionsInfo), 'partition');
	
    for (var i = 0; i < pNodes.length; i++) {
		var partition = {
			partitionNumber: "",
			partitionName: "",
			partitionLocation: "",
			partitionSize: "",
			partitionUsed: "",
			partitionFree: "",
		};
        partition.partitionNumber = xrxGetValue(xrxFindElement(pNodes[i], ['partitionNumber']));
        partition.partitionName = xrxGetValue(xrxFindElement(pNodes[i], ['partitionName']));
        partition.partitionLocation = xrxGetValue(xrxFindElement(pNodes[i], ['partitionLocation']));
        partition.partitionSize = xrxGetValue(xrxFindElement(pNodes[i], ['partitionSize']));
        partition.partitionUsed = xrxGetValue(xrxFindElement(pNodes[i], ['partitionUsed']));
        partition.partitionFree = xrxGetValue(xrxFindElement(pNodes[i], ['partitionFree']));
		partitions.push( partition );
    }
    return partitions;
}

// GetDirectoryListing

/**
* This function lists a directory device
*
* @param {string}	url					destination address
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   directoryPath       the directory to be listed
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageGetDirectoryListing(url, peripheralId, key, partitionNumber, directoryPath,
                                           callback_success, callback_failure, timeout) {
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageGetDirectoryListingRequest(peripheralId, key, partitionNumber, directoryPath);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the GetDirectoryListing request.
*
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   directoryPath       the directory to be listed
* @return {string}	xml request
*/
function xrxMassStorageGetDirectoryListingRequest(peripheralId, key, partitionNumber, directoryPath) {
    return XRX_SOAPSTART +
			    xrxCreateTag('GetDirectoryListingRequestArgs', XRX_MASSSTORAGE_NAMESPACE,
			       xrxCreateTag('DeviceNumber', '', peripheralId) + 
                   xrxCreateTag('PartitionNumber', '', partitionNumber) +
                   xrxCreateTag('DirectoryPath', '', directoryPath) +
				   xrxCreateTag('Key', '', key)
                ) +
			XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {array}	an array of objects representing each entry in the directory
*/
function xrxMassStorageParseDirectoryListing(response) {
	
	var entries = [];
	
	var directoryListing = xrxGetValue(xrxFindElement(xrxStringToDom(response), ['directoryListing']));

	if (directoryListing != undefined && directoryListing != null && directoryListing != "") {
		var dlDom = xrxStringToDom(directoryListing);
		var eNodes = xrxFindElements(dlDom, 'entry');

		if (eNodes != null) {
			for (var i = 0; i < eNodes.length; i++) {
				var entry = {
					fileType: 0,
					name: "",
					size: "",
					time: "",
					mode: ""
				};
				
				entry.fileType = xrxGetValue(xrxFindElement(eNodes[i], ['type']));
				entry.name = xrxGetValue(xrxFindElement(eNodes[i], ['name']));
				entry.size = xrxGetValue(xrxFindElement(eNodes[i], ['size']));
				entry.time = xrxGetValue(xrxFindElement(eNodes[i], ['time']));
				entry.mode = xrxGetValue(xrxFindElement(eNodes[i], ['mode']));
				
				entries.push( entry );
			}
		}
	}
	return entries;
}


// CreateDirectory

/**
* This function creates a new directory
*
* @param {string}	url					destination address
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   directoryPath       the path of the directory in which to create the new directory,
*										must contain either / or \ (but not both) and must not end in a slash 
* @param {string}   directoryName       name of the new directory
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageCreateDirectory(url, peripheralId, key, partitionNumber, directoryPath, directoryName,
                                       callback_success, callback_failure, timeout) {
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageCreateDirectoryRequest(peripheralId, key, partitionNumber, directoryPath, directoryName);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the CreateDirectory request.
*
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   directoryPath       the path of the directory in which to create the new directory,
*										must contain either / or \ (but not both) and must not end in a slash 
* @param {string}   directoryName       name of the new directory
* @return {string}	xml request
*/
function xrxMassStorageCreateDirectoryRequest(peripheralId, key, partitionNumber, directoryPath, directoryName) {
    return XRX_SOAPSTART +
			    xrxCreateTag('CreateDirectoryRequestArgs', XRX_MASSSTORAGE_NAMESPACE,
			       xrxCreateTag('DeviceNumber', '', peripheralId) + 
                   xrxCreateTag('PartitionNumber', '', partitionNumber) +
                   xrxCreateTag('DirectoryPath', '', directoryPath) +
                   xrxCreateTag('DirectoryName', '', directoryName) +
				   xrxCreateTag('Key', '', key)
                ) +
		XRX_SOAPEND;
}

// DeleteDirectory

/**
* This function deletes a directory
*
* @param {string}	url					destination address
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   directoryPath       the directory path in which the directory to be deleted,
*										must contain either / or \ (but not both) and must not end in a slash 
* @param {string}   directoryName       name of the directory to be deleted
* @param {boolean}  forceDelete        flag, if set to true, will delete a directory
*										that is not empty, but will not otherwise
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageDeleteDirectory(url, peripheralId, key, partitionNumber, directoryPath, directoryName, forceDelete,
                                       callback_success, callback_failure, timeout) {
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageDeleteDirectoryRequest(peripheralId, key, partitionNumber, directoryPath, directoryName, forceDelete);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the DeleteDirectory request.
*
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   directoryPath       the directory path in which the directory to be deleted,
*										must contain either / or \ (but not both) and must not end in a slash 
* @param {string}   directoryName       name of the directory to be deleted
* @param {boolean}  forceDelete        flag, if set to true, will delete a directory
*										that is not empty, but will not otherwise
* @return {string}	xml request
*/
function xrxMassStorageDeleteDirectoryRequest(peripheralId, key, partitionNumber, directoryPath, directoryName, forceDelete) {
    return XRX_SOAPSTART +
			    xrxCreateTag('DeleteDirectoryRequestArgs', XRX_MASSSTORAGE_NAMESPACE,
			       xrxCreateTag('DeviceNumber', '', peripheralId) + 
                   xrxCreateTag('PartitionNumber', '', partitionNumber) +
                   xrxCreateTag('DirectoryPath', '', directoryPath) +
                   xrxCreateTag('DirectoryName', '', directoryName) +
                   xrxCreateTag('ForceDelete', '', forceDelete) +
				   xrxCreateTag('Key', '', key)
                ) +
			    XRX_SOAPEND;
}

// DeleteFile

/**
* This function deletes a file
*
* @param {string}	url					destination address
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   DirectoryPath       the directory path in which the file to be deleted,
*										must contain either / or \ (but not both) and must not end in a slash 
* @param {string}   FileName            name of the file to be deleted
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
*/
function xrxMassStorageDeleteFile(url, peripheralId, key, partitionNumber, directoryPath, fileName,
                                       callback_success, callback_failure, timeout) {
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageDeleteFileRequest(peripheralId, key, partitionNumber, directoryPath, fileName);
    xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout);
}

/**
* This function builds the DeleteFile request.
*
* @param {string}   peripheralId        peripheral id
* @param {string}   key                 key returned by lock
* @param {number}   partitionNumber     partition number
* @param {string}   DirectoryPath       the directory path in which the file to be deleted,
*										must contain either / or \ (but not both) and must not end in a slash 
* @param {string}   FileName            name of the file to be deleted
* @return {string}	xml request
*/
function xrxMassStorageDeleteFileRequest(peripheralId, key, partitionNumber, directoryPath, fileName) {
    return XRX_SOAPSTART +
			    xrxCreateTag('DeleteFileRequestArgs', XRX_MASSSTORAGE_NAMESPACE,
			       xrxCreateTag('DeviceNumber', '', peripheralId) + 
                   xrxCreateTag('PartitionNumber', '', partitionNumber) +
                   xrxCreateTag('DirectoryPath', '', directoryPath) +
                   xrxCreateTag('FileName', '', fileName) +
				   xrxCreateTag('Key', '', key)
                ) +
		XRX_SOAPEND;
}

/*************************  End of File  *****************************/
