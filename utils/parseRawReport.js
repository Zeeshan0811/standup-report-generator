
export function parseRawReport(input, dateFromUser) {
  const lines = input.split('\n');
  const result = {};
  let currentPerson = '';
  let currentSection = '';
  let extractedDate = '';

  for (let line of lines) {
    line = line.trimEnd();
    const dateMatch = line.match(/(\d{2})[-/](\d{2})[-/](\d{4})/);
    if (dateMatch && !extractedDate) {
      extractedDate = `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`;
    }
    if (line.match(/^Today at/) || line === '' || line.includes('edited')) continue;
    if (/^[A-Za-z].*/.test(line) && !line.startsWith('->') && !line.includes('->') && !line.includes(':')) {
      currentPerson = line;
      result[currentPerson] = [];
      currentSection = '';
      continue;
    }
    if (line.endsWith(':')) {
      currentSection = line;
      result[currentPerson].push(`${currentSection}`);
      continue;
    }
    if (line.startsWith('->')) {
      result[currentPerson].push(`${line}`);
    }
  }

  const date = dateFromUser || extractedDate || new Date().toLocaleDateString('en-GB');
  const formatted = [`Stand Up Report [BBS]`, `${date}`, `@Kengo Otsuka san the stand-up report for today\n`];
  Object.keys(result).forEach(name => {
    formatted.push(`@${name}`);
    formatted.push(...result[name]);
  });

  return formatted.join('\n');
}
