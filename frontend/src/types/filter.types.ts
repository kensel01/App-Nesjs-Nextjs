export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in';

export interface FilterValue {
  value: any;
  secondValue?: any; // Para operadores como 'between'
}

export interface Filter<T> {
  field: keyof T;
  operator: FilterOperator;
  value: FilterValue;
}

export interface FilterOption<T> {
  field: keyof T;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  operators: FilterOperator[];
  options?: { label: string; value: any }[]; // Para campos tipo select
}

export interface FilterState<T> {
  filters: Filter<T>[];
  activeFilters: Filter<T>[];
} 