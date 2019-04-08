const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xValue = d => d.Earnings;
  const yValue = d => d.Movie;
  const margin = { top: 0, bottom: 55, right: 20, left: 180 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  g.append("g").call(d3.axisLeft(yScale));

  g.append("g")
    .call(d3.axisBottom(xScale).ticks(10, "~s"))
    .attr("transform", `translate(0,${innerHeight})`);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth());
};

d3.csv("data.csv").then(data => {
  data.forEach(d => {
    d.Earnings = +d.Earnings;
  });
  render(data);
});

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
