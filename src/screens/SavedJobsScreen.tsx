import React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';

export const SavedJobsScreen = ({ navigation }: any) => {
  const { savedJobs, isDarkMode } = useJobs();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0D1117' : '#F3F2EF' }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.headerContainer}>
        <Text style={[styles.screenTitle, { color: isDarkMode ? '#FFFFFF' : '#1F2328' }]}>Saved Jobs</Text>
      </View>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard 
            job={item} 
            onOpenDetails={() => navigation.navigate('ApplicationForm', { job: item })}
            onApply={() => navigation.navigate('ApplyScreen', { job: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: isDarkMode ? '#888' : '#666', fontSize: 16 }}>No saved jobs.</Text>
          </View>
        }
      />
    </View>
  );
};