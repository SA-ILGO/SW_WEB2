// src/dataAnalysis.js



function parseMySQLTimestamp(timestamp) {
    if (!timestamp || typeof timestamp !== 'string') return null;
    return new Date(timestamp);
}

export function analyzeWaitingTimes(lines) {
    console.log("Analyzing waiting times for:", lines);

    if (!Array.isArray(lines) || lines.length === 0) {
        console.warn('No valid lines data provided for analysis');
        return {
            averageWaitTime: 0,
            medianWaitTime: 0,
            minWaitTime: 0,
            maxWaitTime: 0,
            waitingTimeDistribution: [],
            chartData: []
        };
    }

    const waitingTimes = lines.map(line => {
        if (!line || typeof line !== 'object') return null;
        const startTime = parseMySQLTimestamp(line.Time);
        const endTime = parseMySQLTimestamp(line.WaitingFinishedTime);
        if (!startTime || !endTime) {
            console.log("Invalid time for line:", line);
            return null;
        }
        return {
            startTime,
            endTime,
            waitTime: (endTime - startTime) / 60000 // Convert to minutes
        };
    }).filter(time => time !== null && !isNaN(time.waitTime) && time.waitTime >= 0);

    console.log("Calculated waiting times:", waitingTimes);

    if (waitingTimes.length === 0) {
        console.warn('No valid waiting times calculated from the provided data');
        return {
            averageWaitTime: 0,
            medianWaitTime: 0,
            minWaitTime: 0,
            maxWaitTime: 0,
            waitingTimeDistribution: [],
            chartData: []
        };
    }

    const sortedWaitingTimes = waitingTimes.sort((a, b) => a.waitTime - b.waitTime);
    const waitTimeValues = sortedWaitingTimes.map(t => t.waitTime);
    const averageWaitTime = waitTimeValues.reduce((sum, time) => sum + time, 0) / waitTimeValues.length;

    return {
        averageWaitTime,
        medianWaitTime: waitTimeValues[Math.floor(waitTimeValues.length / 2)],
        minWaitTime: waitTimeValues[0],
        maxWaitTime: waitTimeValues[waitTimeValues.length - 1],
        waitingTimeDistribution: calculateDistribution(waitTimeValues),
        chartData: sortedWaitingTimes.map(t => ({
            x: t.startTime.toISOString(),
            y: t.waitTime
        }))
    };
}

// export function analyzeRegistrationTimes(lines) {
//     console.log("Analyzing registration times for:", lines);
//
//     if (!Array.isArray(lines) || lines.length === 0) {
//         console.warn('No valid lines data provided for registration time analysis');
//         return Array(24).fill(0).map((_, hour) => ({ hour, count: 0 }));
//     }
//
//     const hourCounts = new Array(24).fill(0);
//
//     lines.forEach(line => {
//         if (line && typeof line === 'object') {
//             const time = parseMySQLTimestamp(line.Time);
//             if (time) {
//                 const hour = time.getHours();
//                 hourCounts[hour]++;
//             }
//         }
//     });
//
//     return hourCounts.map((count, hour) => ({ hour, count }));
// }

export function analyzeRegistrationTimes(lines) {
    console.log("Analyzing registration times for:", lines);

    if (!Array.isArray(lines) || lines.length === 0) {
        console.warn('No valid lines data provided for registration time analysis');
        return Array(144).fill(0).map((_, index) => ({ interval: index, count: 0 }));
    }

    const intervalCounts = new Array(144).fill(0); // 24 hours * 6 intervals per hour

    lines.forEach(line => {
        if (line && typeof line === 'object') {
            const time = parseMySQLTimestamp(line.Time);
            if (time) {
                const minutes = time.getHours() * 60 + time.getMinutes();
                const interval = Math.floor(minutes / 10);
                intervalCounts[interval]++;
            }
        }
    });

    return intervalCounts.map((count, interval) => ({ interval, count }));
}

export function predictPeakIntervals(lines) {
    const intervalCounts = analyzeRegistrationTimes(lines);
    const average = intervalCounts.reduce((sum, { count }) => sum + count, 0) / 144;
    const threshold = average * 1.5; // Consider peak if 50% above average

    return intervalCounts.map(({ interval, count }) => ({
        interval,
        count,
        isPeak: count > threshold
    }));
}

export function optimizeServiceTime(lines, servers) {
    console.log("Optimizing service time for:", lines);

    if (!Array.isArray(lines) || lines.length === 0 || typeof servers !== 'number' || servers <= 0) {
        console.warn('Invalid input for service time optimization');
        return {
            currentAverageWaitTime: 0,
            currentMaxWaitTime: 0,
            currentServers: servers || 0,
            recommendedServers: servers || 0,
            estimatedNewAverageWaitTime: 0
        };
    }

    const waitTimes = lines.map(line => {
        if (!line || typeof line !== 'object') return null;
        const waitStart = parseMySQLTimestamp(line.Time);
        const waitEnd = parseMySQLTimestamp(line.WaitingFinishedTime);
        if (!waitStart || !waitEnd) {
            console.log("Invalid time for line:", line);
            return null;
        }
        return (waitEnd - waitStart) / 60000; // Convert to minutes
    }).filter(time => time !== null && !isNaN(time) && time >= 0);

    console.log("Calculated wait times:", waitTimes);

    if (waitTimes.length === 0) {
        console.warn('No valid wait times calculated for service optimization');
        return {
            currentAverageWaitTime: 0,
            currentMaxWaitTime: 0,
            currentServers: servers,
            recommendedServers: servers,
            estimatedNewAverageWaitTime: 0
        };
    }

    const averageWaitTime = waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length;
    const maxWaitTime = Math.max(...waitTimes);

    // Simple estimation of recommended servers
    const recommendedServers = Math.max(1, Math.ceil(lines.length / (24 * 60 / averageWaitTime)));

    return {
        currentAverageWaitTime: averageWaitTime,
        currentMaxWaitTime: maxWaitTime,
        currentServers: servers,
        recommendedServers: recommendedServers,
        estimatedNewAverageWaitTime: averageWaitTime * (servers / recommendedServers)
    };
}

function calculateDistribution(sortedData) {
    const total = sortedData.length;
    const distribution = [];
    const step = Math.ceil(total / 10); // Divide into 10 segments

    for (let i = 0; i < total; i += step) {
        distribution.push({
            min: sortedData[i],
            max: sortedData[Math.min(i + step - 1, total - 1)],
            count: Math.min(step, total - i)
        });
    }

    return distribution;
}