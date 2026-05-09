// Importa o Mongoose para realizar conexão com o MongoDB
import mongoose from 'mongoose';

// Importa a classe Sequelize, responsável pela conexão com bancos relacionais
import { Sequelize } from 'sequelize';
import Category from '../app/models/Category.js';
import Product from '../app/models/Product.js';
// Importa os models relacionais da aplicação
import User from '../app/models/User.js';

// Importa as configurações do banco relacional (PostgreSQL)
import databaseConfig from '../config/database.cjs';

// Lista de todos os models Sequelize da aplicação
// Sempre que um novo model relacional for criado, ele deve ser adicionado aqui
const models = [User, Product, Category];

// Classe responsável por inicializar todas as conexões de banco
// (PostgreSQL via Sequelize e MongoDB via Mongoose)
class Database {
  constructor() {
    // Inicializa a conexão com o banco relacional (PostgreSQL)
    this.init();

    // Inicializa a conexão com o banco não relacional (MongoDB)
    this.mongo();
  }

  // ============================
  // Conexão com PostgreSQL
  // ============================
  init() {
    // Cria a conexão com o banco de dados usando o Sequelize
    this.connection = new Sequelize(databaseConfig);

    // Inicializa todos os models Sequelize
    models
      .map((model) => model.init(this.connection))
      .map(
        // Executa o método associate de cada model, se existir
        // Responsável por criar os relacionamentos entre tabelas
        (model) => model.associate && model.associate(this.connection.models),
      );
  }

  // ============================
  // Conexão com MongoDB
  // ============================
  mongo() {
    // Cria a conexão com o MongoDB usando Mongoose
    // Utilizado para dados não relacionais como:
    // pedidos, logs, histórico, carrinho, eventos, etc.
    const mongoUrl = process.env.MONGO_URL;

    this.mongooseConnection = mongoose.connect(mongoUrl);
  }
}

// Exporta uma instância única da classe Database (Singleton)
// Garante que exista apenas uma conexão de cada banco na aplicação
export default new Database();
