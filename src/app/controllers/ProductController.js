// Importa a biblioteca Yup para validação de dados
import * as Yup from 'yup';

// Importa o model Category para validar se a categoria existe
import Category from '../models/Category.js';

// Importa o model Product
import Product from '../models/Product.js';

// Controller responsável pelas regras de negócio relacionadas aos produtos
class ProductController {
  // Método responsável por criar um novo produto
  async store(request, response) {
    // Verifica se veio arquivo no upload (multer adiciona em request.file)
    // Se não veio, não é possível criar o produto com imagem
    if (!request.file) {
      return response.status(400).json({ error: 'File is required' });
    }

    // Extrai os dados do corpo da requisição
    // OBS: em multipart/form-data, todos os campos chegam como string
    const { name, price, category_id, offer } = request.body;

    // Normaliza o nome do produto
    // Evita problemas como "Coca" e "Coca " serem tratados como diferentes
    const nameNormalized = String(name ?? '').trim();

    // Converte valores numéricos de forma controlada
    const priceNumber = Number(price);
    const categoryIdNumber = Number(category_id);

    // Valida se o preço é um número válido
    if (Number.isNaN(priceNumber)) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['price must be a number'],
      });
    }

    // Valida se o category_id é um número válido
    if (Number.isNaN(categoryIdNumber)) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['category_id must be a number'],
      });
    }

    // Converte o campo "offer" para boolean
    // Em form-data, pode chegar como string ("true", "false", "1", "0")
    let offerBoolean;

    if (offer === undefined || offer === null || offer === '') {
      // Caso não seja enviado, assume false
      offerBoolean = false;
    } else if (
      offer === true ||
      offer === 'true' ||
      offer === '1' ||
      offer === 1
    ) {
      offerBoolean = true;
    } else if (
      offer === false ||
      offer === 'false' ||
      offer === '0' ||
      offer === 0
    ) {
      offerBoolean = false;
    } else {
      // Qualquer outro valor é considerado inválido
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['offer must be a boolean'],
      });
    }

    // Monta um objeto já com os tipos corretos
    // Isso permite usar strict: true no Yup sem quebrar
    const dataToValidate = {
      name: nameNormalized,
      price: priceNumber,
      category_id: categoryIdNumber,
      offer: offerBoolean,
    };

    // Define o schema de validação usando Yup
    const schema = Yup.object({
      // Nome do produto (obrigatório)
      name: Yup.string().required(),

      // Preço do produto (inteiro, ex: valor em centavos)
      price: Yup.number().integer().required(),

      // ID da categoria (chave estrangeira)
      category_id: Yup.number().integer().required(),

      // Indica se o produto está em oferta
      offer: Yup.boolean().required(),
    });

    try {
      // Valida os dados normalizados e tipados
      schema.validateSync(dataToValidate, {
        // Retorna todos os erros encontrados
        abortEarly: false,

        // Não faz conversões automáticas de tipo
        strict: true,
      });
    } catch (error) {
      // Caso a validação falhe, retorna erro 400 com detalhes
      return response.status(400).json({
        message: 'Validation fails',
        errors: error.errors,
      });
    }

    // Verifica se a categoria informada existe no banco
    const categoryExists = await Category.findByPk(dataToValidate.category_id);
    if (!categoryExists) {
      return response.status(400).json({ error: 'Category not found' });
    }

    // Extrai o nome do arquivo salvo pelo multer
    const { filename } = request.file;

    // Cria o novo produto no banco de dados
    const newProduct = await Product.create({
      name: dataToValidate.name,
      price: dataToValidate.price,
      category_id: dataToValidate.category_id,
      path: filename,
      offer: dataToValidate.offer,
    });

    // Retorna o produto criado
    return response.status(201).json(newProduct);
  }

  // Método responsável por atualizar um produto existente
  async update(request, response) {
    // Extrai o ID do produto dos parâmetros da rota
    const { id } = request.params;

    // Busca o produto no banco para garantir que ele existe
    const product = await Product.findByPk(id);

    // Se não existir, retorna erro 404
    if (!product) {
      return response.status(404).json({ error: 'Product not found' });
    }

    // Extrai os dados do corpo da requisição
    // OBS: em multipart/form-data, todos os campos chegam como string
    const { name, price, category_id, offer } = request.body;

    // Normaliza o nome somente se ele foi enviado
    const nameNormalized =
      name !== undefined ? String(name ?? '').trim() : undefined;

    // Converte price somente se foi enviado
    const priceNumber = price !== undefined ? Number(price) : undefined;

    // Converte category_id somente se foi enviado
    const categoryIdNumber =
      category_id !== undefined ? Number(category_id) : undefined;

    // Se price foi enviado, valida se é número
    if (price !== undefined && Number.isNaN(priceNumber)) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['price must be a number'],
      });
    }

    // Se category_id foi enviado, valida se é número
    if (category_id !== undefined && Number.isNaN(categoryIdNumber)) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['category_id must be a number'],
      });
    }

    // Converte offer somente se foi enviado
    // No update, se não vier offer, não deve alterar o valor atual
    let offerBoolean;

    if (offer === undefined) {
      offerBoolean = undefined;
    } else if (
      offer === true ||
      offer === 'true' ||
      offer === '1' ||
      offer === 1
    ) {
      offerBoolean = true;
    } else if (
      offer === false ||
      offer === 'false' ||
      offer === '0' ||
      offer === 0
    ) {
      offerBoolean = false;
    } else if (offer === null || offer === '') {
      // Se vier vazio, decide não alterar o valor (mantém o atual)
      offerBoolean = undefined;
    } else {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['offer must be a boolean'],
      });
    }

    // Monta um objeto apenas com os campos enviados
    // Isso evita quebrar validação com strict: true em updates parciais
    const dataToValidate = {
      ...(nameNormalized !== undefined && { name: nameNormalized }),
      ...(priceNumber !== undefined && { price: priceNumber }),
      ...(categoryIdNumber !== undefined && { category_id: categoryIdNumber }),
      ...(offerBoolean !== undefined && { offer: offerBoolean }),
    };

    // Define o schema de validação (tudo opcional no update)
    const schema = Yup.object({
      // Nome do produto (opcional no update)
      name: Yup.string(),

      // Preço do produto (opcional no update)
      price: Yup.number().integer(),

      // Categoria (opcional no update)
      category_id: Yup.number().integer(),

      // Oferta (opcional no update)
      offer: Yup.boolean(),
    });

    try {
      // Valida os dados normalizados e tipados
      schema.validateSync(dataToValidate, {
        abortEarly: false,
        strict: true,
      });
    } catch (error) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: error.errors,
      });
    }

    // Se o usuário enviou category_id, verifica se a categoria existe
    if (dataToValidate.category_id !== undefined) {
      const categoryExists = await Category.findByPk(
        dataToValidate.category_id,
      );

      if (!categoryExists) {
        return response.status(400).json({ error: 'Category not found' });
      }
    }

    // Se veio arquivo no upload, atualiza o path
    // Se não veio, mantém o path atual
    if (request.file) {
      dataToValidate.path = request.file.filename;
    }

    // Atualiza o produto no banco com os dados enviados
    await product.update(dataToValidate);

    // Retorna o produto atualizado
    return response.status(200).json(product);
  }

  // Método responsável por listar todos os produtos
  async index(_request, response) {
    // Busca todos os produtos no banco, incluindo a categoria associada
    const products = await Product.findAll({
      include: {
        // Model relacionado
        model: Category,
        // Alias definido na associação
        as: 'category',
        // Campos da categoria que serão retornados
        attributes: ['id', 'name'],
      },
    });

    // Retorna a lista de produtos
    return response.status(200).json(products);
  }
}

// Exporta uma instância do controller
export default new ProductController();
