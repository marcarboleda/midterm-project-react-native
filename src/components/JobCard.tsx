import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';

export const JobCard = ({ job, onApply, onOpenDetails, isSaved, onSave }: any) => {
  const { isDarkMode } = useJobs();

  const theme = {
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    text: isDarkMode ? '#F0F6FC' : '#1F2328',
    subText: isDarkMode ? '#8B949E' : '#65676B',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    accent: '#0A66C2'
  };

  return (
    <TouchableOpacity 
      style={[cardLocalStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onOpenDetails}
    >
      <View style={cardLocalStyles.header}>
        {job.companyLogo ? (
          <Image source={{ uri: job.companyLogo }} style={cardLocalStyles.logo} resizeMode="contain" />
        ) : (
          <View style={cardLocalStyles.logoPlaceholder}>
            <Ionicons name="business" size={24} color={theme.accent} />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[cardLocalStyles.title, { color: theme.text }]} numberOfLines={1}>{job.title}</Text>
          <Text style={[cardLocalStyles.company, { color: theme.accent }]}>{job.companyName}</Text>
        </View>
        <TouchableOpacity onPress={onSave} style={cardLocalStyles.bookmarkBtn}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={22} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <View style={cardLocalStyles.infoRow}>
        <View style={cardLocalStyles.infoItem}>
          <Ionicons name="location-outline" size={14} color={theme.subText} />
          <Text style={[cardLocalStyles.infoText, { color: theme.subText }]}>{job.location}</Text>
        </View>
        <Text style={{ color: theme.subText }}>•</Text>
        <Text style={[cardLocalStyles.infoText, { color: theme.subText }]}>{job.type}</Text>
      </View>

      <View style={[cardLocalStyles.divider, { backgroundColor: theme.border }]} />

      <View style={cardLocalStyles.footer}>
        <Text style={[cardLocalStyles.salary, { color: "#2DA44E" }]}>{job.salary}</Text>
        <TouchableOpacity 
          style={cardLocalStyles.applyBtn} 
          onPress={(e) => { 
            e.stopPropagation(); 
            onApply(); 
          }}
        >
          <Text style={cardLocalStyles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const cardLocalStyles = StyleSheet.create({
  card: { marginHorizontal: 16, marginTop: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#FFF' },
  logoPlaceholder: { width: 45, height: 45, borderRadius: 10, backgroundColor: 'rgba(10, 102, 194, 0.1)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  company: { fontSize: 14, fontWeight: '600' },
  bookmarkBtn: { padding: 4 },
  infoRow: { flexDirection: 'row', marginTop: 10, gap: 8, alignItems: 'center' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 13 },
  divider: { height: 1, width: '100%', marginVertical: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salary: { fontSize: 14, fontWeight: 'bold' },
  applyBtn: { backgroundColor: '#0A66C2', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  applyText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});