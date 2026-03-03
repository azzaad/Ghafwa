import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, AppState, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications'; // ✅ استيراد محرك الأذونات
import { getSettings, saveSettings, UserSettings, UserPersona } from '../../store/userStore';
import { scheduleSleepReminders } from '../../services/NotificationService';
import { Theme } from '../theme';

export default function SettingsScreen() {
  const [settings, setLocalSettings] = useState<UserSettings | null>(null);
  const [permissionStatus, setPermissionStatus] = useState({ notifications: false });
  const activeTheme = Theme.night;

  // 🛡️ وظيفة فحص الأذونات الحية
  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus({ notifications: status === 'granted' });
  };

  useEffect(() => {
    getSettings().then(setLocalSettings);
    checkPermissions();

    // مراقبة عودة المستخدم من إعدادات النظام لتحديث الشارات
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') checkPermissions();
    });
    return () => subscription.remove();
  }, []);

  const updateField = async (field: keyof UserSettings, value: any) => {
    if (!settings) return;
    const newSettings = { ...settings, [field]: value };
    setLocalSettings(newSettings);
    await saveSettings(newSettings);
  };

  const updateOffset = async (field: 'fajrOffset' | 'hijriOffset', inc: number) => {
    if (!settings) return;
    const newVal = settings[field] + inc;
    const newSettings = { ...settings, [field]: newVal };
    if (field === 'fajrOffset') newSettings.userPersona = 'custom' as UserPersona;
    setLocalSettings(newSettings);
    await saveSettings(newSettings);
  };

  if (!settings) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: activeTheme.background }} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>إعدادات غفوة</Text>

        {/* 🚦 مؤشر حالة النظام (System Status) */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: permissionStatus.notifications ? '#065F46' : '#991B1B' }]}>
            <Text style={styles.badgeText}>{permissionStatus.notifications ? '🔔 الإشعارات مفعلة' : '🔕 الإشعارات معطلة'}</Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.fixBtn}>
            <Text style={styles.fixBtnText}>إصلاح</Text>
          </TouchableOpacity>
        </View>

        {/* 1. تصحيح التاريخ الهجري */}
        <View style={styles.card}>
          <Text style={styles.label}>تصحيح التاريخ الهجري (أيام)</Text>
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => updateOffset('hijriOffset', -1)} style={styles.stepBtn}>
              <Text style={styles.stepText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valueText}>{settings.hijriOffset > 0 ? '+' : ''}{settings.hijriOffset}</Text>
            <TouchableOpacity onPress={() => updateOffset('hijriOffset', 1)} style={styles.stepBtn}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. الهوية */}
        <View style={styles.card}>
          <Text style={styles.label}>هوية المستخدم في ريسوت</Text>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.personaBtn, settings.userPersona === 'muazzin' && styles.activeBtn]}
              onPress={() => {
                const s = { ...settings, userPersona: 'muazzin' as UserPersona, fajrOffset: -20 };
                setLocalSettings(s); saveSettings(s);
              }}
            >
              <Text style={styles.btnText}>🎤 مؤذن</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.personaBtn, settings.userPersona === 'worshipper' && styles.activeBtn]}
              onPress={() => {
                const s = { ...settings, userPersona: 'worshipper' as UserPersona, fajrOffset: 10 };
                setLocalSettings(s); saveSettings(s);
              }}
            >
              <Text style={styles.btnText}>📿 مصلِّ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. توقيت الفجر */}
        <View style={styles.card}>
          <Text style={styles.label}>توقيت الاستيقاظ (نسبة للأذان)</Text>
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => updateOffset('fajrOffset', -5)} style={styles.stepBtn}>
              <Text style={styles.stepText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valueText}>{settings.fajrOffset} د</Text>
            <TouchableOpacity onPress={() => updateOffset('fajrOffset', 5)} style={styles.stepBtn}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. تنبيه ما قبل الغفوة */}
        <View style={styles.card}>
          <Text style={styles.label}>تنبيه قبل موعد الغفوة بـ</Text>
          <View style={styles.row}>
            {[5, 10, 15].map((m) => (
              <TouchableOpacity 
                key={m}
                onPress={() => updateField('reminderMinutes', m)}
                style={[styles.chip, settings.reminderMinutes === m && styles.activeChip]}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{m} د</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.versionInfo}>نسخة الإنتاج - ريسوت 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  statusCard: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', padding: 12, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#1E293B' },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  fixBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  fixBtnText: { color: '#22D3EE', fontSize: 12 },
  card: { backgroundColor: '#0F172A', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#1E293B' },
  label: { color: '#94A3B8', marginBottom: 12, textAlign: 'right', fontSize: 14 },
  row: { flexDirection: 'row-reverse', justifyContent: 'center' },
  personaBtn: { padding: 12, borderRadius: 10, backgroundColor: '#1E293B', width: '48%', alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginHorizontal: 4 },
  activeBtn: { backgroundColor: '#22D3EE', borderColor: '#22D3EE' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  stepper: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  stepBtn: { width: 45, height: 45, backgroundColor: '#334155', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  stepText: { color: '#FFF', fontSize: 24 },
  valueText: { color: '#22D3EE', fontSize: 20, fontWeight: 'bold' },
  chip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#1E293B', marginLeft: 8, borderWidth: 1, borderColor: '#334155' },
  activeChip: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  versionInfo: { color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 20 }
});