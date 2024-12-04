import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Importing LinearGradient
import BottomBar from './bottombar';
import Header from './header';

const DietPlanScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('weightLoss');

  const mealPlans = {
    weightLoss: {
      color: '#4CAF50',
      breakfast: [
        "Greek yogurt with berries and chia seeds",
        "Vegetable omelet with spinach and feta",
        "Protein smoothie with banana and almond milk"
      ],
      lunch: [
        "Grilled chicken salad with mixed greens",
        "Quinoa bowl with roasted vegetables",
        "Turkey and avocado wrap"
      ],
      dinner: [
        "Baked salmon with roasted asparagus",
        "Lean beef stir-fry with brown rice",
        "Vegetarian lentil curry"
      ]
    },
    muscleGain: {
      color: '#2196F3',
      breakfast: [
        "High-protein pancakes with whey protein",
        "Scrambled eggs with whole wheat toast",
        "Overnight oats with protein powder"
      ],
      lunch: [
        "Grilled chicken breast with sweet potato",
        "Tuna salad with whole grain bread",
        "Beef and black bean burrito"
      ],
      dinner: [
        "Grilled steak with quinoa",
        "Salmon with brown rice and broccoli",
        "Chicken and vegetable pasta"
      ]
    }
  };

  const nutritionInfo = {
    weightLoss: {
      calories: "1500-1800 per day",
      protein: "100-120g",
      carbs: "150-180g",
      fat: "45-60g"
    },
    muscleGain: {
      calories: "2500-3000 per day",
      protein: "180-220g",
      carbs: "300-350g",
      fat: "70-90g"
    }
  };

  return (
  <> <Header />
    <LinearGradient 
    colors={['#4169E1', '#000000']} // Choose your gradient colors
      style={styles.container} // Applying the LinearGradient to the container
    >
     
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Personalized Nutrition Plan</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: selectedPlan === 'weightLoss' ? mealPlans.weightLoss.color : '#E0E0E0' }]}
            onPress={() => setSelectedPlan('weightLoss')}
          >
            <Text style={[styles.tabText, { color: selectedPlan === 'weightLoss' ? 'white' : 'black' }]}>
              Weight Loss
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, { backgroundColor: selectedPlan === 'muscleGain' ? mealPlans.muscleGain.color : '#E0E0E0' }]}
            onPress={() => setSelectedPlan('muscleGain')}
          >
            <Text style={[styles.tabText, { color: selectedPlan === 'muscleGain' ? 'white' : 'black' }]}>
              Muscle Gain
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionContainer, { borderLeftColor: mealPlans[selectedPlan].color }]}>
          <Text style={styles.sectionTitle}>Meal Plan</Text>
          {['breakfast', 'lunch', 'dinner'].map((mealType) => (
            <View key={mealType}>
              <Text style={styles.mealTypeTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Options</Text>
              {mealPlans[selectedPlan][mealType].map((meal, index) => (
                <Text key={index} style={styles.mealItem}>• {meal}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={[styles.nutritionContainer, { borderLeftColor: mealPlans[selectedPlan].color }]}>
          <Text style={styles.sectionTitle}>Nutrition Overview</Text>
          {Object.entries(nutritionInfo[selectedPlan]).map(([key, value]) => (
            <View key={key} style={styles.nutritionItemContainer}>
              <Text style={styles.nutritionKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Text style={styles.nutritionValue}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
    </LinearGradient>
    <BottomBar />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  scrollContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5
  },
  tabText: {
    fontWeight: 'bold'
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#34495E'
  },
  mealItem: {
    marginLeft: 10,
    marginBottom: 5,
    color: '#2C3E50'
  },
  nutritionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 5
  },
  nutritionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1'
  },
  nutritionKey: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50'
  },
  nutritionValue: {
    fontSize: 16,
    color: '#7F8C8D'
  }
});

export default DietPlanScreen;
