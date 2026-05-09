'use strict';

// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface, Sequelize) {
    // Cria a tabela "users" no banco de dados
    await queryInterface.createTable('users', {
      // Chave primária da tabela
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        // Gera automaticamente um UUID v4 para cada registro
        defaultValue: Sequelize.UUIDV4,
      },

      // Nome do usuário
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Email do usuário
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        // Garante que não existam dois usuários com o mesmo email
        unique: true,
      },

      // Hash da senha do usuário
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Indica se o usuário é administrador
      admin: {
        type: Sequelize.BOOLEAN,
        // Por padrão, o usuário não é administrador
        defaultValue: false,
      },

      // Data de criação do registro
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      // Data da última atualização do registro
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  // Método executado quando a migration é revertida (sequelize db:migrate:undo)
  async down(queryInterface) {
    // Remove a tabela "users" do banco de dados
    await queryInterface.dropTable('users');
  },
};
