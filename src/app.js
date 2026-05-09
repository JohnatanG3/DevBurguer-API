// Importa o CORS para permitir requisições entre domínios diferentes
// (ex: front-end em http://localhost:5173 consumindo API em http://localhost:3001)
import cors from 'cors';

// Importa o framework Express, usado para criar o servidor HTTP
import express from 'express';

// Importa a configuração para servir arquivos estáticos (imagens)
import fileRouteConfig from './config/fileRoutes.cjs';

// Importa o arquivo central de rotas da aplicação (API)
import routes from './routes.js';

// Cria uma instância da aplicação Express
// Essa instância controla rotas, middlewares e requisições HTTP
const app = express();

// ======================================================
// CORS
// ======================================================
// Habilita o CORS para permitir que o front-end acesse o back-end
// Como o projeto é local, liberar todo acesso não é um risco
app.use(cors());

// ======================================================
// Middlewares de leitura de dados
// ======================================================

// Permite que a API leia JSON enviado no corpo das requisições
// Ex: { email: "...", password: "..." }
app.use(express.json());

// Permite que a API leia dados enviados via formulário (x-www-form-urlencoded)
// Usado principalmente em formulários tradicionais
app.use(express.urlencoded({ extended: true }));

// ======================================================
// Rotas públicas de arquivos (imagens)
// ======================================================
// Essas rotas NÃO usam JWT e ficam fora da proteção da API
// Servem para permitir que o navegador carregue imagens diretamente

// Rota para imagens de produtos
// Ex: http://localhost:3001/product-file/coca.png
app.use('/product-file', fileRouteConfig);

// Rota para imagens de categorias
// Ex: http://localhost:3001/category-file/burgers.png
app.use('/category-file', fileRouteConfig);

// ======================================================
// Rotas da API
// ======================================================
// Todas as regras de autenticação (JWT, admin, etc)
// ficam dentro do arquivo routes.js
app.use(routes);

// Exporta a aplicação para ser usada no servidor (app.listen)
export default app;
