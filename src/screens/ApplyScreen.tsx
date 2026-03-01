import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJobs } from '../context/JobContext';
import { Ionicons } from '@expo/vector-icons';
import { getRouter } from '../utils/router';
import { getStyles } from '../styles/ApplyScreenStyles'; // Updated import path

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
    placeholder: isDarkMode ? '#8B949E' : '#999999',
    error: '#FF4444',
  };

  const localStyles = getStyles(theme);

  const FIELD_POSITIONS = {
    name: 0,
    email: 80,
    phone: 180,
    hireReason: 300
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (Object.keys(errors).length === 0) {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    });
    return () => keyboardDidHideListener.remove();
  }, [errors]);

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
    let firstErrorField: string | null = null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
      if (!firstErrorField) firstErrorField = 'name';
    }

    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      newErrors.email = 'Valid email is required (e.g. name@domain.com)';
      if (!firstErrorField) firstErrorField = 'email';
    }

    if (form.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Valid 10-digit number required';
      if (!firstErrorField) firstErrorField = 'phone';
    }

    if (form.hireReason.trim().length < 20) {
      newErrors.hireReason = 'Please provide at least 20 characters';
      if (!firstErrorField) firstErrorField = 'hireReason';
    }

    setErrors(newErrors);

    if (firstErrorField) {
      const targetY = FIELD_POSITIONS[firstErrorField as keyof typeof FIELD_POSITIONS];
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
      return;
    }

    Alert.alert("Confirm Submission", "Ready to submit your application?", [
      { text: "Review", style: "cancel" },
      { text: "Submit", onPress: () => {
          Alert.alert("Success!", "Application sent.", [
            { text: "OK", onPress: () => router.replace('JobFinderHome') }
          ]);
      }}
    ]);
  };

  const getBorderColor = (fieldName: string) => errors[fieldName] ? theme.error : theme.border;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <View style={[localStyles.header, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={handleBackWithConfirmation} style={localStyles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={[localStyles.headerTitle, { color: theme.text }]}>Apply</Text>
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

              <Text style={[localStyles.label, { color: theme.text }]}>Full Name *</Text>
              <TextInput
                style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('name') }]}
                placeholder="Enter your name"
                placeholderTextColor={theme.placeholder}
                value={form.name}
                onFocus={() => scrollToInput(FIELD_POSITIONS.name)}
                onChangeText={(t) => {
                    setForm({...form, name: t});
                    if (errors.name) setErrors({...errors, name: null});
                }}
              />
              {errors.name && <Text style={localStyles.errorLabel}>{errors.name}</Text>}

              <Text style={[localStyles.label, { color: theme.text }]}>Email Address *</Text>
              <TextInput
                style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('email') }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onFocus={() => scrollToInput(FIELD_POSITIONS.email)}
                onChangeText={(t) => {
                    setForm({...form, email: t});
                    if (errors.email) setErrors({...errors, email: null});
                }}
              />
              {errors.email && <Text style={localStyles.errorLabel}>{errors.email}</Text>}

              <Text style={[localStyles.label, { color: theme.text }]}>Contact Number *</Text>
              <TextInput
                style={[localStyles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: getBorderColor('phone') }]}
                placeholder="Enter phone number"
                placeholderTextColor={theme.placeholder}
                keyboardType="phone-pad"
                value={form.phone}
                onFocus={() => scrollToInput(FIELD_POSITIONS.phone)}
                onChangeText={(t) => {
                    setForm({...form, phone: t});
                    if (errors.phone) setErrors({...errors, phone: null});
                }}
              />
              {errors.phone && <Text style={localStyles.errorLabel}>{errors.phone}</Text>}

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
                onFocus={() => scrollToInput(FIELD_POSITIONS.hireReason)} 
                onChangeText={(t) => {
                    setForm({...form, hireReason: t});
                    if (errors.hireReason) setErrors({...errors, hireReason: null});
                }}
              />
              {errors.hireReason && <Text style={localStyles.errorLabel}>{errors.hireReason}</Text>}

              <TouchableOpacity style={localStyles.submitBtn} onPress={handleApply}>
                <Text style={localStyles.submitBtnText}>Submit Application</Text>
              </TouchableOpacity>
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};