(function(){

   // Spalten ind er Reihenfolge der Darstellung
   var columns = ['Name', 'Titel', 'Views'];


   document.addEventListener('DOMContentLoaded', function() {
      //Filter einblenden
      var body = document.getElementsByTagName("BODY")[0];
      body.style.maxWidth = '600px';
      body.style.padding = '10px';
      var request = new XMLHttpRequest();
      body.appendChild(eTitle(fightTitle));
      request.open('GET', '/data/' + fightid, true);
      request.onload = function() {
         if(request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var videos = {};
            var i;
            for(i in data.videos) {
               data.videos[i].stats = {};
               videos[i] = (data.videos[i]);
            }
            var current = {};
            for (i in data.stats) {
               videos[data.stats[i].yid].stats[data.stats[i].timestamp] = data.stats[i];
               if (typeof current[data.stats[i].yid] === 'undefined' || current[data.stats[i].yid].views < data.stats[i].viewCount) {
                  current[data.stats[i].yid] = {id:data.stats[i].yid,title:videos[data.stats[i].yid].title, name:videos[data.stats[i].yid].author, views:data.stats[i].viewCount};
               }
            }
            //console.log(videos);
            body.appendChild(btable(current));
            var chart = document.createElement('canvas');
            chart.width = '100%';
            chart.height = '200';
            body.appendChild(chart);
            //let d = document.createElement('div');
            //d.id = 'wrapper_chart';
            //let chart = document.createElement('canvas');
            chart.id = 'chartcanvas';
            //d.appendChild(chart)
            body.appendChild(chart);
            makeChart(chart,videos);
         } else {
            // Error
         }
      };
      request.onerror = function() {
         // There was a connection error of some sort
      };
      request.send();
   });


   var eTitle = function(title) {
      let d = document.createElement('div');
      d.style.fontSize = '16pt';
      d.innerHTML = title;
      return d;
   };


   var btable = function(data) {
      var t = document.createElement('table');
      t.className = 'table-striped';
      t.width = '100%';
      t.maxWidth = '400px';
      var thead = document.createElement('thead');
      var tr = document.createElement('tr');
      var th;
      for (var c in columns) {
         th = document.createElement('th');
         th.innerHTML = columns[c];
         tr.appendChild(th);
      }
      thead.appendChild(tr);
      t.appendChild(thead);
      var tbody = document.createElement('tbody');
      data = sortProperties(data, 'views', true, true);
      for (var i in data) {
         tbody.appendChild(row(data[i][1]));
      }
      t.appendChild(tbody);
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
      var a = document.createElement('a');
      a.href = 'https://www.youtube.com/watch?v=' + data.id;
      a.text = data.title;
      cols.Name = ftd(data.name);
      cols.Titel = ftd(a.outerHTML);
      cols.Views = ftd((data.views).toLocaleString(), 'right');
      for (var i in cols) {
         tr.appendChild(cols[i]);
      }
      return tr;
   };

   var makeChart = function(ctx, videos) {
      var datasets = [];
      var dataset = {};
      var data = [];
      for (var i in videos) {
         let c = hashColor(i);
         dataset = {};
         dataset.label = videos[i].title;
         dataset.borderColor = c[0];
         dataset.backgroundColor = c[1];
         dataset.pointRadius = 0;
         dataset.responsive = true;
         dataset.maintainAspectRatio = true;
         data = [];
         for (var s in videos[i].stats) {
            data.push({x:new Date(videos[i].stats[s].timestamp*1000), y:videos[i].stats[s].viewCount});
         }
         dataset.data = data;
         datasets.push(dataset);
      }
      var myChart = new Chart(ctx, {
         type: 'line',
         data: {
            datasets: datasets
         },
         options: {
            scales: {
               xAxes: [{
                  type: 'time',
                  time: {
                     displayFormats: {
                        hour: 'DD.MMM, kk:mm'
                     }
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

   var hashColor = function(string){
      var h = hash(string);
      h = Math.abs(h);
      h = h.toString();
      h = [h.substr(0,2), h.substr(2,2), h.substr(4,2)];
      for (let i in h) {
         h[i] = Math.round(parseInt(h[i],10)/100*256);
      }
      return ['rgba('+h.join(',')+',1)','rgba('+h.join(',')+',0.2)']
   };

   var hash = function(string) {
      let hash = 0;
      string = string.toString();
      for(let i = 0; i < string.length; i++) {
         hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
      }
      return hash;
   };
})();