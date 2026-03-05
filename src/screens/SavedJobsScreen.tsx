import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView, Modal, ScrollView, Image } from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { getStyles } from '../styles/SavedJobsScreenStyles';
import { getStyles as getFinderStyles } from '../styles/JobFinderScreenStyles';
import { getRouter } from '../utils/router'; 

export const SavedJobsScreen = ({ navigation }: any) => {
  const { jobs, savedJobIds, setSavedJobIds, isDarkMode, toggleSave } = useJobs();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Description');
  
  const router = getRouter(navigation);

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    secondaryText: isDarkMode ? '#8B949E' : '#65676B',
    accent: '#0A66C2',
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    cardBg: isDarkMode ? '#161B22' : '#FFFFFF', 
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    error: '#FF4444',
    selectionBg: isDarkMode ? '#1C2128' : '#E7F3FF'
  };

  const localStyles = getStyles(theme, isDarkMode);
  const finderStyles = getFinderStyles(theme);

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

  const handleToggleSave = (jobId: string) => {
    if (savedJobIds.includes(jobId)) {
      Alert.alert(
        "Unsave Job",
        "Are you sure you want to remove this job from your saved list?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Unsave", style: "destructive", onPress: () => toggleSave(jobId) }
        ]
      );
    } else {
      toggleSave(jobId);
    }
  };

  const formatContent = (html: string, section: string) => {
    if (!html) return <Text style={{ color: theme.text }}>No info available.</Text>;
    const parts = html.split(/<h3>.*?<\/h3>/i);
    let sectionHtml = "";
    if (section === 'Description') sectionHtml = parts[1] || parts[0];
    else if (section === 'Requirements') sectionHtml = parts[2] || "Refer to description.";
    else if (section === 'Benefits') sectionHtml = parts[3] || "Refer to description.";

    const lines = sectionHtml
      .replace(/<\/li>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .split('\n')
      .filter(l => l.trim().length > 0);

    return lines.map((line, i) => (
      <View key={i} style={finderStyles.lineRow}>
        <Text style={{ color: theme.accent, marginRight: 10 }}>•</Text>
        <Text style={[finderStyles.bodyText, { color: theme.text, flex: 1 }]}>{line.trim()}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Modal visible={!!selectedJob} transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}>
        <View style={finderStyles.overlay}>
          <View style={[finderStyles.modal, { backgroundColor: theme.cardBg }]}>
            <View style={finderStyles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedJob(null)} style={finderStyles.iconBtn}>
                <Ionicons name="close" size={26} color={theme.text} />
              </TouchableOpacity>
              <Text style={[finderStyles.modalTitle, { color: theme.text }]}>Job Details</Text>
              <View style={{ width: 40 }} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={finderStyles.modalHero}>
                {selectedJob?.companyLogo ? (
                  <Image source={{ uri: selectedJob.companyLogo }} style={finderStyles.modalLogo} />
                ) : (
                  <View style={finderStyles.modalLogoPlaceholder}><Ionicons name="business" size={40} color={theme.accent} /></View>
                )}
                <Text style={[finderStyles.heroTitle, { color: theme.text }]}>{selectedJob?.title}</Text>
                <Text style={finderStyles.heroSubtitle}>{selectedJob?.companyName}</Text>
                <Text style={[finderStyles.modalSalary, { color: "#2DA44E" }]}>{selectedJob?.salary}</Text>
              </View>

              <View style={[finderStyles.tabBar, { borderBottomColor: theme.border }]}>
                {['Description', 'Requirements', 'Benefits'].map((tab) => (
                  <TouchableOpacity 
                    key={tab} 
                    onPress={() => setActiveTab(tab)}
                    style={[finderStyles.tab, activeTab === tab && { borderBottomColor: theme.accent }]}
                  >
                    <Text style={{ color: activeTab === tab ? theme.accent : theme.secondaryText, fontWeight: 'bold' }}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={{ padding: 20 }}>
                {formatContent(selectedJob?.description, activeTab)}
                <View style={{ height: 120 }} />
              </View>
            </ScrollView>

            <View style={[finderStyles.footerActions, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
              <TouchableOpacity 
                style={finderStyles.applyBtn} 
                onPress={() => {
                  const jobToApply = selectedJob;
                  setSelectedJob(null);
                  router.push('ApplyScreen', { job: jobToApply });
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Apply Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[finderStyles.saveBtnAction, { borderColor: theme.border }]} 
                onPress={() => handleToggleSave(selectedJob?.id)}
              >
                <Ionicons 
                  name={savedJobIds.includes(selectedJob?.id) ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={theme.accent} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                  onSave={() => handleToggleSave(item.id)}
                  onOpenDetails={() => {
                    if (isEditMode) {
                      toggleSelection(item.id);
                    } else {
                      setSelectedJob(item);
                    }
                  }}
                  onApply={() => router.push('ApplyScreen', { job: item })}
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