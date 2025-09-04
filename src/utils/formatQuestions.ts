export const formatQuestion = (raw: string) => {
  try {
    const clean = raw.trim().replace("```json", "").replace("```", "").trim();
    // clean = clean.replace(/([^\\])\n/g, "$1\\n");
    if (clean.startsWith("{") && clean.endsWith("}")) {
      const parsed = JSON.parse(clean);
      return parsed.question;
    }
    return clean;
  } catch (err) {
    console.error("Failed to format question:", err, raw);
    return "";
  }
};
