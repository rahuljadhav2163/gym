import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions, 
  TouchableOpacity,
  ImageBackground 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import BottomBar from './bottombar';


const DIET_PLANS = {
  'Weight Loss': [
    { day: 'Monday', meals: [
      { name: 'Breakfast', description: 'Protein smoothie with spinach, berries, and whey protein', calories: 300 },
      { name: 'Lunch', description: 'Grilled chicken salad with mixed greens', calories: 400 },
      { name: 'Dinner', description: 'Baked salmon with roasted vegetables', calories: 350 }
    ]},
    { day: 'Tuesday', meals: [
      { name: 'Breakfast', description: 'Egg white omelet with vegetables', calories: 250 },
      { name: 'Lunch', description: 'Turkey and quinoa bowl', calories: 380 },
      { name: 'Dinner', description: 'Lean beef stir-fry with cauliflower rice', calories: 400 }
    ]},
    { day: 'Wednesday', meals: [
      { name: 'Breakfast', description: 'Chia seed pudding with almonds', calories: 300 },
      { name: 'Lunch', description: 'Grilled tofu with mixed salad', calories: 350 },
      { name: 'Dinner', description: 'Herb-crusted white fish with steamed broccoli', calories: 320 }
    ]},
    { day: 'Thursday', meals: [
      { name: 'Breakfast', description: 'Greek yogurt with berries and granola', calories: 280 },
      { name: 'Lunch', description: 'Shrimp and mixed vegetable bowl', calories: 370 },
      { name: 'Dinner', description: 'Chicken breast with roasted sweet potato', calories: 390 }
    ]},
    { day: 'Friday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with fresh berries', calories: 320 },
      { name: 'Lunch', description: 'Mediterranean chickpea salad', calories: 350 },
      { name: 'Dinner', description: 'Lean turkey meatballs with zucchini noodles', calories: 380 }
    ]},
    { day: 'Saturday', meals: [
      { name: 'Breakfast', description: 'Avocado toast with poached eggs', calories: 300 },
      { name: 'Lunch', description: 'Grilled vegetable and lean protein wrap', calories: 370 },
      { name: 'Dinner', description: 'Baked cod with roasted brussels sprouts', calories: 340 }
    ]},
    { day: 'Sunday', meals: [
      { name: 'Breakfast', description: 'Smoothie bowl with mixed seeds', calories: 310 },
      { name: 'Lunch', description: 'Lean protein Buddha bowl', calories: 380 },
      { name: 'Dinner', description: 'Vegetable and chicken stir-fry', calories: 400 }
    ]}
  ],
  
  'Muscle Gain': [
    { day: 'Monday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with banana and almond butter', calories: 500 },
      { name: 'Lunch', description: 'Grilled chicken with brown rice and sweet potato', calories: 600 },
      { name: 'Dinner', description: 'Beef steak with roasted vegetables and quinoa', calories: 550 }
    ]},
    { day: 'Tuesday', meals: [
      { name: 'Breakfast', description: 'Egg white omelet with vegetables', calories: 250 },
      { name: 'Lunch', description: 'Turkey and quinoa bowl', calories: 380 },
      { name: 'Dinner', description: 'Lean beef stir-fry with cauliflower rice', calories: 400 }
    ]},
    { day: 'Wednesday', meals: [
      { name: 'Breakfast', description: 'Chia seed pudding with almonds', calories: 300 },
      { name: 'Lunch', description: 'Grilled tofu with mixed salad', calories: 350 },
      { name: 'Dinner', description: 'Herb-crusted white fish with steamed broccoli', calories: 320 }
    ]},
    { day: 'Thursday', meals: [
      { name: 'Breakfast', description: 'Greek yogurt with berries and granola', calories: 280 },
      { name: 'Lunch', description: 'Shrimp and mixed vegetable bowl', calories: 370 },
      { name: 'Dinner', description: 'Chicken breast with roasted sweet potato', calories: 390 }
    ]},
    { day: 'Friday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with fresh berries', calories: 320 },
      { name: 'Lunch', description: 'Mediterranean chickpea salad', calories: 350 },
      { name: 'Dinner', description: 'Lean turkey meatballs with zucchini noodles', calories: 380 }
    ]},
    { day: 'Saturday', meals: [
      { name: 'Breakfast', description: 'Avocado toast with poached eggs', calories: 300 },
      { name: 'Lunch', description: 'Grilled vegetable and lean protein wrap', calories: 370 },
      { name: 'Dinner', description: 'Baked cod with roasted brussels sprouts', calories: 340 }
    ]},
    { day: 'Sunday', meals: [
      { name: 'Breakfast', description: 'Smoothie bowl with mixed seeds', calories: 310 },
      { name: 'Lunch', description: 'Lean protein Buddha bowl', calories: 380 },
      { name: 'Dinner', description: 'Vegetable and chicken stir-fry', calories: 400 }
    ]}
   
  ],
  'Endurance': [
    { day: 'Monday', meals: [
      { name: 'Breakfast', description: 'Protein smoothie with spinach, berries, and whey protein', calories: 300 },
      { name: 'Lunch', description: 'Grilled chicken salad with mixed greens', calories: 400 },
      { name: 'Dinner', description: 'Baked salmon with roasted vegetables', calories: 350 }
    ]},
    { day: 'Tuesday', meals: [
      { name: 'Breakfast', description: 'Egg white omelet with vegetables', calories: 250 },
      { name: 'Lunch', description: 'Turkey and quinoa bowl', calories: 380 },
      { name: 'Dinner', description: 'Lean beef stir-fry with cauliflower rice', calories: 400 }
    ]},
    { day: 'Wednesday', meals: [
      { name: 'Breakfast', description: 'Chia seed pudding with almonds', calories: 300 },
      { name: 'Lunch', description: 'Grilled tofu with mixed salad', calories: 350 },
      { name: 'Dinner', description: 'Herb-crusted white fish with steamed broccoli', calories: 320 }
    ]},
    { day: 'Thursday', meals: [
      { name: 'Breakfast', description: 'Greek yogurt with berries and granola', calories: 280 },
      { name: 'Lunch', description: 'Shrimp and mixed vegetable bowl', calories: 370 },
      { name: 'Dinner', description: 'Chicken breast with roasted sweet potato', calories: 390 }
    ]},
    { day: 'Friday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with fresh berries', calories: 320 },
      { name: 'Lunch', description: 'Mediterranean chickpea salad', calories: 350 },
      { name: 'Dinner', description: 'Lean turkey meatballs with zucchini noodles', calories: 380 }
    ]},
    { day: 'Saturday', meals: [
      { name: 'Breakfast', description: 'Avocado toast with poached eggs', calories: 300 },
      { name: 'Lunch', description: 'Grilled vegetable and lean protein wrap', calories: 370 },
      { name: 'Dinner', description: 'Baked cod with roasted brussels sprouts', calories: 340 }
    ]},
    { day: 'Sunday', meals: [
      { name: 'Breakfast', description: 'Smoothie bowl with mixed seeds', calories: 310 },
      { name: 'Lunch', description: 'Lean protein Buddha bowl', calories: 380 },
      { name: 'Dinner', description: 'Vegetable and chicken stir-fry', calories: 400 }
    ]}
  ],
  
  'Flexibility': [
    { day: 'Monday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with banana and almond butter', calories: 500 },
      { name: 'Lunch', description: 'Grilled chicken with brown rice and sweet potato', calories: 600 },
      { name: 'Dinner', description: 'Beef steak with roasted vegetables and quinoa', calories: 550 }
    ]},
    { day: 'Tuesday', meals: [
      { name: 'Breakfast', description: 'Egg white omelet with vegetables', calories: 250 },
      { name: 'Lunch', description: 'Turkey and quinoa bowl', calories: 380 },
      { name: 'Dinner', description: 'Lean beef stir-fry with cauliflower rice', calories: 400 }
    ]},
    { day: 'Wednesday', meals: [
      { name: 'Breakfast', description: 'Chia seed pudding with almonds', calories: 300 },
      { name: 'Lunch', description: 'Grilled tofu with mixed salad', calories: 350 },
      { name: 'Dinner', description: 'Herb-crusted white fish with steamed broccoli', calories: 320 }
    ]},
    { day: 'Thursday', meals: [
      { name: 'Breakfast', description: 'Greek yogurt with berries and granola', calories: 280 },
      { name: 'Lunch', description: 'Shrimp and mixed vegetable bowl', calories: 370 },
      { name: 'Dinner', description: 'Chicken breast with roasted sweet potato', calories: 390 }
    ]},
    { day: 'Friday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with fresh berries', calories: 320 },
      { name: 'Lunch', description: 'Mediterranean chickpea salad', calories: 350 },
      { name: 'Dinner', description: 'Lean turkey meatballs with zucchini noodles', calories: 380 }
    ]},
    { day: 'Saturday', meals: [
      { name: 'Breakfast', description: 'Avocado toast with poached eggs', calories: 300 },
      { name: 'Lunch', description: 'Grilled vegetable and lean protein wrap', calories: 370 },
      { name: 'Dinner', description: 'Baked cod with roasted brussels sprouts', calories: 340 }
    ]},
    { day: 'Sunday', meals: [
      { name: 'Breakfast', description: 'Smoothie bowl with mixed seeds', calories: 310 },
      { name: 'Lunch', description: 'Lean protein Buddha bowl', calories: 380 },
      { name: 'Dinner', description: 'Vegetable and chicken stir-fry', calories: 400 }
    ]}
   
  ],
  'Overall Fitness': [
    { day: 'Monday', meals: [
      { name: 'Breakfast', description: 'Protein smoothie with spinach, berries, and whey protein', calories: 300 },
      { name: 'Lunch', description: 'Grilled chicken salad with mixed greens', calories: 400 },
      { name: 'Dinner', description: 'Baked salmon with roasted vegetables', calories: 350 }
    ]},
    { day: 'Tuesday', meals: [
      { name: 'Breakfast', description: 'Egg white omelet with vegetables', calories: 250 },
      { name: 'Lunch', description: 'Turkey and quinoa bowl', calories: 380 },
      { name: 'Dinner', description: 'Lean beef stir-fry with cauliflower rice', calories: 400 }
    ]},
    { day: 'Wednesday', meals: [
      { name: 'Breakfast', description: 'Chia seed pudding with almonds', calories: 300 },
      { name: 'Lunch', description: 'Grilled tofu with mixed salad', calories: 350 },
      { name: 'Dinner', description: 'Herb-crusted white fish with steamed broccoli', calories: 320 }
    ]},
    { day: 'Thursday', meals: [
      { name: 'Breakfast', description: 'Greek yogurt with berries and granola', calories: 280 },
      { name: 'Lunch', description: 'Shrimp and mixed vegetable bowl', calories: 370 },
      { name: 'Dinner', description: 'Chicken breast with roasted sweet potato', calories: 390 }
    ]},
    { day: 'Friday', meals: [
      { name: 'Breakfast', description: 'Protein pancakes with fresh berries', calories: 320 },
      { name: 'Lunch', description: 'Mediterranean chickpea salad', calories: 350 },
      { name: 'Dinner', description: 'Lean turkey meatballs with zucchini noodles', calories: 380 }
    ]},
    { day: 'Saturday', meals: [
      { name: 'Breakfast', description: 'Avocado toast with poached eggs', calories: 300 },
      { name: 'Lunch', description: 'Grilled vegetable and lean protein wrap', calories: 370 },
      { name: 'Dinner', description: 'Baked cod with roasted brussels sprouts', calories: 340 }
    ]},
    { day: 'Sunday', meals: [
      { name: 'Breakfast', description: 'Smoothie bowl with mixed seeds', calories: 310 },
      { name: 'Lunch', description: 'Lean protein Buddha bowl', calories: 380 },
      { name: 'Dinner', description: 'Vegetable and chicken stir-fry', calories: 400 }
    ]}
  ],
};
// Assuming DIET_PLANS is defined elsewhere
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WeeklyDietPlanPage() {
  const [userGoal, setUserGoal] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchUserGoal = async () => {
      try {
        const storedGoal = await SecureStore.getItemAsync('userData');
        if (storedGoal) {
          const parsedGoal = JSON.parse(storedGoal);
          setUserGoal(parsedGoal.goal);
          setDietPlan(DIET_PLANS[parsedGoal.goal]);
        }
      } catch (error) {
        console.error('Error fetching user goal:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGoal();
  }, []);

  const renderMealItem = (meal, index) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100)}
      key={index} 
      style={styles.mealCard}
    >
      <LinearGradient
        colors={['#FFFFFF', 'rgba(93, 106, 255, 0.2)']}
        style={styles.mealCardGradient}
      >
        <View style={styles.mealHeader}>
          <View style={styles.mealIconContainer}>
            <Ionicons 
              name={
                meal.name === 'Breakfast' ? 'sunny' :
                meal.name === 'Lunch' ? 'restaurant' :
                'moon'
              } 
              size={24} 
              color="#4A90E2" 
            />
          </View>
          <View style={styles.mealTitleContainer}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealCalories}>{meal.calories} Calories</Text>
          </View>
        </View>
        <Text style={styles.mealDescription}>{meal.description}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const DayNavigator = () => (
    <View style={styles.dayNavigatorContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayNavigatorScroll}
      >
        {dietPlan.map((dayPlan, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => {
              setActiveDay(index);
              carouselRef.current?.scrollTo({ index });
            }}
          >
            <LinearGradient
              colors={activeDay === index 
                ? ['#4A90E2', '#50C878'] 
                : ['#FFFFFF', '']
              }
              style={[
                styles.dayNavigatorItem,
                activeDay === index && styles.activeDayNavigatorItem
              ]}
            >
              <Text style={[
                styles.dayNavigatorText,
                activeDay === index && styles.activeDayNavigatorText
              ]}>
                {dayPlan.day.substring(0, 3)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient 
        colors={['#4A90E2', 'rgba(93, 106, 255, 0.8)']} 
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/originals/c8/ab/61/c8ab614eb7f602cf471e1fdefd06f8a1.jpg',
      }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#4A90E2', 'rgba(93, 106, 255, 0.8)']}
            style={styles.headerContainer}
          >
            <View style={styles.headerContent}>
              <Ionicons name="nutrition" size={30} color="white" />
              <Text style={styles.headerTitle}>Nutrition Roadmap</Text>
              <Text style={styles.headerSubtitle}>Personalized {userGoal} Strategy</Text>
            </View>
          </LinearGradient>

          <DayNavigator />

          <Carousel
            ref={carouselRef}
            width={SCREEN_WIDTH}
            height={SCREEN_WIDTH * 1.2}
            data={dietPlan}
            scrollAnimationDuration={500}
            onProgressChange={(_, absoluteProgress) => {
              setActiveDay(Math.round(absoluteProgress));
            }}
            renderItem={({ item: dayPlan, index }) => (
              <View style={styles.carouselItemContainer}>
                <View style={styles.dayContainer}>
                  <View style={styles.dayHeader}>
                    <Ionicons 
                      name={
                        dayPlan.day === 'Monday' ? 'calendar' :
                        dayPlan.day === 'Tuesday' ? 'calendar-outline' :
                        'calendar'
                      } 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.dayTitle}>{dayPlan.day}</Text>
                  </View>
                  <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {dayPlan.meals.map(renderMealItem)}
                  </ScrollView>
                </View>
              </View>
            )}
          />
        </View>
      </View>
      <BottomBar/>
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
    backgroundColor: 'rgba(255,255,255,0.1)', // Adds a semi-transparent white overlay
  },

  dayNavigatorContainer: {
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  dayNavigatorScroll: {
    paddingHorizontal: 15,
  },
  dayNavigatorItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeDayNavigatorItem: {
    transform: [{ scale: 1.1 }],
  },
  dayNavigatorText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  activeDayNavigatorText: {
    color: 'white',
  },
  mealCardGradient: {
    borderRadius: 15,
    padding: 0,
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: -10,
    marginTop:40
  },
  dayContainer: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH - 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    maxHeight: SCREEN_WIDTH * 1.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginTop: 5,
  },
  scrollViewContent: {
    paddingBottom: 0,
  },
  dayHeader: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dayTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 10,
  },
  mealCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealIconContainer: {
    marginRight: 15,
    backgroundColor: '#E6F2FF',
    borderRadius: 30,
    padding: 10,
  },
  mealTitleContainer: {
    flex: 1,
  },
  mealName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  mealCalories: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  mealDescription: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F4F8',
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  noticeText: {
    color: '#7F8C8D',
    marginLeft: 10,
    fontSize: 16,
    fontStyle: 'italic',
  },
});