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
    console.log("Creating Enum and Attachment Table...");
    await executeSql(`
        DO $$ BEGIN
            CREATE TYPE "AttachmentType" AS ENUM ('DELIVERABLE', 'BRIEF', 'CONTRACT', 'GENERAL');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    `);

    await executeSql(`
        CREATE TABLE IF NOT EXISTS "Attachment" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "url" TEXT NOT NULL,
            "type" "AttachmentType" NOT NULL DEFAULT 'GENERAL',
            "isClientVisible" BOOLEAN NOT NULL DEFAULT true,
            "organizationId" TEXT NOT NULL,
            "projectId" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "Attachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
            CONSTRAINT "Attachment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
    console.log("Done!");
}

main().catch(console.error);
