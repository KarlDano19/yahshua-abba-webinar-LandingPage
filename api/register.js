import pkg from "@googleapis/sheets";
const { google } = pkg;

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") return res.status(405).end();

  const {
    type, firstName, lastName, email,
    company, companyRole, role, teamSize, challenge
  } = req.body;

  // ── 1. WRITE TO GOOGLE SHEETS ────────────────────────
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || "").split("\\n").join("\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
          type === "w" ? "webinar" : "assessment",
          firstName || "",
          lastName || "",
          email || "",
          company || companyRole || "",
          role || "",
          teamSize || "",
          challenge || "",
          "landing page",
        ]],
      },
    });
  } catch (sheetErr) {
    console.error("Google Sheets error:", sheetErr.message);
    // Don't return error — still try to send the email
  }

  // ── 2. SEND LOOPS CONFIRMATION EMAIL ─────────────────
  try {
    const transactionalId = type === "w"
      ? process.env.LOOPS_WEBINAR_ID
      : process.env.LOOPS_ASSESSMENT_ID;

    await fetch("https://app.loops.so/api/v1/transactional", {
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
  } catch (loopsErr) {
    console.error("Loops error:", loopsErr.message);
  }

  // ── 3. RESPOND TO THE FORM ───────────────────────────
  res.status(200).json({ ok: true });
}
