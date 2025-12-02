const request = require("supertest");
const app = require("../server");
jest.mock("../db");

const db = require("../db");

describe("Testes de login", () => {

  test("Deve exibir a página de login (GET /login)", async () => {
    const res = await request(app).get("/login");

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("login");
  });

  test("Deve falhar login quando usuário não existe", async () => {
    db.query.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post("/login")
      .send({ email: "naoexiste@test.com", senha: "123" });

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Usuário ou senha inválidos.");
  });

  test("Deve logar corretamente e redirecionar para /dashboard", async () => {
    db.query.mockResolvedValueOnce([
      [
        {
          id: 1,
          nome: "Admin",
          email: "admin@test.com",
          senha: "123",
          tipo: "admin"
        }
      ]
    ]);

    const res = await request(app)
      .post("/login")
      .send({ email: "admin@test.com", senha: "123" });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/dashboard");
  });

  test("Deve bloquear acesso ao /dashboard sem login", async () => {
    const res = await request(app).get("/dashboard");

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/login");
  });

});
