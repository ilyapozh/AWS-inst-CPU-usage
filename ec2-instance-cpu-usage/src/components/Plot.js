import Chart from 'chart.js/auto';
import React from 'react';
import '../App.css';

function Plot(props) {

    React.useEffect(() => {
        const ctx = document.getElementById('myChart');

        const hours = props.timeStamps.map(hour => {
            const tempDate = new Date(hour);
            return `${tempDate.getHours()}:${tempDate.getMinutes()}` 
        });

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'cpu usage metric',
                    data: props.cpuValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                
            }
            });
            return () => {
                myChart.destroy()
            }
    },[props.cpuValues])

    return (
        <canvas id="myChart" className="canvas"></canvas>
    );
};
export default Plot;