// Importa o mongoose para validar ObjectId no método de atualização
import mongoose from "mongoose";

// Importa a biblioteca Yup para validação de dados
import * as Yup from "yup";

// Importa a model Category (Sequelize) para incluir o nome da categoria na resposta
import Category from "../models/Category.js";

// Importa a model Product (Sequelize) para buscar os produtos no Postgres
import Product from "../models/Product.js";

// Importa a schema Order (Mongoose) para salvar os pedidos no MongoDB
import Order from "../schemas/Order.js";

// Controller responsável pelas regras de negócio relacionadas aos pedidos
class OrderController {
	// Método responsável por criar um novo pedido
	async store(request, response) {
		// =========================================
		// 1) Validação do payload (request.body)
		// =========================================
		// Formato esperado:
		// {
		//   "products": [
		//     { "id": 1, "quantity": 2 },
		//     { "id": 5, "quantity": 1 }
		//   ]
		// }
		const schema = Yup.object({
			// "products" deve existir, ser array e ter pelo menos 1 item
			products: Yup.array()
				.required()
				.min(1) // evita pedido sem itens
				.of(
					// Cada item do array deve ser um objeto com id e quantity
					Yup.object({
						// ID do produto (Postgres)
						id: Yup.number().required(),
						// Quantidade do produto (inteiro >= 1)
						quantity: Yup.number().required().integer().min(1),
					}),
				),
		});

		// Valida os dados enviados na requisição
		try {
			schema.validateSync(request.body, {
				abortEarly: false,
				strict: true,
			});
		} catch (error) {
			return response.status(400).json({
				message: "Validation fails",
				errors: error.errors,
			});
		}

		// ================================================
		// 2) Dados do usuário (vindos do auth middleware)
		// ================================================
		// request.userId e request.userName são preenchidos no authMiddleware
		const { userId, userName } = request;

		// Lista de produtos enviada pelo cliente
		const { products } = request.body;

		// =========================================
		// 3) Prevenções antes de consultar o banco
		// =========================================

		// Extrai apenas os IDs dos produtos do payload
		const productsId = products.map((product) => product.id);

		// Evita ids duplicados no payload (ex: [{id: 1}, {id: 1}])
		// Isso simplifica regras e evita inconsistência no snapshot
		const uniqueIds = new Set(productsId);
		if (uniqueIds.size !== productsId.length) {
			return response.status(400).json({
				message: "Validation fails",
				errors: ["duplicated product id is not allowed"],
			});
		}

		// ===========================================
		// 4) Busca no Postgres os produtos do pedido
		// ===========================================

		// Busca todos os produtos informados no Postgres
		// Inclui a categoria para já retornar o nome dela no snapshot
		const findedProducts = await Product.findAll({
			where: {
				id: productsId,
			},
			include: {
				model: Category,
				as: "category",
				attributes: ["name"],
			},
		});

		// Garante que todos os produtos informados existem
		// Se veio menos do que o esperado, algum id não existe
		if (findedProducts.length !== productsId.length) {
			return response.status(404).json({
				error: "Some products were not found",
			});
		}

		// =========================================
		// 5) Monta o snapshot do pedido
		// =========================================
		// Snapshot é o "congelamento" das infos atuais do produto
		// Isso mantém histórico mesmo se o produto mudar no futuro
		const mappedProducts = findedProducts.map((product) => {
			// Busca no payload original a quantidade do produto atual
			const productInPayload = products.find((p) => p.id === product.id);

			// Segurança extra para não quebrar em caso de inconsistência
			if (!productInPayload) return null;

			return {
				id: product.id,
				name: product.name,
				price: product.price,
				url: product.url,
				category: product.category?.name, // protege caso category venha null
				quantity: productInPayload.quantity,
			};
		});

		// Remove possíveis nulos (caso algum item não seja encontrado no payload)
		const cleanedProducts = mappedProducts.filter(Boolean);

		// =========================================
		// 6) Monta o pedido final
		// =========================================
		const order = {
			user: {
				id: userId,
				name: userName,
			},
			products: cleanedProducts,
			status: "Pedido Realizado",
		};

		// ================================================
		// 7) Salva no MongoDB e retorna o documento criado
		// ================================================
		const newOrder = await Order.create(order);

		// Retorna o pedido salvo no MongoDB (já com _id, timestamps, etc.)
		return response.status(201).json(newOrder);
	}

	// Método responsável por atualizar o status do pedido
	async update(request, response) {
		// =========================================
		// 1) Validação do payload
		// =========================================
		// Esperado:
		// { "status": "Em preparo" }
		const schema = Yup.object({
			status: Yup.string().required(),
		});

		// Valida o body
		try {
			schema.validateSync(request.body, {
				abortEarly: false,
				strict: true,
			});
		} catch (error) {
			return response.status(400).json({
				message: "Validation fails",
				errors: error.errors,
			});
		}

		// =========================================
		// 2) Extrai dados necessários
		// =========================================
		const { status } = request.body;

		// id vem por parâmetro: /orders/:id
		// Esse id é o _id (ObjectId) do MongoDB
		const { id } = request.params;

		// =========================================
		// 3) Valida se o id é um ObjectId válido
		// =========================================
		// Evita crash/cast error quando alguém manda id errado
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return response.status(400).json({ error: "Invalid order id" });
		}

		// =========================================
		// 4) Atualiza e retorna o pedido atualizado
		// =========================================
		// findByIdAndUpdate:
		// - busca pelo _id
		// - atualiza o status
		// - { new: true } faz retornar o documento já atualizado
		const updatedOrder = await Order.findByIdAndUpdate(
			id,
			{ status },
			{ new: true },
		);

		// Se não encontrou pedido com esse id, retorna 404
		if (!updatedOrder) {
			return response.status(404).json({ error: "Order not found" });
		}

		// Retorna o documento atualizado (melhor para front e para debug)
		return response.status(200).json(updatedOrder);
	}

	// Método para buscar todos os pedidos
	async index(_request, response) {
		// Busca todos os pedidos no MongoDB
		// sort({ createdAt: -1 }) retorna do mais recente para o mais antigo
		const orders = await Order.find().sort({ createdAt: -1 });

		// Retorna a lista de pedidos
		return response.status(200).json(orders);
	}
}

// Exporta uma instância do controller
export default new OrderController();
