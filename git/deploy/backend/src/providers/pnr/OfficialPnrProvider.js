/**
 * OfficialPnrProvider — Authorized RapidAPI/IRCTC gateway adapter
 * Routes PNR queries through irctc1 RapidAPI endpoint
 */
const PnrProvider = require('./PnrProvider');

class OfficialPnrProvider extends PnrProvider {
    constructor() {
        super('OfficialPnrProvider');
        this.apiKey = process.env.RAPIDAPI_KEY || 'e0df59bc2emshe859fda1c0cd9a0p1e4ea3jsnd086f9a27969';
        this.apiHost = process.env.RAPIDAPI_HOST || 'irctc1.p.rapidapi.com';
        this.timeout = parseInt(process.env.PNR_TIMEOUT_MS) || 8000;
        this._circuitOpen = false;
        this._failCount = 0;
        this._maxFails = 4;
        this._circuitResetMs = 30000;
    }

    isAvailable() {
        return !!this.apiKey && !this._circuitOpen;
    }

    async checkStatus(pnr) {
        if (!this.isAvailable()) {
            throw new Error('Official PNR provider is not available');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        try {
            const url = `https://${this.apiHost}/api/v3/getPNRStatus?pnrNumber=${encodeURIComponent(pnr)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': this.apiHost
                },
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                this._recordFailure();
                throw new Error(`RapidAPI returned HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data) {
                throw new Error('Empty response from PNR service');
            }

            this._failCount = 0;
            return data;

        } catch (err) {
            clearTimeout(timeout);
            this._recordFailure();

            if (err.name === 'AbortError') {
                throw new Error('PNR API request timed out after ' + (this.timeout / 1000) + 's');
            }
            throw err;
        }
    }

    /**
     * Circuit breaker: open circuit after consecutive failures
     */
    _recordFailure() {
        this._failCount++;
        if (this._failCount >= this._maxFails) {
            this._circuitOpen = true;
            console.warn(`[PNR] Circuit breaker OPEN — ${this._maxFails} consecutive failures`);
            setTimeout(() => {
                this._circuitOpen = false;
                this._failCount = 0;
                console.log('[PNR] Circuit breaker RESET');
            }, this._circuitResetMs);
        }
    }
}

module.exports = OfficialPnrProvider;
