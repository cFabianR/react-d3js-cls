import React, {
	useEffect
} from 'react';
import * as d3 from 'd3';

const BubblesChart = (props) => {
	useEffect(() => {
		d3.select('.BubblesChart > *').remove(); //elimina seccion anterior
		draw(props)
	}, [props])
	return <div className = "BubblesChart" / >
}

const width = 750 //Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const height = 450 //Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const margin = 60
let svg
let xScale = null;
let yScale = null;
let AreaScale = null;
let grupoScale = null;
let myColor = null;
var tooltip = null;

const draw = (props) => {

	svg = d3.select('.BubblesChart').append('svg')
		.attr("width", width)
		.attr("height", height);

	d3.csv(props.data, function(d) {
		return {
			valueX: d[props.headerX],
			valueY: d[props.headerY],
			valueR: d[props.radio],
			valueG: d[props.grupo],
			valueId: d[props.idElementos],
			valueNombre: d[props.nombreElementos],
		};
	}).then(function(data) {
		console.log(data)
		createPopup(data);
		createScales(data);
		createAxis();
		createLabels(props.headerX, props.headerY, "titulo");
		createElement(data);
	});


const createScales = (data) => {
	// x Scale - Represents purchasing power. Log scale.
	xScale = d3.scaleLinear().nice()
		.domain([0, d3.max(data, function(d) {
			return parseInt(d.valueX, 10);
		})])
		.range([margin, width - 2 * margin]);

	// y Scale - Represents life expectancy. Linear.
	yScale = d3.scaleLinear().nice()
		.domain([0, d3.max(data, function(d) {
			return parseInt(d.valueY, 10)
		})])
		.range([height - 2 * margin, margin]);

	AreaScale = d3.scaleSqrt()
		.domain(d3.extent(data, function(d) {
			return parseInt(d.valueR, 10)
		}))
		.range([1, 50]);

	// Build color scale
	myColor = d3.scaleSequential()
		.interpolator(d3.interpolateCool)
		.domain([1, 34])

}

const createAxis = () => {
	const axisGroup = svg.append("g")
		.attr("class", "axisGroup");

	// X axis
	axisGroup.append("g")
		.attr("class", "axisX")
		.attr("transform", `translate(0, ${height - 2*margin})`)
		.call(d3.axisBottom(xScale));

	// Y axis .
	axisGroup.append("g")
		.attr("class", "axisGroupY")
		.attr("transform", `translate(${margin},0)`)
		.call(d3.axisLeft(yScale));
}

const createLabels = (labelX, labelY, title) => {
	const labels = svg.append("g")
		.attr("class", "labels");
	const horMiddle = margin + (width - 2 * margin) / 2;
	const vertMiddle = margin + (height - 2 * margin) / 2;

	// X Label
	labels.append("text")
		.attr("class", "labelsX")
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "after-edge")
		.attr("transform", `translate(${horMiddle},${height-50})`)
		.text(labelX);

	// Y Label
	labels.append("text")
		.attr("class", "labelsY")
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "hanging")
		.attr("transform", `translate(12,${vertMiddle})rotate(-90)`)
		.text(labelY);

	// Title
	labels.append("text")
		.attr("class", "labelsTitle")
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "hanging")
		.attr("transform", `translate(${horMiddle},15)`)
		.text(title);
}

const createElement = (data) => {
	svg.append("g")
		.attr("class", "listaElementos")
		.selectAll("circle")
		.data(data).enter()
		.append("circle")
		.attr("class", 'elements')
		.attr("cx", d => xScale(d.valueX))
		.attr("cy", d => yScale(d.valueY))
		.attr("r", d => AreaScale(d.valueR))
		.attr("fill", function(d) {
			return myColor(d.valueId)
		})
		.style("opacity", 0.8)
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseout", mouseout)
		.sort((a, b) => (b.valueX - a.valueX));
	}

	const createPopup = (d) => {
		tooltip = d3.select('.BubblesChart')
			.append("div")
			.style("position", "absolute")
			.style("visibility", "hidden")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px")
	}

	var mouseover = function(d) {
		tooltip
			.style("visibility", "visible");
		d3.select(this)
			.style("stroke", "black")
			.style("opacity", 1)
	}

	var mousemove = function(d) {
		tooltip
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY) + "px")
			.html(`
      <table>
        <tr>
          <th class="nombre" colspan="2" >${d.valueG}</th>
        </tr>
        <tr>
          <th class="nombre" colspan="2" >${d.valueNombre}</th>
        </tr>
        <tr>
          <td class="variable">${d.valueR}</td>
          <td class="valor">${props.radio}</td>
        </tr>
        <tr>
          <td class="variable">${d.valueX}</td>
          <td class="valor">${props.headerX}</td>
        </tr>
        <tr>
          <td class="variable">${d.valueY}</td>
          <td class="valor">${props.headerY}</td>
        </tr>
      </table>
      `);

		console.log(d3.event.pageX, d3.event.pageY, d3.mouse(this))
	}

	var mouseout = function(d) {
		tooltip
			.style("visibility", "hidden");
		d3.select(this)
			.style("stroke", "none")
			.style("opacity", 0.8)
	}

}
export default BubblesChart
