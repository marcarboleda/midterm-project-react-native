import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, ScrollView, 
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { useJobs } from '../context/JobContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formStyles as styles } from '../styles/formStyles';

export const ApplyScreen = ({ route, navigation }: any) => {
  const { isDarkMode } = useJobs();
  const { job } = route.params;

  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '' });

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!form.name.trim()) return "Full name is required.";
    if (!emailRegex.test(form.email)) return "Valid email is required.";
    if (!phoneRegex.test(form.phone)) return "Valid phone number is required.";
    if (form.bio.trim().length < 20) return "Statement must be at least 20 characters.";
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) return Alert.alert("Required", error);

    Alert.alert("Success", `Applied to ${job.companyName}!`, [
      { text: "OK", onPress: () => {
          setForm({ name: '', email: '', phone: '', bio: '' });
          navigation.popToTop();
      }}
    ]);
  };

  const theme = {
    bg: isDarkMode ? '#0D1117' : '#F8F9FA',
    card: isDarkMode ? '#161B22' : '#FFFFFF',
    text: isDarkMode ? '#C9D1D9' : '#1F2328',
    inputBg: isDarkMode ? '#0D1117' : '#F6F8FA',
    border: isDarkMode ? '#30363D' : '#E1E4E8'
  };

  const Input = ({ label, keyName, type = "default", multi = false }: any) => (
    <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.border, alignItems: multi ? 'flex-start' : 'center' }]}>
      <TextInput 
        placeholder={label}
        placeholderTextColor="#888"
        value={(form as any)[keyName]}
        onChangeText={(t) => setForm({...form, [keyName]: t})}
        keyboardType={type as any}
        multiline={multi}
        style={[styles.input, { color: theme.text, height: multi ? 120 : undefined, textAlignVertical: multi ? 'top' : 'center' }]}
      />
      {(form as any)[keyName].length > 0 && (
        <TouchableOpacity onPress={() => setForm({...form, [keyName]: ''})} style={{ marginTop: multi ? 14 : 0 }}>
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={100}>
        <ScrollView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 20, marginBottom: 40 }]}>
              <Text style={[styles.formTitle, { color: theme.text }]}>Apply for {job.title}</Text>
              <Input label="Full Name" keyName="name" />
              <Input label="Email Address" keyName="email" type="email-address" />
              <Input label="Contact Number" keyName="phone" type="phone-pad" />
              <Input label="Why should we hire you?" keyName="bio" multi={true} />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Confirm Application</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};