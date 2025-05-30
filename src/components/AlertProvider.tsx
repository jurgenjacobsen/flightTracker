// components/AlertProvider.tsx
import React, { useState, useEffect } from 'react';
import { Alert } from './Alert';
import { setAlertHandler } from '../utils/AlertService';

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [props, setProps] = useState<any>({});

  useEffect(() => {
    setAlertHandler((newProps) => {
      setProps(newProps);
      setVisible(true);
    });
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <>
      {children}
      <Alert
        visible={visible}
        title={props.title}
        message={props.message}
        onConfirm={() => {
          if (props.onConfirm) props.onConfirm();
          handleClose();
        }}
        onClose={handleClose}
        confirmText={props.confirmText}
        cancelText={props.cancelText}
      />
    </>
  );
}