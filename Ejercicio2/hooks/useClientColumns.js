import { useMemo } from 'react';
import { truncateText } from '../utils/helpers';

// Hook personalizado para generar columnas de la tabla de clientes
export function useClientColumns({ currentLocationId, getLocationName, ActionMenu }) {
  const columns = useMemo(() => {
    // Columnas base que siempre se muestran
    const baseColumns = [
      { 
        accessor: 'clientNumber', 
        Header: 'No. de cliente' 
      },
      { 
        accessor: 'clientName', 
        Header: 'Nombre' 
      },
      { 
        accessor: 'inCharge', 
        Header: 'Encargado' 
      },
      {
        accessor: 'address',
        Header: 'Dirección',
        Cell: ({ value }) => truncateText(value, 50),
      },
      { 
        accessor: 'email', 
        Header: 'Correo electrónico' 
      },
    ];

    // Agregar columna de sucursal solo si se muestran todas las ubicaciones
    const locationColumn = currentLocationId === 'TODOS' 
      ? {
          id: 'sucursal-column',
          Header: 'Sucursal',
          accessor: (row) => getLocationName(row.locationId)
        }
      : null;

    // Columna de acciones (expandir/contraer fila)
    const actionColumn = {
      accessor: 'action',
      Header: '',
      Cell: ({ row }) => <ActionMenu row={row} />,
    };

    return [
      ...baseColumns,
      ...(locationColumn ? [locationColumn] : []),
      actionColumn
    ];
  }, [currentLocationId, getLocationName, ActionMenu]);

  return columns;
}
