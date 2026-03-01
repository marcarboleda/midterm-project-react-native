import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useJobs } from '../context/JobContext';
import { formStyles as styles } from '../styles/formStyles';
import { getRouter } from '../utils/router';

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 20 }]}>
          <Text style={[styles.title, { color: theme.text }]}>{job.title}</Text>
          <Text style={styles.companyName}>{job.companyName}</Text>
          
          <View style={{ marginVertical: 15, padding: 12, backgroundColor: isDarkMode ? '#0D1117' : '#F0F2F5', borderRadius: 8 }}>
             <Text style={{ color: '#28a745', fontWeight: '800' }}>
                💰 {job.salary || 'Salary: Competitive'}
             </Text>
          </View>

          <Text style={[styles.bodyText, { color: theme.text }]}>
            {job.description?.replace(/<[^>]+>/g, '')}
          </Text>

          <TouchableOpacity 
            style={[styles.submitBtn, { marginTop: 30 }]} 
            onPress={() => router.push('ApplyScreen', { job })}
          >
            <Text style={styles.submitBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};