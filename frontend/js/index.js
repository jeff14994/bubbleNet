/**
 *  Main JS file to include all components
 */
var data, svg, projection;

// Global variable used to implement selections across components
// Always initialized to null values
var globalData = {
    country: null,
    date: null,
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
      }
      else if (prop === "date") {
        updateBulletDate(target);
      }
    }
}
const globalProxy = new Proxy(globalData, proxyHandler)

document.addEventListener('DOMContentLoaded', function () {
    showSpinner(true);
    Promise.all([d3.csv('../data/data.csv')]).then(function (values) {
        init();
        data = preProcess(values[0]);
        showSpinner(false);
        bubble(data, svg, projection, '2019-03-10 00:00', '2019-03-10 00:00'); // render bubbles in map
        time_alert(data,"","");//data seg, current selected country, date
        // set initial country to null
        // default: set the amount of data to be displayed by countryNum
        const country = '';
        //! Caution: If you want to increase the countryNum, remember
        //! to change the color scale in the function heatmap
        const countryNum = 50000;
        heatmap(values[0], country, countryNum);
        bullet(data);
        initTable(data, country);
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
