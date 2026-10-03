// Learn more: https://docs.expo.dev/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// The app reuses the website's data and utilities (../src/data, ../src/utils)
// so school content and sample records have a single source of truth.
config.watchFolders = [path.resolve(__dirname, '../src')];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

module.exports = config;
