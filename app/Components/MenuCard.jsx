import { StyleSheet, Text, View } from 'react-native';

export default function MenuCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Price: ₹{item.price}</Text>
        {item.category ? (
          <Text style={styles.cardText}>Category: {item.category}</Text>
        ) : null}
        {Array.isArray(item.description) && item.description.length > 0 && (
          <Text style={styles.cardText}>
            {item.description
              .map((block) =>
                block?.children?.map((child) => child.text).join('')
              )
              .join('\n')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f4eadd',
    padding: 20,
    borderRadius: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6a994e',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#3e403f',
  },
  cardText: {
    fontSize: 14,
    color: '#3e403f',
    marginTop: 2,
  },
});
