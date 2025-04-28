export type SortOrder = 'ASC' | 'DESC';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T, IdType = number> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  sortBy?: keyof T;
  sortOrder?: SortOrder;
  isLoading?: boolean;
  searchPlaceholder?: string;
  onPageChange: (page: number) => void;
  onSort?: (field: keyof T) => void;
  onSearch?: (query: string) => void;
  onEdit?: (id: IdType) => void;
  onDelete?: (id: IdType) => Promise<void>;
  getItemId: (item: T) => IdType;
} 