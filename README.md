# highlight-to-google-calendar

A chrome extension that allows you to use NLP to turn highlighted text into Google Calendar events. (Google Calendar used to do this automatically, but no longer 😿)

!["Highlight to Google Calendar" in action](screenshot.png?raw=true)

## Development

```Shell
yarn watch
```

Starts the watcher for building project when src file changes.

## Building

```Shell
yarn build
```

Preps the extension for deployment. Minifies all files, piping them to the `src/build` folder.

# Credits

Initial project structure based on https://github.com/atakangktepe/react-parcel-extension-boilerplate

Text to date parsing by SherlockJS:
https://github.com/neilgupta/Sherlock
