import fs from "fs";

const inputFile = "disbursements.json";
const outputDir = "jsons";

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Read input JSON
const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// API secrets
const tenantId = "TENANT_ID";
const apiSecret = "API_SECRET";

async function fetchData() {
    let count = 1;
    for (const item of data) {
        const id = item.id;
        const url = `https://production.pingpayments.com/payments/api/v1/disbursements/${id}`;
        const args = {
                headers: {
                    "tenant_id": tenantId,
                    "x-api-secret": apiSecret,
                    "Content-Type": "application/json"
                }
            };
        const outputFile = `${outputDir}/${count}- ${id}.json`;
        try {
            const response = await fetch(url, args);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const body = await response.json();
            const settlements = body.settlements || [];
            fs.writeFileSync(outputFile, JSON.stringify(settlements, null, 2));
            console.log(`Saved response for ${id} → ${outputFile}`);
        } catch (err) {
            console.error(`Failed to fetch data for ${id}:`, err.message);
        }
        count++;
    }
}

fetchData();
