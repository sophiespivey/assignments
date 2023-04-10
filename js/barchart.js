
class Barchart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 80},
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

        vis.yScale = d3.scaleBand()
            .range([0, vis.height])
            .paddingInner(0.2)
            .paddingOuter(0.2)


        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
        vis.yAxis = d3.axisLeft(vis.yScale)


        // Define size of SVG drawing area
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

        // Prepare data count for number of country in regions
        const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d.region)
        vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({key, count}))
        const orderedKeys = ['Southern Africa', 'Central Asia', 'Western Africa', 'Northern Africa', 'Middle Africa']
        vis.aggregatedData = vis.aggregatedData.sort((a, b) => {
            return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key)
        })

        vis.xValue = d => d.count
        vis.yValue = d => d.key

        // Set the scales

        vis.xScale.domain([0, d3.max(vis.aggregatedData.map(vis.xValue))])
        vis.yScale.domain(vis.aggregatedData.map(vis.yValue))

        this.renderVis()
    }

    // Add visual elements
    renderVis() {
        let vis = this;

        // Add bar graph
        const bars = vis.visG.selectAll('.bar').data(vis.aggregatedData, vis.yValue)
            .join('rect')
        bars
            .attr('class', 'bar')
            .attr('x', vis.xScale(0))
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr('height', vis.yScale.bandwidth())
            .attr('width', d => vis.width - vis.xScale(vis.xValue(d)))


        // Update the axes
        vis.xAxisG.call(this.xAxis)
        vis.yAxisG.call(this.yAxis)

    }

}