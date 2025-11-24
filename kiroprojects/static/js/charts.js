// Chart.js visualization module

let responseTimeChart = null;
let statusDistributionChart = null;

/**
 * Initialize charts
 */
function initializeCharts() {
  initializeResponseTimeChart();
  initializeStatusDistributionChart();
}

/**
 * Initialize response time trend chart
 */
function initializeResponseTimeChart() {
  const ctx = document.getElementById("response-time-chart");

  responseTimeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Response Time",
          data: [],
          borderColor: "rgb(139, 92, 246)",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "rgb(139, 92, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverBackgroundColor: "rgb(109, 40, 217)",
          pointHoverBorderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 12,
              weight: "600",
            },
            color: "#6b7280",
            callback: function (value) {
              return value + " ms";
            },
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 11,
              weight: "600",
            },
            color: "#6b7280",
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 13,
              weight: "600",
            },
            color: "#374151",
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderColor: "rgba(139, 92, 246, 0.5)",
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return " " + context.parsed.y + " ms";
            },
          },
        },
      },
    },
  });
}

/**
 * Initialize status distribution pie chart
 */
function initializeStatusDistributionChart() {
  const ctx = document.getElementById("status-distribution-chart");

  statusDistributionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Operational", "Down", "Degraded", "Unknown"],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: [
            "rgba(16, 185, 129, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(107, 114, 128, 0.8)",
          ],
          borderColor: [
            "rgb(16, 185, 129)",
            "rgb(239, 68, 68)",
            "rgb(245, 158, 11)",
            "rgb(107, 114, 128)",
          ],
          borderWidth: 3,
          hoverOffset: 15,
          hoverBorderWidth: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "60%",
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            font: {
              size: 13,
              weight: "600",
            },
            color: "#374151",
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage =
                    total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderColor: "rgba(139, 92, 246, 0.5)",
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

/**
 * Update response time chart with endpoint history
 */
function updateResponseTimeChart(endpoints) {
  if (!responseTimeChart || !endpoints || endpoints.length === 0) {
    return;
  }

  // Aggregate all response history from all endpoints
  const allHistory = [];
  endpoints.forEach((endpoint) => {
    if (endpoint.response_history && endpoint.response_history.length > 0) {
      endpoint.response_history.forEach((entry) => {
        if (entry.response_time !== null) {
          allHistory.push({
            timestamp: new Date(entry.timestamp),
            response_time: entry.response_time,
          });
        }
      });
    }
  });

  // Sort by timestamp
  allHistory.sort((a, b) => a.timestamp - b.timestamp);

  // Take last 20 entries for readability
  const recentHistory = allHistory.slice(-20);

  // Extract labels and data
  const labels = recentHistory.map((entry) =>
    entry.timestamp.toLocaleTimeString()
  );
  const data = recentHistory.map((entry) => Math.round(entry.response_time));

  // Update chart
  responseTimeChart.data.labels = labels;
  responseTimeChart.data.datasets[0].data = data;
  responseTimeChart.update("none");
}

/**
 * Update status distribution chart
 */
function updateStatusDistributionChart(endpoints) {
  if (!statusDistributionChart || !endpoints) {
    return;
  }

  // Count endpoints by status
  const statusCounts = {
    Operational: 0,
    Down: 0,
    Degraded: 0,
    Unknown: 0,
  };

  endpoints.forEach((endpoint) => {
    const status = endpoint.current_status || "Unknown";
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    } else {
      statusCounts["Unknown"]++;
    }
  });

  // Update chart data
  statusDistributionChart.data.datasets[0].data = [
    statusCounts["Operational"],
    statusCounts["Down"],
    statusCounts["Degraded"],
    statusCounts["Unknown"],
  ];

  statusDistributionChart.update("none");
}

/**
 * Update all charts
 */
async function updateCharts() {
  const endpoints = await getAllEndpoints();
  updateResponseTimeChart(endpoints);
  updateStatusDistributionChart(endpoints);
}
