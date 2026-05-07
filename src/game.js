// ================================
// PIXEL WORLD RPG — Mega Update
// Login, Castle Story, Music,
// Battle Pass, Mobile Fix
// ================================

var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)||navigator.maxTouchPoints>1;

var config = {
    type:Phaser.AUTO,
    backgroundColor:'#1a1a2e',
    physics:{ default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
    scale:{ mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_BOTH, width:1280, height:720 },
    input:{ touch:true, activePointers:4 },
    scene:{ preload:preload, create:create, update:update }
};
var game = new Phaser.Game(config);

// ================================
// CLASSES  (18 total)
// ================================
var CLASSES = {
    warrior:    {name:'Warrior',    icon:'⚔️', hp:220,speed:155,damage:35,range:80, ability:'Shield Bash',   abilityIcon:'🛡️',cd:5000, atk:700},
    archer:     {name:'Archer',     icon:'🏹', hp:110,speed:285,damage:28,range:200,ability:'Arrow Rain',    abilityIcon:'🏹',cd:4000, atk:500},
    mage:       {name:'Mage',       icon:'🧙', hp:80, speed:200,damage:70,range:150,ability:'Fireball',      abilityIcon:'🔥',cd:6000, atk:900},
    rogue:      {name:'Rogue',      icon:'🗡️',hp:110,speed:265,damage:50,range:70, ability:'Vanish',        abilityIcon:'👁️',cd:8000,atk:400},
    paladin:    {name:'Paladin',    icon:'⚜️',hp:180,speed:155,damage:28,range:90, ability:'Holy Aura',     abilityIcon:'✨',cd:7000, atk:800},
    necromancer:{name:'Necromancer',icon:'💀', hp:90, speed:195,damage:40,range:130,ability:'Raise Dead',    abilityIcon:'☠️',cd:9000, atk:800},
    berserker:  {name:'Berserker',  icon:'🪓', hp:180,speed:195,damage:55,range:85, ability:'Berserk Rage',  abilityIcon:'😤',cd:10000,atk:500},
    ranger:     {name:'Ranger',     icon:'🌿', hp:130,speed:245,damage:32,range:160,ability:'Wolf Pack',     abilityIcon:'🐺',cd:12000,atk:600},
    knight:     {name:'Knight',     icon:'🛡️',hp:260,speed:138,damage:40,range:88, ability:'Charge',        abilityIcon:'💨',cd:6000, atk:700},
    monk:       {name:'Monk',       icon:'🥊', hp:125,speed:278,damage:28,range:62, ability:'Combo Strike',  abilityIcon:'👊',cd:4000, atk:280},
    shaman:     {name:'Shaman',     icon:'⚡', hp:98, speed:195,damage:58,range:145,ability:'Lightning Storm',abilityIcon:'🌩️',cd:7000,atk:880},
    druid:      {name:'Druid',      icon:'🌙', hp:150,speed:215,damage:38,range:120,ability:'Nature Heal',   abilityIcon:'🌿',cd:6000, atk:650},
    assassin:   {name:'Assassin',   icon:'🥷', hp:100,speed:310,damage:60,range:75, ability:'Chain Strike',  abilityIcon:'⚡',cd:5000, atk:350},
    warlord:    {name:'Warlord',    icon:'👑', hp:200,speed:170,damage:45,range:95, ability:'Rally Army',    abilityIcon:'⚔️',cd:8000, atk:750},
    archmage:   {name:'Archmage',   icon:'🔮', hp:70, speed:185,damage:90,range:200,ability:'Meteor Strike', abilityIcon:'💥',cd:12000,atk:1000},
    vampire:    {name:'Vampire',    icon:'🧛', hp:135,speed:228,damage:44,range:78, ability:'Blood Drain',   abilityIcon:'🩸',cd:8000, atk:550},
    gunslinger: {name:'Gunslinger', icon:'🔫', hp:108,speed:258,damage:40,range:225,ability:'Bullet Storm',  abilityIcon:'💥',cd:5500, atk:420},
    bard:       {name:'Bard',       icon:'🎵', hp:102,speed:208,damage:24,range:115,ability:'Battle Hymn',   abilityIcon:'🎶',cd:9000, atk:720},
    // BATTLE PASS EXCLUSIVE — can never be bought!
    phantom:    {name:'Phantom',    icon:'🌫️',hp:90, speed:320,damage:65,range:95, ability:'Phase Strike',  abilityIcon:'💨',cd:5000, atk:380},
    dragonrider:{name:'Dragon Rider',icon:'🐲',hp:200,speed:185,damage:80,range:180,ability:'Dragon Breath', abilityIcon:'🔥',cd:8000, atk:600}
};

// ================================
// MONSTER POOLS
// ================================
var POOL_ADV = {
    goblin:   {name:'👹 Goblin',  color:0xff4444,size:36,hp:30, speed:80, dmg:8, xp:20,score:10,gold:5 },
    troll:    {name:'👺 Troll',   color:0x44aa44,size:58,hp:90, speed:45, dmg:22,xp:45,score:28,gold:15},
    skeleton: {name:'💀 Skeleton',color:0xcccccc,size:36,hp:40, speed:115,dmg:14,xp:30,score:20,gold:8 },
    demon:    {name:'😈 Demon',   color:0xaa00ff,size:44,hp:65, speed:95, dmg:26,xp:55,score:38,gold:20},
    orc:      {name:'🗡️ Orc',    color:0x886600,size:50,hp:70, speed:65, dmg:18,xp:38,score:25,gold:12}
};
var POOL_SRV = {
    firesprite:{name:'🔥 Fire Sprite',color:0xff6600,size:34,hp:35,speed:100,dmg:12,xp:25,score:15,gold:6},
    sandworm:  {name:'🐛 Sand Worm', color:0xaa7700,size:52,hp:80,speed:50, dmg:20,xp:40,score:26,gold:14},
    lavabeast: {name:'🌋 Lava Beast',color:0xff2200,size:46,hp:70,speed:70, dmg:28,xp:50,score:34,gold:18},
    scorpion:  {name:'🦂 Scorpion', color:0xcc8800,size:38,hp:45,speed:110,dmg:18,xp:35,score:22,gold:10}
};
var POOL_BRS = {
    darkspirit:{name:'👻 Dark Spirit',color:0x6600aa,size:38,hp:50,speed:120,dmg:20,xp:38,score:28,gold:12},
    boneknight:{name:'⚔️ Bone Knight',color:0xbbbbbb,size:44,hp:85,speed:60, dmg:25,xp:48,score:32,gold:16},
    voidcreep: {name:'🌑 Void Creep', color:0x110033,size:40,hp:55,speed:105,dmg:22,xp:42,score:30,gold:14}
};
var POOL_PVP = {};
var POOL_SHADOW = {
    wraith: {name:'👻 Wraith',color:0x8888ff,size:38,hp:55,speed:125,dmg:20,xp:42,score:32,gold:15},
    vampire:{name:'🧛 Vampire',color:0xaa0044,size:42,hp:75,speed:88, dmg:28,xp:55,score:44,gold:20},
    banshee:{name:'🌀 Banshee',color:0x00aaff,size:34,hp:38,speed:155,dmg:32,xp:48,score:36,gold:18},
    lich:   {name:'☠️ Lich',  color:0x440088,size:50,hp:110,speed:58,dmg:38,xp:75,score:58,gold:28}
};
// STORY — CASTLE POOLS
var POOL_CASTLE = {
    guard:   {name:'🛡️ Castle Guard',  color:0x8888bb,size:40,hp:45,speed:85, dmg:14,xp:35,score:22,gold:10},
    soldier: {name:'⚔️ Soldier',       color:0x6666aa,size:38,hp:35,speed:95, dmg:12,xp:28,score:18,gold:8 },
    archer_g:{name:'🏹 Guard Archer',  color:0x4466bb,size:34,hp:28,speed:110,dmg:16,xp:32,score:20,gold:9 }
};
var POOL_CASTLE_INNER = {
    elite:   {name:'⚔️ Elite Guard',   color:0x4444cc,size:44,hp:70,speed:75, dmg:22,xp:50,score:35,gold:15},
    mage_g:  {name:'🔮 Court Mage',    color:0x8844cc,size:40,hp:55,speed:88, dmg:28,xp:55,score:38,gold:18},
    heavy:   {name:'🪖 Heavy Knight',  color:0x334466,size:50,hp:95,speed:55, dmg:30,xp:62,score:44,gold:22}
};
var POOL_CASTLE_DARK = {
    shadow_k:{name:'🌑 Shadow Knight',color:0x222255,size:46,hp:80,speed:70, dmg:25,xp:58,score:40,gold:18},
    dark_mage:{name:'🔮 Dark Mage',   color:0x440066,size:38,hp:60,speed:90, dmg:32,xp:65,score:45,gold:20},
    void_guard:{name:'👁️ Void Guard', color:0x110022,size:42,hp:70,speed:80, dmg:28,xp:60,score:42,gold:19}
};

// ================================
// BOSSES
// ================================
var BOSS_ADV = {name:'🐉 Dragon King',  bc:0x660000,ec:0xff0000,mc:0xffff00,bar:0xff0000,hp:600,speed:55,xp:400,gold:200};
var BOSS_SRV = {name:'🌋 Lava Titan',   bc:0xff4400,ec:0xffff00,mc:0xff8800,bar:0xff6600,hp:400,speed:45,xp:300,gold:150};
var BOSS_RUSH = [
    {name:'👻 Shadow Wraith',bc:0x220044,ec:0xaa00ff,mc:0x8800ff,bar:0xaa00ff,hp:300,speed:90,xp:200,gold:100},
    {name:'🧊 Frost Giant',  bc:0x003366,ec:0x00ffff,mc:0x0088ff,bar:0x00ffff,hp:450,speed:50,xp:280,gold:140},
    {name:'⚡ Storm Lord',   bc:0x443300,ec:0xffff00,mc:0xffaa00,bar:0xffff00,hp:550,speed:80,xp:350,gold:180},
    {name:'🌑 Void Master',  bc:0x000022,ec:0xff00ff,mc:0xaa00aa,bar:0xff00ff,hp:650,speed:70,xp:420,gold:220},
    {name:'💀 Death Emperor',bc:0x220000,ec:0xff0000,mc:0x880000,bar:0xff0000,hp:800,speed:65,xp:500,gold:300}
];
// STORY BOSSES
var BOSS_VEX         = {name:'⚔️ Commander Vex',   bc:0x2200aa,ec:0xaa88ff,mc:0xffffff,bar:0x8844ff,hp:500,speed:70,xp:350,gold:180};
var BOSS_SHADOW_MASTER={name:'🌑 Shadow Master',    bc:0x110033,ec:0xff00ff,mc:0x880088,bar:0xcc00cc,hp:650,speed:80,xp:420,gold:220};
var BOSS_DARK_KING   = {name:'👁️ The Dark King',   bc:0x000000,ec:0xff0000,mc:0xffcc00,bar:0xff2200,hp:900,speed:65,xp:600,gold:400};

// ================================
// QUESTS
// ================================
var QUESTS = [
    {id:'q1',desc:'Kill 5 Goblins',   type:'kill',monster:'goblin',  target:5, reward:60, xpR:50},
    {id:'q2',desc:'Kill 3 Trolls',    type:'kill',monster:'troll',   target:3, reward:80, xpR:75},
    {id:'q3',desc:'Kill 4 Skeletons', type:'kill',monster:'skeleton',target:4, reward:70, xpR:60},
    {id:'q4',desc:'Collect 3 Potions',type:'collect',                target:3, reward:50, xpR:40},
    {id:'q5',desc:'Reach Level 3',    type:'level',                  target:3, reward:150,xpR:100},
    {id:'q6',desc:'Defeat the Boss',  type:'boss',                   target:1, reward:500,xpR:400},
    {id:'q7',desc:'Survive 2 minutes',type:'survive',                target:120,reward:200,xpR:150},
    {id:'q8',desc:'Score 500 pts',    type:'score',                  target:500,reward:180,xpR:120}
];

// ================================
// STORY DATA — Castle / 3 Chapters
// ================================
var STORY_DATA = [
  {
    num:1, title:'📖 Ch.1: The Castle Gates', color:'#88aaff', npcId:'messenger',
    dialog:[
      {speaker:'📜 Messenger Lex', portrait:'📜', text:'"Brave hero! The Unknown Leader has locked down the castle. His trained guards block every entrance..."'},
      {speaker:'📜 Messenger Lex', portrait:'📜', text:'"Fight through the courtyard guards to breach the outer walls. We need to find out who this Unknown Leader really is!"'},
      {speaker:'📜 Messenger Lex', portrait:'📜', text:'"Defeat 10 Castle Guards and 5 Soldiers to clear the courtyard. Good luck — these men are loyal and well-armed! ⚔️"'}
    ],
    objectives:[
      {id:'kill_guard',   desc:'Defeat 10 Castle Guards',type:'kill',monster:'guard',   target:10,n:0,done:false},
      {id:'kill_soldier', desc:'Defeat 5 Soldiers',      type:'kill',monster:'soldier', target:5, n:0,done:false}
    ],
    pool:'castle', reward:300, rewardMsg:'🏰 Courtyard breached! +300 gold!'
  },
  {
    num:2, title:'📖 Ch.2: The Dark Hall', color:'#cc88ff', npcId:'spy',
    dialog:[
      {speaker:'🕵️ Spy Mira', portrait:'🕵️', text:'"You made it inside! The halls swarm with the Unknown Leader\'s elite forces. This is where the real fight begins..."'},
      {speaker:'🕵️ Spy Mira', portrait:'🕵️', text:'"His right-hand man, Commander Vex, is just ahead. Once you clear the elite guards, he will face you himself..."'},
      {speaker:'🕵️ Spy Mira', portrait:'🕵️', text:'"Watch out — when Vex appears, he brings loyal soldiers. Take out his men, then finish him! 💀"'}
    ],
    objectives:[
      {id:'w1_elite',      desc:'Clear the Hall — Elite Guards (Wave 1)', type:'storywave',wave:1,target:8, n:0,done:false},
      {id:'w2_vex_minions',desc:'Defeat Vex\'s Soldiers (Wave 2)',        type:'storywave',wave:2,target:4, n:0,done:false},
      {id:'kill_vex',      desc:'Defeat Commander Vex',                   type:'storyboss',bossKey:'vex',   target:1,n:0,done:false}
    ],
    pool:'castle_inner', reward:400, rewardMsg:'⚔️ Commander Vex defeated! +400 gold!'
  },
  {
    num:3, title:'📖 Ch.3: The Final Truth', color:'#ff8844', npcId:'prisoner',
    dialog:[
      {speaker:'⚔️ Sir Owen', portrait:'⚔️', text:'"You found me! I was captured because I got too close to the truth. I know who the Unknown Leader is — but his Shadow Master is in your way..."'},
      {speaker:'⚔️ Sir Owen', portrait:'⚔️', text:'"The Shadow Master will summon wave after wave of darkness. Survive it all — defeat him — and the Unknown Leader will have nowhere to hide..."'},
      {speaker:'⚔️ Sir Owen', portrait:'⚔️', text:'"When the Shadow Master falls, the truth will be revealed. The fate of the realm rests with you! 🏆"'}
    ],
    objectives:[
      {id:'w1_dark',    desc:'Defeat Shadow Knights (Wave 1)',      type:'storywave',wave:1,target:10,n:0,done:false},
      {id:'w2_minions', desc:'Defeat Shadow Master\'s Minions (Wave 2)',type:'storywave',wave:2,target:8, n:0,done:false},
      {id:'kill_sm',    desc:'Defeat the Shadow Master (Wave 3)',   type:'storyboss',bossKey:'shadow_master',target:1,n:0,done:false},
      {id:'kill_dk',    desc:'Defeat The Dark King (Final Wave)',   type:'storyboss',bossKey:'dark_king',   target:1,n:0,done:false}
    ],
    pool:'castle_dark', reward:1000, rewardMsg:'🏆 The Dark King is defeated! Title: Castle Breaker!'
  }
];

// ================================
// BATTLE PASS
// ================================
var PASS_REWARDS = [
  {lv:1,  free:{type:'gold',  amount:100},     pass:{type:'title', value:'Realm Wanderer'}},
  {lv:2,  free:{type:'title', value:'Adventurer'}, pass:{type:'gold',  amount:200}},
  {lv:3,  free:{type:'gold',  amount:150},     pass:{type:'class', value:'phantom'}},
  {lv:4,  free:{type:'title', value:'Monster Hunter'}, pass:{type:'gold',amount:250}},
  {lv:5,  free:{type:'gold',  amount:200},     pass:{type:'title', value:'Shadow Walker'}},
  {lv:6,  free:{type:'title', value:'Guard Slayer'}, pass:{type:'class',value:'dragonrider'}},
  {lv:7,  free:{type:'gold',  amount:250},     pass:{type:'title', value:'Dragon Friend'}},
  {lv:8,  free:{type:'title', value:'Castle Breaker'}, pass:{type:'gold',amount:500}},
  {lv:9,  free:{type:'gold',  amount:300},     pass:{type:'title', value:'Realm Guardian'}},
  {lv:10, free:{type:'title', value:'Legend'},  pass:{type:'gold',  amount:1000}}
];
var PASS_XP_PER_LEVEL = 500;

// ================================
// MUSIC SYSTEM
// ================================
var MUS = {
    _ctx:null, _gain:null, _muted:false, _theme:'', _timer:null, _pos:0,
    THEMES:{
        menu:[
            [440,.35,'sine'],[523,.35,'sine'],[659,.35,'sine'],[784,.35,'sine'],
            [659,.35,'sine'],[523,.35,'sine'],[440,.7,'sine'],[392,.35,'sine'],
            [349,.35,'sine'],[440,.35,'sine'],[523,.35,'sine'],[440,.7,'sine']
        ],
        combat:[
            [330,.14,'square'],[392,.14,'square'],[494,.14,'square'],[440,.14,'square'],
            [330,.14,'square'],[294,.28,'square'],[330,.14,'square'],[392,.28,'square'],
            [494,.14,'square'],[587,.14,'square'],[494,.14,'square'],[440,.28,'square']
        ],
        boss:[
            [110,.18,'sawtooth'],[110,.09,'sawtooth'],[147,.18,'sawtooth'],[131,.36,'sawtooth'],
            [98,.18,'sawtooth'],[98,.09,'sawtooth'],[110,.18,'sawtooth'],[131,.54,'sawtooth'],
            [110,.18,'sawtooth'],[131,.18,'sawtooth'],[147,.18,'sawtooth'],[165,.54,'sawtooth']
        ],
        story:[
            [523,.45,'sine'],[659,.45,'sine'],[784,.45,'sine'],[880,.9,'sine'],
            [784,.45,'sine'],[698,.45,'sine'],[659,.45,'sine'],[523,.9,'sine'],
            [494,.45,'sine'],[587,.45,'sine'],[659,.45,'sine'],[784,.9,'sine']
        ]
    },
    _note:function(f,d,t){
        if(!this._ctx||this._muted)return;
        var o=this._ctx.createOscillator(),g=this._ctx.createGain();
        o.type=t||'square';o.frequency.value=f;
        g.gain.setValueAtTime(0.22,this._ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,this._ctx.currentTime+d);
        o.connect(g);g.connect(this._gain);
        o.start();o.stop(this._ctx.currentTime+d+0.05);
    },
    init:function(){
        try{
            this._ctx=new(AudioContext||webkitAudioContext)();
            this._gain=this._ctx.createGain();
            this._gain.gain.value=0.08;
            this._gain.connect(this._ctx.destination);
        }catch(e){}
    },
    play:function(theme){
        var self=this;
        if(!this._ctx)this.init();
        if(!this._ctx)return;
        if(this._ctx.state==='suspended')this._ctx.resume();
        if(this._theme===theme)return;
        this.stop();
        this._theme=theme;this._pos=0;
        var notes=this.THEMES[theme];if(!notes)return;
        function next(){
            if(self._theme!==theme)return;
            var n=notes[self._pos%notes.length];
            self._note(n[0],n[1],n[2]);
            self._pos++;
            self._timer=setTimeout(next,n[1]*1000+8);
        }
        next();
    },
    stop:function(){this._theme='';if(this._timer)clearTimeout(this._timer);},
    toggle:function(){
        this._muted=!this._muted;
        if(this._gain)this._gain.gain.value=this._muted?0:0.08;
        var btn=document.getElementById('musicBtn');
        if(btn)btn.textContent=this._muted?'🔇 Music Off':'🔊 Music On';
        return this._muted;
    },
    setTheme:function(t){if(this._theme!==t)this.play(t);}
};

// ================================
// GAME STATE
// ================================
var scene,player,cursors,wasd,shiftKey;
var enemies,potions,portals;
var minions=[],wolfPets=[];
var boss=null,bossHPBar,bossHPBg,bossTxt;
var bossSpawned=false;
var gameStarted=false;
var selectedClass='warrior',selectedMode='adventure';
var pClass;
var skinColor=0x4488ff;
var playerFacing=1;
var otherPlayers={};
var jsActive=false,jsDX=0,jsDY=0,jsX=0,jsY=0;
var pH=100,pMaxH=100,pXP=0,pLv=1,pSpd=200,pDmg=20,pRange=80;
var xpNext=100,score=0,gold=0;
var lastHit=0,lastAtk=0,lastAbi=0;
var pName='Hero';
var inv=[],invOpen=false,chatOpen=false;
var invisible=false,berserking=false;
var stamina=100,maxSta=100,staminaBar;
var dim=0,inShadow=false;
var dimOverlay,nightOverlay;
var shadowTiles=[],normalTiles=[],portalCD=false;
var activeQuests=[],questStats={kills:{},bossKills:0,surviveTime:0};
var tombs=[],survTimer=0,dayTime=0,timeTxt;
var hpBar,hpText,xpBar,xpText,lvTxt,scoreTxt,goldTxt,nameTxt;
var invPanel,invTexts=[];
var atkIndicator;
var tSz=64,mW=30,mH=28;
var curPool=POOL_ADV;
var myId=null,myRef=null,playersRef=null,chatRef=null,tombsRef=null,pvpRef=null;
var lastSent=0;
var wave=0,waveTotal=0,waveKilled=0;
var rushIdx=0;
// Story
var storyMode=false,storyChapter=0;
var storyNPCList=[],storyNearNPC=null,storyNPCPrompt=null;
var storyObjProgress=[];
var storyDialogActive=false,storyChapterComplete=false,storyDone=false;
var storyWave=0,storyWaveKills=0,storyWaveTarget=0;
var storyBossPhase=0; // for ch3: 0=shadow_master 1=dark_king
var castleTiles=[];
var accessoryOverlay=null;
// Pass & titles
var passXP=0,passLevel=0,passUnlocked=false;
var playerTitles=[],activeTitle='';

// ================================
// SOUNDS
// ================================
function tone(f,d,t){try{var c=new(AudioContext||webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f;g.gain.setValueAtTime(0.3,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);o.start(c.currentTime);o.stop(c.currentTime+d);}catch(e){}}
var S={
    hit:  function(){tone(150,.1,'square');},
    atk:  function(){tone(220,.06,'sawtooth');},
    die:  function(){tone(80,.2,'sawtooth');},
    lvup: function(){tone(523,.1,'sine');setTimeout(function(){tone(659,.1,'sine');},100);setTimeout(function(){tone(784,.2,'sine');},200);},
    pick: function(){tone(600,.08,'sine');},
    save: function(){tone(523,.1,'sine');setTimeout(function(){tone(659,.1,'sine');},120);setTimeout(function(){tone(880,.2,'sine');},240);},
    abi:  function(){tone(300,.3,'square');},
    port: function(){tone(200,.2,'sine');setTimeout(function(){tone(400,.3,'sine');},200);},
    quest:function(){tone(660,.1,'sine');setTimeout(function(){tone(880,.2,'sine');},150);},
    boss: function(){tone(100,.5,'sawtooth');setTimeout(function(){tone(80,.5,'sawtooth');},300);},
    wave: function(){tone(440,.1,'sine');setTimeout(function(){tone(550,.1,'sine');},100);setTimeout(function(){tone(660,.2,'sine');},200);},
    over: function(){tone(400,.4,'sine');setTimeout(function(){tone(350,.4,'sine');},400);setTimeout(function(){tone(200,.8,'sine');},1600);},
    gold: function(){tone(700,.05,'sine');setTimeout(function(){tone(900,.1,'sine');},60);},
    story:function(){tone(440,.1,'sine');setTimeout(function(){tone(660,.15,'sine');},120);setTimeout(function(){tone(880,.2,'sine');},260);setTimeout(function(){tone(1100,.3,'sine');},420);}
};

// ================================
// DOM HELPERS
// ================================
function el(id){return document.getElementById(id);}
function setText(id,t){var e=el(id);if(e)e.textContent=t;}
function show(id){var e=el(id);if(e)e.style.display='block';}
function hide(id){var e=el(id);if(e)e.style.display='none';}

// ================================
// PRELOAD
// ================================
function preload(){console.log('Loading...');}

// ================================
// CREATE
// ================================
function create(){
    scene=this;loadGame();initQuests();
    var chk=scene.time.addEvent({delay:100,loop:true,callback:function(){if(window.gameStarted){chk.remove();startGame();}}});
}

// ================================
// QUESTS
// ================================
function initQuests(){
    activeQuests=QUESTS.slice(0,5).map(function(q){return{id:q.id,desc:q.desc,type:q.type,monster:q.monster,target:q.target,reward:q.reward,xpR:q.xpR,n:0,done:false};});
    renderQuests();
}
function checkQ(type,data){
    activeQuests.forEach(function(q){
        if(q.done)return;
        var p=q.n;
        if(type==='kill'&&q.type==='kill'&&q.monster===data.m) q.n=Math.min(q.n+1,q.target);
        if(type==='collect'&&q.type==='collect') q.n=Math.min(q.n+1,q.target);
        if(type==='level'&&q.type==='level') q.n=pLv;
        if(type==='boss'&&q.type==='boss') q.n=1;
        if(type==='survive'&&q.type==='survive') q.n=Math.floor(survTimer);
        if(type==='score'&&q.type==='score') q.n=score;
        if(q.n!==p)renderQuests();
        if(!q.done&&q.n>=q.target){q.done=true;finishQuest(q);}
    });
}
function finishQuest(q){
    S.quest();score+=q.reward;if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(Math.floor(q.reward/5));gainXP(q.xpR);
    if(player)float('📜 Quest! +'+q.reward,player.x-80,player.y-100,'#ffaa00');
    addMsg('Quest','✅ '+q.desc,'#ffaa00');
    setTimeout(function(){
        var done=activeQuests.map(function(x){return x.id;});
        for(var i=0;i<QUESTS.length;i++){
            if(done.indexOf(QUESTS[i].id)===-1){
                var nx=QUESTS[i];
                var idx=activeQuests.findIndex(function(x){return x.id===q.id;});
                if(idx!==-1)activeQuests[idx]={id:nx.id,desc:nx.desc,type:nx.type,monster:nx.monster,target:nx.target,reward:nx.reward,xpR:nx.xpR,n:0,done:false};
                renderQuests();break;
            }
        }
    },3000);
}
function renderQuests(){
    var list=el('questList');if(!list)return;
    list.innerHTML='';
    activeQuests.forEach(function(q){
        var d=document.createElement('div');
        d.className='questItem'+(q.done?' done':'');
        d.innerHTML=(q.done?'✅ ':'🔲 ')+q.desc+'<div class="questProgress">'+q.n+'/'+q.target+'</div><div class="questReward">+'+q.reward+'pts +'+q.xpR+'XP</div>';
        list.appendChild(d);
    });
}

// ================================
// GOLD & PASS XP
// ================================
function earnGold(amount){
    amount=Math.floor(amount);gold+=amount;
    if(goldTxt)goldTxt.setText('💰 '+gold);
    setText('goldHUD','💰 '+gold+' Gold');
    if(typeof pData!=='undefined'){pData.gold=gold;savePData();}
    S.gold();
}
function earnPassXP(amount){
    if(typeof pData==='undefined')return;
    pData.passXP=(pData.passXP||0)+amount;
    var curLv=pData.passLevel||0;
    while(pData.passXP>=PASS_XP_PER_LEVEL&&curLv<PASS_REWARDS.length){
        pData.passXP-=PASS_XP_PER_LEVEL;curLv++;
        pData.passLevel=curLv;
        givePassReward(curLv);
    }
    savePData();
}
function givePassReward(lv){
    var rwd=PASS_REWARDS[lv-1];if(!rwd)return;
    var isFree=rwd.free, isPaid=pData.passUnlocked&&rwd.pass;
    var give=function(r){
        if(!r)return;
        if(r.type==='gold'){pData.gold=(pData.gold||0)+r.amount;gold=pData.gold;if(goldTxt)goldTxt.setText('💰 '+gold);}
        if(r.type==='title'){if(!pData.titles)pData.titles=[];if(pData.titles.indexOf(r.value)===-1){pData.titles.push(r.value);if(player)float('🏅 Title: '+r.value,player.x-100,player.y-110,'#ffcc00');addMsg('Pass','🏅 Title earned: '+r.value,'#ffcc44');}}
        if(r.type==='class'){if(!pData.classes)pData.classes=[];if(pData.classes.indexOf(r.value)===-1){pData.classes.push(r.value);if(player)float('🎉 Class Unlocked: '+r.value,player.x-120,player.y-110,'#ffaa44');addMsg('Pass','🎉 '+r.value+' class unlocked!','#ffaa44');}}
    };
    give(isFree);
    if(isPaid)give(rwd.pass);
    if(player)float('🌟 Pass Level '+lv+'!',player.x-80,player.y-90,'#ffdd44');
    savePData();
}

// ================================
// FIREBASE
// ================================
function connectServer(){
    try{
        myId='p_'+Date.now()+'_'+Math.floor(Math.random()*9999);
        var room=window._room||'public';
        playersRef=db.ref('rooms/'+room+'/players');
        chatRef   =db.ref('rooms/'+room+'/chat');
        tombsRef  =db.ref('rooms/'+room+'/tombstones');
        pvpRef    =db.ref('rooms/'+room+'/pvp');
        myRef=playersRef.child(myId);
        myRef.set({id:myId,name:pClass.icon+' '+pName,x:640,y:400,dim:0,cls:selectedClass,skin:skinColor,hp:pH,maxHp:pMaxH,alive:true});
        myRef.onDisconnect().remove();
        playersRef.on('child_added',function(snap){var d=snap.val();if(!d||d.id===myId)return;addOtherPlayer(d);addMsg('System',d.name+' joined!','#ffff44');countOnline();});
        playersRef.on('child_changed',function(snap){var d=snap.val();if(!d||d.id===myId)return;var op=otherPlayers[d.id];if(!op)return;op.tx=d.x;op.ty=d.y;op.dim=d.dim||0;var vis=(d.dim||0)===dim;if(op.sprite)op.sprite.setVisible(vis);if(op.tag)op.tag.setVisible(vis);if(op.hpBar)op.hpBar.setVisible(vis);if(op.hpBg)op.hpBg.setVisible(vis);if(op.hpBar&&d.maxHp>0){op.hpBar.width=40*(d.hp/d.maxHp);op.hpBar.setFillStyle(d.hp/d.maxHp>0.5?0x22cc22:0xff4444);}});
        playersRef.on('child_removed',function(snap){var d=snap.val();if(!d)return;var op=otherPlayers[d.id];if(!op)return;addMsg('System',op.name+' left','#ff8888');if(op.sprite)op.sprite.destroy();if(op.tag)op.tag.destroy();if(op.hpBar)op.hpBar.destroy();if(op.hpBg)op.hpBg.destroy();delete otherPlayers[d.id];countOnline();});
        chatRef.limitToLast(1).on('child_added',function(snap){var d=snap.val();if(!d||d.sid===myId)return;addMsg(d.name,d.msg,'#ffffff');});
        pvpRef.on('child_added',function(snap){
            var d=snap.val();if(!d||d.tid!==myId)return;
            if(!gameStarted||!player||!player.active)return;
            var now=Date.now();if(now-lastHit<500)return;lastHit=now;
            pH-=d.dmg;S.hit();if(scene)scene.cameras.main.shake(200,.008);
            if(player){player.setTint(0xff0000);scene.time.delayedCall(200,function(){player.clearTint();});}
            updateHP();if(player)float('-'+d.dmg+' ⚔️PvP',player.x,player.y-50,'#ff44ff');
            if(pH<=0){pH=0;updateHP();showGameOver();}
            snap.ref.remove();
        });
        tombsRef.once('value',function(snap){snap.forEach(function(c){var t=c.val();if(t&&t.mode===selectedMode)addTombVis(t.x,t.y,t.name,t.level,'#ffaaaa');});});
        tombsRef.on('child_added',function(snap){var t=snap.val();if(!t||t.sid===myId||t.mode!==selectedMode)return;addTombVis(t.x,t.y,t.name,t.level,'#ffaaaa');addMsg('System','💀 '+t.name+' fell!','#ff8888');});
        addMsg('System','🌐 Room: '+(window._room||'public'),'#44ff44');
        countOnline();
    }catch(e){console.log('Offline:',e);addMsg('System','🌐 Playing offline','#ffaa00');}
}
function addOtherPlayer(d){
    if(otherPlayers[d.id]||!scene||!scene.physics)return;
    var texKey='ot_'+d.id;makeTex(texKey,d.skin||0xaa44ff);
    var sprite=scene.physics.add.image(d.x||640,d.y||400,texKey).setDepth(3);
    var tag=scene.add.text(d.x-30,d.y-55,d.name||'Player',{fontSize:'11px',fill:'#cc88ff',stroke:'#000',strokeThickness:1}).setDepth(4);
    var hpBg=scene.add.rectangle(d.x,d.y-48,42,6,0x000000).setDepth(4);
    var hpBar=scene.add.rectangle(d.x-20,d.y-48,40,5,0x22cc22).setOrigin(0,.5).setDepth(5);
    var vis=(d.dim||0)===dim;sprite.setVisible(vis);tag.setVisible(vis);hpBar.setVisible(vis);hpBg.setVisible(vis);
    otherPlayers[d.id]={sprite:sprite,tag:tag,hpBar:hpBar,hpBg:hpBg,name:d.name,tx:d.x||640,ty:d.y||400,dim:d.dim||0};
}
function countOnline(){if(!playersRef)return;playersRef.once('value',function(snap){setText('playerCount','🟢 '+snap.numChildren()+' Online');});}
function sendPos(){if(!myRef||!player)return;var now=Date.now();if(now-lastSent<50)return;lastSent=now;myRef.update({x:Math.floor(player.x),y:Math.floor(player.y),dim:dim,hp:Math.floor(pH),maxHp:pMaxH});}
function pvpHit(tid,dmg){if(!pvpRef)return;pvpRef.push({tid:tid,dmg:dmg,aid:myId,t:Date.now()});}

// ================================
// START GAME
// ================================
function startGame(){
    selectedClass=window._cls||'warrior';
    selectedMode =window._mode||'adventure';
    pName        =window._pName||'Hero';
    skinColor    =window._skinColor||0x4488ff;
    storyMode    =(selectedMode==='story');

    pClass =CLASSES[selectedClass]||CLASSES.warrior;
    pMaxH  =pClass.hp; pH=Math.max(10,Math.min(pH,pMaxH));
    pSpd   =pClass.speed; pDmg=pClass.damage; pRange=pClass.range;

    if(typeof pData!=='undefined'){
        gold=pData.gold||0;
        passLevel=pData.passLevel||0;
        passXP=pData.passXP||0;
        passUnlocked=pData.passUnlocked||false;
        playerTitles=pData.titles||[];
        activeTitle=pData.activeTitle||'';
    }

    if(selectedMode==='adventure'||selectedMode==='story') curPool=POOL_ADV;
    else if(selectedMode==='survival') curPool=POOL_SRV;
    else if(selectedMode==='bossrush') curPool=POOL_BRS;
    else curPool=POOL_PVP;

    window._doAttack =function(){doAtk();};
    window._doAbility=function(){doAbi();};
    window._doPotion =function(){doPot();};

    buildMap();
    makeTex('playerTex',skinColor,window._accessory||'none');
    makeAllMonsterTex();
    makeOtherTex();
    makePotionTex();
    makeTombTex();
    makeExtraTex();
    makeNPCTextures();

    createPlayer();
    enemies=scene.physics.add.group();
    potions=scene.physics.add.group();

    if(selectedMode==='adventure'){buildPortals();scene.physics.add.overlap(player,portals,onPortal,null,scene);}

    if(selectedMode==='adventure')     modeAdv();
    else if(selectedMode==='survival') modeSrv();
    else if(selectedMode==='bossrush') modeBRS();
    else if(selectedMode==='pvp')      modePvp();
    else if(selectedMode==='story')    modeStory();

    setupCam();setupKeys();buildUI();buildInv();
    if(selectedMode==='adventure')startDayNight();
    startSurvTimer();setupJoystick();connectServer();

    scene.physics.add.overlap(player,enemies,onEnemyHit,null,scene);
    scene.physics.add.overlap(player,potions,onPickPotion,null,scene);
    scene.cameras.main.setBackgroundColor(bgCol());

    var ai=el('abilityIcon2');if(ai)ai.textContent=pClass.abilityIcon;

    if(window._accessory&&window._accessory!=='none'){
        var acc={crown:'👑',hood:'🪖',wizard:'🧙',halo:'😇',horns:'😈',mask:'🎭',ears:'🐱',cape:'🦸'};
        var ico=acc[window._accessory]||'';
        if(ico)accessoryOverlay=scene.add.text(0,0,ico,{fontSize:'20px'}).setOrigin(.5,1).setDepth(12);
    }

    if(storyMode){show('storyPanel');beginStoryChapter(1);}

    // Music
    var themes={adventure:'combat',survival:'combat',bossrush:'boss',pvp:'combat',story:'story'};
    MUS.setTheme(themes[selectedMode]||'combat');

    gameStarted=true;
}

function bgCol(){
    return {adventure:'#1a5c1a',survival:'#3d1a00',bossrush:'#0d0011',pvp:'#1a1a22',story:'#1a1a2e'}[selectedMode]||'#1a1a2e';
}

// ================================
// BUILD MAP
// ================================
function buildMap(){
    if(selectedMode==='story')         buildCastle();
    else if(selectedMode==='adventure')buildForest();
    else if(selectedMode==='survival') buildLava();
    else if(selectedMode==='bossrush') buildDungeon();
    else                               buildArena();

    if(selectedMode==='adventure'){
        for(var sx=0;sx<mW;sx++) for(var sy=0;sy<mH;sy++)
            shadowTiles.push(scene.add.rectangle(sx*tSz+tSz/2,sy*tSz+tSz/2,tSz-1,tSz-1,(sx+sy)%2===0?0x1a0033:0x110022).setVisible(false));
        [{x:3,y:3},{x:9,y:6},{x:14,y:2},{x:19,y:9}].forEach(function(p){
            var c=scene.add.triangle(p.x*tSz+tSz/2,p.y*tSz+tSz/4,-7,14,7,14,0,-18,0x8800ff).setVisible(false);
            scene.tweens.add({targets:c,alpha:.4,duration:800,yoyo:true,repeat:-1});shadowTiles.push(c);
        });
    }
    nightOverlay=scene.add.rectangle(0,0,mW*tSz,mH*tSz,0x000033,0).setOrigin(0,0).setDepth(5);
    dimOverlay  =scene.add.rectangle(0,0,mW*tSz,mH*tSz,0x220044,0).setOrigin(0,0).setDepth(4);
    if(storyMode)spawnStoryNPCs();
}

// ── CASTLE MAP (Story Mode) ──────────────────
function buildCastle(){
    var W=mW,H=mH;
    // Background cobblestone
    for(var x=0;x<W;x++) for(var y=0;y<H;y++){
        var dark=(x+y)%2===0?0x222233:0x1e1e2e;
        castleTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,dark));
    }
    // COURTYARD — chapter 1 area (center of map)
    for(var x=4;x<W-4;x++) for(var y=4;y<H-10;y++){
        castleTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x334455:0x2e3a4a));
    }
    // CASTLE KEEP — inner hall (top half)
    for(var x=6;x<W-6;x++) for(var y=2;y<12;y++){
        castleTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x2a2a44:0x222238));
    }
    // THRONE ROOM (top center)
    for(var x=10;x<W-10;x++) for(var y=1;y<7;y++){
        castleTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x332244:0x2a1a38));
    }
    // Outer stone wall perimeter
    for(var x=0;x<W;x++){
        castleTiles.push(scene.add.rectangle(x*tSz+tSz/2,1*tSz+tSz/2,tSz-1,tSz-1,0x555566));
        castleTiles.push(scene.add.rectangle(x*tSz+tSz/2,(H-1)*tSz+tSz/2,tSz-1,tSz-1,0x555566));
    }
    for(var y=0;y<H;y++){
        castleTiles.push(scene.add.rectangle(1*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0x555566));
        castleTiles.push(scene.add.rectangle((W-2)*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0x555566));
    }
    // Corner towers
    [{x:0,y:0},{x:W-3,y:0},{x:0,y:H-3},{x:W-3,y:H-3}].forEach(function(t){
        for(var tx=t.x;tx<t.x+3;tx++) for(var ty=t.y;ty<t.y+3;ty++)
            castleTiles.push(scene.add.rectangle(tx*tSz+tSz/2,ty*tSz+tSz/2,tSz-1,tSz-1,0x666677));
    });
    // Castle gate (entrance to keep) — top-center gap
    scene.add.rectangle((W/2)*tSz,10*tSz,tSz*4,tSz,0x332244);
    scene.add.text(W/2*tSz,10*tSz,'🏰 Castle Gate',{fontSize:'13px',fill:'#aabbff',stroke:'#000',strokeThickness:2}).setOrigin(.5);
    // Throne
    scene.add.rectangle(W/2*tSz,3*tSz,tSz*1.5,tSz,0x442200);
    scene.add.rectangle(W/2*tSz,3*tSz,tSz*1.2,tSz*.6,0x664400);
    scene.add.text(W/2*tSz,3*tSz,'👑 Throne',{fontSize:'12px',fill:'#ffcc44',stroke:'#000',strokeThickness:2}).setOrigin(.5);
    // Pillars in throne room
    [{x:11,y:3},{x:15,y:3},{x:11,y:5},{x:15,y:5}].forEach(function(p){
        castleTiles.push(scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,18,56,0x555566));
        var t=scene.add.circle(p.x*tSz+tSz/2,p.y*tSz+tSz/2-30,8,0xff8800);
        scene.tweens.add({targets:t,radius:11,alpha:.5,duration:300,yoyo:true,repeat:-1});
    });
    // Torches along walls
    for(var i=4;i<W-4;i+=4){
        var tf=scene.add.circle(i*tSz+tSz/2,14*tSz,9,0xff6600,.9);
        scene.tweens.add({targets:tf,radius:12,alpha:.5,duration:250+Math.random()*150,yoyo:true,repeat:-1});
    }
    // Chapter area labels
    scene.add.text(W/2*tSz,(H-7)*tSz,'⚔️ Chapter 1: Courtyard',{fontSize:'14px',fill:'#8899ff',stroke:'#000',strokeThickness:2}).setOrigin(.5);
    scene.add.text(W/2*tSz,9*tSz,'🏰 Chapter 2: The Dark Hall',{fontSize:'13px',fill:'#cc88ff',stroke:'#000',strokeThickness:2}).setOrigin(.5);
    scene.add.text(W/2*tSz,6*tSz,'👁️ Chapter 3: Throne Room',{fontSize:'12px',fill:'#ff8844',stroke:'#000',strokeThickness:2}).setOrigin(.5);
    // Moat (very edge, decorative)
    for(var x=0;x<W;x++){
        var m=scene.add.rectangle(x*tSz+tSz/2,0,tSz,tSz*.6,0x0044aa);
        scene.tweens.add({targets:m,fillColor:0x0066cc,duration:1200+Math.random()*400,yoyo:true,repeat:-1});
        castleTiles.push(m);
    }
}

