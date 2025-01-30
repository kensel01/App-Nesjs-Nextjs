import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Client {
  id: string;
  name: string;
  rut: string;
  phone: string;
  email?: string;
  address: string;
  commune: string;
  city: string;
  macAddress: string;
}

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    fetchClientsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClientsSuccess: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchClientsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
  },
});

export const {
  fetchClientsStart,
  fetchClientsSuccess,
  fetchClientsFailure,
  addClient,
  updateClient,
  deleteClient,
} = clientsSlice.actions;

export default clientsSlice.reducer; 