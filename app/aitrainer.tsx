import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Animated, ImageBackground, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import BottomBar from './bottombar';
import Header from './header';

const colorSchemes = {
  background: ['#1A1A2E', '#16213E'],
  card: ['#4E54C8', '#8F94FB'],
  button: ['#00B4DB', '#0083B0'],
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0',
  }
};

export default function AIGymTrainer() {
  const [workout, setWorkout] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const workoutPlans = [
    {
      id: 1,
      name: 'Full Body Workout',
      details: [
        '10 mins warm-up',
        '15 squats',
        '15 push-ups',
        '10 lunges (each leg)',
        'Plank for 1 min',
      ],
    },
    {
      id: 2,
      name: 'Cardio Burst',
      details: [
        '5 mins jumping jacks',
        '5 mins high knees',
        '3 sets of 20 burpees',
        '2 sets of mountain climbers',
        'Cool down for 5 mins',
      ],
    },
    {
      id: 3,
      name: 'Strength Training',
      details: [
        '10 push-ups',
        '10 dumbbell rows (each arm)',
        '15 squats',
        '20 sit-ups',
        'Plank for 1 min',
      ],
    },
    {
      id: 4,
      name: 'Flexibility Stretching',
      details: [
        '5 mins neck and shoulder rolls',
        '5 mins toe touch stretch',
        '3 sets of 20 leg stretches',
        '2 sets of hip rotations',
        'Cool down with breathing exercises',
      ],
    },
    {
      id: 5,
      name: 'Yoga Flow',
      details: [
        '5 mins Child’s Pose',
        '10 mins Downward Dog',
        '3 sets of Warrior Pose (1 min each)',
        'Plank for 1 min',
        '5 mins Savasana (relaxation)',
      ],
    },
    {
      id: 6,
      name: 'HIIT Circuit',
      details: [
        '5 mins warm-up',
        '30 secs jumping jacks',
        '30 secs burpees',
        '30 secs high knees',
        'Repeat 3 times',
        'Cool down for 5 mins',
      ],
    },
    {
      id: 7,
      name: 'Core Blaster',
      details: [
        '10 crunches',
        '20 bicycle crunches',
        '15 leg raises',
        'Plank for 1 min',
        '20 mountain climbers',
      ],
    },
    {
      id: 8,
      name: 'Upper Body Strength',
      details: [
        '10 push-ups',
        '15 tricep dips',
        '10 dumbbell rows (each arm)',
        '15 bicep curls',
        'Plank for 1 min',
      ],
    },
    {
      id: 9,
      name: 'Lower Body Burn',
      details: [
        '15 squats',
        '20 lunges (each leg)',
        '15 glute bridges',
        '20 calf raises',
        'Cool down for 5 mins',
      ],
    },
    {
      id: 10,
      name: 'Morning Energizer',
      details: [
        '5 mins light stretching',
        '10 mins fast-paced walking or running',
        '10 jumping jacks',
        'Plank for 1 min',
        '5 mins cool-down stretches',
      ],
    },
  ];
  

  // Check login status
  const checkLoginStatus = async () => {
    try {
      const userToken = await SecureStore.getItemAsync('userData'); // Replace 'userToken' with your SecureStore key
      setIsLoggedIn(!!userToken); // If token exists, user is logged in
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const generateWorkout = () => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please log in to access workout plans.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * workoutPlans.length);
    setWorkout(workoutPlans[randomIndex]);

    // Animate the workout card appearance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const renderWorkoutDetails = ({ item, index }) => (
    <Animated.View
      style={[
        styles.workoutItem,
        {
          opacity: scaleAnim,
          transform: [
            {
              translateX: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.workoutStep}>• {item}</Text>
    </Animated.View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://cdn.shopify.com/s/files/1/0552/1565/3035/files/2020Men_Strong_male_bodybuilder_in_the_gym_143177_19_1400x.jpg?v=1615279261' }}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.subHeader}>Need a workout plan? 💪</Text>

          {workout ? (
            <Animated.View
              style={[
                styles.workoutContainer,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(65,105,225,0.8)', 'rgba(0,0,0,0.9)']}
                style={styles.workoutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.workoutTitle}>{workout.name}</Text>
                <FlatList
                  data={workout.details}
                  renderItem={renderWorkoutDetails}
                  keyExtractor={(item, index) => `${workout.id}-${index}`}
                  style={styles.workoutList}
                />
              </LinearGradient>
            </Animated.View>
          ) : (
            <Text style={styles.noWorkoutText}>Let me generate a workout for you! 🎯</Text>
          )}

          <TouchableOpacity
            onPress={generateWorkout}
            style={styles.generateButtonContainer}
          >
            <LinearGradient
              colors={['rgba(65,105,225,0.8)', 'rgba(65,105,225,0.8)']}
              style={styles.generateButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.generateButtonText}>Generate Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <BottomBar />
      </LinearGradient>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  subHeader: {
    fontSize: 24,
    color: colorSchemes.text.primary,
    marginBottom: 24,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  workoutContainer: {
    width: '100%',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  workoutGradient: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  workoutTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: colorSchemes.text.primary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  workoutList: {
    width: '100%',
  },
  workoutItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  workoutStep: {
    fontSize: 16,
    color: colorSchemes.text.primary,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  noWorkoutText: {
    fontSize: 18,
    color: colorSchemes.text.primary,
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  generateButtonContainer: {
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  generateButtonText: {
    color: colorSchemes.text.primary,
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});