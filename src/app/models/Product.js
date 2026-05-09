// Importa o Sequelize e a classe Model
// Model é a classe base para criação dos models
import Sequelize, { Model } from 'sequelize';

// Define a classe Product, que representa a tabela "products" no banco de dados
class Product extends Model {
  // Método estático responsável por inicializar o model
  // Recebe a conexão com o banco de dados (sequelize)
  static init(sequelize) {
    // Inicializa o model informando seus campos e configurações
    super.init(
      {
        // Nome do produto
        name: Sequelize.STRING,

        // Preço do produto
        // Armazenado como inteiro (ex: valor em centavos)
        price: Sequelize.INTEGER,

        // Caminho da imagem do produto (nome ou path do arquivo)
        path: Sequelize.STRING,

        // Indica se o produto está em oferta
        offer: Sequelize.BOOLEAN,

        // URL virtual para acessar a imagem do produto
        url: {
          // Tipo virtual, não armazenado no banco
          type: Sequelize.VIRTUAL,
          // Getter para retornar a URL completa da imagem
          get() {
            // Retorna a URL completa concatenando o host com o path
            return `http://localhost:3001/product-file/${this.path}`;
          },
        },
      },
      {
        // Instância do Sequelize utilizada para conexão com o banco
        sequelize,

        // Nome explícito da tabela no banco de dados
        tableName: 'products',
      },
    );

    // Retorna o próprio model para possibilitar encadeamento
    return this;
  }

  static associate(models) {
    // Define a associação entre Product e Category
    // Um produto pertence a uma categoria
    this.belongsTo(models.Category, {
      // Nome da chave estrangeira na tabela products
      foreignKey: 'category_id',
      // Alias para a associação
      as: 'category',
    });
  }
}

// Exporta o model Product para ser utilizado em outros arquivos
export default Product;
