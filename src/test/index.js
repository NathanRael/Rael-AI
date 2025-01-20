var pathnameRegex = /([a-z0-9]+)\/([a-z0-9]+)/i;
var path = "settings/admin";
var match = path.match(pathnameRegex);
console.log(match[2]);
