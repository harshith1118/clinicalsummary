# URL Status Monitor

A single-purpose web application that instantly checks the live status (UP/DOWN) of multiple URLs or API endpoints.

## Features

- ✅ Real-time endpoint monitoring
- ✅ Concurrent status checks using async/await
- ✅ Color-coded status indicators (Green/Red/Yellow)
- ✅ Response time tracking
- ✅ Historical response time trends (line chart)
- ✅ Status distribution visualization (pie chart)
- ✅ Auto-refresh every 60 seconds
- ✅ Modern, responsive UI with Tailwind CSS

## Quick Start

### Prerequisites

- Python 3.8 or higher

### Installation

1. Clone or download this repository

2. Create and activate a virtual environment:

```bash
# Windows
py -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the Flask server:

```bash
python app.py
```

2. Open your browser and navigate to:

```
http://localhost:8000
```

## Usage

### Adding Endpoints

1. Fill in the form at the top of the dashboard:

   - **URL**: The full endpoint URL (e.g., `https://api.example.com`)
   - **Name**: A friendly name for the endpoint (e.g., "Payment API")
   - **Expected Status**: The HTTP status code that indicates "UP" (default: 200)

2. Click "Add Endpoint"

### Checking Status

- Click the **"Check All"** button to manually check all endpoints
- The system automatically checks all endpoints every 60 seconds
- Auto-refresh stops when you navigate away from the page

### Understanding Status Indicators

- 🟢 **Operational** (Green): Endpoint is responding with the expected status code
- 🔴 **Down** (Red): Endpoint failed to respond or returned unexpected status code
- 🟡 **Degraded** (Yellow): Reserved for future use (slow response times)
- ⚪ **Unknown** (Gray): Endpoint hasn't been checked yet

### Charts

- **Response Time Trend**: Shows historical response times for all endpoints
- **Status Distribution**: Shows the proportion of endpoints in each status category

## API Endpoints

### GET `/api/endpoints`

Returns all configured endpoints.

### POST `/api/endpoints`

Add a new endpoint to monitor.

**Request Body:**

```json
{
  "url": "https://api.example.com",
  "name": "My API",
  "expected_status": 200
}
```

### POST `/api/check-status`

Check the status of specified endpoints.

**Request Body:**

```json
{
  "endpoint_ids": [1, 2, 3]
}
```

## Project Structure

```
.
├── app.py                  # Flask application and routes
├── app/
│   ├── models.py          # Data models (Endpoint, StatusCheckResult)
│   ├── endpoint_manager.py # Endpoint management logic
│   └── status_checker.py  # Async status checking logic
├── templates/
│   └── index.html         # Dashboard UI
├── static/
│   └── js/
│       ├── api.js         # API communication
│       ├── ui.js          # UI updates and interactions
│       ├── charts.js      # Chart.js visualizations
│       └── auto-refresh.js # Auto-refresh functionality
└── requirements.txt       # Python dependencies
```

## Technology Stack

- **Backend**: Flask (Python)
- **Async HTTP**: aiohttp
- **Frontend**: Vanilla JavaScript
- **UI Framework**: Tailwind CSS (CDN)
- **Charts**: Chart.js
- **Data Storage**: In-memory (no database required)

## Development

The application runs in debug mode by default. Any changes to Python files will automatically reload the server.

## Notes

- This is a development version using in-memory storage
- Endpoint data is lost when the server restarts
- For production use, consider adding persistent storage (SQLite/PostgreSQL)
- The 10-second timeout for endpoint checks can be adjusted in `app/status_checker.py`

## License

MIT License - feel free to use and modify as needed!
