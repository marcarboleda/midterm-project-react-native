import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 4 
  },
  company: { 
    fontSize: 15, 
    color: '#0A66C2', 
    fontWeight: '600', 
    marginBottom: 12 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10 
  },
  locationText: { 
    fontSize: 13, 
    color: '#666' 
  },
  applyBtn: { 
    backgroundColor: '#0A66C2', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  applyBtnText: { 
    color: '#FFF', 
    fontWeight: '700', 
    fontSize: 13 
  }
});