import { useState, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation, {
  GeoPosition,
  GeoError,
  GeoCoordinates,
} from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

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
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
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

  return {
    position,
    startMonitoring,
    stopMonitoring,
    resetHistory,
    history,
    isRecording,
  };
};