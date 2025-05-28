import { useState, useRef } from 'react';
import Geolocation, { GeoError, GeoCoordinates } from 'react-native-geolocation-service';
import BackgroundService from 'react-native-background-actions';

import { Vibration } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { checkPermissions } from './checkPermissions';
import { colors } from '../styles';

export interface Location extends GeoCoordinates {
  timestamp?: string;
}

export const useLocationMonitor = () => {
  const [position, setPosition] = useState<Location | null>(null);
  const [history, setHistory] = useState<Location[]>([]);
  const [isRecording, setRecordingStatus] = useState(false);

  const taskOptions = {
      taskName: 'FlightTracker Monitor',
      taskTitle: 'FlightTracker is running',
      taskDesc: 'Tracking your flight position',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: colors.BLUE,
      parameters: {
        delay: 2500,
      },
    }
    
  const task = async (taskData: any) => {
    const getCurrentPosition = () => new Promise<void>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos) => {
          let timestamp = new Date().toISOString();
          let postion: Location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude ? pos.coords.altitude * 3.28084 : null, // Convert meters to feet
            heading: pos.coords.heading,
            speed: pos.coords.speed ? pos.coords.speed * 1.94384 : null, // Convert m/s to kts
            altitudeAccuracy: pos.coords.altitudeAccuracy || null,
            timestamp: timestamp,
          };

          setPosition(postion);

          setHistory((prevHistory) => {
            return [...prevHistory, postion];
          });
          resolve();
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject();
        },
        {
          enableHighAccuracy: true,
          accuracy: {
            android: "high",
            ios: "best",
          },
          timeout: 15000,
          maximumAge: 2500,
          distanceFilter: 0,
          showLocationDialog: true,
        }
      );
    });

    await new Promise<void>((resolve) => {
      const intervalId =setInterval(async () => {
        if(!BackgroundService.isRunning()) {
          clearInterval(intervalId);
          resolve();
          return;
        };

        try {
          await getCurrentPosition();
          if(BackgroundService.isRunning()) await BackgroundService.updateNotification({
            taskDesc: 'Tracking position...',
          });
        } catch(err) {
          console.log('Error getting position:', err);
        }
      }, 2500);
    });

    
  }

  const startMonitoring = async () => {
    try {
      console.log('Trying to start background service');
      await checkPermissions();
      await BackgroundService.start(task, taskOptions);
      console.log('Background service started successfully!');
      setRecordingStatus(true);
      setHistory([]);

      Vibration.vibrate(50);
    } catch(err) {
      console.error('Error starting monitoring:', err);
    }
  }
  const stopMonitoring = async () => {
    try {
      console.log('Trying to stop background service');
      await BackgroundService.stop();
      console.log('Background service stopped successfully!');
      setRecordingStatus(false);
      Vibration.vibrate(50);
    } catch(err) {
      console.error('Error stopping monitoring:', err);
    }
  }
  const resetHistory = () => {
    setHistory([]);
    setPosition(null);
    setRecordingStatus(false);
  };

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

    await RNFS.writeFile(filePath, csvString, 'utf8').catch(console.error);

    await Share.open({
      url: `file://${filePath}`,
      type: 'text/csv',
      filename: fileName,
      failOnCancel: false,
    }).catch(console.error);

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
