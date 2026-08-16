# PitchIn — Logo Spec v1.0

**Status:** Ready to draw
**Target:** One original SVG mark + wordmark lockup, for the existing prototype
**Builder:** A drawing-capable agent or illustrator (vector). Do not assemble this from rectangles.
**Authoritative product spec:** [`PitchIn_MVP_build_spec.md`](./PitchIn_MVP_build_spec.md) — palettes, type, and screens. This document does not supersede it.
**Discard:** [`logo-mockups/index.html`](./logo-mockups/index.html) is a rejected geometric stand-in. **Do not copy it. Do not refine it.**

---

## 0. How to use this document

This spec is written to be executed without clarifying questions. Where it gives a hex value, **use
that hex value exactly**. Where it forbids a pose, **do not ship that pose** even if it looks
“more logo-like.”

The job is to **draw two hands**, not to invent a symbol that suggests hands. Geometric
approximations (rotated rounded-rects, chevrons, bowls with ridged rims) have already failed. If
the squint test at 96px does not read as two human hands, start over.

**Do not:**

- Copy Apple, Google, Twitter/Twemoji, Noto, or OpenMoji artwork. 🤲 is a *pose reference only*.
- Ship a PNG, JPG, WebP, or emoji character. The build spec forbids image assets; the mark is
  inline SVG.
- Add a theme toggle, a new font, or a new color.
- Joke, cartoon, or South-Park the hands. The town is played straight.

---

## 1. What this mark has to mean

The product is named *PitchIn* — warm, plain, inviting. The interior vocabulary is operational
(reps, squads, quals). The mark sits on the warm side of that tension: it is the name, not the
doctrine.

It must read as **giving**, not asking, not stopping, not praying, not making a deal.

The one-sentence brief:

> Palms up, like 🤲, but one hand coming in from the left and one from the right, coming together.

That is two residents pitching in, meeting in the middle — not one person holding something out
alone, and not a handshake.

---

## 2. Locked decisions

| Dimension | Decision |
|---|---|
| Pose source | Unicode **U+1F932 PALMS UP TOGETHER** (🤲) |
| Camera | From above, looking *down onto* the palms. You see palm surface, not the back of the hand, and not the palm held up toward the viewer. |
| Composition | One left hand entering from the left edge; one right hand, a mirror, entering from the right edge. They come together near the vertical center. |
| Meeting | **Meeting, not fused.** Inner fingertips (index, maybe thumb) almost touch at top-center. Palms stay separate. A V of negative space remains between the wrists. |
| Tilt | Open-book. Each hand ~**38°** off vertical (left hand rotated clockwise, right mirrored). Enough that the wrists clearly live on the sides; not so flat that it becomes a landscape bar. |
| Count | Two hands. Four fingers + one thumb each. No extra objects in the hands (no square, heart, house, coin, task card). The hollow *is* the offering. |
| Style | Solid silhouette. One fill. No stroke required. No outlines, no nails, no jewelry, no sleeves, no skin-tone, no gender, no age. |
| Finish | Earnest, slightly woodcut / letterpress — as if stamped on a town flyer. Not glossy, not 3D, not emoji-cute, not clip-art charity. |
| Color | `currentColor`. Recolors per surface. No gradients. No second fill. |
| Wordmark | `PitchIn` in Oswald 700, uppercase, letter-spacing `0.06em` (landing) / `0.08em` (nav). The mark does not contain letters. |
| Medium | Original SVG paths. ViewBox **96 × 64** (landscape). |

### 2.1 Why 38° Meeting, not the other two distances

Three distances were considered. Only one is in scope:

| Variant | Tilt | Why it is out |
|---|---|---|
| From the sides | ~50° | Reads as two people, but loses 🤲. Looks like a wide bracket. |
| **Meeting (this spec)** | **~38°** | Hands arrive from each side *and* still read as palms-up together. |
| The cup | ~26° | Closest to the emoji, but reads as one person’s pair of hands. The brief asked for sides. |

Do not reopen this. Draw Meeting.

---

## 3. Anatomy (draw this, not a symbol of this)

Study 🤲 on any platform, then **redraw from the pose**, original paths.

### 3.1 Each hand

For the **left** hand (right hand is a vertical-axis mirror):

- **Wrist** sits on the left, slightly below vertical center. It is the origin of motion: the hand
  is arriving, not floating.
- **Palm** faces up. Broad, the largest mass. You are looking down onto it. It is a rounded pad,
  not a rectangle standing on end.
- **Fingers** attach to the far (upper-center) edge of the palm and reach toward the meeting
  point. Because the camera is above a palm-up hand, fingers are **foreshortened** — shorter and
  thicker than a “hand waving at the camera” pose. They are still clearly four separate fingers,
  not a comb or a ridged bowl rim.
