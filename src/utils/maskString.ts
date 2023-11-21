export default function maskString(str: string) {
  // Convert the string to an array of characters
  const chars = str.split("");

  // Replace characters from the fourth position onward with '*'
  for (let i = 3; i < chars.length; i++) {
    chars[i] = "*";
  }

  // Join the array back into a string
  const maskedString = chars.join("");

  return maskedString;
}
