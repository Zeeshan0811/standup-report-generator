function normalizeSlackText(raw) {
  return raw
    // Put newline BEFORE every "Name  [time]"
    .replace(/([A-Za-z().\s]+)\s+\[\d{1,2}:\d{2}\s?(AM|PM)\]/g, "\n$1 [$2")

    // Put newline AFTER time block
    .replace(/\[(\d{1,2}:\d{2}\s?(AM|PM))\]/g, "[$1]\n")

    // Put newline BEFORE arrows if missing
    .replace(/(->)/g, "\n$1")

    // Remove accidental double spaces
    .replace(/[ \t]+/g, " ")

    // Clean multiple newlines
    .replace(/\n{2,}/g, "\n")
    .trim();
}



export function parseMarkdownReport(input, date) {
  input = normalizeSlackText(input);

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
    "Muhiminul ( Apon )",
    "Safwan",
    "Jalish Mahmud",
    "Anisur Rahman (Shahin)",
    "Amin"
  ];

  const userData = [];
  const userNoData = [];
  let currentUser = null;

  const unwantedLineRegex = /^(\d+\s+(minutes?|replies?)\s+ago|Yesterday|Today|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|\d{1,2}-\d{1,2}-\d{4}|Jul\s\d{1,2}(st|nd|rd|th)?\s+at\s+\d{1,2}:\d{2}\s+(AM|PM)|:\w+:)$/i;

  const timePattern = /^Today at \d{1,2}:\d{2} (AM|PM)$/i;

  // Exclude relative time
  const relativeTimeRegex = /^(Yesterday|Today|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|\d{1,2} (minutes?|hours?) ago)/i;

  // Exclude timestamp formats like 'Jul 17th at 9:06 AM' or '17-07-2025'
  const dateRegex = /^((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}(st|nd|rd|th)? at \d{1,2}:\d{2} (AM|PM)|\d{2}-\d{2}-\d{4})$/i;

  // Skip Slack-style emoji + time (e.g., ":headphones: 8:58 AM")
  const emojiWithTimeRegex = /^:[a-zA-Z0-9_+-]+:\s+\d{1,2}:\d{2}\s?(?:AM|PM)$/;

  // Exclude emoji-only lines
  const emojiOnlyRegex = /^(:[^:\s]+:|\p{Emoji})+$/u;

  // Skip "Just now"
  // const justNowRegex = /^Just now$/i;

  // Exclude number-only lines
  const numberOnlyRegex = /^\d+$/;

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Skip lines that are timestamps, empty, or contain only emojis/numbers
    if (
      unwantedLineRegex.test(trimmedLine) ||                                                                                           // Skip time lines like "Today at 9:10 AM"
      line.includes(':headphones:') ||
      line.match(/^Today at/) || line.match(/^Just now/) || line.match(/^ Just now/) || line === '' || line.includes('edited') || line == 'New' ||     // Ignore timestamps
      timePattern.test(trimmedLine) ||                                                                                                  // Skip time lines like "Today at 9:10 AM"
      relativeTimeRegex.test(trimmedLine) ||
      dateRegex.test(trimmedLine) ||
      emojiWithTimeRegex.test(trimmedLine) ||
      emojiOnlyRegex.test(trimmedLine) ||
      numberOnlyRegex.test(trimmedLine)) {
      return;
    }

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

  // let result = `Stand Up Report [BBS]\n${reportDate}\n\n@Kengo Otsuka san, The stand-up report for today\n\n`;
  let result = `*Stand Up Report [BBS]*\n*${reportDate}*\n\n*@Kengo Otsuka San*,\n*@Yusei Kumoi San,*\n\n*The stand-up report for today*\n\n`;

  nameOrder.forEach((name) => {
    let name_to_array = name.split(" ");
    let first_name = name_to_array[0];

    if (userData[name]) {
      result += `@${first_name}\n`;
      result += "```\n";
      userData[name].forEach((task) => {
        result += `${task}\n`;
      });
      result += "```\n";
      result += `\n`;
    } else {
      userNoData.push(name);
      // result += `No updates\n`;
    }

  });

  // return result.trim();
  return {
    nameOrder: nameOrder,
    userNoData: userNoData,
    markdown: result.trim()
  };

}
