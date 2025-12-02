const express = require("express");
const session = require("express-session");
const path = require("path");
const db = require("./db");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "segredo123",
    resave: false,
    saveUninitialized: true
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));

// Middleware para verificar login
function checarLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect("/login");
  next();
}

// Middleware admin
function checarAdmin(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== "admin") {
    return res.status(403).send("Acesso negado. Apenas administradores.");
  }
  next();
}

// ROTA HOME
app.get("/", (req, res) => {
  res.render("index", { usuario: req.session.usuario });
});

// ROTA LOGIN
app.get("/login", (req, res) => {
  res.render("login", { erro: null, usuario: null });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email
    ]);

    if (rows.length === 0) {
      return res.render("login", {
        erro: "Usuário ou senha inválidos.",
        usuario: null
      });
    }

    const usuario = rows[0];

    if (usuario.senha !== senha) {
      return res.render("login", {
        erro: "Usuário ou senha inválidos.",
        usuario: null
      });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("login", { erro: "Erro ao fazer login.", usuario: null });
  }
});

// DASHBOARD
app.get("/dashboard", checarLogin, (req, res) => {
  res.render("dashboard", {
    usuario: req.session.usuario,
    total_idosos: 0,
    total_funcionarios: 0,
    total_medicacoes: 0,
    total_visitas: 0
  });
});

// LISTAR IDOSOS
app.get("/idosos", checarLogin, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM idosos ORDER BY nome ASC");

  res.render("idosos_lista", {
    usuario: req.session.usuario,
    idosos: rows
  });
});

// FORM NOVO IDOSO
app.get("/idosos/novo", checarLogin, (req, res) => {
  res.render("idosos_novo", { usuario: req.session.usuario });
});

// SALVAR NOVO IDOSO
app.post("/idosos/novo", checarLogin, async (req, res) => {
  const { nome, data_nascimento, quarto, observacoes } = req.body;

  await db.query(
    "INSERT INTO idosos (nome, data_nascimento, quarto, observacoes) VALUES (?,?,?,?)",
    [nome, data_nascimento, quarto, observacoes]
  );

  res.redirect("/idosos");
});

// FORM EDITAR IDOSO
app.get("/idosos/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM idosos WHERE id = ?", [id]);

  res.render("idosos_editar", {
    usuario: req.session.usuario,
    idoso: rows[0]
  });
});

// SALVAR EDIÇÃO IDOSO
app.post("/idosos/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, quarto, observacoes } = req.body;

  await db.query(
    "UPDATE idosos SET nome=?, data_nascimento=?, quarto=?, observacoes=? WHERE id=?",
    [nome, data_nascimento, quarto, observacoes, id]
  );

  res.redirect("/idosos");
});

// EXCLUIR IDOSO
app.get("/idosos/excluir/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM idosos WHERE id = ?", [id]);

  res.redirect("/idosos");
});

// FUNCIONARIOS
app.get("/funcionarios", checarLogin, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM funcionarios ORDER BY nome ASC");

  res.render("funcionarios_lista", {
    usuario: req.session.usuario,
    funcionarios: rows
  });
});

app.get("/funcionarios/novo", checarLogin, (req, res) => {
  res.render("funcionarios_novo", { usuario: req.session.usuario });
});

app.post("/funcionarios/novo", checarLogin, async (req, res) => {
  const { nome, cargo, telefone, observacoes } = req.body;

  await db.query(
    "INSERT INTO funcionarios (nome, cargo, telefone, observacoes) VALUES (?,?,?,?)",
    [nome, cargo, telefone, observacoes]
  );

  res.redirect("/funcionarios");
});

app.get("/funcionarios/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM funcionarios WHERE id = ?", [id]);

  res.render("funcionarios_editar", {
    usuario: req.session.usuario,
    funcionario: rows[0]
  });
});

app.post("/funcionarios/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, telefone, observacoes } = req.body;

  await db.query(
    "UPDATE funcionarios SET nome=?, cargo=?, telefone=?, observacoes=? WHERE id=?",
    [nome, cargo, telefone, observacoes, id]
  );

  res.redirect("/funcionarios");
});

app.get("/funcionarios/excluir/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM funcionarios WHERE id = ?", [id]);

  res.redirect("/funcionarios");
});

// MEDICAÇÕES
app.get("/medicacoes", checarLogin, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM medicacoes ORDER BY nome ASC");

  res.render("medicacoes_lista", {
    usuario: req.session.usuario,
    medicacoes: rows
  });
});

