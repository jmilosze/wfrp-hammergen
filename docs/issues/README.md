# Issues

Backlog of known bugs, improvements and feature ideas. It persists between work sessions: pick an issue by its ID, and keep these files current.

| File | What goes there |
|---|---|
| [functional.md](functional.md) | What users can do and how values are calculated: rules, the generator, characters and content. |
| [ui.md](ui.md) | How the app looks and feels: layout, components, texts and interaction. |
| [technical.md](technical.md) | Everything users don't see directly: backend internals, code quality, tests, tooling, deployment, performance, analytics. |

Deciding where an issue goes: if it changes what a user can do or what gets calculated, it is functional; if it changes only how things look or feel, it is UI; otherwise it is technical. Each issue lives in exactly one file. For issues that span several, pick the file by the user's point of view (where the problem is noticed or the benefit felt).

Each file has three sections:
- **Bugs**: something works wrong.
- **Features** (in `technical.md`: **Improvements**): agreed work.
- **Ideas**: not decided yet (needs measuring, a decision or user demand first).

Entries:
- One entry per issue: `### HG-<n> Title`, then a line with the area and the date it was added, then a short description (what, why, any decisions already made).
- IDs are one sequence across all files and are never reused. New issues take the next free number; moving an issue between files or sections keeps its ID.
- When an issue is done, delete its entry (git history keeps it). When it is partly done, update the description.
- Out-of-scope problems found while working on something else go here, not into the code as TODO comments.

Next free ID: **HG-66**
