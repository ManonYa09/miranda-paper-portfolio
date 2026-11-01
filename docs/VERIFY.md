# Verification and remaining differences

Verified in the Codex in-app browser on 27 October 2026.

## Passing checks

- All 21 routes have real local HTML documents; all 17 case studies were loaded directly in the browser. Their expected titles, client/story content and 4–6-image galleries are present.
- All imported presentation assets downloaded successfully. Static validation found no unresolved local resources or broken internal route links. No broken images were reported during route inspection.
- Reference-versus-recreation computed-style comparison at **1440, 1280, 1024, 768, 390 and 375px** matched for masthead, header strip, Interactive heading, professional role heading, navigation and main container: font family, size, line height, tracking, display and width. All six homepages had zero horizontal overflow.
- Masthead sizes at those widths: 532.8, 473.6, 378.88, 284.16, 138.45 and 133.125px.
- Desktop, tablet and mobile screenshots were inspected. The original mobile portrait-first ordering, hidden featured strip, reduced section selection and footer layout are retained.
- Project-strip drag changed translation from -892.8px to -347.3px without navigation; a subsequent click opened Om Swami and browser Back returned home.
- Opening animation observed; menu opens; local menu-to-Work navigation completes; desktop Work renders its horizontal project spines. Direct nested route loads work.
- Keyboard PageDown reaches case-study story, next-project selection and contact footer. Gallery opens with all images; keyboard close returns focus to its trigger.
- About and Legal pages render. Browser back returns from Legal to About; forward returns to Legal.
- Reduced-motion homepage renders immediately without entrance transforms. Menu can be opened with Enter and closed with Escape; scroll lock clears and focus returns. Reduced-motion Work has a visible, natively scrollable horizontal index. Reduced-motion testimonial cards use a readable grid.
- Original tracking snippets removed. Browser connection/resource policy limits the build to local sources; outgoing social, project and email links remain ordinary links.
- New JavaScript modules pass syntax checks. Browser error log was empty across the project-route sweep.

## Deliberate changes / limits

1. The source paper-curtain module carries an explicit redistribution restriction. It is excluded from the deployed build and source repository's tracked cache. An independent WebGL renderer approximates its organic, textured, torn sheet with fold shading and the observed two-second easing. Its exact edge deformation and texture lighting differ; this is **not an identical animation**.
2. Keyboard semantics, focus indication, focus containment, Escape, drag-click suppression, reliable navigation fallback, image/font resize updates, and reduced-motion behavior are additions to the original.
3. Reduced motion uses native scrolling and a static testimonial grid to preserve readability. Its layout intentionally differs where motion was necessary to expose content.
4. The reference's Unexpected Time feature is not a live internal project link. Its original informational content is retained without inventing a destination.
5. Footer copyright dates, historic availability text, original typos, duplicated lower project selection and the original Legal wording are preserved as reference content.
6. Font and image availability is verified, not a grant of redistribution rights. See assets-provenance.md before broader reuse.
7. Checks ran in one desktop browser with responsive viewport sizes, not physical phones/tablets or every browser/GPU. Touch inertia, all hover trajectories and every frame of every transition were not exhaustively compared. No pixel-diff or frame-by-frame equivalence claim is made.

## Re-run

`python3 scripts/build.py && python3 scripts/check.py`

Then start `python3 scripts/serve.py` and use the routes listed in REFERENCE.md. `?reduced-motion` forces the accessibility mode for QA; the operating-system media query is also honored.

## Delivery status

The local preview is available at http://localhost:4173. A private Sites project was registered, but source synchronization/publication was rejected by automatic approval review because explicit approval for uploading this project to that external destination is required. No source upload or deployment succeeded. The source archive and local preview are the delivered working result; publishing remains pending approval.
