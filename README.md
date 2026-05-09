# DevBurguer API

Backend da aplicação **DevBurguer**, responsável por autenticação, gerenciamento de usuários, produtos, categorias, pedidos e integração com pagamentos.

> Interface do projeto: [DevBurguer Frontend](SEU_LINK_REPOSITORIO_FRONT)

---

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT
- Multer
- Stripe
- Yup

---

## 🔐 Funcionalidades

- Cadastro de usuários
- Login com autenticação via JWT
- Controle de acesso com rotas protegidas
- Cadastro e atualização de produtos
- Upload de imagens
- Cadastro e listagem de categorias
- Criação e gerenciamento de pedidos
- Integração com pagamento via Stripe

---

## 🛣️ Rotas principais

### Públicas

- `POST /users` → cadastro de usuário
- `POST /sessions` → login

### Protegidas

- `GET /products`
- `POST /products`
- `PUT /products/:id`

- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`

- `POST /orders`
- `GET /orders`
- `PUT /orders/:id`

- `POST /create-payment-intent`

---

## ▶️ Como executar o projeto

```bash
pnpm install
Crie o arquivo .env com base no .env.example
Depois execute:
pnpm dev
```

---
## 📂 Estrutura do projeto
```bash
src/
 ├── app/
 ├── config/
 ├── database/
 ├── routes.js
 ├── app.js
 └── server.js
```

---

## ✨ Como Contribuir com o projeto

Se você quiser contribuir com este projeto, siga estas etapas:

1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Crie um novo Pull Request.

---

## 🧪 Observações

Este projeto foi desenvolvido com fins de estudo e prática de desenvolvimento full stack, envolvendo autenticação, upload de arquivos, regras de autorização e integração com pagamentos.

---

## 👨‍💻 Autor

Desenvolvido por [JohnatanG3](https://github.com/JohnatanG3).

---

## ✉️ Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato comigo:

- **GitHub:** [JohnatanG3](https://github.com/JohnatanG3)
- **LinkedIn:** [Johnatan Vieira](https://www.linkedin.com/in/johnatan-felipe-vieira/)
- **E-mail:** johnatan.g3@protonmail.com
