/**
* XRXLog.js
* 
* 11/17/2017	TC	Initial version.
*
*/

var XRXLog = (function() {

	var methods = {
		log: function( msg ) {
			var timestamp = new Date();
			var index = parseInt(xrxGetLocalStorageData( "index", '0' )); 
			index += 1;
			var key = "log" + index; 
			xrxSetLocalStorageData( key, timestamp + ":   " + msg );
			xrxSetLocalStorageData( "index", index );
		},
		getLog: function() {
			var logs = '';
			var index = parseInt(xrxGetLocalStorageData( "index", 0 ));
			var i = 0; 
			while ( i < index ) {
				var key = "log" + i;
				logs += xrxGetLocalStorageData( key, '' ) + "<br/>";
				i += 1;
			}
			return logs;
		},
		
	};
	return methods;
}());