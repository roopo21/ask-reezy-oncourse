import { View, Text, Image, StyleSheet } from "react-native";

export default function RezzyHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/rezzy.png")}
        style={styles.avatar}
      />
      <Text style={styles.name}>Rezzy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
