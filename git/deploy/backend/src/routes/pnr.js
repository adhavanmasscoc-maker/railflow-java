/**
 * PNR Check API Endpoint — Real IRCTC RapidAPI Integration
 */
const OfficialPnrProvider = require('../providers/pnr/OfficialPnrProvider');
const PnrNormalizer = require('../providers/pnr/PnrNormalizer');
const { getDatabase } = require('../../database/db');

const officialProvider = new OfficialPnrProvider();

/**
 * POST /api/pnr/check
 * Body: { pnr: "1234567890" }
 */
exports.check = async (req, res, next) => {
    try {
        const { pnr } = req.body;

        // Strict 10-digit numeric validation
        if (!pnr || !/^\d{10}$/.test(pnr)) {
            return res.status(400).json({
                success: false,
                type: 'about:blank',
                title: 'Bad Request',
                status: 400,
                detail: 'SYSTEM HALTED: PNR must be exactly 10 numeric digits.'
            });
        }

        try {
            const rawResponse = await officialProvider.checkStatus(pnr);
            const normalized = PnrNormalizer.normalize(rawResponse, 'official (RapidAPI irctc1)');

            // Audit log (masked PNR only)
            try {
                const db = getDatabase();
                const ipHash = require('crypto')
                    .createHash('sha256')
                    .update(req.ip || 'unknown')
                    .digest('hex')
                    .substring(0, 16);

                db.prepare('INSERT INTO pnr_queries (pnr_masked, status, provider, ip_hash) VALUES (?, ?, ?, ?)')
                    .run(normalized.pnr_masked, normalized.success ? 'success' : 'error', 'official', ipHash);
            } catch (logErr) {
                // Ignore audit log error if db is read-only
            }

            return res.json(normalized);

        } catch (apiErr) {
            console.warn(`[PNR] Live API query failed for ${pnr}:`, apiErr.message);
            return res.status(200).json({
                success: false,
                pnr_masked: PnrNormalizer.maskPnr(pnr),
                error: apiErr.message || 'API EXCEPTION: PNR NOT FOUND OR FLUSHED',
                provider: 'official (RapidAPI irctc1)'
            });
        }

    } catch (err) {
        next(err);
    }
};
