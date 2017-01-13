//***********************************************  游戏主函数  *****************************************************
function gameLoop() {
    var now = new Date;
    gameTime += now - lastGameTime;
    lastGameTime = now;
    //绘制自机
    if (player.visible) {
        context.save();
        if (player.isGod) {
            context.globalAlpha = 0.5;
        }
        player.update(context, now);
        player.paint(context);
        if (player.lowerSpeed) {
            context.beginPath();
            context.fillStyle = "red";
            context.arc(player.x + 16, player.y + 24, 3, 0, 2 * Math.PI);
            context.fill();
            context.beginPath();
            context.fillStyle = "white";
            context.arc(player.x + 16, player.y + 24, 2, 0, 2 * Math.PI);
            context.fill();
        }
        context.restore();
    }

    //遍历子弹数组绘制可见子弹
    bullets.foreach(function () {
        var bullet = this;
        if (bullet.visible) {
            if (bullet.isgood) { //自机的子弹
                enemys.foreach(function () { //遍历敌机
                    var enm = this;
                    if (enm.visible) {
                        var distance = Math.sqrt(
                            Math.pow((bullet.x) - (enm.x + 16), 2)
                            + Math.pow((bullet.y) - (enm.y + 16), 2)
                        );
                        if (distance < 20) {
                            bullet.visible = false;
                            enm.blood -= 50;
                            if (enm.blood <= 0) {
                                enm.visible = false;
                                boom(enm);
                                addfood(enm);
                                showScore += player.point * 1231;
                            }
                        }
                    }
                });
                if (boss.visible) { //boss判定
                    var distance = Math.sqrt(
                        Math.pow((bullet.x) - (boss.x + 32), 2)
                        + Math.pow((bullet.y) - (boss.y + 32), 2)
                    );
                    if (distance < 20) {
                        bullet.visible = false;
                        boss.blood -= 50;
                        if (boss.blood <= 0) {
                            boss.visible = false;
                            boom(boss);
                            bossboom = true; //让后面显示boss那里变成不可见
                            document.getElementById("bossdie").play();
                            showScore += player.point * 12310504;
                            setTimeout(function () {
                                gameWin = true;
                            }, 5000);
                        }
                    }
                }
            } else if (player.visible && !player.isGod) { //敌机的子弹
                var distance = Math.sqrt(
                    Math.pow((bullet.x) - (player.x + 16), 2)
                    + Math.pow((bullet.y) - (player.y + 24), 2)
                );
                if (distance < 5) {
                    player.visible = false;
                    showPlayer--;
                    if (showPlayer < 0) {
                        showPlayer = "gameover!";
                        gameOver = true;
                    }
                    bullet.visible = false;
                    boom(player); //自己挂了同时画面清空 并且吐出食物。。。
                    bullets.foreach(function () {
                        if (this.visible) {
                            this.visible = false;
                        }
                    });
                    enemys.foreach(function () {
                        if (this.visible) {
                            this.visible = false;
                            boom(this);
                            addfood(this);
                        }
                    });
                    for (var i = 0; i < player.power; i++) {
                        addfood(player, "power", player.x + 20 * i, player.y - 100 - i * 20);
                        addfood(player, "power", player.x + 100 - 20 * i, player.y - 100 - i * 20);
                    }
                    setTimeout(function () { //不知道啥时候重生，直接硬编码...
                        playerReborn();
                        player.visible = true;
                    }, 1000);
                }
            }
            this.update(context, now);
            this.paint(context);
            //console.log(bullet.y);
        }
    });

    if (gameTime / 1000 < 200) { //200s后出现boss
        //产生enemy的逻辑
        if (now - lastenemyTime > 1000 * 100 / (gameTime / 1000 + 100)) { //和shoot间隔算法一样
            for (var i in enemys) {
                if (!enemys[i].visible) {
                    enemys[i].lastTimeShoot = new Date();
                    enemys[i].x = Math.random() * 385 + 34;
                    enemys[i].y = 0;
                    enemys[i].lastMoveTime = new Date();
                    enemys[i].moveDirFlag = 0;
                    enemys[i].visible = true;
                    //console.log("visible");
                    break;
                }
            }
            lastenemyTime = now;
        }
    } else {
        document.getElementById("bgm").pause();
        document.getElementById("bgm").currentTime = 0; //播放进度设为0(下次play就是重播,不然会接下去)
        document.getElementById("boss").play();
        //产生boss
        if (!bossboom) //时间到了并且boss没有死就可见
            boss.visible = true;
        context.save();
        if (boss.visible) {
            boss.update(context, now);
            boss.paint(context);
            //画boss的血槽
            context.fillStyle = "red";
            context.fillRect(40, 20, boss.blood / boss.fullBlood * 370, 5);
        }
        context.restore();
    }

    enemys.foreach(function () {
        if (this.visible) {
            this.update(context, now);
            this.paint(context);
        }
    });

    booms.foreach(function () {
        if (this.visible) {
            this.update(context, now);
            this.paint(context);
        }
    });

    foods.foreach(function () {
        var food = this;
        if (food.visible) {
            if (player.visible) {
                var distance = Math.sqrt(
                    Math.pow((food.x) - (player.x + 16), 2)
                    + Math.pow((food.y) - (player.y + 24), 2)
                );
                if (distance < 20) {
                    if (food.type === "power" && player.power < 5) {
                        player.power += 0.5;
                        player.power = parseFloat(player.power.toFixed(2));
                        showPower = player.power;
                        player.fireLevel = parseInt(player.power);
                    }
                    else {
                        player.point++;
                    }

                    food.visible = false;
                }
            }
            food.update(context, now);
            food.paint(context);
        }
    });

    if (player.spellcard && playerspellcard.visible) {
        playerspellcard.update(context, now);
        playerspellcard.paint(context);
        bullets.foreach(function () {
            if (this.visible) {
                this.visible = false;
            }
        });
        enemys.foreach(function () {
            if (this.visible) {
                this.visible = false;
                boom(this);
                addfood(this);
            }
        });
    }
    context.drawImage(offcanvasBGClip, 0, 0); //覆盖掉子弹飞出框框的部分
}

