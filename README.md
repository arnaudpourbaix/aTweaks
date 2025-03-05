# aTweaks
PnP Tweak Pack for BGEE and BG2EE

This is an unofficial version and a complete refactoring of aTweaks, improving code structure, readability, and using latest WEIDU features.

This version will only work with Enhanced Editions, or is at least untested with previous editions.

## Technical

Main goal of this rework is to use json files to describe creatures. These files will be covered by a schema and a separate tool will generate TPH files, BAF scripts, as well as documentation.

Configuration over code. This is less subject to errors and it will ensure that everything is synchronize between tph, baf, and doc.

Generation tool will validate schemas to prevent any error. JSON schema will help to create json files, it includes many typings and comments.

## Credits

aVENGER, creator of aTweaks.
Wisp, current maintainer but not really active these days.

## License

This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
