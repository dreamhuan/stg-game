//***************************************     定义初始相关变量    ****************************************************
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var p = document.getElementById("fps");
//context.strokeRect(34, 18, 385, 450); //移动范围

var offcanvasBG = document.createElement("canvas");//离屏canvas背景衔接
offcanvasBG.width = canvas.width;
offcanvasBG.height = canvas.height;
var offcontextBG = offcanvasBG.getContext("2d");

var offcanvasBGClip = document.createElement("canvas");//离屏canvas背景边框遮挡
offcanvasBGClip.width = canvas.width;
offcanvasBGClip.height = canvas.height;
var offcontextBGClip = offcanvasBGClip.getContext("2d");

//loading页面显示的三张图片优先加载
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
img1.src = "image/loading/loading.png";
img2.src = "image/loading/sig.png";
img3.src = "image/loading/sig_r.png";

//*******************************************     程序入口    *********************************************************
window.onload = function (e) { //三个图片加载完执行
    loading(); //后台载入资源
    animationFrame = requestNextAnimationFrame(loadingFrame); //前台显示加载页面，进入加载帧
};
