# FinanceSite — Mapa de Classes

---

## MODELS

---

### auth.model.ts [enum + interfaces]

```
auth.model.ts
├── funcao/ Define tipos de autenticação — Role enum, requests de login/register/createAdmin e AuthResponse
├── tipos/
│   ├── Role [enum]
│   │   ├── ADMIN
│   │   └── USER
│   ├── LoginRequest [interface]
│   │   ├── email    : string
│   │   └── password : string
│   ├── RegisterRequest [interface]
│   │   ├── name     : string
│   │   ├── email    : string
│   │   └── password : string
│   ├── CreateAdminRequest [interface]
│   │   ├── name      : string
│   │   ├── email     : string
│   │   ├── password  : string
│   │   └── masterKey : string
│   └── AuthResponse [interface]
│       ├── token  : string
│       ├── userId : number
│       ├── email  : string
│       ├── name   : string
│       └── role   : Role
```

---

### user.model.ts [interfaces]

```
user.model.ts
├── funcao/ Define tipos de usuário — entidade de domínio e input de mutations GraphQL
├── tipos/
│   ├── User [interface]
│   │   ├── id    : string
│   │   ├── name  : string
│   │   ├── email : string
│   │   └── role  : string
│   ├── UserDTO [interface]
│   │   ├── id    : string
│   │   ├── name  : string
│   │   └── email : string
│   └── UserInput [interface]
│       ├── name     : string
│       ├── email    : string
│       └── password : string
```

---

### account.model.ts [interfaces]

```
account.model.ts
├── funcao/ Define tipos de conta bancária — DTO de resposta e inputs de criação e vinculação via Pluggy
├── tipos/
│   ├── AccountDTO [interface]
│   │   ├── id            : string
│   │   ├── institution   : string
│   │   ├── description   : string
│   │   ├── accountName   : string
│   │   ├── balance       : string
│   │   ├── userId        : string
│   │   └── integrationId : string
│   ├── AccountInput [interface]
│   │   ├── accountName   : string
│   │   ├── institution   : string
│   │   ├── description   : string
│   │   ├── userId        : string
│   │   └── integrationId : string
│   └── LinkAccountInput [interface]
│       ├── integrationId   : string
│       ├── pluggyAccountId : string
│       ├── name            : string
│       ├── institution     : string
│       └── description     : string
```

---

### category.model.ts [interfaces]

```
category.model.ts
├── funcao/ Define tipos de categoria de transações
├── tipos/
│   ├── CategoryDTO [interface]
│   │   ├── id     : string
│   │   ├── name   : string
│   │   └── userId : string
│   └── CategoryInput [interface]
│       ├── name   : string
│       └── userId : string
```

---

### transaction.model.ts [enum + interfaces]

```
transaction.model.ts
├── funcao/ Define o modelo mais complexo do domínio — enum TransactionType, DTOs de resposta, inputs de mutations e todos os tipos de filtro e paginação
├── tipos/
│   ├── TransactionType [enum]
│   │   ├── INFLOW
│   │   └── OUTFLOW
│   ├── TransactionDTO [interface]
│   │   ├── id              : string
│   │   ├── amount          : string
│   │   ├── type            : TransactionType
│   │   ├── description     : string
│   │   ├── source          : string
│   │   ├── destination     : string
│   │   ├── transactionDate : string
│   │   ├── categoryId      : string
│   │   └── accountId       : string
│   ├── TransactionInput [interface]
│   │   ├── amount, type, description, source, destination, transactionDate, accountId, categoryId
│   ├── TransactionFilterInput [interface]
│   │   └── categoryIds : string[]
│   ├── DateRangeInput [interface]
│   │   ├── startDate : string
│   │   └── endDate   : string
│   ├── PaginationInput [interface]
│   │   ├── page : number
│   │   └── size : number
│   ├── TransactionListWithBalanceDTO [interface]
│   │   ├── transactions : TransactionDTO[]
│   │   └── balance      : string
│   ├── PageInfo [interface]
│   │   ├── currentPage, pageSize, totalElements, totalPages, hasNext, hasPrevious
│   └── TransactionPageDTO [interface]
│       ├── transactions : TransactionDTO[]
│       ├── pageInfo     : PageInfo
│       └── balance      : string
```

