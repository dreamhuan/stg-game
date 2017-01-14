SpriteSheetPainter = function (spritesheet, cells) {
    this.spritesheet = spritesheet;
    this.cells = cells || [];
    this.cellIndex = 0
};

SpriteSheetPainter.prototype = {
    advance: function () {
        if (this.cellIndex == this.cells.length - 1) {
            this.cellIndex = 0;
        }
        else {
            this.cellIndex++;
        }
    },

    paint: function (sprite, context) {
        var cell = this.cells[this.cellIndex];
        context.drawImage(this.spritesheet,
            cell.x, cell.y, cell.w, cell.h,
            sprite.x, sprite.y, cell.w, cell.h);
    }
};


var Sprite = function (name, painter, behaviors) {
    if (name !== undefined) this.name = name;
    if (painter !== undefined) this.painter = painter;
    if (behaviors !== undefined) this.behaviors = behaviors;

    return this;
};

Sprite.prototype = {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    velocityX: 0, //pps
    velocityY: 0, //pps
    fire: false,
    visible: true,
    painter: undefined, // object with paint(sprite, context)
    behaviors: [], // objects with execute(sprite, context, time)

    paint: function (context) {
        if (this.painter !== undefined && this.visible) {
            this.painter.paint(this, context);
        }
    },

    update: function (context, time) {
        for (var i = this.behaviors.length; i > 0; --i) {
            this.behaviors[i - 1].execute(this, context, time);
        }
    }
};

