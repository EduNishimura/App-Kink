import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CreateRoomScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Criar Sala
      </ThemedText>
      <ThemedText style={styles.description}>
        Configure sua sala para começar.
      </ThemedText>
      
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <ThemedText style={styles.buttonText}>Voltar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 20,
    fontSize: 32,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#ff2d55',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
