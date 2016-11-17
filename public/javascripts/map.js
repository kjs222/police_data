$(document).ready(function() {
  drawMap();

});

var drawMap = function() {
  d3.json("sd_neigh_geojson.json", function(data) {
    var margin = 75,
        width = 1920-margin,
        height = 1080 - margin

    var svg = d3.select("#map")
                .append('svg')
                .attr('width', width + margin)
                .attr('height', height + margin)
                .append('g')
                .attr('class', 'map')

    var projection = d3.geo.mercator()
                           .center([-117, 32])
                           .scale(100)
                           .translate([width/2, height/2])

    var path = d3.geo.path()
                     .projection(projection);

    var map = svg.selectAll('path')
                 .data(data.features)
                 .enter()
                 .append('path')
                 .attr('d', path)
                 .style('fill', 'blue')
                 .style('stroke', 'red')

  })

}
