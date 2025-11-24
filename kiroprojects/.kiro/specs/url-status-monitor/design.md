# Design Document: URL Status Monitor

## Overview

The URL Status Monitor is a lightweight web application built with Python Flask that provides real-time monitoring of multiple HTTP endpoints. The architecture follows a client-server model where the Flask backend handles asynchronous HTTP requests to monitored endpoints, while a modern JavaScript frontend provides an interactive dashboard with real-time updates and visualizations.

The system uses in-memory storage for simplicity, making it suitable for development and demonstration purposes. All status checks are performed asynchronously using Python's asyncio and aiohttp libraries to ensure fast, concurrent execution even with many endpoints.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         Browser (Client)                │
│  ┌───────────────────────────────────┐  │
│  │   Dashboard UI (HTML/JS/CSS)      │  │
│  │   - Endpoint Form                 │  │
│  │   - Status Table                  │  │
│  │   - Charts (Chart.js)             │  │
│  └───────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │ HTTP/JSON
               │
┌──────────────▼──────────────────────────┐
│      Flask Web Server (Port 8000)       │
│  ┌───────────────────────────────────┐  │
│  │   Routes Layer                    │  │
│  │   - / (Dashboard)                 │  │
│  │   - /api/check-status (POST)      │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │   Business Logic Layer            │  │
│  │   - Endpoint Manager              │  │
│  │   - Status Checker (async)        │  │
│  └───────────────┬───────────────────┘  │
│                  │                       │
│  ┌───────────────▼───────────────────┐  │
│  │   Data Layer                      │  │
│  │   - In-Memory Store               │  │
│  │   - JSON File (optional persist)  │  │
│  └───────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │ HTTP Requests
               │
┌──────────────▼──────────────────────────┐
│      External Endpoints                 │
│   (APIs, Services, Webhooks)            │
└─────────────────────────────────────────┘
```

### Technology Stack

- **Backend Framework**: Flask (Python 3.8+)
- **Async HTTP Client**: aiohttp
- **Async Runtime**: asyncio
- **Frontend**: Vanilla JavaScript with Fetch API
- **UI Framework**: Tailwind CSS (CDN)
- **Charting**: Chart.js
- **Data Storage**: In-memory Python list/dict with optional JSON file persistence

## Components and Interfaces

### Backend Components

#### 1. Flask Application (`app.py`)

Main application entry point that initializes Flask and registers routes.

```python
# Key responsibilities:
# - Initialize Flask app
# - Configure CORS if needed
# - Register route handlers
# - Run development server on port 8000
```

#### 2. Endpoint Manager (`endpoint_manager.py`)

Manages the collection of monitored endpoints.

```python
class EndpointManager:
    def add_endpoint(url: str, name: str, expected_status: int = 200) -> dict
    def get_all_endpoints() -> list[dict]
    def get_endpoint(endpoint_id: int) -> dict | None
    def update_endpoint_status(endpoint_id: int, status: str,
                               response_time: float, timestamp: datetime) -> None
```

**Data Structure:**

```python
{
    "id": int,
    "url": str,
    "name": str,
    "expected_status": int,
    "last_checked": datetime,
    "current_status": str,  # "Operational", "Degraded", "Down"
    "response_time": float,  # milliseconds
    "response_history": list[dict]  # For charting
}
```

#### 3. Status Checker (`status_checker.py`)

Performs asynchronous HTTP requests to check endpoint status.

```python
async def check_single_endpoint(url: str, expected_status: int) -> dict:
    """
    Returns:
    {
        "url": str,
        "status": str,  # "Operational", "Down"
        "response_time": float,
        "actual_status_code": int | None,
        "error": str | None
    }
    """

async def check_multiple_endpoints(endpoints: list[dict]) -> list[dict]:
    """
    Concurrently checks all endpoints using asyncio.gather()
    """
