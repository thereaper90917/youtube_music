const customTitlebar = require('custom-electron-titlebar')
const path = require('path');
const url = require('url');

window.addEventListener('DOMContentLoaded', () => {
    let youtubeTitleBar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#030303'),
        icon: url.format(path.join(__dirname, '/images', '/i.png')),
      });

      youtubeTitleBar.updateTitle('Youtube Music');

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})