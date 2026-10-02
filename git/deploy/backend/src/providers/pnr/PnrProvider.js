/**
 * PnrProvider — Base provider interface for PNR status lookups
 * All providers must implement the `checkStatus(pnr)` method
 */
class PnrProvider {
    constructor(name) {
        this.name = name;
    }

    /**
     * Check PNR status
     * @param {string} pnr - 10-digit PNR number
     * @returns {Promise<object>} Raw PNR response from provider
     */
    async checkStatus(pnr) {
        throw new Error(`${this.name}: checkStatus() not implemented`);
    }

    /**
     * Check if provider is available/configured
     * @returns {boolean}
     */
    isAvailable() {
        return false;
    }
}

module.exports = PnrProvider;
