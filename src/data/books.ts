export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  price: number;
  description: string;
  details: string;
  pages: number;
  language: string;
  year: number;
  publisher: string;
  coverUrl?: string | null;
};

export const books: Book[] = [
  {
    id: "1",
    title: "The Silent Library",
    author: "Daniel Hart",
    category: "Mystery",
    rating: 4.8,
    price: 350,
    description:
      "A quiet town, a locked library, and a secret hidden between the shelves. A mystery that keeps you guessing until the very last page.",
    details:
      "When the town librarian disappears overnight, young archivist Mara Quinn is left with a ring of old keys and a catalogue that doesn't add up. Every clue leads deeper into the library's forgotten basement, where decades of buried secrets wait. Hart builds the tension slowly and carefully, mixing sharp dialogue with rich atmosphere. Readers will enjoy a puzzle that fairly plays its cards while still delivering a twist that few will see coming. A perfect read for a rainy weekend.",
    pages: 352,
    language: "English",
    year: 2023,
    publisher: "North Star Press",
  },
  {
    id: "2",
    title: "Ocean of Tomorrow",
    author: "Elena Brooks",
    category: "Science Fiction",
    rating: 4.6,
    price: 400,
    description:
      "In a future where the seas have risen, one engineer dares to build a new home beneath the waves. Hope has never felt so deep.",
    details:
      "Set in the year 2180, Ocean of Tomorrow follows engineer Lina Reyes as she leads the first team to build a city on the ocean floor. Between failing systems, political pressure, and a mysterious signal from the deep, she must decide what humanity is truly willing to sacrifice. Brooks writes science with warmth and clarity, never losing sight of the people at the center of the story. A thoughtful, fast-moving novel about resilience and the future we choose to build.",
    pages: 410,
    language: "English",
    year: 2024,
    publisher: "Horizon Books",
  },
  {
    id: "3",
    title: "Letters from the Valley",
    author: "Samuel Reed",
    category: "Historical Fiction",
    rating: 4.7,
    price: 300,
    description:
      "Told through letters between two sisters separated by war, this moving story explores love, loss, and the strength of family.",
    details:
      "Spanning five years and two very different lives, the story unfolds through the letters Ruth and Clara write to each other. One stays behind to protect the family farm while the other travels to the front as a nurse. Reed captures the small details of daily life in a time of great fear, and the result is deeply personal and quietly powerful. Fans of heartfelt historical fiction will find a story that stays with them long after the final letter.",
    pages: 296,
    language: "English",
    year: 2021,
    publisher: "Willow & Stone",
  },
  {
    id: "4",
    title: "Code & Coffee",
    author: "Priya Nair",
    category: "Technology",
    rating: 4.5,
    price: 500,
    description:
      "A friendly guide to thinking like a developer. Learn the habits, tools, and mindset behind clean and maintainable software.",
    details:
      "Code & Coffee takes the fear out of programming with short, practical chapters that you can read in a single sitting. Nair walks through problem solving, debugging, version control, and teamwork using real examples from her ten years in the industry. Each chapter ends with a small challenge to apply what you have learned. Whether you are just starting out or want to sharpen your habits, this book is a clear and encouraging companion.",
    pages: 320,
    language: "English",
    year: 2022,
    publisher: "Byte Press",
  },
  {
    id: "5",
    title: "The Last Lighthouse",
    author: "Marcus Webb",
    category: "Adventure",
    rating: 4.4,
    price: 290,
    description:
      "A stormy coast, a forgotten lighthouse, and a map that should not exist. One summer that changes everything for three friends.",
    details:
      "When three friends discover a hidden room in an abandoned lighthouse, they uncover a map that points to a treasure lost for a hundred years. As storms close in and rivals race to find it first, the friends must rely on courage and each other. Webb delivers a fast, funny, and heartfelt adventure with unforgettable characters. It is a story about friendship, growing up, and the moments that quietly shape who we become.",
    pages: 280,
    language: "English",
    year: 2020,
    publisher: "Harbor House",
  },
  {
    id: "6",
    title: "Mindful Mornings",
    author: "Aisha Khan",
    category: "Self-Help",
    rating: 4.9,
    price: 280,
    description:
      "Simple morning routines that bring calm, focus, and energy to your day. Small changes that make a big difference.",
    details:
      "Mindful Mornings offers a gentle, realistic approach to starting each day well. Khan shares short exercises in breathing, journaling, movement, and planning that fit into even the busiest schedules. Rather than demanding a perfect routine, the book helps you build habits that last. With warm stories, practical tips, and a thirty-day plan, it is an easy and uplifting guide for anyone who wants to feel more present and less rushed.",
    pages: 224,
    language: "English",
    year: 2023,
    publisher: "Bright Path",
  },
  {
    id: "7",
    title: "A Taste of Home",
    author: "Maria Gonzalez",
    category: "Cooking",
    rating: 4.7,
    price: 450,
    description:
      "Over one hundred comforting recipes passed down through generations, with stories from the kitchens that inspired them.",
    details:
      "From slow-cooked stews to fresh breads and sweet family desserts, A Taste of Home celebrates the dishes that bring people together. Each recipe includes clear steps, helpful tips, and a short story about where it came from. Gonzalez writes with warmth and humor, making even the most ambitious dishes feel approachable. Beautifully organized and full of heart, it is a cookbook you will reach for again and again.",
    pages: 368,
    language: "English",
    year: 2022,
    publisher: "Golden Spoon",
  },
  {
    id: "8",
    title: "Empire of Dust",
    author: "Thomas Ardent",
    category: "Fantasy",
    rating: 4.6,
    price: 370,
    description:
      "A fallen empire, a hidden heir, and a desert that remembers everything. The first book in a sweeping fantasy saga.",
    details:
      "Long after the great empire crumbled, young scout Kael discovers that the dust of the desert hides more than ruins. Drawn into a struggle between rival kingdoms and ancient forces, he must uncover the truth about his own past. Ardent creates a vivid world with richly drawn cultures, intricate magic, and a story full of surprising turns. Perfect for readers who love epic journeys and characters that grow with every chapter.",
    pages: 512,
    language: "English",
    year: 2024,
    publisher: "Crown & Quill",
  },
  {
    id: "9",
    title: "The Art of Saving",
    author: "Robert Chen",
    category: "Finance",
    rating: 4.3,
    price: 420,
    description:
      "Clear and practical advice on budgeting, saving, and investing, written for anyone who wants control over their money.",
    details:
      "Chen breaks down personal finance into simple steps that anyone can follow. You will learn how to build a budget that works, create an emergency fund, reduce debt, and start investing with confidence. Real-life examples and easy exercises make each idea practical, and the friendly tone keeps the numbers from feeling overwhelming. A useful starting point for anyone who wants to build a stronger financial future.",
    pages: 270,
    language: "English",
    year: 2021,
    publisher: "Clearview Books",
  },
  {
    id: "10",
    title: "Whispers of the Forest",
    author: "Lily Thornton",
    category: "Children",
    rating: 4.9,
    price: 230,
    description:
      "A gentle illustrated tale about a curious little fox who learns the secrets of the forest, one quiet whisper at a time.",
    details:
      "Little Fenn the fox wants to understand why the forest sounds different every night. Along the way he meets wise owls, shy hedgehogs, and a very sleepy bear who teach him about patience and listening. Thornton's soft, rhythmic writing makes it ideal for bedtime reading, and the story gently encourages children to notice the world around them. A calm, warm book that families will treasure.",
    pages: 48,
    language: "English",
    year: 2023,
    publisher: "Little Lantern",
  },
];

export function getBookById(id: string) {
  return books.find((book) => book.id === id);
}

export const categoryGroups = [
  {
    id: "fiction",
    label: "Fiction",
    categories: ["Mystery", "Science Fiction", "Historical Fiction", "Fantasy"],
  },
  {
    id: "adventure-kids",
    label: "Adventure & Kids",
    categories: ["Adventure", "Children"],
  },
  {
    id: "tech-business",
    label: "Tech & Business",
    categories: ["Technology", "Finance"],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    categories: ["Self-Help", "Cooking"],
  },
];