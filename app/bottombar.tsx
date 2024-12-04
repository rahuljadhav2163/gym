import React from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Link, usePathname } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const WINDOW_WIDTH = Dimensions.get('window').width;

// Using the same color scheme as the main dashboard
const colorSchemes = {
  background: ['#1A1A2E', '#16213E'],
  active: ['#4E54C8', '#8F94FB'],
  inactive: '#A0AEC0'
};

const BottomBar = () => {
  const pathname = usePathname();

  return (
    <LinearGradient
      colors={colorSchemes.background}
      style={styles.container}
    >
      <NavButton 
        title="Home" 
        iconName="home" 
        route="/" 
        isActive={pathname === '/'} 
      />
      <NavButton 
        title="Activity" 
        iconName="options" 
        route="/profile" 
        isActive={pathname === ''} 
      />
      <NavButton 
        title="Trainer" 
        iconName="barbell-outline" 
        route="/aitrainer" 
        isActive={pathname === '/aitrainer'} 
      />
      <NavButton 
        title="Sub" 
        iconName="logo-medium" 
        route="/membership" 
        isActive={pathname === '/membership'} 
      />
      
      <NavButton 
        title="Profile" 
        iconName="log-in" 
        route="/profile" 
        isActive={pathname === '/profile'} 
      />
    </LinearGradient>
  );
};

const NavButton = ({ title, iconName, route, isActive }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Link 
      href={route} 
      style={styles.button}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.iconContainer,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {isActive ? (
          <LinearGradient
            colors={colorSchemes.active}
            style={styles.activeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon 
              name={iconName} 
              size={24} 
              color="#FFFFFF"
            />
          </LinearGradient>
        ) : (
          <View style={styles.inactiveIconContainer}>
            <Icon 
              name={iconName} 
              size={24} 
              color={colorSchemes.inactive}
            />
          </View>
        )}
        <Text style={[
          styles.buttonText,
          isActive && styles.activeButtonText
        ]}>
          {title}
        </Text>
      </Animated.View>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    maxWidth: WINDOW_WIDTH / 5,
    marginLeft:13
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    
  },
  activeGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4E54C8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  inactiveIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  buttonText: {
    fontSize: 12,
    color: colorSchemes.inactive,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default BottomBar;