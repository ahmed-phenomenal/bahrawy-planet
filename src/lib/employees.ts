import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { employees as seedEmployees } from "@/data/adminData";
import type { PublicEmployee } from "@/lib/employeeTypes";

export type StoredEmployee = {
  id: number;
  loginId: string;
  name: string;
  role: string;
  phone: string;
  passwordHash: string | null; // null = still uses the temporary shared password
  createdAt: string;
};

type Db = { nextId: number; employees: StoredEmployee[] };

const FILE = path.join(process.cwd(), "storage", "employees.json");

// Employee 1 -> 11000, 2 -> 11001, ...
const loginIdFor = (id: number) => String(10999 + id);

async function save(db: Db) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

async function load(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Db;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;

    const db: Db = {
      nextId: seedEmployees.length + 1,
      employees: seedEmployees.map((e) => ({
        id: e.id,
        loginId: loginIdFor(e.id),
        name: e.name,
        role: e.role,
        phone: "",
        passwordHash: null,
        createdAt: new Date().toISOString(),
      })),
    };
    await save(db);
    return db;
  }
}

const toPublic = (e: StoredEmployee): PublicEmployee => ({
  id: e.id,
  loginId: e.loginId,
  name: e.name,
  role: e.role,
  phone: e.phone,
  createdAt: e.createdAt,
  hasOwnPassword: e.passwordHash !== null,
});

// ---------- Passwords ----------
// Letters and digits that are easy to read (no I, O, l, 0, 1)
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";

// 8 characters: at least one capital, one small letter and one number
export function generatePassword() {
  const pick = (set: string) => set[crypto.randomInt(set.length)];
  const all = UPPER + LOWER + DIGITS;
  const chars = [pick(UPPER), pick(LOWER), pick(DIGITS)];
  while (chars.length < 8) chars.push(pick(all));

  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(password, salt, expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

// ---------- Queries ----------
export async function listEmployees(): Promise<PublicEmployee[]> {
  const db = await load();
  return db.employees.map(toPublic);
}

export async function findAccount(loginId: string) {
  const db = await load();
  return db.employees.find((e) => e.loginId === loginId);
}

export async function addEmployee(input: {
  name: string;
  role: string;
  phone: string;
}) {
  const db = await load();
  const id = db.nextId;
  const password = generatePassword();

  const employee: StoredEmployee = {
    id,
    loginId: loginIdFor(id),
    name: input.name,
    role: input.role,
    phone: input.phone,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  db.nextId = id + 1;
  db.employees.push(employee);
  await save(db);

  return { employee: toPublic(employee), password };
}

export async function resetPassword(id: number) {
  const db = await load();
  const employee = db.employees.find((e) => e.id === id);
  if (!employee) return null;

  const password = generatePassword();
  employee.passwordHash = hashPassword(password);
  await save(db);

  return { employee: toPublic(employee), password };
}

export async function deleteEmployee(id: number) {
  const db = await load();
  const before = db.employees.length;
  db.employees = db.employees.filter((e) => e.id !== id);
  if (db.employees.length === before) return false;
  await save(db);
  return true;
}