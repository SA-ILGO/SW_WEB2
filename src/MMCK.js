import * as dataAnalysis from './dataAnalysis.js';
import * as chartUtils from './chartUtils.js';
import { createTimeSeriesChart, createPieChart, createBarChart, createDistributionChart } from './chartUtils.js';
import { analyzeWaitingTimes, analyzeRegistrationTimes, predictPeakHours, optimizeServiceTime } from './dataAnalysis.js';

async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return { quantity: [], lines: [] };
    }
}

async function initMMCK() {
    const data = await fetchData();
    const { quantity, lines } = data;

    console.log("Quantity data:", quantity);
    console.log("Lines data:", lines);

    if (!quantity || quantity.length === 0 || !lines || lines.length === 0) {
        console.error("Invalid or empty data received");
        updateElementContent('mmckResults', '<p>Error: No valid data available for analysis</p>');
        return;
    }

    const k = quantity[0].remainingQuantity;
    const c = quantity[0].serverNum;
    const mu = quantity[0].muValue;
    const lambda = quantity[0].lambdaValue;

    if (![k, c, mu, lambda].every(val => typeof val === 'number' && !isNaN(val))) {
        console.error("Invalid MMCK model parameters");
        updateElementContent('mmckResults', '<p>Error: Invalid MMCK model parameters</p>');
        return;
    }

    // Perform MMCK model calculations
    const rho = lambda / (c * mu);
    const avgWaitingTime = calculateAverageWaitingTime(k, c, mu, lambda);
    const avgQueueLength = calculateAverageQueueLength(k, c, mu, lambda);

    // Update the results on the page
    updateElementContent('mmckResults', `
        <h2>MMCK Model Results</h2>
        <p>System Utilization (ρ): ${rho.toFixed(2)}</p>
        <p>Average Waiting Time: ${avgWaitingTime.toFixed(2)} minutes</p>
        <p>Average Queue Length: ${avgQueueLength.toFixed(2)} customers</p>
    `);

    // Analyze waiting times
    const waitingTimesAnalysis = analyzeWaitingTimes(lines);
    if (waitingTimesAnalysis.waitingTimeDistribution.length > 0) {
        const waitingTimesChartOptions = createTimeSeriesChart('waitingTimesChart', 'Waiting Times Distribution',
            waitingTimesAnalysis.waitingTimeDistribution.map(d => ({ x: new Date(d.min), y: d.count })));
        renderChart('waitingTimesChart', waitingTimesChartOptions);
    } else {
        updateElementContent('waitingTimesChart', 'No valid waiting time data available');
    }

    // Analyze registration times
    const registrationTimesAnalysis = analyzeRegistrationTimes(lines);
    const registrationTimesChartOptions = createPieChart('registrationTimesChart', 'Registration Time Distribution',
        registrationTimesAnalysis.map(d => ({ label: `${d.hour}:00`, value: d.count })));
    renderChart('registrationTimesChart', registrationTimesChartOptions);

    // Predict peak hours
    const peakHoursAnalysis = predictPeakHours(lines);
    const peakHoursChartOptions = createBarChart('peakHoursChart', 'Predicted Peak Hours', peakHoursAnalysis);
    renderChart('peakHoursChart', peakHoursChartOptions);

    // Optimize service time
    const serviceOptimization = optimizeServiceTime(lines, c);

    // Display service optimization results
    updateElementContent('serviceOptimization', `
        <h2>Service Optimization Results</h2>
        <p>Current Average Wait Time: ${serviceOptimization.currentAverageWaitTime.toFixed(2)} minutes</p>
        <p>Current Max Wait Time: ${serviceOptimization.currentMaxWaitTime.toFixed(2)} minutes</p>
        <p>Current Servers: ${serviceOptimization.currentServers}</p>
        <p>Recommended Servers: ${serviceOptimization.recommendedServers}</p>
        <p>Estimated New Average Wait Time: ${serviceOptimization.estimatedNewAverageWaitTime.toFixed(2)} minutes</p>
    `);
}


function updateElementContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
    } else {
        console.warn(`Element with id '${elementId}' not found`);
    }
}

function renderChart(elementId, chartOptions) {
    const element = document.getElementById(elementId);
    if (element) {
        new ApexCharts(element, chartOptions).render();
    } else {
        console.warn(`Element with id '${elementId}' not found. Cannot render chart.`);
    }
}

function calculateAverageWaitingTime(k, c, mu, lambda) {
    // Implement MMCK average waiting time calculation
    // This is a simplified formula and may need to be adjusted based on the specific MMCK model
    const rho = lambda / (c * mu);
    const p0 = 1 / (1 + (lambda / mu) + (1 / c) * Math.pow(lambda / mu, c) * (1 - Math.pow(rho, k - c + 1)) / (1 - rho));
    const lq = p0 * Math.pow(lambda / mu, c) * rho / (factorial(c) * Math.pow(1 - rho, 2)) * (1 - Math.pow(rho, k - c + 1) - (1 - rho) * (k - c + 1) * Math.pow(rho, k - c));
    return lq / lambda;
}

function calculateAverageQueueLength(k, c, mu, lambda) {
    // Implement MMCK average queue length calculation
    const wq = calculateAverageWaitingTime(k, c, mu, lambda);
    return lambda * wq;
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

document.addEventListener('DOMContentLoaded', initMMCK);