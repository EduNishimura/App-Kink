import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { db } from '@/services/firebaseConfig';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type RoomData = {
  hostId: string;
  participants: string[];
  status: string;
};

export default function RoomScreen() {
  const { userId, roomId } = useLocalSearchParams<{ userId: string; roomId: string }>();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [participantNames, setParticipantNames] = useState<{ id: string; name: string }[]>([]);

  // Escuta em tempo real o documento da sala
  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsub = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        setRoomData(snap.data() as RoomData);
      }
    });

    return () => unsub();
  }, [roomId]);

  // Busca os nomes sempre que a lista de participantes mudar
  useEffect(() => {
    if (!roomData?.participants?.length) return;

    const fetchNames = async () => {
      const results = await Promise.all(
        roomData.participants.map(async (participantId) => {
          const snap = await getDoc(doc(db, 'users', participantId));
          const name = snap.exists() ? (snap.data()?.name ?? participantId) : participantId;
          return { id: participantId, name };
        })
      );
      setParticipantNames(results);
    };

    fetchNames();
  }, [roomData?.participants]);

  const isHost = userId === roomData?.hostId;

  const comecarQuestionario = () => {
    Alert.alert('Em breve', 'O questionário será iniciado!');
    // TODO: atualizar status da sala e navegar para o questionário
    router.replace({
        pathname: '/(onboarding)/match-session',
        params: { userId, roomId: roomId.trim() },
      });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Código da sala */}
      <ThemedText style={styles.label}>Código da Sala</ThemedText>
      <ThemedText style={styles.roomId}>{roomId}</ThemedText>

      {/* Lista de participantes */}
      <ThemedText style={styles.sectionTitle}>Participantes</ThemedText>
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {participantNames.length === 0 ? (
          <ThemedText style={styles.emptyText}>Carregando participantes...</ThemedText>
        ) : (
          participantNames.map((p) => (
            <View key={p.id} style={styles.participantRow}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {p.name.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText style={styles.participantName}>
                {p.name}
                {p.id === roomData?.hostId ? '  👑' : ''}
              </ThemedText>
            </View>
          ))
        )}
      </ScrollView>

      {/* Botão apenas para o host */}
      {isHost && (
        <TouchableOpacity style={styles.startButton} onPress={comecarQuestionario}>
          <ThemedText style={styles.startButtonText}>Começar Questionário 🔥</ThemedText>
        </TouchableOpacity>
      )}

      {!isHost && (
        <ThemedText style={styles.waitingText}>Aguardando o host iniciar...</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 80,
    padding: 32,
  },
  label: {
    color: '#888',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  roomId: {
    color: '#ff2d55',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    letterSpacing: 2,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  listContainer: {
    width: '100%',
    flex: 1,
  },
  listContent: {
    gap: 12,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#222',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff2d55',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  participantName: {
    color: '#fff',
    fontSize: 18,
  },
  startButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#ff2d55',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#ff2d55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  waitingText: {
    color: '#555',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
});