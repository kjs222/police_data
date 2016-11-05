$(document).ready(function() {
  listenForTabSelection();
  renderNeighborhoodDropDownList();
  renderAreaChart("#disp-cat-1", "Gaslamp");
  renderAreaChart("#disp-cat-2", "La Jolla");
})

var listenForTabSelection = function() {
  $(".tab").on("click", function(){
    if(!$(this).hasClass("active-tab")) {
      activateTab($(this))
      $("svg").remove();
      renderActivatedChart($(this).attr("target"));
    }
  })
}

var toggleSpinner = function() {
  $(".progress").toggle();
}

var activateTab = function(selectedTab) {
  $(".tab").removeClass("active-tab");
  $(".chart-section").removeClass("active");
  $(selectedTab).addClass("active-tab");
  var targetClass = $(selectedTab).attr("target");
  $("." + targetClass).addClass("active");
}

var renderActivatedChart = function(chartToActivate) {
  if(chartToActivate === "bubble-chart") {
    renderBubbleChart();
  } else if(chartToActivate === "scatter-chart") {
    toggleSpinner();
    renderScatterChart("Talmadge", "01/01/15", "A");
  } else {
    toggleSpinner();
    renderAreaChart("#disp-cat-1", "Gaslamp");
    renderAreaChart("#disp-cat-2", "La Jolla");
  }
}

var renderAreaChart = function(elementId, neighborhood) {
  $.get('api/v1/stats/disposition_category_stats?neighborhood=' + neighborhood, function(areaData){
    var areaData = areaData.length === 2 ? areaData[0] : areaData; //take out when raw query issue is handled
    var areaSvg = dimple.newSvg(elementId, 540, 550);
    var areaChart = new dimple.chart(areaSvg, areaData);
    areaChart.setBounds(40, 10, 380, 450);
    var areaX = areaChart.addCategoryAxis("x", "month");
    areaX.addGroupOrderRule("month");
    areaChart.addPctAxis("y", "incidents");
    var areaSeries = areaChart.addSeries(["neighborhood", "type"], dimple.plot.area);
    areaSeries.lineWeight = 1;
    areaSeries.barGap = 0.05;
    if (elementId === "#disp-cat-2") {
      areaChart.addLegend(450, 20, 100, 300, "left");
    }
    areaChart.draw();
    areaSvg.selectAll(".dimple-title")
      .style("font-size", '14px')
    areaSvg.selectAll(".dimple-legend")
      .style("font-size", '10px')
  });
}

