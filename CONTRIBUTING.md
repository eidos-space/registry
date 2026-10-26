# Contributing

## Submit a Plugin

1. Publish a public GitHub Release containing `<id>-<version>.eidos-plugin`.
2. Add the release to `plugins.registry.json` with its exact version, tag, asset filename, SHA-256, compatibility note, optional `screenshots` array (recommended 16:10 PNG/WebP under `screenshots/`), and one category:
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

## Localized plugins

Generate metadata from the exact release archive with `eidos-plugin registry`.
The optional `localization` object contains `defaultLocale`, `messages`, and the
source `name` and `description` references. Keep top-level names and descriptions
readable in the default language for older clients. Use canonical BCP 47 locale
tags and include every metadata reference in the default dictionary.

Lite and the community site choose labels using their interface language.
Format 3 README resources come from the checksum-verified release archive and
are selected as whole documents. Legacy documentation is read at its release
tag; edits to the default branch do not change published documentation.

## Submit a Theme

1. Create a theme plugin with `kind: "theme"`, Plugin API `1.6.0`, and a light/dark `theme.stylesheet` in `plugin.json`. The package contains no executable code or permissions.
2. Pack it as `<id>-<version>.eidos-plugin` and publish that exact file in a public GitHub Release.
3. Add it to `plugins.registry.json` with `kind: "theme"`, `category: "themes"`, release asset, SHA-256, a Lite compatibility note, and light/dark `screenshots`, then submit a PR.

Old Desktop `themes.registry.json` entries and the repository-root `theme.css` format are not accepted.

## Guidelines

- Use kebab-case IDs
- Use semantic versioning
- Repository must be public