// ── FOREST MAP ─────────────────
function buildForest(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){
        var c=(x===14||(y===14&&x>4&&x<24))?0x8B6914:((x+y)%2===0?0x2d8a2d:0x267326);
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,c));
    }
    for(var i=0;i<mH;i++){var rx=20+Math.floor(i*.3);if(rx<mW){var rv=scene.add.rectangle(rx*tSz+tSz/2,i*tSz+tSz/2,tSz*2,tSz,0x1155aa);scene.tweens.add({targets:rv,fillColor:0x2266cc,duration:1200+Math.random()*400,yoyo:true,repeat:-1});normalTiles.push(rv);}}
    [{x:1,y:1},{x:2,y:1},{x:3,y:2},{x:22,y:1},{x:23,y:2},{x:1,y:13},{x:9,y:20},{x:10,y:21}].forEach(function(p){var tx=p.x*tSz+tSz/2,ty=p.y*tSz+tSz/2;normalTiles.push(scene.add.rectangle(tx,ty,14,28,0x6B3A2A));normalTiles.push(scene.add.circle(tx,ty-14,24,0x1a6e1a));});
    for(var i=0;i<3;i++) for(var j=0;j<2;j++) normalTiles.push(scene.add.rectangle((1+i)*tSz+tSz/2,(24+j)*tSz+tSz/2,tSz-1,tSz-1,0x222222));
}
function buildLava(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++) normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x8B3000:0x6B2200));
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){if(x<2||x>mW-3||y<2||y>mH-3){var lv=scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0xff3300);scene.tweens.add({targets:lv,fillColor:0xff6600,duration:600+Math.random()*400,yoyo:true,repeat:-1});normalTiles.push(lv);}}
    [{x:5,y:5,w:4,h:4},{x:14,y:3,w:5,h:3},{x:20,y:6,w:4,h:4}].forEach(function(pl){for(var px=pl.x;px<pl.x+pl.w;px++) for(var py=pl.y;py<pl.y+pl.h;py++) normalTiles.push(scene.add.rectangle(px*tSz+tSz/2,py*tSz+tSz/2,tSz-1,tSz-1,0xcc6600));});
}
function buildDungeon(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++) normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0x111122));
    [{x:1,y:1,w:8,h:7},{x:12,y:1,w:8,h:7},{x:1,y:13,w:8,h:7},{x:12,y:13,w:8,h:7},{x:6,y:6,w:10,h:8}].forEach(function(r,ri){var cols=[0x222233,0x1a1a2e,0x22223a,0x1e1e30,0x2a2a40];for(var rx=r.x;rx<r.x+r.w;rx++) for(var ry=r.y;ry<r.y+r.h;ry++) normalTiles.push(scene.add.rectangle(rx*tSz+tSz/2,ry*tSz+tSz/2,tSz-1,tSz-1,cols[ri%5]));});
    for(var i=0;i<10;i++){var tf=scene.add.circle(Phaser.Math.Between(2,25)*tSz,Phaser.Math.Between(2,25)*tSz,10,0xaa00ff,.8);scene.tweens.add({targets:tf,radius:14,alpha:.4,duration:280+Math.random()*200,yoyo:true,repeat:-1});}
}
function buildArena(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++) normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x<3||x>mW-4||y<3||y>mH-4)?0x222222:0x333333));
    var cx=mW/2*tSz,cy=mH/2*tSz,r=8*tSz;
    for(var x=4;x<mW-4;x++) for(var y=4;y<mH-4;y++){var dx=(x*tSz+tSz/2)-cx,dy=(y*tSz+tSz/2)-cy;if(Math.sqrt(dx*dx+dy*dy)<r) normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x998855:0x887744));}
    [{x:3,y:3},{x:24,y:3},{x:3,y:24},{x:24,y:24}].forEach(function(p){scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,40,72,0x888888);var f=scene.add.circle(p.x*tSz+tSz/2,p.y*tSz+tSz/2-46,9,0xffaa00);scene.tweens.add({targets:f,radius:13,alpha:.5,duration:280,yoyo:true,repeat:-1});});
    scene.add.text(cx,cy-r-20,'⚔️ PvP ARENA',{fontSize:'16px',fill:'#ffaa00',stroke:'#000',strokeThickness:3}).setOrigin(.5);
}

