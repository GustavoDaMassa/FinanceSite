# FinanceSite — Mapa de Classes


<details id="dir-root">
<summary><strong>/ (raiz)</strong></summary>

<blockquote>

- [angular.json](angular.json) — configuração do workspace Angular (build, serve, test)
- [package.json](package.json) — dependências npm e scripts
- [tsconfig.json](tsconfig.json) / [tsconfig.app.json](tsconfig.app.json) / [tsconfig.spec.json](tsconfig.spec.json) — configurações TypeScript
- [eslint.config.js](eslint.config.js) — configuração ESLint
- [proxy.conf.js](proxy.conf.js) — proxy de desenvolvimento (redireciona /api para o backend)
- [vercel.json](vercel.json) — configuração de deploy na Vercel
- [README.md](README.md) / [LEIA-ME.md](LEIA-ME.md) — documentação do projeto (EN/PT)
- [.editorconfig](.editorconfig) / [.gitignore](.gitignore) — configurações de editor e Git

</blockquote>

</details>

---

<details id="dir-github">
<summary><strong>.github/</strong></summary>

<blockquote>

<details id="dir-github-workflows">
<summary><strong>workflows/</strong></summary>

<blockquote>

- [ci.yml](.github/workflows/ci.yml) — pipeline CI/CD

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-public">
<summary><strong>public/</strong></summary>

<blockquote>

- [favicon.ico](public/favicon.ico) — ícone do site

</blockquote>

</details>

---

## src


<details id="dir-src-root">
<summary><strong>(raiz)</strong></summary>

<blockquote>

- [index.html](src/index.html) — HTML principal da SPA
- [main.ts](src/main.ts) — bootstrap da aplicação Angular
- [styles.scss](src/styles.scss) — estilos globais e tema Angular Material

</blockquote>

</details>


<details id="dir-assets">
<summary><strong>assets/</strong></summary>

<blockquote>

- [logo.png](src/assets/logo.png) — logo do projeto

<details id="dir-assets-i18n">
<summary><strong>i18n/</strong></summary>

<blockquote>

- [pt-BR.json](src/assets/i18n/pt-BR.json) — traduções em português
- [en-US.json](src/assets/i18n/en-US.json) — traduções em inglês

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-environments">
<summary><strong>environments/</strong></summary>

<blockquote>

- [environment.ts](src/environments/environment.ts) — configuração de produção (apiUrl, graphqlUrl, etc.)
- [environment.development.ts](src/environments/environment.development.ts) — configuração de desenvolvimento

</blockquote>

</details>


<details id="dir-app">
<summary><strong>app/</strong></summary>

<blockquote>

<details id="app">
<summary><strong><a href="src/app/app.ts">app.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Componente raiz — gerencia splash screen inicial e renderiza o layout principal com router-outlet após splash concluir

</details>

<details><summary>atributos</summary>

- `showSplash : Signal<boolean>`

</details>

<details><summary>metodos</summary>

- `onSplashDone() : void`

</details>

</blockquote>

</details>

- [app.config.ts](src/app/app.config.ts) — configuração da aplicação (providers, Apollo, i18n)
- [app.html](src/app/app.html) — template do componente raiz
- [app.routes.ts](src/app/app.routes.ts) — definição das rotas da aplicação
- [app.scss](src/app/app.scss) — estilos do componente raiz


<details id="dir-core">
<summary><strong>core/</strong></summary>

<blockquote>

<details id="dir-core-guards">
<summary><strong>guards/</strong></summary>

<blockquote>

<details id="auth-guard">
<summary><strong><a href="src/app/core/guards/auth.guard.ts">auth.guard.ts</a> [guard]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Protege rotas autenticadas — redireciona para /login preservando returnUrl se não houver token

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `Router`

</details>

<details><summary>metodos</summary>

- `(route, state) => boolean | UrlTree`

</details>

</blockquote>

</details>



<details id="admin-guard">
<summary><strong><a href="src/app/core/guards/admin.guard.ts">admin.guard.ts</a> [guard]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Protege rotas exclusivas de ADMIN — redireciona para /dashboard se o usuário não tiver role ADMIN

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `Router`

</details>

<details><summary>metodos</summary>

- `() => boolean`

</details>

</blockquote>

</details>



<details id="no-auth-guard">
<summary><strong><a href="src/app/core/guards/no-auth.guard.ts">no-auth.guard.ts</a> [guard]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Impede usuários autenticados de acessar páginas públicas (login, register) — redireciona para /dashboard

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `Router`

</details>

<details><summary>metodos</summary>

- `() => boolean`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-core-interceptors">
<summary><strong>interceptors/</strong></summary>

<blockquote>

