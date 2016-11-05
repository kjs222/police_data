var renderDispositionCategoryChart = function(elementId, neighborhood) {
  prepareChartArea(elementId, neighborhood);
  $.get('api/v1/stats/disposition_category_stats?neighborhood=' + neighborhood, function(data){
    var data = data.length === 2 ? data[0] : data;
    var svg = dimple.newSvg(elementId, 450, 400);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(70, 10, 300, 280);
    var x = myChart.addCategoryAxis("x", "month");
    x.addGroupOrderRule("month");
    var y = myChart.addPctAxis("y", "incidents");
    y.title = "% of Incidents"
    var s = myChart.addSeries(["neighborhood", "type"], dimple.plot.area);
    s.lineWeight = 1;
    s.barGap = 0.05;
    if (elementId === "#disp-cat-2") {
      myChart.addLegend(370, 20, 100, 300, "left");
    }
    myChart.draw();
    svg.selectAll(".dimple-title")
      .style("font-size", '14px')
    svg.selectAll(".dimple-legend")
      .style("font-size", '12px')
  });

}

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
      renderDispositionCategoryChart(chartElementId, selectedNeigh)
    }
  })
}

var renderErrorMessage = function(element) {
  element.after("<p class='error'>Please select a valid neighbohrood</p>");
}

var removeErrorMessages = function(element) {
  $(".error").remove();
}

$(document).ready(function() {
  renderNeighborhoodDropDownList();
  renderDispositionCategoryChart("#disp-cat-1", "Gaslamp")
  renderDispositionCategoryChart("#disp-cat-2", "La Jolla")
})