---

### integration.model.ts [enum + interfaces]

```
integration.model.ts
├── funcao/ Define tipos de integração financeira — AggregatorType, DTOs do Pluggy e inputs de mutations
├── tipos/
│   ├── AggregatorType [enum]
│   │   ├── BELVO
│   │   └── PLUGGY
│   ├── FinancialIntegrationDTO [interface]
│   │   ├── id, aggregator, linkId, status, createdAt, expiresAt, userId, accounts
│   ├── FinancialIntegrationInput [interface]
│   │   ├── aggregator, linkId, userId
│   └── PluggyAccountDTO [interface]
│       ├── id, name, type, balance, currency
```

---

### index.ts

```
index.ts
├── funcao/ Barrel export — re-exporta todos os models para imports limpos
```

---

## GRAPHQL OPERATIONS

---

### account.operations.ts

```
account.operations.ts
├── funcao/ Define todas as operações GraphQL de contas — queries e mutations usadas pelo AccountsService
├── queries/
│   ├── LIST_ACCOUNTS_BY_USER
│   └── FIND_ACCOUNT_BY_ID
└── mutations/
    ├── CREATE_ACCOUNT
    ├── UPDATE_ACCOUNT
    ├── DELETE_ACCOUNT
    └── LINK_ACCOUNT
```

---

### category.operations.ts

```
category.operations.ts
├── funcao/ Define todas as operações GraphQL de categorias — queries e mutations usadas pelo CategoriesService
├── queries/
│   ├── LIST_CATEGORIES_BY_USER
│   └── FIND_CATEGORY_BY_ID
└── mutations/
    ├── CREATE_CATEGORY
    ├── UPDATE_CATEGORY
    └── DELETE_CATEGORY
```

---

### transaction.operations.ts

```
transaction.operations.ts
├── funcao/ Define todas as operações GraphQL de transações — 10 queries (incluindo paginadas e filtradas) e 4 mutations
├── queries/
│   ├── FIND_TRANSACTION_BY_ID
│   ├── LIST_USER_TRANSACTIONS
│   ├── LIST_ACCOUNT_TRANSACTIONS
│   ├── LIST_TRANSACTIONS_BY_PERIOD
│   ├── LIST_TRANSACTIONS_BY_TYPE
│   ├── LIST_TRANSACTIONS_BY_FILTER
│   ├── LIST_UNCATEGORIZED_TRANSACTIONS
│   ├── LIST_ACCOUNT_TRANSACTIONS_PAGINATED
│   ├── LIST_TRANSACTIONS_BY_PERIOD_PAGINATED
│   └── LIST_TRANSACTIONS_BY_TYPE_PAGINATED
└── mutations/
    ├── CREATE_TRANSACTION
    ├── UPDATE_TRANSACTION
    ├── CATEGORIZE_TRANSACTION
    └── DELETE_TRANSACTION
```

---

### integration.operations.ts

```
integration.operations.ts
├── funcao/ Define todas as operações GraphQL de integrações financeiras Pluggy/Belvo — 6 queries e 5 mutations
├── queries/
│   ├── LIST_FINANCIAL_INTEGRATIONS_BY_USER
│   ├── FIND_FINANCIAL_INTEGRATION_BY_ID
│   ├── LIST_ACCOUNTS_BY_INTEGRATION
│   ├── ACCOUNTS_FROM_PLUGGY
│   ├── CREATE_CONNECT_TOKEN
│   └── CREATE_CONNECT_TOKEN_FOR_ITEM
└── mutations/
    ├── CREATE_FINANCIAL_INTEGRATION
    ├── UPDATE_FINANCIAL_INTEGRATION
    ├── SYNC_INTEGRATION_TRANSACTIONS
    ├── RECONNECT_INTEGRATION
    └── DELETE_FINANCIAL_INTEGRATION
```

---

### user.operations.ts

```
user.operations.ts
├── funcao/ Define operações GraphQL de usuários — queries e mutations usadas pelo ProfileComponent via Apollo
├── queries/
│   ├── LIST_USERS
│   └── FIND_USER_BY_EMAIL
└── mutations/
    ├── CREATE_USER
    ├── UPDATE_USER
    └── DELETE_USER
```

---

