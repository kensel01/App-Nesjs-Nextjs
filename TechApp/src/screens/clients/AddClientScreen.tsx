import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ClientStackParamList } from '../../types/navigation.types';
import { useAppDispatch } from '../../store/hooks';
import { addClient } from '../../store/slices/clientsSlice';

type AddClientScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'AddClient'>;

const AddClientScreen = () => {
  const navigation = useNavigation<AddClientScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    phone: '',
    email: '',
    address: '',
    commune: '',
    city: '',
    macAddress: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.rut || !formData.phone || !formData.address || !formData.macAddress) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    dispatch(addClient({
      id: Date.now().toString(), // Temporal, se reemplazará con el ID del backend
      ...formData
    }));

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>RUT</Text>
          <TextInput
            style={styles.input}
            placeholder="XX.XXX.XXX-X"
            value={formData.rut}
            onChangeText={(value) => handleChange('rut', value)}
            keyboardType="default"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="+56 9 XXXX XXXX"
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección completa"
            value={formData.address}
            onChangeText={(value) => handleChange('address', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Comuna</Text>
          <TextInput
            style={styles.input}
            placeholder="Comuna"
            value={formData.commune}
            onChangeText={(value) => handleChange('commune', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ciudad"
            value={formData.city}
            onChangeText={(value) => handleChange('city', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>MAC Address</Text>
          <View style={styles.macInputContainer}>
            <TextInput
              style={[styles.input, styles.macInput]}
              placeholder="XX:XX:XX:XX:XX:XX"
              value={formData.macAddress}
              onChangeText={(value) => handleChange('macAddress', value)}
            />
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => navigation.navigate('ScanMac')}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Guardar Cliente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  macInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macInput: {
    flex: 1,
    marginRight: 10,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddClientScreen; 