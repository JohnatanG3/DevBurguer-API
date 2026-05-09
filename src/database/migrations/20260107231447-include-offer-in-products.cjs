'use strict';

/** @type {import('sequelize-cli').Migration} */
// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna "offer" na tabela "products"
    await queryInterface.addColumn('products', 'offer', {
      // Define o tipo da coluna como BOOLEAN
      type: Sequelize.BOOLEAN,
      // Define o valor padrão como false
      defaultValue: false,
      // Não permite valores nulos na coluna
      allowNull: false,
    });
  },

  // Método executado quando a migration é revertida (sequelize db:migrate:undo)
  async down(queryInterface) {
    // Remove a coluna "offer" da tabela "products"
    await queryInterface.removeColumn('products', 'offer');
  },
};
