import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as SecureStore from 'expo-secure-store';
import BottomBar from './bottombar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Workout() {
  const [userData, setUserData] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState([]);
  const [historyWorkouts, setHistoryWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const router = useRouter();

  // Color palette
  const COLORS = {
    primary: '#5D6AFF',
    accent: '#E94560',
    background: '#1A1A2E',
    text: '#FFFFFF',
    cardBackground: '#16213E',
  };

  // Format date to YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDateTime = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          fetchWorkoutData(parsedUserData.phone);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchWorkoutData = async (phone) => {
    try {
      const response = await fetch(`https://gym-backend-0o9y.onrender.com/api/getworkouts/${phone}`);
      const data = await response.json();
  
      if (response.ok) {
        const today = getTodayDate();
        const allWorkouts = data.workouts || [];
  
        const todaysWorkouts = allWorkouts.filter(workout => workout.date.split('T')[0] === today);
        setTodayWorkout(todaysWorkouts);
  
        const pastWorkouts = allWorkouts.filter(workout => workout.date.split('T')[0] !== today);
        setHistoryWorkouts(pastWorkouts);
      } else {
        console.error('Error fetching workouts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized and filtered workouts
  const processedWorkouts = useMemo(() => {
    let filteredWorkouts = historyWorkouts;

    // Filter by workout type
    if (filterType !== 'all') {
      filteredWorkouts = filteredWorkouts.filter(workout => workout.type === filterType);
    }

    // Sort workouts
    filteredWorkouts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });

    return filteredWorkouts;
  }, [historyWorkouts, filterType, sortOrder]);

  const renderGradientCard = (children, style = {}) => (
    <LinearGradient
      colors={[COLORS.cardBackground, 'rgba(22, 33, 62, 0.8)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientCard, style]}
    >
      {children}
    </LinearGradient>
  );

  const renderHistoryModal = () => {
    const uniqueWorkoutTypes = ['all', ...new Set(historyWorkouts.map(w => w.type))];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHistoryModal}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workout History</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.accent} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollView}
              >
                {uniqueWorkoutTypes.map(type => (
                  <TouchableOpacity 
                    key={type} 
                    style={[
                      styles.filterButton, 
                      filterType === type && styles.activeFilterButton
                    ]}
                    onPress={() => setFilterType(type)}
                  >
                    <Text style={[
                      styles.filterButtonText, 
                      filterType === type && styles.activeFilterButtonText
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              >
                <Ionicons 
                  name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
                  size={20} 
                  color={COLORS.accent} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {processedWorkouts.length > 0 ? (
                processedWorkouts.map((workout, index) => (
                  <View key={index} style={styles.historyWorkoutCard}>
                    <View style={styles.workoutCardHeader}>
                      <Text style={styles.historyWorkoutDate}>
                        {formatDateTime(workout.date)}
                      </Text>
                      <Text style={styles.workoutTypeTag}>{workout.type}</Text>
                    </View>
                    <Text style={styles.historyWorkoutDetail}>
                      Workout: {workout.workout}
                    </Text>
                    <View style={styles.workoutCardFooter}>
                      <Text style={styles.historyWorkoutDetail}>
                        Duration: {workout.duration} min
                      </Text>
                      <TouchableOpacity style={styles.detailButton}>
                        <Text style={styles.detailButtonText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noWorkoutsText}>No workouts found</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderUserHeader = () => (
    <View style={styles.headerContainer}>
      <>
        <View style={styles.userProfileHeader}>
          <TouchableOpacity style={styles.userAvatar}>
            <Text style={styles.avatarText}>
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.name || 'User'}</Text>
            <Text style={styles.userEmail}>{userData.phone || 'user@example.com'}</Text>
          </View>
         
        </View>
      </>

      {renderGradientCard(
        <View style={styles.statsContainer}>
          {[
            { value: '60 min', label: 'Duration' },
            { value: '450', label: 'Calories' },
            { value: 'Premium', label: 'Intensity' }
          ].map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>,
        { marginTop: 15, marginHorizontal: 15 }
      )}
    </View>
  );

  const renderWorkoutSection = () => (
    <View style={styles.exerciseSection}>
      {renderGradientCard(
        <>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          {todayWorkout.length > 0 ? (
            todayWorkout.map((workout, index) => (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.workoutCardHeader}>
                  <Text style={styles.exerciseDetail}>
                    {workout.workout}
                  </Text>
                  <View style={styles.workoutBadge}>
                    <Ionicons name="fitness" size={16} color={COLORS.accent} />
                  </View>
                </View>
                <View style={styles.workoutCardDetails}>
                  <View style={styles.workoutDetailItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.text} />
                    <Text style={styles.workoutDetailText}>
                      {workout.duration} min
                    </Text>
                  </View>
                  <View style={styles.workoutDetailItem}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.text} />
                    <Text style={styles.workoutDetailText}>
                      {formatDateTime(workout.date)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noWorkoutsText}>
              No workout scheduled for today
            </Text>
          )}
        </>
      )}
      
      <TouchableOpacity 
        style={styles.historyButton} 
        onPress={() => setShowHistoryModal(true)}
      >
        <Text style={styles.historyButtonText}>Workout History</Text>
        <Ionicons 
          name="chevron-forward-outline" 
          size={20} 
          color={COLORS.text} 
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!userData) {
    return (
      <>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Login Required</Text>
          <Text style={styles.loginSubtitle}>Please log in to view your workout</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {renderUserHeader()}
        {renderWorkoutSection()}
        {renderHistoryModal()}
      </ScrollView>
      <BottomBar />
    </>
  );
}

const styles = StyleSheet.create({
  // Base container styles
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  
  // Login Styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(93, 106, 255, 0.8)',
    padding: 20,
  },
  loginTitle: {
    color: '#E94560',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loginSubtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#E94560',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Header Styles
  headerContainer: {
    backgroundColor: 'rgba(93, 106, 255, 0.5)',
    paddingBottom: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
  },
  blurContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  userProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingTop:20,
    marginLeft:10
  },
  settingsIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#000',
    fontSize: 14,
  },
  
  // Gradient Card
  gradientCard: {
    borderRadius: 20,
    marginBottom:13,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4}},// Continuing the styles from the previous artifact
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
      },
      statBox: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 15,
        width: '30%',
      },
      statValue: {
        color: '#E94560',
        fontSize: 18,
        fontWeight: 'bold',
      },
      statLabel: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
      },
      
      // Exercise Section Styles
      exerciseSection: {
        padding: 15,
      },
      sectionTitle: {
        color: 'rgba(93, 106, 255, 0.7)',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
      },
      exerciseCard: {
        backgroundColor: 'rgba(22, 33, 62, 0.5)',
        borderRadius: 15,
        marginBottom: 10,
        padding: 15,
      },
      workoutCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      workoutBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(233, 69, 96, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      exerciseDetail: {
        color: '#E94560',
        fontSize: 19,
        flex: 1,
        marginRight: 10,
      },
      workoutCardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      workoutDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      workoutDetailText: {
        color: 'white',
        marginLeft: 5,
        fontSize: 12,
      },
      noWorkoutsText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
      },
      historyButton: {
        backgroundColor: '#E94560',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      historyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10,
      },
      
      // Modal Styles
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '90%',
        backgroundColor: '#1A1A2E',
        borderRadius: 20,
        padding: 20,
        maxHeight: '80%',
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      modalTitle: {
        color: '#E94560',
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
      },
      filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      },
      filterScrollView: {
        flexGrow: 1,
      },
      filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#16213E',
      },
      activeFilterButton: {
        backgroundColor: '#E94560',
      },
      filterButtonText: {
        color: 'white',
        fontSize: 14,
      },
      activeFilterButtonText: {
        color: 'white',
      },
      sortButton: {
        marginLeft: 10,
        padding: 8,
        backgroundColor: '#16213E',
        borderRadius: 20,
      },
      historyWorkoutCard: {
        backgroundColor: '#16213E',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
      },
      historyWorkoutDate: {
        color: '#E94560',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      historyWorkoutDetail: {
        color: 'white',
        fontSize: 14,
        marginBottom: 3,
      },
      workoutTypeTag: {
        backgroundColor: '#E94560',
        color: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 15,
        fontSize: 12,
      },
      workoutCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      },
      detailButton: {
        backgroundColor: 'rgba(233, 69, 96, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
      },
      detailButtonText: {
        color: '#E94560',
        fontSize: 12,
      },
    });