import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Button } from './Button';
import { colors } from '../../theme/colors';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Bekräfta',
  cancelText = 'Avbryt',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const headerBg = variant === 'danger' ? colors.red : colors.blue;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onCancel} />
        <View style={styles.content}>
          <Card style={styles.card}>
            <CardHeader style={{ backgroundColor: headerBg }}>
              <Text style={styles.title}>{title}</Text>
            </CardHeader>
            <CardBody>
              <Text style={styles.message}>{message}</Text>
            </CardBody>
            <CardFooter style={styles.footer}>
              <Button variant="outline" onPress={onCancel} style={styles.btn}>
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onPress={onConfirm}
                style={styles.btn}
              >
                {confirmText}
              </Button>
            </CardFooter>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: { width: '100%', maxWidth: 400 },
  card: { overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: '700', color: colors.white },
  message: { fontSize: 16, color: colors.gray700 },
  footer: { flexWrap: 'wrap', justifyContent: 'flex-end' },
  btn: { minWidth: 80 },
});
