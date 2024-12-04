import React, { useState, useCallback, useMemo } from 'react';
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
  // State Management with More Comprehensive Data
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
  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [isAddWorkoutModalVisible, setAddWorkoutModalVisible] = useState(false);
  const [isAddClassModalVisible, setAddClassModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    membershipType: 'basic'
  });

  
  const [newWorkout, setNewWorkout] = useState({
    memberId: null,
    memberName: '',
    workoutType: '',
    duration: '',
    intensity: 'moderate'
  });

  const [newClass, setNewClass] = useState({
    name: '',
    instructor: '',
    schedule: '',
    capacity: '',
    difficulty: 'beginner'
  });

  const [members, setMembers] = useState([
    { id: 1, name: 'Ram Kadam', membershipType: 'Premium', joinDate: '2024-01-15', workouts: [] },
    { id: 2, name: 'Sham Pawar', membershipType: 'Basic', joinDate: '2024-02-20', workouts: [] },
    { id: 3, name: 'Akshay Kumar', membershipType: 'VIP', joinDate: '2024-03-10', workouts: [] }
  ]); const [classes, setClasses] = useState([
    { 
      id: 1, 
      name: 'Cardio Blast', 
      instructor: 'John Doe', 
      schedule: 'Mon/Wed 6 AM', 
      capacity: 20, 
      currentEnrollment: 15,
      difficulty: 'intermediate'
    },
    { 
      id: 2, 
      name: 'Yoga Flow', 
      instructor: 'Jane Smith', 
      schedule: 'Tue/Thu 7 PM', 
      capacity: 15, 
      currentEnrollment: 12,
      difficulty: 'beginner'
    }
  ]);

  // Simulated data refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate data fetch or update
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.membershipType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Add Member Function with Enhanced Validation
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newMemberData = {
        ...newMember,
        id: members.length + 1,
        joinDate: new Date().toISOString().split('T')[0],
        workouts: []
      };
      setMembers([...members, newMemberData]);
      setAddMemberModalVisible(false);
      setNewMember({ name: '', email: '', membershipType: 'basic' });
      setIsLoading(false);
    }, 1500);
  };

  const handleAddWorkout = () => {
    if (!newWorkout.workoutType || !newWorkout.duration) {
      Alert.alert('Error', 'Please fill in all workout details');
      return;
    }

    const memberIndex = members.findIndex(m => m.id === newWorkout.memberId);
    if (memberIndex !== -1) {
      const updatedMembers = [...members];
      updatedMembers[memberIndex].workouts.push({
        ...newWorkout,
        date: new Date().toISOString().split('T')[0]
      });
      setMembers(updatedMembers);
      setAddWorkoutModalVisible(false);
      setNewWorkout({ memberId: null, memberName: '', workoutType: '', duration: '', intensity: 'moderate' });
    }
  };


  const handleAddClass = () => {
    if (!newClass.name || !newClass.instructor || !newClass.schedule) {
      Alert.alert('Error', 'Please fill in all class details');
      return;
    }

    const classToAdd = {
      ...newClass,
      id: classes.length + 1,
      currentEnrollment: 0
    };
    setClasses([...classes, classToAdd]);
    setAddClassModalVisible(false);
    setNewClass({ name: '', instructor: '', schedule: '', capacity: '', difficulty: 'beginner' });
  };

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
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          <Ionicons name="people" size={30} color="white" />
          <Text style={styles.statTitle}>Total Members</Text>
          <Text style={styles.statValue}>{stats.totalMembers}</Text>
        </LinearGradient>

        <LinearGradient 
          colors={['#2ecc71', '#27ae60']} 
          style={styles.statCard}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          <Ionicons name="cash" size={30} color="white" />
          <Text style={styles.statTitle}>Monthly Revenue</Text>
          <Text style={styles.statValue}>${stats.revenue.toLocaleString()}</Text>
        </LinearGradient>
      </View>

      <View style={styles.statsRow}>
        <LinearGradient 
          colors={['#9b59b6', '#8e44ad']} 
          style={styles.statCard}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          <Ionicons name="add-circle" size={30} color="white" />
          <Text style={styles.statTitle}>New Members</Text>
          <Text style={styles.statValue}>{stats.newMembers}</Text>
        </LinearGradient>

        <LinearGradient 
          colors={['#f39c12', '#d35400']} 
          style={styles.statCard}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          <Ionicons name="fitness" size={30} color="white" />
          <Text style={styles.statTitle}>Active Classes</Text>
          <Text style={styles.statValue}>{stats.activeClasses}</Text>
        </LinearGradient>
      </View>

      {/* Enhanced Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Active Classes</Text>
        {classes.map(classItem => (
          <View key={classItem.id} style={styles.classItem}>
            <View>
              <Text style={styles.className}>{classItem.name}</Text>
              <Text style={styles.classDetails}>
                {classItem.instructor} | {classItem.schedule}
              </Text>
            </View>
            <View style={styles.classEnrollment}>
              <Text style={styles.enrollmentText}>
                {classItem.currentEnrollment}/{classItem.capacity}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );


  // Render Members with Enhanced UI
  const renderMembers = () => (
    <View style={styles.membersContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search members..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#7f8c8d"
      />

      <TouchableOpacity 
        style={styles.addMemberButton}
        onPress={() => setAddMemberModalVisible(true)}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addMemberText}>Add New Member</Text>
      </TouchableOpacity>

      <ScrollView>
        {filteredMembers.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberDetails}>
                {member.membershipType} | Joined: {member.joinDate}
              </Text>
              <TouchableOpacity
                style={styles.addWorkoutButton}
                onPress={() => {
                  setNewWorkout({ 
                    memberId: member.id, 
                    memberName: member.name, 
                    workoutType: '', 
                    duration: '', 
                    intensity: 'moderate' 
                  });
                  setAddWorkoutModalVisible(true);
                }}
              >
                <Ionicons name="fitness" size={18} color="#3498db" />
                <Text style={styles.addWorkoutText}>Add Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal
        transparent={true}
        visible={isAddWorkoutModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Workout for {newWorkout.memberName}</Text>
            <TextInput
              style={styles.input}
              placeholder="Workout Type (e.g., Cardio, Strength)"
              value={newWorkout.workoutType}
              onChangeText={(text) => setNewWorkout({...newWorkout, workoutType: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              value={newWorkout.duration}
              onChangeText={(text) => setNewWorkout({...newWorkout, duration: text})}
              keyboardType="numeric"
            />
            <View style={styles.membershipTypeContainer}>
              {['Light', 'Moderate', 'Intense'].map(intensity => (
                <TouchableOpacity
                  key={intensity}
                  style={[
                    styles.membershipTypeButton,
                    newWorkout.intensity.toLowerCase() === intensity.toLowerCase() && 
                    styles.selectedMembershipType
                  ]}
                  onPress={() => setNewWorkout({...newWorkout, intensity: intensity.toLowerCase()})}
                >
                  <Text style={[
                    styles.membershipTypeText, 
                    newWorkout.intensity.toLowerCase() === intensity.toLowerCase() && 
                    styles.selectedMembershipTypeText
                  ]}>
                    {intensity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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

  
  const renderClasses = () => (
    <View style={styles.classesContainer}>
      <TouchableOpacity 
        style={styles.addClassButton}
        onPress={() => setAddClassModalVisible(true)}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.addClassText}>Add New Class</Text>
      </TouchableOpacity>

      <ScrollView>
        {classes.map(classItem => (
          <View key={classItem.id} style={styles.classCard}>
            <View style={styles.classInfo}>
              <Text style={styles.className}>{classItem.name}</Text>
              <Text style={styles.classDetails}>
                Instructor: {classItem.instructor} | {classItem.schedule}
              </Text>
              <View style={styles.classMetrics}>
                <Text style={styles.classMetricText}>
                  Capacity: {classItem.currentEnrollment}/{classItem.capacity}
                </Text>
                <Text style={styles.classMetricText}>
                  Difficulty: {classItem.difficulty}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Class Modal */}
      <Modal
        transparent={true}
        visible={isAddClassModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Fitness Class</Text>
            <TextInput
              style={styles.input}
              placeholder="Class Name"
              value={newClass.name}
              onChangeText={(text) => setNewClass({...newClass, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Instructor Name"
              value={newClass.instructor}
              onChangeText={(text) => setNewClass({...newClass, instructor: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Schedule (e.g., Mon/Wed 6 AM)"
              value={newClass.schedule}
              onChangeText={(text) => setNewClass({...newClass, schedule: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Class Capacity"
              value={newClass.capacity}
              onChangeText={(text) => setNewClass({...newClass, capacity: text})}
              keyboardType="numeric"
            />
            <View style={styles.membershipTypeContainer}>
              {['Beginner', 'Intermediate', 'Advanced'].map(difficulty => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.membershipTypeButton,
                    newClass.difficulty.toLowerCase() === difficulty.toLowerCase() && 
                    styles.selectedMembershipType
                  ]}
                  onPress={() => setNewClass({...newClass, difficulty: difficulty.toLowerCase()})}
                ><Text style={[
                  styles.membershipTypeText, 
                  newClass.difficulty.toLowerCase() === difficulty.toLowerCase() && 
                  styles.
                  selectedMembershipTypeText
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setAddClassModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleAddClass}
            >
              <Text style={styles.modalButtonTextPrimary}>Add Class</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);

      
      <Modal
        transparent={true}
        visible={isAddMemberModalVisible}
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
              onChangeText={(text) => setNewMember({...newMember, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#b3b3b3"
              value={newMember.email}
              onChangeText={(text) => setNewMember({...newMember, email: text})}
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
                  onPress={() => setNewMember({...newMember, membershipType: type.toLowerCase()})}
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
                onPress={handleAddMember}
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
    

  // Main Render with Gradient Header
  return (
    <View style={styles.container}>
    <LinearGradient 
      colors={['#2c3e50', '#34495e']} 
      style={styles.header}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <Text style={styles.headerTitle}>Gym Management Dashboard</Text>
    </LinearGradient>

    <View style={styles.tabContainer}>
      {[
        { key: 'dashboard', label: 'Dashboard', icon: 'stats-chart' },
        { key: 'members', label: 'Members', icon: 'people' },
        { key: 'classes', label: 'Classes', icon: 'fitness' }
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
    {selectedTab === 'classes' && renderClasses()}

    <Modal
        transparent={true}
        visible={isAddMemberModalVisible}
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
              onChangeText={(text) => setNewMember({...newMember, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#b3b3b3"
              value={newMember.email}
              onChangeText={(text) => setNewMember({...newMember, email: text})}
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
                  onPress={() => setNewMember({...newMember, membershipType: type.toLowerCase()})}
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
                onPress={handleAddMember}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  classesContainer: {
    flex: 1,
    padding: 15
  },
  addClassButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  addClassText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2
  },
  classInfo: {
    flex: 1
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  classDetails: {
    color: '#7f8c8d',
    marginBottom: 10
  },
  classMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  classMetricText: {
    color: '#3498db',
    fontWeight: '600'
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1'
  },
  classEnrollment: {
    backgroundColor: '#3498db',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
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