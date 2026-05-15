import { describe, expect, it } from "vitest";
import { issueAdminToken, verifyAdminToken } from "./admin-auth";

const SECRET = "7r4pHmKb1HDcMN3g";

describe("admin-auth", () => {
  it("emite y verifica un token válido", async () => {
    const token = await issueAdminToken(SECRET);
    expect(await verifyAdminToken(token, SECRET)).toBe(true);
  });

  it("rechaza token con secret distinto (contraseña rotada)", async () => {
    const token = await issueAdminToken(SECRET);
    expect(await verifyAdminToken(token, "otra-contraseña")).toBe(false);
  });

  it("rechaza tokens manipulados", async () => {
    const token = await issueAdminToken(SECRET);
    const tampered = token.slice(0, -3) + "AAA";
    expect(await verifyAdminToken(tampered, SECRET)).toBe(false);
  });

  it("rechaza tokens sin punto separador", async () => {
    expect(await verifyAdminToken("garbage", SECRET)).toBe(false);
  });

  it("rechaza tokens vencidos", async () => {
    const expired = "1.AAAA";
    expect(await verifyAdminToken(expired, SECRET)).toBe(false);
  });

  it("rechaza cookie ausente", async () => {
    expect(await verifyAdminToken(undefined, SECRET)).toBe(false);
  });
});
