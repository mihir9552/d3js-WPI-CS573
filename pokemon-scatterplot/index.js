const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const title = "Pokemon: Special Attack vs. Special Defence";
  if (d => d["special-attack"]) {
    console.log(d => d.name);

    const xValue = d => d["special-attack"];
    const xAxisLabel = "Special Attack";

    const yValue = d => d["special-defence"];
    const circleRadius = 6;
    const yAxisLabel = "Special Defence";

    const margin = { top: 60, right: 40, bottom: 88, left: 130 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    const colorScale = d3
      .scaleOrdinal()
      .domain(["2016", "2017", "2018"])
      .range(["#4286f4", "#3b424f", "#319b17"]);

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
      .attr("y", -75)
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
      .attr("y", 75)
      .attr("x", innerWidth / 2)
      .attr("fill", "black")
      .text(xAxisLabel);

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", d => yScale(yValue(d)))
      .attr("cx", d => xScale(xValue(d)))
      .attr("r", circleRadius);

    g.append("text")
      .attr("class", "title")
      .attr("y", -10)
      .text(title);
  }
};

d3.csv("https://vizhub.com/threedoorsdown0/datasets/pokemon_dataset.csv").then(
  data => {
    data.forEach(d => {
      d.height = +d.height;
      d.weight = +d.weight;
      d["special-attack"] = +d["special-attack"];
      d["special-defence"] = +d["special-defence"];
      d.name = d.name;
    });
    render(data);
  }
);
