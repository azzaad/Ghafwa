import { updateDynamicShortcuts } from '../../services/ShortcutService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateSmartSleepOptions } from '../../core/sleepEngine';
import { setNativeAlarm } from '../../services/AlarmService';
import { getFajrTimeForToday, getPrayerTimesForToday } from '../../services/PrayerTimeService';
import { getSettings, UserSettings } from '../../store/userStore';
import { scheduleSleepReminders } from '../../services/NotificationService';
import { updateWidget } from '../../services/WidgetBridge';
import { getHijriDateDeterministic, getGregorianDateAr, getDayNameAr } from '../../utils/dateUtils';

export default function HomeScreen({ navigation }: any) {
  const [now, setNow] = useState(new Date());
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // 🛡️ التعديل الجوهري: رادار التركيز لجلب البيانات الحية عند العودة للشاشة
  useFocusEffect(
    useCallback(() => {
      const fetchSettings = async () => {
        const s = await getSettings();
        setSettings(s);
      };
      fetchSettings();
    }, [])
  );

  // ⏱️ مؤقت الوقت مفصول ليعمل باستقلالية تامة
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getDateInfo = () => {
    if (!settings) return { hijri: '', gregorian: '', day: '' };
    return {
      hijri: getHijriDateDeterministic(now, settings.hijriOffset || 0),
      gregorian: getGregorianDateAr(now),
      day: getDayNameAr(now)
    };
  };

  const dateInfo = getDateInfo();
  const fajr = getFajrTimeForToday(now);
  const prayers = getPrayerTimesForToday(now);
  
  const { windows, status } = calculateSmartSleepOptions(
    now, 
    fajr, 
    prayers.maghrib, 
    prayers.isha, 
    [prayers.dhuhr, prayers.asr, prayers.maghrib, prayers.isha], 
    settings || {} as any
  );

  // ✅ مزامنة الويدجيت لتشمل البيانات الهجرية
  useEffect(() => {
    const syncWidgetData = async () => {
      if (settings && windows.length > 0) {
        const fajrStr = fajr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const nextWake = windows[0].wakeUpAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const hijriStr = dateInfo.hijri;
        const isAfter9PM = now.getHours() >= 21;
        await updateDynamicShortcuts(windows, isAfter9PM);

        // إرسال البيانات الثلاثية للجسر الأصلي
        await updateWidget(fajrStr, nextWake, hijriStr);
        
        if (settings.autoAlarm) {
          scheduleSleepReminders(windows, settings.reminderMinutes);
        }
      }
    };
    syncWidgetData();
  }, [settings, now, windows]); // المزامنة مرتبطة بتغير الوقت أو النوافذ

  if (!settings) return <View style={styles.center}><ActivityIndicator color="#22D3EE" size="large" /></View>;

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'left']}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsIcon}>
          <Text style={{ fontSize: 24 }}>⚙️</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.appName}>غفوة 🌙</Text>
          <Text style={styles.dayText}>{dateInfo.day}</Text>
          <Text style={styles.hijriText}>{dateInfo.hijri}</Text>
          <Text style={styles.gregorianText}>{dateInfo.gregorian}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.fajrBanner}>
          <Text style={styles.fajrTime}>{fajr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <Text style={styles.fajrLabel}>الفجر في ريسوت</Text>
        </View>

        {status === 'forbidden' ? (
          <View style={styles.forbiddenCard}>
            <Text style={{ fontSize: 50 }}>⛔</Text>
            <Text style={styles.forbiddenTitle}>وقت كراهة النوم</Text>
            <Text style={styles.forbiddenSub}>ما بين المغرب والعشاء لا يُنصح بالنوم</Text>
          </View>
        ) : (
          windows.map((w, i) => (
            <View key={i} style={[styles.card, { borderColor: w.type === 'نومة الفجر' ? '#8B5CF6' : '#22D3EE' }]}>
              <View style={styles.cardInfo}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardType, { color: w.type === 'نومة الفجر' ? '#A78BFA' : '#22D3EE' }]}>{w.type}</Text>
                  {w.note && <Text style={styles.noteTag}>{w.note}</Text>}
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.wakeValue}>{w.wakeUpAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  <Text style={styles.wakeLabel}>وقت الاستيقاظ</Text>
                </View>
                <Text style={styles.durationText}>المدة: {Math.floor(w.durationMinutes / 60)}س {w.durationMinutes % 60}د</Text>
              </View>
              <TouchableOpacity 
                style={[styles.alarmBtn, { backgroundColor: w.type === 'نومة الفجر' ? '#8B5CF6' : '#22D3EE' }]} 
                onPress={() => setNativeAlarm(w.wakeUpAt, w.type)}
              >
                <Text style={{ fontSize: 24 }}>🔔</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  center: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  settingsIcon: { width: 45, height: 45, backgroundColor: '#1E293B', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  appName: { color: '#22D3EE', fontSize: 24, fontWeight: 'bold' },
  dayText: { color: '#FFF', fontSize: 18, marginTop: 5 },
  hijriText: { color: '#94A3B8', fontSize: 14 },
  gregorianText: { color: '#64748b', fontSize: 12 },
  fajrBanner: { backgroundColor: 'rgba(34, 211, 238, 0.05)', padding: 15, borderRadius: 15, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(34, 211, 238, 0.2)' },
  fajrTime: { color: '#22D3EE', fontSize: 26, fontWeight: 'bold' },
  fajrLabel: { color: '#94A3B8', fontSize: 12 },
  card: { backgroundColor: '#1E293B', borderRadius: 20, padding: 18, marginBottom: 15, flexDirection: 'row-reverse', alignItems: 'center', borderWidth: 1, elevation: 4 },
  cardInfo: { flex: 1, alignItems: 'flex-end' },
  cardHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', marginBottom: 5 },
  cardType: { fontSize: 16, fontWeight: 'bold' },
  noteTag: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  timeContainer: { flexDirection: 'row-reverse', alignItems: 'baseline' },
  wakeValue: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  wakeLabel: { color: '#64748b', fontSize: 12, marginRight: 8 },
  durationText: { color: '#94A3B8', fontSize: 11, marginTop: 4 },
  alarmBtn: { width: 55, height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 8 },
  forbiddenCard: { alignItems: 'center', marginTop: 40 },
  forbiddenTitle: { color: '#F87171', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  forbiddenSub: { color: '#64748b', fontSize: 12, marginTop: 5 }
});