app.get("/medicacoes/novo", checarLogin, (req, res) => {
  res.render("medicacoes_novo", { usuario: req.session.usuario });
});

app.post("/medicacoes/novo", checarLogin, async (req, res) => {
  const { nome, dosagem, horario, observacoes } = req.body;

  await db.query(
    "INSERT INTO medicacoes (nome, dosagem, horario, observacoes) VALUES (?,?,?,?)",
    [nome, dosagem, horario, observacoes]
  );

  res.redirect("/medicacoes");
});

app.get("/medicacoes/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM medicacoes WHERE id = ?", [id]);

  res.render("medicacoes_editar", {
    usuario: req.session.usuario,
    medicacao: rows[0]
  });
});

app.post("/medicacoes/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;
  const { nome, dosagem, horario, observacoes } = req.body;

  await db.query(
    "UPDATE medicacoes SET nome=?, dosagem=?, horario=?, observacoes=? WHERE id=?",
    [nome, dosagem, horario, observacoes, id]
  );

  res.redirect("/medicacoes");
});

app.get("/medicacoes/excluir/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM medicacoes WHERE id = ?", [id]);

  res.redirect("/medicacoes");
});

// VISITAS
app.get("/visitas", checarLogin, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM visitas ORDER BY data_visita DESC");

  res.render("visitas_lista", {
    usuario: req.session.usuario,
    visitas: rows
  });
});

app.get("/visitas/novo", checarLogin, (req, res) => {
  res.render("visitas_novo", { usuario: req.session.usuario });
});

app.post("/visitas/novo", checarLogin, async (req, res) => {
  const { visitante, idoso, data_visita, horario, observacoes } = req.body;

  await db.query(
    "INSERT INTO visitas (visitante, idoso, data_visita, horario, observacoes) VALUES (?,?,?,?,?)",
    [visitante, idoso, data_visita, horario, observacoes]
  );

  res.redirect("/visitas");
});

app.get("/visitas/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM visitas WHERE id = ?", [id]);

  res.render("visitas_editar", {
    usuario: req.session.usuario,
    visita: rows[0]
  });
});

app.post("/visitas/editar/:id", checarLogin, async (req, res) => {
  const { id } = req.params;
  const { visitante, idoso, data_visita, horario, observacoes } = req.body;

  await db.query(
    "UPDATE visitas SET visitante=?, idoso=?, data_visita=?, horario=?, observacoes=? WHERE id=?",
    [visitante, idoso, data_visita, horario, observacoes, id]
  );

  res.redirect("/visitas");
});

app.get("/visitas/excluir/:id", checarLogin, async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM visitas WHERE id = ?", [id]);

  res.redirect("/visitas");
});

// USUÁRIOS ADMIN
app.get("/usuarios", checarLogin, checarAdmin, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM usuarios ORDER BY nome ASC");

  res.render("usuarios_lista", {
    usuario: req.session.usuario,
    usuarios: rows
  });
});

app.get("/usuarios/novo", checarLogin, checarAdmin, (req, res) => {
  res.render("usuarios_novo", { usuario: req.session.usuario });
});

app.post("/usuarios/novos", checarLogin, checarAdmin, async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  await db.query(
    "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?,?,?,?)",
    [nome, email, senha, tipo]
  );

  res.redirect("/usuarios");
});

app.get("/usuarios/editar/:id", checarLogin, checarAdmin, async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);

  res.render("usuarios_editar", {
    usuario: req.session.usuario,
    usuarioEd: rows[0]
  });
});

app.post("/usuarios/editar/:id", checarLogin, checarAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo } = req.body;

  if (senha && senha.trim() !== "") {
    await db.query(
      "UPDATE usuarios SET nome=?, email=?, senha=?, tipo=? WHERE id=?",
      [nome, email, senha, tipo, id]
    );
  } else {
    await db.query(
      "UPDATE usuarios SET nome=?, email=?, tipo=? WHERE id=?",
      [nome, email, tipo, id]
    );
  }

  res.redirect("/usuarios");
});

app.get("/usuarios/excluir/:id", checarLogin, checarAdmin, async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

  res.redirect("/usuarios");
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// INICIALIZAÇÃO DO SERVIDOR (necessário para testes)
if (require.main === module) {
  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
}

module.exports = app;
