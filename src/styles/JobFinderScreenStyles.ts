import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) => StyleSheet.create({
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    marginTop: 15, 
    borderWidth: 1 
  },
  clearIcon: { padding: 5 },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.8)', 
    justifyContent: 'flex-end' 
  },
  modal: { 
    height: '90%', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30 
  },
  modalHeader: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  iconBtn: { padding: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalHero: { padding: 20, alignItems: 'center' },
  modalLogo: { width: 70, height: 70, borderRadius: 15 },
  modalLogoPlaceholder: { 
    width: 70, 
    height: 70, 
    borderRadius: 15, 
    backgroundColor: 'rgba(10, 102, 194, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  heroTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 15 
  },
  heroSubtitle: { 
    fontSize: 16, 
    color: '#0A66C2', 
    marginTop: 5, 
    fontWeight: '600' 
  },
  modalSalary: { fontSize: 17, fontWeight: 'bold', marginTop: 8 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { 
    flex: 1, 
    paddingVertical: 15, 
    alignItems: 'center', 
    borderBottomWidth: 3, 
    borderBottomColor: 'transparent' 
  },
  lineRow: { flexDirection: 'row', marginBottom: 12, paddingRight: 15 },
  bodyText: { fontSize: 15, lineHeight: 24 },
  footerActions: { 
    padding: 20, 
    borderTopWidth: 1, 
    flexDirection: 'row', 
    gap: 12, 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0 
  },
  applyBtn: { 
    flex: 1, 
    backgroundColor: '#0A66C2', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  saveBtnAction: { 
    padding: 16, 
    borderRadius: 15, 
    borderWidth: 1, 
    justifyContent: 'center' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40, 
    marginTop: 50 
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  emptySubtext: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginTop: 10, 
    lineHeight: 22 
  },
  clearSearchBtn: { 
    marginTop: 25, 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 10 
  }
});