import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation.types';

type ScanMacScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'ScanMac'>;

const ScanMacScreen = () => {
  const navigation = useNavigation<ScanMacScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Escanear MAC Address</Text>
      {/* Aquí implementaremos el scanner de QR/Barcode */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ScanMacScreen; 