function initSprite() {
    // console.log("initSprite");
//*******************************************   初始化自机   ***********************************************************
    (function initplayer() { //即时执行函数，封装变量作用域
        // console.log("initplayer");
        var spriteSheetPainter = new SpriteSheetPainter(imagep, pCells);
        //var spriteSheetPainterLeft = new SpriteSheetPainter(imagep, pLeftCells);//向左动的精灵表
        //var spriteSheetPainterRight = new SpriteSheetPainter(imagep, pRightCells);//向右动的精灵表
        var runInPlace = {
            lastAdvance: 0,
            PAGEFLIP_INTERVAL: 150,

            execute: function (sprite, context, now) {
                var time = now - this.lastAdvance;
                if (time > this.PAGEFLIP_INTERVAL) {
                    player.painter.advance();
                    this.lastAdvance = now;
                }
            }
        };

        var moveAndShoot = {
            lastMove: 0,

            execute: function (sprite, context, now) {
                if (this.lastMove !== 0) {
                    var pps = sprite.velocityX;//pps  每秒300个像素
                    if (sprite.lowerSpeed)
                        pps = 150;
                    var ppf = calculatePpf(pps, fps);
                    if (sprite.toLeft && sprite.x > 35)
                        sprite.x -= ppf;
                    if (sprite.toRight && sprite.x < 385)
                        sprite.x += ppf;
                    if (sprite.toTop && sprite.y > 20)
                        sprite.y -= ppf;
                    if (sprite.toBottom && sprite.y < 420)
                        sprite.y += ppf;
                    if (sprite.fire && now - sprite.lastTimeShoot > 100) {
                        shoot(sprite);
                        sprite.lastTimeShoot = now;
                    }
                }
                this.lastMove = now;
            }
        };

        var plarerBehavior = [runInPlace, moveAndShoot];
        player = new Sprite("player", spriteSheetPainter, plarerBehavior);

        player.width = 32;
        player.height = 48;
        player.velocityX = 300; //pps
        player.velocityY = 300; //pps

        player.toLeft = false;
        player.toRight = false;
        player.toTop = false;
        player.toBottom = false;

        player.lowerSpeed = false;

        player.fire = false;
        player.fireLevel = 1;
        player.power = 1.0;
        player.point = 1;

        player.visible = true;
        player.lastTimeShoot = new Date(); //射击时绘制子弹频率
        player.isgood = true; //射击时绘制子弹要用
        player.isGod = true;
        setTimeout(function () {
            player.isGod = false;
        }, 5000);

        player.x = 215;
        player.y = 420;

        //自机判定点,暂时没用上,用了硬编码
        player.realX = player.x + player.width / 2;
        player.realY = player.y + player.height / 2;

    })();


//*******************************************   初始化敌机   ***********************************************************
    (function initenemy() {
        var spriteSheetPainter = new SpriteSheetPainter(imageenemy, enemyBlueCells);
        var runInPlace = {
            PAGEFLIP_INTERVAL: 150,

            execute: function (sprite, context, now) {
                var time = now - sprite.lastAdvance;
                if (time > this.PAGEFLIP_INTERVAL) {
                    sprite.painter.advance();
                    sprite.lastAdvance = now;
                }
            }
        };

        var moveAndShoot = {
            execute: function (sprite, context, now) {

                var pps = sprite.velocityX = 100;
                var ppf = calculatePpf(pps, fps);

                if (now - sprite.lastMoveTime > 500) {
                    sprite.moveDirFlag = Math.random() > 0.4 ? (Math.random() > 0.6 ? 0 : 1) : -1;
                    sprite.lastMoveTime = now;
                }
                sprite.x += sprite.moveDirFlag * ppf;
                sprite.y += ppf;
                if (sprite.x < 0 ||
                    sprite.y < 0 ||
                    sprite.x > 420 ||
                    sprite.y > canvas.height) {
                    sprite.visible = false;
                }
                // if (now - sprite.lastTimeShoot > 500 && Math.random() > 0.5) {
                //     shoot(sprite);
                //     sprite.lastTimeShoot = now;
                // }
                // 敌机射击间隔随时间改变y(ms) = (1000 * 100) / (T(s) + 100)
                if (now - sprite.lastTimeShoot > 1000 * 100 / (gameTime / 1000 + 100) && Math.random() > 0.5) {
                    shoot(sprite);
                    sprite.lastTimeShoot = now;
                }
            }
        };
        var enemyBehavior = [runInPlace, moveAndShoot];

        for (var i = 0; i < enemyNum; i++) {
            var enemy = new Sprite("enemy", spriteSheetPainter, enemyBehavior);
            enemy.lastTimeShoot = new Date();
            enemy.lastAdvance = 0;
            enemy.x = Math.random() * 385 + 34;
            enemy.y = 0;
            enemy.blood = 100;
            enemy.lastMoveTime = new Date();
            enemy.moveDirFlag = 0; //移动方向 敌机移动行为用到
            enemy.isgood = false; //射击时绘制子弹用到
            enemy.visible = false;
            enemys.push(enemy);
        }
    })();


//*******************************************   初始化子弹   ***********************************************************
    (function initbullet() {
        // console.log("initbullet");
        var bulletWidth = 70;
        var bulletHeight = 70;

        var bulletPainter = {
            paint: function (sprite, context) {
                context.save();
                context.translate(sprite.x, sprite.y);
                if (sprite.isgood) {
                    context.drawImage(imageplasma, -70 / 2 + 1, -70 / 2 + 1, 70, 70);
                } else {
                    context.rotate(sprite.rotateAngle / 180 * Math.PI);
                    context.drawImage(imageetama1, 131, 65, 10, 15, -10 / 2 + 1, -15 / 2 + 1, 10, 15);
                }
                context.restore();
                //console.log("drawbullet");
            }
        };

        var bulletBehavior = [{
            execute: function (sprite, context, now) {
                var ppsx = sprite.velocityX;
                var ppsy = sprite.velocityY;
                var ppfx = calculatePpf(ppsx, fps);
                var ppfy = calculatePpf(ppsy, fps);
                if (sprite.isgood)
                    sprite.y -= ppfy;
                else {
                    if (sprite.isleft)
                        sprite.x -= ppfx;
                    else
                        sprite.x += ppfx;
                    if (sprite.isup)
                        sprite.y -= ppfy;
                    else
                        sprite.y += ppfy;
                }

                if (sprite.x < 30 ||
                    sprite.x > 420 ||
                    sprite.y < 0 ||
                    sprite.y > canvas.height) {
                    sprite.visible = false;
                }
                //console.log("bulletmove");
            }
        }];

        for (var i = 0; i < 1000; i++) {
            var bullet = new Sprite("bullet", bulletPainter, bulletBehavior);
            bullet.visible = false;
            bullet.width = bulletWidth;
            bullet.height = bulletHeight;
            bullet.isgood = true;
            bullets.push(bullet);
        }
    })();


//*******************************************   初始化炸弹   ***********************************************************
    (function initboom() {
        var boomPainter = {
            spritesheet: imageexplosion,
            cells: explosionCells,

            advance: function (sprite) {
                if (sprite.cellIndex == this.cells.length - 1) {
                    sprite.cellIndex = 0;
                    sprite.visible = false; //一波炸完爆炸就不可见了
                }
                else {
                    sprite.cellIndex++;
                }
            },

            paint: function (sprite, context) {
                var cell = this.cells[sprite.cellIndex];
                context.drawImage(this.spritesheet,
                    cell.x, cell.y, cell.w, cell.h,
                    sprite.x, sprite.y, cell.w, cell.h);
                //console.log("boom");
            }
        };

        var boomBehavior = [{
            PAGEFLIP_INTERVAL: 50,

            execute: function (sprite, context, now) {
                var time = now - sprite.lastAdvance;
                if (time > this.PAGEFLIP_INTERVAL) {
                    sprite.painter.advance(sprite); //改了一下，可以传个参数进去
                    sprite.lastAdvance = now;
                }
            }
        }];

        for (var i = 0; i < enemyNum; i++) {
            var boom = new Sprite("boom", boomPainter, boomBehavior);
            boom.visible = false;
            boom.cellIndex = 0;
            boom.lastAdvance = 0;

            boom.x = 0;
            boom.y = 0;
            booms.push(boom);
        }
    })();


//*******************************************   初始化食物   ***********************************************************
    (function initfood() {
        var foodPainter = {
            paint: function (sprite, context) {
                context.save();
                context.translate(sprite.x, sprite.y);
                if (sprite.type === "point") {
                    context.drawImage(imageetama2, 17, 209, 15, 15, -15 / 2 + 1, -15 / 2 + 1, 15, 15);
                } else {
                    context.drawImage(imageetama2, 1, 209, 15, 15, -15 / 2 + 1, -15 / 2 + 1, 15, 15);
                }
                context.restore();
                //console.log("drawbullet");
            }
        };

        var foodBehavior = [{
            execute: function (sprite, context, now) {
                var pps = sprite.velocityY;
                var ppf = calculatePpf(pps, fps);
                sprite.y += ppf;
                if (sprite.x < 30 ||
                    sprite.x > 420 ||
                    sprite.y < 0 ||
                    sprite.y > canvas.height) {
                    sprite.visible = false;
                }
                //console.log("foodmove");
            }
        }];

        for (var i = 0; i < enemyNum; i++) {
            var food = new Sprite("food", foodPainter, foodBehavior);
            food.type = "point"; //point分数,power能量
            food.x = 0;
            food.y = 0;
            food.velocityY = 120;
            food.visible = false;
            foods.push(food);
        }
    })();


//*****************************************   初始化自机符卡   *********************************************************
    (function initPlayerspellcard() {
        var playerspellcardPainter = {
            paint: function (sprite, context) {
                context.save();
                context.translate(sprite.x + 10, sprite.y + 10);
                context.rotate(sprite.rotateAngle / 180 * Math.PI);
                context.drawImage(imageetama2, 130, 81, 127, 127, -(127 + sprite.r) / 2, -(127 + sprite.r) / 2, 127 + sprite.r, 127 + sprite.r);
                context.restore();
            }
        };

        var playerspellcardBehavior = [{
            execute: function (sprite, context, now) {
                var dratateAngle = 360; //每秒转360度
                var dr = 258; //每秒直径增加258
                sprite.rotateAngle += calculatePpf(dratateAngle, fps);
                sprite.r += calculatePpf(dr, fps);
                if (sprite.rotateAngle > 360) { //1s结束 转了一圈,直径增加258
                    sprite.rotateAngle = 0;
                    sprite.r = 0;
                    sprite.visible = false; //转完后visible改回false
                }
            }
        }];

        playerspellcard = new Sprite("playerspellcard", playerspellcardPainter, playerspellcardBehavior);
        playerspellcard.x = 215;
        playerspellcard.y = 220;
        playerspellcard.rotateAngle = 0;
        playerspellcard.r = 0;
        playerspellcard.visible = false;
    })();


//*******************************************   初始化BOSS   ***********************************************************
    (function initboss() {
        console.log("initboss");

        var spriteSheetPainter = new SpriteSheetPainter(imageboss, bossCells);
        var roundAndShoot = {
            lastAdvance: 0,
            PAGEFLIP_INTERVAL: 150,
            lastTimeShoot: 0,

            execute: function (sprite, context, now) {
                if (sprite.isRound) {
                    var time = now - this.lastAdvance;
                    if (time > this.PAGEFLIP_INTERVAL) {
                        sprite.painter.advance();
                        this.lastAdvance = now;
                        if (now - this.lastTimeShoot > 1000 * 100 / (gameTime / 1000 + 100)) {
                            shoot(sprite);
                            this.lastTimeShoot = now;
                        }
                    }
                }
            }
        };

        var move = {
            lastMove: 0,

            execute: function (sprite, context, now) {
                if (this.lastMove !== 0) {
                    var pps = sprite.velocityX = 100;//pps  每秒100个像素
                    var ppf = calculatePpf(pps, fps);
                    if (sprite.y < 100)
                        sprite.y += ppf;
                    else
                        setTimeout(function(){sprite.isRound = true}, 1000);

                }
                this.lastMove = now;
            }
        };

        var bossBehavior = [roundAndShoot, move];
        boss = new Sprite("boss", spriteSheetPainter, bossBehavior);

        boss.x = 210;
        boss.y = -100;
        boss.isRound = false;
        boss.isgood = false; //射击时绘制子弹用到
        boss.fullBlood = 30000;
        boss.blood = boss.fullBlood;
        boss.visible = false;

    })();
}
