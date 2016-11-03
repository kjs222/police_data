var renderDispositionCategoryChart = function(elementId, neighborhood) {
  prepareChartArea(elementId, neighborhood);
  $.get('api/v1/stats/disposition_category_stats?neighborhood=' + neighborhood, function(data){
    var data = data.length === 2 ? data[0] : data;
    var svg = dimple.newSvg(elementId, 400, 400);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(70, 30, 200, 330);
    var x = myChart.addCategoryAxis("x", "month");
    x.addGroupOrderRule("month");
    myChart.addPctAxis("y", "incidents");
    var s = myChart.addSeries(["neighborhood", "type"], dimple.plot.area);
    s.lineWeight = 1;
    s.barGap = 0.05;
    if (elementId === "#disp-cat-2") {
      myChart.addLegend(300, 20, 100, 300, "left");
    }
    myChart.draw();
  });
}

var renderNeighborhoodIncidentsChart = function(data) {
  var svg = dimple.newSvg("#neigh-incidents-scatter", 950, 550)

  data.forEach(function (d) {
    d["Day"] = d["date"].substring(0, d["date"].length - 6);
    d["Time of Day"] =
        "2000-01-01 " + d["date"].substring(d["date"].length - 5);
  }, this);


  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(50, 40, 650, 400)
  var y = myChart.addTimeAxis("y", "Day", "%d %b %Y", "%d %b");
  var x = myChart.addTimeAxis("x", "Time of Day",
    "%Y-%m-%d %H:%M", "%H:%M");

  myChart.addSeries(["neighborhood", "address", "disposition description", "call type description"], dimple.plot.bubble);
  var myLegend = myChart.addLegend(900, 100, 60, 300, "Right");
  myChart.draw();

  myChart.legends = [];
      svg.selectAll("title_text")
        .data(["Click legend to","show/hide by Call Type:"])
        .enter()
        .append("text")
          .attr("x", 850)
          .attr("y", function (d, i) { return 80 + i * 14; })
          .style("font-family", "sans-serif")
          .style("font-size", "10px")
          .style("color", "Black")
          .text(function (d) { return d; });


  var filterValues = dimple.getUniqueValues(data, "call type description");
  myLegend.shapes.selectAll("rect")
    .on("click", function (e) {
      var hide = false;
      var newFilters = [];
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      filterValues = newFilters;
      myChart.data = dimple.filterData(data, "call type description", filterValues);
      myChart.draw(900);
  });
};

var chartNeighborhoodIncidents = function(neighborhood, month, code) {
  var stats
  var queryString = "?neighborhood=" + neighborhood + "&month=" + month + "&code=";
  $.get('/api/v1/stats/neigh_incident_stats' + queryString + "%A", function(arrestStats) {
      stats = arrestStats;
      $.get('/api/v1/stats/neigh_incident_stats' + queryString + "%R", function(reportStats) {
        stats = stats.concat(reportStats);
        renderNeighborhoodIncidentsChart(stats);
      });
  });
};


var prepareChartArea = function(chartElementId, neighborhood) {
  var element = $(chartElementId);
  $(element).empty();
  $(element).prev(".neigh-title").text(neighborhood);
  $(".neigh-input").val("");
}

var renderNeighborhoodDropDownList = function() {
  var dataLists = $(".neigh-dropdown");
  $.get('/api/v1/neighborhood_names', function(names) {
      names.forEach(function(name) {
        var option = '<option value="'+ name + '" class="neigh-selection"></option>'
        dataLists.each(function() {
          $(this).append(option);
        });
      });
    listenForNeighborhoodRequest(names);
  })
}

var listenForNeighborhoodRequest = function(allNeighNames) {
  $(".neigh-select").on("click", function(e){
    removeErrorMessages();
    var chartElementId = "#" + $($(this).nextAll(".chart:first")).attr("id");
    var selectedNeigh = $("#" + $(this).attr("target")).val();
    if(allNeighNames.indexOf(selectedNeigh) === -1 ) {
      renderErrorMessage($(this));
    } else {
      renderSelectedChart(chartElementId, selectedNeigh)
    }
  })
}

var renderSelectedChart = function(chartElementId, selectedNeighborhood) {
  if(chartElementId === "#neigh-incidents-scatter") {
        //working but do a refactor for consistency
    prepareChartArea(chartElementId, selectedNeighborhood);
    chartNeighborhoodIncidents(selectedNeighborhood, "01/01/15", "A");
  } else {
    renderDispositionCategoryChart(chartElementId, selectedNeighborhood);
  }
}

var renderErrorMessage = function(element) {
  element.after("<p class='error'>Please select a valid neighbohrood</p>");
}

var removeErrorMessages = function(element) {
  $(".error").remove();
}

$(document).ready(function() {
  renderNeighborhoodDropDownList();
  renderDispositionCategoryChart("#disp-cat-1", "Gaslamp");
  renderDispositionCategoryChart("#disp-cat-2", "La Jolla");
  chartNeighborhoodIncidents("Talmadge", "01/01/15", "A");
})
