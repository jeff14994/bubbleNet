/**
 *  Main JS file to include all components
 */
var data;

document.addEventListener('DOMContentLoaded', function () {
    showSpinner(true);
    Promise.all([d3.csv('/data/data_with_detail.csv')]).then(function (values) {
        init();
        data = preProcess(values[0]);
        showSpinner(false);
    });
});


const init = () => {
    // Implementation for map view
    const svg = d3.select('#map');
    const width = d3.select('#map').style('width').replace('px','');
    const height = d3.select('#map').style('height').replace('px','');

    // Initialize background map (source: https://d3-graph-gallery.com/graph/backgroundmap_basic.html)
    const projection = d3.geoEquirectangular()
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
                .attr('d', d3.geoPath().projection(projection))
                .style('stroke', '#FFF');
        bgMap.lower();
    });
}

const showSpinner = (flag) => {
    const spinner = d3.select('#spinner');
    spinner.style('visibility', flag ? 'visible' : 'hidden');
}