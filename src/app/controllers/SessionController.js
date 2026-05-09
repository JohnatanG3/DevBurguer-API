// Importa a biblioteca bcrypt para hash de senhas
import bcrypt from 'bcrypt';
// Importa a biblioteca jsonwebtoken para criação de tokens
import jwt from 'jsonwebtoken';
// Importa a biblioteca Yup para validação de dados
import * as Yup from 'yup';
// Importa as configurações de autenticação
import authConfig from '../../config/auth.js';
// Importa o model User
import User from '../models/User.js';

class SessionController {
  async store(request, response) {
    // Define o schema de validação usando Yup
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    // Valida os dados enviados na requisição
    const isValid = await schema.isValid(request.body, {
      strict: true,
    });

    // Função para retornar erro de email ou senha incorretos
    const emailOrPasswordIncorrect = () => {
      return response
        .status(401)
        .json({ error: 'Email or password incorrect!' });
    };

    // Caso a validação falhe, retorna erro 400
    if (!isValid) {
      return emailOrPasswordIncorrect();
    }

    // Extrai os dados enviados no corpo da requisição
    const { email, password } = request.body;

    // Verifica se o usuário existe no banco de dados
    const existingUser = await User.findOne({ where: { email } });

    // Se o usuário não existir, retorna erro 400
    if (!existingUser) {
      return emailOrPasswordIncorrect();
    }
    // Verifica se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );

    // Se a senha estiver incorreta, retorna erro 400
    if (!isPasswordCorrect) {
      return emailOrPasswordIncorrect();
    }

    // Gera um token JWT para o usuário autenticado
    const token = jwt.sign(
      // Payload do token contendo o ID do usuário se ele é admin e seu nome
      {
        id: existingUser.id,
        admin: existingUser.admin,
        name: existingUser.name,
      },
      // Chave secreta para assinar o token
      authConfig.secret,
      {
        // Configurações do token
        // Tempo de expiração do token (7 dias)
        expiresIn: authConfig.expiresIn,
      },
    );

    // Retorna os dados do usuário autenticado
    return response.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
      token,
    });
  }
}

export default new SessionController();
