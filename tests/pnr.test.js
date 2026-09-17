const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const PnrNormalizer = require('../backend/src/providers/pnr/PnrNormalizer');
const MockPnrProvider = require('../backend/src/providers/pnr/MockPnrProvider');

describe('PNR Engine & Normalizer Tests', () => {
    test('maskPnr should properly mask 10-digit PNR', () => {
        const masked = PnrNormalizer.maskPnr('6223797269');
        assert.equal(masked, '******7269');
    });

    test('maskPnr should handle invalid inputs safely', () => {
        assert.equal(PnrNormalizer.maskPnr(''), '**********');
        assert.equal(PnrNormalizer.maskPnr('123'), '**********');
        assert.equal(PnrNormalizer.maskPnr(null), '**********');
    });

    test('MockPnrProvider should return structured PNR response', async () => {
        const provider = new MockPnrProvider();
        const result = await provider.checkStatus('6223797269');
        assert.ok(result.pnr);
        assert.ok(result.train_number);
        assert.ok(result.passengers && result.passengers.length > 0);
    });

    test('PnrNormalizer should normalize arbitrary raw IRCTC response shapes', () => {
        const raw = {
            data: {
                Pnr: '1234567890',
                TrainNo: '12951',
                TrainName: 'MUMBAI RAJDHANI',
                PassengerStatus: [
                    { Number: 1, BookingStatus: 'B1, 12, GN', CurrentStatus: 'CNF' }
                ]
            }
        };

        const normalized = PnrNormalizer.normalize(raw, 'test-provider');
        assert.equal(normalized.success, true);
        assert.equal(normalized.train.number, '12951');
        assert.equal(normalized.train.name, 'MUMBAI RAJDHANI');
        assert.equal(normalized.pnr_masked, '******7890');
    });
});
