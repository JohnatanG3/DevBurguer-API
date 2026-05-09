// Importa o Sequelize e a classe Model
// Model é a classe base para criação dos models
import Sequelize, { Model } from 'sequelize';

// Define a classe Category, que representa a tabela "categories" no banco de dados
class Category extends Model {
  // Método estático responsável por inicializar o model
  // Recebe a conexão com o banco de dados (sequelize)
  static init(sequelize) {
    // Inicializa o model informando seus campos e configurações
    super.init(
      {
        // Nome da categoria
        name: Sequelize.STRING,
        // Caminho da imagem associada à categoria
        path: Sequelize.STRING,
        // URL virtual para acessar a imagem do produto
        url: {
          // Tipo virtual, não armazenado no banco
          type: Sequelize.VIRTUAL,
          // Getter para retornar a URL completa da imagem
          get() {
            // Retorna a URL completa concatenando o host com o path
            return `http://localhost:3001/category-file/${this.path}`;
          },
        },
      },
      {
        // Instância do Sequelize utilizada para conexão com o banco
        sequelize,

        // Nome explícito da tabela no banco de dados
        tableName: 'categories',
      },
    );

    // Retorna o próprio model para possibilitar encadeamento
    return this;
  }
}

// Exporta o model Category para ser utilizado em outros arquivos
export default Category;
