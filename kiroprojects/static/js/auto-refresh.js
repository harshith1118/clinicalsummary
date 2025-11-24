// Auto-refresh module

let autoRefreshInterval = null;

/**
 * Start auto-refresh with specified interval
 */
function startAutoRefresh(intervalSeconds = 60) {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // Set up new interval
  autoRefreshInterval = setInterval(async () => {
    console.log("Auto-refresh: Checking endpoints...");
    const results = await checkAllEndpoints();
    if (results.length > 0) {
      await refreshEndpoints();
    }
  }, intervalSeconds * 1000);

  console.log(
    `Auto-refresh started: checking every ${intervalSeconds} seconds`
  );
}

/**
 * Stop auto-refresh
 */
function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    console.log("Auto-refresh stopped");
  }
}

/**
 * Handle page visibility changes
 */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden, stop auto-refresh
    stopAutoRefresh();
    console.log("Page hidden: auto-refresh stopped");
  } else {
    // Page is visible again, restart auto-refresh
    startAutoRefresh(60);
    console.log("Page visible: auto-refresh restarted");
  }
});
