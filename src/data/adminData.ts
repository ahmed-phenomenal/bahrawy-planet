export const categoryNames = [
  "Mystery",
  "Science Fiction",
  "Historical Fiction",
  "Fantasy",
  "Adventure",
  "Children",
  "Technology",
  "Finance",
  "Self-Help",
  "Cooking",
];

export const categoryViews = [
  { name: "Fiction", views: 4820 },
  { name: "Tech & Business", views: 3150 },
  { name: "Lifestyle", views: 2640 },
  { name: "Adventure & Kids", views: 1980 },
];

export const employees = [
  { id: 1, name: "Omar Hassan", role: "Cashier" },
  { id: 2, name: "Sara Ali", role: "Sales Assistant" },
  { id: 3, name: "Youssef Adel", role: "Stock Keeper" },
  { id: 4, name: "Mona Ibrahim", role: "Sales Assistant" },
  { id: 5, name: "Khaled Nabil", role: "Cashier" },
  { id: 6, name: "Nour Salah", role: "Store Manager" },
];

export type AttendanceStatus = "On time" | "Late" | "Absent" | "Working";

export type AttendanceRecord = {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
};

export const attendanceDates = ["2026-11-08", "2026-11-07"];

export const attendance: AttendanceRecord[] = [
  { id: 1, employeeId: 1, date: "2026-11-08", checkIn: "08:55", checkOut: null, status: "Working" },
  { id: 2, employeeId: 2, date: "2026-11-08", checkIn: "09:20", checkOut: null, status: "Late" },
  { id: 3, employeeId: 3, date: "2026-11-08", checkIn: null, checkOut: null, status: "Absent" },
  { id: 4, employeeId: 4, date: "2026-11-08", checkIn: "08:58", checkOut: null, status: "Working" },
  { id: 5, employeeId: 5, date: "2026-11-08", checkIn: "09:00", checkOut: null, status: "Working" },
  { id: 6, employeeId: 6, date: "2026-11-08", checkIn: "08:45", checkOut: null, status: "Working" },
  { id: 7, employeeId: 1, date: "2026-11-07", checkIn: "08:50", checkOut: "17:05", status: "On time" },
  { id: 8, employeeId: 2, date: "2026-11-07", checkIn: "09:00", checkOut: "17:00", status: "On time" },
  { id: 9, employeeId: 3, date: "2026-11-07", checkIn: "09:35", checkOut: "17:10", status: "Late" },
  { id: 10, employeeId: 4, date: "2026-11-07", checkIn: "08:59", checkOut: "17:02", status: "On time" },
  { id: 11, employeeId: 5, date: "2026-11-07", checkIn: null, checkOut: null, status: "Absent" },
  { id: 12, employeeId: 6, date: "2026-11-07", checkIn: "08:40", checkOut: "18:00", status: "On time" },
];

export const weekDays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const shifts = ["Morning (9-5)", "Evening (1-9)", "Off"];

export const defaultStoreHours = weekDays.map((day) => ({
  day,
  open: "09:00",
  close: day === "Friday" ? "14:00" : "22:00",
  closed: false,
}));

export const defaultEmployeeSchedule: Record<number, string[]> = {
  1: ["Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Off", "Off"],
  2: ["Evening (1-9)", "Evening (1-9)", "Evening (1-9)", "Off", "Evening (1-9)", "Evening (1-9)", "Off"],
  3: ["Morning (9-5)", "Off", "Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Off"],
  4: ["Off", "Evening (1-9)", "Evening (1-9)", "Evening (1-9)", "Evening (1-9)", "Off", "Evening (1-9)"],
  5: ["Morning (9-5)", "Morning (9-5)", "Off", "Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Off"],
  6: ["Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Morning (9-5)", "Off", "Morning (9-5)", "Morning (9-5)"],
};

export const feedback = [
  {
    id: 1,
    name: "Ahmed Mostafa",
    rating: 5,
    date: "2026-11-07",
    message: "Great selection of books and the staff were very helpful. I found exactly what I was looking for.",
  },
  {
    id: 2,
    name: "Laila Samir",
    rating: 4,
    date: "2026-11-06",
    message: "Lovely atmosphere. I would love to see more children's books and some weekend events.",
  },
  {
    id: 3,
    name: "Karim Fathy",
    rating: 5,
    date: "2026-11-05",
    message: "Fast service and fair prices. The offer on tech books was fantastic.",
  },
  {
    id: 4,
    name: "Dina Adel",
    rating: 3,
    date: "2026-11-03",
    message: "The store is nice but one of the books I wanted was out of stock. Please restock more often.",
  },
  {
    id: 5,
    name: "Hossam Reda",
    rating: 4,
    date: "2026-11-02",
    message: "Good cooking section. A bit crowded on Fridays, though.",
  },
  {
    id: 6,
    name: "Salma Nabil",
    rating: 5,
    date: "2026-10-30",
    message: "The book event last week was wonderful. Please do more like it!",
  },
];

export const overview = {
  activeOffers: 3,
  upcomingEvents: 2,
};
export type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
};

// Units in storage and units sold for each book (matches the ids in books.ts)
export const stockData = [
  { bookId: "1", inStock: 42, sold: 58 },
  { bookId: "2", inStock: 12, sold: 44 },
  { bookId: "3", inStock: 30, sold: 71 },
  { bookId: "4", inStock: 25, sold: 36 },
  { bookId: "5", inStock: 8, sold: 63 },
  { bookId: "6", inStock: 54, sold: 82 },
  { bookId: "7", inStock: 19, sold: 40 },
  { bookId: "8", inStock: 33, sold: 55 },
  { bookId: "9", inStock: 40, sold: 31 },
  { bookId: "10", inStock: 6, sold: 90 },
];

export const initialExpenses: Expense[] = [
  { id: 1, title: "Printing - first batch", amount: 3500, date: "2026-10-05" },
  { id: 2, title: "Shipping and delivery", amount: 600, date: "2026-10-12" },
  { id: 3, title: "Packaging materials", amount: 450, date: "2026-10-20" },
];