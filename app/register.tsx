import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'Endurance',
    'Flexibility',
    'Overall Fitness',
  ];

  const handleRegister = async () => {
    // Basic validation
    if (!name || !mobileNumber || !password || !height || !weight || !fitnessGoal) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Ensure inputs are valid
    if (isNaN(height) || isNaN(weight)) {
      Alert.alert('Error', 'Height and Weight must be numeric values');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.1.3:5000/api/createmember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone: mobileNumber,
          height: parseFloat(height),
          weight: parseFloat(weight),
          password,
          goal: fitnessGoal,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Response Error:', responseData);
        throw new Error(responseData.message || 'Registration failed');
      }

      console.log('Registration Successful:', responseData);

      await SecureStore.setItemAsync('userData', JSON.stringify(responseData.user));

      setName('');
      setMobileNumber('');
      setPassword('');
      setHeight('');
      setWeight('');
      setFitnessGoal('');

      router.push('/');
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://freedesignfile.com/upload/2017/10/Strong-sport-fitness-man-Stock-Photo-05.jpg',
      }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Your Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.inlineInputContainer}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Height (cm)"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Weight (kg)"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.goalContainer}>
              <Text style={styles.goalTitle}>Select Fitness Goal</Text>
              <View style={styles.goalButtonContainer}>
                {fitnessGoals.map((goal, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.goalButton,
                      fitnessGoal === goal && styles.selectedGoalButton,
                    ]}
                    onPress={() => setFitnessGoal(goal)}
                  >
                    <Text
                      style={[
                        styles.goalButtonText,
                        fitnessGoal === goal && styles.selectedGoalButtonText,
                      ]}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  inlineInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  goalContainer: {
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  goalButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  goalButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
  },
  selectedGoalButton: {
    backgroundColor: '#007bff',
  },
  goalButtonText: {
    color: '#333',
    fontSize: 14,
  },
  selectedGoalButtonText: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
