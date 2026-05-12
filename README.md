# IMT 561: Data Visualization: Design And Development

Spring 2026 | Author: belencsf@uw.edu

This repository has been updated to develop and deliver Homeworks #4 and #5 for IMT 561 @ UW, Spring 2026. See more details in Canvas.

This repo provides a tabbed gallery that lazy-loads p5 sketches (instance-mode) so you can organize multiple sketches in one page without them interfering.


Files & layout
- `index.html` — main page with tabs and per-tab containers.
- `script.js` — tab/sketch loader (lazy-loads scripts, attaches canvases, resizes on tab switches).
- `sketches/sketch1.js`..`sketches/sketch11.js` — sketches in p5 instance mode, registered with the loader.
- `sketches/sketch2.js`, `sketches/sketch3.js`, and `sketches/sketch4.js` are for each student to submit their homework.
- `style.css` — visual styles for the tabs and containers.
- `images/` — place evolution/iteration images here (see `images/README.md`).

Notes for instructors / contributors
- Prefer instance-mode sketches (factory function receiving `p`) and register them with `registerSketch('skN', factory)` so the loader can manage them cleanly.
- If you add sketches, update `SKETCH_SCRIPT_BY_ID` in `script.js` and add a corresponding tab/container in `index.html`.

If you want, I can add a small development task runner or a one-command script to start a local server and automatically open the browser.

# HWK 5: Narrative Visualization Design Note

## Project Title
The Risky Corner: High Social Media Use + Short Sleep

## Dataset and Story Choice
I chose the Teen Mental Health Dataset because it connects to a topic that many students can understand. Social media, sleep, and mental health are common parts of daily life. I wanted to avoid making a simple claim that social media causes depression. Instead, I focused on a more careful pattern in the data. The highest depression-label rate appears when high daily social media use overlaps with short sleep. This story is meaningful because it shows that sleep may be an important context when people discuss screen time and teen mental health.

## Title Choice
I chose the title “The Risky Corner” because the main finding appears in one corner of the 2 by 2 matrix. The title helps guide the viewer’s attention to the bottom-right cell. That cell represents teens with both high social media use and short sleep. The title is short and easy to remember. It also matches the structure of the visualization.

## Author-Driven or User-Driven
This visualization is mostly author-driven. I guide the viewer toward one main message through the title, color, layout, and annotation. The darkest cell shows where the viewer should look first. The arrow also points to the most important result. The hover tooltip adds a small user-driven element because viewers can move over each cell and see more details. However, the main story is still chosen and framed by me as the author.

## Visualization Genre
This visualization is a narrative explanatory visualization. More specifically, it is a heatmap-style 2 by 2 matrix. The goal is not to let users explore the whole dataset freely. The goal is to communicate one clear pattern from the data.

## Story Walkthrough
This visualization compares depression-label rates across four groups of teens. The groups are based on daily social media use and sleep duration. The bottom-right cell represents teens with six or more hours of daily social media use and less than six hours of sleep. This group has the highest depression-label rate at 16.5%. The other groups have much lower rates. This suggests that short sleep may be an important part of the relationship between screen time and mental health. However, this visualization only shows an association in this dataset. It does not prove that social media use or short sleep causes depression.

## Data Preprocessing
I used the original Teen Mental Health Dataset and created a smaller summary file for the final visualization. I grouped daily social media use into two categories: less than 6 hours and 6 hours or more. I grouped sleep duration into two categories: under 6 hours and 6 hours or more. Then I calculated the depression-label rate for each of the four groups. I saved the results in `data/hwk5_summary.csv`. I also included `preprocess_hwk5.py` so the data transformation can be repeated.

## Design Principles
I used clarity, hierarchy, and ethical communication as the main design principles. I chose a simple 2 by 2 matrix because it makes the comparison easy to understand. I used color intensity to show the depression-label rate. Lighter cells represent lower rates, and the darkest cell represents the highest rate. I used an annotation to explain the main takeaway directly. I also included a note about association and causation to avoid misleading the viewer.

## Clarity, Hierarchy, and Memorability
The visualization is clear because each cell includes a percentage and a group count. The hierarchy starts with the title, then moves to the dark red 16.5% cell, and then to the annotation. This order helps viewers understand the main message quickly. The design is memorable because the phrase “The Risky Corner” connects directly to the bottom-right cell. Viewers can remember the story as one location in the chart: high social media use plus short sleep.

## Feedback From Two People

### Person 1 Feedback
The first person noticed the dark red 16.5% cell first. They understood that the highest depression-label rate appears in the group with high social media use and short sleep. They asked whether this means social media causes depression. Based on this feedback, I made the causation note more visible at the bottom of the visualization.

### Person 2 Feedback
The second person noticed the title first and then looked at the highlighted corner. They understood that the chart compares social media use and sleep duration. However, they said the sleep labels could be easier to read. Based on this feedback, I increased the label size and placed the word “Sleep” more clearly above the two columns.

## Final Claim
The highest depression-label rate appears among teens with both high daily social media use and short sleep. This pattern is an association in this dataset. It is not proof of causation.
