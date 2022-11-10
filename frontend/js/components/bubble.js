/**
 *  CSE 578 Project
 *  Author: Yu-Hsien Tu
 *  Email: yuhsien1@asu.edu
 *  ASUID: 1222290303
 */

/**
 *  Bubble component.  
 *  Data format:  
 *  {  
 *      numberOfAlerts: number,   
 *      date: Date,   
 *      sourceCountry: string,   
 *      sourceRegion: string,   
 *      sourceLatitude: number,   
 *      sourceLongitude: number,  
 *      target: [  
 *          targetCountry: string,  
 *          targetRegion: string,  
 *          targetLatitude: number,  
 *          targetLongitude: number,  
 *      ]  
 *  }  
 */
const bubble = (data, svg, projection) => {
    // tooltip
    const div = d3.select('body')
        .append('div')
        .classed('tooltip bottom', true)
        .style('opacity', 0);
    
    const color = d3.scaleOrdinal()
                        .domain(['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'])
                        .range(['#48B0D4', '#92DCEB', '#FA011E', '#FEA85C', '#FFDF8C', '#FFFFBC']);

    const size = d3.scaleOrdinal()
                        .domain(['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'])
                        .range([10, 20, 30, 40, 50, 60]);

    const getCountryNames = new Intl.DisplayNames(['en'], {type: 'region'});

    const level = (value) => {
        if (value <= 1) {
            return 'level-1';
        } else if (value <= 9) {
            return 'level-2';
        } else if (value <= 80) {
            return 'level-3';
        } else if (value <= 700) {
            return 'level-4';
        } else if (value <= 6000) {
            return 'level-5';
        } else {
            return 'level-6';
        }
    }

    svg.selectAll('node')
        .data(data).enter()
        .append('ellipse')
        .classed('bubble', true)
        .attr('cx', d => projection([d.sourceLongitude, d.sourceLatitude])[0])
        .attr('cy', d => projection([d.sourceLongitude, d.sourceLatitude])[1])
        .attr('rx', d => size(level(d.numberOfAlerts)))
        .attr('ry', d => size(level(d.numberOfAlerts)) / 1.5)
        .attr('stroke-width', '1px')
        .attr('stroke', '#000000')
        .attr('fill', d => color(level(d.numberOfAlerts))) // depends on numberOfAlerts
        .on('mouseover', (d,i) => {
            div.transition()
                .duration(200)
                .style('opacity', 1);
            div.html(`${new Date(i.date).toDateString('en-US')} <br/>
                      00:00 - 23:59 <br/>
                      ${getCountryNames.of(i.sourceCountry)}: <span style="color:red;">${i.numberOfAlerts} alerts</span>`)
                .attr('width', 120)
                .attr('height', 80)
                .style('display', 'block')
                .style('margin', '8px')
                .style('align-items', 'center')
                .style('position', 'absolute')
                .style('font', '14px arial')
                .style('color', '#FFFFFF')
                .style('background','#000000')
                .style('opacity', '0.8')
                .style('border-radius', '8px')
                .style('pointer-events', 'none')
                .style('left', (d.pageX) + 'px')
                .style('top', (d.pageY) + 'px');
        })
        .on('mouseout', (d,i) => {
            div.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', (d,i) => {
            if (d3.select(d.currentTarget).classed('selected')) {
                d3.select(d.currentTarget).classed('selected', false);
                d3.selectAll('.line').remove();
            } else {
                d3.select(d.currentTarget).classed('selected', true);
                svg.selectAll('.line')
                    .data(i.target).enter()
                    .append('path')
                    .classed('line', true)
                    .attr('d', d => d3.line()([[projection([i.sourceLongitude, i.sourceLatitude])[0], projection([i.sourceLongitude, i.sourceLatitude])[1]], [projection(d)[0], projection(d)[1]]]))
                    .attr('stroke', '#000000')
                    .attr('stroke-width', '1px')
                    .attr('fill', 'none');
                d3.select(d.currentTarget).raise();
            }
        });
    
    // Text in the bubble. We need to discuss if we want to keep country name in the middle of the bubble.
    svg.selectAll('text')
        .data(data).enter()
        .append('text')
        .attr('x', d => projection([d.sourceLongitude, d.sourceLatitude])[0])
        .attr('y', d => projection([d.sourceLongitude, d.sourceLatitude])[1] + 5)
        .text(d => d.sourceCountry)
        .attr('text-anchor','middle')
        .style('font-family', 'arial')
        .style('font-size', '12px');

    // This part is for arrow-like link. Keep this for future usage.
    // svg.append('defs')
    //     .append('marker')
    //     .attr('id', 'arrow')
    //     .attr('viewBox', [0, 0, 10, 10])
    //     .attr('refX', 5)
    //     .attr('refY', 5)
    //     .attr('markerWidth', 10)
    //     .attr('markerHeight', 10)
    //     .attr('orient', 'auto-start-reverse')
    //     .append('path')
    //     .attr('d', d3.line()([[0, 0], [0, 10], [10, 5]]))
    //     .attr('stroke', 'black');
}