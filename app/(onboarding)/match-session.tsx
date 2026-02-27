import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MatchSessionScreen() {
  const { userId, roomId } = useLocalSearchParams<{
    userId: string;
    roomId: string;
  }>();
  return (
    <View style={styles.container}>
      <Text>Match Session</Text>
      <Text>User ID: {userId}</Text>
      <Text>Room ID: {roomId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
