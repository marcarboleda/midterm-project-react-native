import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { getRouter } from '../utils/router'; // Updated import

export const SavedJobsScreen = ({ navigation }: any) => {
  const { jobs, savedJobIds, isDarkMode, toggleSave } = useJobs();
  const router = getRouter(navigation); // Initialized router

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    secondaryText: isDarkMode ? '#8B949E' : '#65676B'
  };

  const savedJobs = jobs.filter((job: any) => savedJobIds.includes(job.id));

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Saved Jobs</Text>
      </View>

      {savedJobs.length === 0 ? (
        <View style={localStyles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={80} color={theme.secondaryText} />
          <Text style={[localStyles.emptyText, { color: theme.text }]}>No saved jobs yet</Text>
          <Text style={{ color: theme.secondaryText, textAlign: 'center' }}>
            Jobs you bookmark will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard 
              job={item} 
              isSaved={true}
              onSave={() => toggleSave(item.id)}
              onOpenDetails={() => router.push('JobFinder', { screen: 'JobFinderHome', params: { selectedJob: item } })} // Updated to router.push
              onApply={() => router.push('ApplyScreen', { job: item })} // Updated to router.push
            />
          )}
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }
});