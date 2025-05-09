import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Loader2, CircleCheck, AlertCircle, ClipboardList, CalendarDays, Clock, Search, User, MapPin, Mail, CreditCard, ChevronRight, RefreshCw, XCircle, Wifi, ChevronDown, ChevronUp, ReceiptText, Zap, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useThrottle } from '../hooks/useThrottle';

interface StatusResponse {
  status: 'active' | 'suspended' | 'not_found';
  balance?: number;
  service?: string;
  lastPayment?: string;
  nextDueDate?: string;
  daysUntilSuspension?: number;
  errorMessage?: string;
  rutConsultado?: string;
  cliente?: {
    id?: number;
    nombre?: string;
    email?: string;
    direccion?: string;
    telefono?: string;
    fechaRegistro?: string;
  };
  recentPayments?: Array<{
    fecha: string;
    monto: number;
    estado: string;
    metodo: string;
    comprobante?: string | null;
  }>;
  serviceDetails?: {
    velocidad?: string;
    caracteristicas?: string[];
    tipoConexion?: string;
  };
  tendenciaPagos?: {
    puntualidad: 'alta' | 'media' | 'baja';
    ultimosMeses: number;
  } | null;
  sugerencias?: Array<{
    rut: string;
    nombre: string;
  }>;
}

interface RecentSearch {
  rut: string;
  timestamp: number;
}

// Función para validar el dígito verificador del RUT chileno
const validarRUT = (rut: string): boolean => {
  if (!rut) return false;
  
  // Eliminar puntos y guión
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  // Obtener dígito verificador
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  // Obtener cuerpo del RUT
  const rutNum = parseInt(rutLimpio.slice(0, -1), 10);
  
  if (isNaN(rutNum)) return false;
  
  // Algoritmo para calcular dígito verificador
  let suma = 0;
  let factor = 2;
  
  // Calcular suma ponderada
  let rutAux = rutNum;
  while (rutAux > 0) {
    const digito = rutAux % 10;
    suma += digito * factor;
    rutAux = Math.floor(rutAux / 10);
    factor = factor < 7 ? factor + 1 : 2;
  }
  
  // Calcular dígito verificador esperado
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
  // Comparar dígito verificador
  return dv === dvCalculado;
};

// Función para formatear RUT (12.345.678-9)
const formatearRUT = (value: string): string => {
  // Remover caracteres no válidos
  value = value.replace(/[^0-9kK]/g, '');
  
  if (value.length <= 1) return value;
  
  // Separar dígito verificador
  const dv = value.slice(-1);
  const rutBody = value.slice(0, -1);
  
  // Formatear con puntos
  let rutFormateado = '';
  let count = 0;
  
  for (let i = rutBody.length - 1; i >= 0; i--) {
    count++;
    rutFormateado = rutBody[i] + rutFormateado;
    if (count === 3 && i !== 0) {
      rutFormateado = '.' + rutFormateado;
      count = 0;
    }
  }
  
  return `${rutFormateado}-${dv}`;
};

