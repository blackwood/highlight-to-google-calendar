# highlight-to-google-calendar

A chrome extension that allows you to turn highlighted text into Google Calendar events. (Google Calendar used to do this automatically when entering events, but no longer 😿)

Simply highlight some text with an event date and time in it, and the result will be in the popup when you click the extension icon when you click the top right. The extension will generate a shorter a title for you, and put the remaining details in the description of the event. Click "Create Event" after a successful parse and it will take you to the event creation dialog in Google Calendar.

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
