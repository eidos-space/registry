# Contributing

## Submit a Plugin

1. Publish a public GitHub Release containing `<id>-<version>.eidos-plugin`.
2. Add the release to `plugins.registry.json` with its exact version, tag, asset filename, SHA-256, compatibility note, and one category:
   - `data-visualization`
   - `knowledge-and-writing`
   - `productivity`
   - `automation`
   - `integrations`
   - `developer-tools`
   - `themes` (standalone Eidos Lite theme plugins only)
   - `other`
3. Open a pull request.

Published plugins have no preview or stable channel. Describe experimental behavior in the plugin README. Keep `preview: false` as an internal compatibility field for older Lite releases.

## Submit a Theme

1. Create a theme plugin with `kind: "theme"`, Plugin API `1.6.0`, and a light/dark `theme.stylesheet` in `plugin.json`. The package contains no executable code or permissions.
2. Pack it as `<id>-<version>.eidos-plugin` and publish that exact file in a public GitHub Release.
3. Add it to `plugins.registry.json` with `kind: "theme"`, `category: "themes"`, release asset, SHA-256, and a Lite compatibility note, then submit a PR.

Old Desktop `themes.registry.json` entries and the repository-root `theme.css` format are not accepted.

## Submit an Extension

1. Create an extension repository
2. Add to `extensions.registry.json`
3. Submit PR

## Guidelines

- Use kebab-case IDs
- Use semantic versioning
- Repository must be public
