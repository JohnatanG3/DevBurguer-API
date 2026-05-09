'use strict';

/** @type {import('sequelize-cli').Migration} */
// Exporta a migration no formato esperado pelo sequelize-cli
module.exports = {
  // Método executado quando a migration é aplicada (sequelize db:migrate)
  async up(queryInterface, Sequelize) {
    // Adiciona a coluna "category_id" na tabela "products"
    await queryInterface.addColumn('products', 'category_id', {
      // Define o tipo da coluna como INTEGER
      type: Sequelize.INTEGER,
      // Define a chave estrangeira referenciando a tabela "categories"
      references: {
        // Referencia a tabela "categories"
        model: 'categories',
        // Referencia a coluna "id" da tabela "categories"
        key: 'id',
      },
      // Define o comportamento em caso de atualização ou exclusão do registro referenciado
      onUpdate: 'CASCADE',
      // Se a categoria for deletada, define o valor como NULL
      onDelete: 'SET NULL',
      // Permite valores nulos na coluna
      allowNull: true,
    });
  },

  // Método executado quando a migration é revertida (sequelize db:migrate:undo)
  async down(queryInterface) {
    // Remove a coluna "category_id" da tabela "products"
    await queryInterface.removeColumn('products', 'category_id');
  },
};
