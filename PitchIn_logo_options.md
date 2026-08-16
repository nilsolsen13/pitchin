# PitchIn - Logo Options

**Purpose:** Ten site-ready logo directions derived from `PitchIn_logo_spec.md`.
These are drawing briefs, not final artwork. Every option keeps the locked
requirements: palms up, one hand from each side, meeting near center, one-color
inline SVG, `currentColor`, Oswald wordmark, no extra objects.

Use these to guide a drawing-capable agent or illustrator. Do not copy the
discarded `logo-mockups/` SVGs.

---

## Review Notes

The logo spec is strongest where it narrows the problem:

- The core pose is fixed: palms up like U+1F932, but separated into two hands
  arriving from the left and right.
- The mark must survive the nav first. The 40 x 26px cream-on-wood treatment is
  the real acceptance test.
- The hollow between the hands is the idea. Do not fill it with a heart, task
  card, coin, house, mountain, or hidden letter.
- The visual language should feel like a town flyer stamp: earnest, legible,
  slightly letterpress, never glossy or emoji-cute.

The main thing to watch: many plausible marks drift into forbidden territory.
If the wrists close, it becomes a heart. If the fingers stand upright, it
becomes "stop" or prayer. If the hands turn horizontal, it becomes a handshake.
If the hands merge into one mass, it becomes a bowl instead of two residents.

---

## Option 1 - Plain Meeting Hands

The most direct execution of the spec.

Draw two mirrored palm-up hands at roughly 38 degrees. Keep broad palms, short
foreshortened fingers, and a clear V of negative space between the wrists. The
inner index fingertips almost touch at the top center, with a 2-4 unit gap in
the 96 x 64 viewBox.

Use this if the goal is to get the mark approved quickly and avoid symbolism
drift.

Site behavior:

- Nav: strongest baseline for 40 x 26px.
- Landing: friendly and readable without competing with the thesis copy.
- Ops: amber silhouette should read as a functional civic mark, not decoration.

Failure mode: too plain if the hand anatomy is underdrawn. It must still read
as two human hands, not two red pads.

---

## Option 2 - Letterpress Stamp Hands

The same meeting pose, but with subtly uneven outer contours, as if cut from a
rubber stamp or printed on a civic notice.

Draw the silhouette cleanly first, then introduce tiny human irregularities:
slightly asymmetric palm edge, gently varied finger lengths, and a less-perfect
wrist taper. Keep the left and right hands mirrored enough to preserve the
logo geometry, but avoid a sterile icon-library feel.

Use this if the logo should feel most at home on the landing page and The Wall.

Site behavior:

- Nav: must be simplified enough that the irregularities do not turn into fuzz.
- Landing: likely the warmest option.
- Ops: works if the silhouette stays disciplined.

Failure mode: distress texture. Do not add grain, speckles, masks, or opacity.
The SVG remains a one-fill silhouette.

---

## Option 3 - Deep Hollow Hands

Emphasize the empty space held between the palms.

Make the palms slightly more curved and give the center hollow a deliberate
rounded-diamond shape. The hands still arrive from the sides, but the negative
space becomes the visual center. Keep the wrists separated and avoid closing
the bottom of the hollow.

Use this if the product idea should be visible in the mark: unmet need held by
community capacity.

Site behavior:

- Nav: hollow may collapse at 40 x 26px unless the palm masses are bold.
- Landing: strong conceptual fit beside the thesis.
- Ops: good at 96 x 64px, especially in amber.

Failure mode: if the hollow becomes too symmetrical, it starts reading as a
heart or shield. Both are out.

---

## Option 4 - Nav-First Compact Hands

Optimize everything for the 64px wood header.

Reduce fine anatomy. Use larger palm masses, fewer contour inflections, wider
finger gaps, and a slightly wider stance so the silhouette is unmistakable at
40 x 26px. The drawing can become more abstract than Option 1, but it still
must read as hands.

Use this if the logo will mainly live in the app chrome and needs to hold up
during a demo from the back of a room.

Site behavior:

- Nav: likely strongest.
- Landing: may feel a little utilitarian unless paired well with Oswald.
- Ops: excellent.

Failure mode: becoming a bracket, bowl, bird, or mountain shape. Check the
squint test aggressively.

