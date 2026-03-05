import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ScrollView, 
  StatusBar, TextInput, RefreshControl, Modal, ActivityIndicator, Image, Keyboard
} from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { getRouter } from '../utils/router';
import { getStyles } from '../styles/JobFinderScreenStyles';

export const JobFinderScreen = ({ navigation }: any) => {
  const { jobs, isDarkMode, setIsDarkMode, fetchJobs, isLoading, savedJobIds, toggleSave } = useJobs();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null); 
  const [activeTab, setActiveTab] = useState('Description'); 
  const listRef = useRef<FlatList>(null);
  const router = getRouter(navigation);
  
  const filters = ['All', 'Full time', 'Part time', 'Contract', 'Internship'];

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    cardBg: isDarkMode ? '#161B22' : '#FFFFFF',
    accent: '#0A66C2',
    secondaryText: isDarkMode ? '#8B949E' : '#65676B',
    refreshBg: isDarkMode ? '#30363D' : '#FFFFFF'
  };

  const localStyles = getStyles(theme);

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

  const renderEmptyState = () => (
    <View style={localStyles.emptyContainer}>
      <Ionicons name="search-outline" size={80} color={theme.border} />
      <Text style={[localStyles.emptyTitle, { color: theme.text }]}>No jobs found</Text>
      <Text style={[localStyles.emptySubtext, { color: theme.secondaryText }]}>
        We couldn't find any results for "{search}". Try adjusting your keywords or filters.
      </Text>
      <TouchableOpacity 
        style={[localStyles.clearSearchBtn, { backgroundColor: theme.accent }]}
        onPress={() => {
            setSearch('');
            setFilter('All');
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Clear all filters</Text>
      </TouchableOpacity>
    </View>
  );

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
                  router.push('ApplyScreen', { job: jobToApply });
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
          <Text style={[styles.screenTitle, { color: theme.text }]}>CareerPath</Text>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={26} color={isDarkMode ? "#FDB813" : "#1F2328"} />
          </TouchableOpacity>
        </View>

        <View style={[localStyles.searchBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.secondaryText} />
          <TextInput
            placeholder="Search role or company..."
            placeholderTextColor={theme.secondaryText}
            style={{ flex: 1, marginLeft: 10, color: theme.text, paddingVertical: 10 }}
            value={search}
            onChangeText={(t) => setSearch(t)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={localStyles.clearIcon}>
              <Ionicons name="close-circle" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          )}
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
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={isDarkMode ? '#FFFFFF' : theme.accent} 
            colors={[isDarkMode ? '#FFFFFF' : theme.accent]}   
            progressBackgroundColor={theme.refreshBg} 
          />
        }
        renderItem={({ item }) => (
          <JobCard 
            job={item} 
            isSaved={savedJobIds.includes(item.id)}
            onSave={() => toggleSave(item.id)}
            onOpenDetails={() => setSelectedJob(item)}
            onApply={() => router.push('ApplyScreen', { job: item })}
          />
        )}
      />
    </View>
  );
};