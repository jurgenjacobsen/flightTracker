import { Alert } from 'react-native';
import PermissionManager from 'react-native-permissions';

export function checkPermissions() {
    try {
        PermissionManager.checkMultiple([
            PermissionManager.PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            PermissionManager.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PermissionManager.PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]).then((statuses) => {
            if(
            statuses[PermissionManager.PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] !== 'granted' ||
            statuses[PermissionManager.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== 'granted' ||
            statuses[PermissionManager.PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !== 'granted'
            ) {
            PermissionManager.requestMultiple([
                PermissionManager.PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
                PermissionManager.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                PermissionManager.PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            ]).then((requestStatuses) => {
                if (
                requestStatuses[PermissionManager.PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] !== 'granted' ||
                requestStatuses[PermissionManager.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] !== 'granted' ||
                requestStatuses[PermissionManager.PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] !== 'granted'
                ) {
                
                Alert.alert(
                    'Location Permissions Required',
                    'This app requires location permissions to function properly. Please enable them in settings.',
                    [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Open Settings',
                        onPress: () => PermissionManager.openSettings().then(() => {
                        console.log('Permissions granted:', requestStatuses);
                        }).catch((error) => {
                        console.error('Error checking notifications permission:', error);
                        }),
                    },
                    ],
                    { cancelable: false }
                );

                } else {
                console.log('Location permissions granted:', requestStatuses);
                }
            });
            }
        });
    } catch(err) {
        console.error('Error checking permissions:', err);
    }
}