window.onkeydown = function (e) {
    var evt = e || event;
    var currKey = evt.keyCode || evt.which || evt.charCode;
    switch (currKey) {
        case 16://shift
            player.lowerSpeed = true;
            break;
        case 90://z
            player.fire = true;
            break;
        case 88://x
            if (player.power >= 2) {
                player.power -= 1;
                player.fireLevel -= 1;
                showPower -= 1;
                player.spellcard = true;
                playerspellcard.visible = true;
            }
            break;
        case 37://←
            player.toLeft = true;
            break;
        case 38://↑
            player.toTop = true;
            break;
        case 39://→
            player.toRight = true;
            break;
        case 40://↓
            player.toBottom = true;
            break;
        case 13: //Enter
            if (gameOver || gameWin) {
                gameOver = false;
                gameWin = false;
                document.getElementById("gameover").pause();
                document.getElementById("gameover").currentTime = 0;
                document.getElementById("end").pause();
                document.getElementById("end").currentTime = 0;
                document.getElementById("bgm").play();
                //重置各种参数
                showScore = 0;
                showPlayer = numOfPlayer;
                showPower = 1.00;
                bullets.foreach(function () {
                    if (this.visible) {
                        this.visible = false;
                    }
                });
                enemys.foreach(function () {
                    if (this.visible) {
                        this.visible = false;
                    }
                });
                booms.foreach(function () {
                    if (this.visible) {
                        this.visible = false;
                    }
                });
                foods.foreach(function () {
                    if (this.visible) {
                        this.visible = false;
                    }
                });
                playerReborn();
                bossInit();
                gameTime = 0;
                lastGameTime = new Date();
                lastenemyTime = new Date();
                lastTime = new Date(); //没有这一行的话计算fps会有问题,将直接导致画背景出问题
                ganmeFrame();
            } else if (gameStop) {
                gameStop = false;
                document.getElementById("bgm").play();
                lastTime = new Date(); //没有这一行的话计算fps会有问题,将直接导致画背景出问题
                lastGameTime = new Date(); //用于计算游戏时间,并且跳过暂停的时间
                ganmeFrame();
            }
            break;
        case 27: //esc
            gameStop = true;
            break;
    }
};

window.onkeyup = function (event) {
    switch (event.keyCode) {
        case 16: //shift
            player.lowerSpeed = false;
            break;
        case 90: //z
            player.fire = false;
            break;
        case 88: //x
            break;
        case 37: //←
            player.toLeft = false;
            break;
        case 38: //↑
            player.toTop = false;
            break;
        case 39: //→
            player.toRight = false;
            break;
        case 40: //↓
            player.toBottom = false;
            break;
        case 13: //Enter
            break;
        case 27: //esc
            break;
    }
};
