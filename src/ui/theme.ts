// src/ui/theme.ts
export const Theme = {
  night: {
    background: '#0F172A', // Deep Blue
    card: '#1E293B',       // Slate Gray
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#22D3EE',     // Cyan لمسة تقنية
  },
  day: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accent: '#0284C7',     // Sky Blue
  }
};

export type AppTheme = typeof Theme.night;