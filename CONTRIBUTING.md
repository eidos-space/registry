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
   - `other`
3. Open a pull request.

Published plugins have no preview or stable channel. Describe experimental behavior in the plugin README. Keep the deprecated `preview` compatibility field set to `false` until Eidos Lite 0.16.0 is no longer supported.

## Submit a Theme

1. Create a theme repository
2. Add to `themes.registry.json`
3. Submit PR

## Submit an Extension

1. Create an extension repository
2. Add to `extensions.registry.json`
3. Submit PR

## Guidelines

- Use kebab-case IDs
- Use semantic versioning
- Repository must be public
