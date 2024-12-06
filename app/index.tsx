import React, { useState ,useEffect} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image,
  ImageBackground,
  Dimensions,
  Modal,
  Platform, 
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Ionicons, 
  MaterialIcons, 
  FontAwesome5, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import BottomBar from './bottombar';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#3A47D9',     
  secondary: '#5D6AFF',   
  background: '#F4F6FA',  
  text: '#2C3E50',        
  white: '#FFFFFF',       
  gray: '#6B7280',        
  lightGray: '#E5E7EB',   
  accent: '#FF6B6B'       
};
const FitnessHomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [user] = useState({
  
    avatar: 'https://cdn0.iconfinder.com/data/icons/people-and-lifestyle-2/64/fitness-man-lifestyle-avatar-1024.png',
    weeklyProgress: 65,
    caloriesBurned: 450,
    workoutStreak: 12
  });
  const [userdata, setuserdata] = useState('');

  const fetchUserData = async () => {
    try {
        const storedData = await SecureStore.getItemAsync('userData');
        if (storedData) {
          setuserdata(JSON.parse(storedData));
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Unable to fetch user data');
    }
};

useEffect(() => {
  fetchUserData();
}, []);

  const workoutCategories = [
    { 
      name: 'Strength', 
      icon: <FontAwesome5 name="dumbbell" size={30} color={COLORS.white} />,
      color: COLORS.primary,
      description: 'Build muscle and increase overall strength through targeted resistance training.',
      benefits: [
        'Increases muscle mass',
        'Boosts metabolism',
        'Improves bone density',
        'Enhances overall physical performance'
      ],
      recommendedEquipment: [
        'Dumbbells',
        'Barbells',
        'Resistance Bands',
        'Weight Machines'
      ]
    },
    { 
      name: 'Cardio', 
      icon: <FontAwesome5 name="running" size={30} color={COLORS.white} />,
      color: COLORS.accent,
      description: 'Improve cardiovascular health and burn calories with dynamic, high-energy exercises.',
      benefits: [
        'Improves heart health',
        'Burns calories',
        'Increases endurance',
        'Reduces stress'
      ],
      recommendedEquipment: [
        'Running Shoes',
        'Jump Rope',
        'Stationary Bike',
        'Elliptical Machine'
      ]
    },
    { 
      name: 'Yoga', 
      icon: <MaterialCommunityIcons name="meditation" size={30} color={COLORS.white} />,
      color: COLORS.secondary,
      description: 'Enhance flexibility, balance, and mental well-being through mindful movement and breathing.',
      benefits: [
        'Increases flexibility',
        'Reduces stress',
        'Improves balance',
        'Enhances mental clarity'
      ],
      recommendedEquipment: [
        'Yoga Mat',
        'Yoga Blocks',
        'Yoga Strap',
        'Meditation Cushion'
      ]
    },
    { 
      name: 'HIIT', 
      icon: <MaterialIcons name="fitness-center" size={30} color={COLORS.white} />,
      color: '#FF6B6B',
      description: 'High-Intensity Interval Training for maximum calorie burn and fitness improvement.',
      benefits: [
        'Rapid calorie burning',
        'Boosts metabolism',
        'Improves cardiovascular fitness',
        'No equipment needed'
      ],
      recommendedEquipment: [
        'Bodyweight',
        'Resistance Bands',
        'Kettlebells',
        'Jump Rope'
      ]
    }
  ];

  const upcomingWorkouts = [
    {
      name: 'Full Body Strength',
      time: '7:00 AM',
      duration: '45 min',
      instructor: 'Mike Johnson',
      difficulty: 'Advanced',
      equipment: 'Weights & Resistance Bands'
    }
  ];

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const renderCategoryModal = () => {
    if (!selectedCategory) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[selectedCategory.color, 'rgba(93, 106, 255, 0.8)']}
            style={styles.modalContent}
          >
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              {selectedCategory.icon}
              <Text style={styles.modalTitle}>{selectedCategory.name} Workout</Text>
            </View>

            <Text style={styles.modalDescription}>
              {selectedCategory.description}
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Benefits</Text>
              {selectedCategory.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Recommended Equipment</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.equipmentScroll}
              >
                {selectedCategory.recommendedEquipment.map((equipment, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>{equipment}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity 
              style={styles.startWorkoutButton}
              onPress={() => {
                // TODO: Navigate to workout details or start workout
                setModalVisible(false);
              }}
            >
              <Text style={styles.startWorkoutText}>Start {selectedCategory.name} Workout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/free-photo/dumbbells-floor-gym-ai-generative_123827-23744.jpg?w=740&t=st=1683065681~exp=1683066281~hmac=f118148315fae3acde1e1a5b6cbf8baa9a626dd2dcd42349db7b464d3cd43634' }}
      style={styles.backgroundImage}
      blurRadius={0}
    >
      <LinearGradient
        colors={['rgba(58, 71, 217, 0.9)', 'rgba(93, 106, 255, 0.7)']}
        style={styles.gradientOverlay}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.userSection}>
                  <Image 
                    source={{ uri: user.avatar }} 
                    style={styles.avatar} 
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.greeting}>Hello, {userdata.name || "User"} </Text>
                    <Text style={styles.subGreeting}>
                      Ready to {userdata.goal || "fit"} today?
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.notificationIcon}>
                  <Ionicons 
                    name="notifications-outline" 
                    size={24} 
                    color={COLORS.white} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Fitness Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <FontAwesome5 name="fire" size={20} color={COLORS.accent} />
                <Text style={styles.statValue}>{user.caloriesBurned}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="calendar" size={20} color={'orange'} />
                <Text style={styles.statValue}>{user.workoutStreak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statBox}>
                <MaterialIcons name="trending-up" size={20} color={"red"} />
                <Text style={styles.statValue}>{user.weeklyProgress}%</Text>
                <Text style={styles.statLabel}>Progress</Text>
              </View>
            </View>

            {/* Progress Card */}
            <LinearGradient 
              colors={[COLORS.primary, COLORS.secondary]} 
              style={styles.progressCard}
            >
              <View style={styles.progressContent}>
                <Text style={styles.progressTitle}>Weekly Fitness Progress</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressIndicator, 
                      { width: `${user.weeklyProgress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {user.weeklyProgress}% Complete - Keep Going!
                </Text>
              </View>
            </LinearGradient>

            {/* Workout Categories */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Workout Categories</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
              >
                {workoutCategories.map((category, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.categoryCard}
                    onPress={() => openCategoryModal(category)}
                  >
                    <View 
                      style={[
                        styles.categoryIcon, 
                        { backgroundColor: category.color }
                      ]}
                    >
                      {category.icon}
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Upcoming Workouts */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Workouts</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {upcomingWorkouts.map((workout, index) => (
                <View key={index} style={styles.workoutCard}>
                  <View style={styles.workoutCardContent}>
                    <View style={styles.workoutDetails}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutSubtitle}>
                        <Ionicons name="time-outline" size={14} color={COLORS.gray} /> 
                        {workout.time} • {workout.duration}
                      </Text>
                      <Text style={styles.workoutEquipment}>
                        <MaterialIcons name="fitness-center" size={14} color={COLORS.gray} /> 
                        {workout.equipment}
                      </Text>
                    </View>
                    <View style={styles.workoutMeta}>
                      <Text style={styles.workoutInstructor}>
                        {workout.instructor}
                      </Text>
                      <View 
                        style={[
                          styles.difficultyBadge, 
                          workout.difficulty === 'Advanced' 
                            ? styles.advancedBadge 
                            : workout.difficulty === 'Intermediate'
                            ? styles.intermediateBadge
                            : styles.beginnerBadge
                        ]}
                      >
                        <Text style={styles.difficultyText}>
                          {workout.difficulty}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <BottomBar/>
        </LinearGradient>
      </ImageBackground>
      {renderCategoryModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    height: height * 0.85,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10
  },
  modalDescription: {
    color: COLORS.lightGray,
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24
  },
  modalSection: {
    marginBottom: 20
  },
  modalSectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  benefitText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 10
  },
  equipmentScroll: {
    flexDirection: 'row'
  },
  equipmentItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10
  },
  equipmentText: {
    color: COLORS.white,
    fontSize: 14
  },
  startWorkoutButton: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20
  },
  startWorkoutText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height
  },
  gradientOverlay: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  scrollContainer: {
    flex: 1
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  userInfo: {
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.lightGray
  },
  notificationIcon: {
    padding: 10
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 15
  },
  statBox: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 5
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginTop: 3
  },
  progressCard: {
    margin: 15,
    borderRadius: 15,
    padding: 20
  },
  progressContent: {
    alignItems: 'center'
  },
  progressTitle: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 10
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: COLORS.white
  },
  progressText: {
    color: COLORS.white,
    marginTop: 10,
    fontSize: 14
  },
  sectionContainer: {
    marginVertical: 15,
    paddingHorizontal: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white
  },
  seeAllText: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.7
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 10,
    marginLeft:10
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryName: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.white
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  workoutCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  workoutDetails: {
    flex: 1
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white
  },
  workoutSubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginTop: 5,
    alignItems: 'center'
  },
  workoutEquipment: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginTop: 5
  },
  workoutMeta: {
    alignItems: 'flex-end'
  },
  workoutInstructor: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginBottom: 5
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15
  },
  advancedBadge: {
    backgroundColor: COLORS.accent
  },
  intermediateBadge: {
    backgroundColor: COLORS.secondary
  },
  beginnerBadge: {
    backgroundColor: COLORS.primary
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold'
  }
});

export default FitnessHomeScreen;