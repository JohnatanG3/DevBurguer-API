// Importa a biblioteca jsonwebtoken para manipulação de tokens JWT
import jwt from 'jsonwebtoken';

// Importa as configurações de autenticação (secret, expiresIn)
import authConfig from '../../config/auth.js';

// Middleware responsável por validar o token JWT
const authMiddleware = (request, response, next) => {
  // Recupera o header Authorization
  // Ex esperado: "Bearer <token>"
  const authToken = request.headers.authorization;

  // Verifica se o header foi enviado
  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  // Separa o esquema (Bearer) do token
  // Ex: ["Bearer", "eyJhbGciOi..."]
  const [, token] = authToken.split(' ');

  try {
    // Verifica se o token é válido usando a chave secreta
    // Se estiver inválido/expirado, jwt.verify lança erro e cai no catch
    const decoded = jwt.verify(token, authConfig.secret);

    // Armazena o ID do usuário na requisição para uso nos controllers/middlewares
    // Ex: request.userId -> usado para buscar o usuário no banco
    request.userId = decoded.id;

    // Armazena se o usuário é admin na requisição
    // Ex: request.userIsAdmin -> usado para verificar permissões
    request.userIsAdmin = decoded.admin;

    // Armazena o nome do usuário
    // Ex: request.userName -> usado para buscar nome do usuário
    request.userName = decoded.name;
  } catch (_error) {
    // Caso o token seja inválido, expirado ou malformado
    return response.status(401).json({ error: 'Token invalid!' });
  }

  // Se tudo estiver ok, permite que a requisição continue
  return next();
};

// Exporta o middleware de autenticação
export default authMiddleware;
