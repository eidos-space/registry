# Eidos Registry

This repository is the source of truth for the Eidos community plugin catalog.
It contains registry data, JSON schemas, and submission validation.

The community website is maintained and deployed independently from
[eidos-space/community](https://github.com/eidos-space/community).
It reads the public registry at runtime and caches successful responses for
10 minutes. Catalog updates do not require a website build or deployment.

## Eidos Lite plugins

`plugins.registry.json` is the official Marketplace catalog for Eidos Lite and `eidos serve`. It lists executable plugins and standalone Eidos Lite theme plugins. The old Desktop theme catalog is retired; themes use the same versioned `.eidos-plugin` package and checksum flow as other plugins.

To submit a plugin, publish a public GitHub Release containing `<id>-<version>.eidos-plugin`, then open a PR adding its entry. Include its category, exact version, tag, asset filename, SHA-256 of the uploaded bytes, a short description and a compatibility note. Optional icons contain SVG path data in a 24×24 viewBox, never markup or remote images. Optional screenshots reference PNG, JPEG, or WebP files in the plugin repository and include useful alt text; the marketplace resolves them from the repository's `main` branch.

Published plugins do not have preview or stable channels. Authors should document experimental behavior and known limitations in their README. Keep `preview: false` in each registry entry while older Lite releases still require this internal compatibility field; it does not create a public release channel.

Updates use a new release and a registry PR. Do not replace published assets: the host verifies the pinned checksum and package identity before requesting installation permission. Maintainers review ownership, compatibility and requested permissions before merging. Listing does not execute plugin code. Install once per device and enable separately in each Space.

The host fetches this catalog over HTTPS and downloads the pinned GitHub Release asset. It retains the last successful catalog for offline browsing; installing requires a fresh online catalog. There is no automatic update or npm dependency installation.

## Themes

Create a standalone theme with `kind: "theme"`, `requires.pluginApi: "1.6.0"`, and a validated `theme.stylesheet` in `plugin.json`. The stylesheet supplies light and dark semantic tokens and may bundle local fonts. Theme packages contain no executable views, actions, or grants. See the [theme development workflow](https://docs.eidos.space/plugins/workflow/#build-a-standalone-eidos-lite-theme) and the `theme` starter in `@eidos.space/plugin-tools`.

Publish `<id>-<version>.eidos-plugin` as a GitHub Release asset, then add an entry to `plugins.registry.json` using `kind: "theme"` and `category: "themes"`:

```json
{
  "kind": "theme",
  "id": "example.slate-theme",
  "name": "Slate",
  "description": "A quiet light and dark theme with bundled fonts.",
  "category": "themes",
  "repo": "owner/slate-theme",
  "version": "1.0.0",
  "tag": "v1.0.0",
  "asset": "example.slate-theme-1.0.0.eidos-plugin",
  "sha256": "<64 lowercase hex characters>",
  "preview": false,
  "compatibility": "Requires Eidos Lite with Plugin API 1.6.0 or later. Not supported by eidos serve."
}
```

Icons and screenshots use the same optional fields as other plugin entries. The theme package itself defines both light and dark styles; registry entries do not use the old `modes`, `author`, or root-level `theme.css` fields. Installation does not activate a theme. Users select an installed theme explicitly in Eidos Lite, and that selection applies across Spaces.

## Screenshots

Plugins and themes can declare showcase images displayed in the Community marketplace and Eidos Lite catalog:

```json
"screenshots": [
  {
    "path": "screenshots/overview.png",
    "alt": "Interactive view overview"
  }
]
```

### Guidelines for Screenshots

- **Path**: Relative path in the plugin's GitHub repository on the `main` branch (e.g., `screenshots/overview.png`).
- **Formats**: PNG, JPEG, or WebP. Keep files optimized (recommended < 800 KB per image).
- **Aspect ratio**: 16:10 (e.g. 1280×800) or 16:9 (e.g. 1280×720 / 1920×1080) for consistent presentation.
- **Quantity**: 1 to 8 images.
- **For plugins**: Showcase real-world interactive views, editors, or automated results.
- **For themes**: Include both Light and Dark mode appearances (e.g., `screenshots/light.png` and `screenshots/dark.png`) to show palette and typography contrast.


