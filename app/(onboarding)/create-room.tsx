import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createRoom } from '@/services/roomService';
import { getUserName } from '@/services/userService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function CreateRoomScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getUserName(userId).then(setUserName);
  }, [userId]);

  const criarSala = async () => {
    try {
      const roomId = await createRoom(userId);
      router.replace({
        pathname: '/(onboarding)/room',
        params: { userId, roomId },
      });
    } catch (e) {
      console.error('Erro ao criar sala: ', e);
      Alert.alert('Erro', 'Verifique o console para detalhes.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Olá {userName}
      </ThemedText>

      <TouchableOpacity style={styles.button} onPress={criarSala}>
        <ThemedText style={styles.buttonText}>Criar Sala</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]}
        onPress={() => {
          router.replace({
            pathname: '/(onboarding)/join-room',
            params: { userId },
          });
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