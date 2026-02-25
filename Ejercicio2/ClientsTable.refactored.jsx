import React, {Fragment,useMemo,useCallback,useContext} from 'react';
import {useExpanded,useTable,useFilters,useGlobalFilter,usePagination} from 'react-table';
import { Col, Row, Table } from 'react-bootstrap';
import 'regenerator-runtime';
import Pagination from '../../../components/elements/advance-table/Pagination';
import ClientFilters from './ClientFilters';

import ExpandedClientsViewTable from './ExpandedClientsViewTable.jsx';
import { DashboardContext } from '../../../context/Context';

import { useClientColumns } from './hooks/useClientColumns';
import { useClientFilters } from './hooks/useClientFilters';
import { isMobileDevice, calculateTableHeight } from './utils/helpers';

const ClientsTable = ({ inv_data, filters, setFilters, locationIds }) => {
  const { locations, currentLocationId } = useContext(DashboardContext);

  // Mapa de ubicaciones para búsqueda rápida
  const locationMap = useMemo(() => {
    const map = {};
    locations?.forEach((loc) => {
      map[loc.locationId] = loc.name;
    });
    return map;
  }, [locations]);

  const getLocationName = useCallback(
    (locationId) => locationMap[locationId] ?? locationId,
    [locationMap]
  );

  const ActionMenu = useCallback(({ row }) => {
    return (
      <i
        className={`fi fs-3 fi-rs-angle-circle-${
          row.isExpanded ? 'up' : 'down'
        }`}
        {...row.getToggleRowExpandedProps()}
      />
    );
  }, []);

  // Generación de columnas y filtrado de datos
  const columns = useClientColumns({
    currentLocationId,
    getLocationName,
    ActionMenu,
  });

  const filteredData = useClientFilters(inv_data, filters, getLocationName);

  // Configuración de react-table con paginación y expansión de filas
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    state,
    gotoPage,
    pageCount,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: {
        pageSize: 40,
        hiddenColumns: columns
          .filter((column) => column.show === false)
          .map((column) => column.accessor || column.id),
      },
    },
    useFilters,
    useGlobalFilter,
    useExpanded,
    usePagination
  );

  const { pageIndex = 0 } = state || {};

  return (
    <Fragment>
      {/* Filtros - solo en escritorio */}
      {!isMobileDevice() && (
        <Row>
          <Col lg={11} md={11} sm={11} className="mb-lg-0 py-2 mx-2">
            <ClientFilters
              setFilters={setFilters}
              filters={filters}
              equipments={inv_data}
              locationIds={locationIds}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={12} md={12} sm={12}>
          <div
            className="table-responsive border-0 hide-scrollbar"
            style={{
              overflowY: 'scroll',
              height: calculateTableHeight(pageCount),
            }}
          >
            <Table
              hover
              {...getTableProps()}
              className="text-nowrap table-centered table-maintenance"
            >
              <thead className="sticky-header">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="bg-light-primary text-primary fw-semi-bold"
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {filteredData && filteredData.length > 0 ? (
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <Fragment key={row.id}>
                        <tr {...row.getRowProps()} className="text-center">
                          {row.cells.map((cell) => (
                            <td
                              className="text-dark bg-white"
                              {...cell.getCellProps()}
                            >
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>

                        {row.isExpanded && (
                          <tr>
                            <td
                              colSpan={columns.length}
                              className="bg-white pb-2 pt-0 m-0 px-0"
                            >
                              <ExpandedClientsViewTable
                                props={{ inv_data, filters, setFilters, locationIds }}
                                rawData={inv_data}
                                client={row.original}
                              />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              ) : null}
            </Table>

            {filteredData && filteredData.length === 0 && (
              <Row className="text-center p-0 m-0">
                <span className="text-center text-secondary py-5 fw-bold">
                  Aún no hay clientes registrados
                </span>
              </Row>
            )}
          </div>

          {pageCount > 1 && (
            <Pagination
              previousPage={previousPage}
              pageCount={pageCount}
              pageIndex={pageIndex}
              gotoPage={gotoPage}
              nextPage={nextPage}
            />
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default ClientsTable;
