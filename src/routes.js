// Importa o Router do Express para criação das rotas
import { Router } from 'express';

// Importa o multer para upload de arquivos
import multer from 'multer';

// Importa os controllers
import CategoryController from './app/controllers/CategoryController.js';
import CreatePaymentIntentController from './app/controllers/CreatePaymentIntentController.js';
import OrderController from './app/controllers/OrderController.js';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';

// Importa o middleware de adiministrador
import adminMiddleware from './app/middlewares/admin.js';

// Importa o middleware de autenticação (JWT)
import authMiddleware from './app/middlewares/auth.js';

// Importa as configurações do multer (storage, destination, filename, etc.)
import multerConfig from './config/multer.cjs';

// Cria uma nova instância de rotas
const routes = new Router();

// Configura o multer com as definições importadas
const upload = multer(multerConfig);

// ===============================
// Rotas públicas (não exigem JWT)
// ===============================

// Rota para criação de usuários
routes.post('/users', UserController.store);

// Rota para login (criação de sessão / retorno do token)
routes.post('/sessions', SessionController.store);

// ==========================================
// Daqui pra baixo, todas exigem autenticação
// ==========================================
routes.use(authMiddleware);

// Rota para criação de produtos com upload de imagem
// adminMiddleware verifica se o usuário é admin
// upload.single('file') recebe UM arquivo do campo "file" do form-data
routes.post(
  '/products',
  adminMiddleware,
  upload.single('file'),
  ProductController.store,
);

// Rota para atualização de produtos com upload de imagem
// :id é o ID do produto a ser atualizado
// adminMiddleware verifica se o usuário é admin
// upload.single('file') recebe UM arquivo do campo "file" do form-data
routes.put(
  '/products/:id',
  adminMiddleware,
  upload.single('file'),
  ProductController.update,
);

// Rota para listar produtos
routes.get('/products', ProductController.index);

// Rota para criar categorias
// adminMiddleware verifica se o usuário é admin
// upload.single('file') recebe UM arquivo do campo "file" do form-data
routes.post(
  '/categories',
  adminMiddleware,
  upload.single('file'),
  CategoryController.store,
);

// Rota para atualizar categorias com upload de imagem
// :id é o ID da categoria a ser atualizado
// adminMiddleware verifica se o usuário é admin
// upload.single('file') recebe UM arquivo do campo "file" do form-data
routes.put(
  '/categories/:id',
  adminMiddleware,
  upload.single('file'),
  CategoryController.update,
);

// Rota para listar categorias
routes.get('/categories', CategoryController.index);

// Rota para criação de pedidos
routes.post('/orders', OrderController.store);

// Rota para atualização dos pedidos
// :id é o ID do pedido a ser atualizado
routes.put('/orders/:id', adminMiddleware, OrderController.update);

// Rota para listar todos os pedidos
routes.get('/orders', OrderController.index);

// Rota para pagamento dos pedidos
routes.post('/create-payment-intent', CreatePaymentIntentController.store);

// Exporta as rotas para serem usadas no app.js
export default routes;
