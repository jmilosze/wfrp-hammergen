const invertObj = (obj) => Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export { invertObj };
