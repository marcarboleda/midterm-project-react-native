import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useJobs } from '../context/JobContext';
import { cardStyles as styles } from '../styles/cardStyles';

export const JobCard = ({ job, onApply, onOpenDetails }: any) => {
  const { isDarkMode } = useJobs();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: isDarkMode ? '#161B22' : '#FFF', borderColor: isDarkMode ? '#30363D' : '#E1E4E8' }]}
      onPress={onOpenDetails}
    >
      <View>
        <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#1F2328' }]}>{job.title}</Text>
        <Text style={styles.company}>{job.companyName}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={{ color: '#888', fontSize: 13 }}>
          {job.location} • <Text style={{ color: '#0A66C2', fontWeight: 'bold' }}>{job.type}</Text>
        </Text>
        <TouchableOpacity 
          style={styles.applyBtn} 
          onPress={(e) => {
            e.stopPropagation(); 
            onApply();
          }}
        >
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};