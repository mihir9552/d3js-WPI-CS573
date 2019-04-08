// import { dropdownMenu } from "./dropdownMenu";
// import { scatterplot } from "./scatterplot";

const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

let data;
let xColumn;
let yColumn;

const onXColumnClicked = column => {
  xColumn = column;
  render();
};

const onYColumnClicked = column => {
  yColumn = column;
  render();
};

const render = () => {
  d3.select("#x-menu").call(dropdownMenu, {
    options: data.columns,
    onOptionClicked: onXColumnClicked,
    selectedOption: xColumn
  });

  d3.select("#y-menu").call(dropdownMenu, {
    options: data.columns,
    onOptionClicked: onYColumnClicked,
    selectedOption: yColumn
  });

  svg.call(scatterplot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn,
    yValue: d => d[yColumn],
    circleRadius: 6,
    yAxisLabel: yColumn,
    margin: { top: 15, right: 40, bottom: 88, left: 130 },
    width,
    height,
    data
  });
};

const dropdownMenu = (selection, props) => {
  const { options, onOptionClicked, selectedOption } = props;

  let select = selection.selectAll("select").data([null]);
  select = select
    .enter()
    .append("select")
    .merge(select)
    .on("change", function() {
      onOptionClicked(this.value);
    });

  const option = select.selectAll("option").data(options);
  option
    .enter()
    .append("option")
    .merge(option)
    .attr("value", d => d)
    .property("selected", d => d === selectedOption)
    .text(d => d);
};

d3.csv("https://vizhub.com/threedoorsdown0/datasets/pokemon_modified.csv").then(
  loadedData => {
    data = loadedData;
    data.forEach(d => {
      d.height = +d.height;
      d.weight = +d.weight;
      d["special-attack"] = +d["special-attack"];
      d["special-defence"] = +d["special-defence"];
      d.base_experience = +d.base_experience;
      d.defense = +d.defense;
      d.attack = +d.attack;
      d.hp = +d.hp;
      d.speed = +d.speed;
    });
    xColumn = data.columns[2];
    yColumn = data.columns[0];
    render(data);
  }
);

// import {
//     select,
//     csv,
//     extent,
//     axisLeft,
//     axisBottom,
//     scaleOrdinal,
//     scaleLinear
//   } from 'd3';

const scatterplot = (selection, props) => {
  const {
    xValue,
    xAxisLabel,
    yValue,
    circleRadius,
    yAxisLabel,
    margin,
    width,
    height,
    data
  } = props;

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

  const g = selection.selectAll(".container").data([null]);
  const gEnter = g
    .enter()
    .append("g")
    .attr("class", "container");
  gEnter.merge(g).attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.select(".y-axis");
  const yAxisGEnter = gEnter.append("g").attr("class", "y-axis");
  yAxisG
    .merge(yAxisGEnter)
    .call(yAxis)
    .selectAll(".domain")
    .remove();

  const yAxisLabelText = yAxisGEnter
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -75)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .merge(yAxisG.select(".axis-label"))
    .attr("x", -innerHeight / 2)
    .text(yAxisLabel);

  const xAxisG = g.select(".x-axis");
  const xAxisGEnter = gEnter.append("g").attr("class", "x-axis");
  xAxisG
    .merge(xAxisGEnter)
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll(".domain")
    .remove();

  const xAxisLabelText = xAxisGEnter
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 75)
    .attr("fill", "black")
    .merge(xAxisG.select(".axis-label"))
    .attr("x", innerWidth / 2)
    .text(xAxisLabel);

  const circles = g
    .merge(gEnter)
    .selectAll("circle")
    .data(data);
  circles
    .enter()
    .append("circle")
    .attr("cx", innerWidth / 2)
    .attr("cy", innerHeight / 2)
    .attr("r", 0)
    .merge(circles)
    .transition()
    .duration(1000)
    .delay((d, i) => i * 0.5)
    .attr("cy", d => yScale(yValue(d)))
    .attr("cx", d => xScale(xValue(d)))
    .attr("r", circleRadius);
};
