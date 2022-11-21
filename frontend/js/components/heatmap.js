/**
 *  CSE 578 Project
 *  Author: Yu-Chuan, Hung
 *  Email: yhung17@asu.edu
 *  ASUID: 1219439611
 */
const heatmap = (data, country, num)  => {
    // console.log("Loading heatmap");
    country = country || "";
    range = colorRange(country)
    // console.log(data)
    let preProcessData = heatmapDataPreProcess(data, country, num)
    // console.log("Loading sub bar chart")
    barChart(data, country, num)
    const xData = preProcessData[0]
    const yData = preProcessData[1]
    data = preProcessData[2]
    // console.log(data.length)
    // console.log(data)

    // setup dimensions and margins
    const margin = {top: 30, right: 25, bottom: 30, left: 36}
    const width = 250
    const height = 800 - margin.top - margin.bottom;
    // build x scales and axis:
    const x = d3.scaleBand()
                    .range([ 0, width ])
                    .domain(xData)
                    .padding(0.04);
    // build y scales and axis:
    const y = d3.scaleBand()
                    .range([ height, 0 ])
                    .domain(yData)
                    .padding(0.04);
     // Build color scale
    var color = d3.scaleSequential()
                    .interpolator(d3.interpolateReds)
                    .domain([1,range])
    // create a tooltip
    var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip_heatmap")
                    .style("opacity", 0)
    // remove the chart before drawing a new one
    d3.select("#heatmap svg").remove();
    // append the svg object to the body of the page
    const svg = d3.select("#heatmap")
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    svg.append("g")
            .style("font-size", 12)
            .attr("transform", `translate(0, -15)`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()
    svg.append("g")
            .style("font-size", 12)
            .call(d3.axisLeft(y).tickSize(0).tickFormat(d => d + ":00"))
            .select(".domain").remove()
    // mouseover event handler function
    var mouseover = function(d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function(e, i) {
        tooltip
            .html("Number of alert: " + i.value)
            .style("opacity", "1")
            .style("position", "absolute")
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY) + "px")
            // reuse the tooltip style from bubble.js and modify the border radius
            .attr('width', 120)
            .attr('height', 80)
            .style('margin', '6px')
            .style('align-items', 'center')
            .style('font', '14px arial')
            .style('color', '#FFFFFF')
            .style('background','#000000')
            .style('opacity', '0.8')
            .style('border-radius', '6px')
    }
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.7)
    }
    // show the squares when hovering
    svg.selectAll()
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d) { return x(d.date) })
                .attr("y", function(d) { return y(d.time) })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", function(d) { return color(d.value)} )
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
}
const barChart = (data, country) => {
    let preProcessData = barDataPreProcess(data, country)
    xData = preProcessData[0] 
    yData = preProcessData[1] 
    barData = preProcessData[2]
    // var length = 1
    var length = Math.floor(Math.random() * 3) + 2
    d3.select('#heatmap_barchart svg').remove();
    // set width and height
    const width = 300
    const height = width * 0.5
    const margin = 40;
    const svg = d3.select('#heatmap_barchart')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);
    // set x scale
    const xScale = d3.scaleBand()
                        .domain(xData)
                        // set the show range of x bar
                        .range([margin*2, width - margin/2 + 45])
                        .padding(0.2)
    // set y scale
    const yScale = d3.scaleLinear()
                        .domain([0, d3.max(yData)])
                        .range([height - margin, margin]) 
                        .nice() 
    // set y axis
    const yAxis = d3.axisLeft(yScale)
                        .ticks(5)
                        .tickSize(3)
    const yAxisGroup = svg.append("g")
                            .call(yAxis)
                            .style("font-size", 8)
                            .attr("transform", `translate(${margin + 3}, 0)`)
    // draw bar chart
    const bar = svg.selectAll("rect")
                    .data(barData)
                    .join("rect")
                    .attr("class", "allAlerts")
                    // -40 is to make the bar chart align with the heatmap
                    .attr("x", d => xScale(d.key) - 40) 
                    .attr("y", d => yScale(d.value))
                    .attr("width", xScale.bandwidth())
                    .attr("height", d => {
                        return height - margin - yScale(d.value)
                    })
                    .attr("fill", "#D3D3D3")
                    .attr('cursor', 'pointer')
    var country = true
    if (country) {
        // d3.select('.singleCountry').remove();
        // draw bar chart
        const barCountry = svg.selectAll("rectSingleCountry")
                                .data(barData)
                                .join("rect")
                                .attr("class", "singleCountry")
                                // -40 is to make the bar chart align with the heatmap
                                // +7 is to make the bar chart align with the class allAlerts bar chart
                                .attr("x", d => xScale(d.key) - 40 + 7) 
                                .attr("y", d => yScale(d.value/length))
                                .attr("width", xScale.bandwidth() - 15)
                                .attr("height", d => {
                                    return height - margin - yScale((d.value)/length)
                                })
                                .attr("fill", "#808080")
                                // .attr("fill", "#000000")
                                .attr('cursor', 'pointer')
                                .on("click", mouseClick)
    }
    // Callback function for mouse click
    function mouseClick() {
        console.log("clicked")
    }
                
}
const heatmapDataPreProcess = (data, country, num) => {
    // console.log(country)
    // get data and time
    data.map(d => {d.date = d.EventTime.substr(8,2), d.time = d.EventTime.substr(11,2)});
    var countryData = dataProcessHelper(data, country, num)
    countryData = heatmapGroupDataByDateHour(countryData)
    // console.log(countryData)
    // set x and y values
    const xData = Array.from(new Set(countryData.map(d => d.date)))
    const yData = Array.from(new Set(countryData.map(d => d.time)))
    xData.sort()
    yData.sort().reverse()
    return [xData, yData, countryData]
}

const barDataPreProcess = (data, country, num) => {
    const countryData = dataProcessHelper(data, country, num)
    const groupByTime = groupDataByDate(countryData)
    const xData = Array.from(new Set(groupByTime.map(d => d.key)))
    const yData = Array.from(new Set(groupByTime.map(d => d.value)))
    xData.sort()
    groupByTime.sort()
    // console.log(yData)
    // console.log(groupByTime)
    return [xData, yData, groupByTime]
}
// filter data based on country
const dataProcessHelper = (data, country, num) => {
    // filter data based on country
    if (country != "") {
        countryData = data.filter(d => d.SourceCountry == country);
        return countryData
    }
    countryData = data.slice(0, num)
    
    return countryData
}
// calculate the sum alert in each day
const groupDataByDate = (data) => {
    // group data by day
    var groupByTime = d3.group(data, d => d.date)
    groupByTime = Array.from(groupByTime, ([key, value]) => ({key, value}));
    // sum the alert in each day
    groupByTime.map(d => d.value = d3.sum(d.value, d => d.ConnCount))
    return groupByTime
}

// calculate the sum alert in each hour
const heatmapGroupDataByDateHour = (data) => {
    // https://stackoverflow.com/questions/64159357/sum-array-objects-by-multiple-keys
    // console.log(typeof data)
    keys = ['date', 'time'],
    result = Object.values(data.reduce((r, o) => {
                const key = keys.map(k => o[k]).join('|');
                // console.log(key)
                if (!r[key]) 
                    r[key] = { ...o, value: 0 };
                r[key].value += parseInt(o.ConnCount);
                return r;
            }, {}));
    // console.log(result)
    return result
}
const colorRange = (country) => {
    var range;
    if (country) {
        range = 500
        return range
    }
    range = 15000
    return range
}