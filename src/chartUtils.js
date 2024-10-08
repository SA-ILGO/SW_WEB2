// src/chartUtils.js

export function createTimeSeriesChart(elementId, title, data) {
    return {
        chart: {
            type: 'line',
            height: 350
        },
        series: [{
            name: 'Waiting Time',
            data: data.map(point => [point.x, point.y])
        }],
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            title: {
                text: 'Minutes'
            }
        },
        title: {
            text: title,
            align: 'center'
        }
    };
}

export function createPieChart(elementId, title, data) {
    return {
        chart: {
            type: 'pie',
            height: 350
        },
        series: data.map(item => item.value),
        labels: data.map(item => item.label),
        title: {
            text: title,
            align: 'center'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
}

export function createBarChart(elementId, title, data) {
    return {
        chart: {
            type: 'bar',
            height: 350
        },
        series: [{
            name: 'Count',
            data: data.map(item => item.count)
        }],
        xaxis: {
            categories: data.map(item => item.hour.toString()),
            title: {
                text: 'Hour of Day'
            }
        },
        yaxis: {
            title: {
                text: 'Number of Registrations'
            }
        },
        title: {
            text: title,
            align: 'center'
        },
        colors: data.map(item => item.isPeak ? '#FF4560' : '#008FFB'),
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            }
        }
    };
}

export function createDistributionChart(elementId, title, data) {
    return {
        chart: {
            type: 'boxPlot',
            height: 350
        },
        series: [{
            name: 'Waiting Time',
            data: data.map(item => ({
                x: `${item.min.toFixed(1)}-${item.max.toFixed(1)}`,
                y: [item.min, item.min, item.max, item.max]
            }))
        }],
        title: {
            text: title,
            align: 'center'
        },
        xaxis: {
            title: {
                text: 'Waiting Time Range (minutes)'
            }
        },
        yaxis: {
            title: {
                text: 'Waiting Time (minutes)'
            }
        }
    };
}