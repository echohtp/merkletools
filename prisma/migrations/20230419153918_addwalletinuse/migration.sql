-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wallet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" REAL NOT NULL DEFAULT 0,
    "selected" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Wallet" ("balance", "createdAt", "id", "privateKey", "publicKey") SELECT "balance", "createdAt", "id", "privateKey", "publicKey" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
