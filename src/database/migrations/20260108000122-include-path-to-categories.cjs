'use strict';

/** @type {import('sequelize-cli').Migration} */
// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna "path" na tabela "categories"
    await queryInterface.addColumn('categories', 'path', {
      // Define o tipo da coluna como STRING
      type: Sequelize.STRING,
    });
  },

  // Método executado quando a migration é revertida (sequelize db:migrate:undo)
  async down(queryInterface) {
    // Remove a coluna "path" da tabela "categories"
    await queryInterface.removeColumn('categories', 'path');
  },
};
