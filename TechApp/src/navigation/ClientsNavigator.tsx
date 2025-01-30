import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClientListScreen from '../screens/clients/ClientListScreen';
import AddClientScreen from '../screens/clients/AddClientScreen';
import ScanMacScreen from '../screens/clients/ScanMacScreen';
import { ClientStackParamList } from '../types/navigation.types';

const Stack = createStackNavigator<ClientStackParamList>();

const ClientsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientList"
        component={ClientListScreen}
        options={{ title: 'Mis Clientes' }}
      />
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{ title: 'Nuevo Cliente' }}
      />
      <Stack.Screen
        name="ScanMac"
        component={ScanMacScreen}
        options={{ title: 'Escanear MAC' }}
      />
    </Stack.Navigator>
  );
};

export default ClientsNavigator; 