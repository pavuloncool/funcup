import React, { type ErrorInfo, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = { children: ReactNode };

type State = { hasError: boolean; message: string };

export class RootErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Something went wrong.' };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error('[RootErrorBoundary]', error, info.componentStack);
    }
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ScrollView contentContainerStyle={styles.center}>
          <View style={styles.card} accessibilityRole="alert">
            <Text style={styles.title}>Something broke</Text>
            <Text style={styles.body}>{this.state.message}</Text>
            <Pressable
              onPress={this.handleRetry}
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Try again after an error"
            >
              <Text style={styles.buttonLabel}>Try again</Text>
            </Pressable>
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fafafa',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  body: { fontSize: 15, color: '#4b5563' },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLabel: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
});
