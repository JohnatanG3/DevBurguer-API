// Importa a biblioteca Yup para validação de dados
import * as Yup from 'yup';
// Importa o model Category para interagir com a tabela de categorias no banco de dados
import Category from '../models/Category.js';

// Controller responsável pelas regras de negócio relacionadas às categorias
class CategoryController {
  // Método responsável por criar uma nova categoria
  async store(request, response) {
    // 1️⃣ Validação de arquivo (imagem OBRIGATÓRIA)
    // Como o projeto é visual (hamburgueria), toda categoria precisa ter imagem
    if (!request.file) {
      return response.status(400).json({
        error: 'Category image is required',
      });
    }

    // 2️⃣ Define o schema de validação usando Yup
    const schema = Yup.object({
      // Nome da categoria (obrigatório)
      name: Yup.string().required(),
    });

    try {
      // Valida os dados enviados no corpo da requisição
      schema.validateSync(request.body, {
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

    // 3️⃣ Extrai e normaliza o nome da categoria
    const { name } = request.body;

    // Remove espaços extras (ex: "Burgers " → "Burgers")
    const nameNormalized = name.trim();

    // Evita criar categoria com nome vazio após trim
    if (!nameNormalized) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['name cannot be empty'],
      });
    }

    // 4️⃣ Verifica se já existe uma categoria com o mesmo nome
    const existingCategory = await Category.findOne({
      where: { name: nameNormalized },
    });

    // Caso exista, retorna erro de conflito
    if (existingCategory) {
      return response.status(409).json({
        error: 'Category already exists!',
      });
    }

    // 5️⃣ Extrai o nome do arquivo salvo pelo multer
    const { filename } = request.file;

    // 6️⃣ Cria a nova categoria no banco de dados
    const newCategory = await Category.create({
      // Usa o nome normalizado
      name: nameNormalized,

      // Salva o path da imagem (obrigatório)
      path: filename,
    });

    // 7️⃣ Retorna a categoria criada
    return response.status(201).json(newCategory);
  }

  // Método responsável por atualizar uma categoria existente
  async update(request, response) {
    // Extrai o ID da categoria dos parâmetros da rota
    const { id } = request.params;

    // 1️⃣ Busca a categoria no banco para garantir que ela existe
    const category = await Category.findByPk(id);

    // Se não existir, retorna erro 404
    if (!category) {
      return response.status(404).json({ error: 'Category not found' });
    }

    // Extrai o nome da categoria do corpo da requisição
    const { name } = request.body;

    // Objeto que irá conter APENAS os campos enviados
    // Isso permite updates parciais sem quebrar validação
    const dataToUpdate = {};

    // 2️⃣ Se o nome foi enviado, valida e normaliza
    if (name !== undefined) {
      // Normaliza o nome (remove espaços extras)
      const nameNormalized = String(name ?? '').trim();

      // Evita atualizar com nome vazio
      if (!nameNormalized) {
        return response.status(400).json({
          message: 'Validation fails',
          errors: ['name cannot be empty'],
        });
      }

      // Verifica se já existe OUTRA categoria com esse nome
      const existingCategory = await Category.findOne({
        where: { name: nameNormalized },
      });

      // Se existir e não for a própria categoria, retorna erro
      if (existingCategory && existingCategory.id !== Number(id)) {
        return response.status(409).json({ error: 'Category already exists!' });
      }

      // Adiciona o nome normalizado ao objeto de update
      dataToUpdate.name = nameNormalized;
    }

    // 3️⃣ Se veio arquivo no upload (multer), atualiza o path
    if (request.file) {
      dataToUpdate.path = request.file.filename;
    }

    // Se nenhum dado foi enviado para atualizar, retorna erro
    if (Object.keys(dataToUpdate).length === 0) {
      return response.status(400).json({
        error: 'No data provided to update',
      });
    }

    // 4️⃣ Atualiza a categoria no banco
    await category.update(dataToUpdate);

    // 5️⃣ Retorna a categoria atualizada
    return response.status(200).json(category);
  }

  // Método responsável por listar todas as categorias
  async index(_request, response) {
    // Busca todas as categorias no banco de dados
    const categories = await Category.findAll();

    // Retorna a lista de categorias como resposta
    return response.status(200).json(categories);
  }
}

// Exporta uma instância do controller
export default new CategoryController();
