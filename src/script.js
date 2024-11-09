const buttons = document.querySelectorAll('.btn');
const white = document.querySelector('.white');
const none = document.querySelector('.none');
const question = document.querySelector('.que');
const comm = document.querySelector('.comm');
const start = document.querySelector('.start');
const end = document.querySelector('.end');

let started = 0;
let changed = 0;
let states = [];
let timeout;

const videos = [
    '3ZyiYJ1Ashc',
    'DtrK8e03Ri0',
    '6twkdANujAo',
    'JI1t4ocnceM'
];

const questions = [
    'Корректно ли ответила медсестра?',
    'Всё ли правильно делает медсестра?',
    'Корректно ли ответила медсестра?'
];

const comms = [
    '',
    'Внимание! Сейчас нужно оценить только одно: корректно ли медсестра взаимодействует с пациентом. Порядок действий при таких симптомах, разберём на уроке "Инфаркт миокадра".',
    'Оцените только с этической точки зрения. Ставить диагнозы, конечно, не следует.'
];

const answers = [
    [
        'Да, всё правильно',
        'Нет, так нельзя'
    ],

    [
        'Да, всё правильно',
        'Нет, так нельзя'
    ],

    [
        'Да, корректно',
        'Нет, не корректно'
    ]
];

let level = 0;
let target = null;
let counter = null;
var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];
let player;



function onload() {
    changeVideo();
    player.pauseVideo();
    document.addEventListener('transitionstart', (e) => {
        if (e.propertyName == 'opacity') {
            if (e.target == white) {
                player.playVideo();
            }
        }
    });
    document.addEventListener('transitionend', (e) => {
        if (e.propertyName == 'opacity') {
            hide(e.target);
            e.target.classList.remove('no-op');
            if (e.target == white) {

                changeQuestion();
                changeAnswers();
                changeComm();
            }
        }
    });

}

document.addEventListener('click', (e) => main(e));

function main(e) {
    if (started == 1 && e.target.classList.contains('start-button')) {
        player.playVideo();
        noOp(start);
        // return false;
    } else if (e.target.classList.contains('end-button')) {
        location.reload();
    } else if (findTarget(e)) {
        if (changed == 0) {
            clearTimeout(timeout);
            changed = 1;
            changeLevel();
            changeVideo();
            player.playVideo();
            // setTimeout(() => {
            // player.pauseVideo();
            // }, 100);
        }
        player.seekTo(0);
        player.playVideo();
        noOp(white);
        // player.playVideo();
    } else {
        return false;
    }
}

function hide(tar) {
    tar.classList.add('hide');
}

function noOp(tar) {
    tar.classList.add('no-op');
}

function show(tar) {
    tar.classList.remove('hide');
}

function playerChange() {
    states.push(player.getPlayerState());
    if (states.length == 3) {
        started = 1;
    }
    if (player.getPlayerState() == 0) {
        changed = 0;
        checkComm();
        checkFinish();
        show(white);
        timeout = setTimeout(() => {
            changed = 1;
            changeLevel();
            changeVideo();
            player.playVideo();
            setTimeout(() => {
                player.pauseVideo();
            }, 100);
        }, 400);

    } else if (player.getPlayerState() == 1) {
        show(none);
        // player.playVideo();
    }
}



function findTarget(e) {
    target = null;
    if (e.target.classList.contains('btn')) {
        target = e.target;
        return true;
    } else {
        return false;
    }
}

function changeVideo() {
    player.loadVideoById(videos[level]);
    return true;
}

function changeLevel() {
    level++;
    return true;
}

function changeQuestion() {
    question.innerText = questions[level];
    return true;
}

function changeAnswers() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].innerText = answers[level][i];
    }
}

function changeComm() {
    comm.innerText = comms[level];
}

function checkComm() {
    if (level < comms.length) {
        if (comms[level].length == 0) {
            hide(comm);
        } else {
            show(comm);
        }
    }
}

function checkFinish() {
    if (level == answers.length) {
        show(end);
    }
}

tag.src = "https://www.youtube.com/player_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        videoId: '3ZyiYJ1Ashc',
        playerVars: { 'controls': 0, 'showinfo': 0 },
        events: {
            'onStateChange': playerChange,
            'onReady': onload
        }
    });
    player.getIframe().classList.add('player');
    // hide(player.getIframe());

}