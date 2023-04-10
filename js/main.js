
d3.csv('data/africa_country_profile_variables-2.csv')
    .then(data => {
        console.log(data)
        data.forEach(d => {
            d.population = parseInt(d.population)
            d.unemployment = parseFloat(d.unemployment)
            d.populationdensity = parseFloat(d.populationdensity)
        })


//const scatterplot = new Scatterplot({parentElement:"#scatterplot-container", containerHeight:500},data)
        //      scatterplot.updateVis()


        const barchart = new Barchart({parentElement:"#barchart-container", containerHeight:500},data)
        barchart.updateVis()
    })
