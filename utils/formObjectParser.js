module.exports = (obj, name) => {
  let value = new Object();
  Object.keys(obj).forEach(entry => {
    string = entry.replace(/[^a-zA-Z0-9]/g, "");
    if (string.includes(name)) {
      string = string.replace(name, "");
      value[string] = obj[entry];
    }
  });
  return value;
};
