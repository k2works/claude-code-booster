# claude-code-booster

## What's this

AI Agent Development Support Tool

## Install

```
npm install @k2works/claude-code-booster
```

## Usage

- Initialize/copy all assets to your project root:
```sh
npx boost
```

- Update only .claude and docs directories in an existing project:
```sh
npx boost --update
```

### What gets updated with --update
- .claude: prompts, commands, and config shipped with this package
- docs: documentation templates

### Notes
- Existing files under .claude and docs will be overwritten.
- Other files are left untouched.

### Keeping project-specific notes (PROJECT.md)

The skills shipped here are intentionally generic — they do not assume a language,
framework, or directory layout. Concrete paths and commands differ per project, so
**do not edit `SKILL.md` to record them**: it is overwritten on the next `--update`.

Put them in a `PROJECT.md` next to the skill instead:

```
.claude/skills/creating-manual/
├── SKILL.md     # shipped by this package — overwritten on update
└── PROJECT.md   # yours — never touched, because it does not exist upstream
```

Files that exist only in your project are left alone (the copy step never deletes
extraneous files), so `PROJECT.md` survives every update. The generated `CLAUDE.md`
already instructs the agent to read `PROJECT.md` alongside `SKILL.md` and to treat
`PROJECT.md` as authoritative when the two disagree — no wiring is needed on your side.

## Development

```
npm install
npm start
```

## License

MIT. Copyright (c) [k2works](http://feross.org).
