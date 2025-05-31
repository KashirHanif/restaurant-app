import { StyleSheet, Text, View } from 'react-native';

export default function TabHeader({ title, rightComponent }) {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.underline} />
      </View>

      {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingVertical: 35,    
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    flexDirection: 'row',       
    alignItems: 'center',       
    justifyContent: 'space-between', 
    minHeight: 90,
  },
    titleContainer: {
    paddingTop: 10,  
    },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#556B2F',
    marginBottom: 4,
  },
  underline: {
    height: 4,
    width: 80,
    backgroundColor: '#6a994e',
    borderRadius: 2,
  },
  rightComponent: {
    // Optional styling for right component container
  },
});