## CORE — GUARDS

---

### auth.guard.ts [guard]

```
auth.guard.ts
├── funcao/ Protege rotas autenticadas — redireciona para /login preservando returnUrl se não houver token
├── dependencias/
│   ├── AuthService
│   └── Router
└── metodos/
    └── (route, state) => boolean | UrlTree
```

---

### admin.guard.ts [guard]

```
admin.guard.ts
├── funcao/ Protege rotas exclusivas de ADMIN — redireciona para /dashboard se o usuário não tiver role ADMIN
├── dependencias/
│   ├── AuthService
│   └── Router
└── metodos/
    └── () => boolean
```

---

### no-auth.guard.ts [guard]

```
no-auth.guard.ts
├── funcao/ Impede usuários autenticados de acessar páginas públicas (login, register) — redireciona para /dashboard
├── dependencias/
│   ├── AuthService
│   └── Router
└── metodos/
    └── () => boolean
```

---

## CORE — INTERCEPTORS

---

### auth.interceptor.ts [interceptor]

```
auth.interceptor.ts
├── funcao/ Adiciona JWT no header Authorization em todas as requisições REST, exceto endpoints públicos /api/auth/*
├── dependencias/
│   └── StorageService
└── metodos/
    └── (req, next) => Observable<HttpEvent<any>>
```

---

### error.interceptor.ts [interceptor]

```
error.interceptor.ts
├── funcao/ Trata erros HTTP globalmente — 401 dispara logout automático, outros erros exibem snackbar com mensagem traduzida
├── dependencias/
│   ├── Router
│   ├── StorageService
│   └── Injector   [NotificationService e TranslateService resolvidos lazy para evitar dependência circular]
└── metodos/
    └── (req, next) => Observable<HttpEvent<any>>
```

---

## CORE — SERVICES

---

### auth.service.ts [service]

```
auth.service.ts
├── funcao/ Gerencia autenticação JWT completa — login, register, criação de admin, logout, signal de usuário atual e verificação de admin
├── dependencias/
│   ├── HttpClient
│   ├── Router
│   └── StorageService
├── atributos/
│   ├── currentUser : Signal<User | null>
│   └── isAdmin     : Signal<boolean>   [computed de currentUser.role]
└── metodos/
    ├── login(request: LoginRequest)             : Observable<AuthResponse>
    ├── register(request: RegisterRequest)       : Observable<AuthResponse>
    ├── createAdmin(request: CreateAdminRequest) : Observable<AuthResponse>
    ├── logout()                                 : void
    └── isAuthenticated()                        : boolean
```

---

### storage.service.ts [service]

```
storage.service.ts
├── funcao/ Abstrai acesso ao localStorage — centraliza persistência de token e dados do usuário (id, email, name, role)
└── metodos/
    ├── setToken / getToken / hasToken
    ├── setUserId / getUserId
    ├── setUserEmail / getUserEmail
    ├── setUserName / getUserName
    ├── setUserRole / getUserRole
    └── clear() : void
```

---

### theme.service.ts [service]

```
theme.service.ts
├── funcao/ Gerencia tema dark/light — aplica via data-attribute no <html> e configura defaults globais do Chart.js para cada tema
├── atributos/
│   └── currentTheme : Signal<'light' | 'dark'>
└── metodos/
    └── toggle() : void
```

---

### i18n.service.ts [service]

```
i18n.service.ts
├── funcao/ Gerencia internacionalização (pt-BR, en-US) com ngx-translate — inicializa, persiste idioma no localStorage
├── dependencias/
│   └── Injector   [TranslateService resolvido lazy]
├── atributos/
│   ├── currentLang        : Signal<string>
│   └── availableLanguages : LanguageOption[]
└── metodos/
    ├── init()                   : void
    └── switchLang(lang: string) : void
```

---

### notification.service.ts [service]

```
notification.service.ts
├── funcao/ Wrapper de MatSnackBar — exibe feedback success/error/info com mensagens traduzidas no canto superior direito
├── dependencias/
│   ├── MatSnackBar
│   └── TranslateService
└── metodos/
    ├── success(message: string) : void
    ├── error(message: string)   : void
    └── info(message: string)    : void
```

---

### accounts.service.ts [service]