```

**Status Determination Logic:**

- If response status code matches expected: "Operational"
- If response status code doesn't match or request fails: "Down"
- Future enhancement: "Degraded" if response time > threshold

#### 4. Routes (`routes.py`)

##### GET `/`

Serves the main dashboard HTML page.

##### POST `/api/check-status`

Accepts a list of endpoint IDs or full endpoint objects and returns their current status.

**Request Body:**

```json
{
  "endpoint_ids": [1, 2, 3]
}
```

**Response:**

```json
{
  "results": [
    {
      "id": 1,
      "url": "https://api.example.com",
      "name": "Example API",
      "status": "Operational",
      "response_time": 145.3,
      "last_checked": "2025-11-24T10:30:00Z"
    }
  ]
}
```

##### POST `/api/endpoints`

Adds a new endpoint to monitor.

**Request Body:**

```json
{
  "url": "https://api.example.com/health",
  "name": "Payment Service",
  "expected_status": 200
}
```

##### GET `/api/endpoints`

Returns all configured endpoints.

### Frontend Components

#### 1. Dashboard UI (`templates/index.html`)

Single-page application with the following sections:

- **Header**: Application title and overall status summary
- **Add Endpoint Form**: Input fields for URL, name, and expected status code
- **Endpoints Table**: Displays all monitored endpoints with status badges
- **Charts Section**: Response time trends and status distribution
- **Control Panel**: "Check All" button and auto-refresh toggle

#### 2. JavaScript Modules

##### `api.js`

Handles all API communication with the backend.

```javascript
async function checkAllEndpoints()
async function addEndpoint(url, name, expectedStatus)
async function getAllEndpoints()
```

##### `ui.js`

Manages DOM updates and user interactions.

```javascript
function updateEndpointTable(endpoints)
function updateStatusBadge(endpointId, status)
function showNotification(message, type)
```

##### `charts.js`

Manages Chart.js visualizations.

```javascript
function updateResponseTimeChart(endpointId, history)
function updateStatusDistributionChart(endpoints)
```

##### `auto-refresh.js`

Handles automatic periodic status checks.

```javascript
function startAutoRefresh(intervalSeconds = 60)
function stopAutoRefresh()
```

## Data Models

### Endpoint Model

```python
@dataclass
class Endpoint:
    id: int
    url: str
    name: str
    expected_status: int = 200
    last_checked: Optional[datetime] = None
    current_status: str = "Unknown"  # "Operational", "Degraded", "Down", "Unknown"
    response_time: Optional[float] = None  # milliseconds
    response_history: list = field(default_factory=list)

    def to_dict(self) -> dict:
        """Serialize to JSON-compatible dict"""

    @staticmethod
    def from_dict(data: dict) -> 'Endpoint':
        """Deserialize from dict"""
```

### Status Check Result Model

```python
@dataclass
class StatusCheckResult:
    url: str
    status: str  # "Operational", "Down"
    response_time: float  # milliseconds
    actual_status_code: Optional[int]
    error: Optional[str]
    timestamp: datetime
