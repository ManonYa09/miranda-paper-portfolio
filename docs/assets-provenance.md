# Public resource provenance and observed notices

Captured from <https://www.niccolomiranda.com/> on 2026-10-27. This document records source facts; it does not establish permission to reuse or publish any resource. The machine-readable source URL, local path, byte count and original SHA-256 for every downloaded file are in `reference/asset-inventory.json`.

## Reference artwork, typography and editorial content

The page HTML, images, illustrations, project title graphics, paper textures and CSS were publicly served by the reference website and its Webflow asset CDN. The downloaded files preserve the visible original author and project attribution. No separate license granting reuse of the page content or artwork was identified in the fetched resources.

Five actual font files were retrieved from the URLs declared in the source stylesheet: Canopee; Editorial New Light and Medium; Domaine Display Condensed Regular and Medium. These came from `uploads-ssl.webflow.com/5f2429f172d117fcee10e819/`. No separate font license was supplied with the downloaded WOFF2 files. Availability as a website resource is recorded separately from any permission to reuse.

## Paper curtain reference module

Source: <https://cdn.jsdelivr.net/gh/niccolomiranda/portfolio@fa29f26/paper-curtain.mjs>.

The file begins with a notice identifying Niccolo Miranda, 2021, reserving rights, restricting use/building upon its resources for personal or commercial projects, and prohibiting redistribution or republication of the resource as-is. It also states an attribution condition for free plugins built with the resource. The original notice remains in the private reference cache. This report does not interpret the scope of those provisions. The implementation owner is preparing a separate authored curtain renderer for the shipped implementation.

## Library notices observed in downloaded files

| Library | Retrieved version/source | Notice observed |
| --- | --- | --- |
| GSAP | 3.7.1, cdnjs | Header credits GreenSock (2021), reserves rights, and refers to `https://greensock.com/standard-license` or the applicable Club GreenSock agreement. |
| GSAP Draggable | 3.7.1, unpkg | Same GreenSock notice and license pointer as the core GSAP file. |
| jQuery | 3.5.1, Webflow's CloudFront distribution | Header credits JS Foundation and other contributors and points to `jquery.org/license`. |
| Locomotive Scroll | 4.1.3 JavaScript, jsDelivr | The minified JavaScript inspected did not contain a top-level library license statement. Its original bytes are archived. The CSS source URL was unversioned in the reference. |
| butter-slider | Unversioned reference import, unpkg | The bundle includes a Microsoft helper copyright and permissive helper notice. That embedded helper notice does not identify the license of the entire slider package. |
| OGL modules | 0.0.74, unpkg | Module source files were retrieved as dependencies of the reference curtain. No top-level license notice was seen in the inspected Renderer module. |
| dat.GUI | 0.7.7, unpkg | Header identifies Data Arts Team / Google Creative Lab (2011) and Apache License 2.0. This was discovered in a commented debug import in the reference curtain; it is not an active presentation dependency. |
| Webflow runtime | `webflow.07467efa9.js`, reference CDN | Retained interaction and utility runtime. Hosted editor and branding modules were removed from the derived production copy; original bytes remain in the reference cache. |

Existing library copyright/license comments were preserved in derived copies. No current remote license terms were interpreted or verified for this document.

## Reproduction changes and audit

The importer removes Google tag scripts, resource preconnect/prefetch/prerender hints and Webflow editor/branding modules from runtime output. It preserves external social, client-site and email destinations. Internal links remain local. URL-encoded Webflow gallery templates were decoded, locally rewritten and re-encoded without discarding gallery content.

The completed acquisition contained 21 page routes and 495 presentation resources, totaling 43,014,436 source asset bytes. No attempted download was unavailable. Every local `/assets/` reference resolved after HTML entity decoding, and downloaded/extracted JavaScript and ES modules passed Node syntax checks. These are acquisition/static checks, not claims of visual or interaction equivalence.

Private raw reference material is evidence/cache for comparison. It should remain distinct from the independently authored implementation and the deployed public output.
