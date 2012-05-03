findTracks({
	track: "[typeof='mo:Track'],[typeof='po:MusicSegment']",
	artist: "[rel='foaf:maker'] [property='foaf:name'],[rel='mo:performer'] [property='foaf:name']",
	title: "[property='dc:title']",
})

function findTracks(selector) {
	var nodes = document.querySelectorAll(selector.track);

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];

		var artist = node.querySelectorAll(selector.artist).item(0).textContent.trim();
		var title = node.querySelectorAll(selector.title).item(0).textContent.trim();

		addTomahawkTrackLink(node.appendChild(document.createElement("div")), artist, title);
		//addRdioTrackLink(node.appendChild(document.createElement("div")), artist, title);
		addSpotifyTrackLink(node.appendChild(document.createElement("div")), artist, title);
	}
}

function addTomahawkTrackLink(node, artist, title) {
	var link = document.createElement("a");
	link.href = "tomahawk://open/track" + buildQueryString({ artist: artist, title: title });
	link.innerHTML = "▶";
	link.style.background = "url(https://img.skitch.com/20120503-cm8han4kgre9iwhjprpdmjfsap.jpg) no-repeat right center";
	link.style.paddingRight = "20px";
	node.appendChild(link);
}

function addSpotifyTrackLink(node, artist, title) {
	var query = 'artist:"' + artist + '" track:"' + title + '"';

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://ws.spotify.com/search/1/track.json" + buildQueryString({ q: query }), true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (!data.tracks || !data.tracks.length) return;

			var object = document.createElement("object");
			object.setAttribute("type", "text/html");
			object.setAttribute("data", "https://embed.spotify.com/" + buildQueryString({ uri: data.tracks[0].href }));
			object.style.width = "300px";
			object.style.height = "80px";
			object.style.margin = "10px 0";

			node.appendChild(object);
		}
	};
	xhr.send(null);
}

/*
function addRdioTrackLink(node, artist, title) {
	var params = {
		api_key: "D3JK5N3NLFII4K3HF",
		format: "json",
		results: 1,
		limit: "false",
		bucket: [
			//"id:spotify-WW",
			"id:rdio-us-streaming",
			"tracks"
		],
		artist: artist,
		title: title,
	}

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://developer.echonest.com/api/v4/song/search" + buildQueryString(params), true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (!data.response) return;

			console.log(data);

			var link = document.createElement("a");
			link.href = data.response.songs[0].foreign_ids[0].foreign_id;
			link.innerHTML = "▶";
			link.style.background = "url(http://www.tomahawk-player.org/sites/default/files/favicon.ico) no-repeat right center";
			link.style.paddingRight = "20px";
			node.appendChild(link);

			//node.appendChild(object);
		}
	};
	xhr.send(null);
}
*/

function buildQueryString(items) {
	var parts = [];

	var add = function(key, value) {
		parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
	}

	for (var key in items) {
		if (!items.hasOwnProperty(key)) continue;
   		var obj = items[key];

   		if (Array.isArray(obj)) {
   			obj.forEach(function(value) {
   				add(key, value);
   			});
   		}
   		else {
   			add(key, obj);
   		}
	}

	return parts.length ? "?" + parts.join("&").replace(/%20/g, "+") : "";
}