```

### Response History Entry

```python
{
    "timestamp": datetime,
    "response_time": float,
    "status": str
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Complete endpoint storage

_For any_ valid endpoint submission (URL, name, and optional expected status code), adding it to the system should result in the endpoint being stored with all required fields: unique ID, URL, name, expected status code, last checked timestamp, current status, and response time.
**Validates: Requirements 1.1, 1.4**

### Property 2: Default status code assignment

_For any_ endpoint submitted without an expected status code, the system should assign 200 as the default expected status code.
**Validates: Requirements 1.2**

### Property 3: Dashboard displays all endpoint data

_For any_ set of configured endpoints, the dashboard rendering should include the name, URL, and expected status code for each endpoint.
**Validates: Requirements 1.3**

### Property 4: Status determination for matching responses

_For any_ endpoint where the actual HTTP response status code matches the expected status code, the system should mark that endpoint as "Operational".
**Validates: Requirements 2.2**

### Property 5: Status determination for non-matching responses

_For any_ endpoint where the actual HTTP response status code does not match the expected status code, the system should mark that endpoint as "Down".
**Validates: Requirements 2.3**

### Property 6: Response time recording

_For any_ completed status check, the system should record a response time value in milliseconds that is a non-negative number.
**Validates: Requirements 2.5**

### Property 7: Timestamp updates

_For any_ completed status check, the system should update the endpoint's last_checked timestamp to reflect the check time.
**Validates: Requirements 2.6**

### Property 8: Status color coding

_For any_ endpoint displayed on the dashboard, the system should use green indicators for "Operational" status, red indicators for "Down" status, and yellow indicators for "Degraded" status.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 9: Response time display

_For any_ endpoint with a recorded response time, the dashboard should display that response time value in milliseconds.
**Validates: Requirements 3.5**

### Property 10: Response history growth

_For any_ endpoint, recording a new status check result should increase the length of that endpoint's response history by one entry.
**Validates: Requirements 5.2**

### Property 11: Chart data structure

_For any_ endpoint with response history, the chart data structure should contain timestamp values for the x-axis and response time values in milliseconds for the y-axis.
**Validates: Requirements 5.1**

### Property 12: Pie chart updates with status changes

_For any_ set of endpoints, when endpoint statuses change, the pie chart data should reflect the updated distribution of statuses.
**Validates: Requirements 6.1, 6.2**

### Property 13: Status percentage calculation

_For any_ set of endpoints, the calculated percentages for each status category should sum to 100% and accurately represent the proportion of endpoints in each category.
**Validates: Requirements 6.3**

### Property 14: API returns status for all URLs

_For any_ list of URLs sent to the /api/check-status endpoint, the API response should contain status information for each URL in the request.
**Validates: Requirements 7.4**

### Property 15: Concurrent execution efficiency

_For any_ set of N endpoints being checked, the total execution time should be approximately equal to the slowest individual endpoint check time (not the sum of all check times), demonstrating concurrent execution.
**Validates: Requirements 8.1**

## Error Handling

### Network Errors

**Timeout Handling:**

- Set a reasonable timeout (e.g., 10 seconds) for all HTTP requests
- If a request times out, mark the endpoint as "Down" with error message "Request timeout"

**Connection Errors:**

- Handle DNS resolution failures, connection refused, and other network errors
- Mark endpoint as "Down" with descriptive error message

**SSL/TLS Errors:**

- Handle certificate validation errors gracefully
- Provide option to skip SSL verification for development (with warning)

### Invalid Input Handling

**URL Validation:**

- Validate URL format before adding endpoint
- Reject malformed URLs with clear error message
- Support both HTTP and HTTPS schemes

**Status Code Validation:**

- Validate expected status code is a valid HTTP status code (100-599)
- Provide helpful error message for invalid codes

### Frontend Error Handling

**API Communication Errors:**

- Display user-friendly error messages when API calls fail
- Implement retry logic for transient failures
- Show loading states during API calls

**Chart Rendering Errors:**

- Handle cases where chart data is incomplete or invalid
- Display placeholder or error message if chart cannot render

### Data Persistence Errors

**JSON File Operations:**

- Handle file read/write errors gracefully
- Fall back to in-memory storage if file operations fail
- Log errors for debugging

## Testing Strategy

### Unit Testing

The system will use **pytest** as the testing framework for Python backend code.

**Unit Test Coverage:**

1. **Endpoint Manager Tests:**

   - Test adding endpoints with valid data
   - Test adding endpoints with missing optional fields
   - Test retrieving endpoints by ID
   - Test updating endpoint status
   - Test edge cases: empty names, invalid URLs

2. **Status Checker Tests:**

   - Test single endpoint checking with mocked HTTP responses
   - Test handling of various HTTP status codes (200, 404, 500, etc.)
   - Test timeout handling
   - Test connection error handling
   - Test response time calculation accuracy

3. **API Route Tests:**

   - Test POST /api/check-status with valid payload
   - Test POST /api/endpoints with valid data
   - Test GET /api/endpoints returns all endpoints
   - Test error responses for invalid requests

4. **Data Model Tests:**
   - Test Endpoint serialization (to_dict)
   - Test Endpoint deserialization (from_dict)
   - Test default value assignment

### Property-Based Testing

The system will use **Hypothesis** as the property-based testing library for Python.

**Configuration:**

- Each property-based test will run a minimum of 100 iterations
- Tests will use Hypothesis strategies to generate random but valid test data

**Property Test Requirements:**

- Each property-based test MUST include a comment tag in this exact format: `**Feature: url-status-monitor, Property {number}: {property_text}**`
- Each correctness property listed above MUST be implemented by a SINGLE property-based test
- Property tests will generate random endpoints, URLs, status codes, and response data to verify universal behaviors

**Property Test Coverage:**

1. **Endpoint Storage Properties (Properties 1-3):**

   - Generate random valid endpoint data and verify complete storage
   - Generate endpoints without status codes and verify default assignment
   - Generate random endpoint sets and verify dashboard rendering

2. **Status Determination Properties (Properties 4-5):**

   - Generate random status codes and responses to test matching/non-matching logic
   - Verify correct status assignment across all possible status code combinations

3. **Data Recording Properties (Properties 6-7):**

   - Generate random check results and verify response time recording
   - Verify timestamp updates for all checks

4. **UI Rendering Properties (Properties 8-9):**

   - Generate endpoints with various statuses and verify color coding
   - Verify response time display for all endpoints

5. **History and Chart Properties (Properties 10-12):**

   - Generate random check sequences and verify history growth
   - Verify chart data structure correctness
   - Generate status changes and verify pie chart updates

6. **Calculation Properties (Property 13):**

   - Generate random endpoint distributions and verify percentage calculations

7. **API Properties (Property 14):**

   - Generate random URL lists and verify API response completeness

8. **Concurrency Properties (Property 15):**
   - Generate multiple endpoints and verify concurrent execution timing

### Integration Testing

While not the primary focus for the initial version, basic integration tests will verify:

- Flask app starts successfully on port 8000
- Dashboard page loads and renders
- API endpoints are accessible and return expected response formats
- Auto-refresh mechanism triggers checks at correct intervals

### Frontend Testing

Manual testing will be performed for:

- UI responsiveness and layout
- Chart rendering with various data sets
- Auto-refresh functionality
- User interactions (form submission, button clicks)

## Implementation Notes

### Async/Await Pattern

All status checking operations will use Python's async/await syntax:

```python
async def check_single_endpoint(url: str, expected_status: int) -> StatusCheckResult:
    async with aiohttp.ClientSession() as session:
        try:
            start_time = time.time()
            async with session.get(url, timeout=10) as response:
                response_time = (time.time() - start_time) * 1000
                status = "Operational" if response.status == expected_status else "Down"
                return StatusCheckResult(
                    url=url,
                    status=status,
                    response_time=response_time,
                    actual_status_code=response.status,
                    error=None,
                    timestamp=datetime.now()
                )
        except Exception as e:
            return StatusCheckResult(
                url=url,
                status="Down",
                response_time=None,
                actual_status_code=None,
                error=str(e),
                timestamp=datetime.now()
            )
```

### Flask-Async Integration

Flask routes that call async functions will use `asyncio.run()`:

```python
@app.route('/api/check-status', methods=['POST'])
def check_status():
    endpoint_ids = request.json.get('endpoint_ids', [])
    endpoints = [endpoint_manager.get_endpoint(id) for id in endpoint_ids]
    results = asyncio.run(check_multiple_endpoints(endpoints))
    return jsonify({'results': results})
```

### In-Memory Storage Structure

```python
# Global storage (for simplicity in initial version)
endpoints_store = {
    'next_id': 1,
    'endpoints': {}  # id -> Endpoint object
}
```

### Chart.js Configuration

Response time trend chart:

```javascript
new Chart(ctx, {
  type: "line",
  data: {
    labels: timestamps, // x-axis
    datasets: [
      {
        label: "Response Time (ms)",
        data: responseTimes, // y-axis
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
});
```

Status distribution pie chart:

```javascript
new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Operational", "Down", "Degraded"],
    datasets: [
      {
        data: [operationalCount, downCount, degradedCount],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
      },
    ],
  },
});
```

### Auto-Refresh Implementation

```javascript
let autoRefreshInterval = null;

function startAutoRefresh(intervalSeconds = 60) {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  autoRefreshInterval = setInterval(() => {
    checkAllEndpoints();
  }, intervalSeconds * 1000);
}

// Stop auto-refresh when page is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden && autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
});
```

## Security Considerations

1. **SSRF Protection**: Validate and sanitize URLs to prevent Server-Side Request Forgery attacks
2. **Rate Limiting**: Consider implementing rate limiting to prevent abuse of the check-status endpoint
3. **Input Validation**: Validate all user inputs on both frontend and backend
4. **CORS Configuration**: Configure CORS appropriately if frontend and backend are on different origins
5. **Timeout Configuration**: Set reasonable timeouts to prevent resource exhaustion

## Performance Considerations

1. **Concurrent Requests**: Use asyncio.gather() to check multiple endpoints simultaneously
2. **Connection Pooling**: Reuse aiohttp ClientSession for better performance
3. **Response History Limits**: Limit stored history to prevent memory growth (e.g., keep last 100 checks)
4. **Chart Data Optimization**: Downsample historical data for charts if history becomes large

## Future Enhancements

1. **Persistent Storage**: Add SQLite or PostgreSQL database support
2. **Authentication**: Add user accounts and authentication
3. **Alerting**: Email/SMS notifications when endpoints go down
4. **Advanced Metrics**: Track uptime percentage, SLA compliance
5. **Degraded Status**: Implement response time thresholds for "Degraded" status
6. **Endpoint Groups**: Organize endpoints into logical groups
7. **Custom Headers**: Support custom HTTP headers for authenticated endpoints
8. **Webhook Support**: POST status changes to external webhooks
