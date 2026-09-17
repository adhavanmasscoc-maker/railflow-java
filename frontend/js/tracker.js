/**
 * RailFlow Telemetry & Feedback Event Tracker (tracker.js)
 * Manages background telemetry events, performance hits, and user feedback intake.
 * Keeps telemetry counters and metrics discreetly buffered without cluttering UI viewport.
 */

(function (window) {
    'use strict';

    const STORAGE_KEY_TELEMETRY = 'railflow_telemetry_events';
    const STORAGE_KEY_FEEDBACK = 'railflow_user_feedback';
    const MAX_BUFFER_SIZE = 100;

    class RailTracker {
        constructor() {
            this.telemetryBuffer = this._loadInitial(STORAGE_KEY_TELEMETRY);
            this.feedbackBuffer = this._loadInitial(STORAGE_KEY_FEEDBACK);
            this.hitCounter = this.telemetryBuffer.length;
            this.silentMode = true; // Raw hits are kept hidden from main UI view
            this.listeners = [];

            // Initialize global state
            console.log(`[RailTracker] Initialized. Buffered hits: ${this.hitCounter} (UI telemetry display hidden)`);
        }

        _loadInitial(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        }

        _persist(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data.slice(-MAX_BUFFER_SIZE)));
            } catch (e) {
                // Ignore storage quota limits gracefully
            }
        }

        /**
         * Ingests a live station or train telemetry hit.
         * Runs quietly in the background without UI banner spam.
         *
         * @param {Object} eventData Telemetry payload (density, chokepoint, reallocation, surge)
         */
        trackTelemetry(eventData) {
            const entry = {
                id: 'telem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                timestamp: new Date().toISOString(),
                payload: eventData
            };

            this.telemetryBuffer.push(entry);
            this.hitCounter++;

            if (this.telemetryBuffer.length > MAX_BUFFER_SIZE) {
                this.telemetryBuffer.shift();
            }

            this._persist(STORAGE_KEY_TELEMETRY, this.telemetryBuffer);
            this._notifyListeners('telemetry', entry);

            // Forward to optional backend tracker endpoint asynchronously
            this._dispatchTelemetryNetwork(entry);

            return entry;
        }

        /**
         * Ingests passenger or operator feedback.
         *
         * @param {Object} feedbackData Form submission payload
         */
        trackFeedback(feedbackData) {
            const entry = {
                id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                timestamp: new Date().toISOString(),
                ...feedbackData
            };

            this.feedbackBuffer.push(entry);
            if (this.feedbackBuffer.length > MAX_BUFFER_SIZE) {
                this.feedbackBuffer.shift();
            }

            this._persist(STORAGE_KEY_FEEDBACK, this.feedbackBuffer);
            this._notifyListeners('feedback', entry);

            // Log event quietly
            console.log('[RailTracker] Feedback logged:', entry.id, entry.category || 'General');
            return entry;
        }

        /**
         * Asynchronously sends telemetry hits to backend when available.
         */
        async _dispatchTelemetryNetwork(entry) {
            try {
                if (window.fetch && window.location.protocol.startsWith('http')) {
                    const apiEndpoint = (window.CONFIG && window.CONFIG.API_BASE)
                        ? `${window.CONFIG.API_BASE}/telemetry/track`
                        : '/api/telemetry/track';

                    await fetch(apiEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(entry),
                        keepalive: true
                    }).catch(() => {
                        // Silent failover to offline buffer
                    });
                }
            } catch (err) {
                // Suppress network errors in static offline mode
            }
        }

        addListener(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        }

        _notifyListeners(type, data) {
            this.listeners.forEach(fn => {
                try {
                    fn(type, data);
                } catch (e) {}
            });
        }

        getTelemetryLog() {
            return [...this.telemetryBuffer];
        }

        getFeedbackLog() {
            return [...this.feedbackBuffer];
        }

        getHitCount() {
            return this.hitCounter;
        }

        trackVoiceDispatch(message) {
            return this.trackTelemetry({
                eventType: 'VOICE_DISPATCH',
                message: message,
                timestamp: new Date().toISOString()
            });
        }

        trackDecision(decisionData) {
            return this.trackTelemetry({
                eventType: 'HEURISTIC_REALLOCATION_DECISION',
                ...decisionData,
                timestamp: new Date().toISOString()
            });
        }

        clear() {
            this.telemetryBuffer = [];
            this.feedbackBuffer = [];
            this.hitCounter = 0;
            localStorage.removeItem(STORAGE_KEY_TELEMETRY);
            localStorage.removeItem(STORAGE_KEY_FEEDBACK);
            console.log('[RailTracker] Buffers cleared.');
        }
    }

    // Expose singleton instance globally
    window.RailTracker = new RailTracker();

})(window);
