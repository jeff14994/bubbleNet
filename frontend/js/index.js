/**
 *  Main JS file to include all components
 */
var data, svg, projection;

document.addEventListener('DOMContentLoaded', function () {
    showSpinner(true);
    Promise.all([d3.csv('/data/data.csv')]).then(function (values) {
        // init();
        // data = preProcess(values[0]);
        // bubble(data, svg, projection, '2019-03-10 mst', '2019-03-10 mst'); // render bubbles in map
        // showSpinner(false);
        // set initial country AZ
        const country = 'CZ';
        heatmap(values[0], country);
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
    projection = d3.geoEquirectangular()
                        .scale(width / 2 / Math.PI)
                        .rotate([0, 0])
                        .center([0, 0])
                        .translate([width / 2, height / 1.75]);
                        

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