# Fastball

**Interfaces you understand in an instant.**

A 98 mph fastball reaches the plate in about four-tenths of a second, and the
batter has to decide whether to swing in the first half of that. There is no
time to read or work anything out. You see it, you know, you act.

Fastball is a UI design philosophy, plus a small CSS/JS kit, for screens
that work the same way. Someone glances at the screen and knows right away
what it says and what to tap. That includes someone who is 75, in a hurry,
on a cracked phone in the sun.

It started on [Louisiana911](https://github.com/vincentlarkin/Louisiana911),
a live 911 incident map. Older visitors found the mobile site "too
technical": codes like `SFD` and `SHV`, all-caps titles, 24-hour times, and
rows of tiny filter chips. The Fastball update rebuilt it around the rules
below.

## The rules

1. **One look, one answer.** Each screen answers one question. The answer
   is the biggest thing on it.
2. **Plain words.** No codes, no ALL CAPS, no jargon. Write `Shreveport
   Police`, not `SPD`. Write `Serious`, not `P1` or `HIGH`.
3. **Human time.** `8:32 PM`, `Yesterday 11:50 PM`, `Nov 3, 8:32 PM`. Not
   `20:32`, not `2026-11-04T02:32Z`.
4. **Same order every time.** What, Where, When, Who, always in that order.
5. **Big targets.** Touch targets are at least 44 px. Body text is at least
   16 px, and the main line is 17–18 px.
6. **Words on buttons.** `Menu`, `Near me`, `Close`. An icon alone is only
   allowed when space forces it, and it still needs a label.
7. **Hide the knobs.** Filters, sorting and settings go behind one labeled
   button. When a knob is on, the button says so (`Filter (on)`).
8. **Color backs up words.** Color never carries meaning on its own. A red
   bar comes with the word `Serious`.
9. **Fits every screen.** From a 280 px foldable cover screen to a desktop.
   A popup is never taller than the visible screen, and its main buttons are
   always on screen.
10. **Plain status.** One sentence: `326 calls · Updated 8:44 PM`.

The 400 ms test: show the screen to someone for under half a second, then
hide it. Ask what it was about and what they would tap. If they can't
answer, it isn't a fastball yet. [CHECKLIST.md](CHECKLIST.md) turns the
rules into a review list.

## The kit

No build step and no dependencies. Copy the two files in:

```html
<link rel="stylesheet" href="fastball.css">
<script src="fastball.js" defer></script>
```

| Piece | Class / function | What it is for |
| --- | --- | --- |
| Buttons | `.fb-btn`, `.fb-btn--primary`, `.fb-btn--block` | 44 px+ buttons with words |
| Segmented switch | `.fb-switch` | Two or three views (Map / List) |
| Status line | `.fb-status` | One plain sentence of status |
| Card | `.fb-card` + `.fb-card__title/__time/__where/__who` | One item: what, when, where, who |
| Tag | `.fb-tag--serious/--moderate/--minor/--info` | A colored word, never a bare color |
| Facts | `.fb-facts` (a `<dl>`) | Where / When / Who rows |
| Dialog | `.fb-dialog` + `Fastball.dialog(el)` | A popup that always fits the screen |
| Sheet | `.fb-sheet` + `Fastball.sheet(el)` | A bottom sheet on phones, a panel on desktop |
| Hidden knobs | `.fb-knobs` + `Fastball.knobs(button, panel, isOn)` | Filters behind one button that says when it's on |
| Words | `Fastball.plainCase`, `Fastball.friendlyTime`, `Fastball.miles` | Plain text helpers |

[`examples/index.html`](examples/index.html) shows every piece together.
Open it in a browser, then narrow the window down to 280 px.

### Theming

Every color and size is a CSS variable on `:root`. Dark is the default; add
`data-theme="light"` to `<html>` for light. Override the variables for your
brand. Keep the contrast at WCAG AA or better.

## Status

Early. The rules are settled; the kit will grow as more projects use it.
