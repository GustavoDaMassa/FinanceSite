# Frontend de Gerenciador Financeiro

> Um dashboard de gestão financeira pessoal moderno, responsivo e rico em recursos, construído com Angular 21 e GraphQL.

[![English](https://img.shields.io/badge/lang-en--us-blue.svg)](README.md)

---

## 🚀 Motivação

Gerenciar finanças pessoais de forma eficaz é a base para a liberdade financeira. Muitas ferramentas existentes são complexas demais ou carecem da flexibilidade para se integrar com sistemas bancários modernos. Este projeto nasceu da necessidade de uma **plataforma unificada, segura e visualmente intuitiva** para acompanhar receitas, despesas e saldos de conta em tempo real.

## 💡 Solução e Objetivos

O **Frontend do Gerenciador Financeiro** oferece uma experiência de usuário fluida para:
- **Centralizar dados financeiros**: Reunir múltiplas contas e categorias em uma única visão.
- **Inteligência Visual**: Transformar dados brutos de transações em insights acionáveis por meio de gráficos dinâmicos.
- **Automação**: Integrar-se com APIs bancárias externas (via Pluggy) para reduzir a entrada manual de dados.
- **Segurança**: Garantir a privacidade dos dados por meio de autenticação robusta e proteção de rotas.

## ✨ Principais Funcionalidades

- **📊 Dashboard Abrangente**: 
  - Análise de Receita vs. Despesa.
  - Fluxo de caixa mensal e evolução do saldo.
  - Distribuição de gastos por categoria.
  - Padrões de transação semanais.
- **💳 Gestão de Contas**: Acompanhe múltiplas contas bancárias, cartões de crédito e saldos em dinheiro.
- **📝 Rastreamento de Transações**: Formulários fáceis de usar para entrada manual de receitas e despesas com atribuição de categorias.
- **🏷️ Organização por Categorias**: Categorias personalizadas para entender melhor para onde vai o seu dinheiro.
- **🔌 Integrações Bancárias**: Conecte-se diretamente às suas instituições financeiras usando o **SDK da Pluggy**.
- **🌍 Internacionalização**: Suporte total para Inglês (EUA) e Português (Brasil).
- **🌓 Suporte a Temas**: Compatibilidade com modo claro e escuro (via Angular Material).

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Angular 21](https://angular.dev/) (recursos mais recentes, componentes Standalone).
- **Estado e Dados**: [Apollo Client](https://www.apollographql.com/docs/angular/) + [GraphQL](https://graphql.org/).
- **Componentes de UI**: [Angular Material](https://material.angular.io/).
- **Gráficos**: [Chart.js](https://www.chartjs.org/) com [ng2-charts](https://valor-software.com/ng2-charts/).
- **Integrações**: [Pluggy Connect SDK](https://docs.pluggy.ai/).
- **I18n**: [ngx-translate](http://www.ngx-translate.com/).
- **Estilização**: SCSS (Design responsivo Mobile-first).

## 🏗️ Arquitetura e Boas Práticas

O projeto segue uma estrutura modular e escalável:
- **Core**: Serviços singleton, guards e interceptors (Lógica global da aplicação).
- **Shared**: Componentes de UI reutilizáveis, modelos e definições de operações GraphQL.
- **Features**: Módulos carregados sob demanda (lazy-loaded) para domínios específicos (Autenticação, Contas, Dashboard, etc.).

### Práticas Adotadas:
- **Lazy Loading**: Divisão de código baseada em rotas para tempos de carregamento inicial mais rápidos.
- **Tipagem Estrita**: Implementação completa em TypeScript para melhor manutenibilidade.
- **GraphQL**: Busca de dados otimizada para evitar excesso ou falta de informações.
- **Guards e Interceptors**: Lógica centralizada de segurança e tratamento de erros.

## ⚙️ Instalação e Configuração

### Pré-requisitos
- [Node.js](https://nodejs.org/) (recomendado v20+)
- [npm](https://www.npmjs.com/)

### Passos
1. **Clonar o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd finance-frontend
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar Ambiente**:
   Atualize o arquivo `src/environments/environment.ts` com a URL da sua API de backend.

4. **Iniciar Servidor de Desenvolvimento**:
   ```bash
   npm start
   ```
   Acesse `http://localhost:4200/`.

## 📈 Resultados Esperados

Os usuários podem esperar uma redução significativa no tempo gasto com rastreamento manual e uma compreensão mais clara de sua saúde financeira. O ciclo de feedback visual ajuda a identificar despesas desnecessárias e planejar metas de economia futuras.

## 📸 Capturas de Tela (Screenshots)

*(Usuário: Adicione suas capturas de tela aqui para demonstrar a interface)*

- **Dashboard**: `![Captura do Dashboard](caminho/para/imagem)`
- **Transações**: `![Captura de Transações](caminho/para/imagem)`
- **Visualização Mobile**: `![Captura Mobile](caminho/para/imagem)`

---

## 📄 Referência
Esta documentação também está disponível em Inglês: **[README.md](README.md)**
