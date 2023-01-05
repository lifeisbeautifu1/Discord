export const uniqueUsername = (username: string, num: number) => {
  if (num < 10) return username + "#" + "0".repeat(3) + num;
  else if (num < 100) return username + "#" + "0".repeat(2) + num;
  else if (num < 1000) return username + "#" + "0" + num;
  else return username + "#" + num;
};
