import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import normalized data from SQL datasets
import { trainsData } from '../data/trains';
import { stationsData } from '../data/stations';
import { schedulesData } from '../data/schedules';
import { fleetData } from '../data/fleet';
import { telemetryNetworkData } from '../data/telemetry_network';
import { crowdTelemetryData } from '../data/crowd_telemetry';
import { alertsData } from '../data/alerts';

export const RailwayDataContext = createContext(null);

export const RailwayDataProvider = ({ children }) => {
  // State initialization with imported data
  const [trains, setTrains] = useState(trainsData);
  const [stations, setStations] = useState(stationsData);
  const [schedules, setSchedules] = useState(schedulesData);
  const [fleet, setFleet] = useState(fleetData);
  const [signals, setSignals] = useState(telemetryNetworkData);
  const [crowdData, setCrowdData] = useState(crowdTelemetryData);
  const [alerts, setAlerts] = useState(alertsData);
  const [logs, setLogs] = useState([]);

  // Telemetry simulation ticker (runs every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate slight speed fluctuations for moving trains
      setTrains(prevTrains => prevTrains.map(t => {
        if (t.status === 'ON TIME' || t.status === 'MINOR DELAY') {
          const speedDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2 km/h
          return { ...t, speed: Math.max(0, t.speed + speedDelta) };
        }
        return t;
      }));

      // Simulate crowd footprint fluctuations
      setCrowdData(prev => prev.map(c => {
        const footfallDelta = Math.floor(Math.random() * 21) - 10;
        return { ...c, footfall: Math.max(0, c.footfall + footfallDelta) };
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Updater actions
  const updateTrainStatus = useCallback((trainId, status, delay) => {
    setTrains(prev => prev.map(t => 
      t.train_id === trainId ? { ...t, status, delay_mins: delay } : t
    ));
    appendConsoleLog('INFO', `Train ${trainId} status updated to ${status} with ${delay}m delay`, 'Dispatcher');
  }, []);

  const assignPlatform = useCallback((trainId, stationCode, platformNo) => {
    setTrains(prev => prev.map(t => 
      t.train_id === trainId ? { ...t, platform_no: platformNo } : t
    ));
    appendConsoleLog('INFO', `Train ${trainId} assigned to Platform ${platformNo} at ${stationCode}`, 'Station Master');
  }, []);

  const setSignalAspect = useCallback((signalId, newAspect) => {
    setSignals(prev => prev.map(s => 
      s.signal_id === signalId ? { ...s, aspect: newAspect } : s
    ));
    appendConsoleLog('WARNING', `Signal ${signalId} aspect changed to ${newAspect}`, 'Network Operations');
  }, []);

  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => 
      a.alert_id === alertId ? { ...a, acknowledged: true } : a
    ));
    appendConsoleLog('INFO', `Alert ${alertId} acknowledged`, 'System Admin');
  }, []);

  const dispatchEmergencyOverride = useCallback((lineId, commandType) => {
    appendConsoleLog('CRITICAL', `Emergency Override [${commandType}] issued on line ${lineId}`, 'COMMANDER');
  }, []);

  const appendConsoleLog = useCallback((level, message, source) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message,
      source
    };
    setLogs(prev => [newLog, ...prev].slice(0, 500)); // Keep last 500 logs
  }, []);

  // Context payload
  const value = {
    // Data slices
    trains,
    stations,
    schedules,
    fleet,
    signals,
    crowdData,
    alerts,
    logs,
    
    // Actions
    updateTrainStatus,
    assignPlatform,
    setSignalAspect,
    acknowledgeAlert,
    dispatchEmergencyOverride,
    appendConsoleLog
  };

  return (
    <RailwayDataContext.Provider value={value}>
      {children}
    </RailwayDataContext.Provider>
  );
};

// Custom Hook
export const useRailwayData = () => useContext(RailwayDataContext);
