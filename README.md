- [Requisitos](#requisitos)
- [Guia de instalação](#guia-de-instalação)
  - [Aplicações](#aplicações)
- [Arquitetura](#arquitetura)
  - [Clean Architecture e Layered Architecture](#clean-architecture-e-layered-architecture)
  - [Princípios de Design de Software](#princípios-de-design-de-software)
  - [Design Patterns](#design-patterns)
- [Domain-Driven Design](#domain-driven-design)
  - [Invariants](#invariants)
  - [Exemplo com lista de favoritos](#exemplo-com-lista-de-favoritos)
    - [Um exemplo de invariante](#um-exemplo-de-invariante)
- [Documentação](#documentação)
  - [AuthenticationApiSpec Example](#authenticationapispec-example)
- [Cross-Cutting Concerns](#cross-cutting-concerns)
    - [Logging:](#logging)
    - [Autenticação:](#autenticação)
    - [Error Handling](#error-handling)
    - [Validação](#validação)
    - [Cache - Lazy loading](#cache---lazy-loading)
    - [Testes (unitários e integração)](#testes-unitários-e-integração)
- [Problemas Conhecidos](#problemas-conhecidos)
    - [1 - DDD:](#1---ddd)
    - [2 - Autenticação e Autorização:](#2---autenticação-e-autorização)
    - [3 - Coesão e Arquitetura em Camadas](#3---coesão-e-arquitetura-em-camadas)
    - [4 - Injeção de Dependências e Contêiner de Injeção de Dependências](#4---injeção-de-dependências-e-contêiner-de-injeção-de-dependências)

## Requisitos

| Ferramenta | Versão         |
| ---------- | -------------- |
| `Node.Js`  | v22.15.0 maior |
| `Docker`   | latest         |

## Guia de instalação

Execute os comandos abaixo no terminal.

```bash
chmod +x docker-install
```

```sh
make docker-install
```

O comando acima irá:

```sh
## Configurar envs (local, dev, test)
## Instalar dependencias
## Gerar documentação com Swagger
## Iniciar containers com Docker
## Realizar migrações com Drizzle
```

### Aplicações

| Aplicação      | URL                                                       |
| -------------- | --------------------------------------------------------- |
| `app`          | [http://localhost:3000/](http://localhost:3000/)          |
| `pgAdmin 4`    | [http://localhost:5050/](http://localhost:5050/)          |
| `postgreSQL`   | [http://localhost:5432/](http://localhost:5432/)          |
| `swagger`      | [http://localhost:3000/docs/](http://localhost:3000/docs) |
| `redisinsight` | [http://localhost:5540/](http://localhost:5540/)          |
| `redis`        | [http://localhost:6379/](http://localhost:6379/)          |

## Arquitetura

- Clean Architecture
- DDD
- UseCases

### Clean Architecture e Layered Architecture

Estou usando Arquitetura Limpa e Arquitetura em Camadas seguindo esta abordagem:

![Screenshot 2025-05-20 at 14 44 36](https://github.com/user-attachments/assets/d5f4d1a1-50c3-4cda-901e-373095043dcd)

Em outras palavras:

- `Application`: É responsável por criar contratos em nível de aplicação. Suponha que precisamos acessar o usuário logado, podemos criar uma abstração `UserContext` e recuperar as informações do Express. Também é chamada de camada de orquestração entre `Domain` e `Infrastructure`.
- `Presentation`: Responsável pela comunicação entre o Usuário e a Lógica de Negócios (Casos de Uso). Não conhece detalhes sobre a Infraestrutura.
- `Domain`: Modelos que representam a Lógica de Negócios real.
- `Infrastructure`: Implementações seguindo contratos de `Application`.

![Screenshot 2025-05-20 at 14 46 23](https://github.com/user-attachments/assets/9debe559-6a04-49b4-9187-8b1d1118a711)

### Princípios de Design de Software

- SOLID.
- Separation of Concerns (SOC).
- Don't Repeat Yourself (DRY).
- You Aren't Gonna Need It (YAGNI).
- Keep It Simple, Silly (KISS).
- Composition Over Inheritance.

### Design Patterns

- Factory
- Adapter
- Dependency Injection
- Builder
- Singleton

## Domain-Driven Design

Uma abordagem de desenvolvimento de software que enfatiza a compreensão e a modelagem do domínio de negócios para criar software que se alinhe estreitamente às necessidades de negócios do mundo real.

### Invariants

Uma invariante é uma condição que nunca deve ser violada, não importa quais ações ou operações sejam executadas no sistema.

### Exemplo com lista de favoritos

Um usuário pode adicionar produtos em uma lista de favoritos.

#### Um exemplo de invariante

Com usuário:

- Usuário só poderá criar uma conta se o e-mail não estiver em uso.
- Usuário não poderá criar uma conta se a senha ou o e-mail forem inválidos.
- Usuário só poderá ter uma conta.

Com lista de favoritos:

- Lista de favoritos só poderá conter produtos únicos.
- Se um produto já estiver em uma lista, ele será removido da listagem.
- Apenas uma lista de favoritos por usuário.

## Documentação

Seguindo OpenAPI 3.0.3 com `tspec` para gerar automaticamente documentação com base em modelos de domínio.

Aqui está um exemplo:

### AuthenticationApiSpec Example

```ts
import {
  SignInParams,
  SignInResponse
} from '@/Domain/Authentication/UseCases/SignIn'
import {
  SignUpParams,
  SignUpResponse
} from '@/Domain/Authentication/UseCases/SignUp'
import { Tspec } from 'tspec'

export type AuthenticationApiSpec = Tspec.DefineApiSpec<{
  basePath: '/api/auth'
  tags: ['Authentication']
  paths: {
    '/sign-in': {
      post: {
        summary: 'Sign in with email and password'
        body: SignInParams
        responses: { 200: SignInResponse }
      }
    }
    '/sign-up': {
      post: {
        summary: 'Sign up and create a blog account'
        body: SignUpParams
        responses: { 201: SignUpResponse }
      }
    }
  }
}>
```

## Cross-Cutting Concerns

São aspectos de um sistema de software que afetam diversas partes do aplicativo e não são específicas de nenhum recurso ou lógica de negócios, mas ainda são essenciais para o comportamento geral do sistema.

#### Logging:

Este projeto utiliza [`Pino`](https://www.npmjs.com/package/pino) para registro.

Isso significa que temos um `Structured Logging` - envolve a captura de mensagens de registro em um formato padronizado, usando um esquema ou formato predefinido, como JSON ou XML.

```ts
export class SignUpUseCase implements SignUp {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher,
    private readonly encrypter: Encrypter
  ) {}

  async signUp(params: SignUpParams): Promise<SignUpResponse> {
    logger.info('Sign up proccess started with', params)

    logger.info(`Checking if email: ${params.email} is already in use`)
    const isEmailInUse = await this.userRepository.isEmailInUse(params.email)

    if (isEmailInUse) {
      logger.warn(`Email: ${params.email} is already in use`)
      throw new ConflictError(`Este email já está em uso: ${params.email}`)
    }

    logger.info(`Hashing password process started`)
    const hashedPassword = await this.hasher.hash(params.password)
    logger.info(`Hashing password process Finished`)

    logger.info(`Creating user with hashed password`)
    const user = await this.userRepository.createUser({
      ...params,
      password: hashedPassword
    })
    logger.info(`Creating user with hashed password finished`)

    logger.info(`Creating jwt process started`)
    const token = await this.encrypter.encrypt(user)

    logger.info(`Sign up process finished successfully`)

    return {
      token
    }
  }
}
```

Este exemplo produzirá em formato `JSON`:

```json
{
  "timestamp": "2023-06-22 12:34:56",
  "level": "INFO",
  "message": "User logged in",
  "user_id": "steve_rogers",
  "source": "login-service"
}
```

#### Autenticação:

Verificação da identidade do usuário e controle de acesso em diversas partes do sistema.

- Método de autenticação: E-mail e senha. Comparação de senhas.

Este método requer que a senha seja criptografada antes da criação de um usuário.

- Método de Autorização: JWT (`jsonwebtoken`) with `Cookie based` transport via HTTPS only.

#### Error Handling

Precisamos prestar atenção em duas coisas:

1. `Error Handling` refere-se à forma como o Express captura e processa erros que ocorrem de forma síncrona e assíncrona. O Express vem com um manipulador de erros padrão, então você não precisa criar o seu próprio para começar.

2. A partir do Express 5, os manipuladores de rotas e middlewares que retornam uma Promise chamarão `next(value)` automaticamente ao rejeitar ou gerar um erro. Por exemplo:

```js
app.get('/', (req, res) => {
  throw new Error('BROKEN') // Express will catch this on its own.
})
```

Este projeto utiliza uma classe abstrata que estende a classe Error do JavaScript.

Aqui está um exemplo:

```ts
export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)
  }

  abstract serializeErrors(): ResponseError[]
}
```

Dessa forma podemos criar a classe NotFoundError:

```ts
export class NotFoundError extends CustomError {
  statusCode = 404

  constructor(message: string) {
    super(message)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
```

O uso real:

```ts
export const getTicketByIdUseCase: GetTicketById = async (params) => {
  const ticket = await getTicketByIdRepository(params.id)
  if (!ticket) {
    throw new NotFoundError(`Ticket with id: ${params.id} not found`)
  }
  return ticket
}
```

#### Validação

Verificando a integridade dos dados ou restrições em vários locais. Decidi usar o Zod. Podemos usar as interfaces ZodInfer e ZodOutput para transformar diretamente a entrada em um modelo de domínio.

#### Cache - Lazy loading

Lazy loading, também conhecido como cache-aside, envolve a tentativa de ler primeiro do cache. Se as informações não estiverem no cache, isso é considerado um `cache miss` e o sistema lê do banco de dados. É chamado de "cache-aside" porque o cache fica ao lado do armazenamento de dados primário (como um banco de dados). A ideia principal é que o cache não gerencia ativamente os dados; em vez disso, o aplicativo é responsável por carregar os dados no cache quando necessário.

#### Testes (unitários e integração)

Este projeto utiliza `jest`, `supertest` e `testcontainers`. Podemos utilizar do ciclo de vida de testes do `jest` para iniciar ambientes com diferentes tipos.

Por exemplo, para testes de integração podemos automatizar os processo com `Global Setup` e assim podemos sempre iniciar o `testcontainers`.

Exemplo com `jest.integration.config.ts`

```ts
import config from './jest.config'

config.testMatch = ['**/*.test.ts']
config.globalTeardown = '<rootDir>/src/Tests/Integration/Config/Teardown.ts'
config.globalSetup = '<rootDir>/src/Tests/Integration/Config/GlobalSetup.ts'
config.coverageDirectory = './coverage/integration'

module.exports = config
```

Com testes unitários podemos ter uma configuração mais simples, envolvando apenas mocks:

```ts
it('Should call getUserByEmail with correct values', async () => {
  const { sut, userRepositoryStub } = createSut()
  const getUserByEmailSpy = jest.spyOn(userRepositoryStub, 'getUserByEmail')
  await sut.signIn(signInParamsMock)
  expect(getUserByEmailSpy).toHaveBeenCalledWith(signInParamsMock.email)
})
```

## Problemas Conhecidos

#### 1 - DDD:

- Este projeto viola a abordagem de Domínio Rico (Objetos de Valor, Entidades, Aggregate Roots, Eventos de Domínio, Serviços de Domínio). Em vez disso, decidi usar Domínio Anêmico com ênfase apenas em invariantes.

#### 2 - Autenticação e Autorização:

- Este projeto viola a abordagem de subdomínio genérico. Um subdomínio genérico é uma área do negócio que é importante para as operações, mas não oferece uma vantagem competitiva. Não devemos construir autenticação ou autorização, mas sim "buy, don't build". Alternativas como Keycloak e OAuth2 são testadas e comprovadas e seguras.

#### 3 - Coesão e Arquitetura em Camadas

- Arquitetura em Camadas pode ser bem-vinda em projetos de médio porte. Isso significa que o nível de coesão pode diminuir ao adicionar mais Casos de Uso, dificultando a leitura, a localização de módulos e regras de negócio pelos desenvolvedores. Arquitetura de Vertical pode ser uma alternativa melhor para refatoração posterior.

#### 4 - Injeção de Dependências e Contêiner de Injeção de Dependências

- Alternativas como NestJs podem ser uma opção melhor em vez de injetar dependências manualmente de forma hierárquica. Este projeto não utiliza nenhum Contêiner DI.
