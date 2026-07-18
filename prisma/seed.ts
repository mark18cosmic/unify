import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const GAMES = [
  { title: "EA Sports FC 25", priceMvr: 1250, genre: "Sports", stock: 12, featured: true,
    coverImage: "https://image.api.playstation.com/vulcan/ap/rnd/202406/2618/8e2d3b7b1d0e2e2a.png",
    description: "The world's game. Build your dream squad in Ultimate Team and dominate the pitch on PS5." },
  { title: "Marvel's Spider-Man 2", priceMvr: 1490, genre: "Action", stock: 7, featured: true,
    description: "Swing through New York as Peter and Miles in this stunning PS5 exclusive." },
  { title: "God of War Ragnarök", priceMvr: 1350, genre: "Action", stock: 4, featured: true,
    description: "Kratos and Atreus journey through the Nine Realms in this epic saga." },
  { title: "Call of Duty: Modern Warfare III", priceMvr: 1550, genre: "Shooter", stock: 2,
    description: "The latest Modern Warfare with a massive multiplayer and Zombies." },
  { title: "Gran Turismo 7", priceMvr: 1200, genre: "Racing", stock: 9,
    description: "The real driving simulator, remastered for PlayStation 5." },
  { title: "Hogwarts Legacy", priceMvr: 1300, genre: "RPG", stock: 0,
    description: "Live the unwritten — an open-world action RPG set in the wizarding world." },
  { title: "Elden Ring", priceMvr: 1400, genre: "RPG", stock: 5, featured: false,
    description: "A vast fantasy world by FromSoftware and George R. R. Martin." },
  { title: "NBA 2K25", priceMvr: 1250, genre: "Sports", stock: 6, condition: "Pre-owned",
    description: "Basketball at its finest. MyCareer, MyTeam and more." },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@unifygames.mv").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "unify2026";
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hash },
    create: { email, name: "UnifyGames Admin", password: hash },
  });
  console.log(`✔ Admin ready: ${email}`);

  for (const g of GAMES) {
    const slug = slugify(g.title);
    const sku = "PS5-" + slug.toUpperCase().replace(/-/g, "").slice(0, 10);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        title: g.title,
        slug,
        sku,
        description: g.description,
        priceMvr: g.priceMvr,
        genre: g.genre,
        condition: (g as { condition?: string }).condition || "New",
        coverImage: (g as { coverImage?: string }).coverImage || "",
        stock: g.stock,
        lowStockAt: 3,
        published: true,
        featured: !!g.featured,
      },
    });
  }
  console.log(`✔ Seeded ${GAMES.length} games`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
