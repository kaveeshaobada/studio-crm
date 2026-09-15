const CONN_STR = "postgresql://neondb_owner:npg_bRxBdhu2NVE7@ep-icy-water-b328nd9e-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const URL = "https://ep-icy-water-b328nd9e-pooler.c-4.ap-southeast-1.aws.neon.tech/sql";

async function executeSql(query) {
    const res = await fetch(URL, {
        method: 'POST',
        headers: {
            'Neon-Connection-String': CONN_STR,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });
    const data = await res.json();
    console.log("SQL Result:", data);
}

async function main() {
    console.log("Creating ProjectNote Table...");
    await executeSql(`
        CREATE TABLE IF NOT EXISTS "ProjectNote" (
            "id" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "authorName" TEXT,
            "isPinned" BOOLEAN NOT NULL DEFAULT false,
            "organizationId" TEXT NOT NULL,
            "projectId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "ProjectNote_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "ProjectNote_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
            CONSTRAINT "ProjectNote_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
    console.log("Done creating ProjectNote table!");
}

main().catch(console.error);
