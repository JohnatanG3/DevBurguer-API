'use strict';

/** @type {import('sequelize-cli').Migration} */
// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface, Sequelize) {
    // Cria a tabela "categories" no banco de dados
    await queryInterface.createTable('categories', {
      // Identificador único da categoria
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        // Incrementa automaticamente o ID a cada novo registro
        autoIncrement: true,
      },

      // Nome da categoria
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    // Remove a tabela "categories" do banco de dados
    await queryInterface.dropTable('categories');
  },
};
