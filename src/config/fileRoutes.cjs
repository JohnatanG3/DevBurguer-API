// Importa os módulos necessários
const { resolve } = require('node:path');
// Importa o Express para servir arquivos estáticos
const express = require('express');

// Define o caminho absoluto para o diretório de uploads
const uploadPath = resolve(__dirname, '..', '..', 'uploads');

// Configura o middleware para servir arquivos estáticos a partir do diretório de uploads
const fileRouteConfig = express.static(uploadPath);

// Exporta a configuração para ser usada em outros arquivos
module.exports = fileRouteConfig;
