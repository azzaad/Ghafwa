import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => this.setState({ hasError: false });

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>🌑</Text>
          <Text style={styles.title}>حدث تعارض في "غفوة"</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // ✅ التصحيح الجوهري: الوصول للخصائص عبر props
    return this.props.children; 
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { fontSize: 60, marginBottom: 20 },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  button: { backgroundColor: '#22D3EE', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  buttonText: { color: '#020617', fontWeight: 'bold' }
});

export default ErrorBoundary;