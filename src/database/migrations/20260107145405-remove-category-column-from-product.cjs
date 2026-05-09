'use strict';

/** @type {import('sequelize-cli').Migration} */
// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface) {
    // Remove a coluna "category" da tabela "products"
    await queryInterface.removeColumn('products', 'category');
  },

  // Método executado quando a migration é revertida (sequelize db:migrate:undo)
  async down(queryInterface, Sequelize) {
    // Adiciona novamente a coluna "category" na tabela "products"
    await queryInterface.addColumn('products', 'category', {
      // Define o tipo da coluna como STRING
      type: Sequelize.STRING,
      // Permite valores nulos na coluna
      allowNull: true,
    });
  },
};
