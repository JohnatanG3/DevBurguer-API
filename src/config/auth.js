// Configurações de autenticação
export default {
  // Chave secreta para assinatura dos tokens JWT
  secret: process.env.JWT_SECRET,
  // Tempo de expiração dos tokens JWT
  expiresIn: process.env.JWT_EXPIRES_IN,
};