```
accounts.service.ts
├── funcao/ CRUD de contas bancárias via Apollo (GraphQL) — inclui listagem por usuário, criação, atualização, deleção e vinculação de conta via Pluggy
├── dependencias/
│   └── Apollo   [apollo-angular]
└── metodos/
    ├── listByUser(userId: string)                     : Observable<AccountDTO[]>
    ├── findById(id: string)                           : Observable<AccountDTO>
    ├── create(account: AccountInput)                  : Observable<AccountDTO>
    ├── update(id: string, account: AccountInput)      : Observable<AccountDTO>
    ├── delete(id: string)                             : Observable<AccountDTO>
    └── linkAccount(input: LinkAccountInput)           : Observable<AccountDTO>
```

---

### categories.service.ts [service]

```
categories.service.ts
├── funcao/ CRUD de categorias de transações via Apollo
├── dependencias/
│   └── Apollo
└── metodos/
    ├── listByUser(userId: string)                    : Observable<CategoryDTO[]>
    ├── findById(id: string)                          : Observable<CategoryDTO>
    ├── create(input: CategoryInput)                  : Observable<CategoryDTO>
    ├── update(id: string, input: CategoryInput)      : Observable<CategoryDTO>
    └── delete(id: string)                            : Observable<CategoryDTO>
```

---

### transactions.service.ts [service]

```
transactions.service.ts
├── funcao/ Serviço mais completo — CRUD e 10+ tipos de listagem de transações via Apollo, incluindo filtros por período, tipo, categoria e paginação
├── dependencias/
│   └── Apollo
└── metodos/
    ├── findById(id: string)                                                                  : Observable<TransactionDTO>
    ├── listByUser()                                                                          : Observable<TransactionListWithBalanceDTO>
    ├── listByAccount(accountId?: string)                                                     : Observable<TransactionListWithBalanceDTO>
    ├── listByPeriod(range: DateRangeInput, accountId?: string)                               : Observable<TransactionListWithBalanceDTO>
    ├── listByType(type: string, accountId?: string)                                          : Observable<TransactionListWithBalanceDTO>
    ├── listByFilter(filter: TransactionFilterInput, accountId?: string)                      : Observable<TransactionListWithBalanceDTO>
    ├── listUncategorized(accountId?: string)                                                 : Observable<TransactionDTO[]>
    ├── listByAccountPaginated(pagination?: PaginationInput, accountId?: string)              : Observable<TransactionPageDTO>
    ├── listByPeriodPaginated(range: DateRangeInput, pagination?: PaginationInput, accountId?): Observable<TransactionPageDTO>
    ├── listByTypePaginated(type: string, pagination?: PaginationInput, accountId?)           : Observable<TransactionPageDTO>
    ├── create(input: TransactionInput)                                                       : Observable<TransactionDTO>
    ├── update(id: string, input: TransactionInput)                                           : Observable<TransactionDTO>
    ├── categorize(id: string, categoryId: string | null)                                     : Observable<TransactionDTO>
    └── delete(id: string)                                                                    : Observable<TransactionDTO>
```

---

### dashboard.service.ts [service]

```
dashboard.service.ts
├── funcao/ Busca dados agregados para o DashboardComponent — contas e transações com saldo via Apollo
├── dependencias/
│   └── Apollo
└── metodos/
    ├── getAccounts(userId: string)          : Observable<AccountDTO[]>
    └── getTransactionsWithBalance()         : Observable<TransactionListWithBalanceDTO>
```

---

### integrations.service.ts [service]

```
integrations.service.ts
├── funcao/ Operações de integração financeira via Apollo — CRUD, connect token Pluggy, sincronização e reconexão de link expirado
├── dependencias/
│   └── Apollo
├── atributos/
│   └── integrationLinked$ : Subject<void>   [emite quando nova integração é vinculada — componentes podem observar]
└── metodos/
    ├── list()                                        : Observable<FinancialIntegrationDTO[]>
    ├── findById(id: string)                          : Observable<FinancialIntegrationDTO>
    ├── listAccountsByIntegration(id: string)         : Observable<AccountDTO[]>
    ├── createConnectToken()                          : Observable<string>
    ├── createConnectTokenForItem(itemId: string)     : Observable<string>
    ├── accountsFromPluggy(integrationId: string)     : Observable<PluggyAccountDTO[]>
    ├── create(itemId: string)                        : Observable<FinancialIntegrationDTO>
    ├── syncTransactions(integrationId: string)       : Observable<boolean>
    ├── reconnect(integrationId: string)              : Observable<FinancialIntegrationDTO>
    └── delete(id: string)                            : Observable<FinancialIntegrationDTO>
```

