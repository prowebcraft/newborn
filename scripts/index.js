window.onload = (event) => {
    const textArr = [
        'рос здоровым и сильным, достигая всех поставленных целей и мечтаний',
        'встречал в жизни только хороших людей, которые поддержат его в трудные моменты',
        'находил свое истинное предназначение и достигал успеха во всех начинаниях',
        'был окружен настоящими друзьями и близкими людьми',
        'наслаждался каждым моментом жизни',
        'достигал глубокого понимания себя и окружающего мира, и находил свой истинный путь в жизни'];
    const colorsArr = ['#EC9C7B','#C2C8B1','#A17352'];
    const targetBtn = document.querySelector('#target-button');
    const newbornBlock = document.querySelector('#newborn');

    consoleText(textArr, 'dynamic-text', colorsArr);

    document.addEventListener("mousemove", parallax);
    targetBtn.addEventListener('click',smoothScroll);
    createCongrats();
    newbornBlock.classList.remove('loading');
};

// display text
function consoleText(words, id, colors) {
    if (colors === undefined) colors = ['#fff'];
    var visible = true;
    var con = document.getElementById('console');
    var letterCount = 1;
    var x = 1;
    var waiting = false;
    var target = document.getElementById(id);
    target.style.color = colors[0];
    window.setInterval(function() {
      if (letterCount === 0 && waiting === false) {
        waiting = true;
        target.innerHTML = words[0].substring(0, letterCount)
        window.setTimeout(function() {
          var usedColor = colors.shift();
          colors.push(usedColor);
          var usedWord = words.shift();
          words.push(usedWord);
          x = 1;
            target.style.color = colors[0];
          letterCount += x;
          waiting = false;
        }, 100)
      } else if (letterCount === words[0].length + 1 && waiting === false) {
        waiting = true;
        window.setTimeout(function() {
          x = -1;
          letterCount += x;
          waiting = false;
        }, 1000)
      } else if (waiting === false) {
        target.innerHTML = words[0].substring(0, letterCount)
        letterCount += x;
      }
    }, 30)
    window.setInterval(function() {
      if (visible === true) {
        con.className = 'console-underscore hidden'
        visible = false;
      } else {
        con.className = 'console-underscore'
        visible = true;
      }
    }, 400)
}

// parallax effect
function parallax(event) {
  if (window.innerWidth < 1024) return;

    this.querySelectorAll(".parallax-wrap span").forEach((shift) => {
        const position = shift.getAttribute("value");
        const x = (window.innerWidth - event.pageX * position) / 90;
        const y = (window.innerHeight - event.pageY * position) / 90;

        shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}

//smooth scroll
function smoothScroll(e){
    const target = e.target?.dataset.target;
    if (!target) return;

    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// congrats grid
function createCongrats() {
    fetch('https://script.googleusercontent.com/macros/echo?user_content_key=6KNbaXzK1uNCgFKlVm-XG3VuU5if2nONuQ4BwVOVVIPJK2NQmpGM8mF6BildyDcbYUWa_LDhcIgN6sRD_p-Z0MIdMs2f5Hmnm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHQjlmBiS01A_j95pahwlKFBwgVygXKIPBW1Y5zr6qSQq9xM5B8hkbqbVztphUPItXGcM1x5tXZ6geapoKKqnL3UsmEiiWQfbA&lib=MBOm2GPBVpZb_RB7G5lrjK7Vb34UuDugY')
        .then(response => response.json())
        .then(data => {
          if (data.length) {
            const congratsBlock = document.querySelector('#congrats');

            data.forEach(item => {
                congratsBlock.appendChild(createCongratsBlock(item));
            })

            initVideosEvents();

            congratsBlock.classList.remove('loading');
          }
        })
        .catch((error) => {
          console.error(error);
        });
}

function createCongratsBlock(data) {
    if (!data) return;

    const colorsTheme = ['pink', 'blue', 'green'];
    const block = createElement('div', 'grid-block');
    block.dataset.color = colorsTheme[getRandomNumber(colorsTheme.length)];

    if (data.img_url) {
        const imgBlock = createElement('img', 'block__image');
        imgBlock.alt = `Поздравление от ${data.from}`;
        imgBlock.src = data.img_url;

        block.appendChild(imgBlock);
    }

    // if (data.video_url) {
    //   const videoBlock = createElement('div', 'block__video');
    //   const videoElem = createElement('video', 'block__video-el');
    //   const videoSource = createElement('source');
    //   const videoButton = createElement('button', 'block__video-button')

    //   videoSource.src = data.video_url;
    //   videoSource.type = 'video/mp4';

    //   videoSource.append(videoElem);
    //   videoElem.append(videoBlock);
    //   videoButton.append(videoBlock);
    // }

    if (data.text) {
        const textBlock = createElement('div', 'grid-block__text');
        textBlock.innerHTML = data.text;

        block.appendChild(textBlock);
    }

    if (data.from) {
        const fromBlock = createElement('div', 'grid-block___from');
        fromBlock.innerHTML = `От <b>${data.from}</b>`;

        block.appendChild(fromBlock);
    }

    return block;
}

function createElement(type, elementClass) {
    const element = document.createElement(type);
    if (elementClass) {
      const classList = elementClass.replace(/\s/g, '').split(',');
      classList.forEach(className => element.classList.add(className));
    }
    return element;
}

function getRandomNumber(length) {
    return Math.floor(Math.random()*length);
}

function initVideosEvents() {
  const videos = Array.prototype.slice.call(document.querySelectorAll('video'));

  if (!videos.length) return;

  videos.forEach((video) => {
    let playBtn = video.closest('.greeting__video').querySelector('.block__video-button');
    playBtn.addEventListener('click', function() {
        if(video.paused) {
            pauseAllVideos();

            playBtn.classList.add('block__video-button_hidden');
            video.classList.add('video_active');
            video.play();
        }
    })

    video.addEventListener('click', function() {
        if (!video.paused) {
            pauseAllVideos();
        }
    })

})
};

function pauseAllVideos() {
  let activeVideos = Array.prototype.slice.call(document.querySelectorAll('.video_active'));

  if(activeVideos.length) {
      activeVideos.forEach((video) => {
          let playBtn = video.closest('.block__video').querySelector('.block__video-button');

          playBtn.classList.remove('block__video-button_hidden');
          video.classList.remove('video_active');
          video.pause();
      })
  }
}