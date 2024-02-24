import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const colors = {
    Used: '#DC2626',
    Requested: '#2563EB',
    Limits: '#059669',
    Read: '#2563EB',
    Write: '#DC2626'
}
const MakeChart = (graph) => { 
    const chartData = { 
        labels: graph.graphLines[0].values.map((e) => e.timestamp),
        datasets: graph.graphLines.map((line) => ({
            label: line.name,
            data: line.values.map((value) => value.value),
            backgroundColor: (graph.name === 'Disk IOPS') ? (context) => {
                const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 250);
                if(line.name === 'Read'){
                    gradient.addColorStop(0, 'rgba(191, 219, 254, 1)'); 
                    gradient.addColorStop(0.5, 'rgba(191, 219, 254, 0)');   
                }
                else{
                    gradient.addColorStop(0, 'rgba(254, 202, 202, 1)'); 
                    gradient.addColorStop(1, 'rgba(254, 202, 202, 0)');  
                }
                return gradient;
              }: colors[line.name],
            borderColor: colors[line.name],
            borderWidth: 1.5,
            tension: 0.1,
            pointRadius: 0,
            fill: (graph.name === 'Disk IOPS') ? true : false,
        })),
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                grid: {
                    color: '#CEE0F8'
                },
                ticks: {
                    color: '#6F8EBD'
                },
                time: {
                    unit: 'minute',
                    displayFormats: {
                        minute: 'HH:mm',
                    }
                },
                position: 'bottom',
                labels: chartData.labels,
            },
            y: {
                min: 0,
                max: (Math.max(...chartData.datasets[0].data) + 0.1 * Math.max(...chartData.datasets[0].data)),
                position: 'right',
                grid: {
                    color: '#CEE0F8'
                },
                ticks: {
                    color: '#6F8EBD'
                },
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'start',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    boxWidth: 8,
                    boxHeight: 8,
                    color: '#010202',
                    font: {
                        style: 'Arial',
                        weight: '500',
                        size: '14px',
                    },
                },
            },
        },
    };

    return (
        <Line data={chartData} options={chartOptions} style={{ width: '100%', height: '100%' }} />
    );
}

export default MakeChart;
