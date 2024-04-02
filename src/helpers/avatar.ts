export function getFirstLetterOfLastWord(fullName: string | undefined) {
  if (!fullName) {
    return "U";
  }

  const words = fullName.split(" ");
  if (words.length === 0) {
    return "U";
  }

  const lastWord = words[words.length - 1];
  const firstLetter = lastWord.charAt(0);

  return firstLetter.toUpperCase();
}

export function hashString(str: string) {
  let hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
}

export function getAvatarColor(fullName: string | undefined) {
  const hashedValue = hashString(fullName || "User");
  const color = `#${(hashedValue & 0x00ffffff).toString(16).toUpperCase()}`;
  return color;
}
