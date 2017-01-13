var sprites = []; //所有精灵
var player = {}; //自机
var boss = {}; //单面boss
var enemys = []; //所有的敌机
var enemyBlue = []; //蓝色敌机
var enemyRed = []; //红色敌机
var enemyGreen = []; //绿色敌机
var enemyYellow = []; //黄色敌机
var enemyBoss = []; //敌机boss(蝴蝶)
var bullets = []; //子弹
var booms = []; //爆炸

var foods = []; //食物
var enemyNum = 30; //敌机总数
var showScore = 0; //得分
var numOfPlayer = 5; //有几条命
var showPlayer = numOfPlayer;
var showPower = 1.0;

var playerspellcard = {}; //自机符卡


var alreadyLoadCounts = 0;
var Alpha = 0;
var AlphaFlag = 1;
var loadingComplete = false;

var imagep;
var imageenemy;
var imageexplosion;
var imageetama1;
var imageetama2;
var imageplasma;
var imagestg3bg;
var imagebg;
var imageboss;

var imageBGMove;
var imageBG;

var animationFrame;
var fps;
var lastTime = new Date(); //用于计算fps
var lastGameTime = new Date(); //用于计算游戏进度(弄成现在时间减去游戏初始时间会有暂停时游戏时间还在继续的bug)
var gameTime = 0; //游戏进行时间(ms)
var gameOver = false;
var gameWin = false;
var gameStop = false;
var bossboom = false; //boss炸了就不能出现了,为了解决boss的visible问题
var lastenemyTime = new Date();

