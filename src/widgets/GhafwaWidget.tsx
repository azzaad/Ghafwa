import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

/**
 * 🛡️ ويدجيت غفوة المصحح (Typed Ghafwa Widget)
 * تم استبدال "transparent" بـ "#00000000" لتوافق نظام أندرويد الأصلي
 */
export function GhafwaWidget({ windows }: { windows: any[] }) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0F172A',
        borderRadius: 16,
        padding: 8,
        flexDirection: 'column',
      }}
    >
      <TextWidget
        text="غفوة - الفجر"
        style={{ color: '#22D3EE', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}
      />
      
      {windows && windows.length > 0 ? (
        windows.slice(0, 3).map((w, i) => (
          <FlexWidget 
            key={i}
            style={{ 
              // ✅ التصحيح: استخدام الـ Hex الشفاف بدلاً من الكلمة النصية
              backgroundColor: i === 0 ? '#1E293B' : '#00000000',
              padding: 4, 
              borderRadius: 8,
              marginTop: 4,
              borderWidth: 1,
              borderColor: '#334155'
            }}
          >
            <TextWidget 
              text={`${w.type}: ${w.durationMinutes} د`} 
              style={{ color: '#F8FAFC', fontSize: 12 }} 
            />
          </FlexWidget>
        ))
      ) : (
        <TextWidget 
          text="لا توجد دورات حالياً" 
          style={{ color: '#94A3B8', fontSize: 10, textAlign: 'center', marginTop: 10 }} 
        />
      )}
    </FlexWidget>
  );
}