---

## SHARED — COMPONENTS

---

### header.component.ts [component]

```
header.component.ts
├── funcao/ Barra de navegação principal — exibe links autenticados, avatar com iniciais, toggle de tema, toggle de idioma e menu de logout
├── dependencias/
│   ├── AuthService
│   ├── ThemeService
│   └── I18nService
├── atributos/
│   ├── isAuthenticated  : () => boolean
│   ├── userName         : Signal<string>
│   ├── userInitials     : Signal<string>   [computed]
│   ├── currentTheme     : Signal<'light' | 'dark'>
│   ├── themeIcon        : Signal<string>   [computed]
│   ├── themeTooltip     : Signal<string>   [computed]
│   ├── currentLang      : Signal<string>
│   └── currentLangLabel : Signal<string>   [computed]
└── metodos/
    ├── toggleTheme() : void
    ├── toggleLang()  : void
    └── logout()      : void
```

---

### loading-spinner.component.ts [component]

```
loading-spinner.component.ts
├── funcao/ Spinner de carregamento reutilizável — exibido por qualquer componente durante operações assíncronas
```

---

### confirm-dialog.component.ts [component]

```
confirm-dialog.component.ts
├── funcao/ Modal genérico de confirmação — recebe título e mensagem via MAT_DIALOG_DATA, retorna boolean ao fechar
├── dependencias/
│   ├── MatDialogRef<ConfirmDialogComponent>
│   └── MAT_DIALOG_DATA   [ConfirmDialogData: { title, message }]
```

---

### splash-screen.component.ts [component]

```
splash-screen.component.ts
├── funcao/ Tela de splash exibida por ~2.3s na inicialização — respeita prefers-reduced-motion; emite done quando concluída
├── implements/
│   └── OnInit
├── outputs/
│   └── done : OutputEmitterRef<void>
└── metodos/
    └── ngOnInit() : void
```

---

## FEATURES — AUTH

---

### login.component.ts [component]

```
login.component.ts
├── funcao/ Formulário de login — valida email/senha, chama AuthService.login(), redireciona para returnUrl ou /dashboard
├── dependencias/
│   ├── FormBuilder
│   ├── AuthService
│   ├── Router
│   └── ActivatedRoute
├── atributos/
│   ├── loading      : Signal<boolean>
│   ├── hidePassword : Signal<boolean>
│   └── loginForm    : FormGroup   [email: required/email, password: required]
└── metodos/
    └── onSubmit() : void
```

---

### register.component.ts [component]

```
register.component.ts
├── funcao/ Formulário de registro — cria usuário com Role.USER e faz auto-login após registro
├── dependencias/
│   ├── FormBuilder
│   └── AuthService
├── atributos/
│   ├── loading       : Signal<boolean>
│   ├── hidePassword  : Signal<boolean>
│   └── registerForm  : FormGroup   [name, email, password]
└── metodos/
    └── onSubmit() : void
```

---

## FEATURES — ACCOUNTS

---

### account-list.component.ts [component]

```
account-list.component.ts
├── funcao/ Lista contas do usuário com saldo — classe de cor por saldo positivo/negativo, deleção com confirmação
├── dependencias/
│   ├── AuthService
│   ├── AccountsService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── accounts : Signal<AccountDTO[]>
│   └── loading  : Signal<boolean>
└── metodos/
    ├── ngOnInit()                                  : void
    ├── confirmDelete(account: AccountDTO)           : void
    └── getBalanceClass(balance: string)             : string
```

---

### account-form.component.ts [component]

