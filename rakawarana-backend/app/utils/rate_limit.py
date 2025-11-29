import time
from collections import defaultdict, deque
from typing import Deque

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class SlidingWindowLimiter:
    """In-memory sliding window rate limiter keyed by client IP."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._events: dict[str, Deque[float]] = defaultdict(deque)

    def allow(self, key: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        events = self._events[key]

        # Drop timestamps outside the current window
        while events and events[0] < window_start:
            events.popleft()

        if len(events) >= self.max_requests:
            return False

        events.append(now)
        return True


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Apply a simple per-IP sliding window rate limit."""

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.limiter = SlidingWindowLimiter(max_requests, window_seconds)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"

        if not self.limiter.allow(client_ip):
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "details": {"retry_after_seconds": self.limiter.window_seconds},
                },
            )

        return await call_next(request)
