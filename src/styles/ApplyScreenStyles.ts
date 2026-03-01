import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) => StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    paddingVertical: 15, 
    borderBottomWidth: 1 
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  jobSummary: { 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    marginBottom: 20 
  },
  jobTitle: { fontSize: 16, fontWeight: 'bold' },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8, 
    marginTop: 15 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 15, 
    fontSize: 15 
  },
  textArea: { height: 150, paddingTop: 15 },
  errorLabel: { 
    color: '#FF4444', 
    fontSize: 12, 
    marginTop: 5, 
    marginLeft: 5, 
    fontWeight: '500' 
  },
  submitBtn: { 
    backgroundColor: '#0A66C2', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 30 
  },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});