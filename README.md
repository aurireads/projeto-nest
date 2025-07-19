# Projeto – Cadastro de Produtos

Aplicação full‑stack de exemplo que permite cadastrar, listar, atualizar e remover produtos, calculando para cada item a primeira letra do alfabeto ausente no nome. Foi desenvolvida em duas partes:

- *Backend*: API REST com NestJS e SQLite para persistência em arquivo.  
- *Frontend*: SPA em React + Vite, consumindo a API e exibindo um formulário e uma tabela dinâmica.

---

## 🚀 Tecnologias

- *Backend*  
  - [NestJS](https://nestjs.com/) (TypeScript)  
  - [SQLite](https://www.sqlite.org/) (arquivo database.sqlite)  
- *Frontend*  
  - [Vite](https://vitejs.dev/) + React  
  - Tailwind CSS via CDN  

---

## ⚙️ Como Executar

### 1. Backend

- Abra um terminal e use:
cd backend
npm install 
npm run start:dev

A API ficará disponível em http://localhost:3001.

POST /products

GET /products

GET /products/:id

PUT /products/:id

DELETE /products/:id

### 2. Frontend

- Abra um terminal e use:

cd frontend
npm install
npm run dev

- Abra no navegador:

http://localhost:1234

## Funcionalidades

CRUD completo de produtos via API.

Validações:

Nome não vazio

Preço > 0

SKU único

Cada produto listado mostra a “primeira letra ausente” em seu nome (a‑z, ou _).

Frontend com formulário inline e tabela de 100% width, responsivo e minimalista.