// ================================
// TEXTURES
// ================================
function makeTex(name,color,accessory){
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color);g.fillRoundedRect(4,12,32,28,4);
    g.fillStyle(0xffddaa);g.fillCircle(20,9,12);
    g.fillStyle(0x000000);g.fillCircle(15,8,3);g.fillCircle(25,8,3);
    g.fillStyle(0xffffff,.25);g.fillRect(8,16,24,5);
    if(accessory==='crown'){g.fillStyle(0xffdd00);g.fillRect(10,0,20,6);g.fillRect(8,3,4,8);g.fillRect(18,1,4,10);g.fillRect(28,3,4,8);}
    if(accessory==='halo'){g.lineStyle(3,0xffff88,1);g.strokeCircle(20,-4,14);}
    if(accessory==='horns'){g.fillStyle(0xff2200);g.fillTriangle(10,-2,14,8,8,8);g.fillTriangle(30,-2,26,8,32,8);}
    if(accessory==='mask'){g.fillStyle(0x111111,.8);g.fillRect(8,5,24,10);}
    g.generateTexture(name,44,44);g.destroy();
}
function makeNPCTextures(){
    var defs=[
        ['npcMessengerTex',0x884422],['npcSpyTex',0x226644],['npcPrisonerTex',0x664400],
        ['npcElderTex',0x8833aa],['npcScoutTex',0x226622],['npcSmithTex',0xaa4400]
    ];
    defs.forEach(function(d){
        if(scene.textures.exists(d[0]))return;
        var g=scene.make.graphics({x:0,y:0,add:false});
        g.fillStyle(d[1]);g.fillRoundedRect(4,16,36,30,5);
        g.fillStyle(0xffddaa);g.fillCircle(22,10,12);
        g.fillStyle(0x333333);g.fillCircle(17,8,3);g.fillCircle(27,8,3);
        g.generateTexture(d[0],44,48);g.destroy();
    });
}
function makeMonsterTex(name,color,size){
    if(scene.textures.exists(name))return;
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color);g.fillRoundedRect(4,10,size-8,size-10,4);
    g.fillStyle(0xffffff);g.fillCircle(12,14,5);g.fillCircle(size-14,14,5);
    g.fillStyle(0x000000);g.fillCircle(13,14,3);g.fillCircle(size-13,14,3);
    g.generateTexture(name,size,size);g.destroy();
}
function makeAllMonsterTex(){
    var all=[POOL_ADV,POOL_SRV,POOL_BRS,POOL_SHADOW,POOL_CASTLE,POOL_CASTLE_INNER,POOL_CASTLE_DARK];
    all.forEach(function(p){Object.keys(p).forEach(function(k){makeMonsterTex(k+'Tex',p[k].color,p[k].size);});});
}
function makeOtherTex(){if(!scene.textures.exists('otherTex'))makeTex('otherTex',0xaa44ff);}
function makeBossTex(name,bd){
    if(scene.textures.exists(name))return;
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(bd.bc);g.fillRoundedRect(5,5,90,90,12);
    g.fillStyle(bd.ec);g.fillCircle(28,28,14);g.fillCircle(72,28,14);
    g.fillStyle(0x000000);g.fillCircle(28,28,8);g.fillCircle(72,28,8);
    g.fillStyle(bd.mc);g.fillRect(22,65,56,12);
    g.generateTexture(name,100,100);g.destroy();
}
function makePotionTex(){if(scene.textures.exists('potTex'))return;var g=scene.make.graphics({x:0,y:0,add:false});g.fillStyle(0xff69b4);g.fillRoundedRect(2,6,26,24,8);g.fillStyle(0xffbbdd);g.fillCircle(10,13,6);g.generateTexture('potTex',30,32);g.destroy();}
function makeTombTex(){if(scene.textures.exists('tombTex'))return;var g=scene.make.graphics({x:0,y:0,add:false});g.fillStyle(0x666666);g.fillRoundedRect(5,0,34,40,8);g.fillStyle(0x999999);g.fillRect(18,10,4,18);g.fillRect(11,16,18,4);g.generateTexture('tombTex',44,44);g.destroy();}
function makeExtraTex(){
    if(!scene.textures.exists('minionTex')){var g=scene.make.graphics({x:0,y:0,add:false});g.fillStyle(0xdddddd);g.fillRoundedRect(5,10,22,24,4);g.fillStyle(0xeeeeee);g.fillCircle(16,8,9);g.generateTexture('minionTex',32,36);g.destroy();}
    if(!scene.textures.exists('wolfTex')){var g=scene.make.graphics({x:0,y:0,add:false});g.fillStyle(0x886644);g.fillEllipse(16,16,30,22);g.fillStyle(0x775533);g.fillCircle(26,10,10);g.generateTexture('wolfTex',36,32);g.destroy();}
    if(!scene.textures.exists('bulletTex')){var g=scene.make.graphics({x:0,y:0,add:false});g.fillStyle(0xffcc00);g.fillCircle(8,8,6);g.generateTexture('bulletTex',16,16);g.destroy();}
}
function createPlayer(){
    var startX=mW/2*tSz, startY=storyMode?(mH-5)*tSz:mH/2*tSz;
    player=scene.physics.add.image(startX,startY,'playerTex');
    scene.physics.world.setBounds(0,0,mW*tSz,mH*tSz);
    player.setCollideWorldBounds(true);
    atkIndicator=scene.add.circle(player.x,player.y,pRange,0xffffff,0).setStrokeStyle(1,0xffffff,.12).setDepth(8);
}

