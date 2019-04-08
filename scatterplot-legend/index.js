//LEGENDS ARE SELECTABLE

const loadData = () =>
  d3
    .csv("https://vizhub.com/threedoorsdown0/datasets/pokemon_dataset.csv")
    .then(data => {
      data.forEach(d => {
        d["special-attack"] = +d["special-attack"];
        d["special-defence"] = +d["special-defence"];
        d.type1 = d.type1;
      });
      return data;
    });

//   import { scatterplot } from './scatterplot';

const scatterplot = (selection, props) => {
  const {
    data,
    colorScale,
    colorValue,
    selectedColorValue,
    innerHeight,
    innerWidth,
    circleRadius
  } = props;

  const title = "Pokemon: Special Attack vs Special Defence, by Type";
  //Thanks to Kathleen Cachel
  const titleG = selection.selectAll("g").data([null]);
  const titleGEnter = titleG.enter().append("g");
  const g = titleG.merge(titleGEnter);

  g.append("text")
    .attr("class", "title")
    .attr("x", 390)
    .attr("y", -10)
    .text(title);

  const xValue = d => d["special-attack"];
  const xAxisLabel = "Special Attack";

  const yValue = d => d["special-defence"];
  const yAxisLabel = "Special Defence";

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

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(12)
    .tickSize(-innerHeight)
    .tickPadding(7);

  const xAxisG = selection
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 50)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabel);

  const yAxis = d3
    .axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(5);

  const yAxisG = selection.append("g").call(yAxis);
  yAxisG.selectAll(".domain").remove();

  yAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -35)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .text(yAxisLabel);

  const plotPoints = selection.selectAll(".type").data(data);

  const plotPointsEnter = plotPoints
    .enter()
    .append("circle")
    .attr("class", "type")
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", circleRadius)
    .attr("fill", d => colorScale(d.type1));

  plotPoints
    .merge(plotPointsEnter)
    .attr("opacity", d =>
      !selectedColorValue || d.type1 === selectedColorValue ? 1 : 0.05
    );
};

let types;
let selectedColorValue;
let data;

const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 60, right: 30, bottom: 88, left: 150 };

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const colorScale = d3.scaleOrdinal();
const colorValue = d => d.type1;

const scatterG = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
const colorLegendG = svg.append("g").attr("transform", `translate(20, 70)`);

const render = () => {
  colorScale.domain(types).range(d3.schemeCategory10);

  scatterG.call(scatterplot, {
    data,
    colorScale,
    colorValue,
    selectedColorValue,
    innerWidth,
    innerHeight,
    circleRadius: 5
  });

  colorLegendG.call(colorLegend, {
    colorScale,
    circleRadius: 10,
    spacing: 20,
    textOffset: 10,
    onClick,
    selectedColorValue,
    legendDim: 15
  });
};

loadData().then(processedData => {
  data = processedData;
  //Thanks to Nick Lima
  types = [...new Set(data.map(d => d.type1))];
  render();
});

const onClick = d => {
  selectedColorValue = d;
  render();
};

const colorLegend = (selection, props) => {
  const {
    colorScale,
    circleRadius,
    spacing,
    textOffset,
    onClick,
    selectedColorValue,
    legendDim
  } = props;

  const groups = selection.selectAll(".legend").data(colorScale.domain());

  const groupsEnter = groups
    .enter()
    .append("g")
    .attr("class", "legend");

  groupsEnter
    .merge(groups)
    .attr("transform", (d, i) => `translate(0, ${i * spacing})`)
    .attr("opacity", d =>
      !selectedColorValue || d === selectedColorValue ? 1 : 0.3
    )
    .on("click", d => onClick(d === selectedColorValue ? null : d));

  //groups.exit().remove();

  groupsEnter
    .append("rect")
    .merge(groups.select("rect"))
    .attr("x", -12)
    .attr("y", -8)
    .attr("width", legendDim)
    .attr("height", legendDim)
    .attr("fill", colorScale);

  groupsEnter
    .append("text")
    .merge(groups.select("text"))
    .text(d => d)
    .attr("dy", "0.32em")
    .attr("x", textOffset);

  groups.exit().remove();
};
