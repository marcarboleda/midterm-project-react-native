import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';

export const JobFinderScreen = ({ navigation }: any) => {
  const { jobs, isDarkMode } = useJobs();
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Full-time', 'Remote', 'Contract'];

  const filteredJobs = filter === 'All' 
    ? jobs 
    : jobs.filter((j: any) => j.type?.toLowerCase().includes(filter.toLowerCase()) || (filter === 'Remote' && j.location?.toLowerCase().includes('remote')));

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    border: isDarkMode ? '#30363D' : '#E1E4E8'
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.headerContainer}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Home</Text>
      </View>

      <View style={[styles.filterWrapper, { borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((f) => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)}
              style={[styles.filterPill, { 
                backgroundColor: filter === f ? '#0A66C2' : (isDarkMode ? '#161B22' : '#F0F2F5'),
                borderColor: theme.border
              }]}
            >
              <Text style={{ color: filter === f ? '#FFF' : (isDarkMode ? '#C9D1D9' : '#666'), fontWeight: '600' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard 
            job={item} 
            onOpenDetails={() => navigation.navigate('ApplicationForm', { job: item })}
            onApply={() => navigation.navigate('ApplyScreen', { job: item })}
          />
        )}
      />
    </View>
  );
};