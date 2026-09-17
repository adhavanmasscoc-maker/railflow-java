const axios = require('axios');
const { statements } = require('../repositories/db');

// Circuit breaker state
let circuitOpen = false;
let lastFailureTime = null;
const CIRCUIT_TIMEOUT = 30000; // 30s

class PNRNormalizer {
    static mask(data) {
        return {
            ...data,
            passenger_names: data.passengers?.map(p => p.name[0] + '*'.repeat(p.name.length - 1)),
            mobile: data.mobile ? data.mobile.replace(/.(?=.{4})/g, '*') : null
        };
    }
}

async function fetchFromOfficialApi(pnr) {
    if (!process.env.RAPID_API_KEY) throw new Error("No API Key");
    if (circuitOpen && (Date.now() - lastFailureTime < CIRCUIT_TIMEOUT)) {
        throw new Error("Circuit Open");
    }
    
    try {
        const response = await axios.get(`https://irctc-api.rapidapi.com/pnr/${pnr}`, {
            headers: { 'X-RapidAPI-Key': process.env.RAPID_API_KEY },
            timeout: 5000
        });
        // Reset circuit on success
        circuitOpen = false;
        return response.data;
    } catch (error) {
        circuitOpen = true;
        lastFailureTime = Date.now();
        throw new Error("API Failure");
    }
}

async function getPnrStatus(pnr) {
    try {
        const rawData = await fetchFromOfficialApi(pnr);
        return PNRNormalizer.mask(rawData);
    } catch (error) {
        // Fallback to Mock/Local DB
        console.warn(`[PNR Strategy] Official API failed/unavailable. Falling back to Mock DB for PNR: ${pnr}`);
        const localData = statements.getPnr.get(pnr);
        if (localData) {
            return PNRNormalizer.mask({ ...localData, passengers: [{name: "JOHN DOE"}] });
        }
        
        // Final ultimate mock response if DB empty
        return PNRNormalizer.mask({
            pnr_number: pnr, current_status: "CNF",
            passengers: [{name: "MOCK PASSENGER"}],
            mobile: "9876543210", is_mock: true
        });
    }
}

module.exports = { getPnrStatus };
