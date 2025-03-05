# aTweaks
PnP Tweak Pack for BGEE and BG2EE

This a complete refactoring of aTweaks, improving code structure, readability, and using latest WEIDU features.

This version will only work with Enhanced Editions, or at least untested with previous editions.

## Technical

Main goal of this rework is to use json files to describe creatures. These files will be covered by a schema and a separate tool will generate TPH files, BAF scripts, as well as documentation.

Configuration over code. This is less subject to errors and it will ensure that everything is synchronize between tph, baf, and doc.

Generation tool will validate schemas to prevent any error. JSON schema will help to create json files, it includes many typings and comments.




