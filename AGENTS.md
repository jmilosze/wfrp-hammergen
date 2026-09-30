# Agent Guidelines

- Always re-read files before making modifications to ensure you have the most up-to-date content and avoid working from stale cache.
- Always avoid using defensive fallbacks. We do not add code "just in case".
- Avoid TypeScript type assertions (such as `as any`, `as Type`, or non-null assertion `!`) that are not absolutely needed. Prefer proper type definitions, narrowing, or adjusted function signatures.
- Do not care about backwards compatibility. Never keep deprecated aliases, shims, or fallback code around for backwards compatibility.

# Reference Materials

The `books/` folder contains rulebooks and errata for Warhammer Fantasy Roleplay (WFRP), with both PDF and converted plain text (`.txt`) versions available for easy reading and searching by AI agents:
- **WFRP 4th Edition**: `books/Warhammer_Fantasy_Roleplay_PDF_version4.pdf` and `books/Warhammer_Fantasy_Roleplay_PDF_version4.txt`
- **WFRP 5th Edition**: `books/WFRP5_Core_Rulebook_01_09_26.pdf` and `books/WFRP5_Core_Rulebook_01_09_26.txt`
- **WFRP Errata**: `books/WFRP_Errata_28_Feb.pdf` and `books/WFRP_Errata_28_Feb.txt`
