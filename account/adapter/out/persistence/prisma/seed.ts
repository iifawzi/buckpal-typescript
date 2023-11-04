import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const accounts = await prisma.account.createMany({
    data: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  });
  console.log({ accounts });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