---

## Option 5 - Flyer Masthead Lockup

Treat the mark and wordmark as one masthead composition for the landing page,
while keeping the mark usable alone.

Draw the same mark, but tune its vertical mass to align with Oswald cap height.
In the landing lockup, place the mark left of `PITCHIN` with the palms' meeting
point slightly above the wordmark optical center. Keep the existing 120px red
rule under the wordmark.

Use this if the landing hero is the priority and the mark needs to feel
integrated with the current poster-like design.

Site behavior:

- Nav: use the mark alone at 40 x 26px, not the full masthead.
- Landing: strongest.
- Ops: neutral.

Failure mode: overfitting the landing lockup so the standalone mark is weak.
The mark must still work by itself.

---

## Option 6 - County Seal Simplicity

A more civic, official-feeling version without becoming a badge or seal.

Use a steady, symmetrical silhouette with restrained curves and a slightly
heavier baseline at the wrists. The hands should feel official enough for Park
County Emergency Management, but not institutional or militarized.

Use this if the prototype should feel credible to requesters and administrators
as much as residents.

Site behavior:

- Nav: good if the wrist base is not too heavy.
- Landing: less warm, more trustworthy.
- Ops: strongest fit among the formal options.

Failure mode: drifting into a government emblem. Do not add circles, stars,
mountains, badges, shields, or text around the mark.

---

## Option 7 - Human Warmth Hands

Prioritize hand readability and warmth.

Draw more organic palms and softer finger curves than the nav-first option.
The fingers can have a slight bend toward the meeting point, like real hands
cupping upward. Keep the one-fill silhouette and avoid fingernails or outlines.

Use this if the current app risks feeling too operational and the logo should
pull the first impression back toward plain civic generosity.

Site behavior:

- Nav: acceptable only if the bends remain legible at 40 x 26px.
- Landing: very strong.
- Ops: may feel less operational but still appropriate.

Failure mode: emoji-cute. No cartoon gloves, no rounded mascot hands, no
skin-tone implication.

---

## Option 8 - Strong Finger Scallop

Make the count of fingers the key recognition feature.

The palms are simple, but the four finger tips per hand form clear, separate
scallops along the top interior edge. The finger gaps are oversized so the
hands survive small sizes. The thumbs stay on the inner edges and point up-in.

Use this if previous sketches keep reading as bowls or mittens.

Site behavior:

- Nav: strong, because the scallop carries the hand read.
- Landing: visually distinctive.
- Ops: strong.

Failure mode: comb or claw. Fingers should be rounded, human, and
foreshortened, not long vertical teeth.

---

## Option 9 - Open-Book Hands

Lean into the "coming together" geometry.

The two palms form an open-book shape: wrists low and out, fingers up and in.
The centerline gap is continuous from wrist V to fingertip gap. This makes the
inward motion especially clear while preserving the palms-up pose.

Use this if the mark should communicate mutual arrival more than holding.

Site behavior:

- Nav: good if the book angle is not too wide.
- Landing: strong, especially beside the wordmark.
- Ops: strong.

Failure mode: becoming a book, bracket, or butterfly. The hands need enough
finger and thumb anatomy to prevent that.

---

## Option 10 - Quiet Civic Stamp

The most restrained, least illustrative direction.

Reduce the mark to two broad palm silhouettes with minimal but unmistakable
finger separation. Keep the inner fingertip gap and wrist V. Remove any detail
that does not survive at 40 x 26px. This is the most logo-like option, but also
the one most at risk of becoming abstract.

Use this if the site needs a mark that can sit quietly in the chrome without
calling attention to itself.

Site behavior:

- Nav: excellent if it still reads as hands.
- Landing: may need a slightly larger size to feel warm.
- Ops: excellent.

Failure mode: abstraction. If a stranger does not say "hands" at 96px, reject
it even if it looks clean.

---

## Shortlist Recommendation

Start with three sketches:

1. **Plain Meeting Hands** - safest interpretation of the approved brief.
2. **Nav-First Compact Hands** - best chance of surviving the actual app chrome.
3. **Human Warmth Hands** - best chance of making the landing page feel inviting.

Then choose based on the 40 x 26px wood-nav test. The logo lives there first.
