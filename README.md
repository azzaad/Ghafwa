# 🌙 Ghafwa App (غفوة) 

**Ghafwa** is a React Native (Expo) open-source application designed to help users wake up for Fajr prayer by calculating optimal sleep cycles based on precise local prayer times. 

## 🎯 The Noble Goal (الهدف)
The app calculates the exact time remaining until Fajr prayer and suggests the best sleep cycles (e.g., 1 cycle = 1.5 hours) to wake up refreshed. It aims to automate setting the native Android alarm clock to the calculated wake-up time.

## ⚠️ Help Wanted: The Android Alarm Intent Challenge 
We are facing a critical architectural issue with Android Intents on Android 14+ (API 34/36) and Emulators. **We need help from Android/React Native native module experts!**

### The Problem:
We want to silently (or with UI) pass a specific calculated time (e.g., `04:05`) to the native Android Clock app to set an alarm. However, we are hitting roadblocks:

1. **Using `Linking.openURL` with `intent://`:** Fails to target the Clock app exclusively. Instead, the Android OS opens an "Open with" chooser showing irrelevant apps like Google Search, Messages, or Calendar.
2. **Using `expo-intent-launcher` (`android.intent.action.SET_ALARM`):**
   Fails on modern Emulators/Android 14 due to strict background execution limits or Intent resolution issues, falling back to our `catch` block (manual setup UI).
3. **Using `Linking.sendIntent`:**
   Experiences data parsing issues (e.g., Boolean `SKIP_UI` being sent as a string), confusing the native Clock app.

### Current Implementation (src/services/AlarmService.ts):
We have implemented a hybrid approach using `expo-intent-launcher` with zero-padding (e.g., `05:39`) to ensure visual certainty, coupled with a fallback to prompt manual setup. 

```typescript
// The core action we are trying to execute reliably:
await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
  extra: {
    'android.intent.extra.alarm.HOUR': hours,
    'android.intent.extra.alarm.MINUTES': minutes,
    'android.intent.extra.alarm.MESSAGE': 'غفوة الفجر',
    'android.intent.extra.alarm.SKIP_UI': false,
  },
  flags: 268435456, // FLAG_ACTIVITY_NEW_TASK
});