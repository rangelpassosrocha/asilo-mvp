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

describe("CRUD - MEDICAÇÕES", () => {

  test("Listar medicações", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, nome: "Paracetamol" }, { id: 2, nome: "Dipirona" }]
    ]);

    const res = await agent.get("/medicacoes");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Paracetamol");
    expect(res.text).toContain("Dipirona");
  });

  test("Criar medicação", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await agent.post("/medicacoes/novo").send({
      nome: "Ibuprofeno",
      dosagem: "200mg",
      horario: "12:00",
      observacoes: "Tomar após comida"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/medicacoes");
  });

  test("Editar medicação", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, nome: "Paracetamol" }]
    ]);

    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.post("/medicacoes/editar/1").send({
      nome: "Paracetamol 500mg",
      dosagem: "500mg",
      horario: "08:00",
      observacoes: "Atualizado"
    });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/medicacoes");
  });

  test("Excluir medicação", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await agent.get("/medicacoes/excluir/1");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/medicacoes");
  });

});
