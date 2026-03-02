import { View, Text, StyleSheet } from 'react-native';

export default function TinyTwoLiner({ top, middle, bottom }: { top: string; middle: string; bottom: string }) {
  return (
    <View style={styles.tinyContainer}>
      <Text style={styles.tinyText}>{top}</Text>
      <Text style={styles.tinyText}>{middle}</Text>
      <Text style={styles.tinyText}>{bottom}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tinyContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    minWidth: 14,
    marginLeft: 4,
  },
  tinyText: {
    fontSize: 11,
    color: "#555",
    lineHeight: 14,
  },
});