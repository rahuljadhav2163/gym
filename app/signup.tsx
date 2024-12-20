import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView, 
  Dimensions, 
  ImageBackground,
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router'; // Use `useRouter` for navigation in Expo Router
import BottomBar from './bottombar';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    if (!mobile || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('https://gym-backend-0o9y.onrender.com/api/adminlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      const result = await response.json();

      if (result.success === "true") {
        // Save user data to SecureStore
        await SecureStore.setItemAsync('adminData', JSON.stringify(result.data));

        // Navigate to /admin page
        router.push('/admin');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/premium-photo/man-with-perfect-body-gym-generative-ai_7023-48953.jpg',
      }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Ionicons name="log-in-outline" size={100} color="#ffffff" />
              </View>
              
              <Text style={styles.headerText}>Admin Access</Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#4169E1" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#6E7DA2"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#4169E1" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#6E7DA2"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={onLogin}
                >
                  <LinearGradient 
                    colors={['#4169E1', '#1E40AF']} 
                    style={styles.gradientButton}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>Log In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <BottomBar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay to improve text readability
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#A0AEC0',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4A5568',
  },
  loginButton: {
    width: '100%',
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  gradientButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  signupLinkText: {
    color: '#4169E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});