// ================================
// PORTALS (adventure only)
// ================================
var shadowPortGfx,returnPortGfx,returnPortBody,returnPortLabel;
function buildPortals(){
    portals=scene.physics.add.staticGroup();
    var p1=portals.create(22*tSz,22*tSz,null);p1.setCircle(30);p1.ptype='toShadow';
    returnPortBody=portals.create(4*tSz,4*tSz,null);returnPortBody.setCircle(30);returnPortBody.ptype='toNormal';returnPortBody.active=false;
    shadowPortGfx=scene.add.graphics();returnPortGfx=scene.add.graphics();
    scene.time.addEvent({delay:50,loop:true,callback:function(){
        shadowPortGfx.clear();
        if(!inShadow){var a=.4+Math.sin(Date.now()/300)*.3;shadowPortGfx.lineStyle(5,0xaa00ff,a);shadowPortGfx.strokeCircle(22*tSz,22*tSz,34);shadowPortGfx.fillStyle(0xaa00ff,a*.12);shadowPortGfx.fillCircle(22*tSz,22*tSz,32);}
        returnPortGfx.clear();
        if(inShadow){var a=.4+Math.sin(Date.now()/300)*.3;returnPortGfx.lineStyle(5,0xffaa00,a);returnPortGfx.strokeCircle(4*tSz,4*tSz,34);returnPortGfx.fillStyle(0xffaa00,a*.12);returnPortGfx.fillCircle(4*tSz,4*tSz,32);}
    }});
    scene.add.text(22*tSz,22*tSz-48,'🌀 Shadow Portal',{fontSize:'12px',fill:'#cc88ff',stroke:'#000',strokeThickness:2}).setOrigin(.5);
    returnPortLabel=scene.add.text(4*tSz,4*tSz-48,'🌀 Return Portal',{fontSize:'12px',fill:'#ffcc88',stroke:'#000',strokeThickness:2}).setOrigin(.5).setVisible(false);
}
function onPortal(player,portal){if(portalCD)return;portalCD=true;setTimeout(function(){portalCD=false;},2000);if(portal.ptype==='toShadow'&&!inShadow)enterShadow();else if(portal.ptype==='toNormal'&&inShadow)exitShadow();}
function enterShadow(){
    inShadow=true;dim=1;S.port();scene.cameras.main.flash(500,100,0,150);
    normalTiles.forEach(function(t){t.setVisible(false);});shadowTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimOverlay,alpha:.4,duration:1000});
    clearEnemies();for(var i=0;i<10;i++)spawnEnemy(null,POOL_SHADOW);
    setText('dimensionHUD','🌑 Shadow Realm');var dh=el('dimensionHUD');if(dh)dh.style.color='#cc88ff';
    float('🌑 Shadow Realm!',player.x-100,player.y-80,'#cc88ff');
    if(returnPortBody)returnPortBody.active=true;if(returnPortLabel)returnPortLabel.setVisible(true);
    updateOtherVis();if(myRef)myRef.update({dim:1});
    MUS.setTheme('boss');
}
function exitShadow(){
    inShadow=false;dim=0;S.port();scene.cameras.main.flash(500,50,150,50);
    shadowTiles.forEach(function(t){t.setVisible(false);});normalTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimOverlay,alpha:0,duration:1000});
    clearEnemies();spawnInitial();
    setText('dimensionHUD','🌍 Normal World');var dh=el('dimensionHUD');if(dh)dh.style.color='#aaffaa';
    float('🌍 Normal World!',player.x-100,player.y-80,'#aaffaa');
    if(returnPortBody)returnPortBody.active=false;if(returnPortLabel)returnPortLabel.setVisible(false);
    updateOtherVis();if(myRef)myRef.update({dim:0});MUS.setTheme('combat');
}
function updateOtherVis(){Object.values(otherPlayers).forEach(function(op){var vis=(op.dim===dim);if(op.sprite)op.sprite.setVisible(vis);if(op.tag)op.tag.setVisible(vis);if(op.hpBar)op.hpBar.setVisible(vis);if(op.hpBg)op.hpBg.setVisible(vis);});}
function clearEnemies(){enemies.getChildren().forEach(function(e){if(e.hpBar)e.hpBar.destroy();if(e.tag)e.tag.destroy();e.destroy();});}

// ================================
// GAME MODES
// ================================
function modeAdv(){spawnInitial();scene.time.addEvent({delay:90000,callback:function(){if(player)float('⚠️ Dragon King in 30s!',player.x-140,player.y-80,'#ff8800');}});scene.time.addEvent({delay:120000,callback:function(){spawnBoss('adv');}});}
function modeSrv(){setTimeout(function(){nextWave();},2000);}
function nextWave(){
    if(!gameStarted)return;wave++;waveKilled=0;waveTotal=5+wave*3;S.wave();
    setText('waveHUD','🌊 Wave '+wave+' — '+waveTotal+' enemies!');float('🌊 WAVE '+wave+'!',player.x-60,player.y-100,'#ff4444');
    var ks=Object.keys(POOL_SRV);
    for(var i=0;i<waveTotal;i++)(function(d){setTimeout(function(){if(gameStarted)spawnEnemy(ks[Math.floor(Math.random()*ks.length)],POOL_SRV);},d);})(i*350);
    if(wave%5===0)setTimeout(function(){if(gameStarted)spawnBoss('srv');},waveTotal*350+1500);
}
function onWaveKill(){
    if(selectedMode!=='survival')return;waveKilled++;
    if(waveKilled>=waveTotal){float('✅ Wave '+wave+' clear!',player.x-100,player.y-80,'#44ff44');pH=Math.min(pH+30,pMaxH);updateHP();setText('waveHUD','⏳ Next wave in 3s...');setTimeout(function(){if(gameStarted)nextWave();},3000);return;}
    setText('waveHUD','🌊 Wave '+wave+' — '+(waveTotal-waveKilled)+' left!');
}
function modeBRS(){rushIdx=0;float('💀 Boss Rush!',player.x-80,player.y-80,'#cc44ff');setTimeout(function(){nextRush();},2000);}
function nextRush(){
    if(!player||!player.active||!gameStarted)return;rushIdx++;
    var bd=BOSS_RUSH[(rushIdx-1)%BOSS_RUSH.length];var tKey='rush'+rushIdx;makeBossTex(tKey,bd);S.boss();
    boss=scene.physics.add.image(mW/2*tSz,mH/2*tSz,tKey);boss.setCollideWorldBounds(true);
    boss.hp=(bd.hp+pLv*80)*Math.ceil(rushIdx/BOSS_RUSH.length);boss.maxHp=boss.hp;boss.speed=bd.speed+pLv*5;boss.xp=bd.xp*rushIdx;boss.gold=bd.gold;bossSpawned=true;
    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:600,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.bar).setScrollFactor(0).setDepth(15);
    bossTxt=scene.add.text(640,50,bd.name+' #'+rushIdx,{fontSize:'14px',fill:'#fff'}).setOrigin(.5).setScrollFactor(0).setDepth(15);
    float('⚠️ '+bd.name,player.x-120,player.y-100,'#cc44ff');
    scene.physics.add.overlap(player,boss,onBossHit,null,scene);
    MUS.setTheme('boss');
}
function modePvp(){
    addMsg('System','⚔️ PvP! Attack other players for real damage!','#ff88ff');
    float('⚔️ PvP Arena — SPACE to attack players!',player.x-150,player.y-80,'#ff88ff');
    scene.add.text(mW/2*tSz,mH/2*tSz+50,'Walk near other players and press SPACE!\nCrits deal 2× damage. ⚔️',{fontSize:'15px',fill:'#ff88ff',stroke:'#000',strokeThickness:3,align:'center'}).setOrigin(.5).setDepth(6);
}
function modeStory(){
    // Start ch1 pool (castle courtyard)
    curPool=POOL_CASTLE;
    // Don't auto-spawn — chapter controls spawning
    addMsg('System','📖 Story Mode! Find the NPCs and press E to talk!','#ffcc44');
    float('📖 Story Mode — find Messenger Lex!',player.x-160,player.y-90,'#ffcc44');
    MUS.setTheme('story');
}

