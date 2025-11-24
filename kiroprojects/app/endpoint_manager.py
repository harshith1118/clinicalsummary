from datetime import datetime
from typing import Optional
from app.models import Endpoint


class EndpointManager:
    """Manages the collection of monitored endpoints."""
    
    def __init__(self):
        self.endpoints = {}
        self.next_id = 1
    
    def add_endpoint(self, url: str, name: str, expected_status: int = 200) -> dict:
        """Add a new endpoint to monitor."""
        endpoint = Endpoint(
            id=self.next_id,
            url=url,
            name=name,
            expected_status=expected_status
        )
        
        self.endpoints[self.next_id] = endpoint
        self.next_id += 1
        
        return endpoint.to_dict()
    
    def get_all_endpoints(self) -> list[dict]:
        """Get all configured endpoints."""
        return [endpoint.to_dict() for endpoint in self.endpoints.values()]
    
    def get_endpoint(self, endpoint_id: int) -> Optional[dict]:
        """Get a specific endpoint by ID."""
        endpoint = self.endpoints.get(endpoint_id)
        return endpoint.to_dict() if endpoint else None
    
    def update_endpoint_status(
        self, 
        endpoint_id: int, 
        status: str, 
        response_time: float, 
        timestamp: datetime
    ) -> None:
        """Update the status of an endpoint after a check."""
        endpoint = self.endpoints.get(endpoint_id)
        if endpoint:
            endpoint.current_status = status
            endpoint.response_time = response_time
            endpoint.last_checked = timestamp
            
            # Add to response history
            history_entry = {
                'timestamp': timestamp.isoformat(),
                'response_time': response_time,
                'status': status
            }
            endpoint.response_history.append(history_entry)
            
            # Limit history to last 100 entries
            if len(endpoint.response_history) > 100:
                endpoint.response_history = endpoint.response_history[-100:]