```
account-form.component.ts
├── funcao/ Formulário reutilizado para criação e edição de conta — detecta modo edit pelo routeParam
├── implements/
│   └── OnInit
├── dependencias/
│   ├── FormBuilder
│   ├── Router
│   ├── ActivatedRoute
│   ├── AuthService
│   ├── AccountsService
│   ├── NotificationService
│   └── TranslateService
├── atributos/
│   ├── loading      : Signal<boolean>
│   ├── loadingData  : Signal<boolean>
│   ├── isEditMode   : Signal<boolean>
│   └── accountForm  : FormGroup   [accountName, institution, description]
└── metodos/
    ├── ngOnInit()  : void
    └── onSubmit()  : void
```

---

## FEATURES — CATEGORIES

---

### category-list.component.ts [component]

```
category-list.component.ts
├── funcao/ CRUD de categorias inline — criação, edição e deleção sem navegação; formulários colapsáveis em linha
├── implements/
│   └── OnInit
├── dependencias/
│   ├── FormBuilder
│   ├── AuthService
│   ├── CategoriesService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── categories         : Signal<CategoryDTO[]>
│   ├── loading            : Signal<boolean>
│   ├── showForm           : Signal<boolean>
│   ├── saving             : Signal<boolean>
│   ├── editingCategoryId  : Signal<string | null>
│   ├── editSaving         : Signal<boolean>
│   ├── categoryForm       : FormGroup   [name: required]
│   └── editForm           : FormGroup   [name: required]
└── metodos/
    ├── ngOnInit()                               : void
    ├── toggleForm()                             : void
    ├── onSubmit()                               : void
    ├── startEdit(category: CategoryDTO)         : void
    ├── cancelEdit()                             : void
    ├── onEditSubmit()                           : void
    └── confirmDelete(category: CategoryDTO)     : void
```

---

## FEATURES — TRANSACTIONS

---

### transaction-list.component.ts [component]

```
transaction-list.component.ts
├── funcao/ Lista transações com paginação server-side, filtros por conta/data/tipo/categoria e categorização inline
├── implements/
│   └── OnInit
├── dependencias/
│   ├── FormBuilder
│   ├── AuthService
│   ├── TransactionsService
│   ├── AccountsService
│   ├── CategoriesService
│   ├── NotificationService
│   ├── TranslateService
│   └── ActivatedRoute
├── atributos/
│   ├── transactions      : Signal<TransactionDTO[]>
│   ├── accounts          : Signal<AccountDTO[]>
│   ├── categories        : Signal<CategoryDTO[]>
│   ├── balance           : Signal<string>
│   ├── loading           : Signal<boolean>
│   ├── selectedAccountId : Signal<string>
│   ├── pageIndex         : Signal<number>
│   ├── pageSize          : Signal<number>
│   ├── totalElements     : Signal<number>
│   └── filterForm        : FormGroup   [startDate, endDate, type, categoryIds]
└── metodos/
    ├── ngOnInit()                                           : void
    ├── onAccountFilter(accountId: string)                   : void
    ├── loadPaginated()                                      : void
    ├── onPageChange(event: PageEvent)                       : void
    ├── applyFilters()                                       : void
    ├── clearFilters()                                       : void
    ├── onCategorize(transactionId: string, categoryId: string) : void
    ├── getCategoryName(categoryId?: string)                 : string
    ├── getTypeClass(type: string)                           : string
    ├── truncate(text: string, limit?: number)               : string
    └── getBalanceClass(balance: string)                     : string
```

---

### transaction-form.component.ts [component]

```
transaction-form.component.ts
├── funcao/ Formulário reutilizado para criação e edição de transação — inclui validação de data (não futura) e botão de deleção no modo edit
├── implements/
│   └── OnInit
├── dependencias/
│   ├── FormBuilder
│   ├── Router
│   ├── ActivatedRoute
│   ├── AuthService
│   ├── TransactionsService
│   ├── AccountsService
│   ├── CategoriesService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── today            : string   [data de hoje para validação]
│   ├── loading          : Signal<boolean>
│   ├── loadingData      : Signal<boolean>
│   ├── isEditMode       : Signal<boolean>
│   ├── accounts         : Signal<AccountDTO[]>
│   ├── categories       : Signal<CategoryDTO[]>
│   ├── selectedType     : Signal<string>
│   └── transactionForm  : FormGroup   [amount, type, description, source, destination, transactionDate, accountId, categoryId]
└── metodos/
    ├── ngOnInit()  : void
    ├── onSubmit()  : void
    └── onDelete()  : void
```

