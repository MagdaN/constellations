var orion = null;
var destinations = null;

var total_width = 1120;
var center = {
  'x': 800,
  'y': 320
};

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

function ra2x(ra) {
  var x = ra;
  //x *= 1.5;
  //x += -10;
  x *= (Math.PI / 180.0);
  x = center.x - (Math.cos(x) * inner_circles[0].r);
  return x;
}

function dec2y(dec) {
  var y = dec;
  //y *= 1.5;
  //y += 10;
  y *= (Math.PI / 180.0);
  y = center.y + (Math.sin(y) * inner_circles[0].r);
  return y;
}

function transition(destination) {
  console.log('hi');
  d3.select('#orion').selectAll("circle")
    .transition()
    .duration(2000)
    .attr("cx", function (d) {
      return ra2x(d.coords[destination].ra);
    })
    .attr("cy", function (d) {
      return dec2y(d.coords[destination].dec);
    });
}

$( document ).ready(function() {

  var svgContainer = d3.select("#stars").append("svg")
                          .attr("width", total_width)
                          .attr("height", total_width);
  
  var circleGroup = svgContainer.append("g");
  var elipseGroup = svgContainer.append("g");

  circleGroup.selectAll("circle")
                          .data(inner_circles)
                          .enter()
                          .append("circle")
                          .attr("cx", center.x)
                          .attr("cy", center.y)
                          .attr("r", function (d) { return d.r; })
                          .attr("fill","transparent")
                          .attr("stroke","white");

  circleGroup.append("circle")
                          .attr("cx", center.x)
                          .attr("cy", center.y)
                          .attr("r", outer_circle.r)
                          .attr("fill", "transparent")
                          .attr("stroke", "white")
                          .attr("stroke-width", 4);

  circleGroup.append("circle")
                          .attr("cx", center.x)
                          .attr("cy", center.y)
                          .attr("r", 20)
                          .attr("fill", "white")
                          .attr("stroke", "white");

  elipseGroup.selectAll("ellipse")
                          .data(ellipse_list)
                          .enter()
                          .append("ellipse")
                          .attr("cx", center.x)
                          .attr("cy", center.y)
                          .attr("rx", function (d) { return d.rx;})
                          .attr("ry",function (d) { return d.ry;})
                          .attr("fill", "transparent")
                          .attr("stroke", "white")
                          .style("stroke-dasharray", ("6, 10"));

  var buttonGroup = svgContainer.append("g");
  var textfield = svgContainer.append("rect")
                                .attr("id", 'textfield')
                                .attr("x", 60)
                                .attr("y", 300)
                                .attr("width", 120)
                                .attr("height", 40)
                                .attr("class", "legend")
                                .style("fill", "white")
                                .style("visibility", "hidden");

  d3.json("data/orion.json", function(error, json) {
    if (error) return console.warn(error);

    orion = json.orion;
    destinations = json.destinations;

    for (var i=0; i<destinations.length; i++) {
      destinations[i]['y'] = 200 + 80 * i;
    }

    buttonGroup.selectAll("circle")
      .data(destinations)
      .enter()
      .append("circle")
      .attr("cx", 20)
      .attr("cy", function (d) { return d.y; } )
      .attr("r", 20)
      .attr("fill", "white")
      .attr("stroke", "white")
      .attr("name", function (d) { return d.name; })
      .on("click", function(d){
        d3.select('#textfield').style("visibility", "visible");
        transition(d.name);
      });

    svgContainer.append("g")
      .attr('id','orion')
      .selectAll("circle")
      .data(orion)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return ra2x(d.coords['Sol'].ra);
      })
      .attr("cy", function (d) {
        return dec2y(d.coords['Sol'].dec);
      })
      .attr("r", 3)
      .attr("fill","white");
  
  });

  random_stars = [];

  for (var i=0; i<2000; i++) {
    var random_star = {
      r: Math.random(),
      x: ra2x(Math.random() * 180),
      y: dec2y((Math.random() - 0.5) * 180)
    };

    var dist = Math.sqrt(Math.pow(random_star.x - center.x,2) + Math.pow(random_star.y - center.y,2));

    if (dist < inner_circles[0].r) {
      random_stars.push(random_star);
    }
  }

  svgContainer.append("g").selectAll("circle")
    .data(random_stars)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", function (d) {
      return d.r;
    })
    .attr("fill","white");

});
