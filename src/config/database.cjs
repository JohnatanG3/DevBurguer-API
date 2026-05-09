// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Exporta as configurações do banco de dados para o Sequelize
module.exports = {
  // Define o banco de dados utilizado
  dialect: 'postgres',

  // Endereço onde o banco está rodando
  // Como está local, usamos localhost
  host: process.env.POSTGRES_HOST,

  // Porta padrão do PostgreSQL
  port: Number(process.env.POSTGRES_PORT),

  // Usuário do banco de dados
  username: process.env.POSTGRES_USER,

  // Senha do usuário do banco
  password: process.env.POSTGRES_PASSWORD,

  // Nome do banco de dados que será utilizado pela aplicação
  database: process.env.POSTGRES_DB,

  // Configurações globais aplicadas a todos os models
  define: {
    // Cria automaticamente os campos created_at e updated_at
    timestamps: true,

    // Converte nomes de colunas de camelCase para snake_case
    // Ex: createdAt → created_at
    underscored: true,

    // Aplica o padrão snake_case também para nomes de tabelas
    underscoredAll: true,
  },
};
