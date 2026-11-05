# fastball

UI rules and a small CSS/JS kit for screens read at a glance.

A 98 mph pitch reaches the plate in 0.4 s. The batter decides in half that.
A screen should work the same way: look, know, act. Design for someone who
is 75, in a hurry, on a cracked phone in the sun.

fastball came out of [Louisiana911](https://github.com/vincentlarkin/Louisiana911),
a live 911 map. Older users found it too technical: agency codes, all-caps
text, 24-hour times, tiny filter chips. These rules fixed it.

## rules

1. One screen, one question. The answer is the largest text.
2. Plain words. No codes, caps or jargon. `Shreveport Police`, not `SPD`.
   `Serious`, not `P1`.
3. 12-hour time. `8:32 PM`, `Yesterday 11:50 PM`, `Nov 3, 8:32 PM`.
4. Fixed order: what, where, when, who.
5. Targets ≥ 44 px. Body text ≥ 16 px. Main line 17–18 px.
6. Buttons have words. Icon-only when space forces it, with a label.
7. Hide the knobs. Filters, sort and settings go behind one button. The
   button shows when any are on: `Filter (on)`.
8. Color is never the only signal. Red comes with `Serious`.
9. 280 px wide up to desktop. Popups fit the viewport. Their main buttons
   stay on screen.
10. Status is one line: `326 calls · Updated 8:44 PM`.

Test: show the screen for 400 ms, then hide it. Ask what it was and what
you'd tap. No answer, not done. [CHECKLIST.md](CHECKLIST.md) has the full
list.

## kit

No build. No dependencies.

```html
<link rel="stylesheet" href="fastball.css">
<script src="fastball.js" defer></script>
```

| class / function | use |
| --- | --- |
| `.fb-btn` `--primary` `--block` | button with text, ≥ 44 px |
| `.fb-switch` | 2–3 way view switch |
| `.fb-choices`, `Fastball.choices(group, fn)` | pick-one button group |
| `.fb-status` | one-line status |
| `.fb-card` `__title` `__time` `__where` `__who` | one item |
| `.fb-tag--serious` `--moderate` `--minor` `--info` | colored word |
| `.fb-facts` | `<dl>` of where, when, who |
| `.fb-dialog`, `Fastball.dialog(el)` | modal that fits the viewport |
| `.fb-sheet`, `Fastball.sheet(el)` | bottom sheet on phones, panel on desktop |
| `.fb-knobs`, `Fastball.knobs(btn, panel, isOn)` | filters behind one button |
| `Fastball.plainCase` `friendlyTime` `miles` `count` `distanceMiles` | text helpers |

[examples/index.html](examples/index.html) uses all of it. Open it and
narrow the window to 280 px.

## theme

Colors and sizes are CSS variables on `:root`. Dark by default.
`data-theme="light"` on `<html>` for light. Keep contrast at WCAG AA.

## test

```
npm test
```

## status

Early. The rules are fixed. The kit grows as projects use it.
