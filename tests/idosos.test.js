const request = require("supertest");
const app = require("../server");
jest.mock("../db");
const db = require("../db");

// Sessão simulada (usuário logado)
const agent = request.agent(app);

beforeEach(async () => {
  db.query.mockReset();

  // Simula login antes dos testes
  db.query.mockResolvedValueOnce([
    [{ id: 1, nome: "Admin", email: "admin@test.com", senha: "123", tipo: "admin" }]
  ]);

  await agent.post("/login").send({ email: "admin@test.com", senha: "123" });
});

describe("CRUD - IDOSOS", () => {

  test("Listar idosos", async () => {
    db.query.mockResolvedValueOnce([
      [ { id: 1, nome: "José" }, { id: 2, nome: "Maria" } ]
    ]);

    const res = await agent.get("/idosos");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("José");
    expect(res.text).toContain("Maria");
  });

  test("Criar novo idoso", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await agent.post("/idosos/novo").send({
      nome: "Carlos",
      data_nascimento: "1950-01-01",
      quarto: "101",
      observacoes: "N/A"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/idosos");
  });

  test("Editar idoso", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, nome: "José" }]
    ]);

    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.post("/idosos/editar/1").send({
      nome: "José Alterado",
      data_nascimento: "1950-01-01",
      quarto: "101",
      observacoes: "Atualizado"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/idosos");
  });

  test("Excluir idoso", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.get("/idosos/excluir/1");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/idosos");
  });

});
