import { set } from 'monolite';
import sherlock from 'sherlockjs';
import queryString from 'query-string';

const compose = (...fns) =>
  fns.reverse().reduce(
    (prevFn, nextFn) => (value) => nextFn(prevFn(value)),
    (value) => value
  );

const toTruncatedDate = (date: Date) => toFormattedDate(date).substr(0, 8);

const toFormattedDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

const dayAndDayAfter = (date: Date) => {
  let dayAfter = new Date();
  dayAfter.setDate(date.getDate() + 1);
  dayAfter.setHours(0, 0, 0);
  return [date, dayAfter];
};

const dayAndHourLater = (date: Date) => {
  let hourLater = new Date();
  hourLater.setDate(date.getDate());
  hourLater.setTime(date.getTime() + 1 * 60 * 60 * 1000);
  return [date, hourLater];
};

const renderGuess = (text) => {
  const parsedResult = sherlock.parse(text);
  const { eventTitle, startDate, endDate, isAllDay } = parsedResult;

  const event = {
    details: text,
    action: 'TEMPLATE',
    text: eventTitle,
  };
  let workingDates = [startDate, endDate];
  if (startDate === null) {
    return "<div>Sorry, we can't find any dates in the selection!</div>";
  }
  if (endDate === null) {
    workingDates = dayAndHourLater(startDate);
  }
  if (isAllDay) {
    workingDates = dayAndDayAfter(startDate);
  }
  const dates = workingDates
    .filter((date) => date instanceof Date)
    .map((date) => {
      if (isAllDay) {
        return toTruncatedDate(date);
      } else {
        return toFormattedDate(date);
      }
    })
    .join('/');
  const query = queryString.stringify({ ...event, dates });
  const [start, end] = workingDates;
  return `
<p>Your event:</p>
<p>Title: ${eventTitle}</p>
<p>Start Date: ${start}</p>
<p>End Date: ${end}</p>
<a target="_blank" href="https://www.google.com/calendar/render?${query}">Create Event</a>`;
};

export interface State {
  text: string;
  highlighted: boolean;
}

const init = () => {
  const initialState: State = {
    text: undefined,
    highlighted: false,
  };
  let state = initialState;

  const makeRenderer = (root: HTMLElement, initialState: State) => (nextState?: State) => {
    let state = typeof nextState === 'undefined' ? initialState : nextState;
    const innerHTML = `<div>
<h1>Create an Event</h1>
    ${
      state.highlighted
        ? `<label>Highlighted Text</label>
        <input type="text" disabled>${state.text}</input><div>${renderGuess(state.text)}</div>`
        : 'Please highlight some text first!'
    }</div>`;
    root.innerHTML = innerHTML;
    return state;
  };
  const render = makeRenderer(document.querySelector('#popup'), initialState);
  render();

  const setText = (text?: string) => (state: State): State => set(state, (_) => _.text)(text);
  const setHighlighted = (highlighted: boolean) => (state: State): State => set(state, (_) => _.highlighted)(highlighted);

  const handleText = ({ text }) => {
    if (typeof text === 'undefined') {
      console.log('text undefined');
      state = compose(render, setText(), setHighlighted(false))(state);
    } else {
      console.log('text defined');
      state = compose(render, setText(text), setHighlighted(true))(state);
    }
  };

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      const [{ id }] = tabs;
      chrome.tabs.sendMessage(id, { getSelection: true }, (response) => {
        console.log(response);
        if (typeof response !== 'undefined') {
          handleText(response);
        }
      });
    }
  );
};

document.addEventListener('DOMContentLoaded', init);
