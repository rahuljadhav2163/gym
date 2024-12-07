import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    totalMembers: 50,
    newMembers: 5,
    revenue: 5000,
    activeClasses: 3,
    membershipTypes: {
      basic: 40,
      premium: 20,
      vip: 10
    }
  });

  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    membershipType: 'basic'
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://192.168.1.3:5000/api/getAllUsers');

      // Check if response status is okay
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Parse JSON data
      const users = await response.json();

      // Update states
      setMembers(users);
      setStats(prevStats => ({
        ...prevStats,
        totalMembers: users.length,
        activeMembers: users.filter(user => user.goal).length,
      }));
      setError(null);
    } catch (err) {
      console.error('Fetch Error:', err); // Log error for debugging
      setError(err.message);
      Alert.alert('Error', `Could not fetch users: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  // Initial and refresh data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  const [addWorkoutModalVisible, setAddWorkoutModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0], // Default to current date
    workoutName: '',
    time: '',
    memberId: null
  });

  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  const handleAddWorkout = async () => {
    if (isAddingWorkout)
      return;

    setIsAddingWorkout(true);

    try {
      const workoutPayload = {
        phone: selectedMember.phone,
        workout: {
          type: newWorkout.workoutName,
          duration: newWorkout.time,
          workout: newWorkout.workoutName,
          date: new Date(newWorkout.date).toISOString()
        }
      };

      const response = await fetch('http://192.168.1.3:5000/api/addworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutPayload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add workout');
      }

      Alert.alert('Success', 'Workout added successfully');
      setAddWorkoutModalVisible(false)
    } catch (error) {
      console.error('Error adding workout:', error);
      Alert.alert('Error', error.message || 'Failed to add workout');
    } finally {
      setIsAddingWorkout(false);
    }
  };
 

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers().then(() => setRefreshing(false));
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.3:5000/api/deluser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete user');
      }

      // Remove the deleted user from the members array
      setMembers(members.filter(member => member._id !== userId));

      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', error.message || 'Failed to delete user');
    }
  };

  const recentlyJoinedUsers = members
    .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
    .slice(0, 4);

  // Render Dashboard with Gradient Cards
  const renderDashboard = () => (
    
    <ScrollView
      style={styles.dashboardContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3498db', '#2ecc71']}
        />
      }
    >
      <View style={styles.statsRow}>
        <LinearGradient
          colors={['#3498db', '#2980b9']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="people" size={30} color="white" />
          <Text style={styles.statTitle}>Total Members</Text>
          <Text style={styles.statValue}>{stats.totalMembers}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#2ecc71', '#27ae60']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="fitness" size={30} color="white" />
          <Text style={styles.statTitle}>Active Members</Text>
          <Text style={styles.statValue}>{stats.activeMembers}</Text>
        </LinearGradient>
      </View>

      <View style={styles.statsRow}>
        <LinearGradient
          colors={['#9b59b6', '#8e44ad']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="cash" size={30} color="white" />
          <Text style={styles.statTitle}>Monthly Revenue</Text>
          <Text style={styles.statValue}>${stats.revenue.toLocaleString()}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#f39c12', '#d35400']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="calendar" size={30} color="white" />
          <Text style={styles.statTitle}>Active Classes</Text>
          <Text style={styles.statValue}>{stats.activeClasses}</Text>
        </LinearGradient>
      </View>

      <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recently join Members</Text>
          <View style={styles.recentMembersContainer}>
            {recentlyJoinedUsers.map((user, index) => (
              <View 
                key={user._id} 
                style={[
                  styles.recentMemberCard, 
                  index === recentlyJoinedUsers.length - 1 && styles.lastRecentMemberCard
                ]}
              >
                <View style={styles.recentMemberAvatarContainer}>
                  <LinearGradient
                    colors={['#6A5ACD', '#5D3FD3']}
                    style={styles.recentMemberAvatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.recentMemberAvatarText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.recentMemberDetails}>
                  <Text style={styles.recentMemberName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={styles.recentMemberSubtitle}>
                    {user.membershipType?.toUpperCase() || 'BASIC'} Membership
                  </Text>
                  <Text style={styles.recentMemberDate}>
                    Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity style={styles.recentMemberAction}>
                  <Ionicons name="chevron-forward" size={24} color="#5D3FD3" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
    </ScrollView>
  );


  const renderMembers = () => (
    <View style={styles.membersContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search members by name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#7f8c8d"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3498db', '#2ecc71']}
            />
          }
        >
          {filteredMembers.map(member => (
          <View key={member._id} style={styles.enhancedMemberCard}>
              <View style={styles.memberCardHeader}>
                <View style={styles.memberAvatarContainer}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberHeaderInfo}>
                  <Text style={styles.memberCardName}>{member.name}</Text>
                  <Text style={styles.memberCardMembership}>
                    {member.membershipType?.toUpperCase() || 'BASIC'} Membership
                  </Text>
                </View>
                <View style={styles.memberCardBadge}>
                  <Ionicons name="fitness" size={20} color="#3498db" />
                </View>
              </View>
              
              <View style={styles.memberCardBody}>
                <View style={styles.memberCardStatsContainer}>
                  <View style={styles.memberCardStat}>
                    <Text style={styles.memberCardStatLabel}>Goal</Text>
                    <Text style={styles.memberCardStatValue}>
                      {member.goal || 'Not Set'}
                    </Text>
                  </View>
                  <View style={styles.memberCardStat}>
                    <Text style={styles.memberCardStatLabel}>Height</Text>
                    <Text style={styles.memberCardStatValue}>
                      {member.height} cm
                    </Text>
                  </View>
                  <View style={styles.memberCardStat}>
                    <Text style={styles.memberCardStatLabel}>Weight</Text>
                    <Text style={styles.memberCardStatValue}>
                      {member.weight} kg
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.memberCardFooter}>
              <TouchableOpacity 
                style={styles.memberCardAction}
                onPress={() => {
                  setSelectedMember(member);
                  setAddWorkoutModalVisible(true);
                }}
              >
                <Ionicons name="add-circle" size={18} color="#2ecc71" />
                <Text style={styles.memberCardActionText}>Add Workout</Text>
              </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.memberCardAction, styles.deleteMemberAction]}
                  onPress={() => {
                    Alert.alert(
                      'Confirm Deletion',
                      `Are you sure you want to delete ${member.name}?`,
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => handleDeleteUser(member._id)
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash" size={18} color="#e74c3c" />
                  <Text style={[styles.memberCardActionText, { color: '#e74c3c' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        transparent={true}
        visible={addWorkoutModalVisible}
        animationType="slide"
        onRequestClose={() => setAddWorkoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Workout for {selectedMember?.name}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Date"
              value={newWorkout.date}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, date: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Workout Name"
              value={newWorkout.workoutName}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, workoutName: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 45 min)"
              value={newWorkout.time}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, time: text })}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setAddWorkoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddWorkout}
              >
                <Text style={styles.modalButtonTextPrimary}>Add Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );




  <Modal
    transparent={true}

    animationType="slide"
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add New Member</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#b3b3b3"
          value={newMember.name}
          onChangeText={(text) => setNewMember({ ...newMember, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#b3b3b3"
          value={newMember.email}
          onChangeText={(text) => setNewMember({ ...newMember, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.membershipTypeContainer}>
          {['Basic', 'Premium', 'VIP'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.membershipTypeButton,
                newMember.membershipType.toLowerCase() === type.toLowerCase() &&
                styles.selectedMembershipType
              ]}
              onPress={() => setNewMember({ ...newMember, membershipType: type.toLowerCase() })}
            >
              <Text style={[
                styles.membershipTypeText,
                newMember.membershipType.toLowerCase() === type.toLowerCase() &&
                styles.selectedMembershipTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setAddMemberModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}

            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.modalButtonTextPrimary}>Add Member</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2c3e50', '#34495e']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Gym Management Dashboard</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        {[
          { key: 'dashboard', label: 'Dashboard', icon: 'stats-chart' },
          { key: 'members', label: 'Members', icon: 'people' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={selectedTab === tab.key ? '#3498db' : '#7f8c8d'}
            />
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab === 'dashboard' && renderDashboard()}
      {selectedTab === 'members' && renderMembers()}


    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  quickStatsContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  quickStatsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#5D3FD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatTitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.8,
  },
  quickStatValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  recentMembersContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentMemberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastRecentMemberCard: {
    borderBottomWidth: 0,
  },
  recentMemberAvatarContainer: {
    marginRight: 15,
  },
  recentMemberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5D3FD3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recentMemberAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recentMemberDetails: {
    flex: 1,
  },
  recentMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  recentMemberSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 3,
  },
  recentMemberDate: {
    fontSize: 11,
    color: '#95A5A6',
    marginTop: 3,
  },
  recentMemberAction: {
    padding: 5,
  },
  recentlyJoinedContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  recentUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentUserAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recentUserInfo: {
    flex: 1,
  },
  recentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  recentUserDetail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  recentUserDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 5,
  },
  deleteMemberAction: {
    marginLeft: 10,
    borderColor: '#e74c3c',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  enhancedMemberCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 15
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1'
  },
  memberAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  memberAvatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  memberHeaderInfo: {
    flex: 1
  },
  memberCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  memberCardMembership: {
    fontSize: 12,
    color: '#7f8c8d'
  },
  memberCardBadge: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.1)'
  },
  memberCardBody: {
    marginBottom: 15
  },
  memberCardStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  memberCardStat: {
    alignItems: 'center',
    flex: 1
  },
  memberCardStatLabel: {
    color: '#7f8c8d',
    fontSize: 12,
    marginBottom: 5
  },
  memberCardStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  memberCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10
  },
  memberCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f1f2f6'
  },
  memberCardActionText: {
    marginLeft: 8,
    color: '#3498db',
    fontWeight: '600'
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    elevation: 2
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  addWorkoutText: {
    color: '#3498db',
    marginLeft: 5,
    fontWeight: '600'
  },
  enrollmentText: {
    color: 'white',
    fontWeight: 'bold'
  },

  container: {
    flex: 1,
    backgroundColor: '#f4f6f9'
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center',
    elevation: 5
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 3
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8
  },
  tabEmoji: {
    fontSize: 18
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3498db'
  },
  tabText: {
    color: '#7f8c8d',
    fontWeight: '600'
  },
  activeTabText: {
    color: '#3498db'
  },
  dashboardContainer: {
    padding: 15
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 10
  },
  statTitle: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  chartContainer: {
    height: 150,
    justifyContent: 'center'
  },
  chartBar: {
    height: 40,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10
  },
  chartBarText: {
    color: 'white',
    fontWeight: 'bold'
  },
  membersContainer: {
    flex: 1,
    padding: 15
  },
  addMemberButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  addMemberText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8
  },
  memberCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  memberDetails: {
    color: '#7f8c8d',
    marginTop: 5
  },
  memberActions: {
    flexDirection: 'row',
    gap: 15
  },
  actionText: {
    fontSize: 18
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },
  membershipTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  membershipTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
    borderRadius: 8
  },
  selectedMembershipType: {
    backgroundColor: '#3498db',
    borderColor: '#3498db'
  },
  membershipTypeText: {
    fontWeight: 'bold',
    color: 'black'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5
  },
  modalButtonPrimary: {
    backgroundColor: '#3498db'
  },
  modalButtonText: {
    color: '#3498db',
    fontWeight: 'bold'
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default AdminDashboard;