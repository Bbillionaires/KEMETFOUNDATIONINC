import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@kemetfoundationinc.org";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "SUPERADMIN",
      profile: {
        create: {
          firstName: "Foundation",
          lastName: "Administrator",
          phone: "000-000-0000",
          city: "Jacksonville",
          state: "FL",
          zip: "32208",
          membershipStatus: "ACTIVE",
          termsAcceptedAt: new Date(),
          privacyAcceptedAt: new Date(),
        },
      },
    },
  });

  console.log(`Seeded ${TEAM_MEMBERS.length} team members.`);
  console.log(`Seeded admin account: ${adminEmail} (change the password after first login).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
