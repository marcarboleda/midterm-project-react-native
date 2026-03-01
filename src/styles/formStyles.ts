import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  card: { 
    padding: 24, 
    borderRadius: 16, 
    borderWidth: 1, 
    marginHorizontal: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    letterSpacing: -0.5 
  },
  companyName: { 
    color: '#0A66C2', 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 4 
  },
  bodyText: { 
    fontSize: 16, 
    lineHeight: 26, 
    marginTop: 15 
  },
  formTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 20 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 12, 
    borderWidth: 1.5, 
    marginBottom: 16, 
    paddingHorizontal: 12 
  },
  input: { 
    flex: 1, 
    paddingVertical: 14, 
    fontSize: 16 
  },
  submitBtn: { 
    backgroundColor: '#0A66C2', 
    paddingVertical: 18, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  submitBtnText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 16 
  }
});