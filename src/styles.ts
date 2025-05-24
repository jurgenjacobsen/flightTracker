import { StyleSheet } from "react-native";

export const colors = {
    BG: '#1E1E1E',
    TEXT: '#FFF',
    TEXT_LIGHT: 'rgba(255, 255, 255, 0.5)',
    SECONDARY: '#191919',
    BLUE: '#313ED8',
    BLUE_BORDER: 'rgba(49, 62, 216, 0.25)',
    RED: '#DD3434',
    RED_BORDER: 'rgba(221, 52, 52, 0.25)',
    BORDER: 'rgba(255, 255, 255, 0.25)',
    
}

export const styles = StyleSheet.create({
    appContainer: {
        alignItems: 'center',
        backgroundColor: colors.BG,
        color: colors.TEXT,
        fontFamily: 'Inter',
        flex: 1,
        padding: '5%',
    },
    headerContainer: {
        marginTop: '5%',
    },
    headerAppSubtitle: {
        fontSize: 16,
        color: colors.TEXT,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        opacity: 0.75,
    },
    headerAppTitle: {
        fontSize: 28,
        color: colors.TEXT,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
    },
    baseButton: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER,
        backgroundColor: colors.SECONDARY,
        textAlign: 'center',
    },
    baseButtonText: {
        color: '#FFF',
        fontFamily: 'Inter',
        fontSize: 16,
        textAlign: 'center',
    },
    mapContainer: {
        marginTop: '5%',
        borderRadius: 5,
        width: '90%',
        height: '40%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.BORDER,
        backgroundColor: colors.SECONDARY,
        alignContent: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    historyContainer: {
        width: '90%',
        height: '20%',
        borderRadius: 5,
        backgroundColor: colors.SECONDARY,
        borderColor: colors.BORDER,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 10,
    },
    historyHeader: {
        paddingBottom: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    historyHeaderChild: {
        color: colors.TEXT,
        opacity: 0.25,
        fontFamily: 'Inter',
        fontSize: 14,
        width: '22.5%',
    },
    historyContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 5,
    },
    historyContentChild: {
        color: colors.TEXT,
        fontFamily: 'Inter',
        fontSize: 10,
        width: '22.5%',
        
    },
});