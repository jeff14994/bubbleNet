/**
 *  Main JS file to include all components
 */

// Global variables
var data, svg, projection;
var heatmapData;
var showTable = false;
// Global variable used to implement selections across components
// Initialize to default value
var globalData = {
    country: '',
    date: new Date('2019-03-10 00:00').toDateString('en-US'),
}

// Proxy acts as an Event Handler to update components on change
const proxyHandler = {
    set(target, prop, value) {
        if (target[prop] === value) {
            return;
        }
        target[prop] = value;

        // ** update the components here **
        if (prop === "country") {
            updateBulletCountry(target);
            time_alert(data, target["country"], target["date"]);
            if (target['country'] !== '') {
                updateHeatmapBarChart(heatmapData, target['country']);
            } else {
                cleanUpHeatmapBarChart();
            }
        }
        else if (prop === "date") {
            updateBulletDate(target);
            bubble(data, svg, projection, target['date'], target['date']);
            time_alert(data, target["country"], target["date"]);
        }
    }
}
const globalProxy = new Proxy(globalData, proxyHandler)

document.addEventListener('DOMContentLoaded', function () {
    showSpinner(true);
    Promise.all([d3.csv('../data/data.csv')]).then(function (values) {
        init();
        data = preProcess(values[0]);
        heatmapData = values[0];
        showSpinner(false);
        bubble(data, svg, projection, globalData.date);
        time_alert(data,"whole world","Sun Mar 10 2019");
        heatmap(heatmapData, globalData.country, 50000);
        bullet(data);
    });
});

/**
 * Function to initialize map rendering.
 */
const init = () => {
    // Implementation for map view
    svg = d3.select('#map');
    const width = d3.select('#map').style('width').replace('px','');
    const height = d3.select('#map').style('height').replace('px','');

    // Initialize background map (source: https://d3-graph-gallery.com/graph/backgroundmap_basic.html)
    projection = d3.geoMercator()
                        .scale(width / 2 / Math.PI)
                        .rotate([0, 0])
                        .center([0, 0])
                        .translate([width / 2, height / 2]);
                        

    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then( function(data) {
        const bgMap = svg
            .selectAll('path')
            .data(data.features)
            .join('path')
                .attr('fill', '#D3D3D3')
                .attr('id', d => d.properties.name)
                .attr('d', d3.geoPath().projection(projection))
                .style('stroke', '#FFF');
        bgMap.lower();
    });
}

/**
 * Function to control spinner view.
 * @param {boolean} flag show spinner or not
 */
const showSpinner = (flag) => {
    const spinner = d3.select('#spinner');
    spinner.style('visibility', flag ? 'visible' : 'hidden');
}


/**
 * Callback function for alert button.
 */
function toggleTable() {
	showTable = !showTable;
	if (showTable) {
		initTable(data, globalData.country, globalData.date);
	} else {
	 	d3.select('#table1').selectAll("*").remove();
	}
}
