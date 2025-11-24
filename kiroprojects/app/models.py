from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Endpoint:
    """Represents a monitored endpoint."""
    id: int
    url: str
    name: str
    expected_status: int = 200
    last_checked: Optional[datetime] = None
    current_status: str = "Unknown"  # "Operational", "Degraded", "Down", "Unknown"
    response_time: Optional[float] = None  # milliseconds
    response_history: list = field(default_factory=list)
    
    def to_dict(self) -> dict:
        """Serialize to JSON-compatible dict."""
        return {
            'id': self.id,
            'url': self.url,
            'name': self.name,
            'expected_status': self.expected_status,
            'last_checked': self.last_checked.isoformat() if self.last_checked else None,
            'current_status': self.current_status,
            'response_time': self.response_time,
            'response_history': self.response_history
        }
    
    @staticmethod
    def from_dict(data: dict) -> 'Endpoint':
        """Deserialize from dict."""
        endpoint = Endpoint(
            id=data['id'],
            url=data['url'],
            name=data['name'],
            expected_status=data.get('expected_status', 200),
            current_status=data.get('current_status', 'Unknown'),
            response_time=data.get('response_time'),
            response_history=data.get('response_history', [])
        )
        
        if data.get('last_checked'):
            endpoint.last_checked = datetime.fromisoformat(data['last_checked'])
        
        return endpoint


@dataclass
class StatusCheckResult:
    """Represents the result of a status check."""
    url: str
    status: str  # "Operational", "Down"
    response_time: float  # milliseconds
    actual_status_code: Optional[int]
    error: Optional[str]
    timestamp: datetime
