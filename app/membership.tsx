import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import BottomBar from './bottombar';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = 16;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

const BenefitItem = ({ benefit }) => (
  <View style={styles.benefitContainer}>
    <View style={styles.checkIconWrapper}>
      <Ionicons name="checkmark-circle" size={22} color="#fff" />
    </View>
    <Text style={styles.benefit}>{benefit}</Text>
  </View>
);

const MembershipCard = React.memo(({ membership, index, scrollX }) => {
  const inputRange = [
    (index - 1) * (CARD_WIDTH + SPACING),
    index * (CARD_WIDTH + SPACING),
    (index + 1) * (CARD_WIDTH + SPACING),
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.4, 1, 0.4],
    extrapolate: 'clamp',
  });

  return (
    <AnimatedLinearGradient
      colors={membership.color}
      style={[
        styles.card,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{membership.title}</Text>
          <Text style={styles.price}>{membership.price}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.benefitsSection}>
          <Text style={styles.subHeader}>Benefits</Text>
          <View style={styles.benefitsList}>
            {membership.benefits.map((benefit, i) => (
              <BenefitItem key={i} benefit={benefit} />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.selectButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selectButtonGradient}
          >
            <Text style={styles.selectButtonText}>Select Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </AnimatedLinearGradient>
  );
});

const Membership = () => {
  const [scrollX] = useState(new Animated.Value(0));

  const memberships = useMemo(
    () => [
      {
        title: 'Basic',
        price: '₹49/month',
        benefits: [
          'Access to gym facilities',
          'Free group classes',
          '1 personal training session',
          'Locker room access',
          'Fitness assessment',
          'Mobile app access',
        ],
        color: ['#4776E6', '#8E54E9'],
      },
      {
        title: 'Standard',
        price: '₹99/month',
        benefits: [
          'All Basic benefits',
          'Unlimited group classes',
          '2 personal training sessions',
          'Nutrition guidance',
          'Recovery zone access',
          'Guest passes (2/month)',
        ],
        color: ['#FF8008', '#FFC837'],
      },
      {
        title: 'Premium',
        price: '₹149/month',
        benefits: [
          'All Standard benefits',
          '24/7 gym access',
          'Unlimited training sessions',
          'Priority class booking',
          'Spa access',
          'Free merchandise',
        ],
        color: ['#56CCF2', '#2F80ED'],
      },
    ],
    []
  );

  const renderMembershipCard = useCallback(
    ({ item, index }) => (
      <MembershipCard membership={item} index={index} scrollX={scrollX} />
    ),
    [scrollX]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/dumbbells-floor-gym-ai-generative_123827-23744.jpg?w=740&t=st=1683065681~exp=1683066281~hmac=f118148315fae3acde1e1a5b6cbf8baa9a626dd2dcd42349db7b464d3cd43634' }} // Replace with your image URL
        style={styles.backgroundImage}
        blurRadius={0} 
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Membership</Text>
            <Text style={styles.headerSubtitle}>Choose your perfect plan</Text>
          </View>

          <Animated.FlatList
            data={memberships}
            renderItem={renderMembershipCard}
            keyExtractor={(item) => item.title}
            horizontal
            pagingEnabled
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardContainer}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          />
          
          <BottomBar />
        </LinearGradient>
      </AnimatedImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  background: {
    flex: 1,
    paddingTop: 40,
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 540,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: SPACING / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  blurOverlay: {
    flex: 1,
    padding: 24,
  },
  cardHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 20,
  },
  benefitsSection: {
    flex: 1,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  benefitsList: {
    flex: 1,
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefit: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    lineHeight: 22,
  },
  selectButton: {
    marginTop: 24,
    overflow: 'hidden',
    borderRadius: 16,
  },
  selectButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default Membership;