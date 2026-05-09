// Importa e inicializa o dotenv para carregar as variáveis de ambiente do arquivo .env
// 1️⃣ carrega o .env
import 'dotenv/config';

// Importa a instância da aplicação Express criada no arquivo app.js
// 2️⃣ importa o Express
import app from './app.js';

// Importa as configurações do banco de dados
// 3️⃣ inicializa o banco
import './database/index.js';

const port = Number(process.env.PORT);

// Inicia o servidor na porta configurada
// O método listen faz a aplicação começar a escutar requisições HTTP
app.listen(port, () => {
  // Callback executado quando o servidor sobe com sucesso
  console.log(`Server is running on port ${port}!`);
});
