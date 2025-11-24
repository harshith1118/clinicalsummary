import asyncio
from flask import Flask, render_template, request, jsonify
from app.endpoint_manager import EndpointManager
from app.status_checker import check_multiple_endpoints
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Initialize endpoint manager
endpoint_manager = EndpointManager()


@app.route('/')
def index():
    """Serve the main dashboard page."""
    return render_template('index.html')


@app.route('/api/endpoints', methods=['GET'])
def get_endpoints():
    """Get all configured endpoints."""
    endpoints = endpoint_manager.get_all_endpoints()
    return jsonify({'endpoints': endpoints})


@app.route('/api/endpoints', methods=['POST'])
def add_endpoint():
    """Add a new endpoint to monitor."""
    data = request.json
    
    # Validate required fields
    if not data or 'url' not in data or 'name' not in data:
        return jsonify({'error': 'URL and name are required'}), 400
    
    url = data['url']
    name = data['name']
    expected_status = data.get('expected_status', 200)
    
    # Validate URL format
    if not url.startswith(('http://', 'https://')):
        return jsonify({'error': 'URL must start with http:// or https://'}), 400
    
    # Validate status code
    if not isinstance(expected_status, int) or expected_status < 100 or expected_status > 599:
        return jsonify({'error': 'Expected status code must be between 100 and 599'}), 400
    
    # Add endpoint
    endpoint = endpoint_manager.add_endpoint(url, name, expected_status)
    
    return jsonify({'endpoint': endpoint}), 201


@app.route('/api/check-status', methods=['POST'])
def check_status():
    """Check the status of specified endpoints."""
    data = request.json
    
    if not data or 'endpoint_ids' not in data:
        return jsonify({'error': 'endpoint_ids are required'}), 400
    
    endpoint_ids = data['endpoint_ids']
    
    # Get endpoints to check
    endpoints = []
    for endpoint_id in endpoint_ids:
        endpoint = endpoint_manager.get_endpoint(endpoint_id)
        if endpoint:
            endpoints.append(endpoint)
    
    if not endpoints:
        return jsonify({'results': []})
    
    # Run async status checks
    results = asyncio.run(check_multiple_endpoints(endpoints))
    
    # Update endpoint manager with results
    for result in results:
        endpoint_manager.update_endpoint_status(
            result['id'],
            result['status'],
            result['response_time'] if result['response_time'] is not None else 0,
            datetime.fromisoformat(result['last_checked'])
        )
    
    # Get updated endpoints
    updated_endpoints = [endpoint_manager.get_endpoint(r['id']) for r in results]
    
    return jsonify({'results': updated_endpoints})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
