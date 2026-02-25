import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db } from '@/services/firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function JoinRoomScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [roomId, setRoomId] = useState('');

  const entrarSala = async () => {
    if (roomId.trim().length === 0) {
      Alert.alert("Erro", "Informe o código da sala.");
      return;
    }

    if (!userId) {
      Alert.alert("Erro", "ID do usuário não encontrado. Volte ao início.");
      return;
    }

    try {
      const roomRef = doc(db, "rooms", roomId.trim());
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        Alert.alert("Erro", "Sala não encontrada. Verifique o código.");
        return;
      }

      await updateDoc(roomRef, {
        participants: arrayUnion(userId), 
      });
      Alert.alert("Sucesso!", `Você entrou na sala: ${roomId.trim()}`);
    } catch (e) {
      console.error("Erro ao entrar na sala: ", e);
      Alert.alert("Erro", "Sala não encontrada ou ocorreu um erro.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Entrar em uma Sala
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Código da sala"
        placeholderTextColor="#888"
        value={roomId}
        onChangeText={setRoomId}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, roomId.trim().length === 0 && styles.buttonDisabled]}
        onPress={entrarSala}
        disabled={roomId.trim().length === 0}
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333',
  },
});