/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { checkPermissions, useLocationMonitor, calc } from './utils/index';
import { colors, styles } from './styles';

function App(): React.JSX.Element {
  const { position, startMonitoring, stopMonitoring, resetHistory, history, isRecording, exportHistory } = useLocationMonitor();

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerAppSubtitle}>
            Welcome to
          </Text>
          <Text style={{}}>
            <Text style={{...styles.headerAppTitle}}>FlownRecords</Text>
            <Text style={{...styles.headerAppTitle, color: colors.TEXT_LIGHT}}> Tracker</Text>
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoChild}>
              <Text style={styles.infoChildText}>Latitude</Text>
              <Text style={styles.infoChildValue}>{position?.latitude ? calc.formatCoord(position.latitude, position.longitude, 'LAT') : ' '}</Text>
            </View>
            <View style={styles.infoChild}>
              <Text style={styles.infoChildText}>Longitude</Text>
              <Text style={styles.infoChildValue}>{position?.longitude ? calc.formatCoord(position.latitude, position.longitude, 'LON') : ' '}</Text>
            </View>
            <View style={styles.infoChild}>
              <Text style={styles.infoChildText}>Altitude</Text>
              <Text style={styles.infoChildValue}>
              {position?.altitude ? (
                <>
                  {position.altitude.toFixed(0)}
                  <Text style={{ color: colors.TEXT_LIGHT }}>ft</Text>
                </>
              ) : (
                ' '
              )}
            </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoChild}>
              <Text style={styles.infoChildText}>Speed</Text>
              <Text style={styles.infoChildValue}>
                {position?.speed ? (
                  <>
                    {calc.speedMsToKt(position.speed ?? 0).toFixed(0)}
                    <Text style={{ color: colors.TEXT_LIGHT }}>kt</Text>
                  </>
                ) : (
                  ' '
                )}
              </Text>
            </View>
            <View style={styles.infoChild}>
              <Text style={styles.infoChildText}>Heading</Text>
              <Text style={styles.infoChildValue}>
                {history.length > 1 ? 
                calc.calculateTrack(history[1].latitude, history[1].longitude, history[0].latitude, history[0].longitude) : ' ' }
              </Text>
            </View>
            <View style={styles.infoChild}>
              <Text style={styles.infoChildText}>Last update</Text>
              <Text style={styles.infoChildValue}>{position?.timestamp ? calc.formatTimeFromISO(position.timestamp) : ' '}</Text>
            </View>
          </View>
              
          <View style={styles.infoRow}>
            <View style={{...styles.infoChild, width: '45%'}}>
              <Text style={styles.infoChildText}>Position Accuracy</Text>
              <Text style={styles.infoChildValue}>{position?.accuracy.toFixed(0)}</Text>
            </View>
            <View style={{...styles.infoChild, width: '45%'}}>
              <Text style={styles.infoChildText}>Altitude Accuracy</Text>
              <Text style={styles.infoChildValue}>{position?.altitudeAccuracy?.toFixed(0) || ' '}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={startMonitoring} 
            disabled={isRecording} 
            style={{...styles.baseButton, backgroundColor: colors.BLUE, borderColor: colors.BLUE_BORDER, width: '42.5%', marginRight: '5%', opacity: isRecording ? 0.5 : 1 }}>
            <Text style={{...styles.baseButtonText}}>Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={stopMonitoring} 
            disabled={!isRecording} 
            style={{...styles.baseButton, backgroundColor: colors.RED, borderColor: colors.RED_BORDER, width: '42.5%', opacity: !isRecording ? 0.5 : 1 }}>
            <Text style={{...styles.baseButtonText}}>Stop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyHeaderChild}>Position</Text>
            <Text style={styles.historyHeaderChild}>Altitude</Text>
            <Text style={styles.historyHeaderChild}>Speed</Text>
            <Text style={styles.historyHeaderChild}>Time</Text>
          </View>

          {history.length > 0 ? (
              history.sort((a, b) => (new Date(b.timestamp  ?? '').getTime()) - (new Date(a.timestamp  ?? '').getTime())).map((l, index) => (
                <View key={index} style={styles.historyContent}>
                  <Text style={styles.historyContentChild}>{calc.formatCoord(l.latitude, l.longitude)}</Text>
                  <Text style={styles.historyContentChild}>{l.altitude ? l.altitude.toFixed(0) : 'N/A'}<Text style={{color: colors.TEXT_LIGHT}}>ft</Text></Text>
                  <Text style={styles.historyContentChild}>{l.speed ? calc.speedMsToKt(l.speed ?? 0).toFixed(0) : 'N/A'}<Text style={{color: colors.TEXT_LIGHT}}>kt</Text></Text>
                  <Text style={styles.historyContentChild}>{calc.formatTimeFromISO(l.timestamp ?? '')}</Text>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.historyContentWarn}>
                  No history available
                </Text>
              </View>
            )}

        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={exportHistory} 
            disabled={(isRecording || history.length === 0)} 
            style={{...styles.baseButton, marginRight: '2%', width: '29%', opacity: (isRecording || history.length === 0) ? 0.5 : 1 }}>
            <Text style={{...styles.baseButtonText}}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={resetHistory} 
            disabled={(isRecording || history.length === 0)} 
            style={{...styles.baseButton, marginRight: '2%', width: '29%', opacity: (isRecording || history.length === 0) ? 0.5 : 1 }}>
            <Text style={{...styles.baseButtonText}}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={() => {}} 
          style={{...styles.baseButton, width: '28%'}}>
            <Text style={{...styles.baseButtonText}}>Login</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;