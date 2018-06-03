chrome.runtime.onMessage.addListener(({ getSelection }, sender, response) => {
  const selection = window.getSelection();
  if (getSelection && selection.type !== "None") {
    response({ text: selection.toString() });
  } else response({ text: undefined });
});
