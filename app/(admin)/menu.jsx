import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setIsAdding(false);
    setEditIndex(null);
  };

  const handleAddOrUpdate = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation', 'Please enter at least name and price.');
      return;
    }

    const newItem = { name, price, category, description };

    if (editIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editIndex] = newItem;
      setItems(updatedItems);
      Alert.alert('Success', 'Menu item updated');
    } else {
      setItems([...items, newItem]);
      Alert.alert('Success', 'Menu item added');
    }
    resetForm();
  };

  const handleEdit = (index) => {
    const item = items[index];
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setDescription(item.description);
    setEditIndex(index);
    setIsAdding(true);
  };

  const handleDelete = (index) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const filteredItems = items.filter((_, i) => i !== index);
            setItems(filteredItems);
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Price: ₹{item.price}</Text>
        {item.category ? <Text style={styles.cardText}>Category: {item.category}</Text> : null}
        {item.description ? <Text style={styles.cardText}>{item.description}</Text> : null}
      </View>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.message}>No menu items found</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fffaf3' }}
    >
      {!isAdding ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderItem}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={items.length === 0 ? styles.flatListEmpty : { padding: 24, paddingBottom: 96 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Floating Add Button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setIsAdding(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.form}>
          <Text style={styles.heading}>
            {editIndex !== null ? 'Edit Menu Item' : 'Add Menu Item'}
          </Text>

          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Price"
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Category"
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Description"
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleAddOrUpdate}>
            <Text style={styles.saveButtonText}>{editIndex !== null ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetForm}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fffaf3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fffaf3',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3e403f',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4eadd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#3e403f',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6a994e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fffaf3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6c5c45',
    fontSize: 14,
  },
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
    marginTop: 50,
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
  cardButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: '#6a994e',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6a994e',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
});
