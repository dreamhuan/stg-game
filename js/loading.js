function loading() {
    for (var i = 0; i < datas.length; i++) {
        if (datas[i].indexOf("mp3") >= 0) {
            var audio = document.createElement("audio");
            console.log('mp3');
            audio.preload = "auto";
            audio.src = datas[i];
            audio.addEventListener("canplaythrough", loadMp3);
            if (datas[i].indexOf("bgm") >= 0) {
                audio.id = "bgm";
                audio.loop = true;
                audio.volume = 0.8;
            } else if (datas[i].indexOf("gameover") >= 0) {
                audio.id = "gameover";
                audio.loop = true;
                audio.volume = 0.8;
            } else if (datas[i].indexOf("end") >= 0) {
                audio.id = "end";
                audio.loop = true;
                audio.volume = 0.8;
            } else if (datas[i].indexOf("bossdie") >= 0) {
                audio.id = "bossdie";
                audio.volume = 0.5;
            } else if (datas[i].indexOf("boss") >= 0) {
                audio.id = "boss";
                audio.loop = true;
                audio.volume = 0.8;
            } else if (datas[i].indexOf("shoot") >= 0) {
                audio.volume = 0.1;
            } else if (datas[i].indexOf("boom") >= 0) {
                audio.volume = 0.2;
            } else if (datas[i].indexOf("biu") >= 0) {
                audio.volume = 0.5;
            }
            loadMp3(audio);
        } else {
            loadImg(datas[i]);
            console.log('img');
        }
    }
}

function loadMp3(audio) {
    audio.removeEventListener("canplaythrough", loadMp3);
    alreadyLoadCounts++;
    console.log(alreadyLoadCounts);
    document.body.appendChild(audio);
}

function loadImg(src) {
    if (src.indexOf("enemy") >= 0) {
        imageenemy = new Image();
        imageenemy.src = src;
        imageenemy.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("stg2enm") >= 0) {
        imageboss = new Image();
        imageboss.src = src;
        imageboss.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("explosion") >= 0) {
        imageexplosion = new Image();
        imageexplosion.src = src;
        imageexplosion.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("etama1") >= 0) {
        imageetama1 = new Image();
        imageetama1.src = src;
        imageetama1.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("etama2") >= 0) {
        imageetama2 = new Image();
        imageetama2.src = src;
        imageetama2.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("plasma") >= 0) {
        imageplasma = new Image();
        imageplasma.src = src;
        imageplasma.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("stg3bg") >= 0) {
        imagestg3bg = new Image();
        imagestg3bg.src = src;
        imagestg3bg.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("bg") >= 0) {
        imagebg = new Image();
        imagebg.src = src;
        imagebg.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    } else if (src.indexOf("p") >= 0) {
        imagep = new Image();
        imagep.src = src;
        imagep.onload = function () {
            alreadyLoadCounts++;
            console.log(alreadyLoadCounts);
        }
    }
}
