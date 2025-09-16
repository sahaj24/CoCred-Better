import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  filterOptions?: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  showClearButton?: boolean;
  onClear?: () => void;
}

export function SearchFilterBar({
  placeholder = "Search...",
  onSearch,
  onFilterChange,
  filterOptions = [],
  showClearButton = false,
  onClear
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilters({});
    onSearch?.('');
    onFilterChange?.({});
    onClear?.();
  };

  const hasActiveFilters = searchQuery || Object.values(filters).some(value => value);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        {filterOptions.map((option) => (
          <Select
            key={option.key}
            value={filters[option.key] || ''}
            onValueChange={(value) => handleFilterChange(option.key, value)}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder={option.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {option.label}</SelectItem>
              {option.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        
        {(showClearButton || hasActiveFilters) && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleClear}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear filters</span>
          </Button>
        )}
      </div>
    </div>
  );
}