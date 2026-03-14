export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    type, firstName, lastName, email,
    company, companyRole, role, teamSize, challenge
  } = req.body;

  const timestamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
  const rowData = [
    timestamp,
    (type === "w" || type === "webinar") ? "webinar" : "assessment",
    firstName || "",
    lastName || "",
    email || "",
    company || companyRole || "",
    role || "",
    teamSize || "",
    challenge || "",
    "landing page",
  ];

  // ── 1. GET GOOGLE ACCESS TOKEN ──────────────────────────────
  async function getGoogleToken() {
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";

    // Handle both \\n (escaped) and \n (real) in the key
    const privateKey = rawKey.split("\\n").join("\n");


    const now = Math.floor(Date.now() / 1000);

    // Build JWT header + payload
    const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({
      iss: serviceEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })).toString("base64url");

    // Sign with private key using Node's built-in crypto
    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(`${header}.${payload}`);
    const signature = sign.sign(, "base64url");

    const jwt = `${header}.${payload}.${signature}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    const tokenData = await tokenRes.json();
    return tokenData.access_token;
  }

  // ── 2. WRITE TO GOOGLE SHEETS ───────────────────────────────
  try {
    const token = await getGoogleToken();
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:J:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [rowData] }),
      }
    );

    const sheetsData = await sheetsRes.json();

    if (!sheetsRes.ok) {
      console.error("Google Sheets error:", JSON.stringify(sheetsData));
    } else {
      console.log("Google Sheets: row added successfully");
    }
  } catch (err) {
    console.error("Google Sheets error:", err.message);
  }

  // ── 3. SEND LOOPS EMAIL ─────────────────────────────────────
  try {
    const transactionalId = (type === "w" || type === "webinar")
      ? process.env.LOOPS_WEBINAR_ID
      : process.env.LOOPS_ASSESSMENT_ID;
    console.log("Loops ID being used:", transactionalId);
    console.log("Type received:", type);

    const loopsRes = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        transactionalId,
        email,
        addToAudience: true,
        dataVariables: { firstName: firstName || "there" },
      }),
    });

    const loopsData = await loopsRes.json();

    if (!loopsRes.ok) {
      console.error("Loops error:", JSON.stringify(loopsData));
    } else {
      console.log("Loops: email sent successfully");
    }
  } catch (err) {
    console.error("Loops error:", err.message);
  }

  // ── 4. RESPOND ──────────────────────────────────────────────
  res.status(200).json({ ok: true });
}