- **Finger order**, left to right on the left hand: pinky (outer, shortest), ring, middle
  (longest), index (inner, reaching toward the other hand).
- **Thumb** sits on the **inner** edge of the palm (toward the center gap), pointing roughly the
  same way as the fingers — up and in. It is not on the outer/bottom edge. Outer thumbs read as
  “stop” or as a W.
- **Gaps** between fingers are real negative space, at least ~2.5 units in the 96×64 viewBox
  before rotation. If the gaps vanish at 48px, the fingers were too close.

### 3.2 The pair

```
          index  index
         ·  ~~~     ~~~  ·
       pinky  palm   palm  pinky
            wrist     wrist
         (left)         (right)
```

- Mirror across the vertical midline. The two hands are the same drawing, flipped. Do not
  “characterize” left vs right.
- **Almost-touch:** the gap between the nearest fingertips is small — about **2–4 units** in the
  96×64 viewBox. They do not overlap. They do not interlock. They do not merge into one mass.
- **Wrist gap:** the space between the two wrists is large and open. This V is load-bearing. If
  you close it, the silhouette becomes a heart or a bowl. If you open it too far, the hands look
  unrelated.
- **Hollow:** the negative space above the palms, below the meeting fingertips, is the offering.
  Leave it empty. That emptiness is the product (a need the town can hold).

### 3.3 What “palms up” is not

These poses have already been drawn by mistake. They are out:

| Forbidden pose | Why it fails |
|---|---|
| Palms toward the viewer, fingers straight up | Stop / praise / “ta-da.” Not 🤲. |
| Hands stacked vertically, one dropping an object into the other | A transaction. Not giving-together. |
| Handshake / fingers pointing at each other horizontally | A deal. |
| Prayer (palms together, vertical, fingers up, no gap) | Wrong verb. |
| Heart (wrists fused, top a notch) | Charity generic. Also a joke risk. |
| Single bowl / U with a jagged rim | Reads as a vessel, not as hands. |
| Clip-art “helping hands” from below, backs of hands visible | Asking, or applauding. |

**Squint test:** blur to 24px. You should still see *two* masses, a hollow, and finger scallops.
If you see a mountain, a heart, a bird, a bracket, or a mitten, redraw.

---

## 4. Surfaces the mark must survive

PitchIn is not light/dark of one theme. The mark is one SVG, `fill="currentColor"`, and it must
hold on all three surfaces that already exist in the app.

| Surface | Where | Background | Mark color | Wordmark color |
|---|---|---|---|---|
| **Wood** | App chrome (64px bar). This is the size that ships. | `#5C3A1E` | `#F4EFE4` cream | `#F4EFE4` cream |
| **Warm** | Landing `/` and `/wall` | `#F4EFE4` paper | `#A63D2E` stamp red | `#2A2620` ink |
| **Ops** | Working screens, if the mark appears off the wood bar | `#0E1116` | `#E8A33D` amber | `#E6EDF3` |

Do not introduce a fourth color. Do not outline the mark to “help” it on a given background. If
it fails at one fill, the silhouette is too fragile — simplify the drawing, do not add a stroke.

**Nav lockup (the one that matters):**

- Bar height: 64px, wood `#5C3A1E`
- Mark: **40 × 26px** (same 96×64 viewBox, scaled)
- Gap mark → wordmark: 10px
- Wordmark: Oswald 600/700, 1.125rem, uppercase, letter-spacing `0.08em`, cream
- No drop shadow (ops/chrome depth is surface, not shadow)

**Landing lockup:**

- Mark ~72 × 46px, stamp red
- Wordmark: Oswald 700, 3.75rem (`text-6xl`), uppercase, letter-spacing `0.06em`, `--warm-ink`
- Existing 3px × 120px stamp-red rule under the wordmark stays. The mark sits to the **left** of
  the wordmark, optically aligned to the cap height — not above it, not replacing it.

---

## 5. Wordmark

The letters are not part of the mark. Do not hide a P in the palms. Do not replace the `i` with
a hand.

| | Nav | Landing |
|---|---|---|
| String | `PitchIn` (renders as `PITCHIN` via uppercase) | same |
| Family | Oswald | Oswald |
| Weight | 600 or 700 | 700 |
| Size | 1.125rem | 3.75rem |
| Tracking | 0.08em | 0.06em |
| Color | cream on wood | `--warm-ink` |

Build spec §7.1 mentions Inter for the nav wordmark; the shipped chrome uses Oswald on wood.
**Follow the shipped chrome** (Oswald + cream on wood). Do not revert the nav to Inter to match
§7.1.

---

## 6. Technical delivery

### 6.1 File

