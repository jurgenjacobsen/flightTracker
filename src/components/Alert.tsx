import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { styles, colors } from '../styles';

export type AlertProps = {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function Alert({
    visible,
    title = 'Alert',
    message,
    onClose,
    onConfirm,
    confirmText,
    cancelText,
}: AlertProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={alertStyles.backdrop}>
                <View style={alertStyles.container}>
                    {title && <Text style={alertStyles.title}>{title}</Text>}
                    <Text style={alertStyles.msg}>{message}</Text>
                    <View style={alertStyles.buttonRow}>
                        {onConfirm && (
                            <TouchableOpacity onPress={onConfirm} style={[styles.baseButton, alertStyles.button]}>
                                <Text style={styles.baseButtonText} >{confirmText}</Text>
                            </TouchableOpacity>
                        )}

                        { cancelText && (
                            <TouchableOpacity onPress={onClose} style={[styles.baseButton, alertStyles.button, {
                            backgroundColor: colors.RED,
                            borderColor: colors.RED_BORDER,
                            }]}>
                                <Text style={styles.baseButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
};

export const alertStyles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    container: {
        width: '90%',
        backgroundColor: colors.BG,
        borderRadius: 5,
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.TEXT,
        marginTop: 10,
        textAlign: 'center',
    },
    msg: {
        padding: 15,
        textAlign: 'center',
        color: colors.TEXT,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
});