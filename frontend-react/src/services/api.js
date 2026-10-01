// Unified API proxy client for RailwaySystem

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
};

export const api = {
  // Java Spring/Servlet Endpoints (Proxied to 8080 or Mocked)
  getTrains: () => fetch('/api/trains').then(handleResponse),
  getStations: () => fetch('/api/stations').then(handleResponse),
  getPlatforms: () => fetch('/api/platforms').then(handleResponse),

  // Node PNR Provider Fallback
  getPnr: (pnr) => fetch(`/api/pnr/${pnr}`).then(handleResponse),

  // Gemini Dispatch Assistant (POST only)
  askAi: (query) => fetch('/api/ask-railflow-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  }).then(handleResponse),

  // Atlas Telemetry Proxy
  getTelemetry: () => fetch('/api/atlas-proxy').then(handleResponse)
};
