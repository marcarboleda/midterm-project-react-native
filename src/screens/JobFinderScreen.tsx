import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ScrollView, 
  StatusBar, TextInput, RefreshControl, Modal, StyleSheet, ActivityIndicator
} from 'react-native';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { commonStyles as styles } from '../styles/commonStyles';
import { cardStyles } from '../styles/cardStyles';
import { Ionicons } from '@expo/vector-icons';

export const JobFinderScreen = ({ navigation }: any) => {
  const { jobs, isDarkMode, setIsDarkMode, fetchJobs, isLoading } = useJobs();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null); 
  const listRef = useRef<FlatList>(null);
  
  const filters = ['All', 'Full time', 'Part time', 'Contract', 'Internship'];

  // Scroll to top when filter changes
  useEffect(() => {
    if (listRef.current && displayJobs.length > 0) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [filter]);

  // Scroll to top when search changes
  useEffect(() => {
    if (listRef.current && displayJobs.length > 0) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [search]);

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    cardBg: isDarkMode ? '#161B22' : '#FFFFFF',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const displayJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const filtered = jobs.filter((j: any) => {
      const s = search.toLowerCase();
      const title = (j.title || "").toLowerCase();
      const company = (j.companyName || "").toLowerCase();
      
      if (!title.includes(s) && !company.includes(s)) return false;
      if (filter === 'All') return true;

      const type = (j.type || "").toLowerCase().replace(/[\s-]/g, '');
      const activeFilter = filter.toLowerCase().replace(/[\s-]/g, '');
      return type.includes(activeFilter);
    });

    return filtered;
  }, [jobs, search, filter]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <Modal visible={!!selectedJob} transparent animationType="slide" onRequestClose={() => setSelectedJob(null)}>
        <View style={localStyles.overlay}>
          <View style={[localStyles.modal, { backgroundColor: theme.cardBg }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: theme.text }]} numberOfLines={1}>
                {selectedJob?.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedJob(null)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 20 }}>
              <Text style={{ color: '#0A66C2', fontWeight: 'bold', fontSize: 16 }}>{selectedJob?.companyName}</Text>
              <Text style={{ color: '#888', marginVertical: 8 }}>{selectedJob?.location} • {selectedJob?.type}</Text>
              <Text style={{ color: theme.text, lineHeight: 22, fontSize: 15 }}>
                {(selectedJob?.description || "").replace(/<[^>]*>/g, '') || "No description provided."}
              </Text>
              <View style={{ height: 120 }} />
            </ScrollView>
            <TouchableOpacity 
              style={localStyles.applyBtn} 
              onPress={() => {
                const job = selectedJob;
                setSelectedJob(null);
                navigation.navigate('ApplyScreen', { job });
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.screenTitle, { color: theme.text }]}>Explore</Text>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={26} color={isDarkMode ? "#FDB813" : "#1F2328"} />
          </TouchableOpacity>
        </View>

        <View style={[localStyles.searchBar, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="Search jobs..."
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
              style={[styles.filterPill, { backgroundColor: filter === f ? '#0A66C2' : theme.cardBg, borderColor: theme.border }]}
            >
              <Text style={{ color: filter === f ? '#FFF' : (isDarkMode ? '#C9D1D9' : '#666'), fontWeight: '600' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#0A66C2" /></View>
      ) : (
        <FlatList
          ref={listRef}
          data={displayJobs}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <JobCard 
              job={item} 
              onOpenDetails={() => setSelectedJob(item)}
              onApply={() => navigation.navigate('ApplyScreen', { job: item })}
            />
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 100, alignItems: 'center' }}>
              <Text style={{ color: '#888' }}>
                {jobs.length === 0 ? "Failed to load from API" : `No jobs found for "${filter}"`}
              </Text>
              {jobs.length === 0 && (
                <TouchableOpacity onPress={onRefresh} style={{ marginTop: 20 }}>
                  <Text style={{ color: '#0A66C2', fontWeight: 'bold' }}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, marginTop: 15, borderWidth: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modal: { height: '85%', borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  modalHeader: { flexDirection: 'row', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  applyBtn: { backgroundColor: '#0A66C2', padding: 18, borderRadius: 15, margin: 20, alignItems: 'center', position: 'absolute', bottom: 10, left: 0, right: 0 }
});