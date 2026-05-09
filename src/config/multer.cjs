// Importa a biblioteca Multer, responsável por lidar com upload de arquivos
const multer = require('multer');

// Importa a função resolve para trabalhar com caminhos absolutos
const { resolve } = require('node:path');

// Importa a função v4 para gerar UUIDs
const { v4 } = require('uuid');

module.exports = {
  // Define a estratégia de armazenamento dos arquivos
  storage: multer.diskStorage({
    // Define o diretório onde os arquivos serão salvos
    // resolve garante compatibilidade entre sistemas operacionais
    destination: resolve(__dirname, '..', '..', 'uploads'),

    // Define como o arquivo será nomeado ao ser salvo
    filename: (_request, file, callback) => {
      // Gera um nome único usando UUID + nome original do arquivo
      // Isso evita sobrescrever arquivos com o mesmo nome
      const uniqueName = v4().concat(`-${file.originalname}`);

      // Retorna o nome final do arquivo
      return callback(null, uniqueName);
    },
  }),
};
