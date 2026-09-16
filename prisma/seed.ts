import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEAM_MEMBERS = [
  { name: "Raphael N. Lewis", title: "President / Director", sortOrder: 1 },
  { name: "Leroyal Chieves", title: "Treasurer / Director", sortOrder: 2 },
  { name: "Sasha-Gaye Wallace Kelman", title: "Secretary / Director", sortOrder: 3 },
  { name: "DeAris Henry", title: "Vice President", sortOrder: 4 },
];

async function main() {
  for (const member of TEAM_MEMBERS) {
    await prisma.teamMember.upsert({
      where: { id: member.name.toLowerCase().replace(/[^a-z]/g, "-") },
      update: { title: member.title, sortOrder: member.sortOrder },
      create: {
        id: member.name.toLowerCase().replace(/[^a-z]/g, "-"),
        name: member.name,
        title: member.title,
        sortOrder: member.sortOrder,
      },
    });
  }

  console.log(`Seeded ${TEAM_MEMBERS.length} team members.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
