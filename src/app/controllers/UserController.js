// Importa a biblioteca bcryptjs para hash de senhas
import bcrypt from 'bcrypt';

// Importa a função v4 para gerar UUIDs
import { v4 } from 'uuid';

// Importa a biblioteca Yup para validação de dados
import * as Yup from 'yup';

// Importa o model User
import User from '../models/User.js';

// Controller responsável pelas regras de negócio relacionadas ao usuário
class UserController {
  // Método responsável por criar um novo usuário
  async store(request, response) {
    // Define o schema de validação usando Yup
    const schema = Yup.object({
      // Nome obrigatório e do tipo string
      name: Yup.string().required(),

      // Email obrigatório e em formato válido
      email: Yup.string().email().required(),

      // Senha (hash) obrigatória com no mínimo 6 caracteres
      password: Yup.string().min(6).required(),

      // Campo admin opcional
      admin: Yup.boolean(),
    });

    try {
      // Valida os dados enviados na requisição
      schema.validateSync(request.body, {
        // Retorna todos os erros encontrados, não apenas o primeiro
        abortEarly: false,

        // Não faz conversões automáticas de tipo
        strict: true,
      });
    } catch (error) {
      // Caso a validação falhe, retorna erro 400 com detalhes
      return response.status(400).json({
        message: 'Validation fails',
        errors: error.errors,
      });
    }

    // Extrai os dados enviados no corpo da requisição
    const { name, email, password, admin } = request.body;

    // Verifica se já existe um usuário cadastrado com o mesmo e-mail
    const existingUser = await User.findOne({ where: { email } });

    // Caso exista, retorna erro e impede o cadastro duplicado
    if (existingUser) {
      return response
        .status(409)
        .json({ message: 'Email already registered!' });
    }

    // Gera o hash da senha para armazenar com segurança no banco
    const password_hash = await bcrypt.hash(password, 10);

    // Cria um novo usuário no banco de dados
    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
      admin,
    });

    // Retorna apenas os dados necessários (nunca retornar senha ou hash)
    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    });
  }
}

// Exporta uma instância do controller
export default new UserController();
