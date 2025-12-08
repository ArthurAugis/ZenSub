import { db } from "@/lib/db";

async function main() {
  console.log("Cleaning database...");

  try {
    await db.verificationToken.deleteMany();
    console.log("VerificationTokens deleted");

    await db.session.deleteMany();
    console.log("Sessions deleted");

    await db.account.deleteMany();
    console.log("Accounts deleted");

    await db.user.deleteMany();
    console.log("Users deleted");

    await db.subscription.deleteMany();
    console.log("Subscriptions deleted");

    await db.category.deleteMany();
    console.log("Categories deleted");

    console.log("Database successfully cleaned!");
  } catch (error) {
    console.error("Error cleaning database:", error);
  }
}

main();
