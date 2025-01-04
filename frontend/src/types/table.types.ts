export type SortOrder = 'ASC' | 'DESC';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
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
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => Promise<void>;
  getItemId: (item: T) => number;
} 