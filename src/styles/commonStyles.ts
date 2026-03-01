import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingHorizontal: 20, 
    paddingBottom: 15 
  },
  screenTitle: { 
    fontSize: 32, 
    fontWeight: '800', 
    letterSpacing: -0.5 
  },
  filterWrapper: { 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  filterScroll: { 
    paddingHorizontal: 16 
  },
  filterPill: { 
    paddingHorizontal: 18, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginRight: 10, 
    borderWidth: 1 
  },
  filterText: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 100, 
    paddingHorizontal: 40 
  },
});