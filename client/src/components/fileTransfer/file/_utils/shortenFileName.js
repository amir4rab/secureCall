export const shortenName = (name) => {
  if(name.length < 20) return name;
  return `${name.slice(0, 8)}...${name.slice(name.length - 8, name.length)}`;
}

export default shortenName;