(function(){

   // Spalten ind er Reihenfolge der Darstellung
   var columns = ['Name', 'Titel', 'Views'];


   document.addEventListener('DOMContentLoaded', function() {
      //Filter einblenden
      var body = document.getElementsByTagName("BODY")[0];
      var request = new XMLHttpRequest();
      request.open('GET', '/data', true);
      request.onload = function() {
         if(request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var videos = {};
            var i;
            for(i in data.videos) {
               data.videos[i].stats = {};
               videos[data.videos[i].id] = (data.videos[i]);
            }
            var current = {};
            for (i in data.stats) {
               videos[data.stats[i].vid].stats[data.stats[i].timestamp] = data.stats[i];
               if (typeof current[data.stats[i].vid] !== 'undefined' || current[data.stats[i].vid].views < data.stats[i].viewCount) {
                  current[data.stats[i].vid] = {title:videos[data.stats[i].vid].title, name:videos[data.stats[i]].author, views:data.stats[i].viewCount};
               }
            }
            console.log(videos);
            body.appendChild(btable(current));
         } else {
            // Error
         }
      };
      request.onerror = function() {
         // There was a connection error of some sort
      };
      request.send();
   });

   var btable = function(data) {
      var t = document.createElement('table');
      for (var i in data) {
         t.appendChild(row(data[i]));
      }
      return t;
   };

   var row = function(data) {
      var cols = {};
      for (var i in columns) {
         cols[columns[i]] = {};
      }
      var tr = document.createElement('tr');
      var ftd = function(html, align) {
         if(typeof align==='undefined' ){
            align = 'left';
         }
         var td = document.createElement('td');
         if(typeof html === 'object') {
            td.appendChild(html);
         } else if(typeof html === 'undefined') {
            td.innerHTML = '';
         } else {
            td.innerHTML = html;
         }
         td.style.textAlign = align;
         return td;
      };
      cols.Name = ftd(data.name);
      cols.Titel = ftd(data.title);
      cols.Betrag = ftd(data.views, 'right');
      for (var i in cols) {
         tr.appendChild(cols[i]);
      }
      return tr;
   };


})();