import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';
import { cardStyles as styles } from '../styles/cardStyles';

export const JobCard = ({ job, onApply, onOpenDetails }: any) => {
  const { isDarkMode, toggleSaveJob, savedJobs } = useJobs();
  const isSaved = savedJobs.find((j: any) => j.id === job.id);

  const theme = {
    card: { backgroundColor: isDarkMode ? '#161B22' : '#FFFFFF', borderColor: isDarkMode ? '#30363D' : '#E1E4E8' },
    text: { color: isDarkMode ? '#FFFFFF' : '#1F2328' }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, theme.card]} 
      onPress={onOpenDetails}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, theme.text]}>{job.title}</Text>
          <Text style={styles.company}>{job.companyName}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleSaveJob(job)}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isSaved ? "#0A66C2" : "#888"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.locationText}>{job.location || 'Remote'} • {job.type || 'Full-time'}</Text>
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