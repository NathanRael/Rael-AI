const pathnameRegex : RegExp = /([a-z0-9]+)\/([a-z0-9]+)/i;
const path = "settings/admin";

const match = path.match(pathnameRegex)


console.log(match![2]);