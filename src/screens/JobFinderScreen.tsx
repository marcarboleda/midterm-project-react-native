import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ScrollView, 
  StatusBar, TextInput, RefreshControl, Modal, StyleSheet, ActivityIndicator, Image
} from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { getRouter } from '../utils/router'; // Updated import

export const JobFinderScreen = ({ navigation }: any) => {
  const { jobs, isDarkMode, setIsDarkMode, fetchJobs, isLoading, savedJobIds, toggleSave } = useJobs();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState('Description'); 
  const listRef = useRef<FlatList>(null);
  const router = getRouter(navigation); // Initialized router
  
  const filters = ['All', 'Full time', 'Part time', 'Contract', 'Internship'];

  useEffect(() => {
    if (listRef.current && displayJobs.length > 0) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [filter, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    cardBg: isDarkMode ? '#161B22' : '#FFFFFF',
    accent: '#0A66C2',
    secondaryText: isDarkMode ? '#8B949E' : '#65676B',
    refreshBg: isDarkMode ? '#30363D' : '#FFFFFF'
  };

  const displayJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    return jobs.filter((j: any) => {
      const searchTerm = search.toLowerCase();
      const title = (j.title || "").toLowerCase();
      const company = (j.companyName || "").toLowerCase();
      
      const matchesSearch = title.includes(searchTerm) || company.includes(searchTerm);
      if (!matchesSearch) return false;

      if (filter === 'All') return true;
      const jobType = (j.type || "").toLowerCase().trim();
      const selectedFilter = filter.toLowerCase().trim();
      
      return jobType === selectedFilter;
    });
  }, [jobs, search, filter]);

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
      <View key={i} style={localStyles.lineRow}>
        <Text style={{ color: theme.accent, marginRight: 10 }}>•</Text>
        <Text style={[localStyles.bodyText, { color: theme.text, flex: 1 }]}>{line.trim()}</Text>
      </View>
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <Modal visible={!!selectedJob} transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}>
        <View style={localStyles.overlay}>
          <View style={[localStyles.modal, { backgroundColor: theme.cardBg }]}>
            <View style={localStyles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedJob(null)} style={localStyles.iconBtn}>
                <Ionicons name="close" size={26} color={theme.text} />
              </TouchableOpacity>
              <Text style={[localStyles.modalTitle, { color: theme.text }]}>Job Details</Text>
              <View style={{ width: 40 }} />
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={localStyles.modalHero}>
                {selectedJob?.companyLogo ? (
                  <Image source={{ uri: selectedJob.companyLogo }} style={localStyles.modalLogo} />
                ) : (
                  <View style={localStyles.modalLogoPlaceholder}><Ionicons name="business" size={40} color={theme.accent} /></View>
                )}
                <Text style={[localStyles.heroTitle, { color: theme.text }]}>{selectedJob?.title}</Text>
                <Text style={localStyles.heroSubtitle}>{selectedJob?.companyName}</Text>
                <Text style={[localStyles.modalSalary, { color: "#2DA44E" }]}>{selectedJob?.salary}</Text>
              </View>

              <View style={[localStyles.tabBar, { borderBottomColor: theme.border }]}>
                {['Description', 'Requirements', 'Benefits'].map((tab) => (
                  <TouchableOpacity 
                    key={tab} 
                    onPress={() => setActiveTab(tab)}
                    style={[localStyles.tab, activeTab === tab && { borderBottomColor: theme.accent }]}
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

            <View style={[localStyles.footerActions, { backgroundColor: theme.cardBg, borderTopColor: theme.border }]}>
              <TouchableOpacity 
                style={localStyles.applyBtn} 
                onPress={() => {
                  const jobToApply = selectedJob;
                  setSelectedJob(null);
                  router.push('ApplyScreen', { job: jobToApply }); // Updated to router.push
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Apply Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[localStyles.saveBtnAction, { borderColor: theme.border }]} 
                onPress={() => toggleSave(selectedJob?.id)}
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

      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.screenTitle, { color: theme.text }]}>Job Finder</Text>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={26} color={isDarkMode ? "#FDB813" : "#1F2328"} />
          </TouchableOpacity>
        </View>

        <View style={[localStyles.searchBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search role or company..."
            placeholderTextColor="#888"
            style={{ flex: 1, marginLeft: 10, color: theme.text, paddingVertical: 10 }}
            onChangeText={(t) => setSearch(t)}
          />
        </View>
      </View>

      <View style={[styles.filterWrapper, { borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((f) => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)} 
              style={[styles.filterPill, { backgroundColor: filter === f ? theme.accent : theme.cardBg, borderColor: theme.border }]}
            >
              <Text style={{ color: filter === f ? '#FFF' : theme.secondaryText, fontWeight: '600' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        ref={listRef}
        data={displayJobs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.accent} 
            colors={[theme.accent]}   
            progressBackgroundColor={theme.refreshBg} 
          />
        }
        renderItem={({ item }) => (
          <JobCard 
            job={item} 
            isSaved={savedJobIds.includes(item.id)}
            onSave={() => toggleSave(item.id)}
            onOpenDetails={() => setSelectedJob(item)}
            onApply={() => router.push('ApplyScreen', { job: item })} // Updated to router.push
          />
        )}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, marginTop: 15, borderWidth: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { height: '90%', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  modalHeader: { flexDirection: 'row', padding: 15, alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { padding: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalHero: { padding: 20, alignItems: 'center' },
  modalLogo: { width: 70, height: 70, borderRadius: 15 },
  modalLogoPlaceholder: { width: 70, height: 70, borderRadius: 15, backgroundColor: 'rgba(10, 102, 194, 0.1)', justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15 },
  heroSubtitle: { fontSize: 16, color: '#0A66C2', marginTop: 5, fontWeight: '600' },
  modalSalary: { fontSize: 17, fontWeight: 'bold', marginTop: 8 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  lineRow: { flexDirection: 'row', marginBottom: 12, paddingRight: 15 },
  bodyText: { fontSize: 15, lineHeight: 24 },
  footerActions: { padding: 20, borderTopWidth: 1, flexDirection: 'row', gap: 12, position: 'absolute', bottom: 0, left: 0, right: 0 },
  applyBtn: { flex: 1, backgroundColor: '#0A66C2', padding: 18, borderRadius: 15, alignItems: 'center' },
  saveBtnAction: { padding: 16, borderRadius: 15, borderWidth: 1, justifyContent: 'center' }
});