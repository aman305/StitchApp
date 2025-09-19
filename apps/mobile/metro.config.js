const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// Get the default Expo Metro config
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,

  // Watch folders - include root node_modules and potentially packages
  watchFolders: [
    path.resolve(__dirname, "../../node_modules"),
    path.resolve(__dirname, "../../packages"), // If you have shared packages
  ],

  resolver: {
    ...defaultConfig.resolver,

    // File extensions Metro should resolve
    sourceExts: ["tsx", "ts", "js", "jsx", "json", "cjs", "css"],

    // Custom resolver to handle @swc/helpers properly
    resolverMainFields: ["react-native", "browser", "main"],

    // Help Metro find modules in the root node_modules
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          // First try the app's node_modules, then root
          const appNodeModules = path.join(__dirname, "node_modules", name);
          const rootNodeModules = path.join(
            __dirname,
            "../../node_modules",
            name
          );

          if (require("fs").existsSync(appNodeModules)) {
            return appNodeModules;
          }
          return rootNodeModules;
        },
      }
    ),

    // Ensure Metro can resolve modules from monorepo packages
    platforms: ["ios", "android", "native", "web"],

    // Custom resolution for problematic packages
    alias: {
      '@swc/helpers/cjs/_class_private_field_get.cjs': path.resolve(__dirname, 'node_modules/@swc/helpers/cjs/_class_private_field_get.cjs'),
      '@swc/helpers/cjs/_class_private_field_init.cjs': path.resolve(__dirname, 'node_modules/@swc/helpers/cjs/_class_private_field_init.cjs'),
      '@swc/helpers/cjs/_class_private_field_set.cjs': path.resolve(__dirname, 'node_modules/@swc/helpers/cjs/_class_private_field_set.cjs'),
    }
  },

  // Transform configuration
  transformer: {
    ...defaultConfig.transformer,
    // Enable Hermes for better performance
    hermesCommand:
      "../../node_modules/react-native/sdks/hermesc/%OS-BIN%/hermesc",
  },
};