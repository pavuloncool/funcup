const { getDefaultConfig } = require('expo/metro-config');

// Keep Metro config minimal to avoid dependency-specific resolver issues.
module.exports = getDefaultConfig(__dirname);

