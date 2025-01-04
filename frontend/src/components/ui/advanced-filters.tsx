'use client';

import * as React from 'react';
import { useState } from 'react';
import { Filter, FilterOption, FilterOperator, FilterValue } from '@/types/filter.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { X, Filter as FilterIcon, Plus } from 'lucide-react';

interface AdvancedFiltersProps<T> {
  filterOptions: FilterOption<T>[];
  onFilterChange: (filters: Filter<T>[]) => void;
}

const operatorLabels: Record<FilterOperator, string> = {
  equals: 'Igual a',
  contains: 'Contiene',
  startsWith: 'Comienza con',
  endsWith: 'Termina con',
  gt: 'Mayor que',
  gte: 'Mayor o igual que',
  lt: 'Menor que',
  lte: 'Menor o igual que',
  between: 'Entre',
  in: 'En',
};

export function AdvancedFilters<T extends object>({
  filterOptions,
  onFilterChange,
}: AdvancedFiltersProps<T>) {
  const [filters, setFilters] = useState<Filter<T>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentField, setCurrentField] = useState<keyof T | null>(null);
  const [currentOperator, setCurrentOperator] = useState<FilterOperator | null>(null);
  const [currentValue, setCurrentValue] = useState<string>('');
  const [currentSecondValue, setCurrentSecondValue] = useState<string>('');

  const handleAddFilter = () => {
    if (!currentField || !currentOperator || !currentValue) return;

    const newFilter: Filter<T> = {
      field: currentField,
      operator: currentOperator,
      value: {
        value: currentValue,
        secondValue: currentOperator === 'between' ? currentSecondValue : undefined,
      },
    };

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    // Reset form
    setCurrentField(null);
    setCurrentOperator(null);
    setCurrentValue('');
    setCurrentSecondValue('');
    setIsOpen(false);
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const getCurrentFilterOption = () => {
    return currentField ? filterOptions.find(option => option.field === currentField) : null;
  };

  const renderValueInput = () => {
    const option = getCurrentFilterOption();
    if (!option) return null;

    switch (option.type) {
      case 'select':
        return (
          <Select onValueChange={setCurrentValue} value={currentValue}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar valor" />
            </SelectTrigger>
            <SelectContent>
              {option.options?.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Valor"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Valor"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="mr-2 h-4 w-4" />
              Agregar filtro
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Agregar filtro</h4>
                <p className="text-sm text-muted-foreground">
                  Selecciona el campo y el criterio de filtrado
                </p>
              </div>
              <div className="grid gap-2">
                <Select
                  onValueChange={(value) => setCurrentField(value as keyof T)}
                  value={currentField as string}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((option) => (
                      <SelectItem key={String(option.field)} value={String(option.field)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentField && (
                  <Select
                    onValueChange={(value) => setCurrentOperator(value as FilterOperator)}
                    value={currentOperator || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrentFilterOption()?.operators.map((operator) => (
                        <SelectItem key={operator} value={operator}>
                          {operatorLabels[operator]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {currentOperator && renderValueInput()}

                {currentOperator === 'between' && (
                  <Input
                    type={getCurrentFilterOption()?.type === 'number' ? 'number' : 'text'}
                    value={currentSecondValue}
                    onChange={(e) => setCurrentSecondValue(e.target.value)}
                    placeholder="Segundo valor"
                  />
                )}

                <Button onClick={handleAddFilter} disabled={!currentField || !currentOperator || !currentValue}>
                  Agregar filtro
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const option = filterOptions.find((opt) => opt.field === filter.field);
            return (
              <Badge key={index} variant="secondary" className="h-8">
                <span className="flex items-center gap-1">
                  {option?.label} {operatorLabels[filter.operator]} {filter.value.value}
                  {filter.value.secondValue && ` y ${filter.value.secondValue}`}
                  <button
                    onClick={() => handleRemoveFilter(index)}
                    className="ml-1 hover:bg-muted rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
} 