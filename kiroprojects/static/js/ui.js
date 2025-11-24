// UI update and interaction module

/**
 * Show/hide loading spinner
 */
function showLoadingSpinner(show) {
  const spinner = document.getElementById("loading-spinner");
  if (show) {
    spinner.classList.remove("hidden");
  } else {
    spinner.classList.add("hidden");
  }
}

/**
 * Show notification message
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const icons = {
    success: '<i class="fas fa-check-circle mr-2"></i>',
    error: '<i class="fas fa-exclamation-circle mr-2"></i>',
    info: '<i class="fas fa-info-circle mr-2"></i>',
  };

  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500"
  } text-white font-semibold transform transition-all duration-300 fade-in`;

  notification.innerHTML = icons[type] + message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
  const badges = {
    Operational:
      '<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 shadow-sm"><span class="status-dot status-operational status-pulse"></span>Operational</span>',
    Down: '<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 shadow-sm"><span class="status-dot status-down status-pulse"></span>Down</span>',
    Degraded:
      '<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 shadow-sm"><span class="status-dot status-degraded status-pulse"></span>Degraded</span>',
    Unknown:
      '<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 shadow-sm"><span class="status-dot status-unknown"></span>Unknown</span>',
  };
  return badges[status] || badges["Unknown"];
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '<span class="text-gray-400">Never</span>';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60)
    return '<span class="text-green-600 font-semibold">Just now</span>';
  if (diff < 3600)
    return `<span class="text-blue-600 font-semibold">${Math.floor(
      diff / 60
    )}m ago</span>`;
  if (diff < 86400)
    return `<span class="text-purple-600 font-semibold">${Math.floor(
      diff / 3600
    )}h ago</span>`;

  return `<span class="text-gray-600">${date.toLocaleString()}</span>`;
}

/**
 * Format response time
 */
function formatResponseTime(responseTime) {
  if (responseTime === null || responseTime === undefined) {
    return '<span class="text-gray-400">N/A</span>';
  }
  const time = Math.round(responseTime);
  const color =
    time < 200
      ? "text-green-600"
      : time < 500
      ? "text-yellow-600"
      : "text-red-600";
  return `<span class="${color} font-bold">${time} ms</span>`;
}

/**
 * Update statistics cards
 */
function updateStatistics(endpoints) {
  const stats = {
    operational: 0,
    down: 0,
    total: endpoints.length,
    avgResponse: 0,
  };

  let totalResponse = 0;
  let responseCount = 0;

  endpoints.forEach((endpoint) => {
    if (endpoint.current_status === "Operational") stats.operational++;
    else if (endpoint.current_status === "Down") stats.down++;

    if (
      endpoint.response_time !== null &&
      endpoint.response_time !== undefined
    ) {
      totalResponse += endpoint.response_time;
      responseCount++;
    }
  });

  stats.avgResponse =
    responseCount > 0 ? Math.round(totalResponse / responseCount) : 0;

  document.getElementById("stat-operational").textContent = stats.operational;
  document.getElementById("stat-down").textContent = stats.down;
  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-avg-response").textContent =
    stats.avgResponse + "ms";
}

/**
 * Update endpoints table
 */
function updateEndpointTable(endpoints) {
  const tbody = document.getElementById("endpoints-table-body");
  const emptyState = document.getElementById("empty-state");

  if (!endpoints || endpoints.length === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
    updateStatistics([]);
    return;
  }

  emptyState.classList.add("hidden");

  tbody.innerHTML = endpoints
    .map(
      (endpoint, index) => `
        <tr class="hover:bg-purple-50 transition-colors duration-200 fade-in" style="animation-delay: ${
          index * 0.05
        }s">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <i class="fas fa-server text-purple-500 mr-3"></i>
                    <span class="text-sm font-bold text-gray-900">${
                      endpoint.name
                    }</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title="${
              endpoint.url
            }">
                <i class="fas fa-link text-gray-400 mr-2"></i>${endpoint.url}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    ${endpoint.expected_status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(
              endpoint.current_status
            )}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">${formatResponseTime(
              endpoint.response_time
            )}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">${formatTimestamp(
              endpoint.last_checked
            )}</td>
        </tr>
    `
    )
    .join("");

  updateStatistics(endpoints);
}

/**
 * Initialize form handlers
 */
function initializeFormHandlers() {
  const form = document.getElementById("add-endpoint-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = document.getElementById("endpoint-url").value;
    const name = document.getElementById("endpoint-name").value;
    const expectedStatus = parseInt(
      document.getElementById("endpoint-status").value
    );

    try {
      await addEndpoint(url, name, expectedStatus);

      // Clear form
      form.reset();
      document.getElementById("endpoint-status").value = "200";

      // Refresh endpoints list
      await refreshEndpoints();
    } catch (error) {
      // Error already handled in addEndpoint
    }
  });
}

/**
 * Initialize check all button
 */
function initializeCheckAllButton() {
  const checkAllBtn = document.getElementById("check-all-btn");
  checkAllBtn.addEventListener("click", async () => {
    const results = await checkAllEndpoints();
    if (results.length > 0) {
      await refreshEndpoints();
      updateCharts();
    }
  });
}

/**
 * Refresh endpoints display
 */
async function refreshEndpoints() {
  const endpoints = await getAllEndpoints();
  updateEndpointTable(endpoints);
  updateCharts();
}

/**
 * Initialize the application
 */
async function initializeApp() {
  initializeFormHandlers();
  initializeCheckAllButton();
  await refreshEndpoints();
  initializeCharts();
  startAutoRefresh();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
