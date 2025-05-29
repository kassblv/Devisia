"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  hidden?: boolean | ((width: number) => boolean); // Permet de cacher des colonnes selon la taille de l'écran
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyField: keyof T; // Champ unique pour identifier chaque ligne
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  rowClassName?: (row: T) => string;
  scrollable?: boolean; // Nouvelle option pour contrôler le scroll horizontal
}

const SCREEN_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function DataTable<T>({ 
  columns, 
  data, 
  keyField,
  defaultSortColumn = "",
  defaultSortDirection = "asc",
  pagination = true,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  onSortChange,
  isLoading = false,
  emptyState,
  className,
  headerClassName,
  rowClassName,
  scrollable = false // Désactivé par défaut
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(defaultSortDirection);
  const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  
  // Gestionnaire de redimensionnement pour mise à jour du responsive
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Gestionnaire de tri
  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    
    const newDirection = sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column.key);
    setSortDirection(newDirection);
    
    if (onSortChange) {
      onSortChange(column.key, newDirection);
    }
  };
  
  // Filtrer les colonnes visibles en fonction de la taille de l'écran
  const visibleColumns = columns.filter(col => {
    if (typeof col.hidden === "function") {
      return !col.hidden(windowWidth);
    }
    return !col.hidden;
  });
  
  // Composant pour les lignes de chargement
  const LoadingRow = ({ colCount }: { colCount: number }) => (
    <TableRow className="animate-pulse">
      {Array.from({ length: colCount }).map((_, idx) => (
        <TableCell key={idx}>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </TableCell>
      ))}
    </TableRow>
  );
  
  // Si aucune donnée et état vide personnalisé
  const renderEmptyState = () => {
    if (data.length === 0 && emptyState) {
      return (
        <TableRow>
          <TableCell colSpan={visibleColumns.length} className="text-center py-8">
            {emptyState}
          </TableCell>
        </TableRow>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="rounded-md border overflow-hidden">
        <div className={scrollable ? "overflow-x-auto" : "overflow-hidden"}>
          <Table>
            <TableHeader className={headerClassName}>
              <TableRow>
                {visibleColumns.map((column, idx) => (
                  <TableHead 
                    key={idx} 
                    className={cn(
                      column.className,
                      column.sortable ? "cursor-pointer select-none" : ""
                    )}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && sortColumn === column.key && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Afficher des lignes de chargement
                Array.from({ length: 5 }).map((_, idx) => (
                  <LoadingRow key={idx} colCount={visibleColumns.length} />
                ))
              ) : data.length > 0 ? (
                // Afficher les données
                data.map((row) => (
                  <TableRow 
                    key={String(row[keyField])}
                    className={rowClassName ? rowClassName(row) : ""}
                  >
                    {visibleColumns.map((column, colIdx) => (
                      <TableCell key={colIdx} className={column.className}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                renderEmptyState()
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {pagination && totalItems > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
}

// Composant de rendu par défaut pour état vide
export function DefaultEmptyState({ message = "Aucun résultat trouvé", icon }: { message: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
      {icon || (
        <svg className="h-12 w-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
      <p>{message}</p>
    </div>
  );
}
