(function(){
   document.addEventListener('DOMContentLoaded', function() {
      //Filter einblenden
      var body = document.getElementsByTagName("BODY")[0];
      var request = new XMLHttpRequest();
      request.open('GET', '/data', true);
      request.onload = function() {
         if(request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var videos = [];
            var i;
            for(i in data.videos) {
               data.videos[i].stats = {};
               videos.push(data.videos[i]);
            }
            for (i in data.stats) {
               videos[data.stats[i].vid].stats[data.stats[i].timestamp] = data.stats[i];
            }
            console.log(videos);
            body.appendChild(table);
         } else {
            // Error
         }
      };
      request.onerror = function() {
         // There was a connection error of some sort
      };
      request.send();
   });
})();