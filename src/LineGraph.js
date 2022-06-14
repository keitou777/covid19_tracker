import React, { useState, useEffect } from 'react'
import { Line } from "react-chartjs-2";
import numeral from 'numeral';
import { Chart as ChartJS } from 'chart.js/auto' //have to keep it import for the chart to function normally
import { Chart } from 'react-chartjs-2'


//https://disease.sh/v3/covid-19/historical/all?lastdays=120



function LineGraph({ casesType }) {
    const [data, setData] = useState({});

    const options = {
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: false,
            }
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        maintainAspectRatio: true,
        tooltips: {
            // callbacks: {
            //     label: function (tooltipItem, data) {
            //         return numeral(tooltipItem.value).format("+0,0");
            //     }
            // }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                // type: "time",
                // time: {
                //     format: "MM/DD/YY",
                //     tooltipFormat: "ll",
                // }
            },
            y: {
                grid: {
                    display: true,
                },
                ticks: {
                    //below code will turn 1000 to 1k for display
                    callback: function (value, index, ticks) {
                        return numeral(value).format('0.0 a');
                    }
                }
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then(data => {
                    console.log("===linegraph===")
                    console.log(data)
                    const chartData = buildChartData(data, casesType);
                    setData(chartData);
                })
        }
        fetchData();
    }, [casesType])

    const buildChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data[casesType]) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }
    return (
        <div>
            {/* <h1>Worldwide New Cases</h1> */}
            {data?.length >= 0 && (
                <Line
                    options={options}
                    data={{
                        datasets: [{
                            data: data,
                            backgroundColor: "rgba(204, 16,52,0.7)",
                            borderColor: "#CC1034",
                            fill: true,
                            label: ""
                        }]
                    }}
                />
            )}
        </div>
    )
}

export default LineGraph
