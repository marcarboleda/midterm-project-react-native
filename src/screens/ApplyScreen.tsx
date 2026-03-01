import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';
import { getRouter } from '../utils/router'; // Updated import

export const ApplyScreen = ({ route, navigation }: any) => {
  const { job } = route.params;
  const { isDarkMode } = useJobs();
  const insets = useSafeAreaInsets();
  const router = getRouter(navigation); // Initialized router

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: ''
  });

  const [errors, setErrors] = useState<any>({});

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    accent: '#0A66C2',
    inputBg: isDarkMode ? '#0D1117' : '#F9FAFB',
    error: '#F85149'
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleApply = () => {
    let newErrors: any = {};

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) newErrors.phone = 'Contact number is required';
    if (!form.portfolio.trim()) newErrors.portfolio = 'Portfolio/Resume link is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    Alert.alert(
      "Application Sent!",
      `Your application for ${job.title} has been submitted.`,
      [{ 
        text: "OK", 
        onPress: () => router.replace('JobFinderHome') // Updated to router.replace
      }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={[localStyles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={localStyles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[localStyles.headerTitle, { color: theme.text }]}>Apply for Role</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={[localStyles.jobSummary, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[localStyles.jobTitle, { color: theme.text }]}>{job.title}</Text>
            <Text style={{ color: theme.accent, fontWeight: '600' }}>{job.companyName}</Text>
          </View>

          <Text style={[localStyles.label, { color: theme.text }]}>Full Name *</Text>
          <TextInput
            style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: errors.name ? theme.error : theme.border }]}
            placeholder="John Doe"
            placeholderTextColor="#888"
            value={form.name}
            onChangeText={(t) => {
              setForm({...form, name: t});
              setErrors({...errors, name: null});
            }}
          />
          {errors.name && <Text style={localStyles.errorText}>{errors.name}</Text>}

          <Text style={[localStyles.label, { color: theme.text }]}>Email Address *</Text>
          <TextInput
            style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: errors.email ? theme.error : theme.border }]}
            placeholder="john@example.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => {
              setForm({...form, email: t});
              setErrors({...errors, email: null});
            }}
          />
          {errors.email && <Text style={localStyles.errorText}>{errors.email}</Text>}

          <Text style={[localStyles.label, { color: theme.text }]}>Contact Number *</Text>
          <TextInput
            style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: errors.phone ? theme.error : theme.border }]}
            placeholder="09123456789"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={form.phone}
            onChangeText={(t) => {
              const cleaned = t.replace(/[^0-9]/g, '');
              setForm({...form, phone: cleaned});
              setErrors({...errors, phone: null});
            }}
          />
          {errors.phone && <Text style={localStyles.errorText}>{errors.phone}</Text>}

          <Text style={[localStyles.label, { color: theme.text }]}>Portfolio / Resume URL *</Text>
          <TextInput
            style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: errors.portfolio ? theme.error : theme.border }]}
            placeholder="https://linkedin.com/in/..."
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={form.portfolio}
            onChangeText={(t) => {
              setForm({...form, portfolio: t});
              setErrors({...errors, portfolio: null});
            }}
          />
          {errors.portfolio && <Text style={localStyles.errorText}>{errors.portfolio}</Text>}

          <TouchableOpacity style={localStyles.submitBtn} onPress={handleApply}>
            <Text style={localStyles.submitBtnText}>Submit Application</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  jobSummary: { padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 25 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { borderWidth: 1, borderRadius: 10, padding: 15, fontSize: 15 },
  errorText: { color: '#F85149', fontSize: 12, marginTop: 5, marginLeft: 5 },
  submitBtn: { backgroundColor: '#0A66C2', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});