// ================================
// STORY MODE — Castle Chapters
// ================================
function spawnStoryNPCs(){
    var W=mW, H=mH;
    // Ch1: Messenger Lex — at courtyard entrance (bottom-center)
    addNPC('messenger','📜 Messenger Lex','npcMessengerTex',W/2*tSz,(H-6)*tSz,'#88aaff',1);
    // Ch2: Spy Mira — near castle gate (mid-map)
    addNPC('spy','🕵️ Spy Mira','npcSpyTex',W/2*tSz,11*tSz,'#cc88ff',2);
    // Ch3: Sir Owen — inside throne room (top area)
    addNPC('prisoner','⚔️ Sir Owen','npcPrisonerTex',W/2*tSz,8*tSz,'#ff8844',3);
}
function addNPC(id,label,texKey,x,y,color,chapter){
    var s=scene.physics.add.image(x,y,texKey).setDepth(5).setImmovable(true);
    scene.tweens.add({targets:s,y:y-5,duration:900,yoyo:true,repeat:-1});
    var tag=scene.add.text(x,y-62,label+'\n[E] Talk',{fontSize:'11px',fill:color,stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(.5).setDepth(6);
    // Glow ring
    var ring=scene.add.graphics();ring.lineStyle(3,parseInt(color.replace('#',''),16),.5);ring.strokeCircle(x,y,30);
    storyNPCList.push({sprite:s,tag:tag,id:id,x:x,y:y,chapter:chapter});
}

function beginStoryChapter(num){
    storyChapter=num;storyChapterComplete=false;storyWave=0;storyWaveKills=0;storyBossPhase=0;
    var ch=STORY_DATA[num-1];if(!ch)return;
    storyObjProgress=ch.objectives.map(function(o){return Object.assign({},o,{n:0,done:false});});
    setText('storyChapterTitle',ch.title);renderStoryPanel();
    float(ch.title,player.x-170,player.y-110,ch.color);S.story();
    var mh=el('modeHUD');if(mh){mh.textContent=ch.title;mh.style.color=ch.color;}
    // Set pool for this chapter
    var pools={castle:POOL_CASTLE,castle_inner:POOL_CASTLE_INNER,castle_dark:POOL_CASTLE_DARK};
    curPool=pools[ch.pool]||POOL_CASTLE;
    // Start chapter-specific logic
    clearEnemies();
    if(num===1)startStoryWave(1);
    else if(num===2)startStoryWave(1);
    else if(num===3)startStoryWave(1);
}

function startStoryWave(waveNum){
    storyWave=waveNum;storyWaveKills=0;
    var ch=STORY_DATA[storyChapter-1];if(!ch)return;

    // Find wave target from objectives
    var waveObj=storyObjProgress.find(function(o){return o.type==='storywave'&&o.wave===waveNum;});
    storyWaveTarget=waveObj?waveObj.target:8;

    var msgs={};
    msgs['1-1']='🛡️ Castle Guards incoming!';
    msgs['2-1']='⚔️ Elite Guards fill the hall!';
    msgs['2-2']='⚔️ Commander Vex arrives with his soldiers!';
    msgs['3-1']='🌑 Shadow Knights emerge!';
    msgs['3-2']='👁️ Shadow Master summons his minions!';

    var key=storyChapter+'-'+waveNum;
    if(msgs[key])float(msgs[key],player.x-180,player.y-90,'#ff8844');
    setText('waveHUD','⚔️ Wave '+waveNum+' — '+storyWaveTarget+' enemies!');show('waveHUD');

    // Spawn enemies
    var pool=curPool;
    for(var i=0;i<storyWaveTarget;i++){
        (function(delay){setTimeout(function(){if(gameStarted&&storyWave===waveNum)spawnEnemy(null,pool);},delay);})(i*400);
    }

    // Chapter 2 wave 2: also spawn Vex boss
    if(storyChapter===2&&waveNum===2){
        setTimeout(function(){if(gameStarted)spawnStoryBoss('vex');},1200);
    }
}

function onStoryWaveKill(){
    if(!storyMode||storyChapterComplete)return;
    storyWaveKills++;
    // Update the storywave objective
    var waveObj=storyObjProgress.find(function(o){return o.type==='storywave'&&o.wave===storyWave&&!o.done;});
    if(waveObj){waveObj.n=storyWaveKills;if(storyWaveKills>=waveObj.target){waveObj.done=true;renderStoryPanel();onStoryWaveComplete(storyWave);}}
    else renderStoryPanel();
    setText('waveHUD','⚔️ Wave '+storyWave+' — '+(storyWaveTarget-storyWaveKills)+' left!');
}

function onStoryWaveComplete(waveNum){
    float('✅ Wave '+waveNum+' cleared!',player.x-110,player.y-80,'#44ff44');S.wave();
    hide('waveHUD');

    // Determine next step
    if(storyChapter===1){
        // Both objectives done → chapter complete
        var allKillsDone=storyObjProgress.filter(function(o){return o.type==='kill';}).every(function(o){return o.done;});
        if(allKillsDone)completeStoryChapter();
    }
    if(storyChapter===2&&waveNum===1){
        // Wave 1 done → cutscene → wave 2
        var lines=[{speaker:'⚔️ Commander Vex',portrait:'⚔️',text:'"So you made it past my guards? Impressive... but I won\'t let you go any further. Men — ATTACK!"'}];
        setTimeout(function(){showCutscene(lines,function(){startStoryWave(2);});},1000);
    }
    if(storyChapter===3&&waveNum===1){
        // Wave 1 done → Shadow Master appears
        var lines2=[{speaker:'🌑 Shadow Master',portrait:'🌑',text:'"Foolish hero... you dare enter the throne room? I am the Shadow Master — and you will never leave this place alive!"'},{speaker:'🌑 Shadow Master',portrait:'🌑',text:'"ARISE, my shadows! Tear this intruder apart!!! "}];
        setTimeout(function(){showCutscene(lines2,function(){startStoryWave(2);});},1000);
    }
    if(storyChapter===3&&waveNum===2){
        // Minions cleared → now fight Shadow Master alone
        var lines3=[{speaker:'🌑 Shadow Master',portrait:'🌑',text:'"Impossible... my minions... defeated! No matter — I will finish you myself!!! 💀"'}];
        setTimeout(function(){showCutscene(lines3,function(){spawnStoryBoss('shadow_master');setText('waveHUD','⚔️ Defeat the Shadow Master!');show('waveHUD');});},1000);
    }
}

function spawnStoryBoss(bossKey){
    var bossData={vex:BOSS_VEX,shadow_master:BOSS_SHADOW_MASTER,dark_king:BOSS_DARK_KING}[bossKey];
    if(!bossData||bossSpawned)return;
    bossSpawned=true;
    makeBossTex('storyBoss_'+bossKey,bossData);
    var bx=mW/2*tSz, by=storyChapter===3?(4*tSz):(storyChapter===2?8*tSz:12*tSz);
    boss=scene.physics.add.image(bx,by,'storyBoss_'+bossKey);
    boss.setCollideWorldBounds(true);
    boss.hp=bossData.hp+pLv*80;boss.maxHp=boss.hp;boss.speed=bossData.speed+pLv*5;boss.xp=bossData.xp;boss.gold=bossData.gold;
    boss._storyKey=bossKey;
    scene.tweens.add({targets:boss,scaleX:1.12,scaleY:1.12,duration:600,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bossData.bar).setScrollFactor(0).setDepth(15);
    bossTxt=scene.add.text(640,50,bossData.name,{fontSize:'14px',fill:'#fff'}).setOrigin(.5).setScrollFactor(0).setDepth(15);
    float('⚠️ '+bossData.name+'!',player.x-140,player.y-100,'#ff4444');S.boss();
    scene.physics.add.overlap(player,boss,onBossHit,null,scene);
    MUS.setTheme('boss');

    // Vex spawns 4 extra soldiers
    if(bossKey==='vex'){
        for(var i=0;i<4;i++){setTimeout(function(){spawnEnemy('soldier',POOL_CASTLE);},i*300);}
    }
}

function renderStoryPanel(){
    var list=el('storyObjList');if(!list)return;
    list.innerHTML='';
    storyObjProgress.forEach(function(o){
        var d=document.createElement('div');
        d.style.cssText='margin-bottom:4px;font-size:11px;'+(o.done?'color:#44ff44;opacity:.7':'color:#fff');
        var progress='';
        if(o.type==='kill')progress='  ('+o.n+'/'+o.target+')';
        if(o.type==='storywave')progress='  ('+Math.min(o.n,o.target)+'/'+o.target+')';
        d.textContent=(o.done?'✅ ':'🔲 ')+o.desc+progress;
        list.appendChild(d);
    });
}

function updateStoryObjKill(mtype){
    if(!storyMode||storyChapterComplete)return;
    var ch=STORY_DATA[storyChapter-1];if(!ch)return;
    // Update kill objectives for ch1
    storyObjProgress.forEach(function(o){
        if(o.done)return;
        if(o.type==='kill'&&o.monster===mtype){
            o.n=Math.min(o.n+1,o.target);
            if(o.n>=o.target)o.done=true;
        }
    });
    renderStoryPanel();
    // Check all kill objectives done for ch1
    if(storyChapter===1){
        var all=storyObjProgress.every(function(o){return o.done;});
        if(all&&!storyChapterComplete)completeStoryChapter();
    }
}

function completeStoryChapter(){
    storyChapterComplete=true;
    var ch=STORY_DATA[storyChapter-1];if(!ch)return;
    S.story();S.story();earnGold(ch.reward);
    scene.cameras.main.flash(1000,255,255,100);
    float('🎉 '+ch.rewardMsg,player.x-200,player.y-120,'#ffff00');
    addMsg('Story','🎉 '+ch.rewardMsg,'#ffaa44');
    earnPassXP(200);
    if(storyChapter===3){
        // Award title
        if(typeof pData!=='undefined'){if(!pData.titles)pData.titles=[];if(pData.titles.indexOf('Castle Breaker')===-1){pData.titles.push('Castle Breaker');pData.activeTitle='Castle Breaker';}savePData();}
        setTimeout(function(){showStoryComplete();},3000);
    } else {
        setTimeout(function(){
            if(!gameStarted)return;
            beginStoryChapter(storyChapter+1);
        },4000);
    }
}

function showCutscene(lines,callback){
    if(!lines||!lines.length){if(callback)callback();return;}
    storyDialogActive=true;chatOpen=true;
    window._storyDialogLines=lines;window._storyDialogIdx=0;window._storyDialogCallback=callback||null;
    var entry=lines[0];
    setText('storyDialogSpeaker',entry.speaker||'');
    setText('storyDialogText',entry.text||'');
    var sd=el('storyDialog');
    if(sd){sd.style.display='flex';sd.style.opacity='0';setTimeout(function(){sd.style.opacity='1';},20);}
}

function startNPCDialog(npc){
    if(storyDialogActive)return;
    var ch=STORY_DATA[storyChapter-1];if(!ch)return;
    if(ch.npcId===npc.id){
        showCutscene(ch.dialog,null);
    } else {
        var generic={messenger:[{speaker:'📜 Messenger Lex',text:'"Stay strong, hero! The realm is counting on you! 💪"'}],spy:[{speaker:'🕵️ Spy Mira',text:'"Keep going — you\'re getting closer to the truth! 🕵️"'}],prisoner:[{speaker:'⚔️ Sir Owen',text:'"I\'m rooting for you, hero! Show them what you\'ve got! ⚔️"'}]};
        showCutscene(generic[npc.id]||[{speaker:npc.id,text:'"Hello, traveller!"'}],null);
    }
}

window.advanceStoryDialog=function(){
    window._storyDialogIdx=(window._storyDialogIdx||0)+1;
    var lines=window._storyDialogLines||[];
    if(window._storyDialogIdx>=lines.length){
        var sd=el('storyDialog');if(sd){sd.style.opacity='0';setTimeout(function(){sd.style.display='none';},300);}
        storyDialogActive=false;chatOpen=false;
        var cb=window._storyDialogCallback;window._storyDialogCallback=null;window._storyDialogLines=[];
        if(cb)setTimeout(cb,400);
    } else {
        var entry=lines[window._storyDialogIdx];
        setText('storyDialogSpeaker',entry.speaker||'');
        setText('storyDialogText',entry.text||'');
    }
};

function showStoryComplete(){
    storyDone=true;MUS.setTheme('menu');
    scene.cameras.main.flash(2000,255,220,50);
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#0a0000 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 2s;font-family:Arial,sans-serif;color:#fff;text-align:center;padding:20px;';
    ov.innerHTML='<div style="max-width:560px;padding:24px;"><div style="font-size:72px;margin-bottom:8px;">🏆</div>'
        +'<h1 style="font-size:clamp(28px,6vw,44px);color:#ffdd44;text-shadow:0 0 40px #ffaa00;margin-bottom:6px;">STORY COMPLETE!</h1>'
        +'<p style="font-size:clamp(11px,2.5vw,15px);color:#ffcc88;margin-bottom:4px;">The Unknown Leader — The Dark King — has fallen!</p>'
        +'<p style="font-size:clamp(12px,2.5vw,16px);color:#ffaa44;margin-bottom:3px;">'+pClass.icon+' <b>'+pName+'</b> — Level '+pLv+'</p>'
        +'<p style="font-size:clamp(11px,2vw,14px);color:#ffcc44;margin-bottom:3px;">🏰 Title Earned: <b>Castle Breaker</b></p>'
        +'<p style="font-size:clamp(14px,3vw,20px);color:#ffdd44;margin-bottom:4px;">Score: '+score+'</p>'
        +'<p style="font-size:clamp(11px,2vw,13px);color:#ffaa00;margin-bottom:20px;">💰 Total Gold: '+gold+'</p>'
        +'<button onclick="location.reload()" style="padding:12px 32px;font-size:clamp(13px,3vw,16px);background:linear-gradient(135deg,#cc8800,#ffaa00);color:#000;border:none;border-radius:10px;cursor:pointer;font-weight:bold;">🏠 Return to Menu</button></div>';
    document.body.appendChild(ov);setTimeout(function(){ov.style.opacity='1';},100);
}

// ================================
// SPAWN ENEMIES
// ================================
function spawnInitial(){
    if(selectedMode==='pvp')return;
    var ks=Object.keys(curPool);if(!ks.length)return;
    for(var i=0;i<12;i++)spawnEnemy(ks[Math.floor(Math.random()*ks.length)],curPool);
}
function spawnEnemy(type,pool){
    pool=pool||curPool;
    if(!pool||!Object.keys(pool).length)return;
    var ks=Object.keys(pool);
    if(!type||!pool[type])type=ks[Math.floor(Math.random()*ks.length)];
    var m=pool[type];if(!m)return;
    makeMonsterTex(type+'Tex',m.color,m.size);
    // Spread enemies around map, avoid player start area
    var x=Phaser.Math.Between(3,mW-3)*tSz,y=Phaser.Math.Between(3,mH-3)*tSz;
    var e=enemies.create(x,y,type+'Tex');
    e.setCollideWorldBounds(true);
    e.mtype=type;e.pool=pool;
    e.hp=m.hp*(1+pLv*.2);e.maxHp=e.hp;
    e.speed=m.speed+pLv*4;e.dmg=m.dmg;e.xp=m.xp+pLv*5;e.score=m.score;e.gold=m.gold||5;e.px=x;e.py=y;
    e.hpBar=scene.add.rectangle(x,y-35,m.size,6,0xff3333).setDepth(6);
    e.tag=scene.add.text(x,y-50,m.name+' Lv.'+pLv,{fontSize:'11px',fill:'#fff',stroke:'#000',strokeThickness:2}).setOrigin(.5).setDepth(6);
    return e;
}

// ================================
// CAMERA + KEYS
// ================================
function setupCam(){
    scene.cameras.main.setBounds(0,0,mW*tSz,mH*tSz);
    scene.cameras.main.startFollow(player,true,.08,.08);
    // MOBILE FIX: zoom out more so enemies are visible
    var targetZoom=isMobile?0.62:1;
    scene.cameras.main.setZoom(.4);
    scene.tweens.add({targets:scene.cameras.main,zoom:targetZoom,duration:1200,ease:'Power2'});
}
function setupKeys(){
    cursors=scene.input.keyboard.createCursorKeys();
    wasd=scene.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D});
    shiftKey=scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    scene.input.keyboard.on('keydown-SPACE',function(){if(!chatOpen)doAtk();});
    scene.input.keyboard.on('keydown-E',function(){if(chatOpen)return;if(storyMode&&storyNearNPC){startNPCDialog(storyNearNPC);return;}doAbi();});
    scene.input.keyboard.on('keydown-F',function(){if(!chatOpen)doPot();});
    scene.input.keyboard.on('keydown-I',function(){if(!chatOpen)toggleInv();});
    scene.input.keyboard.on('keydown-T',function(){openChat();});
    scene.input.keyboard.on('keydown-ENTER',function(){if(!chatOpen)doSave();});
    scene.input.keyboard.on('keydown-M',function(){MUS.toggle();});
}
function setupJoystick(){
    if(!isMobile)return;
    var zone=el('joystickZone'),base=el('joystickBase'),thumb=el('joystickThumb');
    if(!zone||!base||!thumb)return;
    var max=42;
    zone.addEventListener('touchstart',function(e){e.preventDefault();var t=e.changedTouches[0];jsActive=true;jsX=t.clientX;jsY=t.clientY;var r=zone.getBoundingClientRect();base.style.left=(t.clientX-r.left-55)+'px';base.style.bottom='auto';base.style.top=(t.clientY-r.top-55)+'px';},{passive:false});
    zone.addEventListener('touchmove',function(e){e.preventDefault();if(!jsActive)return;var t=e.changedTouches[0];var dx=t.clientX-jsX,dy=t.clientY-jsY,dist=Math.sqrt(dx*dx+dy*dy);if(dist>max){dx=dx/dist*max;dy=dy/dist*max;}thumb.style.transform='translate('+dx+'px,'+dy+'px)';jsDX=dx/max;jsDY=dy/max;},{passive:false});
    zone.addEventListener('touchend',function(e){e.preventDefault();jsActive=false;jsDX=0;jsDY=0;thumb.style.transform='translate(0,0)';base.style.left='48px';base.style.top='auto';base.style.bottom='28px';},{passive:false});
}

// ================================
// ATTACK
// ================================
function doAtk(){
    var now=Date.now();if(now-lastAtk<pClass.atk)return;lastAtk=now;S.atk();
    var sw=scene.add.graphics();
    sw.lineStyle(3,0xffddaa,1);
    sw.arc(player.x,player.y,pRange*.7,playerFacing===1?-.5:Math.PI+.5,playerFacing===1?.8:Math.PI-.8);
    sw.strokePath();
    scene.tweens.add({targets:sw,alpha:0,duration:250,onComplete:function(){sw.destroy();}});
    var hit=false;
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active)return;
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<=pRange){
            var dmg=pDmg;
            if(selectedClass==='berserker'){var r=pH/pMaxH;if(r<.5)dmg=Math.floor(dmg*1.8);if(r<.25)dmg=Math.floor(dmg*2.5);}
            if(selectedClass==='vampire'){pH=Math.min(pH+Math.floor(dmg*.3),pMaxH);updateHP();}
            if(selectedClass==='assassin'){var chains=[];enemies.getChildren().forEach(function(e2){if(e2!==e&&Phaser.Math.Distance.Between(e.x,e.y,e2.x,e2.y)<120)chains.push(e2);});chains.slice(0,3).forEach(function(ec){ec.hp-=dmg*.5;if(ec.hp<=0)killEnemy(ec);});}
            var crit=(selectedClass==='rogue'||selectedClass==='assassin')&&Math.random()<.3;
            if(crit)dmg=Math.floor(dmg*2);
            e.hp-=dmg;e.setTint(0xffffff);
            scene.time.delayedCall(100,function(){if(e&&e.active)e.clearTint();});
            float((crit?'⚡ ':'')+dmg,e.x,e.y-40,crit?'#ffff00':'#ffddaa');
            hit=true;if(e.hp<=0)killEnemy(e);
        }
    });
    if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<=pRange+50){
        boss.hp-=pDmg;updateBossHP();if(boss.hp<=0)killBoss();
    }
    // PVP — real damage with hit effects
    if(selectedMode==='pvp'){
        Object.entries(otherPlayers).forEach(function(kv){
            var opId=kv[0],op=kv[1];
            if(!op||!op.sprite||!op.sprite.active)return;
            if(Phaser.Math.Distance.Between(player.x,player.y,op.sprite.x,op.sprite.y)<=pRange){
                var crit=Math.random()<.25;
                var dmg=Math.floor(pDmg*(crit?2:1));
                pvpHit(opId,dmg);
                var slash=scene.add.graphics();slash.lineStyle(4,0xff44ff,1);
                slash.lineBetween(op.sprite.x-22,op.sprite.y-22,op.sprite.x+22,op.sprite.y+22);
                slash.lineBetween(op.sprite.x+22,op.sprite.y-22,op.sprite.x-22,op.sprite.y+22);
                scene.tweens.add({targets:slash,alpha:0,scaleX:1.5,scaleY:1.5,duration:280,onComplete:function(){slash.destroy();}});
                if(op.sprite){op.sprite.setTint(0xff0000);scene.time.delayedCall(250,function(){if(op&&op.sprite&&op.sprite.active)op.sprite.clearTint();});}
                float((crit?'💥 CRIT! ':'⚔️ ')+dmg,op.sprite.x,op.sprite.y-50,crit?'#ffff00':'#ff44ff');
                hit=true;
            }
        });
    }
    if(!hit&&!(boss&&boss.active))float('miss',player.x+playerFacing*30,player.y-20,'#444');
}

