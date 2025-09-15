export const getRandomColorFromString = (text: string) => {
  const colors = [
    "#02b83d", // main green accent (đậm hơn)
    "#33b693", // teal pastel
    "#5C3AD6", // purple
    "#3A5EFF", // blue neon
    "#FF5470", // pink neon
    "#FFD400", // yellow neon
    "#28CFC1", // aqua
    "#8B40B5", // dark purple
    "#00AFFF", // deep sky blue
    "#FF714D", // coral accent
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;

  return colors[hash];
};

export const getGradientFromString = (text: string) => {
  const colors = [
    "#02b83d", // main green accent
    "#33b693", // teal pastel
    "#5C3AD6", // purple
    "#3A5EFF", // blue neon
    "#FF5470", // pink neon
    "#FFD400", // yellow neon
    "#28CFC1", // aqua
    "#8B40B5", // dark purple
    "#00AFFF", // deep sky blue
    "#FF714D", // coral accent
  ];

  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash1 = char + ((hash1 << 5) - hash1);
    hash2 = char + ((hash2 << 7) - hash2);
    hash1 = hash1 & hash1;
    hash2 = hash2 & hash2;
  }

  const color1 = colors[Math.abs(hash1) % colors.length];
  const color2 = colors[Math.abs(hash2) % colors.length];

  return `linear-gradient(135deg, ${color1}, ${color2})`;
};
