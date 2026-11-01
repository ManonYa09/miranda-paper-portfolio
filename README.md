# Miranda — Paper Portfolio recreation

A private reference study of [Niccolò Miranda's portfolio](https://www.niccolomiranda.com/), captured on 27 October 2026. The site includes 21 routes: the complete homepage, Work, About, Legal and 17 case studies.

## Run

Requires Python 3.9 or newer. No package installation or network access is needed to run the downloaded site.

```sh
python3 scripts/build.py
python3 scripts/serve.py
```

Open http://localhost:4173. Use `--port 8080` for a different port. If Node/npm is installed, `npm run dev` and `npm run build` are convenient equivalents.

## Source organization

- `src/pages/`: complete route-specific HTML, preserved from the inspected reference.
- `src/styles/`: extracted, deduplicated reference styles and accessibility overrides.
- `src/runtime/`: named, extracted reference interaction integrations.
- `src/scripts/`: independent paper renderer, navigation controller and accessibility enhancements.
- `dist/assets/`: local fonts, images, title graphics, textures and presentation libraries.
- `scripts/build.py`: offline assembly, integration patches and network restrictions.
- `scripts/serve.py`: local preview with direct nested-route handling.
- `scripts/check.py`: route/resource/telemetry validation.
- `scripts/sync_reference.py`: explicit reference acquisition, not needed for everyday builds.
- `reference/asset-inventory.json`: original URLs, local paths, hashes and route inventory.
- `docs/REFERENCE.md`: measured design, route and section inventory.
- `docs/VERIFY.md`: verification results and known differences.
- `docs/assets-provenance.md`: asset provenance and licensing observations.

The source keeps the original Webflow layout and interaction configuration to preserve the many viewport-specific details. New behavior is isolated in small modules; there is no framework hydration or client-side router. Each page is a real HTML document, so direct URLs, refresh and browser history work naturally.

## Interaction and accessibility

The menu and gallery support keyboard activation and Escape. Focus stays within an open menu/gallery. Drag gestures do not activate project links. Scroll measurements update after fonts, images and resize. Navigation is guarded during transitions and falls back to a normal page load if the renderer fails. Reduced motion follows the OS preference; `?reduced-motion` is also available for deterministic QA.

## Attribution and differences

Visible copy, credits, social links, project destinations and original graphics remain attributed to Niccolò Miranda and their respective creators. This is a reference reproduction, not a new identity or a claim of authorship. Public availability of an asset does not establish a redistribution license; see the provenance notes before broader reuse.

The restricted original paper-curtain module is **not shipped in the build**. An independent WebGL implementation recreates a curved textured sheet with a torn edge and fold lighting using the observed two-second timing. Its precise deformation differs from the original. Original tracking code, Webflow editor and branding integrations are removed. A content-security policy restricts resource and connection requests to local assets. Original Legal page wording is retained as reference content; it does not describe tracking behavior added to this recreation.
