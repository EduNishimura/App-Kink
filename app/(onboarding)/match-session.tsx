import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { getKinks, likeKink, getMatchedKinks } from "@/services/kinkService";
import { subscribeToRoom, RoomData } from "@/services/roomService";

export default function MatchSessionScreen() {
  const { userId, roomId } = useLocalSearchParams<{
    userId: string;
    roomId: string;
  }>();

  const [kinks, setKinks] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [showGreenAlert, setShowGreenAlert] = useState(false);
  const [latestMatch, setLatestMatch] = useState("");

  const matchedCountRef = useRef(0);
  const unsubMatchCalcRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Busca a lista de kinks
    getKinks().then((data) => {
      setKinks(data);
    }).catch(e => console.error("Erro ao buscar kinks", e));

    // Escuta mudanças na sala para detectar novos matches
    const unsubRoom = subscribeToRoom(roomId, (data) => {
      setRoomData(data);
      if (data.matchedKinks && data.matchedKinks.length > matchedCountRef.current) {
        // Novo match em comum detectado
        const newMatches = data.matchedKinks.slice(matchedCountRef.current);
        if (newMatches.length > 0) {
          setLatestMatch(newMatches[newMatches.length - 1]);
          triggerGreenAlert();
        }
        matchedCountRef.current = data.matchedKinks.length;
      }
    });

    return () => {
      unsubRoom();
      if (unsubMatchCalcRef.current) {
        unsubMatchCalcRef.current();
      }
    };
  }, [roomId]);

  const triggerGreenAlert = () => {
    setShowGreenAlert(true);
    setTimeout(() => {
      setShowGreenAlert(false);
    }, 4000);
  };

  const handleAction = async (isLike: boolean) => {
    if (currentIndex >= kinks.length) return;
    
    const currentKink = kinks[currentIndex];

    // Na primeira ação, ativamos o listener de cálculo de matches,
    // garantindo que getMatchedKinks seja chamado conforme o requisito
    if (!unsubMatchCalcRef.current) {
      unsubMatchCalcRef.current = getMatchedKinks(roomId);
    }

    if (isLike) {
      await likeKink(roomId, userId, currentKink).catch(e => console.error(e));
    } else {
      // Dislike ainda não está implementado (como especificado no requisito)
    }

    setCurrentIndex((prev) => prev + 1);
  };

  if (kinks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando Kinks...</Text>
      </View>
    );
  }

  const isFinished = currentIndex >= kinks.length;

  return (
    <View style={styles.container}>
      {/* Alerta Verde para Novos Matches */}
      {showGreenAlert && (
        <View style={styles.greenAlert}>
          <Text style={styles.greenAlertText}>✨ NOVO KINK EM COMUM! ✨</Text>
          <Text style={styles.greenAlertSubText}>{latestMatch}</Text>
        </View>
      )}

      {!isFinished ? (
        <>
          <View style={styles.card}>
            <Text style={styles.kinkName}>{kinks[currentIndex]}</Text>
            <Text style={styles.kinkProgress}>
              {currentIndex + 1} / {kinks.length}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.dislikeButton]}
              onPress={() => handleAction(false)}
            >
              <Text style={styles.buttonText}>❌</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.likeButton]}
              onPress={() => handleAction(true)}
            >
              <Text style={styles.buttonText}>💚</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedTitle}>Fim da lista!</Text>
          <Text style={styles.finishedSubtitle}>
            Aguarde o outro jogador terminar para ver todos os matches.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  greenAlert: {
    position: "absolute",
    top: 60,
    width: "90%",
    backgroundColor: "#4cd964",
    padding: 18,
    borderRadius: 12,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    alignItems: "center",
  },
  greenAlertText: {
    color: "#1c5123",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  greenAlertSubText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 8,
    textTransform: "uppercase",
  },
  card: {
    width: "85%",
    height: "60%",
    backgroundColor: "#111",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff2d55",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  kinkName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  kinkProgress: {
    position: "absolute",
    bottom: 20,
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 50,
    gap: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dislikeButton: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
  },
  likeButton: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#4cd964",
  },
  buttonText: {
    fontSize: 36,
  },
  finishedContainer: {
    alignItems: "center",
    padding: 20,
  },
  finishedTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  finishedSubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
  },
});
