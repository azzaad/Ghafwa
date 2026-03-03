// src/ui/components/WidgetUI.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'; // إضافة Image و TouchableOpacity
import { Theme } from '../theme';

interface WidgetProps {
  wakeUpTime: string;
  fajrTime: string;
  isNightMode: boolean;
  onAlarmPress?: () => void; // دالة الضغط الجديدة
}

export const WidgetUI: React.FC<WidgetProps> = ({ wakeUpTime, fajrTime, isNightMode, onAlarmPress }) => {
  const activeTheme = isNightMode ? Theme.night : Theme.day;

  return (
    <View style={[styles.widgetContainer, { backgroundColor: activeTheme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.subLabel, { color: activeTheme.textSecondary }]}>
          الاستيقاظ القادم
        </Text>
        
        {/* صف الوقت وزر الجرس */}
        <View style={styles.timeRow}>
          <Text style={[styles.mainTime, { color: activeTheme.accent }]}>
            {wakeUpTime}
          </Text>
          
          {/* زر الجرس التفاعلي */}
          <TouchableOpacity onPress={onAlarmPress} style={styles.alarmButton}>
            {/* سنستخدم رمز نصي 🔔 مؤقتاً لعدم تعقيد الأيقونات في الويدجيت */}
            <Text style={{ fontSize: 24 }}>🔔</Text> 
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: activeTheme.textSecondary, opacity: 0.2 }]} />
        <Text style={[styles.fajrLabel, { color: activeTheme.textSecondary }]}>
          فجر ريسوت: {fajrTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row', // ترتيب أفقي للوقت والجرس
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // مسافة بينهما
  },
  mainTime: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
  },
  alarmButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  divider: {
    height: 1,
    width: '60%',
    marginVertical: 8,
  },
  fajrLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});