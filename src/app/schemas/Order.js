// Importa o Mongoose para criação do schema e model
import mongoose from 'mongoose';

// Define o schema de pedidos (Order)
// Utilizado para armazenar pedidos realizados pelos usuários
// Banco não relacional (MongoDB) é ideal para esse tipo de dado
const OrderSchema = new mongoose.Schema(
  {
    // ============================
    // Dados do usuário que fez o pedido
    // ============================
    user: {
      // ID do usuário (referência ao PostgreSQL)
      id: {
        type: String,
        required: true,
      },

      // Nome do usuário no momento do pedido
      // (snapshot para histórico)
      name: {
        type: String,
        required: true,
      },
    },

    // ============================
    // Lista de produtos do pedido
    // ============================
    products: [
      {
        // ID do produto (referência ao PostgreSQL)
        id: {
          type: Number,
          required: true,
        },

        // Nome do produto no momento do pedido
        name: {
          type: String,
          required: true,
        },

        // Preço do produto no momento do pedido
        // Salvo como string para evitar problemas de precisão
        // e preservar exatamente o valor cobrado
        price: {
          type: String,
          required: true,
        },

        // Categoria do produto no momento do pedido
        // Snapshot evita problemas se a categoria mudar depois
        category: {
          type: String,
          required: true,
        },

        // Quantidade comprada desse produto
        quantity: {
          type: Number,
          required: true,
        },

        // URL da imagem do produto no momento do pedido
        // Mantém histórico mesmo se a imagem mudar no futuro
        url: {
          type: String,
          required: true,
        },
      },
    ],

    // ============================
    // Status do pedido
    // ============================
    status: {
      // Ex: 'pending', 'preparing', 'finished', 'canceled'
      type: String,
      required: true,
    },
  },
  {
    // Cria automaticamente os campos:
    // createdAt e updatedAt
    timestamps: true,
  },
);

// Exporta o model Order para ser utilizado nos controllers
export default mongoose.model('Order', OrderSchema);
