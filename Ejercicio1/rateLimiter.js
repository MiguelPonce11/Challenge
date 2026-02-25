// Crea un limitador de tasa de limite de solicitudes y ventana de tiempo
function createRateLimiter(limit, windowMs) {
    // Valida parametros
    if (
        typeof limit !== 'number' ||
        limit <= 0 ||
        typeof windowMs !== 'number' ||
        windowMs <= 0
    ) {
        throw new Error('Limit y windowMs deben ser números positivos');
    }

    // Almacena timestamps por usuario para rastrear solicitudes
    const userRequests = new Map();

    // Retorna la función que verifica si el usuario puede hacer una solicitud
    return function checkLimit(userId){
        const now = Date.now();

        if(!userId){
            throw new Error('userId es requerido');
        }

        // Inicializa array de timestamps si es la primera solicitud del usuario
        if(!userRequests.has(userId)){
            userRequests.set(userId, []);
        }

        const timestamps = userRequests.get(userId);

        // Verifica si se alcanzo el limite de solicitudes dentro de la ventana de tiempo
        while (timestamps.length > 0 && now - timestamps[0] >= windowMs) {
            timestamps.shift();
        }

        // Registra la solicitud actual
        if (timestamps.length >= limit) {
            return false;
        }

        // Limpia usuarios inactivos para optimizar la memoria 
        if(timestamps.length === 0){
            userRequests.delete(userId);
        }
        return true;
    };
}

module.exports = { createRateLimiter };