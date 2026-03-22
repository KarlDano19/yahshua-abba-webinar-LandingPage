export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    type, firstName, lastName, email,
    company, companyRole, role, teamSize, challenge
  } = req.body;

  // ── ASSESSMENT SCORED HANDLER ───────────────────────────────
  if (type === "assessment_scored") {
    const { tier, checkedCount, checks } = req.body;

    const tierEmailMap = {
      resilient:  process.env.VITE_LOOPS_ASSESSMENT_RESILIENT_ID,
      moderate:   process.env.VITE_LOOPS_ASSESSMENT_MODERATE_ID,
      elevated:   process.env.VITE_LOOPS_ASSESSMENT_ELEVATED_ID,
      critical:   process.env.VITE_LOOPS_ASSESSMENT_CRITICAL_ID,
    };
    const transactionalId = tierEmailMap[tier] || process.env.VITE_LOOPS_ASSESSMENT_CRITICAL_ID;
    const gaps = 6 - (checkedCount || 0);
    const timestamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });

    // Write to Google Sheets
    try {
      const token = await getGoogleToken();
      const sheetId = process.env.VITE_GOOGLE_SHEET_ID;
      const rowData = [
        timestamp,
        "assessment_scored",
        firstName || "",
        lastName || "",
        email || "",
        company || "",
        role || "",
        teamSize || "",
        tier || "",
        `${checkedCount}/6 confirmed — ${gaps} gap(s)`,
      ];
      await fetch(
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
    } catch (err) {
      console.error("Sheets error (assessment_scored):", err.message);
    }

    // Send tier-specific Loops email
    try {
      await fetch("https://app.loops.so/api/v1/transactional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_LOOPS_API_KEY}`,
        },
        body: JSON.stringify({
          transactionalId,
          email,
          addToAudience: true,
          dataVariables: {
            firstName: firstName || "there",
            company: company || "",
            tier: tier || "",
            checkedCount: String(checkedCount || 0),
            gaps: String(gaps),
          },
        }),
      });

      // Update Loops contact
      await fetch("https://app.loops.so/api/v1/contacts/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_LOOPS_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          source: "assessment_scored",
          firstName: firstName || "",
          lastName: lastName || "",
        }),
      });
    } catch (err) {
      console.error("Loops error (assessment_scored):", err.message);
    }

    return res.status(200).json({ ok: true });
  }
  // ── END ASSESSMENT SCORED HANDLER ───────────────────────────

  const isWebinar = type === "w" || type === "webinar";

  const timestamp = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
  const rowData = [
    timestamp,
    isWebinar ? "webinar" : "assessment",
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
    const serviceEmail = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawB64 = process.env.VITE_GOOGLE_PRIVATE_KEY_B64 || "";
    const privateKey = Buffer.from(rawB64, "base64")
      .toString("utf8")
      .replace(/\\n/g, "\n")
      .trim();

    const now = Math.floor(Date.now() / 1000);

    const header = Buffer.from(
      JSON.stringify({ alg: "RS256", typ: "JWT" })
    ).toString("base64url");

    const payload = Buffer.from(
      JSON.stringify({
        iss: serviceEmail,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      })
    ).toString("base64url");

    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(`${header}.${payload}`);
    const signature = sign.sign(privateKey, "base64url");

    const jwt = `${header}.${payload}.${signature}`;

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
    const sheetId = process.env.VITE_GOOGLE_SHEET_ID;

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

  // ── 3. SEND LOOPS EMAIL + UPDATE CONTACT ───────────────────
  try {
    const transactionalId = isWebinar
      ? process.env.VITE_LOOPS_WEBINAR_ID
      : process.env.VITE_LOOPS_ASSESSMENT_ID;

    // Send confirmation email
    const loopsRes = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VITE_LOOPS_API_KEY}`,
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
      console.error("Loops email error:", JSON.stringify(loopsData));
    } else {
      console.log("Loops: email sent successfully");
    }

    // Update contact source and properties
    const updateRes = await fetch("https://app.loops.so/api/v1/contacts/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VITE_LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        source: isWebinar ? "webinar registrant" : "assessment request",
        firstName: firstName || "",
        lastName: lastName || "",
      }),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      console.error("Loops update error:", JSON.stringify(updateData));
    } else {
      console.log("Loops: contact updated successfully");
    }

  } catch (err) {
    console.error("Loops error:", err.message);
  }

  // ── 4. RESPOND ──────────────────────────────────────────────
  res.status(200).json({ ok: true });
}
