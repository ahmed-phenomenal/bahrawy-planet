export const EMPLOYEE_ROLES: string[] = [
  "Cashier",
  "Sales Assistant",
  "Stock Keeper",
  "Store Manager",
];

export type PublicEmployee = {
  id: number;
  loginId: string;
  name: string;
  role: string;
  phone: string;
  createdAt: string;
  hasOwnPassword: boolean;
};