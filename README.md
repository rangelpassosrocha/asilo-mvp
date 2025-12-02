# 🏥 Asilo MVP – Sistema de Gestão

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

## 📌 Funcionalidades

### 🔐 **Autenticação**
- Login por email e senha  
- Controle de sessão com `express-session`  
- Middleware de proteção:  
  - `checarLogin` → protege rotas  
  - `checarAdmin` → acesso restrito a administradores  

---

### 👵 **Módulo de Idosos**
- Listar idosos  
- Cadastrar novo idoso  
- Editar informações  
- Excluir  

### 👨‍⚕️ **Módulo de Funcionários**
- Listar funcionários  
- Cadastrar  
- Editar  
- Excluir  

### 💊 **Módulo de Medicações**
- Listagem  
- Cadastro  
- Edição  
- Exclusão  

### 👨‍👩‍👧 **Módulo de Visitas**
- Listagem  
- Cadastro  
- Edição  
- Exclusão  

### 👤 **Módulo de Usuários (Admin)**
- Apenas admin acessa  
- Cadastro  
- Edição  
- Exclusão  
- Listagem  

---

## 🛠 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **EJS**
- **Express EJS Layouts**
- **MySQL (mysql2)**
- **Express Session**
- **Jest** (testes)
- **Supertest** (testes de rotas)

---

## 📂 Estrutura do Projeto

