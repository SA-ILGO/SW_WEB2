// src/chartUtils.js

export function createTimeSeriesChart(elementId, title, data) {
    return {
        chart: {
            type: 'line',
            height: 350
        },
        series: [{
            name: 'Waiting Time',
            data: data.map(point => ({
                x: new Date(point.x).getTime(),
                y: point.y
            }))
        }],
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'HH:mm',
                datetimeUTC: false
            },
            tickAmount: 6,
            min: new Date(data[0].x).getTime(),
            max: new Date(data[data.length - 1].x).getTime()
        },
        yaxis: {
            title: {
                text: 'Minutes'
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(2); // 소수점 셋째 자리까지 출력
                }
            }   
        },
        title: {
            text: title,
            align: 'center'
        },
        tooltip: {
            x: {
                format: 'HH:mm'
            }
        }
    };
}   

export function createTimeSeriesAnalysisChart(elementId, title, data) {
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
            type: 'datetime',
            title: {
                text: 'Time'
            }
        },
        yaxis: {
            title: {
                text: 'Waiting Time (minutes)'
            }
        },
        title: {
            text: title,
            align: 'center'
        },
        tooltip: {
            x: {
                format: 'HH:mm'
            }
        },
        annotations: {
            yaxis: [{
                y: data.reduce((sum, point) => sum + point.y, 0) / data.length,
                borderColor: '#00E396',
                label: {
                    borderColor: '#00E396',
                    style: {
                        color: '#fff',
                        background: '#00E396'
                    },
                    text: 'Average'
                }
            }]
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
            categories: data.map(item => item.hour),
            title: {
                text: 'Time Interval'
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
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(2); // 소수점 셋째 자리까지 출력
                }
            } 
        },
        yaxis: {
            title: {
                text: 'Waiting Time (minutes)'
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(3); // 소수점 셋째 자리까지 출력
                }
            }
            
        }
    };
}