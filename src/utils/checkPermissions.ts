import { Alert, Platform } from 'react-native';
import { PermissionsAndroid, Linking } from 'react-native';
// @ts-ignore
import { BatteryOptEnabled, OpenOptimizationSettings } from "react-native-battery-optimization-check";
import { AlertService } from './AlertService';

export async function checkBatteryOptimization() {
    try {
        let isEnabled = await BatteryOptEnabled();
        return isEnabled && Platform.OS === 'android';
    } catch (error) {
        console.error('Error checking battery optimization:', error);
    }
}

export async function checkDeviceSetup() {
    try {
        const batteryIsOpt = await checkBatteryOptimization();
        if(batteryIsOpt) {
            AlertService.show({
                title: 'Battery Optimization',
                message: 'If battery optimization is enabled, the app will not function properly when running in the background.',
                confirmText: 'Open Settings',
                cancelText: 'Ok',
                onConfirm: () => OpenOptimizationSettings()
            })
        }

        const permissionsGranted = await checkPermissions();
        if (!permissionsGranted) {
            AlertService.show({
                title: 'Permissions Required',
                message: 'The app requires location and notification permissions to function properly. Please grant the necessary permissions.',
                confirmText: 'Open Settings',
                cancelText: 'Ok',
                onConfirm: () => {
                    Linking.openSettings().catch(err => console.error('Failed to open settings:', err));
                }
            });
            return false;
        } 
        
    } catch(e) {
        console.error('Error checking device setup:', e);
    }
}

export async function checkPermissions() {
    try {

        const permissions = [
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const locationGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
        const coarseLocationGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
        const backgroundLocationGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
        const notificationsGranted = granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED;

        if (locationGranted && coarseLocationGranted && backgroundLocationGranted && notificationsGranted) {
            console.log('All requested permissions granted');
            return true;
        } else {            
            return false;
        }
    } catch (err) {
        console.warn('Permission request error:', err);
        return false;
    }
}