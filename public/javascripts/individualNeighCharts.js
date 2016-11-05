// var renderDispositionCategoryChart = function(elementId, neighborhood) {
//   $.get('api/v1/stats/disposition_category_stats?neighborhood=' + neighborhood, function(areaData){
//     var areaData = areaData.length === 2 ? areaData[0] : areaData; //take out when raw query issue is handled
//     var areaSvg = dimple.newSvg(elementId, 540, 550);
//     var areaChart = new dimple.chart(areaSvg, areaData);
//     areaChart.setBounds(70, 10, 380, 450);
//     var areaX = areaChart.addCategoryAxis("x", "month");
//     areaX.addGroupOrderRule("month");
//     areaChart.addPctAxis("y", "incidents");
//     var areaSeries = areaChart.addSeries(["neighborhood", "type"], dimple.plot.area);
//     areaSeries.lineWeight = 1;
//     areaSeries.barGap = 0.05;
//     if (elementId === "#disp-cat-2") {
//       areaChart.addLegend(450, 20, 100, 300, "left");
//     }
//     areaChart.draw();
//     areaSvg.selectAll(".dimple-title")
//       .style("font-size", '14px')
//     areaSvg.selectAll(".dimple-legend")
//       .style("font-size", '10px')
//   });
// }
//
// var renderNeighborhoodIncidentsChart = function(scatterData) {
//   var scatterSvg = dimple.newSvg("#neigh-incidents-scatter", 1050, 550)
//   scatterData.forEach(function (d) {
//     d["Day"] = d["date"].substring(0, d["date"].length - 6);
//     d["Time of Day"] =
//         "2000-01-01 " + d["date"].substring(d["date"].length - 5);
//   }, this);
//
//
//   var scatterChart = new dimple.chart(scatterSvg, scatterData);
//   scatterChart.setBounds(100, 20, 650, 450)
//   var scatterY = scatterChart.addTimeAxis("y", "Day", "%d %b %Y", "%d %b");
//   var scatterX = scatterChart.addTimeAxis("x", "Time of Day",
//     "%Y-%m-%d %H:%M", "%H:%M");
//
//   scatterChart.addSeries(["neighborhood", "address", "disposition description", "call type description"], dimple.plot.scatter);
//   var scatterLegend = scatterChart.addLegend(860, 120, 60, 300);
//   scatterChart.draw();
//   scatterSvg.selectAll(".dimple-axis-x")
//     .style("font-size", '14px')
//     .attr("y", 520)
//   scatterSvg.selectAll(".dimple-axis-y")
//     .style("font-size", '14px')
//     .attr("y", 100)
//
//   scatterChart.legends = [];
//       scatterSvg.selectAll("title_text")
//         .data(["Click legend to","show/hide by Call Type:"])
//         .enter()
//         .append("text")
//           .attr("x", 860)
//           .attr("y", function (d, i) { return 80 + i * 15; })
//           .style("font-family", "sans-serif")
//           .style("font-size", "10px")
//           .style("color", "Black")
//           .text(function (d) { return d; });
//
//
//   var filterValues = dimple.getUniqueValues(scatterData, "call type description");
//   scatterLegend.shapes.selectAll("rect")
//     .on("click", function (e) {
//       var hide = false;
//       var newFilters = [];
//       filterValues.forEach(function (f) {
//         if (f === e.aggField.slice(-1)[0]) {
//           hide = true;
//         } else {
//           newFilters.push(f);
//         }
//       });
//       if (hide) {
//         d3.select(this).style("opacity", 0.2);
//       } else {
//         newFilters.push(e.aggField.slice(-1)[0]);
//         d3.select(this).style("opacity", 0.8);
//       }
//       filterValues = newFilters;
//       scatterChart.scatterData = dimple.filterData(scatterData, "call type description", filterValues);
//       scatterChart.draw(900);
//   });
// };
//
// var chartNeighborhoodIncidents = function(neighborhood, month, code) {
//   var stats
//   var queryString = "?neighborhood=" + neighborhood + "&month=" + month + "&code=";
//   $.get('/api/v1/stats/neigh_incident_stats' + queryString + "%A", function(arrestStats) {
//       stats = arrestStats;
//       $.get('/api/v1/stats/neigh_incident_stats' + queryString + "%R", function(reportStats) {
//         stats = stats.concat(reportStats);
//         renderNeighborhoodIncidentsChart(stats);
//       });
//   });
// };
//
//
// var prepareChartArea = function(chartElementId, neighborhood) {
//   var element = $(chartElementId);
//   $(element).empty();
//   $(element).prev(".neigh-title").text(neighborhood);
//   $(".neigh-input").val("");
// }
//
// var renderNeighborhoodDropDownList = function() {
//   var dataLists = $(".neigh-dropdown");
//   $.get('/api/v1/neighborhood_names', function(names) {
//       names.forEach(function(name) {
//         var option = '<option value="'+ name + '" class="neigh-selection"></option>'
//         dataLists.each(function() {
//           $(this).append(option);
//         });
//       });
//     listenForNeighborhoodRequest(names);
//   })
// }
// //
// // var renderDataDropDownList = function() {
// //   $.get("/Users/GetUsers", null, function(data) {
// //     // $("#UsersList option").remove(); // Remove all <option> child tags.
// //     // $.each(data.Users, function(index, item) { // Iterates through a collection
// //     //     $("#UsersList").append( // Append an object to the inside of the select box
// //     //         $("<option></option>") // Yes you can do this.
// //     //             .text(item.Description)
// //     //             .val(item.Id)
// //     //     );
// //     // });
// // }
//
// var listenForNeighborhoodRequest = function(allNeighNames) {
//   $(".neigh-select").on("click", function(e){
//     removeErrorMessages();
//     var chartElementId = "#" + $($(this).nextAll(".chart:first")).attr("id");
//     var selectedNeigh = $("#" + $(this).attr("target")).val();
//     if(allNeighNames.indexOf(selectedNeigh) === -1 ) {
//       renderErrorMessage($(this));
//     } else {
//       renderSelectedChart(chartElementId, selectedNeigh)
//     }
//   })
// }
//
// var renderErrorMessage = function(element) {
//   element.after("<p class='error'>Please select a valid neighbohrood</p>");
// }
//
// var removeErrorMessages = function(element) {
//   $(".error").remove();
// }
//
// var renderSelectedChart = function(chartElementId, selectedNeighborhood) {
//   prepareChartArea(chartElementId, selectedNeighborhood);
//   if(chartElementId === "#neigh-incidents-scatter") {
//     chartNeighborhoodIncidents(selectedNeighborhood, "01/01/15", "A");
//   } else {
//     renderDispositionCategoryChart(chartElementId, selectedNeighborhood);
//   }
// }
//
// $(document).ready(function() {
//   renderNeighborhoodDropDownList();
//   renderDispositionCategoryChart("#disp-cat-1", "Gaslamp");
//   renderDispositionCategoryChart("#disp-cat-2", "La Jolla");
//   chartNeighborhoodIncidents("Talmadge", "01/01/15", "A");
// })
