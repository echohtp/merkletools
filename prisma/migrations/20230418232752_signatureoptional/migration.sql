-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tree" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "treeAuthority" TEXT NOT NULL,
    "treeAddress" TEXT NOT NULL,
    "signature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tree" ("createdAt", "id", "signature", "treeAddress", "treeAuthority") SELECT "createdAt", "id", "signature", "treeAddress", "treeAuthority" FROM "Tree";
DROP TABLE "Tree";
ALTER TABLE "new_Tree" RENAME TO "Tree";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
