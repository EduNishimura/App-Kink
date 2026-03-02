// app/(onboarding)/index.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createUser } from '@/services/userService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function NickScreen() {
  const [nick, setNick] = useState('');
  const router = useRouter();

  const criarUsuario = async () => {
    if (nick.trim().length < 2) {
      Alert.alert('Erro', 'Nick Inválido');
      return;
    }
    try {
      const userId = await createUser(nick.trim());
      router.replace({
        pathname: '/(onboarding)/create-room',
        params: { userId },
      });
    } catch (e) {
      console.error('Erro ao criar usuário: ', e);
      Alert.alert('Erro', 'Verifique o console para detalhes.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Kink Match 🥒
      </ThemedText>

      <ThemedText style={styles.label}>Insira seu nick</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Seu nick aqui..."
        placeholderTextColor="#888"
        value={nick}
        onChangeText={setNick}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, nick.trim().length < 2 && styles.buttonDisabled]}
        onPress={criarUsuario}
        disabled={nick.trim().length < 2}
      >
        <ThemedText style={styles.buttonText}>Começar Kink</ThemedText>
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
    padding: 24,
  },
  title: {
    color: '#ff2d55', // vermelho da mock
    fontSize: 42,
    marginBottom: 60,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
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
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#ff2d55',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});