var renderScatterChart = function(neighborhood, month, code) {
  renderDateDropDownList(month);
  var scatterData
  var queryString = "?neighborhood=" + neighborhood + "&month=" + month + "&code=";
  $.get('/api/v1/stats/neigh_incident_stats' + queryString + "%A", function(arrestStats) {
      scatterData = arrestStats;

      $.get('/api/v1/stats/neigh_incident_stats' + queryString + "%R", function(reportStats) {



        scatterData = scatterData.concat(reportStats);

        var scatterSvg = dimple.newSvg("#neigh-incidents-scatter", 1050, 550)
        scatterData.forEach(function (d) {
          d["Day"] = d["date"].substring(0, d["date"].length - 6);
          d["Time of Day"] =
              "2000-01-01 " + d["date"].substring(d["date"].length - 5);
        }, this);


        var scatterChart = new dimple.chart(scatterSvg, scatterData);
        scatterChart.setBounds(60, 20, 650, 450)
        var scatterY = scatterChart.addTimeAxis("y", "Day", "%d %b %Y", "%d %b");
        var scatterX = scatterChart.addTimeAxis("x", "Time of Day",
          "%Y-%m-%d %H:%M", "%H:%M");

        scatterChart.addSeries(["neighborhood", "address", "disposition description", "call type description"], dimple.plot.scatter);
        var scatterLegend = scatterChart.addLegend(820, 120, 60, 300);
        scatterChart.draw();

        scatterSvg.selectAll(".dimple-axis-x")
          .style("font-size", '14px')
          .attr("y", 520)
        scatterSvg.selectAll(".dimple-axis-y")
          .style("font-size", '14px')

        scatterChart.legends = [];
            scatterSvg.selectAll("title_text")
              .data(["Click legend to","show/hide by Call Type:"])
              .enter()
              .append("text")
                .attr("x", 860)
                .attr("y", function (d, i) { return 80 + i * 15; })
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .style("color", "Black")
                .text(function (d) { return d; });


        var scatterFilterValues = dimple.getUniqueValues(scatterData, "call type description");
        scatterLegend.shapes.selectAll("rect")
          .on("click", function (e) {
            var scatterHide = false;
            var newScatterFilters = [];
            scatterFilterValues.forEach(function (f) {
              if (f === e.aggField.slice(-1)[0]) {
                scatterHide = true;
              } else {
                newScatterFilters.push(f);
              }
            });
            if (scatterHide) {
              d3.select(this).style("opacity", 0.2);
            } else {
              newScatterFilters.push(e.aggField.slice(-1)[0]);
              d3.select(this).style("opacity", 0.8);
            }
            scatterFilterValues = newScatterFilters;
            scatterChart.data = dimple.filterData(scatterData, "call type description", scatterFilterValues);
            scatterChart.draw(900);
        });
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

var renderDateDropDownList = function(date) {
  $("date-select-span").remove();
  $.get("/api/v1/incidents_months", function(dates) {
    var selectEl = "<span id='date-select-span'><select class='form-control' id='date-select'></select></span>"
    $(selectEl).appendTo("#scatter-title")
    $.each(dates, function(index, item) {
        var value = item.split("/")[0] + "/01/" + item.split("/")[1]
        $("#date-select").append(
            $("<option></option>")
                .text(item)
                .val(value)
        );
    });
    if(date) {$('.scatter-chart option[value="'+ date +'"]').prop('selected', true)}
    listenForDateRequest();
  });
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

var listenForDateRequest = function() {
  $("#date-select").on("change", function(e){
    var month = $(this).val();
    var neighborhood = $("#scatter-title").text().split("1")[0];
    prepareChartArea("#neigh-incidents-scatter", neighborhood);
    renderScatterChart(neighborhood, month, "A")
  })
}

var renderErrorMessage = function(element) {
  element.after("<p class='error'>Please select a valid neighbohrood</p>");
}

var removeErrorMessages = function(element) {
  $(".error").remove();
}

var renderSelectedChart = function(chartElementId, selectedNeighborhood) {
  prepareChartArea(chartElementId, selectedNeighborhood);
  if(chartElementId === "#neigh-incidents-scatter") {
    renderScatterChart(selectedNeighborhood, "01/01/15", "A");
  } else {
    renderAreaChart(chartElementId, selectedNeighborhood);
  }
}

var renderBubbleChart = function() {
  $.get('/api/v1/stats/overview_stats', function(stats) {
    toggleSpinner();
    var bubbleStats = stats.length === 2 ? stats[0] : stats;

    var bubbleSvg = dimple.newSvg("#neighborhood-stats", 1050, 550);
    var bubbleChart = new dimple.chart(bubbleSvg, bubbleStats);
    bubbleChart.setBounds(60, 60, 850, 450)
    var bubbleX = bubbleChart.addMeasureAxis("x", "num_incidents");
    bubbleX.title = "Total Number of Incidents"
    var bubbleY = bubbleChart.addMeasureAxis("y", "num_arrests");
    bubbleY.title = "Total Number of Arrests"
    var z = bubbleChart.addMeasureAxis("z", "num_transient_incidents");

    bubbleY.overrideMax = 1800;
    bubbleX.overrideMax = 25000;


    var bubbleSeries = bubbleChart.addSeries(["neighborhood"], dimple.plot.bubble);

    bubbleSeries.getTooltipText = function (e) {
        return [
            "Neighborhood: " + e.aggField[0],
            "Incidents: " + e.cx.toFixed(0),
            "Arrests: " + e.cz.toFixed(0),
            "Transient Related Incidents: " + e.cy.toFixed(0)
        ];
    };

    bubbleSeries.lineWeight = 4;
    bubbleSeries.lineMarkers = true;
    var bubbleLegend = bubbleChart.addLegend(1000, 190, 60, 300, "Right");
    bubbleChart.draw();

    bubbleSvg.selectAll(".dimple-axis-x")
      .style("font-size", '14px')
      .attr("y", 550)
    bubbleSvg.selectAll(".dimple-axis-y")
      .style("font-size", '14px')
    bubbleSvg.selectAll(".dimple-legend")
      .style("font-size", '12px')
    bubbleSvg.selectAll(".dimple-custom-axis-label")
      .style("font-size", '12px')


    bubbleChart.legends = [];
        bubbleSvg.selectAll("title_text")
          .data(["Click legend to","show/hide:"])
          .enter()
          .append("text")
            .attr("x", 925)
            .attr("y", function (d, i) { return 80 + i * 14; })
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .style("color", "Black")
            .text(function (d) { return d; });


    var bubbleFilterValues = dimple.getUniqueValues(bubbleStats, "neighborhood");
    bubbleLegend.shapes.selectAll("rect")
      .on("click", function (e) {
        var bubbleHide = false;
        var newBubbleFilters = [];
        bubbleFilterValues.forEach(function (f) {
          if (f === e.aggField.slice(-1)[0]) {
            bubbleHide = true;
          } else {
            newBubbleFilters.push(f);
          }
        });
        if (bubbleHide) {
          d3.select(this).style("opacity", 0.2);
        } else {
          newBubbleFilters.push(e.aggField.slice(-1)[0]);
          d3.select(this).style("opacity", 0.8);
        }
        bubbleFilterValues = newBubbleFilters;
        bubbleChart.data = dimple.filterData(bubbleStats, "neighborhood", bubbleFilterValues);
        bubbleChart.draw(900);
      });
  });
}
