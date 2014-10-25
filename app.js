$( document ).ready(function() {

  var total_width = 640;
  var center      = 320;

  outer_circle = {
    'r': 310
  };
  inner_circles = [
    {'r': 300},
    {'r':  25},
    {'r':  50}
  ];

  ellipse_list = [
    {'rx': 300, 'ry':  60},
    {'rx': 300, 'ry': 180},
    {'rx':  60, 'ry': 300},
    {'rx': 180, 'ry': 300}
  ];

  var svgContainer = d3.select("#stars").append("svg")
                          .attr("width", total_width)
                          .attr("height", total_width);
  
  var circleGroup = svgContainer.append("g");
  var elipseGroup = svgContainer.append("g");

  circleGroup.selectAll("circle")
                          .data(inner_circles)
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
                          .attr("r", outer_circle.r)
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
            x = center - (Math.cos(x) * inner_circles[0].r);
            return x;
          })
          .attr("cy", function (d) {
            var y = d.coords[destination].dec;
            //y *= 1.5;
            y += 10;
            y *= (Math.PI / 180.0);
            y = center + (Math.sin(y) * inner_circles[0].r);
            return y;
          })
          .attr("r", 3)
          .attr("fill","white");
      });
    });

});