---

## FEATURES — INTEGRATIONS

---

### integration-list.component.ts [component]

```
integration-list.component.ts
├── funcao/ Lista integrações financeiras Pluggy/Belvo — cria via dialog multi-step, reconecta link expirado e deleta com confirmação
├── implements/
│   ├── OnInit
│   └── OnDestroy
├── dependencias/
│   ├── IntegrationsService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── integrations  : Signal<FinancialIntegrationDTO[]>
│   ├── loading       : Signal<boolean>
│   └── reconnecting  : Signal<string | null>   [id da integração sendo reconectada]
└── metodos/
    ├── ngOnInit()                                             : void
    ├── ngOnDestroy()                                          : void
    ├── isOutdated(integration: FinancialIntegrationDTO)       : boolean
    ├── openCreateDialog()                                     : void
    ├── reconnect(integration: FinancialIntegrationDTO)        : void
    └── confirmDelete(integration: FinancialIntegrationDTO)    : void
```

---

### create-integration-dialog.component.ts [component]

```
create-integration-dialog.component.ts
├── funcao/ Dialog multi-step de criação de integração — Step 1: gera connect token e abre Pluggy widget; Step 2: exibe contas disponíveis e vincula as selecionadas
├── implements/
│   └── AfterViewInit
├── dependencias/
│   ├── IntegrationsService
│   ├── AccountsService
│   ├── NotificationService
│   ├── TranslateService
│   ├── MatDialog
│   ├── MatDialogRef<CreateIntegrationDialogComponent>
│   └── MAT_DIALOG_DATA   [CreateIntegrationDialogData]
├── atributos/
│   ├── stepper          : MatStepper
│   ├── loading          : Signal<boolean>
│   ├── linking          : Signal<boolean>
│   ├── connectToken     : Signal<string | null>
│   ├── itemId           : Signal<string | null>
│   ├── integration      : Signal<FinancialIntegrationDTO | null>
│   ├── pluggyAccounts   : Signal<PluggyAccountDTO[]>
│   ├── selectedAccounts : Signal<Set<string>>
│   └── isStep2          : boolean
└── metodos/
    ├── ngAfterViewInit()              : void
    ├── openPluggyWidget()             : void
    ├── toggleAccount(accountId: string) : void
    ├── isSelected(accountId: string)  : boolean
    └── linkSelectedAccounts()         : void
```

---

## FEATURES — DASHBOARD

---

### dashboard.component.ts [component]

```
dashboard.component.ts
├── funcao/ Dashboard principal — exibe resumo de contas, saldo total, transações recentes e delega 10 gráficos de análise para componentes filhos de chart
├── implements/
│   └── OnInit
├── dependencias/
│   ├── AuthService
│   ├── DashboardService
│   └── CategoriesService
├── atributos/
│   ├── userName            : Signal<string>
│   ├── accounts            : Signal<AccountDTO[]>
│   ├── recentTransactions  : Signal<TransactionDTO[]>
│   ├── allTransactions     : Signal<TransactionDTO[]>
│   ├── categories          : Signal<CategoryDTO[]>
│   ├── totalBalance        : Signal<string>
│   └── loading             : Signal<boolean>
└── metodos/
    ├── ngOnInit()                           : void
    ├── getBalanceClass(balance: string)     : string
    ├── getTypeClass(type: string)           : string
    └── truncate(text: string, limit?: number) : string
```

---

### balance-by-account-chart.component.ts [component]

```
balance-by-account-chart.component.ts
├── funcao/ Gráfico de barras com saldo por conta — vermelho para negativos, verde para positivos
├── inputs/
│   └── accounts : AccountDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'bar'>[]>
│   └── chartOptions : ChartOptions<'bar'>
```

---

### balance-evolution-chart.component.ts [component]

```
balance-evolution-chart.component.ts
├── funcao/ Gráfico de linha com evolução acumulada do saldo por data
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'line'>[]>
│   └── chartOptions : ChartOptions<'line'>
```

---

### daily-avg-spending-chart.component.ts [component]

```
daily-avg-spending-chart.component.ts
├── funcao/ Gráfico de barras com média diária de despesas por mês
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'bar'>[]>
│   └── chartOptions : ChartOptions<'bar'>
```