function onEnemyHit(player,enemy){
    if(invisible||selectedMode==='pvp')return;
    var now=Date.now();if(now-lastHit<1000)return;lastHit=now;
    var dmg=enemy.dmg||10;pH-=dmg;S.hit();scene.cameras.main.shake(200,.008);
    player.setTint(0xff0000);scene.time.delayedCall(200,function(){player.clearTint();});
    updateHP();float('-'+dmg,player.x,player.y-50,'#ff3333');
    if(pH<=0){pH=0;updateHP();showGameOver();}
}

function killEnemy(e){
    if(!e||!e.active)return;
    var pool=e.pool||curPool;var m=pool?pool[e.mtype]:null;
    if(m)particles(e.x,e.y,m.color,12);S.die();
    gainXP(e.xp||20);score+=(e.score||10)*pLv;if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(e.gold||5);earnPassXP(15);
    if(selectedMode!=='pvp')spawnPotion(e.x,e.y,false);
    var mt=e.mtype||'goblin';
    if(!questStats.kills[mt])questStats.kills[mt]=0;questStats.kills[mt]++;
    checkQ('kill',{m:mt});checkQ('score',{});
    // Story tracking
    if(storyMode){
        updateStoryObjKill(mt);
        onStoryWaveKill();
    }
    if(e.hpBar)e.hpBar.destroy();if(e.tag)e.tag.destroy();
    var ws=(e.pool===POOL_SHADOW);e.destroy();
    if(selectedMode==='survival'){onWaveKill();return;}
    if(!storyMode){
        setTimeout(function(){
            if(!gameStarted)return;
            if(selectedMode==='adventure')spawnEnemy(null,ws?POOL_SHADOW:POOL_ADV);
            else if(selectedMode==='bossrush')spawnEnemy(null,POOL_BRS);
        },4000);
    }
}

// ================================
// BOSS
// ================================
function spawnBoss(mode){
    if(bossSpawned)return;bossSpawned=true;S.boss();
    var bd=mode==='srv'?BOSS_SRV:BOSS_ADV;
    makeBossTex('modeBoss',bd);
    boss=scene.physics.add.image(mW/2*tSz,mH/2*tSz,'modeBoss');
    boss.setCollideWorldBounds(true);
    boss.hp=bd.hp+pLv*100;boss.maxHp=boss.hp;boss.speed=bd.speed+pLv*5;boss.xp=bd.xp+pLv*50;boss.gold=bd.gold||150;
    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:700,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.bar).setScrollFactor(0).setDepth(15);
    bossTxt=scene.add.text(640,50,bd.name,{fontSize:'14px',fill:'#fff'}).setOrigin(.5).setScrollFactor(0).setDepth(15);
    if(player)float('⚠️ '+bd.name+'!',player.x-130,player.y-100,'#ff4444');
    addMsg('System','⚠️ '+bd.name,'#ff4444');
    scene.physics.add.overlap(player,boss,onBossHit,null,scene);
    MUS.setTheme('boss');
}
var lastBossHit=0;
function onBossHit(p,b){
    var now=Date.now();if(now-lastBossHit<1500)return;lastBossHit=now;
    var dmg=35+pLv*4;pH-=dmg;S.hit();
    player.setTint(0xff0000);scene.cameras.main.shake(350,.02);
    scene.time.delayedCall(250,function(){player.clearTint();});
    updateHP();float('-'+dmg,player.x,player.y-50,'#ff0000');
    if(pH<=0){pH=0;updateHP();showGameOver();}
}
function killBoss(){
    particles(boss.x,boss.y,0xff0000,30);particles(boss.x,boss.y,0xffff00,22);
    gainXP(boss.xp||400);score+=600*pLv;if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(boss.gold||150);earnPassXP(100);
    for(var i=0;i<4;i++)spawnPotion(boss.x+Phaser.Math.Between(-80,80),boss.y+Phaser.Math.Between(-80,80),true);
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    var bkey=boss._storyKey||'';
    boss.destroy();boss=null;bossSpawned=false;
    questStats.bossKills++;checkQ('boss',{});
    float('🏆 BOSS DEFEATED!',player.x-120,player.y-90,'#ffff00');addMsg('System','🏆 Boss defeated!','#ffff00');
    MUS.setTheme(storyMode?'story':'combat');

    if(storyMode){
        // Update story boss objectives
        storyObjProgress.forEach(function(o){if(o.type==='storyboss'&&o.bossKey===bkey&&!o.done){o.n=1;o.done=true;}});
        renderStoryPanel();
        // Story chapter 2 complete after Vex
        if(storyChapter===2&&bkey==='vex'){hide('waveHUD');completeStoryChapter();}
        // Story chapter 3 Shadow Master → Dark King cutscene
        if(storyChapter===3&&bkey==='shadow_master'){
            var lines=[
                {speaker:'⚔️ Sir Owen',portrait:'⚔️',text:'"You did it! The Shadow Master is gone! And now... the Unknown Leader shows himself..."'},
                {speaker:'👁️ The Dark King',portrait:'👁️',text:'"Impressive. I am the Dark King — ruler of this realm. You have destroyed my left and right hand. Now face ME!"'},
                {speaker:'👁️ The Dark King',portrait:'👁️',text:'"I will crush you myself, little hero. Prepare to meet your end! 👁️"'}
            ];
            setTimeout(function(){showCutscene(lines,function(){spawnStoryBoss('dark_king');});},1500);
        }
        // Story chapter 3 Dark King dies → story complete
        if(storyChapter===3&&bkey==='dark_king'){
            hide('waveHUD');
            var lines2=[
                {speaker:'👁️ The Dark King',portrait:'👁️',text:'"N-no... impossible... I cannot be defeated...!"'},
                {speaker:'⚔️ Sir Owen',portrait:'⚔️',text:'"It\'s over! The Dark King is defeated! The castle is free! You are a true hero, '+pName+'! 🏆"'}
            ];
            showCutscene(lines2,function(){completeStoryChapter();});
        }
    } else if(selectedMode==='bossrush'){
        setTimeout(function(){if(gameStarted)nextRush();},3000);
    } else {
        scene.time.addEvent({delay:180000,callback:function(){if(gameStarted)spawnBoss(selectedMode==='survival'?'srv':'adv');}});
    }
}
function updateBossHP(){if(!boss||!bossHPBar)return;bossHPBar.width=500*(boss.hp/boss.maxHp);}

// ================================
// POTION
// ================================
function spawnPotion(x,y,force){if(!force&&Math.random()>.35)return;var p=potions.create(x,y,'potTex');p.setCollideWorldBounds(true);scene.tweens.add({targets:p,y:p.y-12,duration:600,yoyo:true,repeat:-1});p.lbl=scene.add.text(x-8,y-28,'💊',{fontSize:'14px'});return p;}
function onPickPotion(player,potion){inv.push('Health Potion');updateInvPanel();if(potion.lbl)potion.lbl.destroy();potion.destroy();S.pick();checkQ('collect',{});float('💊 Potion!',player.x,player.y-60,'#ff69b4');}
function doPot(){var i=inv.indexOf('Health Potion');if(i===-1){float('❌ No potions!',player.x,player.y-60,'#f00');return;}inv.splice(i,1);updateInvPanel();pH=Math.min(pH+40,pMaxH);updateHP();S.pick();float('+40 HP!',player.x,player.y-60,'#44ff44');}

