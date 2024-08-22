// Takes in an xml string, tag, and parses out the text content.
// Example input:
// xmlString: '<context>You're sitting in your Manhattan apartment, staring at your laptop screen filled with financial models and client presentations.</context>'
// tag: 'context'
// Example output:
// You're sitting in your Manhattan apartment, staring at your laptop screen filled with financial models and client presentations.

export function getContentFromXml(xmlString: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "s");
  const match = xmlString.match(regex);
  if (match?.[1]) {
    return match[1].trim();
  }
  return "";
}
