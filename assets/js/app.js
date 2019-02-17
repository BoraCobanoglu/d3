// The code for the chart is wrapped inside a function
// that automatically resizes the chart

function makeResponsive() {

  // if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart

  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

// Get the current frame's height and width
  var w = window.innerWidth;
  var h = window.innerHeight;

    // margin - height - width
  var margin = {
    top = 50
    bottom = 50
    right = 50
    left = 50
  };

  var height = h - margin.top - margin.bottom;
  var width = w - margin.left - margin.right;

// append svg and chartGroup

var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", h)
  .attr("width", w);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// we need scales and axis, but first we need to grab data
var url = "./assets/data/data.csv"

d3.csv(url, (err, csvData) => {
     if (err) throw err;
      csvData.forEach(function(data) {
        data.abbr = +data.abbr;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
  });


// scales
    var xScale = d3.scaleLinear()
      .domain(d3.extent(csvData, data => data.poverty))
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(csvData, data => data.obesity)])
      .range([height, 0]);

  // Create initial axis functions

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
      // append y axis
    chartGroup.append("g")
        .call(leftAxis);

// x axis label

    chartGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .classed("active", true)
        .text("Poverty");

// y axis label

    chartGroup.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x", 0 - (height / 2))
     .attr("dy", "1em")
     .classed("axis-text", true)
     .text(" Obesity ");


        // append circles
      var circleGroup = chartGroup.selectAll("circle")
          .data(csvData)
          .enter()
          .append("circle")
          .attr("cx", data => xScale(data.poverty))
          .attr("cy", data => yScale(data.obesity))
          .attr("r", 20)
          .attr("fill", "blue")
          .attr("opacity", .5);

          chartGroup.selectAll("text.stateText")
          .data(csvData)
          .enter()
          .append("text")
          .attr("class", "stateText")
          .text(data => data.abbr)
          .attr("x", data => xScale(data.poverty))
          .attr("y", data => yScale(data.obesity));

});

}

makeResponsive();

d3.select(window).on("resize", makeResponsive);
