import { StyleSheet } from 'react-native';

export const getStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  card: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    color: '#0A66C2',
    fontWeight: '600',
  },
  salaryContainer: {
    marginVertical: 15,
    padding: 12,
    backgroundColor: isDarkMode ? '#0D1117' : '#F0F2F5',
    borderRadius: 8,
  },
  salaryText: {
    color: '#28a745',
    fontWeight: '800',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
  },
  submitBtn: {
    backgroundColor: '#0A66C2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});