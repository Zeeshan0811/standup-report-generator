export function parseMarkdownReport(input, date) {
  const lines = input.trim().split("\n");

  const nameOrder = [
    "Shafin Junayed",
    "Shad",
    "Shahriar Ahmed Shawon",
    "Nafis Nawal Nahiyan",
    "Satadip",
    "Naznin",
    "David",
    "Zeeshan",
    "Muhiminul ( Apon )"
  ];

  const userData = [];
  let currentUser = null;

  const timePattern = /^Today at \d{1,2}:\d{2} (AM|PM)$/i;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Ignore timestamps
    if (line.match(/^Today at/) || line === '' || line.includes('edited')) return;

    // Skip time lines like "Today at 9:10 AM"
    if (timePattern.test(trimmedLine)) return;

    // console.log(`Processing line: ${trimmedLine}`);

    const nameLineMatch = nameOrder.find((name) =>
      trimmedLine.startsWith(name)
    );
    // console.log(`nameLineMatch: ${nameLineMatch}`);

    if (nameLineMatch) {
      currentUser = nameLineMatch;
      if (!userData[currentUser]) userData[currentUser] = [];
    } else if (currentUser && trimmedLine) {
      userData[currentUser].push(trimmedLine);
    }
  });

  const reportDate = date
    ? date.split("-").reverse().join("/") // Convert YYYY-MM-DD to DD/MM/YYYY
    : "DD/MM/YYYY";

  let result = `Stand Up Report [BBS]\n${reportDate}\n@Kengo Otsuka san the stand-up report for today\n\n`;

  nameOrder.forEach((name) => {
    let name_to_array = name.split(" ");
    let first_name = name_to_array[0];
    result += `@${first_name}\n`;
    result += "```\n";
    if (userData[name]) {
      userData[name].forEach((task) => {
        result += `${task}\n`;
      });
    } else {
      result += `No updates\n`;
    }
    result += "```\n";
    result += `\n`;
  });

  return result.trim();
}
