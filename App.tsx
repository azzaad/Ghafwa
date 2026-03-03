import React, { useEffect, Suspense } from 'react';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as QuickActions from 'expo-quick-actions'; // ✅ استيراد مكتبة الاختصارات
import HomeScreen from './src/ui/screens/HomeScreen';
import SettingsScreen from './src/ui/screens/SettingsScreen';
import { setupNotifications } from './src/services/NotificationService';
import { setNativeAlarm } from './src/services/AlarmService'; // ✅ استيراد جسر المنبه الأصلي
import ErrorBoundary from './src/ui/ErrorBoundary'; 

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'Remote notification functionality',
  'WidgetBridge native module is not available',
  'Non-serializable values were found in the navigation state',
]);

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    try { setupNotifications(); } catch (e) { console.error(e); }

    // 🛡️ رادار الاستماع للاختصارات الخارجية (Quick Actions Listener)
    const subscription = QuickActions.addListener((action) => {
      try {
        if (action && action.params) {
          const { action: actionType, wakeUpTime, type, durationMinutes } = action.params as any;
          
          // 1. حالة غفوة مبرمجة (بعد 9 مساءً)
          if (actionType === 'set_alarm_exact' && wakeUpTime) {
            const targetDate = new Date(wakeUpTime);
            setNativeAlarm(targetDate, type || 'غفوة مبرمجة');
          } 
          // 2. حالة غفوة سريعة (قبل 9 مساءً)
          else if (actionType === 'set_alarm' && durationMinutes) {
            const targetDate = new Date(Date.now() + durationMinutes * 60000);
            setNativeAlarm(targetDate, type || 'غفوة سريعة');
          }
        }
      } catch (error) {
        console.error("Failed to process quick action:", error); // تطبيق الصمت المعماري عند الفشل
      }
    });

    // تنظيف الرادار عند إغلاق التطبيق لتجنب تسرب الذاكرة
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Suspense fallback={<View style={{flex:1, backgroundColor:'#020617'}}><ActivityIndicator color="#22D3EE"/></View>}>
          <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{ 
                headerStyle: { backgroundColor: '#0F172A' }, 
                headerTintColor: '#F8FAFC',
                headerTitleAlign: 'center' 
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'غفوة' }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </Suspense>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}