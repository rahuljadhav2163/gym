import { Text, View,TouchableOpacity,StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.header}>
    <View>
      <Text style={styles.welcomeText}>Welcome back in,</Text>
      <Text style={styles.userName}>AI Gym Trainer</Text>
    </View>
    <TouchableOpacity style={styles.profileButton}>
      <View style={styles.profileAvatar}>
        <Text style={styles.profileInitials}>JD</Text>
      </View>
    </TouchableOpacity>
  </View>
  );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#0073e6',
      },
      welcomeText: {
        fontSize: 16,
        color: '#f3b34a',
      },
      userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f3b34a',
      },
      profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
      },
      profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3b34a',
        justifyContent: 'center',
        alignItems: 'center',
      },
      profileInitials: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4299E1',
      },
    });
