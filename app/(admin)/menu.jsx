import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

//adding the menu here 
export default function Menu() {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('published');

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setStatus('published');
    setIsAdding(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {!isAdding ? (
          <View style={styles.centered}>
            <Text style={styles.message}>No menu items found</Text>
            <TouchableOpacity style={styles.button} onPress={() => setIsAdding(true)}>
              <Text style={styles.buttonText}>Add Menu Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.heading}>Add Menu Item</Text>

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

            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[styles.statusButton, status === 'published' && styles.selected]}
                onPress={() => setStatus('published')}
              >
                <Text style={styles.statusText}>Published</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, status === 'draft' && styles.selected]}
                onPress={() => setStatus('draft')}
              >
                <Text style={styles.statusText}>Draft</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save (dummy)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetForm}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fffaf3',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6a994e',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fffaf3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 10,
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 6,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#6a994e',
  },
  statusText: {
    color: '#fffaf3',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#6a994e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
});
