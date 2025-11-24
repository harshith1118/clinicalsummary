# Implementation Plan

- [x] 1. Set up project structure and dependencies

  - Create project directory structure (app/, templates/, static/)
  - Create and activate Python virtual environment
  - Create requirements.txt with Flask, aiohttp, pytest, hypothesis
  - Install all dependencies
  - Create basic .gitignore file
  - _Requirements: 7.1, 7.2_

- [x] 2. Implement core data models

  - Create models.py with Endpoint dataclass
  - Implement to_dict() and from_dict() serialization methods
  - Implement StatusCheckResult dataclass
  - _Requirements: 1.4_

- [ ]\* 2.1 Write property test for endpoint serialization

  - **Feature: url-status-monitor, Property 1: Complete endpoint storage**
  - **Validates: Requirements 1.1, 1.4**

- [ ]\* 2.2 Write property test for default status code

  - **Feature: url-status-monitor, Property 2: Default status code assignment**
  - **Validates: Requirements 1.2**

- [x] 3. Implement endpoint manager

  - Create endpoint_manager.py with EndpointManager class
  - Implement add_endpoint() method with in-memory storage
  - Implement get_all_endpoints() method
  - Implement get_endpoint() method
  - Implement update_endpoint_status() method
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]\* 3.1 Write unit tests for endpoint manager

  - Test adding endpoints with complete data
  - Test adding endpoints with missing optional fields
  - Test retrieving endpoints by ID
  - Test updating endpoint status
  - _Requirements: 1.1, 1.2_

- [x] 4. Implement asynchronous status checker

  - Create status_checker.py with async functions
  - Implement check_single_endpoint() with aiohttp
  - Add timeout handling (10 seconds)
  - Add error handling for network failures
  - Implement response time calculation
  - Implement status determination logic (matching vs non-matching status codes)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.3_

- [ ]\* 4.1 Write property test for status determination (matching)

  - **Feature: url-status-monitor, Property 4: Status determination for matching responses**
  - **Validates: Requirements 2.2**

- [ ]\* 4.2 Write property test for status determination (non-matching)

  - **Feature: url-status-monitor, Property 5: Status determination for non-matching responses**
  - **Validates: Requirements 2.3**

- [ ]\* 4.3 Write property test for response time recording

  - **Feature: url-status-monitor, Property 6: Response time recording**
  - **Validates: Requirements 2.5**

- [ ]\* 4.4 Write property test for timestamp updates

  - **Feature: url-status-monitor, Property 7: Timestamp updates**
  - **Validates: Requirements 2.6**

- [ ]\* 4.5 Write unit tests for status checker

  - Test timeout handling with slow endpoints
  - Test connection error handling
  - Test various HTTP status codes (200, 404, 500)
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 5. Implement concurrent endpoint checking

  - Create check_multiple_endpoints() function using asyncio.gather()
  - Ensure all endpoints are checked concurrently
  - _Requirements: 2.1, 8.1_

- [ ]\* 5.1 Write property test for concurrent execution

  - **Feature: url-status-monitor, Property 15: Concurrent execution efficiency**
  - **Validates: Requirements 8.1**

- [x] 6. Create Flask application and routes

  - Create app.py with Flask initialization
  - Configure Flask to run on port 8000
  - Create route for GET / (dashboard page)
  - Create route for POST /api/check-status
  - Create route for POST /api/endpoints (add endpoint)
  - Create route for GET /api/endpoints (get all endpoints)
  - Integrate asyncio.run() for calling async status checker
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ]\* 6.1 Write property test for API completeness

  - **Feature: url-status-monitor, Property 14: API returns status for all URLs**
  - **Validates: Requirements 7.4**

- [ ]\* 6.2 Write unit tests for API routes

  - Test POST /api/check-status with valid payload
  - Test POST /api/endpoints with valid data
  - Test GET /api/endpoints returns all endpoints
  - Test error responses for invalid requests
  - _Requirements: 7.3, 7.4_

- [ ] 7. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create dashboard HTML structure

  - Create templates/index.html with Tailwind CSS CDN
  - Add header section with application title
  - Create form for adding new endpoints (URL, name, expected status inputs)
  - Create table structure for displaying endpoints
  - Add "Check All" button
  - Add sections for charts (response time trend and status distribution)
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.5_

- [x] 9. Implement frontend JavaScript for API communication

  - Create static/js/api.js module
  - Implement checkAllEndpoints() function using Fetch API
  - Implement addEndpoint() function
  - Implement getAllEndpoints() function
  - Add error handling for API calls
  - _Requirements: 1.1, 2.1_

- [x] 10. Implement frontend UI update logic

  - Create static/js/ui.js module
  - Implement updateEndpointTable() to render endpoint data
  - Implement status badge rendering with color coding (green/red/yellow)
  - Implement response time display in milliseconds
  - Add loading states during API calls
  - Wire up "Check All" button to trigger status checks
  - Wire up form submission to add new endpoints
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.5_

- [ ]\* 10.1 Write property test for status color coding

  - **Feature: url-status-monitor, Property 8: Status color coding**
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ]\* 10.2 Write property test for response time display

  - **Feature: url-status-monitor, Property 9: Response time display**
  - **Validates: Requirements 3.5**

- [ ]\* 10.3 Write property test for dashboard data display

  - **Feature: url-status-monitor, Property 3: Dashboard displays all endpoint data**
  - **Validates: Requirements 1.3**

- [x] 11. Implement response history tracking

  - Update endpoint_manager.py to store response history
  - Limit history to last 100 entries per endpoint
  - Update update_endpoint_status() to append to history
  - _Requirements: 5.1, 5.2_

- [ ]\* 11.1 Write property test for history growth

  - **Feature: url-status-monitor, Property 10: Response history growth**
  - **Validates: Requirements 5.2**

- [x] 12. Implement Chart.js visualizations

  - Add Chart.js CDN to index.html
  - Create static/js/charts.js module
  - Implement response time trend line chart
  - Configure chart with time on x-axis and response time on y-axis
  - Implement status distribution pie chart
  - Add chart update functions
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3_

- [ ]\* 12.1 Write property test for chart data structure

  - **Feature: url-status-monitor, Property 11: Chart data structure**
  - **Validates: Requirements 5.1**

- [ ]\* 12.2 Write property test for pie chart updates

  - **Feature: url-status-monitor, Property 12: Pie chart updates with status changes**
  - **Validates: Requirements 6.1, 6.2**

- [ ]\* 12.3 Write property test for percentage calculation

  - **Feature: url-status-monitor, Property 13: Status percentage calculation**
  - **Validates: Requirements 6.3**

- [x] 13. Implement auto-refresh functionality

  - Create static/js/auto-refresh.js module
  - Implement startAutoRefresh() with 60-second interval
  - Implement stopAutoRefresh() function
  - Add visibility change listener to stop refresh when page is hidden
  - Start auto-refresh when dashboard loads
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 14. Add input validation and error handling

  - Add URL format validation in frontend
  - Add status code validation (100-599 range)
  - Add backend validation for API inputs
  - Implement user-friendly error messages
  - Add try-catch blocks for all API calls
  - _Requirements: 1.1, 1.2_

- [x] 15. Polish UI and add final touches

  - Add CSS styling for responsive layout
  - Add hover effects and transitions
  - Ensure mobile responsiveness
  - Add loading spinners during status checks
  - Add empty state messages when no endpoints configured
  - Test all user interactions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
