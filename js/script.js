const fromtext = document.querySelector('.from-text');
const totext = document.querySelector('.to-text');

const selecttag = document.querySelectorAll('select');

const translationbtn = document.querySelector('button');
const exchangeIcon = document.querySelector('.exchange');

const icons = document.querySelectorAll('.row i');
const mic = document.querySelector('.fa-microphone');

selecttag.forEach((tag, id) => {
  for (const country_code in countries) {
    let selected;
    if (id == 0 && country_code == 'en-GB') {
      selected = 'selected';
    } else if (id == 1 && country_code == 'hi-IN') {
      selected = 'selected';
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML('beforeend', option);
  }
});

exchangeIcon.addEventListener('click', () => {
  let temp = fromtext.value;
  fromtext.value = totext.value;
  totext.value = temp;

  let templang = selecttag[0].value;
  selecttag[0].value = selecttag[1].value;
  selecttag[1].value = templang;
});

translationbtn.addEventListener('click', () => {
  let text = fromtext.value;
  let translatefrom = selecttag[0].value;
  let translateto = selecttag[1].value;
  let apiurl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translatefrom}|${translateto}`;

  fetch(apiurl)
    .then((res) => res.json())
    .then((data) => {
      totext.value = data.responseData.translatedText;
    });
});

icons.forEach((icon) => {
  icon.addEventListener('click', ({ target }) => {
    if (target.classList.contains('fa-copy')) {
      if (target.id == 'from') {
        navigator.clipboard.writeText(fromtext.value);
      } else {
        navigator.clipboard.writeText(totext.value);
      }
    } else {
      let speech;
      if (target.id == 'from') {
        speech = new SpeechSynthesisUtterance(fromtext.value);
        speech.lang = selecttag[0].value;
      } else {
        speech = new SpeechSynthesisUtterance(totext.value);
        speech.lang = selecttag[1].value;
      }
      speechSynthesis.speak(speech);
    }
  });
});

mic.addEventListener('click', () => {
  if (annyang) {
    // Let's define a command.
    const commands = {
      'start *tag': (variable) => {
        fromtext.value = variable;
      },
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start({ autoRestart: true, continuous: false });
  }

  if (!annyang) {
    alert("Speech Recognition is not supported");
  }
  
});
