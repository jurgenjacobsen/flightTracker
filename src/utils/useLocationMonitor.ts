import { useState, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation, {
  GeoPosition,
  GeoError,
  GeoCoordinates,
} from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export interface Location extends GeoCoordinates {
  timestamp?: string;
}

export const useLocationMonitor = () => {
  const [position, setPosition] = useState<Location | null>(null);
  const [history, setHistory] = useState<Location[]>([]);
  const [isRecording, setRecordingStatus] = useState(false);
  const watchId = useRef<number | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      const backgroundGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);

      return granted === PermissionsAndroid.RESULTS.GRANTED && backgroundGranted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      return result === RESULTS.GRANTED;
    }
  };

  const startMonitoring = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return false;

    setRecordingStatus(true);
    setHistory([]);

    Geolocation.getCurrentPosition((pos) => {

      setPosition({
        ...pos.coords,
        timestamp: new Date().toISOString(),
      });

    }, (err) => {
      console.log(err);
      return false;
    }, 
    {
        enableHighAccuracy: true,
        distanceFilter: 1,
        timeout: 15000,
    });

    watchId.current = Geolocation.watchPosition(
      (pos) => {
        setPosition({
          ...pos.coords,
          timestamp: new Date().toISOString(),
        });

        setHistory((prevHistory) => {
          const newHistory = [...prevHistory, {
            ...pos.coords,
            timestamp: new Date().toISOString(),
          }];
          return newHistory;
        });
      },
      (err: GeoError) => console.error('Location Error:', err),
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 5000,
        fastestInterval: 2500,
      }
    );

    return true;
  };

  const stopMonitoring = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setRecordingStatus(false);
    }
  };

  const resetHistory = () => {
    setHistory([]);
    setPosition(null);
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setRecordingStatus(false);
  }

  const exportHistory = async () => {
    if (history.length === 0 || !position || isRecording) {
      console.warn('No location history to export. Or monitoring is still active.');
      return null;
    }

    const csvHeader = 'latitude,longitude,accuracy,altitude,heading,speed,altitudeAccuracy,timestamp';
    const csvRows = history.map(loc => 
      `${loc.latitude},${loc.longitude},${loc.accuracy},${loc.altitude || ''},${loc.heading || ''},${loc.speed || ''},${loc.altitudeAccuracy || ''},${loc.timestamp}`
    );
    const csvString = [csvHeader, ...csvRows].join('\n');

    const time = new Date().getTime();
    const fileName = `FlightRecord_${time}.csv`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, csvString, 'utf8').catch((error) => {
      return console.error('Error writing file:', error);
    });

    await Share.open({
      url: `file://${filePath}`,
      type: 'text/csv',
      filename: fileName,
      failOnCancel: false,
    }).catch((error) => {
      return console.error('Error sharing file:', error);
    });

    return true;
  }

  return {
    position,
    startMonitoring,
    stopMonitoring,
    resetHistory,
    history,
    isRecording,
    exportHistory
  };
};