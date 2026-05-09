'use strict';

// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface, Sequelize) {
    // Cria a tabela "products" no banco de dados
    await queryInterface.createTable('products', {
      // Identificador único do produto
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        // Incrementa automaticamente o ID a cada novo registro
        autoIncrement: true,
      },

      // Nome do produto
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Preço do produto
      // Armazenado como inteiro (ex: centavos) para evitar problemas com ponto flutuante
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      // Caminho da imagem ou arquivo relacionado ao produto
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // Categoria do produto
      category: {
        type: Sequelize.STRING,
        allowNull: false,
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
    // Remove a tabela "products" do banco de dados
    await queryInterface.dropTable('products');
  },
};
