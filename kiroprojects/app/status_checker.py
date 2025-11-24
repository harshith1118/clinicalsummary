import time
import asyncio
import aiohttp
from datetime import datetime
from app.models import StatusCheckResult


async def check_single_endpoint(url: str, expected_status: int) -> StatusCheckResult:
    """
    Check the status of a single endpoint asynchronously.
    
    Args:
        url: The endpoint URL to check
        expected_status: The expected HTTP status code
        
    Returns:
        StatusCheckResult with the check results
    """
    start_time = time.time()
    
    try:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url) as response:
                response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
                
                # Determine status based on expected vs actual status code
                status = "Operational" if response.status == expected_status else "Down"
                
                return StatusCheckResult(
                    url=url,
                    status=status,
                    response_time=response_time,
                    actual_status_code=response.status,
                    error=None,
                    timestamp=datetime.now()
                )
    
    except aiohttp.ClientError as e:
        # Handle connection errors, DNS failures, etc.
        return StatusCheckResult(
            url=url,
            status="Down",
            response_time=None,
            actual_status_code=None,
            error=f"Connection error: {str(e)}",
            timestamp=datetime.now()
        )
    
    except asyncio.TimeoutError:
        # Handle timeout
        return StatusCheckResult(
            url=url,
            status="Down",
            response_time=None,
            actual_status_code=None,
            error="Request timeout",
            timestamp=datetime.now()
        )
    
    except Exception as e:
        # Handle any other unexpected errors
        return StatusCheckResult(
            url=url,
            status="Down",
            response_time=None,
            actual_status_code=None,
            error=f"Unexpected error: {str(e)}",
            timestamp=datetime.now()
        )



async def check_multiple_endpoints(endpoints: list[dict]) -> list[dict]:
    """
    Check multiple endpoints concurrently using asyncio.gather().
    
    Args:
        endpoints: List of endpoint dictionaries with 'url' and 'expected_status'
        
    Returns:
        List of dictionaries with check results for each endpoint
    """
    # Create tasks for all endpoints
    tasks = [
        check_single_endpoint(endpoint['url'], endpoint['expected_status'])
        for endpoint in endpoints
    ]
    
    # Execute all checks concurrently
    results = await asyncio.gather(*tasks)
    
    # Convert results to dictionaries and merge with endpoint info
    output = []
    for endpoint, result in zip(endpoints, results):
        output.append({
            'id': endpoint['id'],
            'url': result.url,
            'name': endpoint['name'],
            'status': result.status,
            'response_time': result.response_time,
            'actual_status_code': result.actual_status_code,
            'error': result.error,
            'last_checked': result.timestamp.isoformat()
        })
    
    return output