//画背景
function drawBackground() {
    context.save();
    context.drawImage(imageBG, 0, 0);
    // context.rect(34, 18, 385, 450);
    //context.clip();//用clip闪屏太严重了。。。
    context.drawImage(offcanvasBG, locBG1.x, locBG1.y);
    context.drawImage(offcanvasBG, locBG2.x, locBG2.y);
    //console.log(locBG1, locBG2);
    //所以用offcanvasBGClip缝补周围的背景...
    context.drawImage(offcanvasBGClip, 0, 0);
    context.strokeRect(34, 18, 385, 450); //移动范围
    context.restore();
}

//右上角显示的数据
function gameShow() {
    context.save();
    context.fillStyle = "white";
    context.font = "italic bold 16px Arial";
    context.fillText(showScore, 505, 90);
    context.fillText(showPlayer, 505, 122);
    context.fillText(showPower.toFixed(2), 505, 145);
    context.restore();
}

function calculateFps() {
    var now = new Date();
    var fps = 1000 / (now - lastTime);
    fps = Math.round(fps);
    lastTime = now;
    return fps;
}

function calculatePpf(pps, fps) {
    var ppf = pps / fps;
    return ppf;
}

Array.prototype.foreach = function (callback) {
    for (var i = 0; i < this.length; i++) {
        callback.apply(this[i], [i]);
    }
};

function boom(sprite) {
    for (var j = 0; j < booms.length; j++) {
        if (!booms[j].visible) {
            booms[j].x = sprite.x - 10;
            booms[j].y = sprite.y - 10;
            booms[j].cellIndex = 0;
            booms[j].visible = true;

            var audio = document.getElementsByTagName("audio");
            for (var i = 0; i < audio.length; i++) {
                if (!sprite.isgood && audio[i].src.indexOf("boom") >= 0 && (audio[i].paused || audio[i].ended)) {
                    audio[i].play();
                    break;
                }
                if (sprite.isgood && audio[i].src.indexOf("biu") >= 0 && (audio[i].paused || audio[i].ended)) {
                    audio[i].play();
                    break;
                }
            }
            break;
        }
    }
}

function playerReborn() {
    player.toLeft = false;
    player.toRight = false;
    player.toTop = false;
    player.toBottom = false;

    player.fire = false;
    player.fireLevel = 1;
    player.power = 1.0;
    player.point = 1;
    showPower = player.power;

    player.lowerSpeed = false;

    player.visible = true;
    player.lastTimeShoot = new Date();
    player.isgood = true;
    player.isGod = true;
    setTimeout(function () {
        player.isGod = false;
    }, 5000);

    player.x = 215;
    player.y = 420;
}

function bossInit() {
    bossboom = false;
    boss.x = 210;
    boss.y = -100;
    boss.isRound = false;
    boss.isgood = false;
    boss.blood = boss.fullBlood;
    boss.visible = false;
}

