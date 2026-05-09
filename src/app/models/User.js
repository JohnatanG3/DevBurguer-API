// Importa o Sequelize e a classe Model
// Model é a classe base que será estendida para criar o model User
import Sequelize, { Model } from 'sequelize';

// Define a classe User, que representa a tabela "users" no banco de dados
class User extends Model {
  // Método estático chamado ao inicializar o model
  // Recebe a conexão com o banco (sequelize)
  static init(sequelize) {
    // Inicializa o model informando seus campos e configurações
    super.init(
      {
        // Nome do usuário
        name: Sequelize.STRING,

        // Email do usuário
        email: Sequelize.STRING,

        // Hash da senha (nunca armazenar a senha em texto puro)
        password_hash: Sequelize.STRING,

        // Indica se o usuário é administrador
        admin: Sequelize.BOOLEAN,
      },
      {
        // Instância do Sequelize usada para conexão com o banco
        sequelize,
        // Nome da tabela no banco de dados
        tableName: 'users',
      },
    );

    // Retorna o próprio model para possibilitar encadeamento
    return this;
  }
}

// Exporta o model User para ser utilizado em outros arquivos
export default User;
