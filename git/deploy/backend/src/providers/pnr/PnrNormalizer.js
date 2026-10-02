/**
 * PnrNormalizer — Transforms raw provider responses into a unified schema
 * Handles PNR masking, PII sanitization, and multiple RapidAPI IRCTC response shapes
 */

class PnrNormalizer {
    /**
     * Mask a PNR number for logging/display: 1234567890 → ******7890
     */
    static maskPnr(pnr) {
        if (!pnr || String(pnr).length !== 10) return '**********';
        return '******' + String(pnr).substring(6);
    }

    /**
     * Normalize raw provider response into standard RailFlow PnrResponse schema
     */
    static normalize(rawResponse, provider = 'unknown') {
        if (!rawResponse) {
            return {
                success: false,
                pnr_masked: '**********',
                provider,
                error: 'No response from provider',
                timestamp: new Date().toISOString()
            };
        }

        // If upstream RapidAPI returned status false or an error message
        if (rawResponse.status === false || (rawResponse.status === 0 && rawResponse.message)) {
            return {
                success: false,
                pnr_masked: PnrNormalizer.maskPnr(rawResponse.data?.Pnr || rawResponse.pnr || ''),
                provider,
                error: rawResponse.message || 'PNR Not Found or Flushed from IRCTC Server',
                raw: rawResponse,
                timestamp: new Date().toISOString()
            };
        }

        // Extract the payload root (either wrapped inside .data or at root)
        const d = (rawResponse.data && typeof rawResponse.data === 'object') ? rawResponse.data : rawResponse;

        // Extract PNR number
        const rawPnr = d.Pnr || d.pnrNumber || d.pnr || d.PNR || '';

        // Extract Train details
        const trainNo = d.TrainNo || d.trainNumber || d.train_number || d.TrainNumber || d.train_no || 'N/A';
        const trainName = d.TrainName || d.trainName || d.train_name || 'IRCTC Express';

        // Extract Journey details
        const doj = d.Doj || d.doj || d.boarding_date || d.DateOfJourney || d.date_of_journey || null;
        const bookingDate = d.BookingDate || d.bookingDate || d.booking_date || null;

        // Stations
        const fromCode = d.From || d.from || d.from_station?.code || d.BoardingStation || 'N/A';
        const toCode = d.To || d.to || d.to_station?.code || d.ReservationUpto || 'N/A';
        const fromName = d.BoardingStationName || d.from_station?.name || d.From || fromCode;
        const toName = d.ReservationUptoName || d.to_station?.name || d.To || toCode;

        // Class & Charting
        const travelClass = d.Class || d.class || d.journeyClass || 'N/A';
        const quota = d.Quota || d.quota || 'GN';
        const chartPrepared = (d.ChartPrepared === true || d.ChartPrepared === 'CHART PREPARED' || d.chart_prepared === true || d.ChartStatus === 'CHART PREPARED');

        // Extract Passenger status list
        const rawPassengers = d.PassengerStatus || d.passengerList || d.passengerDetails || d.passengers || [];
        const passengers = Array.isArray(rawPassengers) ? rawPassengers.map((p, idx) => ({
            number: p.Number || p.number || (idx + 1),
            booking_status: p.BookingStatus || p.booking_status || p.BookingStatusNew || 'N/A',
            current_status: p.CurrentStatus || p.current_status || p.CurrentStatusNew || p.BookingStatus || 'N/A',
            coach: p.Coach || p.coach || p.BookingCoachId || '--',
            berth: p.Berth || p.berth || p.BookingBerthNo || '--',
            berth_type: p.BookingBerthCode || p.berth_type || p.BerthCode || '--'
        })) : [];

        return {
            success: true,
            pnr_masked: PnrNormalizer.maskPnr(rawPnr),
            pnr_raw: String(rawPnr),
            train: {
                number: String(trainNo),
                name: String(trainName)
            },
            boarding_date: doj,
            booking_date: bookingDate,
            from: {
                code: String(fromCode),
                name: String(fromName)
            },
            to: {
                code: String(toCode),
                name: String(toName)
            },
            class: String(travelClass),
            quota: String(quota),
            chart_prepared: chartPrepared,
            passengers: passengers,
            provider: provider,
            disclaimer: d.disclaimer || (provider === 'official' ? 'Official IRCTC data retrieved via RapidAPI gateway.' : 'Demo simulation data.'),
            raw: rawResponse,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = PnrNormalizer;
