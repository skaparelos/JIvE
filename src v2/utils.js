class Utils{

	static xhrGet(URI, callback) {
		var xhr = new XMLHttpRequest();

		xhr.open("GET", URI, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status == "200") {
				callback(xhr);
			}
		}
		xhr.send();
	}

}