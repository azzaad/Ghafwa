// src/ui/components/ImportButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Theme } from '../theme';

interface Props {
  onImportSuccess: (data: any) => void;
}

export const ImportButton: React.FC<Props> = ({ onImportSuccess }) => {
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // في Expo Go، سنقوم بمحاكاة التحليل حالياً أو استخدام API خارجي
        // لأن قراءة محتوى الـ PDF مباشرة تتطلب مكتبات Native ثقيلة
        console.log('تم اختيار الملف:', result.assets[0].name);
        onImportSuccess({ fajr: "05:15", isha: "19:30" }); // بيانات تجريبية
      }
    } catch (err) {
      console.error('خطأ في اختيار الملف:', err);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handlePickDocument}
    >
      <Text style={styles.text}>استيراد جدول صلاة صلالة (PDF)</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.night.accent,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  text: { color: '#0F172A', fontWeight: 'bold' }
});