// ================================
// ABILITIES (all 20 classes)
// ================================
function doAbi(){
    var now=Date.now();
    if(now-lastAbi<pClass.cd){float('⏳ '+Math.ceil((pClass.cd-(now-lastAbi))/1000)+'s',player.x,player.y-60,'#888');return;}
    lastAbi=now;S.abi();
    var btn=el('abilityBtn');if(btn){btn.classList.add('cooldown');setTimeout(function(){btn.classList.remove('cooldown');},pClass.cd);}
    var c=selectedClass;
    var abiMap={warrior:abiWarrior,archer:abiArcher,mage:abiMage,rogue:abiRogue,paladin:abiPaladin,necromancer:abiNecro,berserker:abiBerserk,ranger:abiRanger,knight:abiKnight,monk:abiMonk,shaman:abiShaman,druid:abiDruid,assassin:abiAssassin,warlord:abiWarlord,archmage:abiArchmage,vampire:abiVampire,gunslinger:abiGunslinger,bard:abiBard,phantom:abiPhantom,dragonrider:abiDragonRider};
    if(abiMap[c])abiMap[c]();
}
function abiWarrior(){float('🛡️ SHIELD BASH!',player.x-60,player.y-70,'#ff8888');particles(player.x,player.y,0xff6666,16);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<160){var prev=e.speed;e.speed=0;e.setTint(0xffff00);e.hp-=pDmg*2.5;scene.time.delayedCall(2500,function(){if(e&&e.active){e.speed=prev;e.clearTint();}});if(e.hp<=0)killEnemy(e);}});}
function abiArcher(){float('🏹 ARROW RAIN!',player.x-60,player.y-70,'#88ff88');for(var i=0;i<16;i++){(function(a){var arr=scene.add.rectangle(player.x,player.y,22,5,0x88ff44).setRotation(a).setDepth(10);scene.tweens.add({targets:arr,x:player.x+Math.cos(a)*280,y:player.y+Math.sin(a)*280,alpha:0,duration:450,onComplete:function(){arr.destroy();}});enemies.getChildren().forEach(function(e){var ex=e.x-player.x,ey=e.y-player.y,d=Math.sqrt(ex*ex+ey*ey);if(d<280&&Math.abs(Math.atan2(ey,ex)-a)<.25){e.hp-=pDmg;if(e.hp<=0)killEnemy(e);}});})(i/16*Math.PI*2);}}
function abiMage(){float('🔥 FIREBALL!',player.x-50,player.y-70,'#8888ff');particles(player.x,player.y,0xff4400,28);scene.cameras.main.shake(500,.02);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<270){e.hp-=pDmg*3.5;if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<270){boss.hp-=pDmg*3.5;updateBossHP();if(boss.hp<=0)killBoss();}}
function abiRogue(){float('👁️ VANISH!',player.x-40,player.y-70,'#ffaa44');invisible=true;player.setAlpha(.15);pSpd*=2;scene.time.delayedCall(3000,function(){invisible=false;player.setAlpha(1);pSpd/=2;float('👁️ Visible!',player.x-40,player.y-60,'#ffaa44');});}
function abiPaladin(){float('✨ HOLY AURA!',player.x-60,player.y-70,'#ffddaa');var heal=Math.floor(pMaxH*.35);pH=Math.min(pH+heal,pMaxH);updateHP();for(var i=0;i<20;i++){(function(a){var s=scene.add.circle(player.x+Math.cos(a)*80,player.y+Math.sin(a)*80,6,0xffff88).setDepth(15);scene.tweens.add({targets:s,x:player.x,y:player.y,alpha:0,duration:600,onComplete:function(){s.destroy();}});})(i/20*Math.PI*2);}float('+'+heal+' HP!',player.x,player.y-90,'#ffff44');}
function abiNecro(){float('☠️ RAISE DEAD!',player.x-60,player.y-70,'#88ff88');for(var i=0;i<3;i++){(function(a){var mx=player.x+Math.cos(a)*60,my=player.y+Math.sin(a)*60;var mn=scene.physics.add.image(mx,my,'minionTex');mn.speed=130;minions.push(mn);mn.lbl=scene.add.text(mx,my-28,'☠️',{fontSize:'14px'}).setOrigin(.5);scene.physics.add.overlap(mn,enemies,function(m,e){if(!e||!e.active)return;e.hp-=15;if(e.hp<=0)killEnemy(e);});scene.time.delayedCall(15000,function(){if(mn&&mn.active){if(mn.lbl)mn.lbl.destroy();mn.destroy();minions=minions.filter(function(m){return m!==mn;});}});})(i/3*Math.PI*2);}}
function abiBerserk(){float('😤 BERSERK!',player.x-50,player.y-70,'#ff4444');berserking=true;pSpd*=1.6;pDmg=Math.floor(pDmg*2.5);player.setTint(0xff2200);scene.cameras.main.shake(300,.015);scene.time.delayedCall(8000,function(){berserking=false;pSpd/=1.6;pDmg=Math.floor(pDmg/2.5);player.clearTint();float('😤 Rage ended',player.x-50,player.y-60,'#888');});}
function abiRanger(){float('🐺 WOLF PACK!',player.x-50,player.y-70,'#44ffaa');for(var i=0;i<2;i++){(function(){var wx=player.x+Phaser.Math.Between(-60,60),wy=player.y+Phaser.Math.Between(-60,60);var wf=scene.physics.add.image(wx,wy,'wolfTex');wf.speed=200;wolfPets.push(wf);wf.lbl=scene.add.text(wx,wy-28,'🐺',{fontSize:'14px'}).setOrigin(.5);scene.physics.add.overlap(wf,enemies,function(w,e){if(!e||!e.active)return;var now=Date.now();if(!w.lb||now-w.lb>800){w.lb=now;e.hp-=20+pLv*3;if(e.hp<=0)killEnemy(e);}});scene.time.delayedCall(18000,function(){if(wf&&wf.active){if(wf.lbl)wf.lbl.destroy();wf.destroy();wolfPets=wolfPets.filter(function(w){return w!==wf;});}});})(i);}  }
function abiKnight(){float('💨 CHARGE!',player.x-50,player.y-70,'#aaaaff');player.setVelocity(playerFacing*1200,0);scene.time.addEvent({delay:30,repeat:5,callback:function(){enemies.getChildren().forEach(function(e){if(!e||!e.active)return;if(Math.abs(e.x-player.x)<60&&Math.abs(e.y-player.y)<50){e.hp-=pDmg*2;e.setTint(0xaaaaff);var push=playerFacing*200;e.setVelocityX(push);scene.time.delayedCall(300,function(){if(e&&e.active){e.clearTint();e.setVelocityX(0);}});float(Math.floor(pDmg*2),e.x,e.y-40,'#aaaaff');if(e.hp<=0)killEnemy(e);}}); }});scene.time.delayedCall(200,function(){if(player)player.setVelocity(0);});particles(player.x+playerFacing*60,player.y,0xaaaaff,14);}
function abiMonk(){float('👊 COMBO STRIKE!',player.x-70,player.y-70,'#ffcc88');[0,120,240,360,480].forEach(function(delay,i){setTimeout(function(){if(!player||!player.active||!gameStarted)return;particles(player.x+playerFacing*pRange*.5,player.y,0xffcc44,8);scene.cameras.main.shake(80,.004);enemies.getChildren().forEach(function(e){if(!e||!e.active)return;if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<=pRange+20){var dmg=Math.floor(pDmg*(1+i*.3));e.hp-=dmg;float(dmg,e.x,e.y-30-i*10,'#ffcc44');if(e.hp<=0)killEnemy(e);}});if(i===4)float('💥 5-HIT COMBO!',player.x-80,player.y-90,'#ff8800');},delay);});}
function abiShaman(){float('🌩️ LIGHTNING STORM!',player.x-80,player.y-70,'#ffff44');scene.cameras.main.flash(300,255,255,100);var tgts=[];enemies.getChildren().forEach(function(e){if(e&&e.active)tgts.push(e);});tgts.sort(function(){return Math.random()-.5;}).slice(0,8).forEach(function(e,idx){setTimeout(function(){if(!e||!e.active)return;var bolt=scene.add.graphics();bolt.lineStyle(3,0xffff00,1);bolt.lineBetween(e.x,e.y-120,e.x,e.y);scene.tweens.add({targets:bolt,alpha:0,duration:300,onComplete:function(){bolt.destroy();}});var dmg=Math.floor(pDmg*1.8);e.hp-=dmg;e.setTint(0xffff00);scene.time.delayedCall(150,function(){if(e&&e.active)e.clearTint();});float('⚡ '+dmg,e.x,e.y-50,'#ffff00');if(e.hp<=0)killEnemy(e);},idx*120);});if(boss&&boss.active){boss.hp-=pDmg*4;updateBossHP();if(boss.hp<=0)killBoss();}}
function abiDruid(){float('🌿 NATURE HEAL!',player.x-70,player.y-70,'#aaffcc');var heal=Math.floor(pMaxH*.5);pH=Math.min(pH+heal,pMaxH);updateHP();for(var i=0;i<12;i++){(function(a){var leaf=scene.add.circle(player.x+Math.cos(a)*60,player.y+Math.sin(a)*60,7,0x44ff88).setDepth(15);scene.tweens.add({targets:leaf,x:player.x,y:player.y,alpha:0,duration:800,onComplete:function(){leaf.destroy();}});})(i/12*Math.PI*2);}float('+'+heal+' HP!',player.x,player.y-90,'#44ff44');}
function abiAssassin(){float('⚡ CHAIN STRIKE!',player.x-70,player.y-70,'#ff6688');var tgts=[];enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<300)tgts.push(e);});tgts.sort(function(a,b){return Phaser.Math.Distance.Between(player.x,player.y,a.x,a.y)-Phaser.Math.Distance.Between(player.x,player.y,b.x,b.y);}).slice(0,5).forEach(function(e,i){setTimeout(function(){if(!e||!e.active)return;var dmg=Math.floor(pDmg*2*Math.pow(.8,i));e.hp-=dmg;float('⚡ '+dmg,e.x,e.y-40,'#ff6688');if(e.hp<=0)killEnemy(e);},i*100);});}
function abiWarlord(){float('👑 RALLY ARMY!',player.x-70,player.y-70,'#ffcc44');for(var i=0;i<4;i++){(function(a){var sx=player.x+Math.cos(a)*80,sy=player.y+Math.sin(a)*80;var sol=scene.physics.add.image(sx,sy,'minionTex').setTint(0xffcc44);sol.speed=160;minions.push(sol);sol.lbl=scene.add.text(sx,sy-28,'⚔️',{fontSize:'12px'}).setOrigin(.5);scene.physics.add.overlap(sol,enemies,function(m,e){if(!e||!e.active)return;e.hp-=pDmg*.8;if(e.hp<=0)killEnemy(e);});scene.time.delayedCall(20000,function(){if(sol&&sol.active){if(sol.lbl)sol.lbl.destroy();sol.destroy();minions=minions.filter(function(m){return m!==sol;});}});})(i/4*Math.PI*2);}}
function abiArchmage(){float('💥 METEOR STRIKE!',player.x-80,player.y-70,'#cc88ff');particles(player.x,player.y,0xff4400,40);particles(player.x,player.y,0xcc88ff,30);scene.cameras.main.shake(800,.035);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<400){e.hp-=pDmg*6;if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<400){boss.hp-=pDmg*6;updateBossHP();if(boss.hp<=0)killBoss();}}
function abiVampire(){float('🩸 BLOOD DRAIN!',player.x-70,player.y-70,'#cc0044');var drained=0;enemies.getChildren().forEach(function(e){if(!e||!e.active||Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)>200)return;var drain=Math.floor(pDmg*1.5);e.hp-=drain;drained+=Math.floor(drain*.6);for(var i=0;i<4;i++){var bp=scene.add.circle(e.x,e.y,4,0xff0044).setDepth(14);scene.tweens.add({targets:bp,x:player.x,y:player.y,duration:400,onComplete:function(){bp.destroy();}});}float('🩸 -'+drain,e.x,e.y-40,'#cc0044');if(e.hp<=0)killEnemy(e);});if(drained>0){pH=Math.min(pH+drained,pMaxH);updateHP();float('🩸 +'+drained+' life!',player.x,player.y-90,'#ff4488');}}
function abiGunslinger(){float('💥 BULLET STORM!',player.x-70,player.y-70,'#ffcc00');for(var i=0;i<10;i++){(function(ao){setTimeout(function(){if(!player||!player.active)return;var base=playerFacing===1?0:Math.PI;var angle=base+ao;var bullet=scene.add.image(player.x,player.y,'bulletTex').setDepth(12);var tx=player.x+Math.cos(angle)*320,ty=player.y+Math.sin(angle)*320;scene.tweens.add({targets:bullet,x:tx,y:ty,duration:220,onComplete:function(){bullet.destroy();}});enemies.getChildren().forEach(function(e){if(!e||!e.active)return;var d=Math.sqrt(Math.pow(e.x-player.x,2)+Math.pow(e.y-player.y,2));var ea=Math.atan2(e.y-player.y,e.x-player.x);if(d<320&&Math.abs(ea-angle)<.22){var dmg=Math.floor(pDmg*(Math.random()<.2?2:1));e.hp-=dmg;float('💥 '+dmg,e.x,e.y-40,'#ffcc00');if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active){var bd=Math.atan2(boss.y-player.y,boss.x-player.x);if(Math.abs(bd-angle)<.3){boss.hp-=Math.floor(pDmg*.8);updateBossHP();if(boss.hp<=0)killBoss();}}},i*60);})(i/10-.5)*1.2);}
function abiBard(){float('🎶 BATTLE HYMN!',player.x-70,player.y-70,'#ff88ff');pSpd*=1.4;pDmg=Math.floor(pDmg*1.5);player.setTint(0xff88ff);for(var i=0;i<12;i++){(function(a){var n=scene.add.text(player.x+Math.cos(a)*50,player.y+Math.sin(a)*50,['🎵','🎶','🎸','🎺'][Math.floor(Math.random()*4)],{fontSize:'18px'}).setDepth(15);scene.tweens.add({targets:n,x:player.x+Math.cos(a)*150,y:player.y+Math.sin(a)*150-40,alpha:0,duration:1200,onComplete:function(){n.destroy();}});})(i/12*Math.PI*2);}pH=Math.min(pH+Math.floor(pMaxH*.2),pMaxH);updateHP();float('🎶 +Buff 6s! +20% HP!',player.x,player.y-90,'#ff88ff');scene.time.delayedCall(6000,function(){pSpd/=1.4;pDmg=Math.floor(pDmg/1.5);player.clearTint();float('🎶 Hymn fades',player.x-50,player.y-60,'#888');});}
// PASS EXCLUSIVE abilities
function abiPhantom(){float('💨 PHASE STRIKE!',player.x-70,player.y-70,'#aaffff');invisible=true;player.setAlpha(.1);pDmg=Math.floor(pDmg*3);var hit=0;enemies.getChildren().forEach(function(e){if(!e||!e.active||Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)>pRange*2)return;e.hp-=pDmg;float('💨 PHASE',e.x,e.y-40,'#aaffff');if(e.hp<=0)killEnemy(e);hit++;});if(boss&&boss.active){boss.hp-=pDmg*2;updateBossHP();if(boss.hp<=0)killBoss();}pDmg=Math.floor(pDmg/3);scene.time.delayedCall(2500,function(){invisible=false;player.setAlpha(1);float('💨 Phase ended',player.x-50,player.y-60,'#888');});particles(player.x,player.y,0xaaffff,20);}
function abiDragonRider(){float('🔥 DRAGON BREATH!',player.x-80,player.y-70,'#ff8800');scene.cameras.main.shake(600,.025);var angle=playerFacing===1?0:Math.PI;for(var i=0;i<20;i++){(function(a){var fire=scene.add.circle(player.x,player.y,Phaser.Math.Between(8,18),0xff4400).setDepth(14);var tx=player.x+Math.cos(a)*Phaser.Math.Between(150,350),ty=player.y+Math.sin(a)*Phaser.Math.Between(-60,60);scene.tweens.add({targets:fire,x:tx,y:ty,alpha:0,scaleX:.3,scaleY:.3,duration:Phaser.Math.Between(300,600),onComplete:function(){fire.destroy();}});enemies.getChildren().forEach(function(e){if(!e||!e.active)return;if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<350&&Math.abs(e.y-player.y)<120){e.hp-=pDmg*2.5;e.setTint(0xff4400);scene.time.delayedCall(200,function(){if(e&&e.active)e.clearTint();});if(e.hp<=0)killEnemy(e);}});})(angle+(Math.random()-.5)*.8);}if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<350){boss.hp-=pDmg*4;updateBossHP();if(boss.hp<=0)killBoss();}}

// ================================
// XP + LEVEL
// ================================
function gainXP(amount){pXP+=amount;float('+'+amount+' XP',player.x,player.y-70,'#ffff44');if(pXP>=xpNext)levelUp();if(xpBar)xpBar.width=202*(pXP/xpNext);if(xpText)xpText.setText('XP: '+pXP+'/'+xpNext);checkQ('level',{});earnPassXP(5);}
function levelUp(){pXP-=xpNext;pLv++;xpNext=pLv*100;pMaxH+=20;pH=pMaxH;pSpd+=5;pDmg+=5;S.lvup();scene.tweens.add({targets:player,scaleX:1.5,scaleY:1.5,duration:200,yoyo:true,repeat:2});player.setTint(0xffff00);scene.time.delayedCall(800,function(){if(!berserking)player.clearTint();});if(lvTxt)lvTxt.setText('⭐ Lv.'+pLv);if(nameTxt)nameTxt.setText(pClass.icon+' '+pName+' Lv.'+pLv);updateHP();float('🌟 LEVEL UP! '+pLv,player.x-70,player.y-90,'#ffff00');doSave();earnPassXP(50);}

// ================================
// DAY/NIGHT
// ================================
function startDayNight(){timeTxt=scene.add.text(640,15,'☀️ Day',{fontSize:'14px',fill:'#ffff88'}).setOrigin(.5,0).setScrollFactor(0).setDepth(10);scene.time.addEvent({delay:35000,loop:true,callback:function(){dayTime=dayTime===0?1:0;if(dayTime===1){timeTxt.setText('🌙 Night');scene.tweens.add({targets:nightOverlay,alpha:.5,duration:3000});enemies.getChildren().forEach(function(e){e.speed*=1.25;});float('🌙 Night!',player.x-50,player.y-80,'#aaaaff');}else{timeTxt.setText('☀️ Day');scene.tweens.add({targets:nightOverlay,alpha:0,duration:3000});enemies.getChildren().forEach(function(e){e.speed/=1.25;});float('☀️ Day!',player.x-30,player.y-80,'#ffff88');}}}); }
function startSurvTimer(){scene.time.addEvent({delay:1000,loop:true,callback:function(){if(!gameStarted||!player||!player.active)return;survTimer++;checkQ('survive',{});if(survTimer%5===0&&pH<pMaxH){pH=Math.min(pH+1,pMaxH);updateHP();}}});}

