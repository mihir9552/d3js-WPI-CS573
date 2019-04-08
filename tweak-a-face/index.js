const svg = d3.select("svg");

const width = +svg.attr("width");
const height = +svg.attr("height");

const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const mouthg = svg
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 1.35})`);

const circle = g
  .append("circle")
  .attr("r", height / 2)
  .attr("fill", "red")
  .attr("stroke", "black");

const eyeSpacing = 100;
const eyeYOffset = -70;
const eyeRadius = 40;
const eyebrowWidth = 70;
const eyebrowHeight = 20;
const eyebrowYOffset = -70;
const irisRadius = 20;
const pupilRadius = 10;

const eyesG = g
  .append("g")
  .attr("transform", `translate(0, ${eyeYOffset})`)
  .attr("fill", "white");

const g2 = g
  .append("g")
  .attr("transform", `translate(-100, ${-100})`)
  .attr("fill", "black");

const leftEye = g2.append("path").attr(
  "d",
  d3.arc()({
    innerRadius: 0,
    outerRadius: 90,
    startAngle: Math.PI / 2,
    endAngle: (Math.PI * 3) / 2
  })
);

const rightEye = eyesG
  .append("circle")
  .attr("r", eyeRadius)
  .attr("cx", eyeSpacing);

const eyepatchStrap = g2
  .append("line")
  .style("stroke", "black")
  .attr("stroke-width", 10)
  .attr("x1", -130)
  .attr("y1", 0)
  .attr("x2", 330)
  .attr("y2", 0);

const eyebrowsG = eyesG
  .append("g")
  .attr("transform", `translate(0, ${eyebrowYOffset})`)
  .attr("fill", "black");

const leftEyebrow = eyebrowsG
  .append("rect")
  .attr("x", -eyeSpacing - eyebrowWidth / 2)
  .attr("width", eyebrowWidth)
  .attr("height", eyebrowHeight)
  .attr("transform", `rotate(45)translate(50, 50)`);

const rightEyebrow = eyebrowsG
  .append("rect")
  .attr("x", eyeSpacing - eyebrowWidth / 2)
  .attr("width", eyebrowWidth)
  .attr("height", eyebrowHeight)
  .attr("transform", `rotate(-45)translate(-50, 50)`);

//Irises
const irisG = eyesG.append("g").attr("fill", "blue");

const rightIris = irisG
  .append("circle")
  .attr("r", irisRadius)
  .attr("cx", eyeSpacing);

//Pupils
const pupilG = irisG.append("g").attr("fill", "black");

const rightPupil = pupilG
  .append("circle")
  .attr("r", pupilRadius)
  .attr("cx", eyeSpacing);

const mouth = mouthg
  .append("path")
  .attr(
    "d",
    d3.arc()({
      innerRadius: 0,
      outerRadius: 80,
      startAngle: Math.PI / 2,
      endAngle: (Math.PI * 3) / 2
    })
  )
  .attr("transform", `rotate(180)`);
