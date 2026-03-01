import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';
import { getRouter } from '../utils/router';

export const ApplyScreen = ({ route, navigation }: any) => {
  const { job } = route.params;
  const { isDarkMode } = useJobs();
  const insets = useSafeAreaInsets();
  const router = getRouter(navigation);
  const scrollRef = useRef<ScrollView>(null);

  const [form, setForm] = useState({ name: '', email: '', phone: '', hireReason: '' });
  const [errors, setErrors] = useState<any>({});

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F3F2EF',
    text: isDarkMode ? '#FFFFFF' : '#1F2328',
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    border: isDarkMode ? '#30363D' : '#E1E4E8',
    accent: '#0A66C2',
    inputBg: isDarkMode ? '#0D1117' : '#F9FAFB',
    placeholder: isDarkMode ? '#8B949E' : '#999999', // Unified placeholder color
    error: '#FF4444',
  };

  const scrollToInput = (y: number) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y, animated: true });
    }, 100);
  };

  const handleBackWithConfirmation = () => {
    const hasInput = Object.values(form).some(value => value.trim().length > 0);
    if (hasInput) {
      Alert.alert("Discard Changes?", "Your application data will be lost.", [
        { text: "Keep Editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => router.back() }
      ]);
    } else {
      router.back();
    }
  };

  const handleApply = () => {
    let newErrors: any = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (form.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }
    if (!form.hireReason.trim()) {
      newErrors.hireReason = 'Please tell us why we should hire you';
    } else if (form.hireReason.trim().length < 20) {
      newErrors.hireReason = 'Please provide at least 20 characters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    Alert.alert("Confirm Submission", "Are you sure you want to submit your application?", [
      { text: "Review", style: "cancel" },
      { text: "Submit", onPress: () => {
          Alert.alert("Success!", "Your application has been sent.", [
            { text: "OK", onPress: () => router.replace('JobFinderHome') }
          ]);
      }}
    ]);
  };

  const getBorderColor = (fieldName: string) => {
    return errors[fieldName] ? theme.error : theme.border;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, paddingTop: insets.top }}>
            
            <View style={[localStyles.header, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={handleBackWithConfirmation} style={localStyles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={[localStyles.headerTitle, { color: theme.text }]}>Apply for Role</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView 
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[localStyles.jobSummary, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[localStyles.jobTitle, { color: theme.text }]}>{job.title}</Text>
                <Text style={{ color: theme.accent, fontWeight: '600' }}>{job.companyName}</Text>
              </View>

              {/* Name Field */}
              <Text style={[localStyles.label, { color: theme.text }]}>Full Name *</Text>
              <TextInput
                style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('name') }]}
                placeholder="Enter your name"
                placeholderTextColor={theme.placeholder}
                value={form.name}
                onFocus={() => scrollToInput(0)}
                onChangeText={(t) => {
                    setForm({...form, name: t});
                    if (errors.name) setErrors({...errors, name: null});
                }}
              />
              {errors.name && <Text style={localStyles.errorLabel}>{errors.name}</Text>}

              {/* Email Field */}
              <Text style={[localStyles.label, { color: theme.text }]}>Email Address *</Text>
              <TextInput
                style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('email') }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.placeholder} // Consistent color
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false} // Prevents unwanted highlight/behavior
                value={form.email}
                onFocus={() => scrollToInput(80)}
                onChangeText={(t) => {
                    setForm({...form, email: t});
                    if (errors.email) setErrors({...errors, email: null});
                }}
              />
              {errors.email && <Text style={localStyles.errorLabel}>{errors.email}</Text>}

              {/* Phone Field */}
              <Text style={[localStyles.label, { color: theme.text }]}>Contact Number *</Text>
              <TextInput
                style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('phone') }]}
                placeholder="Enter phone number"
                placeholderTextColor={theme.placeholder}
                keyboardType="phone-pad"
                value={form.phone}
                onFocus={() => scrollToInput(160)}
                onChangeText={(t) => {
                    setForm({...form, phone: t});
                    if (errors.phone) setErrors({...errors, phone: null});
                }}
              />
              {errors.phone && <Text style={localStyles.errorLabel}>{errors.phone}</Text>}

              {/* Hire Reason Field */}
              <Text style={[localStyles.label, { color: theme.text }]}>Why should we hire you? *</Text>
              <TextInput
                style={[
                  localStyles.input, 
                  localStyles.textArea,
                  { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('hireReason') }
                ]}
                placeholder="Tell us about your experience..."
                placeholderTextColor={theme.placeholder}
                multiline
                textAlignVertical="top"
                value={form.hireReason}
                onFocus={() => scrollToInput(300)} 
                onChangeText={(t) => {
                    setForm({...form, hireReason: t});
                    if (errors.hireReason) setErrors({...errors, hireReason: null});
                }}
              />
              {errors.hireReason && <Text style={localStyles.errorLabel}>{errors.hireReason}</Text>}

              <TouchableOpacity style={localStyles.submitBtn} onPress={handleApply}>
                <Text style={localStyles.submitBtnText}>Submit Application</Text>
              </TouchableOpacity>
              
              <View style={{ height: 200 }} />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  jobSummary: { padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  jobTitle: { fontSize: 16, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { borderWidth: 1, borderRadius: 10, padding: 15, fontSize: 15 },
  textArea: { height: 150, paddingTop: 15 },
  errorLabel: { color: '#FF4444', fontSize: 12, marginTop: 5, marginLeft: 5, fontWeight: '500' },
  submitBtn: { backgroundColor: '#0A66C2', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});