
class Scatterplot {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 35},
        }
        this.data = _data;
        this.initVis();
    }
    initVis() {
        let vis = this;

        // charts margins
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Scales
        vis.xScale = d3.scaleLinear()
            .range([0, vis.width])
        vis.yScale = d3.scaleLinear()
            .range([0, vis.height])

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
        vis.yAxis = d3.axisLeft(vis.yScale)

        // Define size of SVG drawing area
        console.log(vis.config.parentElement)
        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr('width', this.config.containerWidth)
            .attr('height', this.config.containerHeight)
        vis.visG = vis.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`)

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top + vis.height})`)

        // Append y-axis group
        vis.yAxisG = vis.svg.append('g')
            .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`)

    }
    updateVis() {
        let vis = this;

        // Set the scales
        vis.xScale.domain([0,d3.max(vis.data, d=> d.population)])
        vis.yScale.domain([0, d3.max(vis.data, d=> d.unemployment)])
        this.renderVis()
    }
    // Add visual elements
    renderVis() {
        let vis = this;

        // Add visual circles
        const circles = vis.visG.selectAll('circle').data(vis.data)
            .join('circle')
        circles
            .attr('cx',d => vis.xScale(d.population))
            .attr('cy', d => vis.yScale(d.unemployment))
            .attr('r', d => {
                if(d.populationdensity > 100)
                    return 8
                else return 4
            })

        // Update the axes
        vis.xAxisG.call(this.xAxis)
        vis.yAxisG.call(this.yAxis)

    }
}