const StatusCheckForm = () => {
  const [rut, setRut] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null as StatusResponse | null);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Estado para controlar la visualización de secciones colapsables
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  
  // Cargar búsquedas recientes al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('recentRutSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RecentSearch[];
        setRecentSearches(parsed);
      } catch (e) {
        console.error('Error parsing recent searches', e);
      }
    }
  }, []);
  
  // Cerrar dropdown de búsquedas recientes al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowRecentSearches(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Función para verificar estado del cliente
  async function checkStatus(e: any, overrideRut?: string) {
    if (e) e.preventDefault();
    
    const rutToCheck = overrideRut || rut;
    
    if (!rutToCheck) return;
    
    // Validar RUT antes de enviar
    if (!validarRUT(rutToCheck)) {
      setIsValid(false);
      setValidationMessage('El RUT ingresado no es válido');
      setValidationState('invalid');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Crear un token que será validado en el backend
      const token = await fetchPaymentIntent(rutToCheck);
      
      // Realizar petición API al backend para verificar estado
      const response = await fetch('/api/client/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut: rutToCheck, token }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      
      // Guardar búsqueda exitosa en recientes
      saveRecentSearch(rutToCheck);
      
    } catch (error) {
      console.error('Error checking status:', error);
      setResult({
        status: 'not_found',
        errorMessage: 'Ocurrió un error al consultar tu estado. Por favor intenta más tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Limitar las consultas para evitar abuso
  const throttledCheckStatus = useThrottle(checkStatus, 2000);
  
  // Format RUT as user types
  const handleRutChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    const formattedRut = formatearRUT(value);
    setRut(formattedRut);
    
    // Mostrar sugerencias cuando el usuario escribe
    if (formattedRut.length > 0) {
      setShowRecentSearches(true);
    } else {
      setShowRecentSearches(false);
      setValidationState('idle');
    }
    
    // Validar RUT mientras se escribe
    if (formattedRut.length > 3) {
      setValidationState('validating'); // Mostrar que estamos validando
      
      // Retrasar la validación real para proporcionar feedback visual
      setTimeout(() => {
        const isValidRut = validarRUT(formattedRut);
        setIsValid(isValidRut);
        setValidationMessage(isValidRut ? '' : 'RUT no válido');
        setValidationState(isValidRut ? 'valid' : 'invalid');
      }, 400);
    } else {
      setIsValid(true);
      setValidationMessage('');
      setValidationState('idle');
    }
  };
  
  // Guardar búsqueda reciente
  const saveRecentSearch = (rutValue: string) => {
    const search: RecentSearch = {
      rut: rutValue,
      timestamp: Date.now(),
    };
    
    // Evitar duplicados y mantener solo las últimas 5 búsquedas
    const updatedSearches = [
      search,
      ...recentSearches.filter((s: RecentSearch) => s.rut !== rutValue),
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentRutSearches', JSON.stringify(updatedSearches));
  };
  
  // Seleccionar una búsqueda reciente
  const selectRecentSearch = (rutValue: string) => {
    setRut(rutValue);
    setShowRecentSearches(false);
    setValidationState('valid');
    setIsValid(true);
    checkStatus(null, rutValue);
  };

  // Limpiar el campo de búsqueda
  const clearSearch = () => {
    setRut('');
    setResult(null);
    setValidationState('idle');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Get a token from backend to prevent CSRF and validate payment intent
  async function fetchPaymentIntent(rutValue = rut) {
    const response = await fetch('/api/payment/intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rut: rutValue }),
    });
    
    const data = await response.json();
    return data.token;
  }
  
  // Redirect to payment page with the validated token
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const token = await fetchPaymentIntent();
      window.location.href = `/payment?token=${token}&rut=${encodeURIComponent(rut)}`;
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('No se pudo iniciar el proceso de pago. Por favor intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'No disponible';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  // Función para obtener un indicador de estado basado en días restantes o suspensión
  const getStatusIndicator = () => {
    if (!result) return null;
    
    if (result.status === 'suspended') {
      return {
        color: 'red',
        icon: <AlertCircle className="h-5 w-5" />,
        text: 'Servicio suspendido por falta de pago',
        description: 'Contacta a soporte o realiza un pago para reactivar tu servicio'
      };
    } else if (result.status === 'active') {
      if (result.daysUntilSuspension !== undefined) {
        if (result.daysUntilSuspension <= 3) {
          return {
            color: 'amber',
            icon: <AlertTriangle className="h-5 w-5" />,
            text: 'Pago próximo a vencer',
            description: `Tienes ${result.daysUntilSuspension} días para realizar tu pago`
          };
        } else if (result.daysUntilSuspension <= 7) {
          return {
            color: 'amber',
            icon: <Info className="h-5 w-5" />,
            text: 'Pago pendiente',
            description: `Tu próximo pago vence en ${result.daysUntilSuspension} días`
          };
        } else {
          return {
            color: 'green',
            icon: <CheckCircle className="h-5 w-5" />,
            text: 'Servicio al día',
            description: 'Tu servicio está activo y al día con los pagos'
          };
        }
      }
    }
    
    return null;
  };
  
  const statusIndicator = getStatusIndicator();
  
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="bg-emerald-500 p-4 text-white">
        <h3 className="text-xl font-bold">Consulta el estado de tu servicio</h3>
        <p className="text-sm opacity-90">Ingresa tu RUT para ver el estado de tu cuenta</p>
      </div>
      
      <div className="p-6">
        <form onSubmit={(e) => throttledCheckStatus(e)} className="mb-6">
          <div className="relative">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={rut}
                onChange={handleRutChange}
                onFocus={() => recentSearches.length > 0 && rut.length > 0 && setShowRecentSearches(true)}
                placeholder="Ingresa tu RUT (ej: 12.345.678-9)"
                className={`pl-10 pr-10 py-3 border rounded-lg w-full focus:ring-2 focus:outline-none transition-all
                  ${!isValid && validationState === 'invalid' 
                    ? 'border-red-300 focus:ring-red-100 bg-red-50' 
                    : validationState === 'valid'
                      ? 'border-green-300 focus:ring-green-100 bg-green-50'
                      : validationState === 'validating'
                        ? 'border-amber-300 focus:ring-amber-100 bg-amber-50'
                        : 'border-gray-300 focus:ring-emerald-100 focus:border-emerald-300'}`}
                aria-invalid={!isValid}
                aria-describedby={!isValid ? "rut-error" : undefined}
              />
              <span className="absolute right-10 text-gray-400">
                {validationState === 'validating' && (
                  <Loader2 size={18} className="animate-spin text-amber-500" />
                )}
                {validationState === 'valid' && (
                  <CheckCircle size={18} className="text-green-500" />
                )}
                {validationState === 'invalid' && (
                  <AlertCircle size={18} className="text-red-500" />
                )}
              </span>
              {rut && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>
            
            {!isValid && validationState === 'invalid' && (
              <p id="rut-error" className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> {validationMessage}
              </p>
            )}

            {validationState === 'valid' && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> RUT válido
              </p>
            )}
            
            {/* Dropdown para búsquedas recientes con UI mejorada */}
            {showRecentSearches && recentSearches.length > 0 && (
              <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="py-2 px-3 text-xs text-gray-500 border-b flex items-center">
                  <ClipboardList className="h-3 w-3 mr-1" />
                  Búsquedas recientes
                </div>
                <ul>
                  {recentSearches.map((search: RecentSearch) => (
                    <li 
                      key={search.rut}
                      onClick={() => selectRecentSearch(search.rut)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">
                          <User size={16} />
                        </span>
                        <div>
                          <div className="font-medium">{search.rut}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(search.timestamp).toLocaleDateString('es-CL')}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || (validationState === 'invalid') || !rut || validationState === 'validating'}
            className={`mt-4 w-full flex items-center justify-center py-3 px-4 rounded-lg transition
              ${(isLoading || validationState === 'invalid' || !rut || validationState === 'validating') 
                ? 'opacity-60 cursor-not-allowed bg-gray-400 text-white' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Consultar Estado
              </>
            )}
          </button>
        </form>
        
        {/* Indicador de estado */}
        {result && statusIndicator && (
          <div className={`mb-4 p-3 rounded-lg flex items-center bg-${statusIndicator.color}-50 border border-${statusIndicator.color}-200 text-${statusIndicator.color}-700`}>
            <div className={`mr-3 text-${statusIndicator.color}-500`}>
              {statusIndicator.icon}
            </div>
            <div>
              <h5 className="font-medium">{statusIndicator.text}</h5>
              <p className="text-sm opacity-75">{statusIndicator.description}</p>
            </div>
          </div>
        )}
        
        {result && (
          <div className={`mt-4 rounded-lg overflow-hidden border ${
            result.status === 'active' 
              ? 'border-green-200 bg-green-50' 
              : result.status === 'suspended' 
                ? 'border-red-200 bg-red-50' 
                : 'border-gray-200 bg-gray-50'
          }`}>
            <div className={`p-4 ${
              result.status === 'active' 
                ? 'bg-green-100' 
                : result.status === 'suspended' 
                  ? 'bg-red-100' 
                  : 'bg-gray-100'
            }`}>
              <div className="flex items-center">
                {result.status === 'active' && (
                  <CircleCheck className="h-6 w-6 text-green-600 mr-3" />
                )}
                {result.status === 'suspended' && (
                  <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                )}
                {result.status === 'not_found' && (
                  <AlertCircle className="h-6 w-6 text-gray-600 mr-3" />
                )}
                
                <div>
                  <h4 className="font-bold text-lg">
                    {result.status === 'active' && 'Servicio Activo'}
                    {result.status === 'suspended' && 'Servicio Suspendido'}
                    {result.status === 'not_found' && 'No Encontrado'}
                  </h4>
                  <p className="text-sm">
                    {result.status === 'active' && 'Tu servicio está funcionando correctamente'}
                    {result.status === 'suspended' && 'Tu servicio está suspendido por falta de pago'}
                    {result.status === 'not_found' && result.errorMessage}
                  </p>
                </div>
              </div>
            </div>
            
            {(result.status === 'active' || result.status === 'suspended') && (
              <div className="p-4">
                {/* Información del cliente */}
                {result.cliente && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-3">Información de Cliente</h5>
                    <div className="space-y-2">
                      {result.cliente.nombre && (
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium mr-2">Nombre:</span>
                          <span>{result.cliente.nombre}</span>
                        </div>
                      )}
                      {result.cliente.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium mr-2">Email:</span>
                          <span>{result.cliente.email}</span>
                        </div>
                      )}
                      {result.cliente.direccion && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium mr-2">Dirección:</span>
                          <span>{result.cliente.direccion}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Información del servicio */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-700">Servicio Contratado</h5>
                    
                    {result.serviceDetails && (
                      <button 
                        onClick={() => setShowServiceDetails(!showServiceDetails)}
                        className="text-xs flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showServiceDetails ? (
                          <>
                            <ChevronUp size={14} className="mr-1" />
                            Ocultar detalles
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="mr-1" />
                            Ver detalles
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="text-sm bg-white p-3 rounded border border-gray-200">
                    <div className="font-medium mb-1">{result.service || 'Servicio no especificado'}</div>
                    
                    {result.serviceDetails?.velocidad && (
                      <div className="text-xs text-gray-600 flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-gray-400" />
                        Velocidad: {result.serviceDetails.velocidad}
                      </div>
                    )}
                  </div>
                  
                  {/* Detalles técnicos del servicio (colapsable) */}
                  {showServiceDetails && result.serviceDetails && (
                    <div className="mt-3 text-sm bg-white p-3 rounded border border-gray-200">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">Tipo de conexión:</span>
                        <span className="ml-2 font-medium">{result.serviceDetails.tipoConexion}</span>
                      </div>
                      
                      {result.serviceDetails.caracteristicas && result.serviceDetails.caracteristicas.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500">Características:</span>
                          <ul className="mt-1 space-y-1">
                            {result.serviceDetails.caracteristicas.map((caracteristica: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <Wifi className="h-3 w-3 mr-2 text-emerald-500" />
                                {caracteristica}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Estado de pago y fechas */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-3">Estado de Pago</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col bg-white p-3 rounded border border-gray-200">
                      <span className="text-xs text-gray-500 mb-1 flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" /> 
                        Último Pago
                      </span>
                      <span className="font-medium">{formatDate(result.lastPayment)}</span>
                    </div>
                    
                    <div className="flex flex-col bg-white p-3 rounded border border-gray-200">
                      <span className="text-xs text-gray-500 mb-1 flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" /> 
                        Próximo Vencimiento
                      </span>
                      <span className="font-medium">{formatDate(result.nextDueDate)}</span>
                    </div>
                    
                    {result.status === 'active' && result.daysUntilSuspension !== undefined && (
                      <div className="flex flex-col bg-white p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500 mb-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> 
                          Días Hasta Vencimiento
                        </span>
                        <span className={`font-medium ${
                          result.daysUntilSuspension <= 3 
                            ? 'text-red-600' 
                            : result.daysUntilSuspension <= 7 
                              ? 'text-amber-600' 
                              : ''
                        }`}>
                          {result.daysUntilSuspension} días
                        </span>
                      </div>
                    )}
                    
                    {result.status === 'suspended' && result.balance !== undefined && (
                      <div className="flex flex-col bg-white p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500 mb-1 flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" /> 
                          Saldo Pendiente
                        </span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(result.balance)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Historial de pagos recientes */}
                {result.recentPayments && result.recentPayments.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-700">Historial de Pagos</h5>
                      <button 
                        onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                        className="text-xs flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPaymentHistory ? (
                          <>
                            <ChevronUp size={14} className="mr-1" />
                            Ocultar historial
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="mr-1" />
                            Ver historial
                          </>
                        )}
                      </button>
                    </div>
                    
                    {showPaymentHistory && (
                      <div className="space-y-2">
                        {result.recentPayments.map((pago: any, index: number) => (
                          <div key={index} className="p-3 bg-white rounded border border-gray-200 flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <ReceiptText className="h-3 w-3 mr-2 text-gray-500" />
                                <span className="font-medium">
                                  {formatDate(pago.fecha)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{pago.metodo}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(pago.monto)}
                              </div>
                              <div className={`text-xs mt-1 ${
                                pago.estado === 'COMPLETED' || pago.estado === 'APPROVED' 
                                  ? 'text-green-600' 
                                  : pago.estado === 'PENDING' 
                                    ? 'text-amber-600' 
                                    : 'text-red-600'
                              }`}>
                                {pago.estado === 'COMPLETED' || pago.estado === 'APPROVED' 
                                  ? 'Completado' 
                                  : pago.estado === 'PENDING' 
                                    ? 'Pendiente' 
                                    : 'Fallido'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Acciones */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  {result.status === 'suspended' && (
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagar Ahora
                    </button>
                  )}
                  
                  <button
                    onClick={() => checkStatus(null, rut)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed
                      ${result.status === 'suspended' 
                        ? 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualizar Estado
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {result && result.status === 'not_found' && (
          <div className="mt-4 p-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <div className="mb-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-gray-600 mr-3" />
              <div>
                <h4 className="font-bold text-lg">Cliente No Encontrado</h4>
                <p className="text-sm">{result.errorMessage}</p>
              </div>
            </div>
            
            {/* Sugerencias de clientes similares */}
            {result.sugerencias && result.sugerencias.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">¿Buscabas alguno de estos?</h5>
                <div className="space-y-2">
                  {result.sugerencias.map((sugerencia, index) => (
                    <div 
                      key={index}
                      onClick={() => selectRecentSearch(sugerencia.rut)}
                      className="p-3 bg-white rounded border border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">{sugerencia.nombre}</div>
                          <div className="text-sm text-gray-500">{sugerencia.rut}</div>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Información de tendencia de pagos */}
        {result?.tendenciaPagos && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h5 className="font-semibold text-gray-700 mb-3">Análisis de Pago</h5>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center">
                <div className="mr-3">
                  {result.tendenciaPagos.puntualidad === 'alta' && (
                    <div className="rounded-full bg-green-100 p-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  {result.tendenciaPagos.puntualidad === 'media' && (
                    <div className="rounded-full bg-amber-100 p-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                  )}
                  {result.tendenciaPagos.puntualidad === 'baja' && (
                    <div className="rounded-full bg-red-100 p-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {result.tendenciaPagos.puntualidad === 'alta' && 'Excelente historial de pago'}
                    {result.tendenciaPagos.puntualidad === 'media' && 'Historial de pago regular'}
                    {result.tendenciaPagos.puntualidad === 'baja' && 'Historial de pago con retrasos'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Basado en los últimos {result.tendenciaPagos.ultimosMeses} meses
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCheckForm; 