function addLineBullet(sprite, velocity) {
    //精灵 x坐标 y坐标 x速度 y速度 是否往左 是否往上 旋转角度（向下是0°）
    addbullet(sprite, sprite.x + 16, sprite.y + 25, 0, velocity, false, false, 0);//下
}
function addThreeBullet(sprite, velocity) {
    //精灵 x坐标 y坐标 x速度 y速度 是否往左 是否往上 旋转角度（向下是0°）
    addbullet(sprite, sprite.x + 16, sprite.y + 25, 0, velocity, false, false, 0);//下
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity * Math.tan(10 / 180 * Math.PI), velocity, false, false, -10);//右下
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity * Math.tan(10 / 180 * Math.PI), velocity, true, false, 10);//左下
}
function addCircleBullet(sprite, velocity) {
    //精灵 x坐标 y坐标 x速度 y速度 是否往左 是否往上 旋转角度（向下是0°）
    addbullet(sprite, sprite.x + 16, sprite.y + 25, 0, velocity, false, false, 0);//下
    addbullet(sprite, sprite.x + 16, sprite.y + 25, 0, velocity, false, true, 0);//上
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity, 0, false, false, 90);//右
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity, 0, true, false, 90);//左
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity / Math.SQRT2, velocity / Math.SQRT2, false, false, -45);//右下
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity / Math.SQRT2, velocity / Math.SQRT2, true, false, 45);//左下
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity / Math.SQRT2, velocity / Math.SQRT2, true, true, -45);//左上
    addbullet(sprite, sprite.x + 16, sprite.y + 25, velocity / Math.SQRT2, velocity / Math.SQRT2, false, true, 45);//右上
}
function addFinalBullet(sprite, velocity) {
    //精灵 x坐标 y坐标 x速度 y速度 是否往左 是否往上 旋转角度（向下是0°）
    for (var i = 0; i < 360; i += 10) {
        var rot = i + Math.random() * 360;
        var vx = velocity * Math.sin(rot / 180 * Math.PI);
        var vy = velocity * Math.cos(rot / 180 * Math.PI);
        var isL = false;
        var isU = false;
        if (vx < 0) {
            vx *= -1;
            isL = true;
        } else {
            isL = false;
        }
        if (vy < 0) {
            vy *= -1;
            isU = true;
        } else {
            isU = false;
        }
        addbullet(sprite, sprite.x + 32, sprite.y + 32, vx, vy, isL, isU, -rot);
    }
}
function shoot(sprite) {
    //console.log("shoot");
    if (!sprite.isgood) {
        if (gameTime / 1000 < 60)
            addLineBullet(sprite, 200);
        else if (gameTime / 1000 < 120)
            addThreeBullet(sprite, 200);
        else if (gameTime / 1000 < 200)
            addCircleBullet(sprite, 50);
        else if (sprite.name === "boss")
            addFinalBullet(sprite, 100);
        return;
    }

    if (player.fireLevel === 1) {
        addbullet(sprite, sprite.x + 16, sprite.y - 20);
    }
    else if (player.fireLevel === 2) {
        addbullet(sprite, sprite.x + 6, sprite.y - 20);
        addbullet(sprite, sprite.x + 27, sprite.y - 20);
    }
    else if (player.fireLevel === 3) {
        addbullet(sprite, sprite.x - 5, sprite.y);
        addbullet(sprite, sprite.x + 16, sprite.y - 20);
        addbullet(sprite, sprite.x + 37, sprite.y);
    }
    else {
        addbullet(sprite, sprite.x - 6, sprite.y);
        addbullet(sprite, sprite.x + 9, sprite.y - 20);
        addbullet(sprite, sprite.x + 24, sprite.y - 20);
        addbullet(sprite, sprite.x + 39, sprite.y);
    }
    var audio = document.getElementsByTagName("audio");
    for (var i = 0; i < audio.length; i++) {
        if (audio[i].src.indexOf("shoot") >= 0 && (audio[i].paused || audio[i].ended)) {
            audio[i].play();
            break;
        }
    }
}

function addbullet(sprite, x, y, vx, vy, isLeft, isUp, rotateAngle) {
    for (var j = 0; j < bullets.length; j++) {
        if (!bullets[j].visible) {
            //console.log("addbulletGood");
            if (sprite.isgood) {
                bullets[j].isgood = true;
                bullets[j].x = x || sprite.x;
                bullets[j].y = y || sprite.y;
                bullets[j].velocityY = 1200;

            } else {
                bullets[j].isgood = false;
                bullets[j].x = x || sprite.x + 16;
                bullets[j].y = y || sprite.y;
                // bullets[j].velocityX = vx + 10 * gameTime / 10000; //每隔10s敌机子弹速度增加10像素/s
                // bullets[j].velocityY = vy + 10 * gameTime / 10000; //每隔10s敌机子弹速度增加10像素/s
                bullets[j].velocityX = vx;
                bullets[j].velocityY = vy;
                bullets[j].isleft = !!isLeft; //子弹是否左偏，左偏后面的逻辑要-ppfx
                bullets[j].isup = !!isUp; //子弹是否上偏，上偏后面的逻辑要-ppfy
                bullets[j].rotateAngle = rotateAngle; //子弹旋转角度，度为单位

            }
            bullets[j].visible = true;
            break;
        }
    }
}

function addfood(sprite, type, x, y) {
    for (var j = 0; j < foods.length; j++) {
        if (!foods[j].visible) {
            //console.log("addfoodGood");
            foods[j].x = x || sprite.x + 16;
            foods[j].y = y || sprite.y + 16;
            if (player.power < 5) {
                if (Math.random() > 0.5)
                    foods[j].type = "power";
                else
                    foods[j].type = "point";
            } else {
                foods[j].type = "point";
            }
            if (type)
                foods[j].type = type;
            foods[j].visible = true;
            break;
        }
    }
}

