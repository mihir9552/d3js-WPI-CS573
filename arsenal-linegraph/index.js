const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const title = "Points per game for Arsenal over 5 seasons";

  const xValue = d => d.date_13;
  const xAxisLabel = "Month";

  const date_14 = d => d.date_14;
  const points_14 = d => d.points_14;

  const date_15 = d => d.date_15;
  const points_15 = d => d.points_15;

  const date_16 = d => d.date_16;
  const points_16 = d => d.points_16;

  const date_17 = d => d.date_17;
  const points_17 = d => d.points_17;

  const yValue = d => d.points_13;
  const circleRadius = 6;
  const yAxisLabel = "Points per Game";

  const margin = { top: 60, right: 40, bottom: 88, left: 105 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(data.map(xValue))
    .range([-43, innerWidth + 43]);

  console.log(xValue);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([innerHeight, 0])
    .nice();

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();

  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -60)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 80)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);

  const lineGenerator = d3
    .line()
    .x(d => xScale(xValue(d)) + 44)
    .y(d => yScale(yValue(d)) + 2)
    .curve(d3.curveCardinal);

  g.append("path")
    .attr("class", "line-path")
    .attr("d", lineGenerator(data));

  g.append("text")
    .attr("class", "title")
    .attr("y", -10)
    .text(title);

  const newlineGenerator = d3
    .line()
    .x(d => xScale(xValue(d)) + 44)
    .y(d => yScale(points_14(d)) + 2)
    .curve(d3.curveCardinal);

  g.append("path")
    .attr("class", "new-line-path")
    .attr("d", newlineGenerator(data));

  const anotherlineGenerator = d3
    .line()
    .x(d => xScale(xValue(d)) + 44)
    .y(d => yScale(points_15(d)) + 2)
    .curve(d3.curveCardinal);

  g.append("path")
    .attr("class", "another-line-path")
    .attr("d", anotherlineGenerator(data));

  const toomanylineGenerator = d3
    .line()
    .x(d => xScale(xValue(d)) + 44)
    .y(d => yScale(points_16(d)) + 2)
    .curve(d3.curveCardinal);

  g.append("path")
    .attr("class", "toomany-line-path")
    .attr("d", toomanylineGenerator(data));

  const lastlineGenerator = d3
    .line()
    .x(d => xScale(xValue(d)) + 44)
    .y(d => yScale(points_17(d)) + 5)
    .curve(d3.curveCardinal);

  g.append("path")
    .attr("class", "last-line-path")
    .attr("d", lastlineGenerator(data));

  const colorScale = d3
    .scaleOrdinal()
    .domain(["2013/14", "2014/15", "2015/16", "2016/17", "2017/18"])
    .range(["#3869B1", "#DA7E30", "#3F9852", "#CC2428", "#535055"]);

  // Reference: http://bl.ocks.org/weiglemc/6185069
  // draw legend
  var legend = svg
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(-40,${(i + 21.18) * 20})`);

  // draw legend colored rectangles
  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("y", -110)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  // draw legend text
  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", -105)
    .attr("dy", ".6em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
};

d3.csv("https://vizhub.com/threedoorsdown0/datasets/arsenal_points.csv").then(
  data => {
    data.forEach(d => {
      d.points_13 = +d.points_13;
      d.date_13 = d.date_13;
      d.points_14 = +d.points_14;
      d.date_14 = d.date_14;
      d.points_15 = +d.points_15;
      d.date_15 = d.date_15;
      d.points_16 = +d.points_16;
      d.date_16 = d.date_16;
      d.points_17 = +d.points_17;
      d.date_17 = d.date_17;
    });
    render(data);
  }
);
