import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db } from '@/services/firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function CreateRoomScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getDoc(doc(db, 'users', userId)).then((docSnap) => {
      setUserName(docSnap.data()?.name ?? null);
    });
  }, [userId]);

  const criarSala = async () => {
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        createdAt: new Date(),
        hostId: userId,
        participants: [userId],
        status: 'waiting',
        matchedKinks: [],
      });
      console.log('Documento escrito com ID: ', docRef.id);
      router.replace({
        pathname: '/(onboarding)/room',
        params: { userId, roomId: docRef.id },
      });
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
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