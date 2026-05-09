// Importa a biblioteca Stripe (SDK servidor) para criar PaymentIntents
import Stripe from 'stripe';

// Importa Yup para validar o payload da requisição
import * as Yup from 'yup';

// Validação defensiva: se a env não existir, melhor falhar cedo
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY não definida nas variáveis de ambiente.');
}

// Inicializa o Stripe com a secret key (servidor).
// Dica: definir apiVersion ajuda a evitar mudanças inesperadas ao longo do tempo.
// Você pode escolher uma apiVersion fixa quando for “estabilizar” o projeto.
const stripe = new Stripe(stripeSecretKey, {
  // apiVersion: "2026-01-28.clover", // exemplo (use a versão do seu projeto)
});

class CreatePaymentIntentController {
  async store(request, response) {
    // Schema de validação do body:
    // Espera um array "products" com pelo menos 1 item.
    const schema = Yup.object({
      products: Yup.array()
        .required('products é obrigatório')
        .min(1, 'Informe pelo menos 1 item')
        .of(
          Yup.object({
            // ID do produto no seu banco
            id: Yup.number()
              .typeError('id deve ser um número')
              .required('id é obrigatório'),

            // Quantidade deve ser inteiro >= 1
            quantity: Yup.number()
              .typeError('quantity deve ser um número')
              .required('quantity é obrigatório')
              .integer('quantity deve ser inteiro')
              .min(1, 'quantity deve ser >= 1'),

            // ATENÇÃO: receber price do cliente é inseguro em produção.
            // O ideal é buscar o preço real no banco com base no id.
            // Aqui fica só como teste.
            // IMPORTANTE: price aqui deve vir em CENTAVOS (ex: R$ 10,00 => 1000).
            price: Yup.number()
              .typeError('price deve ser um número')
              .required('price é obrigatório')
              .integer('price deve ser inteiro (em centavos)')
              .min(1, 'price deve ser >= 1'),
          }),
        ),
    });

    // Valida o body.
    // Dica: strict=false facilita no teste porque algumas libs enviam números como string ("1").
    // Se você quiser “rigidez total”, pode voltar para strict=true depois.
    try {
      schema.validateSync(request.body, {
        abortEarly: false, // retorna todos os erros de uma vez
        strict: false, // permite coerção (ex: "1" vira 1)
      });
    } catch (error) {
      // O Yup normalmente retorna error.errors como array, mas vamos tratar com segurança.
      return response.status(400).json({
        message: 'Validation fails',
        errors: Array.isArray(error?.errors)
          ? error.errors
          : ['Invalid payload'],
      });
    }

    const { products } = request.body;

    // (Melhoria opcional) Evita itens duplicados pelo mesmo id.
    // Isso não é obrigatório, mas evita “duplicar” produto e somar errado sem querer.
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return response.status(400).json({
        message: 'Validation fails',
        errors: ['products contém itens duplicados (mesmo id)'],
      });
    }

    // Calcula o total do pedido (em centavos).
    // IMPORTANTE: o Stripe espera amount em centavos (inteiro).
    const rawAmount = calculateOrderAmount(products);

    // Garante que amount é um inteiro (defensivo)
    const amount = Math.round(rawAmount);

    // Validação final antes de chamar o Stripe (evita request ruim)
    if (!Number.isInteger(amount) || amount < 1) {
      return response.status(400).json({
        message: 'Invalid amount',
        errors: [
          'O valor total (amount) deve ser um inteiro >= 1 (em centavos)',
        ],
      });
    }

    try {
      // Cria o PaymentIntent (note o plural: paymentIntents)
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // total em centavos (integer)
        currency: 'brl',

        // Automaticamente habilita métodos de pagamento compatíveis
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return response.json({
        // client_secret é usado no front para confirmar o pagamento
        clientSecret: paymentIntent.client_secret,

        // Link útil para debug no dashboard (opcional)
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    } catch (err) {
      // Erro do Stripe (chave inválida, permissão, params, etc.)
      // Em produção: cuidado pra não vazar detalhes sensíveis.
      return response.status(500).json({
        message: 'Stripe error creating PaymentIntent',
        error: err?.message ?? 'Unknown error',
      });
    }
  }
}

// Função simples para somar os itens.
// Aqui assume que "price" já vem em CENTAVOS.
// Em produção: busque preços no banco e ignore "price" do cliente.
function calculateOrderAmount(products) {
  return products.reduce((total, item) => {
    // Garante que quantity/price são números (defensivo)
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    return total + price * quantity;
  }, 0);
}

export default new CreatePaymentIntentController();
