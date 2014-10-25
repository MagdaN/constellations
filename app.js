$( document ).ready(function() {

  var total_width = 760;
  var center      = 380;

  circle_list = [{'r': 360}, {'r': 25}, {'r': 50}];

  ellipse_list = [
    {'rx': 360, 'ry':90},
    {'rx':360, 'ry': 250},
    {'rx': 90, 'ry': 360},
    {'rx': 250, 'ry': 360}
  ];

  var svgContainer = d3.select("#stars").append("svg")
                          .attr("width", total_width)
                          .attr("height", total_width);
  
  var circleGroup = svgContainer.append("g");
  var elipseGroup = svgContainer.append("g");

  circleGroup.selectAll("circle")
                          .data(circle_list)
                          .enter()
                          .append("circle")
                          .attr("cx", center)
                          .attr("cy", center)
                          .attr("r", function (d) { return d.r; })
                          .attr("fill","transparent")
                          .attr("stroke","white");

  circleGroup.append("circle")
                          .attr("cx", center)
                          .attr("cy", center)
                          .attr("r", 370)
                          .attr("fill", "transparent")
                          .attr("stroke", "white")
                          .attr("stroke-width", 4);

  circleGroup.append("circle")
                          .attr("cx", center)
                          .attr("cy", center)
                          .attr("r", 20)
                          .attr("fill", "white")
                          .attr("stroke", "white");

  elipseGroup.selectAll("ellipse")
                          .data(ellipse_list)
                          .enter()
                          .append("ellipse")
                          .attr("cx", center)
                          .attr("cy", center)
                          .attr("rx", function (d) { return d.rx;})
                          .attr("ry",function (d) { return d.ry;})
                          .attr("fill", "transparent")
                          .attr("stroke", "white")
                          .style("stroke-dasharray", ("6, 10"));

  d3.json("data/orion.json", function(error, json) {
    if (error) return console.warn(error);

    $.each(['Sol','Sirius','Polaris','Deneb'], function(key, destination) {

        var group  = svgContainer.append("g");
  
        group.selectAll("circle")
          .data(json.orion)
          .enter()
          .append("circle")
          .attr("cx", function (d) {
            var x = d.coords[destination].ra;
            //x *= 1.5;
            x += -10;
            x *= (Math.PI / 180.0);
            x = 360 - (Math.cos(x) * 360);
            return x; 
          })
          .attr("cy", function (d) {
            var y = d.coords[destination].dec;
            //y *= 1.5;
            y += 10;
            y *= (Math.PI / 180.0);
            y = (Math.sin(y) * 360) + 360;
            return y;
          })
          .attr("r", 3)
          .attr("fill","white");
      });
    });

});

