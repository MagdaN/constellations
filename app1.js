$( document ).ready(function() {

  var svgContainer = d3.select("#stars").append("svg")
                                        .attr("width", 700)
                                        .attr("height", 700);

  var firnament_outer = svgContainer.append("circle")
                                      .attr("cx", 350)
                                      .attr("cy", 350)
                                      .attr("r", 350)
                                      .attr("fill", "black")
                                      .attr("stroke", "white");

  var firnament = svgContainer.append("circle")
                                      .attr("cx", 350)
                                      .attr("cy", 350)
                                      .attr("r", 340)
                                      .attr("fill", "black")
                                      .attr("stroke", "white");

  var horizontal_elipse = svgContainer.append("ellipse")
                            .attr("cx", 350)
                            .attr("cy", 350)
                            .attr("rx", 340)
                            .attr("ry",80)
                            .attr("fill", "black")
                            .attr("stroke", "white")
                            .style("stroke-dasharray", ("6, 10"));

  var vertical_elipse = svgContainer.append("ellipse")
                            .attr("cx", 350)
                            .attr("cy", 350)
                            .attr("rx", 80)
                            .attr("ry",340)
                            .attr("fill", "transparent")
                            .attr("stroke", "white")
                            .style("stroke-dasharray", ("6, 10"));

  var horizontal_line = svgContainer.append("line")
                                            .attr("x1", 10)
                                            .attr("y1", 350)
                                            .attr("x2", 690)
                                            .attr("y2", 350)
                                            .attr("stroke", "white");

  var vertical_line = svgContainer.append("line")
                                            .attr("x1", 350)
                                            .attr("y1", 0)
                                            .attr("x2", 350)
                                            .attr("y2", 700)
                                            .attr("stroke", "white");
  
                                


  d3.json("data/orion.json", function(error, json) {
    if (error) return console.warn(error);
    console.log(json.orion);

    var orionGroup = svgContainer.append("g");

    var destination = 'sol';
    var destination = 'Sirius';
    var destination = 'Polaris';
    var destination = 'Deneb';


    orionGroup.selectAll("circle")
      .data(json.orion)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        var x = d.coords[destination].ra;
        //x *= 1.5;
        //x += -20;
        x *= (Math.PI / 180.0);
        x = 360 - (Math.cos(x) * 360);
        return x; 
      })
      .attr("cy", function (d) {
        var y = d.coords[destination].dec;
        //y *= 1.5;
        //y += -30;
        y *= (Math.PI / 180.0);
        y = (Math.sin(y) * 360) + 360;
        return y;
      })
      .attr("r",3)
      .attr("fill","white");
  });


});

