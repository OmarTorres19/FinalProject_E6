// Puerta de Máxima Seguridad: Solo permite paso a los ADMIN
const isAdmin = (req, res, next) => {
    // Revisamos lo que le pasó el authMiddleware
    if (!req.user || req.user.rol !== 'ADMIN') {
        return res.status(403).json({ message: "Acceso denegado. Se requieren permisos de Administrador." });
    }
    next(); // Pasa la validación
};

// Puerta General: Permite paso a ADMIN o OPERATIVO
const isAdminOrOperativo = (req, res, next) => {
    if (!req.user || (req.user.rol !== 'ADMIN' && req.user.rol !== 'OPERATIVO')) {
        return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
    }
    next(); // Pasa la validación
};

export { isAdmin, isAdminOrOperativo };