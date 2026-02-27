// function normalizeSlackText(nameOrder, raw) {
//   if (!raw) return "";
//   raw = String(raw).replace(/\u00A0/g, " ");

//   const escapedNames = nameOrder
//     .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
//     .join("|");

//   // 1️⃣ Break when first name glued to text
//   const firstNames = nameOrder.map(n => n.split(" ")[0]);
//   const firstNameRegex = new RegExp(`([a-zA-Z])(${firstNames.join("|")})`, "g");
//   raw = raw.replace(firstNameRegex, "$1\n$2");

//   // 2️⃣ Break when full name appears mid sentence before [time]
//   const midSentenceNameRegex = new RegExp(
//     `(?<!@)\\s(${escapedNames})\\s*(?=\\[\\d{1,2}:\\d{2}\\s?(AM|PM)\\])`,
//     "g"
//   );
//   raw = raw.replace(midSentenceNameRegex, "\n$1 ");

//   // 3️⃣ Standard Name [time] handling
//   const nameTimeRegex = new RegExp(
//     `(?<!@)(${escapedNames})\\s*(\\[\\d{1,2}:\\d{2}\\s?(AM|PM)\\])`,
//     "g"
//   );

//   return raw
//     .replace(nameTimeRegex, "\n$1 $2")
//     .replace(/(\[\d{1,2}:\d{2}\s?(AM|PM)\])/g, "$1\n")
//     .replace(/[ \t]+/g, " ")
//     .replace(/\n{2,}/g, "\n")
//     .trim();
// }

function normalizeSlackText(nameOrder, raw) {
  if (!raw) return "";
  raw = String(raw).replace(/\u00A0/g, " ");

  const escapedNames = nameOrder
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  // Match Name [time] pattern anywhere in the text and break before the name
  const nameTimeRegex = new RegExp(
    `(${escapedNames})\\s*\\[\\d{1,2}:\\d{2}\\s?(?:AM|PM)\\]`,
    "g"
  );

  raw = raw.replace(nameTimeRegex, "\n$1");

  return raw
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}


function breakNameLines(nameOrder, input) {
  if (!input) return "";

  // Escape special regex characters in names
  const escapedNames = nameOrder
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  console.log("Escaped Names for Regex:", escapedNames);

  // Pattern to match: Name [time]
  const nameTimeRegex = new RegExp(
    `(${escapedNames})\\s*\\[\\d{1,2}:\\d{2}\\s?(?:AM|PM)\\]`,
    "g"
  );



  // Replace with newline + name (remove time)
  return input.replace(nameTimeRegex, "\n$1");
}

export function parseMarkdownReport(type, nameOrder, input, date) {
  // const nameOrder = name_list.name_list;
  // console.log("name_list:", nameOrder);

  // const nameOrder = [
  //   "Shafin Junayed",
  //   "Shad",
  //   "Shahriar Ahmed Shawon",
  //   "Nafis Nawal Nahiyan",
  //   "Satadip",
  //   "Naznin",
  //   "David",
  //   "Zeeshan",
  //   "Muhiminul ( Apon )",
  //   "Safwan",
  //   "Jalish Mahmud",
  //   "Anisur Rahman (Shahin)",
  //   "Amin",
  //   "Farhan Mullick"
  // ];

  console.log("Original Input:\n", nameOrder);

  input = normalizeSlackText(nameOrder, input);
  input = breakNameLines(nameOrder, input);
  const lines = input.trim().split("\n");

  console.log("Normalized Input:\n", lines);

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
    let trimmedLine = line.trim();

    // Skip lines that are timestamps, empty, or contain only emojis/numbers
    if (
      unwantedLineRegex.test(trimmedLine) ||                                                                                           // Skip time lines like "Today at 9:10 AM"
      line.includes(':headphones:') ||
      line.match(/^Today at/) || line.match(/^Just now/) || line.match(/^ Just now/) || line === '' || line == 'New' ||     // Ignore timestamps
      // line.includes('(edited)') ||                                                                                                  // Skip "(edited)" lines
      timePattern.test(trimmedLine) ||                                                                                                  // Skip time lines like "Today at 9:10 AM"
      relativeTimeRegex.test(trimmedLine) ||
      dateRegex.test(trimmedLine) ||
      emojiWithTimeRegex.test(trimmedLine) ||
      emojiOnlyRegex.test(trimmedLine) ||
      numberOnlyRegex.test(trimmedLine)) {
      return;
    }

    // line.includes('edited')

    // console.log(`Processing line: ${trimmedLine}`);

    // trimmedLine = line.includes('(edited)') ? line.replace('(edited)', '').trim() : line;

    trimmedLine = trimmedLine.replace('(edited)', '').trim();       // Remove "(edited)" if present

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

  if (type === "bbs") {
    var result = `*Stand Up Report [BBS]*\n*${reportDate}*\n\n*@Kengo Otsuka San*,\n*@Yusei Kumoi San,*\n\n*The stand-up report for today*\n\n`;
  } else if (type === "bbs-cms") {
    var result = `*Stand Up Report [BBS-CMS]*\n*${reportDate}*\n\n*@Kengo Otsuka San*,*\n\n*The stand-up report for today*\n\n`;
  } else {
    var result = `*Stand Up Report*\n*${reportDate}*\n\n*@Kengo Otsuka San*,\n*@Yusei Kumoi San,*\n\n*The stand-up report for today*\n\n`;
  }

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