<details id="auth-interceptor">
<summary><strong><a href="src/app/core/interceptors/auth.interceptor.ts">auth.interceptor.ts</a> [interceptor]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Adiciona JWT no header Authorization em todas as requisições REST, exceto endpoints públicos /api/auth/*

</details>

<details><summary>dependencias</summary>

- `StorageService`

</details>

<details><summary>metodos</summary>

- `(req, next) => Observable<HttpEvent<any>>`

</details>

</blockquote>

</details>



<details id="error-interceptor">
<summary><strong><a href="src/app/core/interceptors/error.interceptor.ts">error.interceptor.ts</a> [interceptor]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Trata erros HTTP globalmente — 401 dispara logout automático, outros erros exibem snackbar com mensagem traduzida

</details>

<details><summary>dependencias</summary>

- `Router`
- `StorageService`
- `Injector   [NotificationService e TranslateService resolvidos lazy para evitar dependência circular]`

</details>

<details><summary>metodos</summary>

- `(req, next) => Observable<HttpEvent<any>>`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-core-services">
<summary><strong>services/</strong></summary>

<blockquote>

<details id="auth-service">
<summary><strong><a href="src/app/core/services/auth.service.ts">auth.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gerencia autenticação JWT completa — login, register, criação de admin, logout, signal de usuário atual e verificação de admin

</details>

<details><summary>dependencias</summary>

- `HttpClient`
- `Router`
- `StorageService`

</details>

<details><summary>atributos</summary>

- `currentUser : Signal<User | null>`
- `isAdmin     : Signal<boolean>   [computed de currentUser.role]`

</details>

<details><summary>metodos</summary>

- `login(request: LoginRequest)             : Observable<AuthResponse>`
- `register(request: RegisterRequest)       : Observable<AuthResponse>`
- `createAdmin(request: CreateAdminRequest) : Observable<AuthResponse>`
- `logout()                                 : void`
- `isAuthenticated()                        : boolean`

</details>

</blockquote>

</details>



<details id="storage-service">
<summary><strong><a href="src/app/core/services/storage.service.ts">storage.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Abstrai acesso ao localStorage — centraliza persistência de token e dados do usuário (id, email, name, role)

</details>

<details><summary>metodos</summary>

- `setToken / getToken / hasToken`
- `setUserId / getUserId`
- `setUserEmail / getUserEmail`
- `setUserName / getUserName`
- `setUserRole / getUserRole`
- `clear() : void`

</details>

</blockquote>

</details>



<details id="theme-service">
<summary><strong><a href="src/app/core/services/theme.service.ts">theme.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gerencia tema dark/light — aplica via data-attribute no <html> e configura defaults globais do Chart.js para cada tema

</details>

<details><summary>atributos</summary>

- `currentTheme : Signal<'light' | 'dark'>`

</details>

<details><summary>metodos</summary>

- `toggle() : void`

</details>

</blockquote>

</details>



<details id="i18n-service">
<summary><strong><a href="src/app/core/services/i18n.service.ts">i18n.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gerencia internacionalização (pt-BR, en-US) com ngx-translate — inicializa, persiste idioma no localStorage

</details>

<details><summary>dependencias</summary>

- `Injector   [TranslateService resolvido lazy]`

</details>

<details><summary>atributos</summary>

- `currentLang        : Signal<string>`
- `availableLanguages : LanguageOption[]`

</details>

<details><summary>metodos</summary>

- `init()                   : void`
- `switchLang(lang: string) : void`

</details>

</blockquote>

</details>



<details id="notification-service">
<summary><strong><a href="src/app/core/services/notification.service.ts">notification.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Wrapper de MatSnackBar — exibe feedback success/error/info com mensagens traduzidas no canto superior direito

</details>

<details><summary>dependencias</summary>

- `MatSnackBar`
- `TranslateService`

</details>

<details><summary>metodos</summary>

- `success(message: string) : void`
- `error(message: string)   : void`
- `info(message: string)    : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared">
<summary><strong>shared/</strong></summary>

<blockquote>

<details id="dir-shared-models">
<summary><strong>models/</strong></summary>

<blockquote>

<details id="auth-model">
<summary><strong><a href="src/app/shared/models/auth.model.ts">auth.model.ts</a> [enum + interfaces]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define tipos de autenticação — Role enum, requests de login/register/createAdmin e AuthResponse

</details>

<details><summary>tipos</summary>

- `Role [enum]`
  - `ADMIN`
  - `USER`
- `LoginRequest [interface]`
  - `email    : string`
  - `password : string`
- `RegisterRequest [interface]`
  - `name     : string`
  - `email    : string`
  - `password : string`
- `CreateAdminRequest [interface]`
  - `name      : string`
  - `email     : string`
  - `password  : string`
  - `masterKey : string`
- `AuthResponse [interface]`
  - `token  : string`
  - `userId : number`
  - `email  : string`
  - `name   : string`
  - `role   : Role`

</details>

</blockquote>

</details>



<details id="user-model">
<summary><strong><a href="src/app/shared/models/user.model.ts">user.model.ts</a> [interfaces]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define tipos de usuário — entidade de domínio e input de mutations GraphQL

</details>

<details><summary>tipos</summary>

- `User [interface]`
  - `id    : string`
  - `name  : string`
  - `email : string`
  - `role  : string`
- `UserDTO [interface]`
  - `id    : string`
  - `name  : string`
  - `email : string`
- `UserInput [interface]`
  - `name     : string`
  - `email    : string`
  - `password : string`

</details>

</blockquote>

</details>



<details id="account-model">
<summary><strong><a href="src/app/shared/models/account.model.ts">account.model.ts</a> [interfaces]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define tipos de conta bancária — DTO de resposta e inputs de criação e vinculação via Pluggy

</details>

<details><summary>tipos</summary>

- `AccountDTO [interface]`
  - `id            : string`
  - `institution   : string`
  - `description   : string`
  - `accountName   : string`
  - `balance       : string`
  - `userId        : string`
  - `integrationId : string`
- `AccountInput [interface]`
  - `accountName   : string`
  - `institution   : string`
  - `description   : string`
  - `userId        : string`
  - `integrationId : string`
- `LinkAccountInput [interface]`
  - `integrationId   : string`
  - `pluggyAccountId : string`
  - `name            : string`
  - `institution     : string`
  - `description     : string`

</details>

</blockquote>

</details>



<details id="category-model">
<summary><strong><a href="src/app/shared/models/category.model.ts">category.model.ts</a> [interfaces]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define tipos de categoria de transações

</details>

<details><summary>tipos</summary>

- `CategoryDTO [interface]`
  - `id     : string`
  - `name   : string`
  - `userId : string`
- `CategoryInput [interface]`
  - `name   : string`
  - `userId : string`

</details>

</blockquote>

</details>



<details id="transaction-model">
<summary><strong><a href="src/app/shared/models/transaction.model.ts">transaction.model.ts</a> [enum + interfaces]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define o modelo mais complexo do domínio — enum TransactionType, DTOs de resposta, inputs de mutations e todos os tipos de filtro e paginação

</details>

<details><summary>tipos</summary>

- `TransactionType [enum]`
  - `INFLOW`
  - `OUTFLOW`
- `TransactionDTO [interface]`
  - `id              : string`
  - `amount          : string`
  - `type            : TransactionType`
  - `description     : string`
  - `source          : string`
  - `destination     : string`
  - `transactionDate : string`
  - `categoryId      : string`
  - `accountId       : string`
- `TransactionInput [interface]`
  - `amount, type, description, source, destination, transactionDate, accountId, categoryId`
- `TransactionFilterInput [interface]`
  - `categoryIds : string[]`
- `DateRangeInput [interface]`
  - `startDate : string`
  - `endDate   : string`
- `PaginationInput [interface]`
  - `page : number`
  - `size : number`
- `TransactionListWithBalanceDTO [interface]`
  - `transactions : TransactionDTO[]`
  - `balance      : string`
- `PageInfo [interface]`
  - `currentPage, pageSize, totalElements, totalPages, hasNext, hasPrevious`
- `TransactionPageDTO [interface]`
  - `transactions : TransactionDTO[]`
  - `pageInfo     : PageInfo`
  - `balance      : string`

</details>

</blockquote>

</details>



<details id="integration-model">
<summary><strong><a href="src/app/shared/models/integration.model.ts">integration.model.ts</a> [enum + interfaces]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define tipos de integração financeira — AggregatorType, DTOs do Pluggy e inputs de mutations

</details>

<details><summary>tipos</summary>

- `AggregatorType [enum]`
  - `BELVO`
  - `PLUGGY`
- `FinancialIntegrationDTO [interface]`
  - `id, aggregator, linkId, status, createdAt, expiresAt, userId, accounts`
- `FinancialIntegrationInput [interface]`
  - `aggregator, linkId, userId`
- `PluggyAccountDTO [interface]`
  - `id, name, type, balance, currency`

</details>

</blockquote>

</details>



<details id="index">
<summary><strong><a href="src/app/shared/models/index.ts">index.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Barrel export — re-exporta todos os models para imports limpos

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-graphql">
<summary><strong>graphql/</strong></summary>

<blockquote>

<details id="account-operations">
<summary><strong><a href="src/app/shared/graphql/account.operations.ts">account.operations.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define todas as operações GraphQL de contas — queries e mutations usadas pelo AccountsService

</details>

<details><summary>queries</summary>

- `LIST_ACCOUNTS_BY_USER`
- `FIND_ACCOUNT_BY_ID`

</details>

<details><summary>mutations</summary>

- `CREATE_ACCOUNT`
- `UPDATE_ACCOUNT`
- `DELETE_ACCOUNT`
- `LINK_ACCOUNT`

</details>

</blockquote>

</details>



<details id="category-operations">
<summary><strong><a href="src/app/shared/graphql/category.operations.ts">category.operations.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define todas as operações GraphQL de categorias — queries e mutations usadas pelo CategoriesService

</details>

<details><summary>queries</summary>

- `LIST_CATEGORIES_BY_USER`
- `FIND_CATEGORY_BY_ID`

</details>

<details><summary>mutations</summary>

- `CREATE_CATEGORY`
- `UPDATE_CATEGORY`
- `DELETE_CATEGORY`

</details>

</blockquote>

</details>



<details id="transaction-operations">
<summary><strong><a href="src/app/shared/graphql/transaction.operations.ts">transaction.operations.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define todas as operações GraphQL de transações — 10 queries (incluindo paginadas e filtradas) e 4 mutations

</details>

<details><summary>queries</summary>

- `FIND_TRANSACTION_BY_ID`
- `LIST_USER_TRANSACTIONS`
- `LIST_ACCOUNT_TRANSACTIONS`
- `LIST_TRANSACTIONS_BY_PERIOD`
- `LIST_TRANSACTIONS_BY_TYPE`
- `LIST_TRANSACTIONS_BY_FILTER`
- `LIST_UNCATEGORIZED_TRANSACTIONS`
- `LIST_ACCOUNT_TRANSACTIONS_PAGINATED`
- `LIST_TRANSACTIONS_BY_PERIOD_PAGINATED`
- `LIST_TRANSACTIONS_BY_TYPE_PAGINATED`

</details>

<details><summary>mutations</summary>

- `CREATE_TRANSACTION`
- `UPDATE_TRANSACTION`
- `CATEGORIZE_TRANSACTION`
- `DELETE_TRANSACTION`

</details>

</blockquote>

</details>



<details id="integration-operations">
<summary><strong><a href="src/app/shared/graphql/integration.operations.ts">integration.operations.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define todas as operações GraphQL de integrações financeiras Pluggy/Belvo — 6 queries e 5 mutations

</details>

<details><summary>queries</summary>

- `LIST_FINANCIAL_INTEGRATIONS_BY_USER`
- `FIND_FINANCIAL_INTEGRATION_BY_ID`
- `LIST_ACCOUNTS_BY_INTEGRATION`
- `ACCOUNTS_FROM_PLUGGY`
- `CREATE_CONNECT_TOKEN`
- `CREATE_CONNECT_TOKEN_FOR_ITEM`

</details>

<details><summary>mutations</summary>

- `CREATE_FINANCIAL_INTEGRATION`
- `UPDATE_FINANCIAL_INTEGRATION`
- `SYNC_INTEGRATION_TRANSACTIONS`
- `RECONNECT_INTEGRATION`
- `DELETE_FINANCIAL_INTEGRATION`

</details>

</blockquote>

</details>



<details id="user-operations">
<summary><strong><a href="src/app/shared/graphql/user.operations.ts">user.operations.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define operações GraphQL de usuários — queries e mutations usadas pelo ProfileComponent via Apollo

</details>

<details><summary>queries</summary>

- `LIST_USERS`
- `FIND_USER_BY_EMAIL`

</details>

<details><summary>mutations</summary>

- `CREATE_USER`
- `UPDATE_USER`
- `DELETE_USER`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-components">
<summary><strong>components/</strong></summary>

<blockquote>

<details id="dir-shared-confirm-dialog">
<summary><strong>confirm-dialog/</strong></summary>

<blockquote>

<details id="confirm-dialog-component">
<summary><strong><a href="src/app/shared/components/confirm-dialog/confirm-dialog.component.ts">confirm-dialog.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Modal genérico de confirmação — recebe título e mensagem via MAT_DIALOG_DATA, retorna boolean ao fechar

</details>

<details><summary>dependencias</summary>

- `MatDialogRef<ConfirmDialogComponent>`
- `MAT_DIALOG_DATA   [ConfirmDialogData: { title, message }]`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-header">
<summary><strong>header/</strong></summary>

<blockquote>

<details id="header-component">
<summary><strong><a href="src/app/shared/components/header/header.component.ts">header.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Barra de navegação principal — exibe links autenticados, avatar com iniciais, toggle de tema, toggle de idioma e menu de logout

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `ThemeService`
- `I18nService`

</details>

<details><summary>atributos</summary>

- `isAuthenticated  : () => boolean`
- `userName         : Signal<string>`
- `userInitials     : Signal<string>   [computed]`
- `currentTheme     : Signal<'light' | 'dark'>`
- `themeIcon        : Signal<string>   [computed]`
- `themeTooltip     : Signal<string>   [computed]`
- `currentLang      : Signal<string>`
- `currentLangLabel : Signal<string>   [computed]`

</details>

<details><summary>metodos</summary>

- `toggleTheme() : void`
- `toggleLang()  : void`
- `logout()      : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-loading-spinner">
<summary><strong>loading-spinner/</strong></summary>

<blockquote>

<details id="loading-spinner-component">
<summary><strong><a href="src/app/shared/components/loading-spinner/loading-spinner.component.ts">loading-spinner.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Spinner de carregamento reutilizável — exibido por qualquer componente durante operações assíncronas

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-splash-screen">
<summary><strong>splash-screen/</strong></summary>

<blockquote>

<details id="splash-screen-component">
<summary><strong><a href="src/app/shared/components/splash-screen/splash-screen.component.ts">splash-screen.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Tela de splash exibida por ~2.3s na inicialização — respeita prefers-reduced-motion; emite done quando concluída

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>outputs</summary>

- `done : OutputEmitterRef<void>`

</details>

<details><summary>metodos</summary>

- `ngOnInit() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features">
<summary><strong>features/</strong></summary>

<blockquote>

<details id="dir-features-auth">
<summary><strong>auth/</strong></summary>

<blockquote>

<details id="dir-auth-login">
<summary><strong>login/</strong></summary>

<blockquote>

<details id="login-component">
<summary><strong><a href="src/app/features/auth/login/login.component.ts">login.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de login — valida email/senha, chama AuthService.login(), redireciona para returnUrl ou /dashboard

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`
- `Router`
- `ActivatedRoute`

</details>

<details><summary>atributos</summary>

- `loading      : Signal<boolean>`
- `hidePassword : Signal<boolean>`
- `loginForm    : FormGroup   [email: required/email, password: required]`

</details>

<details><summary>metodos</summary>

- `onSubmit() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-auth-register">
<summary><strong>register/</strong></summary>

<blockquote>

<details id="register-component">
<summary><strong><a href="src/app/features/auth/register/register.component.ts">register.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de registro — cria usuário com Role.USER e faz auto-login após registro

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`

</details>

<details><summary>atributos</summary>

- `loading       : Signal<boolean>`
- `hidePassword  : Signal<boolean>`
- `registerForm  : FormGroup   [name, email, password]`

</details>

<details><summary>metodos</summary>

- `onSubmit() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-accounts">
<summary><strong>accounts/</strong></summary>

<blockquote>

<details id="accounts-service">
<summary><strong><a href="src/app/features/accounts/accounts.service.ts">accounts.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

CRUD de contas bancárias via Apollo (GraphQL) — inclui listagem por usuário, criação, atualização, deleção e vinculação de conta via Pluggy

</details>

<details><summary>dependencias</summary>

- `Apollo   [apollo-angular]`

</details>

<details><summary>metodos</summary>

- `listByUser(userId: string)                     : Observable<AccountDTO[]>`
- `findById(id: string)                           : Observable<AccountDTO>`
- `create(account: AccountInput)                  : Observable<AccountDTO>`
- `update(id: string, account: AccountInput)      : Observable<AccountDTO>`
- `delete(id: string)                             : Observable<AccountDTO>`
- `linkAccount(input: LinkAccountInput)           : Observable<AccountDTO>`

</details>

</blockquote>

</details>


<details id="dir-account-form">
<summary><strong>account-form/</strong></summary>

<blockquote>

<details id="account-form-component">
<summary><strong><a href="src/app/features/accounts/account-form/account-form.component.ts">account-form.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário reutilizado para criação e edição de conta — detecta modo edit pelo routeParam

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `Router`
- `ActivatedRoute`
- `AuthService`
- `AccountsService`
- `NotificationService`
- `TranslateService`

</details>

<details><summary>atributos</summary>

- `loading      : Signal<boolean>`
- `loadingData  : Signal<boolean>`
- `isEditMode   : Signal<boolean>`
- `accountForm  : FormGroup   [accountName, institution, description]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()  : void`
- `onSubmit()  : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-account-list">
<summary><strong>account-list/</strong></summary>

<blockquote>

<details id="account-list-component">
<summary><strong><a href="src/app/features/accounts/account-list/account-list.component.ts">account-list.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Lista contas do usuário com saldo — classe de cor por saldo positivo/negativo, deleção com confirmação

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `AccountsService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `accounts : Signal<AccountDTO[]>`
- `loading  : Signal<boolean>`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                                  : void`
- `confirmDelete(account: AccountDTO)           : void`
- `getBalanceClass(balance: string)             : string`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-categories">
<summary><strong>categories/</strong></summary>

<blockquote>

<details id="categories-service">
<summary><strong><a href="src/app/features/categories/categories.service.ts">categories.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

CRUD de categorias de transações via Apollo

</details>

<details><summary>dependencias</summary>

- `Apollo`

</details>

<details><summary>metodos</summary>

- `listByUser(userId: string)                    : Observable<CategoryDTO[]>`
- `findById(id: string)                          : Observable<CategoryDTO>`
- `create(input: CategoryInput)                  : Observable<CategoryDTO>`
- `update(id: string, input: CategoryInput)      : Observable<CategoryDTO>`
- `delete(id: string)                            : Observable<CategoryDTO>`

</details>

</blockquote>

</details>


<details id="dir-category-list">
<summary><strong>category-list/</strong></summary>

<blockquote>

<details id="category-list-component">
<summary><strong><a href="src/app/features/categories/category-list/category-list.component.ts">category-list.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

CRUD de categorias inline — criação, edição e deleção sem navegação; formulários colapsáveis em linha

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`
- `CategoriesService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `categories         : Signal<CategoryDTO[]>`
- `loading            : Signal<boolean>`
- `showForm           : Signal<boolean>`
- `saving             : Signal<boolean>`
- `editingCategoryId  : Signal<string | null>`
- `editSaving         : Signal<boolean>`
- `categoryForm       : FormGroup   [name: required]`
- `editForm           : FormGroup   [name: required]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                               : void`
- `toggleForm()                             : void`
- `onSubmit()                               : void`
- `startEdit(category: CategoryDTO)         : void`
- `cancelEdit()                             : void`
- `onEditSubmit()                           : void`
- `confirmDelete(category: CategoryDTO)     : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-transactions">
<summary><strong>transactions/</strong></summary>

<blockquote>

<details id="transactions-service">
<summary><strong><a href="src/app/features/transactions/transactions.service.ts">transactions.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Serviço mais completo — CRUD e 10+ tipos de listagem de transações via Apollo, incluindo filtros por período, tipo, categoria e paginação

</details>

<details><summary>dependencias</summary>

- `Apollo`

</details>

<details><summary>metodos</summary>

- `findById(id: string)                                                                  : Observable<TransactionDTO>`
- `listByUser()                                                                          : Observable<TransactionListWithBalanceDTO>`
- `listByAccount(accountId?: string)                                                     : Observable<TransactionListWithBalanceDTO>`
- `listByPeriod(range: DateRangeInput, accountId?: string)                               : Observable<TransactionListWithBalanceDTO>`
- `listByType(type: string, accountId?: string)                                          : Observable<TransactionListWithBalanceDTO>`
- `listByFilter(filter: TransactionFilterInput, accountId?: string)                      : Observable<TransactionListWithBalanceDTO>`
- `listUncategorized(accountId?: string)                                                 : Observable<TransactionDTO[]>`
- `listByAccountPaginated(pagination?: PaginationInput, accountId?: string)              : Observable<TransactionPageDTO>`
- `listByPeriodPaginated(range: DateRangeInput, pagination?: PaginationInput, accountId?): Observable<TransactionPageDTO>`
- `listByTypePaginated(type: string, pagination?: PaginationInput, accountId?)           : Observable<TransactionPageDTO>`
- `create(input: TransactionInput)                                                       : Observable<TransactionDTO>`
- `update(id: string, input: TransactionInput)                                           : Observable<TransactionDTO>`
- `categorize(id: string, categoryId: string | null)                                     : Observable<TransactionDTO>`
- `delete(id: string)                                                                    : Observable<TransactionDTO>`

</details>

</blockquote>

</details>


<details id="dir-transaction-form">
<summary><strong>transaction-form/</strong></summary>

<blockquote>

<details id="transaction-form-component">
<summary><strong><a href="src/app/features/transactions/transaction-form/transaction-form.component.ts">transaction-form.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário reutilizado para criação e edição de transação — inclui validação de data (não futura) e botão de deleção no modo edit

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `Router`
- `ActivatedRoute`
- `AuthService`
- `TransactionsService`
- `AccountsService`
- `CategoriesService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `today            : string   [data de hoje para validação]`
- `loading          : Signal<boolean>`
- `loadingData      : Signal<boolean>`
- `isEditMode       : Signal<boolean>`
- `accounts         : Signal<AccountDTO[]>`
- `categories       : Signal<CategoryDTO[]>`
- `selectedType     : Signal<string>`
- `transactionForm  : FormGroup   [amount, type, description, source, destination, transactionDate, accountId, categoryId]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()  : void`
- `onSubmit()  : void`
- `onDelete()  : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-transaction-list">
<summary><strong>transaction-list/</strong></summary>

<blockquote>

<details id="transaction-list-component">
<summary><strong><a href="src/app/features/transactions/transaction-list/transaction-list.component.ts">transaction-list.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Lista transações com paginação server-side, filtros por conta/data/tipo/categoria e categorização inline

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`
- `TransactionsService`
- `AccountsService`
- `CategoriesService`
- `NotificationService`
- `TranslateService`
- `ActivatedRoute`

</details>

<details><summary>atributos</summary>

- `transactions      : Signal<TransactionDTO[]>`
- `accounts          : Signal<AccountDTO[]>`
- `categories        : Signal<CategoryDTO[]>`
- `balance           : Signal<string>`
- `loading           : Signal<boolean>`
- `selectedAccountId : Signal<string>`
- `pageIndex         : Signal<number>`
- `pageSize          : Signal<number>`
- `totalElements     : Signal<number>`
- `filterForm        : FormGroup   [startDate, endDate, type, categoryIds]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                                           : void`
- `onAccountFilter(accountId: string)                   : void`
- `loadPaginated()                                      : void`
- `onPageChange(event: PageEvent)                       : void`
- `applyFilters()                                       : void`
- `clearFilters()                                       : void`
- `onCategorize(transactionId: string, categoryId: string) : void`
- `getCategoryName(categoryId?: string)                 : string`
- `getTypeClass(type: string)                           : string`
- `truncate(text: string, limit?: number)               : string`
- `getBalanceClass(balance: string)                     : string`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-integrations">
<summary><strong>integrations/</strong></summary>

<blockquote>

<details id="integrations-service">
<summary><strong><a href="src/app/features/integrations/integrations.service.ts">integrations.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Operações de integração financeira via Apollo — CRUD, connect token Pluggy, sincronização e reconexão de link expirado

</details>

<details><summary>dependencias</summary>

- `Apollo`

</details>

<details><summary>atributos</summary>

- `integrationLinked$ : Subject<void>   [emite quando nova integração é vinculada — componentes podem observar]`

</details>

<details><summary>metodos</summary>

- `list()                                        : Observable<FinancialIntegrationDTO[]>`
- `findById(id: string)                          : Observable<FinancialIntegrationDTO>`
- `listAccountsByIntegration(id: string)         : Observable<AccountDTO[]>`
- `createConnectToken()                          : Observable<string>`
- `createConnectTokenForItem(itemId: string)     : Observable<string>`
- `accountsFromPluggy(integrationId: string)     : Observable<PluggyAccountDTO[]>`
- `create(itemId: string)                        : Observable<FinancialIntegrationDTO>`
- `syncTransactions(integrationId: string)       : Observable<boolean>`
- `reconnect(integrationId: string)              : Observable<FinancialIntegrationDTO>`
- `delete(id: string)                            : Observable<FinancialIntegrationDTO>`

</details>

</blockquote>

</details>


<details id="dir-create-integration-dialog">
<summary><strong>create-integration-dialog/</strong></summary>

<blockquote>

<details id="create-integration-dialog-component">
<summary><strong><a href="src/app/features/integrations/create-integration-dialog/create-integration-dialog.component.ts">create-integration-dialog.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Dialog multi-step de criação de integração — Step 1: gera connect token e abre Pluggy widget; Step 2: exibe contas disponíveis e vincula as selecionadas

</details>

<details><summary>implements</summary>

- `AfterViewInit`

</details>

<details><summary>dependencias</summary>

- `IntegrationsService`
- `AccountsService`
- `NotificationService`
- `TranslateService`
- `MatDialog`
- `MatDialogRef<CreateIntegrationDialogComponent>`
- `MAT_DIALOG_DATA   [CreateIntegrationDialogData]`

</details>

<details><summary>atributos</summary>

- `stepper          : MatStepper`
- `loading          : Signal<boolean>`
- `linking          : Signal<boolean>`
- `connectToken     : Signal<string | null>`
- `itemId           : Signal<string | null>`
- `integration      : Signal<FinancialIntegrationDTO | null>`
- `pluggyAccounts   : Signal<PluggyAccountDTO[]>`
- `selectedAccounts : Signal<Set<string>>`
- `isStep2          : boolean`

</details>

<details><summary>metodos</summary>

- `ngAfterViewInit()              : void`
- `openPluggyWidget()             : void`
- `toggleAccount(accountId: string) : void`
- `isSelected(accountId: string)  : boolean`
- `linkSelectedAccounts()         : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-integration-list">
<summary><strong>integration-list/</strong></summary>

<blockquote>

<details id="integration-list-component">
<summary><strong><a href="src/app/features/integrations/integration-list/integration-list.component.ts">integration-list.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Lista integrações financeiras Pluggy/Belvo — cria via dialog multi-step, reconecta link expirado e deleta com confirmação

</details>

<details><summary>implements</summary>

- `OnInit`
- `OnDestroy`

</details>

<details><summary>dependencias</summary>

- `IntegrationsService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `integrations  : Signal<FinancialIntegrationDTO[]>`
- `loading       : Signal<boolean>`
- `reconnecting  : Signal<string | null>   [id da integração sendo reconectada]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                                             : void`
- `ngOnDestroy()                                          : void`
- `isOutdated(integration: FinancialIntegrationDTO)       : boolean`
- `openCreateDialog()                                     : void`
- `reconnect(integration: FinancialIntegrationDTO)        : void`
- `confirmDelete(integration: FinancialIntegrationDTO)    : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-dashboard">
<summary><strong>dashboard/</strong></summary>

<blockquote>

<details id="dashboard-service">
<summary><strong><a href="src/app/features/dashboard/dashboard.service.ts">dashboard.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Busca dados agregados para o DashboardComponent — contas e transações com saldo via Apollo

</details>

<details><summary>dependencias</summary>

- `Apollo`

</details>

<details><summary>metodos</summary>

- `getAccounts(userId: string)          : Observable<AccountDTO[]>`
- `getTransactionsWithBalance()         : Observable<TransactionListWithBalanceDTO>`

</details>

</blockquote>

</details>


<details id="dashboard-component">
<summary><strong><a href="src/app/features/dashboard/dashboard.component.ts">dashboard.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Dashboard principal — exibe resumo de contas, saldo total, transações recentes e delega 10 gráficos de análise para componentes filhos de chart

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `DashboardService`
- `CategoriesService`

</details>

<details><summary>atributos</summary>

- `userName            : Signal<string>`
- `accounts            : Signal<AccountDTO[]>`
- `recentTransactions  : Signal<TransactionDTO[]>`
- `allTransactions     : Signal<TransactionDTO[]>`
- `categories          : Signal<CategoryDTO[]>`
- `totalBalance        : Signal<string>`
- `loading             : Signal<boolean>`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                           : void`
- `getBalanceClass(balance: string)     : string`
- `getTypeClass(type: string)           : string`
- `truncate(text: string, limit?: number) : string`

</details>

</blockquote>

</details>


<details id="dir-dashboard-charts">
<summary><strong>charts/</strong></summary>

<blockquote>

<details id="balance-by-account-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/balance-by-account-chart.component.ts">balance-by-account-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de barras com saldo por conta — vermelho para negativos, verde para positivos

</details>

<details><summary>inputs</summary>

- `accounts : AccountDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'bar'>[]>`
- `chartOptions : ChartOptions<'bar'>`

</details>

</blockquote>

</details>



<details id="balance-evolution-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/balance-evolution-chart.component.ts">balance-evolution-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de linha com evolução acumulada do saldo por data

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'line'>[]>`
- `chartOptions : ChartOptions<'line'>`

</details>

</blockquote>

</details>



<details id="daily-avg-spending-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/daily-avg-spending-chart.component.ts">daily-avg-spending-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de barras com média diária de despesas por mês

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'bar'>[]>`
- `chartOptions : ChartOptions<'bar'>`

</details>

</blockquote>

</details>



<details id="expense-by-category-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/expense-by-category-chart.component.ts">expense-by-category-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de rosca (doughnut) com despesas agrupadas por categoria

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`
- `categories   : CategoryDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'doughnut'>[]>`
- `chartOptions : ChartOptions<'doughnut'>`

</details>

</blockquote>

</details>



<details id="income-by-category-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/income-by-category-chart.component.ts">income-by-category-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de rosca com receitas agrupadas por categoria

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`
- `categories   : CategoryDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'doughnut'>[]>`
- `chartOptions : ChartOptions<'doughnut'>`

</details>

</blockquote>

</details>



<details id="income-expense-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/income-expense-chart.component.ts">income-expense-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de barras agrupadas com receitas vs despesas por mês

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'bar'>[]>`
- `chartOptions : ChartOptions<'bar'>`

</details>

</blockquote>

</details>



<details id="inflow-outflow-ratio-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/inflow-outflow-ratio-chart.component.ts">inflow-outflow-ratio-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de rosca com proporção entradas vs saídas — exibe percentual e classe de cor (positivo/negativo)

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : string[]`
- `chartData    : Signal<ChartDataset<'doughnut'>[]>`
- `chartOptions : ChartOptions<'doughnut'>`
- `ratioText    : Signal<string>`
- `ratioClass   : Signal<string>`
- `hasData      : Signal<boolean>`

</details>

</blockquote>

</details>



<details id="month-comparison-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/month-comparison-chart.component.ts">month-comparison-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de barras comparando mês atual vs mês anterior — exibe "sem dados" se não houver transações

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : string[]`
- `chartData    : Signal<ChartDataset<'bar'>[]>`
- `chartOptions : ChartOptions<'bar'>`
- `hasData      : Signal<boolean>`

</details>

</blockquote>

</details>



<details id="monthly-cash-flow-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/monthly-cash-flow-chart.component.ts">monthly-cash-flow-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de linha com fluxo de caixa líquido (INFLOW - OUTFLOW) por mês

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : Signal<string[]>`
- `chartData    : Signal<ChartDataset<'line'>[]>`
- `chartOptions : ChartOptions<'line'>`

</details>

</blockquote>

</details>



<details id="transactions-by-weekday-chart-component">
<summary><strong><a href="src/app/features/dashboard/charts/transactions-by-weekday-chart.component.ts">transactions-by-weekday-chart.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gráfico de barras com total de despesas por dia da semana — exibe "sem dados" se não houver transações

</details>

<details><summary>inputs</summary>

- `transactions : TransactionDTO[]`

</details>

<details><summary>atributos</summary>

- `chartLabels  : string[]`
- `chartData    : Signal<ChartDataset<'bar'>[]>`
- `chartOptions : ChartOptions<'bar'>`
- `hasData      : Signal<boolean>`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-profile">
<summary><strong>profile/</strong></summary>

<blockquote>

<details id="profile-component">
<summary><strong><a href="src/app/features/profile/profile.component.ts">profile.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Tela de perfil — permite atualizar nome e senha e deletar conta; usa Apollo diretamente para mutations de usuário

</details>

<details><summary>implements</summary>

- `OnInit`

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`
- `Apollo   [direto — mutations UPDATE_USER e DELETE_USER]`
- `NotificationService`
- `StorageService`
- `MatDialog`
- `TranslateService`
- `Router`

</details>

<details><summary>atributos</summary>

- `loadingUpdate  : Signal<boolean>`
- `loadingDelete  : Signal<boolean>`
- `hidePassword   : Signal<boolean>`
- `profileForm    : FormGroup   [name, password]`
- `currentEmail   : string   [getter de AuthService.currentUser]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()        : void`
- `onSubmit()        : void`
- `onDeleteAccount() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>