Create **one** React component, e.g. `src/components/LogoMark.tsx`, exporting:

- `LogoMark` — the hands, `currentColor`, viewBox `"0 0 96 64"`, `aria-hidden="true"` when
  adjacent to the wordmark
- Optionally a `LogoLockup` that is mark + the wordmark text, for landing and nav

Inline SVG. No `public/*.png`. No favicon.ico raster unless it is generated from this SVG.

### 6.2 SVG rules

- A small number of `<path>` elements (ideally one path per hand, or one combined path).
- `fill="currentColor"`. No hardcoded hex in the SVG.
- No `<filter>`, no gradients, no opacity tricks to fake volume.
- No nested `<use>` of primitive rects. If you use `<use>`, it is to mirror one finished hand.
- `overflow: visible` is acceptable; prefer fitting the art inside 96×64 with ~4 unit padding
  on all sides so nav crop does not clip fingertips.
- Optical vertical centering: the mass should sit on the cap-height center of `PITCHIN`, not
  the viewBox center if those disagree.

### 6.3 Where to wire it (after the drawing is accepted)

1. `AppShell` — left of the existing `PitchIn` text in the 64px wood bar. Keep the link to `/`.
2. Landing hero (`src/screens/Landing.tsx`) — left of the `PitchIn` heading. Do not change the
   deck copy or the 120px rule.
3. `index.html` `<title>` unchanged. Optional: SVG favicon referencing the same paths.

Do not add the mark to `/wall` as decoration. The Wall is letterpress flyers; a logo stamp there
would compete with the physical-paper metaphor.

### 6.4 Dependencies

None. Do not install an icon library. Do not add a font. Do not add an animation library.

---

## 7. South Park rule (applies to the mark)

The town is the *South Park* of the TV show, played completely straight.

- Hands are generic human hands. No cartoon gloves, no character likeness, no “helpful little guy.”
- No wink in the negative space (no cow, no mountain that is also a joke).
- If a drawing would get a laugh, cut it.

---

## 8. Acceptance checklist

Print or screenshot the mark at the sizes below, on all three surfaces. Every box is a real check.

**Read as hands**

- [ ] At 140×90 (warm paper, stamp red) a stranger says “two hands,” not “a bowl” or “a bird.”
- [ ] Four fingers per hand are countable at 72×46.
- [ ] Palms read as facing up (hollow / offering), not as facing the viewer (stop).
- [ ] Left wrist is on the left; right wrist on the right. Motion is inward.

**Meeting**

- [ ] Fingertips almost touch; they do not overlap or fuse.
- [ ] A V of paper/wood shows between the wrists. Closing that V is a fail.
- [ ] The hollow above the palms is empty. No object.

**Not the wrong verb**

- [ ] Not prayer.
- [ ] Not a handshake.
- [ ] Not a heart.
- [ ] Not applause / raised palms.
- [ ] Not a drop / pass of a square or coin.

**Surfaces**

- [ ] Cream on wood `#5C3A1E` at **40×26** (nav). Fingers still scallop; not a blob.
- [ ] Stamp red `#A63D2E` on paper `#F4EFE4` at 72×46 (landing).
- [ ] Amber `#E8A33D` on ops `#0E1116` at 96×64.
- [ ] No stroke added to rescue any of the three.

**Lockup**

- [ ] Mark + `PITCHIN` in the 64px wood bar, 10px gap, optically aligned.
- [ ] Landing: mark left of the existing Oswald heading; 3px × 120px rule unchanged.
- [ ] Wordmark string is still `PitchIn`. No tagline in the lockup.

**Build constraints**

- [ ] Inline SVG only. No new packages. No raster assets.
- [ ] `npm run build` passes.
- [ ] Refresh still resets demo state; the logo does not involve persistence.

---

## 9. Suggested drawing method

Do not start in code.

1. Sketch the 🤲 pose, then rotate each hand out ~38° so the wrists go to the sides.
2. Ink a **silhouette** (black on white). Check the squint test.
3. Trace to SVG paths (Illustrator, Figma, or a vector pass). Simplify to the fewest points that
   still read as hands.
4. Drop the paths into `LogoMark` with `currentColor`.
5. Run §8 at nav size *before* polishing details. Detail that dies at 40×26 is decoration; cut it.

If you generate a raster reference with an image model, that file is a **scaffold only**. Trace
it. Do not commit the raster. Do not ship a photoreal or emoji-style rendering.

---

## 10. Out of scope

- Animation (no clasp, no pulse, no hover wiggle). Spec §8.5 is 120ms color transitions only.
- A second mark for ops vs warm. One drawing.
- Replacing Oswald. Replacing the wood bar. Replacing landing copy.
- Using this as a reason to add persistence, auth, or a component library.
