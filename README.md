# Asilo MVP – Sistema de Gestão

Um sistema completo para gerenciamento de um asilo, incluindo controle de:

- Idosos
- Funcionários
- Medicações
- Visitas
- Usuários (com controle de administrador)
- Autenticação com sessões
- Painel inicial (Dashboard)
- Testes automatizados com Jest + Supertest

Projeto desenvolvido com **Node.js + Express + EJS + MySQL**.

---

## Funcionalidades

### **Autenticação**
- Login por email e senha  
- Controle de sessão com `express-session`  
- Middleware de proteção:  
  - `checarLogin` → protege rotas  
  - `checarAdmin` → acesso restrito a administradores  

---

### **Módulo de Idosos**
- Listar idosos  
- Cadastrar novo idoso  
- Editar informações  
- Excluir  

### **Módulo de Funcionários**
- Listar funcionários  
- Cadastrar  
- Editar  
- Excluir  

### **Módulo de Medicações**
- Listagem  
- Cadastro  
- Edição  
- Exclusão  

### **Módulo de Visitas**
- Listagem  
- Cadastro  
- Edição  
- Exclusão  

###  **Módulo de Usuários (Admin)**
- Apenas admin acessa  
- Cadastro  
- Edição  
- Exclusão  
- Listagem  

---

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **EJS**
- **Express EJS Layouts**
- **MySQL (mysql2)**
- **Express Session**
- **Jest** (testes)
- **Supertest** (testes de rotas)

---

## Estrutura do Projeto

asilo-mvp/
│
├── server.js # Servidor principal
├── db.js # Conexão com o MySQL
├── package.json
│
├── views/ # Arquivos EJS (interfaces)
│ ├── layout.ejs
│ ├── index.ejs
│ ├── login.ejs
│ ├── dashboard.ejs
│ ├── idosos_lista.ejs
│ ├── idosos_novo.ejs
│ ├── idosos_editar.ejs
│ ├── funcionarios_lista.ejs
│ ├── funcionarios_novo.ejs
│ ├── funcionarios_editar.ejs
│ ├── medicacoes_lista.ejs
│ ├── medicacoes_novo.ejs
│ ├── medicacoes_editar.ejs
│ ├── visitas_lista.ejs
│ ├── visitas_novo.ejs
│ ├── visitas_editar.ejs
│ ├── usuarios_lista.ejs
│ ├── usuarios_novo.ejs
│ └── usuarios_editar.ejs
│
├── public/ # Arquivos estáticos (CSS, JS, imagens)
│ ├── css/
│ ├── js/
│ └── images/
│
├── tests/ # Testes automatizados
│ ├── server.test.js
│ ├── login.test.js
│ ├── idosos.test.js
│ ├── funcionarios.test.js
│ ├── medicacoes.test.js
│ └── visitas.test.js
│
└── mocks/ # Mock do banco de dados para testes
└── db.js
