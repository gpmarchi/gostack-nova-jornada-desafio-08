<h3 align="center">
  Desafio 08: Relacionamentos com banco de dados no Node.js
</h3>

## :rocket: Sobre o desafio

Nesse desafio, foi criada uma nova aplicação para praticar o que foi aprendido sobre Node.js junto ao TypeScript, incluindo o uso de banco de dados com o TypeORM e relacionamentos ManyToMany.

Essa é uma aplicação que deve permite a criação de clientes, produtos e pedidos, onde o cliente pode gerar novos pedidos de compra para derterminados produtos como em um pequeno e-commerce.

## Instalação

Para instalar o projeto localmente na sua máquina basta clonar o repositório:

```bash
git clone https://github.com/gpmarchi/gostack-nova-jornada-desafio-08.git && cd gostack-nova-jornada-desafio-08
```

E rodar o comando abaixo para instalar as dependências necessárias:

```bash
yarn
```

## Rotas da aplicação

Abaixo estão as rotas da aplicação e o que cada uma faz:

- **`POST /customers`**: A rota recebe `name` e `email` dentro do corpo da requisição, sendo o `name` o nome do cliente a ser cadastrado. Ao cadastrar um novo cliente, ele é armazenado dentro do banco de dados e o cliente criado é retornado. Ao efetivar o cadastro no banco de dados na tabela `customers`, são criados os campos `name`, `email`, `created_at`, `updated_at`.

- **`POST /products`**: A rota recebe `name`, `price` e `quantity` dentro do corpo da requisição, sendo o `name` o nome do produto a ser cadastrado, `price` o valor unitário e `quantity` a quantidade existente em estoque do produto. Com esses dados são criados no banco de dados na tabela `products` novos produtos com os campos `name`, `price`, `quantity`, `created_at`, `updated_at`.

- **`POST /orders`**: Nessa rota é recebido do corpo da requisição o `customer_id` e um array de `products`, contendo em cada um o `id` e a `quantity` que se deseja adicionar a um novo pedido. É cadastrado então na tabela `orders` um novo pedido que será relacionado ao `customer_id` informado além das colunas `created_at` e `updated_at`. Também serão salvos na tabela `order_products` os dados dos produtos relacionados com o pedido, contendo as colunas `product_id`, `order_id`, `price`, `quantity`, `created_at` e `updated_at`.

Abaixo seguem exemplos da requisição e resposta deste método, respectivamente:

```json
{
  "customer_id": "e26f0f2a-3ac5-4c21-bd22-671119adf4e9",
  "products": [
    {
      "id": "ce0516f3-63ae-4048-9a8a-8b6662281efe",
      "quantity": 5
    },
    {
      "id": "82612f2b-3f31-40c6-803d-c2a95ef35e7c",
      "quantity": 7
    }
  ]
}
```

```json
{
  "id": "5cbc4aa2-b3dc-43f9-b121-44c1e416fa92",
  "created_at": "2020-05-11T07:09:48.767Z",
  "updated_at": "2020-05-11T07:09:48.767Z",
  "customer": {
    "id": "e26f0f2a-3ac5-4c21-bd22-671119adf4e9",
    "name": "Rocketseat",
    "email": "oi@rocketseat.com.br",
    "created_at": "2020-05-11T06:20:28.729Z",
    "updated_at": "2020-05-11T06:20:28.729Z"
  },
  "order_products": [
    {
      "product_id": "ce0516f3-63ae-4048-9a8a-8b6662281efe",
      "price": "1400.00",
      "quantity": 5,
      "order_id": "5cbc4aa2-b3dc-43f9-b121-44c1e416fa92",
      "id": "265b6cbd-3ab9-421c-b358-c2e2b5b3b542",
      "created_at": "2020-05-11T07:09:48.767Z",
      "updated_at": "2020-05-11T07:09:48.767Z"
    },
    {
      "product_id": "82612f2b-3f31-40c6-803d-c2a95ef35e7c",
      "price": "500.00",
      "quantity": 7,
      "order_id": "5cbc4aa2-b3dc-43f9-b121-44c1e416fa92",
      "id": "ae37bcd6-7be7-47b9-b277-afee35aab4e4",
      "created_at": "2020-05-11T07:09:48.767Z",
      "updated_at": "2020-05-11T07:09:48.767Z"
    }
  ]
}
```

- **`GET /orders/:id`**: Essa rota retorna os dados de um pedido específico, com todas as informações que são recuperadas através dos relacionamentos entre as tabelas `orders`, `customers` e `orders_products`.

## Especificação dos testes

O desafio foi resolvido seguindo a técnica de TDD. Os testes podem ser encontrados na pasta ```src/__tests__``` e para executá-los rodar o comando:

```bash
yarn test
```

Para que os testes possam ser executados corretamente é necessário que exista uma base de dados local na sua máquina com o nome gostack_desafio08_tests. Para cada teste existe uma breve descrição do que a aplicação executa para que o mesmo passe.

- **`should be able to create a new customer`**: Para que esse teste passe, a aplicação permite que um cliente seja criado e retorna um json com o cliente criado.

- **`should not be able to create a customer with one e-mail thats already registered`**: Para que esse teste passe, a aplicação retorna um erro quando se tenta cadastrar um cliente com um e-mail que já está cadastrado no banco de dados.

- **`should be able to create a new product`**: Para que esse teste passe, a aplicação permite que um produto seja criado e retorna um json com o produto criado`.

- **`should not be able to create a duplicated product`**: Para que esse teste passe, a aplicação retorna um erro quando se tenta cadastrar um produto com um nome que já está cadastrado no banco de dados.

- **`should be able to create a new order`**: Para que esse teste passe, a aplicação permite que um pedido seja criado e retorna um json com todos os dados do pedido criado.

- **`should not be able to create an order with a invalid customer`**: Para que esse teste passe, a aplicação não permite a criação de um novo pedido com cliente que não exista no banco de dados, retornando um erro.

- **`should not be able to create an order with invalid products`**: Para que esse teste passe, a aplicação não permite que seja criado um novo pedido com produtos inexistentes, retornando um erro caso um ou mais dos produtos enviados não existam no banco de dados.

- **`should not be able to create an order with products with insufficient quantities`**: Para que esse teste passe, a aplicação não permite a criação de um novo pedido com produtos que não possuam quantidades disponíveis, retornando um erro caso um ou mais produtos enviados não possuam a quantidade necessária em estoque.

- **`should be able to subtract an product total quantity when it is ordered`**: Para que esse teste passe, a aplicação permite que quando um novo pedido é criado, a quantidade total dos produtos em estoque seja alterada (subtraída) baseando-se na quantidade pedida do produto.

- **`should be able to list one specific order`**: Para que esse teste passe, a aplicação permite a rota `orders/:id` retorne os dados de um pedido, contendo todas as informações do pedido com os relacionamentos de `customer` e `order_products`.