// ================================
// TOMBSTONE
// ================================
function spawnTombstone(x,y){
    addTombVis(x,y,pName,pLv,'#cccccc');
    if(tombsRef&&myId){var ref=tombsRef.push({x:x,y:y,name:pClass.icon+' '+pName,level:pLv,mode:selectedMode,sid:myId,t:Date.now()});setTimeout(function(){if(ref)ref.remove();},5000);}
}
function addTombVis(x,y,name,level,color){
    if(!scene)return;
    var stone=scene.add.image(x,y,'tombTex').setDepth(7);
    var lbl=scene.add.text(x,y-34,'💀 '+name+'\nLv.'+level,{fontSize:'10px',fill:color||'#ccc',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(.5).setDepth(7);
    tombs.push({stone:stone,lbl:lbl});
    setTimeout(function(){if(!scene)return;scene.tweens.add({targets:[stone,lbl],alpha:0,duration:1500,onComplete:function(){if(stone&&stone.active)stone.destroy();if(lbl&&lbl.active)lbl.destroy();}});},5000);
}

// ================================
// SAVE — keeps gold/classes/skins!
// ================================
function doSave(){
    saveGame();S.save();
    var notif=el('saveNotif');var ntxt=el('saveText');
    if(ntxt)ntxt.textContent='✅ Saved! Lv.'+pLv+'  💰'+gold+'  Score:'+score;
    if(notif){notif.style.display='block';notif.style.opacity='1';setTimeout(function(){notif.style.transition='opacity .6s';notif.style.opacity='0';setTimeout(function(){if(notif)notif.style.display='none';},700);},2500);}
    if(player)float('💾 Saved!',player.x,player.y-60,'#00ffff');
}
function saveGame(){
    // IMPORTANT: save combat progress separately from permanent data
    // This means gold/classes/skins are NEVER lost on update
    localStorage.setItem('rpgSave',JSON.stringify({
        saveVersion:2, pLv:pLv, pXP:pXP, pH:pH, pMaxH:pMaxH, pSpd:pSpd, pDmg:pDmg, xpNext:xpNext,
        score:score, inv:inv, pName:pName, cls:selectedClass, qStats:questStats, storyChapter:storyChapter
    }));
    // Permanent data always in pData (separate localStorage key + Firebase)
    if(typeof pData!=='undefined'){pData.gold=gold;pData.passXP=passXP;pData.passLevel=passLevel;savePData();}
    // Sync permanent data to Firebase if logged in
    if(typeof firebase!=='undefined'&&typeof window._uid==='string'&&window._uid){
        try{db.ref('users/'+window._uid+'/pData').set(pData);}catch(e){}
    }
}
function loadGame(){
    try{
        var s=localStorage.getItem('rpgSave');if(!s)return;var d=JSON.parse(s);if(!d)return;
        pLv=d.pLv||1;pXP=d.pXP||0;pH=d.pH||100;pMaxH=d.pMaxH||100;
        pSpd=d.pSpd||200;pDmg=d.pDmg||20;xpNext=d.xpNext||100;score=d.score||0;
        inv=d.inv||[];pName=d.pName||'Hero';
        if(d.cls)window._cls=d.cls;
        if(d.qStats)questStats=d.qStats;
        if(d.storyChapter)storyChapter=d.storyChapter;
        console.log('Loaded! Lv.'+pLv);
    }catch(e){console.log('No save');}
}

// ================================
// BUILD UI
// ================================
function buildUI(){
    scene.add.rectangle(16,16,206,22,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    hpBar=scene.add.rectangle(18,18,202,18,0x22cc22).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    hpText=scene.add.text(22,18,'HP: '+pH+'/'+pMaxH,{fontSize:'12px',fill:'#fff'}).setScrollFactor(0).setDepth(11);
    scene.add.rectangle(16,44,206,14,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    xpBar=scene.add.rectangle(18,46,0,10,0xdddd00).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    xpText=scene.add.text(22,45,'XP: 0/'+xpNext,{fontSize:'10px',fill:'#ddd'}).setScrollFactor(0).setDepth(11);
    scene.add.rectangle(16,62,206,10,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    staminaBar=scene.add.rectangle(18,64,202,6,0x44aaff).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    lvTxt=scene.add.text(16,76,'⭐ Lv.'+pLv,{fontSize:'14px',fill:'#ffdd00'}).setScrollFactor(0).setDepth(10);
    scoreTxt=scene.add.text(16,95,'Score: '+score,{fontSize:'13px',fill:'#fff'}).setScrollFactor(0).setDepth(10);
    goldTxt=scene.add.text(16,113,'💰 '+gold,{fontSize:'13px',fill:'#ffdd44'}).setScrollFactor(0).setDepth(10);
    var classLabel=pClass.icon+' '+pClass.name+(activeTitle?' ·'+activeTitle:'');
    scene.add.text(16,131,classLabel,{fontSize:'11px',fill:'#ffbb88'}).setScrollFactor(0).setDepth(10);
    if(!isMobile)scene.add.text(16,696,'WASD:Move  SHIFT:Sprint  SPACE:Atk  E:'+(storyMode?'Talk/Abi':pClass.ability)+'  F:Pot  T:Chat  M:Music  ENTER:Save',{fontSize:'10px',fill:'#88aa88'}).setScrollFactor(0).setDepth(10);
    nameTxt=scene.add.text(0,0,pClass.icon+' '+pName+' Lv.'+pLv,{fontSize:'12px',fill:'#fff',stroke:'#000',strokeThickness:2});
}
function updateHP(){
    if(!hpBar||!hpText)return;
    var p=Math.max(0,pH)/pMaxH;hpBar.width=202*p;
    if(p>.6)hpBar.setFillStyle(0x22cc22);else if(p>.3)hpBar.setFillStyle(0xddcc00);else hpBar.setFillStyle(0xdd2222);
    hpText.setText('HP: '+Math.max(0,Math.floor(pH))+'/'+pMaxH);
    if(myRef)myRef.update({hp:Math.floor(pH),maxHp:pMaxH});
}

// ================================
// INVENTORY
// ================================
function buildInv(){invPanel=scene.add.container(0,0);var bg=scene.add.rectangle(640,360,420,310,0x0a0a0a,.95);var title=scene.add.text(640,222,'🎒 Inventory',{fontSize:'22px',fill:'#ffaa00'}).setOrigin(.5);invPanel.add([bg,title]);invPanel.setScrollFactor(0).setDepth(30);invPanel.setVisible(false);}
function updateInvPanel(){invTexts.forEach(function(t){t.destroy();});invTexts=[];if(!inv.length){var e=scene.add.text(640,360,'No items...',{fontSize:'16px',fill:'#444'}).setOrigin(.5).setScrollFactor(0).setDepth(31);invTexts.push(e);return;}var counts={};inv.forEach(function(i){counts[i]=(counts[i]||0)+1;});var y=275;Object.keys(counts).forEach(function(item){var t=scene.add.text(640,y,'💊 '+item+'  ×'+counts[item],{fontSize:'18px',fill:'#fff'}).setOrigin(.5).setScrollFactor(0).setDepth(31);invTexts.push(t);y+=44;});}
function toggleInv(){invOpen=!invOpen;invPanel.setVisible(invOpen);if(invOpen)updateInvPanel();}

// ================================
// HELPERS
// ================================
function particles(x,y,color,n){n=n||12;for(var i=0;i<n;i++){(function(a){var p=scene.add.circle(x,y,Phaser.Math.Between(3,9),color).setDepth(15);var spd=Phaser.Math.Between(70,190);scene.tweens.add({targets:p,x:x+Math.cos(a)*spd,y:y+Math.sin(a)*spd,alpha:0,scaleX:0,scaleY:0,duration:Phaser.Math.Between(350,700),onComplete:function(){p.destroy();}});})(i/n*Math.PI*2);}}
function float(msg,x,y,color){var t=scene.add.text(x,y,msg,{fontSize:'15px',fill:color,stroke:'#000',strokeThickness:3}).setDepth(20);scene.tweens.add({targets:t,y:y-55,alpha:0,duration:1400,onComplete:function(){t.destroy();}});}
function openChat(){chatOpen=true;var input=el('chatInput');if(!input)return;input.disabled=false;input.focus();input.onkeydown=function(e){if(e.key==='Enter'){var msg=input.value.trim();if(msg){addMsg(pName,msg,'#aaffaa');if(chatRef&&myId)chatRef.push({name:pClass.icon+' '+pName,msg:msg,sid:myId,t:Date.now()});}input.value='';input.disabled=true;chatOpen=false;input.blur();}if(e.key==='Escape'){input.value='';input.disabled=true;chatOpen=false;input.blur();}e.stopPropagation();};}
function addMsg(name,msg,color){var msgs=el('chatMessages');if(!msgs)return;var d=document.createElement('div');d.style.color=color||'#fff';d.style.marginBottom='3px';d.innerHTML='<b>'+name+':</b> '+msg;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
function updateMinimap(){
    var canvas=el('minimap');if(!canvas||!player)return;
    canvas.width=130;canvas.height=130;
    var ctx=canvas.getContext('2d'),sx=130/(mW*tSz),sy=130/(mH*tSz);
    var bgM={adventure:'#1a4a1a',survival:'#3d1500',bossrush:'#0d0011',pvp:'#1a1a22',story:'#111133'};
    ctx.fillStyle=inShadow?'#110022':(bgM[selectedMode]||'#1a4a1a');ctx.fillRect(0,0,130,130);
    enemies.getChildren().forEach(function(e){ctx.fillStyle='#ff4444';ctx.fillRect(e.x*sx-2,e.y*sy-2,4,4);});
    if(boss&&boss.active){ctx.fillStyle='#ff0000';ctx.fillRect(boss.x*sx-5,boss.y*sy-5,10,10);}
    Object.values(otherPlayers).forEach(function(op){if(op.dim!==dim)return;ctx.fillStyle='#cc88ff';ctx.fillRect(op.sprite.x*sx-2,op.sprite.y*sy-2,5,5);});
    if(storyMode){storyNPCList.forEach(function(n){ctx.fillStyle='#ffcc44';ctx.fillRect(n.x*sx-3,n.y*sy-3,6,6);});}
    if(selectedMode==='adventure'){if(!inShadow){ctx.fillStyle='#aa00ff';ctx.fillRect(22*tSz*sx-3,22*tSz*sy-3,6,6);}else{ctx.fillStyle='#ffaa00';ctx.fillRect(4*tSz*sx-3,4*tSz*sy-3,6,6);}}
    ctx.fillStyle='#'+(skinColor?skinColor.toString(16).padStart(6,'0'):'4488ff');
    ctx.beginPath();ctx.arc(player.x*sx,player.y*sy,5,0,Math.PI*2);ctx.fill();
}

// ================================
// GAME OVER
// ================================
function showGameOver(){
    player.setVelocity(0);player.setActive(false);gameStarted=false;window.gameStarted=false;
    spawnTombstone(player.x,player.y);S.over();MUS.stop();
    if(myRef)myRef.update({alive:false});
    setTimeout(function(){
        scene.cameras.main.fade(2000,0,0,0,false,function(cam,prog){
            if(prog!==1)return;
            var mLabels={adventure:'🌲 Adventure',survival:'🔥 Survival — Wave '+wave,bossrush:'💀 Boss Rush — Boss #'+rushIdx,pvp:'⚔️ PvP',story:'📖 Story — Ch.'+storyChapter};
            var ov=document.createElement('div');
            ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s;font-family:Arial,sans-serif;color:#fff;padding:16px;';
            ov.innerHTML='<div style="text-align:center;max-width:500px;"><div style="font-size:clamp(52px,10vw,84px);margin-bottom:8px;">💀</div><h1 style="font-size:clamp(28px,7vw,52px);color:#ff2222;letter-spacing:4px;text-shadow:0 0 40px #f00;margin-bottom:4px;">GAME OVER</h1><p style="font-size:13px;color:#ffaa00;margin-bottom:2px;">'+mLabels[selectedMode]+'</p><p style="font-size:15px;color:#888;margin-bottom:2px;">'+(pClass?pClass.icon:'')+' <b>'+pName+'</b> — Level '+pLv+'</p><p style="font-size:20px;color:#ffdd44;margin-bottom:4px;">Score: '+score+'</p><p style="font-size:13px;color:#ffaa00;margin-bottom:18px;">💰 '+gold+' Gold (kept!)</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;"><button id="rBtn" style="padding:10px 26px;font-size:14px;background:linear-gradient(135deg,#aa0000,#dd2222);color:#fff;border:2px solid #ff4444;border-radius:10px;cursor:pointer;">⚔️ Play Again</button><button id="mBtn" style="padding:10px 26px;font-size:14px;background:#1a1a1a;color:#fff;border:2px solid #444;border-radius:10px;cursor:pointer;">🏠 Menu</button></div><p style="margin-top:10px;font-size:11px;color:#333;">💰 Gold is never lost!</p></div>';
            document.body.appendChild(ov);setTimeout(function(){ov.style.opacity='1';},50);
            function restart(){
                ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)document.body.removeChild(ov);},1000);
                // IMPORTANT: only reset COMBAT state, NOT gold/classes/skins
                pH=100;pMaxH=100;pXP=0;pLv=1;pSpd=200;pDmg=20;xpNext=100;score=0;
                inv=[];bossSpawned=false;dim=0;survTimer=0;minions=[];wolfPets=[];berserking=false;invisible=false;inShadow=false;wave=0;rushIdx=0;normalTiles=[];shadowTiles=[];castleTiles=[];tombs=[];storyNPCList=[];storyObjProgress=[];storyChapter=0;storyDone=false;storyWave=0;
                gameStarted=false;window.gameStarted=false;
                // Don't remove rpgSave here — keep gold
                var savedPData=localStorage.getItem('rpgPData');
                localStorage.removeItem('rpgSave');
                if(savedPData)localStorage.setItem('rpgPData',savedPData);
                scene.cameras.main.fadeIn(100);scene.scene.restart();
                setTimeout(function(){
                    var mm=document.getElementById('mainMenu');if(mm)mm.classList.add('active');
                    hide('storyPanel');hide('storyDialog');hide('waveHUD');
                    MUS.setTheme('menu');
                },500);
            }
            var rb=document.getElementById('rBtn'),mb=document.getElementById('mBtn');
            if(rb)rb.onclick=restart;if(mb)mb.onclick=restart;
            document.addEventListener('keydown',function onR(e){if(e.key==='r'||e.key==='R'){document.removeEventListener('keydown',onR);restart();}});
        });
    },1000);
}

// ================================
// UPDATE — 60fps
// ================================
function update(){
    if(!gameStarted||!player||!player.active)return;
    if(chatOpen)return;
    player.setVelocity(0);
    var spd=pSpd,moving=false;
    if((shiftKey&&shiftKey.isDown||window.touchSprinting)&&stamina>0){spd*=1.55;stamina=Math.max(0,stamina-.8);}
    else{stamina=Math.min(maxSta,stamina+.3);}
    if(staminaBar)staminaBar.width=202*(stamina/maxSta);
    if(cursors.left.isDown||wasd.left.isDown){player.setVelocityX(-spd);playerFacing=-1;player.setFlipX(true);moving=true;}
    else if(cursors.right.isDown||wasd.right.isDown){player.setVelocityX(spd);playerFacing=1;player.setFlipX(false);moving=true;}
    if(cursors.up.isDown||wasd.up.isDown){player.setVelocityY(-spd);moving=true;}
    else if(cursors.down.isDown||wasd.down.isDown){player.setVelocityY(spd);moving=true;}
    if(jsActive&&(Math.abs(jsDX)>.1||Math.abs(jsDY)>.1)){
        player.setVelocityX(jsDX*spd);player.setVelocityY(jsDY*spd);
        if(jsDX<-.1){playerFacing=-1;player.setFlipX(true);}else if(jsDX>.1){playerFacing=1;player.setFlipX(false);}
        moving=true;
    }
    if(moving)player.y+=Math.sin(Date.now()/120)*.5;
    if(atkIndicator)atkIndicator.setPosition(player.x,player.y);
    if(accessoryOverlay)accessoryOverlay.setPosition(player.x,player.y-28);
    sendPos();
    Object.values(otherPlayers).forEach(function(op){
        if(!op||!op.sprite)return;
        op.sprite.x+=(op.tx-op.sprite.x)*.18;op.sprite.y+=(op.ty-op.sprite.y)*.18;
        if(op.tag)op.tag.setPosition(op.sprite.x-30,op.sprite.y-55);
        if(op.hpBg)op.hpBg.setPosition(op.sprite.x,op.sprite.y-48);
        if(op.hpBar)op.hpBar.setPosition(op.sprite.x-20,op.sprite.y-48);
    });
    updateMinimap();
    if(nameTxt)nameTxt.setPosition(player.x-40,player.y-60);
    potions.getChildren().forEach(function(p){if(p.lbl)p.lbl.setPosition(p.x-8,p.y-28);});
    if(boss&&boss.active){var bdx=player.x-boss.x,bdy=player.y-boss.y,bd=Math.sqrt(bdx*bdx+bdy*bdy);if(bd>0){boss.setVelocityX(bdx/bd*boss.speed);boss.setVelocityY(bdy/bd*boss.speed);}boss.rotation+=.015;}
    minions.forEach(function(m){if(!m||!m.active)return;var dx=player.x-m.x,dy=player.y-m.y,d=Math.sqrt(dx*dx+dy*dy);if(d>80&&d>0){m.setVelocityX(dx/d*m.speed);m.setVelocityY(dy/d*m.speed);}else m.setVelocity(0);if(m.lbl)m.lbl.setPosition(m.x,m.y-28);});
    wolfPets.forEach(function(w){if(!w||!w.active)return;var cl=null,cd=300;enemies.getChildren().forEach(function(e){if(!e||!e.active)return;var d=Phaser.Math.Distance.Between(w.x,w.y,e.x,e.y);if(d<cd){cd=d;cl=e;}});if(cl){var wdx=cl.x-w.x,wdy=cl.y-w.y,wd=Math.sqrt(wdx*wdx+wdy*wdy);if(wd>0){w.setVelocityX(wdx/wd*w.speed);w.setVelocityY(wdy/wd*w.speed);}}else{var pdx=player.x-w.x,pdy=player.y-w.y,pd=Math.sqrt(pdx*pdx+pdy*pdy);if(pd>100&&pd>0){w.setVelocityX(pdx/pd*150);w.setVelocityY(pdy/pd*150);}else w.setVelocity(0);}if(w.lbl)w.lbl.setPosition(w.x,w.y-28);});
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active||e.speed===0)return;
        var dx=player.x-e.x,dy=player.y-e.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<280&&d>0){e.setVelocityX(dx/d*e.speed);e.setVelocityY(dy/d*e.speed);}
        else{var px=(e.px||e.x)-e.x,py=(e.py||e.y)-e.y,pd=Math.sqrt(px*px+py*py);if(pd>100&&pd>0){e.setVelocityX(px/pd*e.speed*.4);e.setVelocityY(py/pd*e.speed*.4);}else if(Math.random()<.008){e.setVelocityX(Phaser.Math.Between(-40,40));e.setVelocityY(Phaser.Math.Between(-40,40));}}
        var pool=e.pool||curPool;var mData=pool?pool[e.mtype]:null;var ms=mData?mData.size:40;
        if(e.hpBar){e.hpBar.setPosition(e.x,e.y-35);e.hpBar.width=ms*(e.hp/e.maxHp);}
        if(e.tag)e.tag.setPosition(e.x,e.y-50);
    });
    // Story NPC proximity
    if(storyMode&&!storyDialogActive){
        storyNearNPC=null;
        storyNPCList.forEach(function(npc){
            if(!npc.sprite||!npc.sprite.active)return;
            var d=Phaser.Math.Distance.Between(player.x,player.y,npc.x,npc.y);
            if(d<100){
                storyNearNPC=npc;
                if(!npc.promptShown){npc.promptShown=true;if(storyNPCPrompt)storyNPCPrompt.destroy();storyNPCPrompt=scene.add.text(npc.x,npc.y-80,isMobile?'Tap: Talk':'[E] Talk',{fontSize:'13px',fill:'#ffff44',stroke:'#000',strokeThickness:3}).setOrigin(.5).setDepth(20);scene.tweens.add({targets:storyNPCPrompt,y:npc.y-90,duration:600,yoyo:true,repeat:-1});}
            } else {npc.promptShown=false;}
        });
        if(!storyNearNPC&&storyNPCPrompt){storyNPCPrompt.destroy();storyNPCPrompt=null;}
        if(isMobile){var tb=el('npcTalkBtn');if(tb)tb.style.display=(storyNearNPC&&!storyDialogActive)?'block':'none';}
    }
}
