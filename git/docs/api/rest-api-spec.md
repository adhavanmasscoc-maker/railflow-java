# RailFlow — REST API Reference & Specification

## Base URL
`http://localhost:8080/api`

---

### Dashboard Endpoints
#### `GET /api/dashboard/stats`
Returns aggregated station statistics including total platforms, active crowd count, occupancy rates, train delay counts, and 12-hour historical trend points.

---

### Platform Endpoints
#### `GET /api/platforms`
Returns all station platforms with real-time crowd metrics and gate counts.

#### `GET /api/platforms/{id}`
Returns details for a single platform by ID (e.g. `PLT-001`).

#### `GET /api/platforms/critical`
Returns platforms with occupancy $\ge 90\%$ (CRITICAL) or $\ge 70\%$ (WARNING).

#### `GET /api/platforms/recommendations`
Returns active algorithmic crowd redistribution and gate expansion recommendations.

#### `POST /api/platforms/recommendations/{id}/apply`
Executes the specified recommendation.

#### `PUT /api/platforms/{id}/crowd`
**Request Body**:
```json
{
  "crowd": 420
}
```
Updates platform crowd count and recalculates occupancy status.

---

### Train Endpoints
#### `GET /api/trains`
Returns all tracked trains.

#### `GET /api/trains/arriving?minutes=15`
Returns trains arriving within specified minutes.

#### `GET /api/trains/delayed`
Returns trains with non-zero delay minutes.

#### `GET /api/trains/search?query=Rajdhani`
Searches trains using Linear/Binary search DSA.

#### `PUT /api/trains/{id}/delay`
**Request Body**:
```json
{
  "delayMinutes": 25
}
```

---

### Alert Endpoints
#### `GET /api/alerts`
Returns all active prioritized alerts.

#### `POST /api/alerts/{id}/acknowledge`
Marks alert as acknowledged by operator.

#### `POST /api/alerts/{id}/dismiss`
Resolves and dismisses alert.
