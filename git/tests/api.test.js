const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const StationRepository = require('../backend/src/repositories/StationRepository');
const TrainRepository = require('../backend/src/repositories/TrainRepository');
const AnalyticsRepository = require('../backend/src/repositories/AnalyticsRepository');
const FeedbackRepository = require('../backend/src/repositories/FeedbackRepository');

describe('Repository & Domain Service Tests', () => {
    test('StationRepository.search() should find New Delhi by query NDLS', () => {
        const results = StationRepository.search('NDLS');
        assert.ok(results.length > 0);
        assert.equal(results[0].code, 'NDLS');
    });

    test('StationRepository.findByCode() should return station record', () => {
        const station = StationRepository.findByCode('NDLS');
        assert.ok(station);
        assert.equal(station.code, 'NDLS');
    });

    test('TrainRepository.search() should find trains by name or number', () => {
        const results = TrainRepository.search('Rajdhani');
        assert.ok(results.length > 0);
        assert.ok(results.some(t => t.name.toLowerCase().includes('rajdhani')));
    });

    test('AnalyticsRepository.findHistorical() should return 40-year records with pagination', () => {
        const records = AnalyticsRepository.findHistorical({ limit: 10, offset: 0 });
        assert.ok(records.length > 0);
        const count = AnalyticsRepository.countHistorical();
        assert.ok(count >= 3500);
    });

    test('FeedbackRepository.create() should persist feedback into SQLite and calculate stats', () => {
        const feedback = FeedbackRepository.create({
            rating: 5,
            category: 'UI/UX',
            sentiment: 'Positive',
            quick_tags: ['Fast Search', 'Real-time Updates'],
            journey_rating: 5,
            feature_request: 'Testing SQLite feedback integration from unit test suite',
            source_view: 'Database Inspector'
        });

        assert.ok(feedback.id);
        assert.equal(feedback.rating, 5);

        const stats = FeedbackRepository.getStats();
        assert.ok(stats.total > 0);
        assert.ok(stats.avg_rating >= 1 && stats.avg_rating <= 5);
    });
});
