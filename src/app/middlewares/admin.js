// Middleware para verificar se o usuário é admin
const adminMiddleware = (request, response, next) => {
  // Recupera a informação de admin armazenada na requisição
  const isUserAdmin = request.userIsAdmin;

  // Verifica se o usuário é admin
  if (!isUserAdmin) {
    return response.status(401).json({ error: 'Admin access required' });
  }

  // Se tudo estiver ok, permite que a requisição continue
  return next();
};

// Exporta o middleware de autenticação
export default adminMiddleware;
