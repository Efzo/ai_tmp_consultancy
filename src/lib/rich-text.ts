const allowedTags = new Set(["a", "b", "blockquote", "br", "div", "em", "font", "h2", "h3", "h4", "i", "li", "ol", "p", "span", "strong", "u", "ul"]);
const allowedFonts = new Set(["Arial", "Georgia", "Helvetica", "Times New Roman", "Courier New", "Verdana"]);

function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function safeStyle(rawStyle: string) {
  const declarations = rawStyle.split(";").map((declaration) => declaration.trim()).filter(Boolean);
  const safe = declarations.flatMap((declaration) => {
    const [property, ...valueParts] = declaration.split(":");
    const value = valueParts.join(":").trim();
    if (!property || !value) return [];
    const normalizedProperty = property.trim().toLowerCase();
    if (normalizedProperty === "text-align" && /^(left|center|right|justify)$/i.test(value)) return [`text-align: ${value.toLowerCase()}`];
    if (normalizedProperty === "font-family" && allowedFonts.has(value.replace(/^['"]|['"]$/g, ""))) return [`font-family: ${value}`];
    return [];
  });
  return safe.join("; ");
}

export function sanitizeRichText(input: string) {
  const withoutDangerousBlocks = input.replace(/<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  return withoutDangerousBlocks.replace(/<\s*(\/?)\s*([a-z0-9]+)([^>]*)>/gi, (match, closing: string, rawTag: string, rawAttributes: string) => {
    const tag = rawTag.toLowerCase();
    if (!allowedTags.has(tag)) return "";
    if (closing) return tag === "font" ? "</span>" : `</${tag}>`;
    if (tag === "br") return "<br />";

    if (tag === "a") {
      const href = rawAttributes.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
      if (!/^(https?:|mailto:|tel:)/i.test(href)) return "<a>";
      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">`;
    }

    if (tag === "font") {
      const face = rawAttributes.match(/face\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
      return allowedFonts.has(face) ? `<span style="font-family: ${escapeAttribute(face)}">` : "<span>";
    }

    const style = rawAttributes.match(/style\s*=\s*["']([^"']*)["']/i)?.[1];
    const safe = style ? safeStyle(style) : "";
    return safe ? `<${tag} style="${escapeAttribute(safe)}">` : `<${tag}>`;
  });
}
