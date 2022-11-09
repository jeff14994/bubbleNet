/**
 *  CSE 578 Project
 *  Author: Yu-Hsien Tu
 *  Email: yuhsien1@asu.edu
 *  ASUID: 1222290303
 */

/**
 *  Bubble component.
 */
const bubble = (data, svg, projection) => {
    // tooltip
    const div = d3.select('body')
        .append('div')
        .classed('tooltip bottom', true)
        .style('opacity', 0);
    
    const color = d3.scaleOrdinal()
                        .domain(['level-1', 'level-2', 'level-3', 'level-4', 'level-5'])
                        .range(['#339900', '#99CC33', '#FFCC00', '#FF9966', '#CC3300']);

    const level = (value) => {
        switch (Math.trunc(value/100)) {
            case 1:
                return 'level-2';
            case 2:
                return 'level-3';
            case 3:
                return 'level-4';
            case 4:
                return 'level-5';
            default:
                return 'level-1';
        }
    }

    svg.selectAll('node')
        .data(data).enter()
        .append('ellipse')
        .classed('bubble', true)
        .attr('cx', d => projection([d.targetLongitude, d.targetLatitude])[0])
        .attr('cy', d => projection([d.targetLongitude, d.targetLatitude])[1])
        .attr('rx', d => d.numberOfAlerts/Math.PI/10)
        .attr('ry', d => d.numberOfAlerts/Math.PI/10)
        .attr('stroke-width', '1px')
        .attr('stroke', '#000000')
        .attr('fill', d => color(level(d.numberOfAlerts))) // depends on numberOfAlerts
        .on('mouseover', (d,i) => {
            div.transition()
                .duration(200)
                .style('opacity', 1);
            div.html(`Date: ${new Date(i.date).toLocaleString('en-US')} <br/>
                      Period: 00:00 - 23:59 <br/>
                      ${i.country}: <span style="color:red;">${i.numberOfAlerts} alerts</span>`)
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
                    .data(i.source).enter()
                    .append('path')
                    .classed('line', true)
                    .attr('d', d => d3.line()([[projection([i.targetLongitude, i.targetLatitude])[0], projection([i.targetLongitude, i.targetLatitude])[1]], [projection(d)[0], projection(d)[1]]]))
                    .attr('stroke', '#000000')
                    .attr('stroke-width', '1px')
                    .attr('fill', 'none');
                d3.select(d.currentTarget).raise();
            }
        });
    
    // Text in the bubble. We need to discuss if we want to keep country name in the middle of the bubble.
    // svg.selectAll('text')
    //     .data(data).enter()
    //     .append('text')
    //     .attr('x', d => projection([d.targetLongitude, d.targetLatitude])[0])
    //     .attr('y', d => projection([d.targetLongitude, d.targetLatitude])[1] + 5)
    //     .text(d => d.country)
    //     .attr('text-anchor','middle')
    //     .style('font-family', 'arial')
    //     .style('font-size', '12px');

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