import React, { useEffect } from 'react';
import * as d3 from 'd3';

const styleDefs = require("./bar.scss");


const width = 600 //Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const height = 500 //Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

const BarChart = (props) => {
  useEffect(() => {
   d3.select('.barChart > *').remove();
   draw(props)
 },[props])
  return <div className="barChart" />
}

var xScale = d3.scaleBand().range([0, 3*width/4]).padding(0.1),
    yScale = d3.scaleLinear().range([3*height/4, 0]);

const draw = (props) => {

    d3.csv( props.data , function(d) {
      return {
        valueX : d[props.headerX],
        valueY : d[props.headerY],
        };
      }).then(function(data) {

    const margin = 50
    var  svgBars = d3.select('.barChart').append('svg')
          .attr("width", width - margin)
          .attr("height", height - margin);
    var gBar2 = svgBars.append("g")
          .attr("transform", "translate(" + 50 + "," +30 + ")")

    xScale.domain(data.map(function(d) { return d.valueX; }))
    yScale.domain([0, d3.max(data, function(d) { return d.valueY; })])

    var x_axis = d3.axisBottom()
          .scale(xScale);

    var y_axis = d3.axisLeft()
          .scale(yScale);

    gBar2.append("g")
       .call(y_axis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y",15)
       .attr("dy", "-5.1em")
       .attr("text-anchor", "end")
       .attr("stroke", "black")
       .text(props.headerY);


    var xAxisTranslate = 3*height/4 ;

    gBar2.append("g")
        .attr("transform", "translate(0, " +  xAxisTranslate +")")
        .call(x_axis)
        .append("text")
        .attr("y",30)
        .attr("x",3*width/4)
        .attr("stroke", "black")
        .text(props.headerX);

    gBar2.selectAll(".bar")
        .attr("transform", "translate(0, " + xAxisTranslate  +")")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.valueX); })
        .attr("y", function(d) { return yScale(d.valueY); })
        .attr("width", xScale.bandwidth())
        .attr("height",function(d) { return xAxisTranslate  - yScale(d.valueY); })
        .attr("fill", styleDefs.primaryColor)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .transition()
         .ease(d3.easeLinear)
         .duration(400)
         .delay(function (d, i) {
             return i * 50;
         })
        });
  }

  function handleMouseOver(d, i) {
    d3.select(this).attr("fill", styleDefs.contrastColor)
    d3.select(this).transition()
      .duration(400)
      .attr('width', xScale.bandwidth() + 5)
      .attr("y", function(d) { return yScale(d.valueY)-5; })
      .attr("x", function(d) { return xScale(d.valueX)-2.5; })
      .attr("height", function(d) { return 3*height/4 + 5 - yScale(d.valueY); });



    d3.select(this.parentNode).append("text")
      .attr('class', 'val')
      .attr("x", function() { return  xScale(d.valueX);})
      .attr("y", function() { return yScale(d.valueY) -15 ; })
      .text(function() {
        return [ '$' +d.valueY];  // Value of the text
    });
  }

  function handleMouseOut(d, i) {
    d3.select(this).attr("fill", styleDefs.primaryColor);
    d3.select(this).transition()
      .duration(400)
      .attr('width', xScale.bandwidth())
      .attr("y", function(d) { return yScale(d.valueY); })
      .attr("x", function(d) { return xScale(d.valueX); })
      .attr("height", function(d) { return 3*height/4 - yScale(d.valueY); });

    d3.selectAll('.val')
        .remove()
  }
export default BarChart
