# Softpital - Evaluacion Tecnica (Full Stack Web Engineer)

Este repositorio contiene la solucion a los dos ejercicios practicos de la evaluacion tecnica, centrados en algoritmia de control de flujo y refactorizacion de arquitectura en React.

---

## Ejercicio 1: Rate Limiter en Memoria

Implementacion de un limitador de tasa para controlar el flujo de solicitudes por usuario en una ventana de tiempo definida.

### Decisiones Tecnicas
- **Algoritmo Sliding Window Log**: Se implemento una ventana deslizante para evitar los picos de trafico que permiten los algoritmos de ventana fija en los limites del tiempo.
- **Estructura de Datos (Map)**: Uso de Map para almacenar los registros por userId, garantizando busquedas y eliminaciones de complejidad O(1).
- **Eficiencia en Memoria**: En lugar de recrear arreglos con filter(), se utiliza un bucle con .shift() para eliminar solo los timestamps que han salido de la ventana de tiempo.
- **Validacion Temprana**: Aplicacion del principio "fail-fast" para validar parametros y el userId antes de procesar la logica.

### Problemas Encontrados y Soluciones
- **Fuga de memoria (Memory Leaks)**: Los usuarios que dejaban de enviar solicitudes permanecian en el Map indefinidamente.
- **Solucion**: Se incluyo una logica de limpieza que elimina la clave del usuario del Map cuando su historial de actividad queda vacio tras la limpieza de registros expirados.

### Posibles Mejoras Futuras
- **Limpieza Pasiva**: Implementar un setInterval (Garbage Collector manual) para eliminar usuarios inactivos que no han realizado peticiones en varias ventanas de tiempo.
- **Persistencia**: Migrar la logica a Redis para entornos distribuidos donde multiples instancias de servidor necesiten compartir el estado del limite.

---

## Ejercicio 2: Refactorizacion de React

Optimizacion del componente ClientsTable.jsx para mejorar su mantenibilidad, legibilidad y rendimiento.

### Decisiones Tecnicas
- **Desacoplamiento de Logica (Custom Hooks)**: Se extrajo la logica de negocio a useClientFilters y la configuracion de UI a useClientColumns. Esto reduce la complejidad cognitiva del componente principal.
- **Eliminacion de Estado Derivado**: Se elimino el uso de useState y useEffect para sincronizar datos filtrados. Ahora se utiliza useMemo, asegurando que los datos fluyan de forma unidireccional y eficiente.
- **Modularizacion de Utilidades**: Creacion de helpers.js para funciones puras (truncado de texto, deteccion de dispositivos), facilitando su testeo independiente y reutilizacion.
- **Memoizacion de Funciones**: Uso de useCallback para metodos como ActionMenu, evitando la ruptura de la memorizacion en los componentes de la tabla.

### Problemas Encontrados
- **Sincronizacion Inconsistente**: El componente original causaba re-renders innecesarios al actualizar estados de forma encadenada. Se soluciono calculando los datos filtrados directamente en el ciclo de renderizado.
- **Codigo Muerto y Nombramiento**: Se eliminaron variables inalcanzables y se renombraron terminos confusos (como equipmentData) por nombres semanticamente correctos (filteredData).

### Posibles Mejoras Futuras
- **Virtualizacion**: Implementar react-window o react-virtualized para manejar tablas con miles de registros sin degradar el performance del DOM.
- **Tipado**: Migrar a TypeScript para definir interfaces claras de los datos del cliente y evitar errores en tiempo de ejecucion.
- **Debouncing**: Implementar un debounce en la entrada de busqueda para evitar que los calculos de filtrado se disparen con cada pulsacion de tecla.

---

## Ejecucion
1. **Ejercicio 1**: Ejecutar `node rateLimiter.test.js` en la carpeta correspondiente.
2. **Ejercicio 2**: Integrar el archivo refactorizado (`ClientsTable.refactored`) y sus carpetas `/hooks` y `/utils` en el proyecto React.
