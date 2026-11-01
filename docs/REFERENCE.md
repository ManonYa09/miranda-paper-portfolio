# Reference inspection — 27 October 2026

Source: https://www.niccolomiranda.com/ (live public site).

## Route inventory

- `/`: complete editorial homepage.
- `/work`: horizontal desktop accordion, vertical mobile project list; upcoming project; contact.
- `/about`: biography, selected awards, work experience, 13 publications, clients and partners, project selection, contact, footer.
- `/legal`: original legal notice, multi-column privacy text, project selection, contact, footer. Its copy is preserved as reference content; the recreation removes original analytics.
- `/work/{wow-concept,the-roger-hub,avroko,cobo,thinkers,argor-heraeus,om-swami,the-books-of-ye,prada,the-hiring-chain,aquerone,sal-parasuco,edoardo-smerilli,chiara-luzzana,loftgarten,deplace-maison,cobo-2019}`: individual case studies, project hero/title assets, client/year/category metadata, description, external live-site link, story, image gallery, neighboring projects, contact and footer.

## Homepage sections in source order

1. Header: Amsterdam, NL; centered Paper Portfolio brand; two-line menu icon.
2. Draggable featured projects: Books of Ye, Om Swami, AvroKO, All Work editorial, WOW Concept, The Roger Hub, Prada. Initial translation: -62vw.
3. MIRANDA masthead.
4. Interactive Artist column, portrait, drop-cap biography; adjacent landscape portrait and four professional role lines.
5. WEBSITE masthead and stamp.
6. Upcoming Next / Unexpected Time; supporting illustration; Think, Create / Deliver and All Work oval CTA.
7. Award totals: 9 / 1 / 6 / 8.
8. THE PIXEL PERFECT ARTISAN composition, images and awards copy.
9. Four overlapping testimonial cards: Sam Day, Sofia Papadopoulou, Bruno Arizio, Enea Rossi.
10. Lower project selection and All Work panel.
11. Repeated email contact marquee.
12. Miranda copyright, stamp, Legal, four social destinations.

## Measured design and behavior

- Ink: `#1d1d1b`; paper: `#cdc6be`; original paper image uses multiply blending.
- Body: Editorial New; primary display: Canopee; selected glyphs use the reference alternate font.
- At 1440px: masthead 532.8px (37vw), line height 345.6px (24vw), tracking -26.64px (-.05em).
- Interactive: 118.08px; Artist!: 201.6px; role lines: 122.4px, line height 95.04px.
- Website: 432px; Think, Create: 109.44px; Deliver: 211.68px.
- Artisan composition: 446.4px main display, Artisan 365.76px.
- Desktop menu: 300px display, 200px line height, -15px tracking; black paper canvas, beige type; active page struck through in red.
- Opening sequence: original Webflow interaction begins at translateY(25vw), scale(.4), rotateZ(720deg); homepage scroll lock clears after 5 seconds.
- Curtain: actual WebGL module; duration 2s, power3.inOut; amplitude .25, rippedFrequency 3.5, rippedAmplitude .05, curveFrequency 1, curveAmplitude .1, rippedDelta 1, rippedHeight .07.
- Smooth scrolling: original Locomotive Scroll 4.1.3; horizontal direction on desktop Work; touch-aware initialization.
- Featured slider: butter-slider, smoothAmount .15 after initial position, source drag sensitivity retained.
- At 390px: featured header hidden; masthead 138.45px (35.5vw); portrait/role block moves before Interactive Artist. Role text 51.48px. Website, process sidebar and awards are hidden by original mobile CSS. Testimonials show Sam Day and Bruno Arizio as stacked cards. Lower selection is stacked.
- At 768px: featured header is visible; masthead 284.16px; nav approx. 81.91px tall.
- Desktop Work uses vertical project-title spines, expands on hover, scrolls horizontally; mobile has thumbnail/title/year rows with divider rules and a different source order.
- Case study gallery is an overlay with a right-hand panel and elastic image scroller, opened via Gallery and closed by its cross.

## Fidelity strategy

Retain the reference's publicly served HTML, CSS, font files, original illustration assets, SVG titles, Webflow interaction definitions, GSAP and carousel modules. The restricted paper-curtain module is replaced by an independent implementation. Store presentation dependencies locally. Separate imported source from small accessibility and reliability enhancements. Keep all internal links local and preserve outgoing project/social/email destinations.

Exact responsive CSS and animation timelines are retained as source rather than re-estimated from screenshots. Browser QA and residual differences are recorded separately in VERIFY.md.
