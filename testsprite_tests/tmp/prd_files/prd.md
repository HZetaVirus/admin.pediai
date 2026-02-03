# Product Requirements Document (PRD) - PediAi Admin

## 1. Visão Geral do Projeto
O **PediAi Admin** é um painel de gerenciamento premium projetado para estabelecimentos de alimentação que utilizam a plataforma PediAi. O objetivo é fornecer uma interface centralizada, intuitiva e moderna para a gestão de pedidos, cardápios, clientes e análises de desempenho, com integração nativa ao WhatsApp.

## 2. Tecnologias Utilizadas
O projeto utiliza um stack de ponta (2025/2026) focado em performance e produtividade:
- **Framework:** [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **Linguagem:** TypeScript
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Backend/Database/Auth:** [Supabase](https://supabase.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** Lucide React

## 3. Funcionalidades Principais

### 3.1. Autenticação e Segurança
- Login seguro via Supabase Auth.
- Gerenciamento de sessão persistente.
- Páginas protegidas para acesso exclusivo do administrador.

### 3.2. Dashboard e Visão Geral
- Visualização rápida dos principais indicadores de desempenho (KPIs).
- Status em tempo real do estabelecimento.

### 3.3. Gestão de Pedidos (Orders)
- Listagem e acompanhamento de pedidos em tempo real.
- Fluxo de trabalho de pedidos (Recebido, Preparando, Saiu para Entrega, Entregue).
- Integração com serviços de entrega.

### 3.4. Gestão de Cardápio (Menu)
- Criação e edição de produtos.
- Gerenciamento de **Categorias** (ex: Pizzas, Bebidas, Sobremesas).
- Sistema de **Opções** e complementos (ex: Adicionais, tamanhos, sabores).
- Controle de disponibilidade de itens.

### 3.5. Integração com WhatsApp
- Serviço dedicado para comunicação com clientes.
- Notificações automáticas de status de pedido via WhatsApp.
- Configurações personalizáveis de mensagens.

### 3.6. Relatórios e Análise (Reports)
- **Vendas:** Monitoramento de faturamento por período.
- **Delivery:** Análise de desempenho de entregas.
- **Análise CMV:** Controle de custo de mercadoria vendida para otimização de lucro.

### 3.7. Gestão de Clientes (Customers)
- Banco de dados de clientes recorrentes.
- Histórico de pedidos e preferências.

### 3.8. Configurações (Settings)
- Gerenciamento do perfil da loja.
- Horários de funcionamento.
- Configurações de taxas de entrega e áreas de atendimento.

## 4. Arquitetura do Sistema
O projeto segue uma estrutura organizada e escalável dentro do diretório `src/`:
- `app/`: Rotas do sistema baseadas em App Router.
- `components/`: Componentes reutilizáveis (UI e Business logic).
- `services/`: Lógica de integração com Supabase e APIs externas (WhatsApp, Pedidos).
- `lib/`: Utilitários e instâncias de bibliotecas comuns.
- `types/`: Definições globais de tipos TypeScript.

## 5. Interface e Experiência do Usuário (UI/UX)
- Design moderno com foco em legibilidade e eficiência.
- Interface Responsiva (Desktop first, mas compatível com tablets).
- Micro-interações suaves utilizando Framer Motion.
- Sistema de notificações (Toasts) via Sonner para feedback imediato.

## 6. Próximos Passos Sugeridos
1.  **Pagamentos:** Integração direta com gateways de pagamento (Stripe/Mercado Pago).
2.  **Impressão Automática:** Suporte para impressão térmica de pedidos direto do navegador.
3.  **IA Insights:** Sugestões baseadas em IA para otimização de estoque e preços.
