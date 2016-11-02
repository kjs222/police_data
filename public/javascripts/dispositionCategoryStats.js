var renderDispositionCategoryChart = function(element, neighborhood) {
  $(element).empty();
  $.get('api/v1/stats/disposition_category_stats?neighborhood=' + neighborhood, function(data){
    var svg = dimple.newSvg(element, 400, 400);
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(70, 30, 200, 330);
    var x = myChart.addCategoryAxis("x", "month");
    x.addGroupOrderRule("month");
    myChart.addPctAxis("y", "incidents");
    var s = myChart.addSeries(["neighborhood", "type"], dimple.plot.area);
    s.lineWeight = 1;
    s.barGap = 0.05;
    if (element === "#disp-cat-2") {
      myChart.addLegend(300, 20, 100, 300, "left");
    }
    myChart.draw();
  });
}

var renderNeighborhoodDropDownList = function() {
  var dataLists = $(".neigh-dropdown");
  $.get('/api/v1/neighborhood_names', function(names) {
      names.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.className = "neigh-selection";
        dataLists.each(function() {
          this.append(option);
        });
      });
    listenForNeighborhoodRequest(names);
  })
}

var listenForNeighborhoodRequest = function(allNeighNames) {
  $(".neigh-select").on("click", function(e){
    removeErrorMessages();
    var chartElementId = "#" + $($(this).next(".chart")).attr('id');
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
