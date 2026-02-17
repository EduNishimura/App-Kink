// app/(onboarding)/room.tsx
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RoomScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Kink Match 🔥
      </ThemedText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Lógica de criar sala (gerar código, salvar no supabase, etc.)
          router.replace('/(onboarding)/create-room'); // ou para uma tela de espera
        }}
      >
        <ThemedText style={styles.buttonText}>Criar Sala</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]}
        onPress={() => {
          // Aqui você pode abrir um input para digitar código da sala
          // Por enquanto vamos direto pro tabs
          router.replace('/(onboarding)/join-room');
        }}
      >
        <ThemedText style={styles.buttonText}>Entrar Em Sala</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    color: '#ff2d55',
    fontSize: 42,
    marginBottom: 80,
  },
  button: {
    width: '100%',
    height: 64,
    backgroundColor: '#ff2d55',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff2d55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});