//*******************************************    资源加载界面帧    ****************************************************
//定义资源加载相关变量

function loadingFrame() {
    //console.log("loadingFrame");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.drawImage(img2, 0, 0);
    context.drawImage(img3, img2.width, 0);
    //以下逻辑使文字（img1）在变淡变明之间转换，想不出更好的逻辑了orz
    context.globalAlpha = Alpha;
    if (Alpha < 1 && AlphaFlag) {
        Alpha += 0.02;
    }
    else {
        Alpha -= 0.02;
        AlphaFlag = 0;
    }
    if (Alpha < 0) {
        Alpha = 0;
        AlphaFlag = 1;
    }
    context.drawImage(img1, 415, 375);
    animationFrame = requestNextAnimationFrame(loadingFrame);
    //alreadyLoadCounts是loading.js定义的变量，用于资源计数
    if (alreadyLoadCounts === datas.length) { //判断加载是否完成
        setTimeout(function () { //延迟一下 不然秒加载完多尴尬。。。
            loadingComplete = true; //加载完成
        }, 5000);
    }

    //****************     这里的代码只执行一次  进入游戏前的资源预处理and初始化   ******************
    if (loadingComplete) {
        initSprit(); //初始化精灵

        lastTime = new Date(); //用于计算fps,这一行不能放到外面,不然上面setTimeout的延时严重影响结果(又是1小时的bug...)
        lastGameTime = new Date(); //用于计算游戏进度
        gameTime = 0; //游戏进行时间
        gameOver = false;

        context.globalAlpha = 1;//全局透明度恢复成1.找了一小时的bug...我说怎么没错误也没东西...
        document.getElementById("bgm").play(); //播放背景音

        //画背景相关变量定义以及离屏canvas绘制
        locBG1 = {x: 0, y: 0};//背景图片的位置坐标
        locBG2 = {x: 0, y: -450};//背景图片的位置坐标
        ppsBG = 30;

        imageBGMove = imagestg3bg;
        imageBG = imagebg;

        context.rect(34, 18, 385, 450);

        offcontextBGClip.drawImage(imageBG, 0, 0); //画主背景
        offcontextBGClip.clearRect(34, 18, 385, 450); //挖掉中间的框框用于覆盖

        offcontextBG.drawImage(imageBGMove, 34, 18, 385, 450); //画可移动的背景

        cancelAnimationFrame(animationFrame); //关闭加载界面帧
        animationFrame = requestNextAnimationFrame(ganmeFrame); //进入游戏帧
    }
}

//********************************************    游戏界面帧   ******************************************************
function ganmeFrame() {
    //console.log("gameFrame");

    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.strokeRect(34, 18, 385, 450); //移动范围

    fps = calculateFps();
    if (!(fps && fps > 0 && fps < 100)) //用于处理暂停开始那种一瞬间的fps不稳定情况
        fps = 60;
    p.innerHTML = "fps:" + fps + "<br/>" + "Time:" + parseFloat(gameTime / 1000).toFixed(2) + "(s)";

    //背景移动
    var ppfBG = calculatePpf(ppsBG, fps);
    locBG1.y += ppfBG;
    locBG1.y = Math.round(locBG1.y);
    locBG1.y = locBG1.y > 449 ? -450 : locBG1.y;//背景移出屏幕了补到后面
    locBG2.y += ppfBG;
    locBG2.y = Math.round(locBG2.y);
    locBG2.y = locBG2.y > 449 ? -450 : locBG2.y;//背景移出屏幕了补到后面
    drawBackground();
    gameLoop();
    gameShow();
    animationFrame = requestNextAnimationFrame(ganmeFrame);

    if (gameStop) {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestNextAnimationFrame(gameStopFrame);
    } else if (gameOver) {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestNextAnimationFrame(gameOverFrame);
    } else if (gameWin) {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestNextAnimationFrame(gameWinFrame);
    }
}

//********************************************    游戏暂停帧   *******************************************************
function gameStopFrame() {
    document.getElementById("bgm").pause();
    document.getElementById("boss").pause();
    context.save();
    context.fillStyle = "red";
    context.font = "italic bold 30px Arial";
    context.fillText("Game Stop", 220, 200);
    context.fillText("Press Enter to start", 160, 260);
    context.restore();
}

//********************************************    游戏结束帧   *******************************************************
function gameOverFrame() {
    document.getElementById("bgm").pause();
    document.getElementById("bgm").currentTime = 0; //播放进度设为0(下次play就是重播,不然会接下去)
    document.getElementById("boss").pause();
    document.getElementById("boss").currentTime = 0;
    document.getElementById("gameover").play();
    try {
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var numPiexel = imageData.data.length / 4;
        for (var i = 0; i < numPiexel; i += 1) {
            var avg = Math.round((imageData.data[4 * i] + imageData.data[4 * i + 1] + imageData.data[4 * i + 2]) / 3);
            imageData.data[4 * i] = avg; // R
            imageData.data[4 * i + 1] = avg; // G
            imageData.data[4 * i + 2] = avg; // B
            imageData.data[4 * i + 3] = imageData.data[4 * i + 3]; // A
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(imageData, 0, 0);
    } catch (e) {
        console.log(e);
    } finally {
        context.save();
        context.fillStyle = "red";
        context.font = "italic bold 30px Arial";
        context.fillText("Game Over !!!", 220, 200);
        context.fillText("Press Enter to restart", 160, 260);
        context.restore();
    }
}

//********************************************    游戏获胜帧   *******************************************************
function gameWinFrame() {
    document.getElementById("boss").pause();
    document.getElementById("boss").currentTime = 0; //播放进度设为0(下次play就是重播,不然会接下去)
    document.getElementById("end").play();
    context.save();
    context.fillStyle = "red";
    context.font = "italic bold 30px Arial";
    context.fillText("You Win!", 220, 200);
    context.fillText("Press Enter to restart", 160, 260);
    context.restore();
}