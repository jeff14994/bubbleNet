/**
 *  Main JS file to include all components
 */


document.addEventListener('DOMContentLoaded', function () {
    init();
});


const init = () => {
    // Implementation for map view
    const svg = d3.select('#map');
    const width = 1000;
    const height = 550;

    // Initialize background map (source: https://d3-graph-gallery.com/graph/backgroundmap_basic.html)
    const projection = d3.geoEquirectangular()
                        .scale(width / 2 / Math.PI)
                        .rotate([0, 0])
                        .center([0, 0]);
                        

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