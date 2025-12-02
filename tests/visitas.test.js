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

describe("CRUD - VISITAS", () => {

  test("Listar visitas", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, visitante: "Carlos", idoso: "Maria" }]
    ]);

    const res = await agent.get("/visitas");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Carlos");
  });

  test("Criar visita", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await agent.post("/visitas/novo").send({
      visitante: "Jose",
      idoso: "Maria",
      data_visita: "2025-01-01",
      horario: "10:00",
      observacoes: "Primeira visita"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/visitas");
  });

  test("Editar visita", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, visitante: "Carlos" }]
    ]);

    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.post("/visitas/editar/1").send({
      visitante: "Carlos Atualizado",
      idoso: "Ana",
      data_visita: "2025-02-02",
      horario: "14:00",
      observacoes: "Atualizado"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/visitas");
  });

  test("Excluir visita", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.get("/visitas/excluir/1");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/visitas");
  });

});
