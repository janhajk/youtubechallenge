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
               if (typeof current[data.stats[i].vid] === 'undefined' || current[data.stats[i].vid].views < data.stats[i].viewCount) {
                  current[data.stats[i].vid] = {title:videos[data.stats[i].vid].title, name:videos[data.stats[i].vid].author, views:data.stats[i].viewCount};
               }
            }
            //console.log(videos);
            body.appendChild(btable(current));
            var chart = document.createElement('canvas');
            chart.width = '100%';
            chart.height = '200';
            body.appendChild(chart);
            makeChartr(chart);
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
      t.className = 'table';
      data = sortProperties(data, 'views', true, true);
      for (var i in data) {
         t.appendChild(row(data[i][1]));
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
      cols.Views = ftd(data.views);
      for (var i in cols) {
         tr.appendChild(cols[i]);
      }
      return tr;
   };

   var makeChart = function(ctx) {
      var myChart = new Chart(ctx, {
         type: 'bar',
         data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
               label: '# of Votes',
               data: [12, 19, 3, 5, 2, 3],
               backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
               ],
               borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
               ],
               borderWidth: 1
            }]
         },
         options: {
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero:true
                  }
               }]
            }
         }
      });
   };


   /**
    * Sort object properties (only own properties will be sorted).
    * @param {object} obj object to sort properties
    * @param {string|int} sortedBy 1 - sort object properties by specific value.
    * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
    * @param {bool} reverse false - reverse sorting.
    * @returns {Array} array of items in [[key,value],[key,value],...] format.
    */

   function sortProperties(obj, sortedBy, isNumericSort, reverse) {
      sortedBy = sortedBy || 1; // by default first key
      isNumericSort = isNumericSort || false; // by default text sort
      reverse = reverse || false; // by default no reverse
      var reversed = (reverse) ? -1 : 1;
      var sortable = [];
      for(var key in obj) {
         if(obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
         }
      }
      if(isNumericSort) sortable.sort(function(a, b) {
         return reversed * (a[1][sortedBy] - b[1][sortedBy]);
      });
      else sortable.sort(function(a, b) {
         var x = a[1][sortedBy].toLowerCase(),
            y = b[1][sortedBy].toLowerCase();
         return x < y ? reversed * -1 : x > y ? reversed : 0;
      });
      return sortable;
   }

})();