---

### expense-by-category-chart.component.ts [component]

```
expense-by-category-chart.component.ts
├── funcao/ Gráfico de rosca (doughnut) com despesas agrupadas por categoria
├── inputs/
│   ├── transactions : TransactionDTO[]
│   └── categories   : CategoryDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'doughnut'>[]>
│   └── chartOptions : ChartOptions<'doughnut'>
```

---

### income-by-category-chart.component.ts [component]

```
income-by-category-chart.component.ts
├── funcao/ Gráfico de rosca com receitas agrupadas por categoria
├── inputs/
│   ├── transactions : TransactionDTO[]
│   └── categories   : CategoryDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'doughnut'>[]>
│   └── chartOptions : ChartOptions<'doughnut'>
```

---

### income-expense-chart.component.ts [component]

```
income-expense-chart.component.ts
├── funcao/ Gráfico de barras agrupadas com receitas vs despesas por mês
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'bar'>[]>
│   └── chartOptions : ChartOptions<'bar'>
```

---

### inflow-outflow-ratio-chart.component.ts [component]

```
inflow-outflow-ratio-chart.component.ts
├── funcao/ Gráfico de rosca com proporção entradas vs saídas — exibe percentual e classe de cor (positivo/negativo)
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : string[]
│   ├── chartData    : Signal<ChartDataset<'doughnut'>[]>
│   ├── chartOptions : ChartOptions<'doughnut'>
│   ├── ratioText    : Signal<string>
│   ├── ratioClass   : Signal<string>
│   └── hasData      : Signal<boolean>
```

---

### month-comparison-chart.component.ts [component]

```
month-comparison-chart.component.ts
├── funcao/ Gráfico de barras comparando mês atual vs mês anterior — exibe "sem dados" se não houver transações
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : string[]
│   ├── chartData    : Signal<ChartDataset<'bar'>[]>
│   ├── chartOptions : ChartOptions<'bar'>
│   └── hasData      : Signal<boolean>
```

---

### monthly-cash-flow-chart.component.ts [component]

```
monthly-cash-flow-chart.component.ts
├── funcao/ Gráfico de linha com fluxo de caixa líquido (INFLOW - OUTFLOW) por mês
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : Signal<string[]>
│   ├── chartData    : Signal<ChartDataset<'line'>[]>
│   └── chartOptions : ChartOptions<'line'>
```

---

### transactions-by-weekday-chart.component.ts [component]

```
transactions-by-weekday-chart.component.ts
├── funcao/ Gráfico de barras com total de despesas por dia da semana — exibe "sem dados" se não houver transações
├── inputs/
│   └── transactions : TransactionDTO[]
├── atributos/
│   ├── chartLabels  : string[]
│   ├── chartData    : Signal<ChartDataset<'bar'>[]>
│   ├── chartOptions : ChartOptions<'bar'>
│   └── hasData      : Signal<boolean>
```

---

## FEATURES — PROFILE

---

### profile.component.ts [component]

```
profile.component.ts
├── funcao/ Tela de perfil — permite atualizar nome e senha e deletar conta; usa Apollo diretamente para mutations de usuário
├── implements/
│   └── OnInit
├── dependencias/
│   ├── FormBuilder
│   ├── AuthService
│   ├── Apollo   [direto — mutations UPDATE_USER e DELETE_USER]
│   ├── NotificationService
│   ├── StorageService
│   ├── MatDialog
│   ├── TranslateService
│   └── Router
├── atributos/
│   ├── loadingUpdate  : Signal<boolean>
│   ├── loadingDelete  : Signal<boolean>
│   ├── hidePassword   : Signal<boolean>
│   ├── profileForm    : FormGroup   [name, password]
│   └── currentEmail   : string   [getter de AuthService.currentUser]
└── metodos/
    ├── ngOnInit()        : void
    ├── onSubmit()        : void
    └── onDeleteAccount() : void
```

---

## APP ROOT

---

### app.ts [component]

```
app.ts
├── funcao/ Componente raiz — gerencia splash screen inicial e renderiza o layout principal com router-outlet após splash concluir
├── atributos/
│   └── showSplash : Signal<boolean>
└── metodos/
    └── onSplashDone() : void
```
