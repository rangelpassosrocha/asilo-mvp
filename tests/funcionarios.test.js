const request = require("supertest");
const app = require("../server");
jest.mock("../db");
const db = require("../db");

const agent = request.agent(app);

beforeEach(async () => {
  db.query.mockReset();

  db.query.mockResolvedValueOnce([
    [{ id: 1, nome: "Admin", email: "admin@test.com", senha: "123", tipo: "admin" }]
  ]);

  await agent.post("/login").send({ email: "admin@test.com", senha: "123" });
});

describe("CRUD - FUNCIONÁRIOS", () => {

  test("Listar funcionários", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, nome: "João" }, { id: 2, nome: "Ana" }]
    ]);

    const res = await agent.get("/funcionarios");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("João");
    expect(res.text).toContain("Ana");
  });

  test("Criar novo funcionário", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await agent.post("/funcionarios/novo").send({
      nome: "Pedro",
      cargo: "Cuidador",
      telefone: "99999-9999",
      observacoes: "Nenhuma"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/funcionarios");
  });

  test("Editar funcionário", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, nome: "João" }]
    ]);

    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.post("/funcionarios/editar/1").send({
      nome: "João Silva",
      cargo: "Cuidador",
      telefone: "98888-7777",
      observacoes: "Atualizado"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/funcionarios");
  });

  test("Excluir funcionário", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.get("/funcionarios/excluir/1");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/funcionarios");
  });

});
