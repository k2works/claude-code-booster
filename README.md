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

## Development

```
npm install
npm start
```

## License

MIT. Copyright (c) [k2works](http://feross.org).
