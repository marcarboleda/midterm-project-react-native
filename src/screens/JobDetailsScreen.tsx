import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useJobs } from '../context/JobContext';
import { getRouter } from '../utils/router';
import { getStyles } from '../styles/JobDetailsScreenStyles'; // Updated import path

export const JobDetailsScreen = ({ route, navigation }: any) => {
  const { job } = route.params;
  const { isDarkMode } = useJobs();
  const router = getRouter(navigation);

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F8F9FA',
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    text: isDarkMode ? '#C9D1D9' : '#1F2328',
    border: isDarkMode ? '#30363D' : '#E1E4E8'
  };

  const localStyles = getStyles(theme, isDarkMode);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[localStyles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 20 }]}>
          <Text style={[localStyles.title, { color: theme.text }]}>{job.title}</Text>
          <Text style={localStyles.companyName}>{job.companyName}</Text>
          
          <View style={localStyles.salaryContainer}>
             <Text style={localStyles.salaryText}>
               💰 {job.salary || 'Salary: Competitive'}
             </Text>
          </View>

          <Text style={[localStyles.bodyText, { color: theme.text }]}>
            {job.description?.replace(/<[^>]+>/g, '')}
          </Text>

          <TouchableOpacity 
            style={[localStyles.submitBtn, { marginTop: 30 }]} 
            onPress={() => router.push('ApplyScreen', { job })}
          >
            <Text style={localStyles.submitBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};