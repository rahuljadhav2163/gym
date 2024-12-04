import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BottomBar from './bottombar';
import GymChart from './gymchart';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [showChart, setShowChart] = useState(false);

    const fetchUserData = async () => {
        try {
            const storedData = await SecureStore.getItemAsync('userData');
            if (storedData) {
                setUserData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Unable to fetch user data');
        }
    };

    const saveUpdatedData = async () => {
        try {
            // Validate input fields
            if (!editData.name || !editData.mobile) {
                Alert.alert('Validation Error', 'Name and Mobile are required fields');
                return;
            }

            await SecureStore.setItemAsync('userData', JSON.stringify(editData));
            setUserData(editData);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error saving updated profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    // Logout functionality with confirmation
    const handleLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await SecureStore.deleteItemAsync('userData');
                            await SecureStore.deleteItemAsync('isLoggedIn');
                            router.replace('/login');
                        } catch (error) {
                            console.error('Error during logout:', error);
                            Alert.alert('Error', 'Failed to log out');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // If userData is not available, show the default profile page

    const toggleChart = () => setShowChart(!showChart);
    if (!userData) {
        return (
            <>
                <LinearGradient 
                    colors={['#4169E1', '#1A4B84']} 
                    style={styles.container}
                >

                    
                    <View style={styles.headerGradient}>
                        <Text style={styles.headerText}>Welcome to FitTrack</Text>
                        <Text style={styles.subHeaderText}>
                            Track your fitness journey with personalized insights
                        </Text>
                    </View>
                    <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Your Progress</Text>
                            <GymChart />
                        </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.logInButton]}
                            onPress={toggleChart} // Show chart on button press
                        >
                            <Feather name="log-in" size={24} color="#fff" onPress={()=>{router.push('/login')}} />
                            <Text style={styles.buttonText} onPress={()=>{router.push('/login')}}>User</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.signUpButton]}
                            onPress={toggleChart} // Show chart on button press
                        >
                            <Feather name="user-plus" size={24} color="#4169E1" onPress={()=>{router.push('/signup')}} />
                            <Text style={[styles.buttonText, styles.signUpButtonText]} onPress={()=>{router.push('/signup')}}>Admin</Text>
                        </TouchableOpacity>
                    </View>

                   
                     
                        
                    
                     
                </LinearGradient>
                <BottomBar />
            </>
        );
    }

    // Render user profile with edit option
    return (
        <>
            <LinearGradient 
                colors={['#4169E1', '#1A4B84']} 
                style={styles.container}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerGradient}>
                        <Text style={styles.headerText}>
                            Welcome, {userData.name || 'User'}
                        </Text>
                    </View>

                    <View style={styles.profileDetails}>
                        <ProfileDetailItem 
                            icon="user" 
                            label="Name" 
                            value={userData.name || 'Not Available'} 
                        />
                        <ProfileDetailItem 
                            icon="phone" 
                            label="Mobile" 
                            value={userData.mobile || 'Not Available'} 
                        />
                        <ProfileDetailItem 
                            icon="info" 
                            label="Height" 
                            value={userData.height ? `${userData.height} cm` : 'Not Set'} 
                        />
                        <ProfileDetailItem 
                            icon="info" 
                            label="Weight" 
                            value={userData.weight ? `${userData.weight} kg` : 'Not Set'} 
                        />
                        <ProfileDetailItem 
                            icon="user" 
                            label="Gender" 
                            value={userData.gender || 'Not Set'} 
                        />
                        <ProfileDetailItem 
                            icon="target" 
                            label="Fitness Goal" 
                            value={userData.fitnessGoal || 'Not Set'} 
                        />
                    </View>

                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => {
                                setEditData({...userData});
                                setIsEditing(true);
                            }}
                        >
                            <Feather name="edit" size={24} color="#fff" />
                            <Text style={styles.actionButtonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={handleLogout}
                        >
                            <Feather name="log-out" size={24} color="#fff" />
                            <Text style={styles.actionButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>

            <EditProfileModal 
                visible={isEditing}
                editData={editData}
                setEditData={setEditData}
                onSave={saveUpdatedData}
                onCancel={() => setIsEditing(false)}
            />

            <BottomBar />
        </>
    );
};

// Reusable component for profile detail items
const ProfileDetailItem = ({ icon, label, value }) => (
    <View style={styles.profileItem}>
        <Feather name={icon} size={24} color="#333" />
        <View style={styles.profileItemText}>
            <Text style={styles.profileDetailLabel}>{label}:</Text>
            <Text style={styles.profileText}>{value}</Text>
        </View>
    </View>
);

// Modal for editing profile
const EditProfileModal = ({ 
    visible, 
    editData, 
    setEditData, 
    onSave, 
    onCancel 
}) => (
    <Modal 
        visible={visible} 
        animationType="slide" 
        transparent={true}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.editFormTitle}>Edit Profile</Text>
                <ScrollView 
                    contentContainerStyle={styles.editForm}
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileInput
                        placeholder="Name"
                        value={editData.name}
                        onChangeText={(text) => setEditData({ ...editData, name: text })}
                    />
                    <ProfileInput
                        placeholder="Mobile"
                        value={editData.mobile}
                        onChangeText={(text) => setEditData({ ...editData, mobile: text })}
                        keyboardType="phone-pad"
                    />
                    <ProfileInput
                        placeholder="Height (cm)"
                        value={editData.height}
                        onChangeText={(text) => setEditData({ ...editData, height: text })}
                        keyboardType="numeric"
                    />
                    <ProfileInput
                        placeholder="Weight (kg)"
                        value={editData.weight}
                        onChangeText={(text) => setEditData({ ...editData, weight: text })}
                        keyboardType="numeric"
                    />
                    <ProfileInput
                        placeholder="Gender"
                        value={editData.gender}
                        onChangeText={(text) => setEditData({ ...editData, gender: text })}
                    />
                    <ProfileInput
                        placeholder="Fitness Goal"
                        value={editData.fitnessGoal}
                        onChangeText={(text) => setEditData({ ...editData, fitnessGoal: text })}
                    />

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={onSave}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    </Modal>
);

// Reusable input component
const ProfileInput = (props) => (
    <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        {...props}
    />
);

const styles = StyleSheet.create({
    chartContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
    },
    headerGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        width: '100%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop:50
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'yellow',
        marginBottom: 10,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    profileDetails: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    profileItemText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    profileDetailLabel: {
        fontSize: 16,
        color: '#666',
        marginRight: 5,
    },
    profileText: {
        fontSize: 18,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop:70
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '48%',
        justifyContent: 'center',
    },
    logInButton: {
        backgroundColor: '#4169E1',
    },
    signUpButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4169E1',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    signUpButtonText: {
        color: '#4169E1',
    },
    actionButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '85%',
        marginTop: 20,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffa500',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
    },
    editFormTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    editForm: {
        paddingBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#4169E1',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '48%',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#ff4444',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '48%',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Profile;