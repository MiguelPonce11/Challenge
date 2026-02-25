import { useMemo } from 'react';

// Hook personalizado para filtrar y ordenar datos de clientes
export function useClientFilters(rawData, filters, getLocationName) {
  const filteredAndSortedData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];

    // Aplicar filtros de búsqueda, estado y ubicación

    const { filterType, searchValue, sortBy, status, location } = filters;

    // Verificar si no hay filtros activos
    const isFilterEmpty = 
      !filterType ||
      searchValue == null ||
      (Array.isArray(searchValue) && searchValue.length === 0) ||
      (typeof searchValue === 'string' && searchValue.trim() === '');

    if (isFilterEmpty) {
      return applySorting([...rawData], sortBy, 'clientName');
    }

    const filtered = rawData.filter((client) => {
      const searchMatch = matchesSearchCriteria(
        client[filterType], 
        searchValue
      );

      const statusMatch = matchesStatus(client.status, status);

      const locationMatch = matchesLocation(
        client.locationId, 
        location, 
        getLocationName
      );

      return searchMatch && statusMatch && locationMatch;
    });

    return applySorting(filtered, sortBy, filterType);
  }, [rawData, filters, getLocationName]);

  return filteredAndSortedData;
}

// Función auxiliar para coincidencia de búsqueda
function matchesSearchCriteria(fieldValue, searchValue) {
  const normalizedField = String(fieldValue || '').toLowerCase();

  // Manejar búsqueda con array de valores
  if (Array.isArray(searchValue)) {
    if (searchValue.length === 1) {
      return normalizedField.includes(searchValue[0].toLowerCase());
    }
    return searchValue.some(
      val => normalizedField === val.toLowerCase()
    );
  }

  if (typeof searchValue === 'string') {
    return normalizedField.includes(searchValue.toLowerCase());
  }

  return true;
}

// Verifica coincidencia de estado del cliente
function matchesStatus(clientStatus, filterStatus) {
  if (filterStatus === '' || filterStatus == null) return true;
  
  if (filterStatus === true) {
    return clientStatus === 'Vigente';
  }
  
  return clientStatus === 'No Vigente';
}

// Verifica coincidencia de ubicación del cliente
function matchesLocation(clientLocationId, filterLocation, getLocationName) {
  if (filterLocation === '' || filterLocation == null) return true;
  return filterLocation === getLocationName(clientLocationId);
}

// Aplica ordenamiento a los datos según el criterio seleccionado
function applySorting(data, sortBy, sortField) {
  return [...data].sort((a, b) => {
    const valueA = String(a[sortField] || '');
    const valueB = String(b[sortField] || '');

    switch (sortBy) {
      case 0:
        return valueA.localeCompare(valueB);
      case 1:
        return valueB.localeCompare(valueA);
      default:
        return 0;
    }
  });
}
