import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { getStyles } from '../styles/SavedJobsScreenStyles';

export const SavedJobsScreen = ({ navigation }: any) => {
  const { jobs, savedJobIds, setSavedJobIds, isDarkMode, toggleSave } = useJobs();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    secondaryText: isDarkMode ? '#8B949E' : '#65676B',
    accent: '#0A66C2',
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    error: '#FF4444',
    selectionBg: isDarkMode ? '#1C2128' : '#E7F3FF'
  };

  const localStyles = getStyles(theme, isDarkMode);

  const savedJobs = jobs.filter((job: any) => savedJobIds.includes(job.id));

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === savedJobs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(savedJobs.map((j: any) => j.id));
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Remove Saved Jobs",
      `Are you sure you want to remove ${selectedIds.length} items?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => {
            setSavedJobIds(savedJobIds.filter((id: string) => !selectedIds.includes(id)));
            setSelectedIds([]);
            setIsEditMode(false);
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[localStyles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[localStyles.title, { color: theme.text }]}>My Jobs</Text>
          <Text style={[localStyles.subtitle, { color: theme.secondaryText }]}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </Text>
        </View>
        
        {savedJobs.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setIsEditMode(!isEditMode);
              setSelectedIds([]);
            }}
            style={[localStyles.editBtn, { borderColor: theme.accent }]}
          >
            <Text style={{ color: theme.accent, fontWeight: '700' }}>
              {isEditMode ? "Done" : "Manage"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isEditMode && (
        <View style={[localStyles.selectionBar, { backgroundColor: theme.selectionBg }]}>
          <TouchableOpacity onPress={handleSelectAll} style={localStyles.selectionRow}>
            <Ionicons 
              name={selectedIds.length === savedJobs.length ? "checkbox" : "square-outline"} 
              size={22} 
              color={theme.accent} 
            />
            <Text style={[localStyles.selectionText, { color: theme.text }]}>Select All</Text>
          </TouchableOpacity>
          <Text style={[localStyles.countText, { color: theme.secondaryText }]}>
            {selectedIds.length} selected
          </Text>
        </View>
      )}

      {savedJobs.length === 0 ? (
        <View style={localStyles.emptyContainer}>
          <View style={[localStyles.iconCircle, { backgroundColor: isDarkMode ? '#30363D' : '#E1E4E8' }]}>
            <Ionicons name="bookmark" size={40} color={theme.secondaryText} />
          </View>
          <Text style={[localStyles.emptyTitle, { color: theme.text }]}>No saved jobs</Text>
          <Text style={[localStyles.emptySubtext, { color: theme.secondaryText }]}>
            Jobs you save will appear here for quick access later.
          </Text>
          <TouchableOpacity 
            style={[localStyles.browseBtn, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={localStyles.browseText}>Browse jobs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          renderItem={({ item }) => (
            <View style={localStyles.cardContainer}>
              {isEditMode && (
                <TouchableOpacity 
                  onPress={() => toggleSelection(item.id)}
                  style={localStyles.checkArea}
                >
                  <Ionicons 
                    name={selectedIds.includes(item.id) ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={theme.accent} 
                  />
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }}>
                <JobCard 
                  job={item} 
                  isSaved={true}
                  onSave={() => toggleSave(item.id)}
                  onOpenDetails={() => {
                    if (isEditMode) toggleSelection(item.id);
                    else navigation.navigate('Home', { screen: 'JobFinderHome', params: { selectedJob: item } });
                  }}
                  onApply={() => navigation.navigate('Home', { screen: 'ApplyScreen', params: { job: item } })}
                />
              </View>
            </View>
          )}
        />
      )}

      {isEditMode && selectedIds.length > 0 && (
        <View style={localStyles.footerContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            style={[localStyles.deleteFab, { backgroundColor: theme.error }]} 
            onPress={handleDeleteSelected}
          >
            <Ionicons name="trash" size={20} color="#FFF" />
            <Text style={localStyles.deleteFabText}>Remove {selectedIds.length}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};