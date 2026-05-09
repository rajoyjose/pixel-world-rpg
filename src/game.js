// ================================
// PIXEL WORLD RPG — Big Update!
// 18 classes (11 free + 7 premium)
// Story Mode, PvP fix, accessories
// ================================

var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#1a8f2d',
    physics: { default:'arcade', arcade:{ gravity:{y:0}, debug:false } },
    scale: { mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_BOTH, width:1280, height:720 },
    input: { touch:true, activePointers:4 },
    scene: { preload:preload, create:create, update:update }
};
var game = new Phaser.Game(config);

// ================================
// ALL 18 CLASSES (11 free + 7 premium)
// ================================
var CLASSES = {
    // FREE CLASSES
    warrior:    { name:'Warrior',     icon:'⚔️',  hp:220, speed:155, damage:35, range:80,  ability:'Shield Bash',    abilityIcon:'🛡️', cd:5000,  atk:700 },
    archer:     { name:'Archer',      icon:'🏹',  hp:110, speed:285, damage:28, range:200, ability:'Arrow Rain',     abilityIcon:'🏹', cd:4000,  atk:500 },
    mage:       { name:'Mage',        icon:'🧙',  hp:80,  speed:200, damage:70, range:150, ability:'Fireball',       abilityIcon:'🔥', cd:6000,  atk:900 },
    rogue:      { name:'Rogue',       icon:'🗡️', hp:110, speed:265, damage:50, range:70,  ability:'Vanish',         abilityIcon:'👁️',cd:8000,  atk:400 },
    paladin:    { name:'Paladin',     icon:'⚜️', hp:180, speed:155, damage:28, range:90,  ability:'Holy Aura',      abilityIcon:'✨', cd:7000,  atk:800 },
    necromancer:{ name:'Necromancer', icon:'💀',  hp:90,  speed:195, damage:40, range:130, ability:'Raise Dead',     abilityIcon:'☠️', cd:9000,  atk:800 },
    berserker:  { name:'Berserker',   icon:'🪓',  hp:180, speed:195, damage:55, range:85,  ability:'Berserk Rage',   abilityIcon:'😤', cd:10000, atk:500 },
    ranger:     { name:'Ranger',      icon:'🌿',  hp:130, speed:245, damage:32, range:160, ability:'Wolf Pack',      abilityIcon:'🐺', cd:12000, atk:600 },
    // NEW FREE CLASSES
    knight:     { name:'Knight',      icon:'🛡️', hp:260, speed:138, damage:40, range:88,  ability:'Charge',         abilityIcon:'💨', cd:6000,  atk:700 },
    monk:       { name:'Monk',        icon:'🥊',  hp:125, speed:278, damage:28, range:62,  ability:'Combo Strike',   abilityIcon:'👊', cd:4000,  atk:280 },
    shaman:     { name:'Shaman',      icon:'⚡',  hp:98,  speed:195, damage:58, range:145, ability:'Lightning Storm',abilityIcon:'🌩️',cd:7000,  atk:880 },
    // PREMIUM CLASSES — unlockable in shop
    druid:      { name:'Druid',       icon:'🌙',  hp:150, speed:215, damage:38, range:120, ability:'Nature Heal',    abilityIcon:'🌿', cd:6000,  atk:650 },
    assassin:   { name:'Assassin',    icon:'🥷',  hp:100, speed:310, damage:60, range:75,  ability:'Chain Strike',   abilityIcon:'⚡', cd:5000,  atk:350 },
    warlord:    { name:'Warlord',     icon:'👑',  hp:200, speed:170, damage:45, range:95,  ability:'Rally Army',     abilityIcon:'⚔️', cd:8000,  atk:750 },
    archmage:   { name:'Archmage',    icon:'🔮',  hp:70,  speed:185, damage:90, range:200, ability:'Meteor Strike',  abilityIcon:'💥', cd:12000, atk:1000},
    // NEW PREMIUM CLASSES
    vampire:    { name:'Vampire',     icon:'🧛',  hp:135, speed:228, damage:44, range:78,  ability:'Blood Drain',    abilityIcon:'🩸', cd:8000,  atk:550 },
    gunslinger: { name:'Gunslinger',  icon:'🔫',  hp:108, speed:258, damage:40, range:225, ability:'Bullet Storm',   abilityIcon:'💥', cd:5500,  atk:420 },
    bard:       { name:'Bard',        icon:'🎵',  hp:102, speed:208, damage:24, range:115, ability:'Battle Hymn',    abilityIcon:'🎶', cd:9000,  atk:720 }
};

// ================================
// MONSTER POOLS per mode
// ================================
var POOL_ADV = {
    goblin:   { name:'👹 Goblin',   color:0xff4444, size:36, hp:30,  speed:80,  dmg:8,  xp:20, score:10, gold:5  },
    troll:    { name:'👺 Troll',    color:0x44aa44, size:58, hp:90,  speed:45,  dmg:22, xp:45, score:28, gold:15 },
    skeleton: { name:'💀 Skeleton', color:0xcccccc, size:36, hp:40,  speed:115, dmg:14, xp:30, score:20, gold:8  },
    demon:    { name:'😈 Demon',    color:0xaa00ff, size:44, hp:65,  speed:95,  dmg:26, xp:55, score:38, gold:20 },
    orc:      { name:'🗡️ Orc',     color:0x886600, size:50, hp:70,  speed:65,  dmg:18, xp:38, score:25, gold:12 }
};
var POOL_SRV = {
    firesprite:{ name:'🔥 Fire Sprite',color:0xff6600,size:34,hp:35,speed:100,dmg:12,xp:25,score:15,gold:6  },
    sandworm:  { name:'🐛 Sand Worm',  color:0xaa7700,size:52,hp:80,speed:50, dmg:20,xp:40,score:26,gold:14 },
    lavabeast: { name:'🌋 Lava Beast', color:0xff2200,size:46,hp:70,speed:70, dmg:28,xp:50,score:34,gold:18 },
    scorpion:  { name:'🦂 Scorpion',   color:0xcc8800,size:38,hp:45,speed:110,dmg:18,xp:35,score:22,gold:10 }
};
var POOL_BRS = {
    darkspirit:{ name:'👻 Dark Spirit',color:0x6600aa,size:38,hp:50,speed:120,dmg:20,xp:38,score:28,gold:12 },
    boneknight:{ name:'⚔️ Bone Knight',color:0xbbbbbb,size:44,hp:85,speed:60, dmg:25,xp:48,score:32,gold:16 },
    voidcreep: { name:'🌑 Void Creep', color:0x110033,size:40,hp:55,speed:105,dmg:22,xp:42,score:30,gold:14 }
};
var POOL_PVP = {}; // no mobs in pvp!
var POOL_SHADOW = {
    wraith:  { name:'👻 Wraith', color:0x8888ff,size:38,hp:55,speed:125,dmg:20,xp:42,score:32,gold:15 },
    vampire: { name:'🧛 Vampire',color:0xaa0044,size:42,hp:75,speed:88, dmg:28,xp:55,score:44,gold:20 },
    banshee: { name:'🌀 Banshee',color:0x00aaff,size:34,hp:38,speed:155,dmg:32,xp:48,score:36,gold:18 },
    lich:    { name:'☠️ Lich',   color:0x440088,size:50,hp:110,speed:58,dmg:38,xp:75,score:58,gold:28 }
};
// ================================
// CASTLE STORY POOLS
// ================================
var POOL_CASTLE = {
    guard:       { name:'⚔️ Castle Guard',    color:0x4466aa, size:40, hp:70,  speed:70,  dmg:18, xp:35, score:22, gold:12 },
    crossbowman: { name:'🏹 Crossbowman',     color:0x6688cc, size:36, hp:45,  speed:100, dmg:22, xp:28, score:18, gold:10 },
    shieldbearer:{ name:'🛡️ Shield Bearer',  color:0x335588, size:48, hp:110, speed:50,  dmg:14, xp:45, score:30, gold:14 }
};
var POOL_CASTLE_CH2 = {
    darkknight: { name:'🗡️ Dark Knight',  color:0x222255, size:46, hp:100, speed:60,  dmg:28, xp:55, score:38, gold:18 },
    shadowguard:{ name:'👁️ Shadow Guard', color:0x330055, size:38, hp:70,  speed:95,  dmg:24, xp:45, score:32, gold:15 }
};
var POOL_CASTLE_CH3 = {
    shadowsentry:{ name:'🌑 Shadow Sentry', color:0x220033, size:40, hp:90,  speed:85,  dmg:26, xp:50, score:36, gold:16 },
    voidwalker:  { name:'💜 Void Walker',   color:0x440066, size:36, hp:65,  speed:115, dmg:30, xp:42, score:28, gold:14 }
};
// ================================
// CASTLE STORY BOSSES
// ================================
var BOSS_VEX          = { name:'⚔️ Commander Vex',  bc:0x1a1a44, ec:0x4466ff, mc:0x2244aa, bar:0x4466ff, hp:500,  speed:65, xp:350, gold:180 };
var BOSS_SHADOW_MASTER = { name:'🌑 Shadow Master',  bc:0x110022, ec:0xaa00ff, mc:0x6600aa, bar:0xaa00ff, hp:650,  speed:75, xp:450, gold:220 };
var BOSS_DARK_KING     = { name:'👑 The Dark King',  bc:0x1a0033, ec:0xff00aa, mc:0xcc0066, bar:0xff0066, hp:900,  speed:60, xp:600, gold:400 };

// ================================
// BOSSES per mode
// ================================
var BOSS_ADV = { name:'🐉 Dragon King', bc:0x660000, ec:0xff0000, mc:0xffff00, bar:0xff0000, hp:600, speed:55, xp:400, gold:200 };
var BOSS_SRV = { name:'🌋 Lava Titan',  bc:0xff4400, ec:0xffff00, mc:0xff8800, bar:0xff6600, hp:400, speed:45, xp:300, gold:150 };
var BOSS_RUSH = [
    { name:'👻 Shadow Wraith', bc:0x220044, ec:0xaa00ff, mc:0x8800ff, bar:0xaa00ff, hp:300, speed:90,  xp:200, gold:100 },
    { name:'🧊 Frost Giant',   bc:0x003366, ec:0x00ffff, mc:0x0088ff, bar:0x00ffff, hp:450, speed:50,  xp:280, gold:140 },
    { name:'⚡ Storm Lord',    bc:0x443300, ec:0xffff00, mc:0xffaa00, bar:0xffff00, hp:550, speed:80,  xp:350, gold:180 },
    { name:'🌑 Void Master',   bc:0x000022, ec:0xff00ff, mc:0xaa00aa, bar:0xff00ff, hp:650, speed:70,  xp:420, gold:220 },
    { name:'💀 Death Emperor', bc:0x220000, ec:0xff0000, mc:0x880000, bar:0xff0000, hp:800, speed:65,  xp:500, gold:300 }
];

// ================================
// QUESTS
// ================================
var QUESTS = [
    { id:'q1',desc:'Kill 5 Goblins',   type:'kill',monster:'goblin',  target:5,  reward:60, xpR:50  },
    { id:'q2',desc:'Kill 3 Trolls',    type:'kill',monster:'troll',   target:3,  reward:80, xpR:75  },
    { id:'q3',desc:'Kill 4 Skeletons', type:'kill',monster:'skeleton',target:4,  reward:70, xpR:60  },
    { id:'q4',desc:'Collect 3 Potions',type:'collect',                target:3,  reward:50, xpR:40  },
    { id:'q5',desc:'Reach Level 3',    type:'level',                  target:3,  reward:150,xpR:100 },
    { id:'q6',desc:'Defeat the Boss',  type:'boss',                   target:1,  reward:500,xpR:400 },
    { id:'q7',desc:'Survive 2 minutes',type:'survive',                target:120,reward:200,xpR:150 },
    { id:'q8',desc:'Score 500 pts',    type:'score',                  target:500,reward:180,xpR:120 }
];

// ================================
// STORY MODE DATA — Castle Story
// ================================
var STORY_DATA = [
    {
        num:1, title:'📖 Ch.1: The Castle Gates', color:'#88aaff',
        npcId:'prisoner',
        dialog:[
            {speaker:'🧑 Escaped Prisoner', text:'"Please help! The Dark King\'s soldiers captured our village and locked us in this courtyard!"'},
            {speaker:'🧑 Escaped Prisoner', text:'"Fight through his guards — castle guards and crossbowmen patrol everywhere. Show them no mercy! ⚔️"'},
            {speaker:'🧑 Escaped Prisoner', text:'"Clear the courtyard and I\'ll find a way to get you inside the castle. The Dark King must be stopped! 🏰"'}
        ],
        objectives:[
            {id:'kill_guard',    desc:'Defeat 10 Castle Guards', type:'kill', monster:'guard',       target:10, n:0, done:false},
            {id:'kill_crossbow', desc:'Defeat 4 Crossbowmen',    type:'kill', monster:'crossbowman', target:4,  n:0, done:false}
        ],
        reward:200, rewardMsg:'🏆 Courtyard cleared! The prisoner cheers — +200 gold!'
    },
    {
        num:2, title:'📖 Ch.2: Into the Castle', color:'#cc88ff',
        npcId:'spy',
        cutscene:true,
        dialog:[
            {speaker:'🕵️ Rebel Spy', text:'"You made it inside! The Dark King\'s right hand — Commander Vex — commands this hall."'},
            {speaker:'🕵️ Rebel Spy', text:'"His Dark Knights are everywhere. Cut through them first, then face Vex himself. He\'s brutal but beatable!"'},
            {speaker:'🕵️ Rebel Spy', text:'"The throne room lies beyond. Vex must fall — for the realm! 💪"'}
        ],
        objectives:[
            {id:'kill_darkknight', desc:'Defeat 8 Dark Knights',     type:'kill', monster:'darkknight', target:8, n:0, done:false},
            {id:'kill_vex',        desc:'Defeat Commander Vex',      type:'boss', target:1, n:0, done:false}
        ],
        reward:350, rewardMsg:'🏆 Commander Vex falls! The throne room is open — +350 gold!'
    },
    {
        num:3, title:'📖 Ch.3: The Dark Throne', color:'#ffaa44',
        npcId:'wizard',
        dialog:[
            {speaker:'🧙 Court Mage', text:'"You reached the throne room! The Dark King is shielded by shadow magic — he cannot be harmed directly!"'},
            {speaker:'🧙 Court Mage', text:'"His Shadow Master maintains the shield. Destroy the shadow sentries protecting him, then face the Shadow Master!"'},
            {speaker:'🧙 Court Mage', text:'"Once the Shadow Master falls, the Dark King is exposed. Strike him down — the realm is counting on you! 🔮"'}
        ],
        objectives:[
            {id:'kill_shadowsentry', desc:'Defeat 6 Shadow Sentries',  type:'kill',       monster:'shadowsentry', target:6, n:0, done:false},
            {id:'kill_shadowmaster', desc:'Defeat the Shadow Master',   type:'story_boss', target:1, n:0, done:false},
            {id:'kill_darkking',     desc:'Defeat The Dark King',       type:'boss',       target:1, n:0, done:false}
        ],
        reward:1000, rewardMsg:'🏆 THE DARK KING IS DEFEATED! The realm is free! +1000 gold + title: Dark King Slayer!'
    }
];

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
var dim=0;
var inShadow=false;
var dimOverlay,nightOverlay;
var shadowTiles=[],normalTiles=[],portalCD=false;
var activeQuests=[],questStats={kills:{},bossKills:0,surviveTime:0};
var tombs=[],survTimer=0,dayTime=0,timeTxt;
var hpBar,hpText,xpBar,xpText,lvTxt,scoreTxt,goldTxt,nameTxt;
var invPanel,invTexts=[];
var atkIndicator;
var tSz=64,mW=28,mH=28;
var curPool=POOL_ADV;
var myId=null,myRef=null,playersRef=null,chatRef=null,tombsRef=null,pvpRef=null;
var lastSent=0;
var wave=0,waveTotal=0,waveKilled=0;
var rushIdx=0;

// Story mode state
var storyMode=false;
var storyChapter=0;
var storyNPCList=[];
var storyNearNPC=null;
var storyNPCPrompt=null;
var storyObjProgress=[];
var storyDialogActive=false;
var storyShadowKills=0;
var storyChapterComplete=false;
var storyDone=false;
var storyLairTriggered=false;
var storyBossPhase=0; // 0=none, 1=shadow master alive, 2=dark king alive
var accessoryOverlay=null;

// ================================
// SOUNDS
// ================================
function tone(f,d,t){ try{ var c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f;g.gain.setValueAtTime(0.3,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);o.start(c.currentTime);o.stop(c.currentTime+d); }catch(e){} }
var S={
    hit:  function(){tone(150,0.1,'square');},
    atk:  function(){tone(220,0.06,'sawtooth');},
    die:  function(){tone(80,0.2,'sawtooth');},
    lvup: function(){tone(523,0.1,'sine');setTimeout(function(){tone(659,0.1,'sine');},100);setTimeout(function(){tone(784,0.2,'sine');},200);},
    pick: function(){tone(600,0.08,'sine');},
    save: function(){tone(523,0.1,'sine');setTimeout(function(){tone(659,0.1,'sine');},120);setTimeout(function(){tone(880,0.2,'sine');},240);},
    abi:  function(){tone(300,0.3,'square');},
    port: function(){tone(200,0.2,'sine');setTimeout(function(){tone(400,0.3,'sine');},200);},
    quest:function(){tone(660,0.1,'sine');setTimeout(function(){tone(880,0.2,'sine');},150);},
    boss: function(){tone(100,0.5,'sawtooth');setTimeout(function(){tone(80,0.5,'sawtooth');},300);},
    wave: function(){tone(440,0.1,'sine');setTimeout(function(){tone(550,0.1,'sine');},100);setTimeout(function(){tone(660,0.2,'sine');},200);},
    over: function(){tone(400,0.4,'sine');setTimeout(function(){tone(350,0.4,'sine');},400);setTimeout(function(){tone(200,0.8,'sine');},1600);},
    gold: function(){tone(700,0.05,'sine');setTimeout(function(){tone(900,0.1,'sine');},60);},
    story:function(){tone(440,0.1,'sine');setTimeout(function(){tone(660,0.15,'sine');},120);setTimeout(function(){tone(880,0.2,'sine');},260);setTimeout(function(){tone(1100,0.3,'sine');},420);}
};

// ================================
// SAFE DOM HELPERS
// ================================
function el(id){ return document.getElementById(id); }
function setText(id,txt){ var e=el(id);if(e)e.textContent=txt; }
function setHTML(id,html){ var e=el(id);if(e)e.innerHTML=html; }
function show(id){ var e=el(id);if(e)e.style.display='block'; }
function hide(id){ var e=el(id);if(e)e.style.display='none'; }

// ================================
// PRELOAD
// ================================
function preload(){ console.log('Loading...'); }

// ================================
// CREATE
// ================================
function create(){
    scene=this; loadGame(); initQuests();
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
        var prev=q.n;
        if(type==='kill'&&q.type==='kill'&&q.monster===data.m) q.n=Math.min(q.n+1,q.target);
        if(type==='collect'&&q.type==='collect') q.n=Math.min(q.n+1,q.target);
        if(type==='level'&&q.type==='level') q.n=pLv;
        if(type==='boss'&&q.type==='boss') q.n=1;
        if(type==='survive'&&q.type==='survive') q.n=Math.floor(survTimer);
        if(type==='score'&&q.type==='score') q.n=score;
        if(q.n!==prev)renderQuests();
        if(!q.done&&q.n>=q.target){q.done=true;finishQuest(q);}
    });
}
function finishQuest(q){
    S.quest(); score+=q.reward; if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(Math.floor(q.reward/5)); gainXP(q.xpR);
    addPassXP(50);
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
// GOLD
// ================================
function earnGold(amount){
    amount=Math.floor(amount); gold+=amount;
    if(goldTxt)goldTxt.setText('💰 '+gold);
    setText('goldHUD','💰 '+gold+' Gold');
    if(typeof pData!=='undefined'){pData.gold=gold;savePData();}
    S.gold();
}

// ================================
// BATTLE PASS XP
// ================================
function addPassXP(amount){
    if(typeof pData==='undefined'||typeof PASS_REWARDS==='undefined')return;
    pData.passXP=(pData.passXP||0)+amount;
    var XP_PER_LEVEL=500;
    while(pData.passXP>=XP_PER_LEVEL&&(pData.passLevel||0)<10){
        pData.passXP-=XP_PER_LEVEL;
        pData.passLevel=(pData.passLevel||0)+1;
        var lv=pData.passLevel;
        // Auto-grant rewards for this level
        var rwd=PASS_REWARDS.find(function(r){return r.lv===lv;});
        if(rwd){
            grantPassRwdToPlayer(rwd.free);
            if(pData.passUnlocked)grantPassRwdToPlayer(rwd.pass);
        }
        if(player)float('🎫 Pass Level '+lv+'!',player.x-100,player.y-110,'#ffdd44');
        addMsg('System','🎫 Battle Pass Level '+lv+'!','#ffdd44');
        S.story();
    }
    savePData();
    if(typeof buildPassTab==='function')buildPassTab();
}
function grantPassRwdToPlayer(r){
    if(!r)return;
    if(r.type==='gold'&&r.amount){earnGold(r.amount);}
    else if(r.type==='title'&&r.value){
        if(!pData.titles)pData.titles=[];
        if(pData.titles.indexOf(r.value)===-1){
            pData.titles.push(r.value);
            if(player)float('🏅 '+r.value,player.x-120,player.y-90,'#ffcc44');
        }
    }
    else if(r.type==='class'&&r.value){
        if(!pData.classes)pData.classes=[];
        if(pData.classes.indexOf(r.value)===-1){
            pData.classes.push(r.value);
            if(player)float('🎮 Class: '+r.value,player.x-140,player.y-90,'#88ffaa');
        }
    }
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
        myRef.set({id:myId,name:pClass.icon+' '+pName,x:400,y:300,dim:0,cls:selectedClass,skin:skinColor,hp:pH,maxHp:pMaxH,alive:true});
        myRef.onDisconnect().remove();

        playersRef.on('child_added',function(snap){
            var d=snap.val();if(!d||d.id===myId)return;
            addOtherPlayer(d);
            addMsg('System',d.name+' joined!','#ffff44');
            countOnline();
        });

        playersRef.on('child_changed',function(snap){
            var d=snap.val();if(!d||d.id===myId)return;
            var op=otherPlayers[d.id];if(!op)return;
            op.tx=d.x; op.ty=d.y;
            op.dim=d.dim||0;
            var vis=(d.dim||0)===dim;
            if(op.sprite) op.sprite.setVisible(vis);
            if(op.tag)    op.tag.setVisible(vis);
            if(op.hpBar)  op.hpBar.setVisible(vis);
            if(op.hpBg)   op.hpBg.setVisible(vis);
            if(op.hpBar&&d.maxHp>0){
                op.hpBar.width=40*(d.hp/d.maxHp);
                op.hpBar.setFillStyle(d.hp/d.maxHp>0.5?0x22cc22:0xff4444);
            }
        });

        playersRef.on('child_removed',function(snap){
            var d=snap.val();if(!d)return;
            var op=otherPlayers[d.id];if(!op)return;
            addMsg('System',op.name+' left','#ff8888');
            if(op.sprite)op.sprite.destroy();
            if(op.tag)op.tag.destroy();
            if(op.hpBar)op.hpBar.destroy();
            if(op.hpBg)op.hpBg.destroy();
            delete otherPlayers[d.id]; countOnline();
        });

        chatRef.limitToLast(1).on('child_added',function(snap){
            var d=snap.val();if(!d||d.sid===myId)return;
            addMsg(d.name,d.msg,'#ffffff');
        });

        // Receive PvP damage
        pvpRef.on('child_added',function(snap){
            var d=snap.val();if(!d||d.tid!==myId)return;
            if(!gameStarted||!player||!player.active)return;
            var now=Date.now();if(now-lastHit<500)return;lastHit=now;
            pH-=d.dmg; S.hit();
            if(scene)scene.cameras.main.shake(200,0.008);
            if(player){
                player.setTint(0xff0000);
                scene.time.delayedCall(200,function(){player.clearTint();});
            }
            updateHP();
            if(player)float('-'+d.dmg+' ⚔️PvP',player.x,player.y-50,'#ff44ff');
            if(pH<=0){pH=0;updateHP();showGameOver();}
            snap.ref.remove();
        });

        tombsRef.once('value',function(snap){ snap.forEach(function(c){var t=c.val();if(t&&t.mode===selectedMode)addTombVis(t.x,t.y,t.name,t.level,'#ffaaaa');}); });
        tombsRef.on('child_added',function(snap){ var t=snap.val();if(!t||t.sid===myId||t.mode!==selectedMode)return;addTombVis(t.x,t.y,t.name,t.level,'#ffaaaa');addMsg('System','💀 '+t.name+' fell!','#ff8888'); });

        addMsg('System','🌐 Room: '+(window._room||'public'),'#44ff44');
        countOnline();
    }catch(e){console.log('Offline:',e);addMsg('System','🌐 Playing offline','#ffaa00');}
}

function addOtherPlayer(d){
    if(otherPlayers[d.id]||!scene||!scene.physics)return;
    var sc=d.skin||0xaa44ff;
    var texKey='ot_'+d.id;
    makeTex(texKey,sc);
    var sprite=scene.physics.add.image(d.x||400,d.y||300,texKey).setDepth(3);
    var tag=scene.add.text(d.x-30,d.y-55,d.name||'Player',{fontSize:'11px',fill:'#cc88ff',stroke:'#000',strokeThickness:1}).setDepth(4);
    var hpBg=scene.add.rectangle(d.x,d.y-48,42,6,0x000000).setDepth(4);
    var hpBar=scene.add.rectangle(d.x-20,d.y-48,40,5,0x22cc22).setOrigin(0,0.5).setDepth(5);
    var vis=(d.dim||0)===dim;
    sprite.setVisible(vis);tag.setVisible(vis);hpBar.setVisible(vis);hpBg.setVisible(vis);
    otherPlayers[d.id]={sprite:sprite,tag:tag,hpBar:hpBar,hpBg:hpBg,name:d.name,tx:d.x||400,ty:d.y||300,dim:d.dim||0};
}

function countOnline(){
    if(!playersRef)return;
    playersRef.once('value',function(snap){setText('playerCount','🟢 '+snap.numChildren()+' Online');});
}

function sendPos(){
    if(!myRef||!player)return;
    var now=Date.now();if(now-lastSent<50)return;lastSent=now;
    myRef.update({x:Math.floor(player.x),y:Math.floor(player.y),dim:dim,hp:Math.floor(pH),maxHp:pMaxH});
}

function pvpHit(tid,dmg){
    if(!pvpRef)return;
    pvpRef.push({tid:tid,dmg:dmg,aid:myId,t:Date.now()});
}

// ================================
// START GAME
// ================================
function startGame(){
    selectedClass = window._cls  || 'warrior';
    selectedMode  = window._mode || 'adventure';
    pName         = window._pName|| 'Hero';
    skinColor     = window._skinColor||0x4488ff;
    storyMode     = (selectedMode==='story');

    pClass   = CLASSES[selectedClass];
    pMaxH    = pClass.hp;
    pH       = Math.max(10,Math.min(pH,pMaxH));
    pSpd     = pClass.speed;
    pDmg     = pClass.damage;
    pRange   = pClass.range;

    if(typeof pData!=='undefined') gold=pData.gold||0;

    // Set monster pool
    if(selectedMode==='adventure'||selectedMode==='story') curPool=POOL_ADV;
    else if(selectedMode==='survival') curPool=POOL_SRV;
    else if(selectedMode==='bossrush') curPool=POOL_BRS;
    else curPool=POOL_PVP;

    // Register touch callbacks
    window._doAttack  = function(){ doAtk(); };
    window._doAbility = function(){ doAbi(); };
    window._doPotion  = function(){ doPot(); };

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

    // Portals only in adventure mode
    if(selectedMode==='adventure'){
        buildPortals();
        scene.physics.add.overlap(player,portals,onPortal,null,scene);
    }

    if(selectedMode==='adventure')     modeAdv();
    else if(selectedMode==='survival') modeSrv();
    else if(selectedMode==='bossrush') modeBRS();
    else if(selectedMode==='pvp')      modePvp();
    else if(selectedMode==='story')    modeStory();

    setupCam();
    setupKeys();
    buildUI();
    buildInv();
    if(selectedMode==='adventure') startDayNight();
    startSurvTimer();
    setupJoystick();
    connectServer();

    scene.physics.add.overlap(player,enemies,onEnemyHit,null,scene);
    scene.physics.add.overlap(player,potions,onPickPotion,null,scene);
    scene.cameras.main.setBackgroundColor(bgCol());

    var ai=el('abilityIcon');if(ai)ai.textContent=pClass.abilityIcon;
    var ai2=el('abilityIcon2');if(ai2)ai2.textContent=pClass.abilityIcon;

    // Accessory overlay
    if(window._accessory&&window._accessory!=='none'){
        var accIcons={crown:'👑',hood:'🪖',wizard:'🧙',halo:'😇',horns:'😈',mask:'🎭',ears:'🐱',cape:'🦸'};
        var ico=accIcons[window._accessory]||'';
        if(ico){
            accessoryOverlay=scene.add.text(0,0,ico,{fontSize:'20px'}).setOrigin(0.5,1).setDepth(12);
        }
    }

    // Story mode panel
    if(storyMode){
        show('storyPanel');
        beginStoryChapter(1);
    }

    gameStarted=true;
}

function bgCol(){
    var m={adventure:'#1a5c1a',survival:'#3d1a00',bossrush:'#0d0011',pvp:'#1a1a22',story:'#0d0d1a'};
    return m[selectedMode]||'#1a5c1a';
}

// ================================
// BUILD MAP
// ================================
function buildMap(){
    if(selectedMode==='adventure') buildForest();
    else if(selectedMode==='story') buildCastle();
    else if(selectedMode==='survival') buildLava();
    else if(selectedMode==='bossrush') buildDungeon();
    else if(selectedMode==='pvp')      buildArena();

    // Shadow tiles only in adventure mode
    if(selectedMode==='adventure'){
        for(var sx=0;sx<mW;sx++) for(var sy=0;sy<mH;sy++)
            shadowTiles.push(scene.add.rectangle(sx*tSz+tSz/2,sy*tSz+tSz/2,tSz-1,tSz-1,(sx+sy)%2===0?0x1a0033:0x110022).setVisible(false));
        [{x:3,y:3},{x:9,y:6},{x:14,y:2},{x:19,y:9}].forEach(function(p){
            var c=scene.add.triangle(p.x*tSz+tSz/2,p.y*tSz+tSz/4,-7,14,7,14,0,-18,0x8800ff).setVisible(false);
            scene.tweens.add({targets:c,alpha:0.4,duration:800,yoyo:true,repeat:-1}); shadowTiles.push(c);
        });
    }
    nightOverlay=scene.add.rectangle(0,0,mW*tSz,mH*tSz,0x000033,0).setOrigin(0,0).setDepth(5);
    dimOverlay  =scene.add.rectangle(0,0,mW*tSz,mH*tSz,0x220044,0).setOrigin(0,0).setDepth(4);

    // Story NPCs (after map is built)
    if(storyMode) spawnStoryNPCs();
}

// ADVENTURE / STORY: Forest map
function buildForest(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){
        var c=(x===14||(y===14&&x>4&&x<24))?0x8B6914:((x+y)%2===0?0x2d8a2d:0x267326);
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,c));
    }
    for(var i=0;i<mH;i++){
        var rx=20+Math.floor(i*0.3); if(rx<mW){
            var rv=scene.add.rectangle(rx*tSz+tSz/2,i*tSz+tSz/2,tSz*2,tSz,0x1155aa);
            scene.tweens.add({targets:rv,fillColor:0x2266cc,duration:1200+Math.random()*400,yoyo:true,repeat:-1});
            normalTiles.push(rv);
        }
    }
    [{x:1,y:1},{x:2,y:1},{x:3,y:2},{x:4,y:1},{x:5,y:2},{x:1,y:3},{x:22,y:1},{x:23,y:2},{x:24,y:1},{x:25,y:2},{x:1,y:13},{x:2,y:14},{x:25,y:12},{x:26,y:14},{x:9,y:20},{x:10,y:21},{x:11,y:19}].forEach(function(p){
        var tx=p.x*tSz+tSz/2,ty=p.y*tSz+tSz/2;
        normalTiles.push(scene.add.rectangle(tx,ty,14,28,0x6B3A2A));
        normalTiles.push(scene.add.circle(tx,ty-14,24,0x1a6e1a));
        normalTiles.push(scene.add.circle(tx-7,ty-20,16,0x228822));
    });
    [{x:8,y:8},{x:18,y:6}].forEach(function(p){
        var fx=p.x*tSz+tSz/2,fy=p.y*tSz+tSz/2;
        scene.add.rectangle(fx,fy+4,22,8,0x6B3A2A);
        var f1=scene.add.triangle(fx,fy-16,-8,8,8,8,0,-12,0xff4400);
        var f2=scene.add.triangle(fx-5,fy-10,-5,6,5,6,0,-8,0xff8800);
        scene.tweens.add({targets:[f1,f2],scaleX:0.85,scaleY:1.15,duration:160,yoyo:true,repeat:-1});
    });
    for(var i=0;i<3;i++) for(var j=0;j<2;j++)
        normalTiles.push(scene.add.rectangle((1+i)*tSz+tSz/2,(24+j)*tSz+tSz/2,tSz-1,tSz-1,0x222222));
    scene.add.text(2*tSz,24*tSz,'🏔️ Cave',{fontSize:'12px',fill:'#777',stroke:'#000',strokeThickness:2});

    // Story: Village area marker (top-left)
    if(storyMode){
        scene.add.rectangle(3*tSz,3*tSz,5*tSz,3*tSz,0x886633,0.15).setOrigin(0,0);
        scene.add.text(3*tSz+10,3*tSz+6,'🏘️ Village',{fontSize:'13px',fill:'#ffcc88',stroke:'#000',strokeThickness:2});
    }
}

// STORY: Castle map — south=gate/courtyard, north=throne room
function buildCastle(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){
        var c;
        if(x<2||x>=mW-2||y<2||y>=mH-2){
            // Moat (outer 2 tiles) — dark blue water
            c=0x1133aa;
        } else if(x<4||x>=mW-4||y<4||y>=mH-4){
            // Castle outer wall
            c=(x+y)%2===0?0x222233:0x1e1e2e;
        } else if(y<8){
            // Throne room — dark red carpet
            c=(x+y)%2===0?0x4a1a1a:0x3a1414;
        } else if(y<14){
            // Inner hall (chapter 2)
            c=(x+y)%2===0?0x303044:0x282838;
        } else {
            // Main courtyard (chapter 1 + 3)
            c=(x+y)%2===0?0x484858:0x3c3c4c;
        }
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,c));
    }
    // Inner castle wall (divides courtyard from inner hall)
    for(var cx=4;cx<24;cx++){
        if(cx===13||cx===14)continue; // center opening
        scene.add.rectangle(cx*tSz+tSz/2,14*tSz-tSz/2,tSz-2,12,0x111122).setDepth(2);
    }
    // Throne room gate (divides hall from throne room)
    for(var cx=4;cx<24;cx++){
        if(cx===13||cx===14)continue;
        scene.add.rectangle(cx*tSz+tSz/2,8*tSz-tSz/2,tSz-2,12,0x2a0a0a).setDepth(2);
    }
    // Pillars in courtyard
    [[6,16],[14,16],[22,16],[6,20],[14,20],[22,20]].forEach(function(p){
        scene.add.rectangle(p[0]*tSz+tSz/2,p[1]*tSz+tSz/2,20,38,0x111122).setDepth(2);
    });
    // Pillars in inner hall
    [[7,9],[14,9],[21,9],[7,12],[14,12],[21,12]].forEach(function(p){
        scene.add.rectangle(p[0]*tSz+tSz/2,p[1]*tSz+tSz/2,18,34,0x110033).setDepth(2);
    });
    // Throne decoration
    scene.add.rectangle(14*tSz+tSz/2,5*tSz,60,50,0x880000).setOrigin(0.5,0.5).setDepth(2);
    scene.add.text(14*tSz+tSz/2,5*tSz,'👑',{fontSize:'30px'}).setOrigin(0.5,0.5).setDepth(3);
    // Torches on walls (flickering)
    [[4,9],[4,12],[4,17],[4,21],[23,9],[23,12],[23,17],[23,21]].forEach(function(p){
        var tx=p[0]*tSz+tSz/2, ty=p[1]*tSz+tSz/2;
        var t=scene.add.triangle(tx,ty,-5,10,5,10,0,-12,0xffaa00).setDepth(3);
        scene.tweens.add({targets:t,alpha:0.4,scaleX:0.7,duration:250+Math.random()*200,yoyo:true,repeat:-1});
        scene.add.circle(tx,ty,18,0xffaa00,0.1).setDepth(2);
    });
    // Gate arch at south wall
    scene.add.text(14*tSz+tSz/2,24*tSz+8,'🏰 Castle Gate',{fontSize:'11px',fill:'#aaaacc',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5,0).setDepth(3);
    // Chapter area labels
    scene.add.text(14*tSz,18*tSz,'⚔️ Courtyard',{fontSize:'11px',fill:'#8888aa',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(1);
    scene.add.text(14*tSz,11*tSz,'🏰 Inner Hall',{fontSize:'11px',fill:'#8888bb',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(1);
    scene.add.text(14*tSz,6*tSz,'☠️ Throne Room',{fontSize:'11px',fill:'#aa6666',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(1);
}

// SURVIVAL: Lava fortress
function buildLava(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++)
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x8B3000:0x6B2200));
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){
        if(x<2||x>mW-3||y<2||y>mH-3){
            var lv=scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0xff3300);
            scene.tweens.add({targets:lv,fillColor:0xff6600,duration:600+Math.random()*400,yoyo:true,repeat:-1});
            normalTiles.push(lv);
        }
    }
    [{x:5,y:5,w:4,h:4},{x:14,y:3,w:5,h:3},{x:20,y:6,w:4,h:4},{x:5,y:18,w:5,h:4},{x:18,y:17,w:4,h:5}].forEach(function(pl){
        for(var px=pl.x;px<pl.x+pl.w;px++) for(var py=pl.y;py<pl.y+pl.h;py++)
            normalTiles.push(scene.add.rectangle(px*tSz+tSz/2,py*tSz+tSz/2,tSz-1,tSz-1,0xcc6600));
    });
    for(var i=0;i<4;i++){
        var lp=scene.add.ellipse(Phaser.Math.Between(8,20)*tSz,Phaser.Math.Between(8,20)*tSz,80+Math.random()*50,50+Math.random()*30,0xff3300);
        scene.tweens.add({targets:lp,fillColor:0xff6600,scaleX:1.05,duration:800,yoyo:true,repeat:-1});
    }
    for(var i=0;i<5;i++){
        var gv=scene.add.rectangle(Phaser.Math.Between(4,23)*tSz,Phaser.Math.Between(4,23)*tSz,8,36,0xff6600);
        scene.tweens.add({targets:gv,scaleY:1.8,alpha:0.3,duration:700+Math.random()*400,yoyo:true,repeat:-1});
    }
}

// BOSS RUSH: Dungeon rooms
function buildDungeon(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++)
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0x111122));
    [{x:1,y:1,w:8,h:7},{x:12,y:1,w:8,h:7},{x:1,y:13,w:8,h:7},{x:12,y:13,w:8,h:7},{x:6,y:6,w:10,h:8}].forEach(function(r,ri){
        var cols=[0x222233,0x1a1a2e,0x22223a,0x1e1e30,0x2a2a40];
        for(var rx=r.x;rx<r.x+r.w;rx++) for(var ry=r.y;ry<r.y+r.h;ry++)
            normalTiles.push(scene.add.rectangle(rx*tSz+tSz/2,ry*tSz+tSz/2,tSz-1,tSz-1,cols[ri%5]));
        scene.add.text((r.x+1)*tSz,(r.y+1)*tSz,ri===4?'⚔️ Boss Chamber':'Room '+(ri+1),{fontSize:'11px',fill:'#445',stroke:'#000',strokeThickness:1});
    });
    for(var i=8;i<13;i++) normalTiles.push(scene.add.rectangle(i*tSz+tSz/2,4*tSz+tSz/2,tSz-1,tSz,0x1c1c2e));
    for(var i=8;i<13;i++) normalTiles.push(scene.add.rectangle(i*tSz+tSz/2,14*tSz+tSz/2,tSz-1,tSz,0x1c1c2e));
    for(var i=8;i<14;i++) normalTiles.push(scene.add.rectangle(4*tSz+tSz/2,i*tSz+tSz/2,tSz,tSz-1,0x1c1c2e));
    for(var i=8;i<14;i++) normalTiles.push(scene.add.rectangle(20*tSz+tSz/2,i*tSz+tSz/2,tSz,tSz-1,0x1c1c2e));
    for(var i=0;i<10;i++){
        var tf=scene.add.circle(Phaser.Math.Between(2,25)*tSz,Phaser.Math.Between(2,25)*tSz,10,0xaa00ff,0.8);
        scene.tweens.add({targets:tf,radius:14,alpha:0.4,duration:280+Math.random()*200,yoyo:true,repeat:-1});
    }
}

// PVP: Colosseum arena
function buildArena(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++)
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x<3||x>mW-4||y<3||y>mH-4)?0x222222:0x333333));
    var cx=mW/2*tSz,cy=mH/2*tSz,r=8*tSz;
    for(var x=4;x<mW-4;x++) for(var y=4;y<mH-4;y++){
        var dx=(x*tSz+tSz/2)-cx,dy=(y*tSz+tSz/2)-cy;
        if(Math.sqrt(dx*dx+dy*dy)<r)
            normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x998855:0x887744));
    }
    [{x:3,y:3},{x:24,y:3},{x:3,y:24},{x:24,y:24}].forEach(function(p){
        scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,40,72,0x888888);
        scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,48,18,0x999999);
        var flame=scene.add.circle(p.x*tSz+tSz/2,p.y*tSz+tSz/2-46,9,0xffaa00);
        scene.tweens.add({targets:flame,radius:13,alpha:0.5,duration:280,yoyo:true,repeat:-1});
    });
    // PvP health bars above arena
    scene.add.text(cx,cy-r-20,'⚔️ PvP ARENA ⚔️',{fontSize:'16px',fill:'#ffaa00',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
    // Walls/pillars around edge for cover
    for(var i=0;i<6;i++){
        var angle=i/6*Math.PI*2;
        var wx=cx+Math.cos(angle)*(r*0.7),wy=cy+Math.sin(angle)*(r*0.7);
        var wall=scene.add.rectangle(wx,wy,28,70,0x888888).setRotation(angle);
        normalTiles.push(wall);
    }
}

// ================================
// TEXTURES
// ================================
function makeTex(name,color,accessory){
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color); g.fillRoundedRect(4,12,32,28,4);
    g.fillStyle(0xffddaa); g.fillCircle(20,9,12);
    g.fillStyle(0x000000); g.fillCircle(15,8,3); g.fillCircle(25,8,3);
    g.fillStyle(0xffffff,0.25); g.fillRect(8,16,24,5);
    // Accessory drawn on texture
    if(accessory==='crown'){g.fillStyle(0xffdd00);g.fillRect(10,0,20,6);g.fillRect(8,3,4,8);g.fillRect(18,1,4,10);g.fillRect(28,3,4,8);}
    if(accessory==='halo'){g.lineStyle(3,0xffff88,1);g.strokeCircle(20,-4,14);}
    if(accessory==='horns'){g.fillStyle(0xff2200);g.fillTriangle(10,-2,14,8,8,8);g.fillTriangle(30,-2,26,8,32,8);}
    if(accessory==='mask'){g.fillStyle(0x111111,0.8);g.fillRect(8,5,24,10);}
    g.generateTexture(name,44,44); g.destroy();
}

function makeNPCTextures(){
    // Elder (purple robe)
    if(!scene.textures.exists('npcElderTex')){
        var g=scene.make.graphics({x:0,y:0,add:false});
        g.fillStyle(0x8833aa); g.fillRoundedRect(4,16,36,30,5);
        g.fillStyle(0xffddaa); g.fillCircle(22,10,12);
        g.fillStyle(0xcccccc); g.fillRect(4,12,36,8); // hair/beard
        g.fillStyle(0x333333); g.fillCircle(17,8,3); g.fillCircle(27,8,3);
        g.fillStyle(0x6622aa); g.fillTriangle(8,22,10,32,6,32); g.fillTriangle(36,22,34,32,38,32); // robe sides
        g.generateTexture('npcElderTex',44,48); g.destroy();
    }
    // Scout (green outfit)
    if(!scene.textures.exists('npcScoutTex')){
        var g=scene.make.graphics({x:0,y:0,add:false});
        g.fillStyle(0x226622); g.fillRoundedRect(4,16,36,30,5);
        g.fillStyle(0xffcc88); g.fillCircle(22,10,12);
        g.fillStyle(0x886600); g.fillRect(12,4,20,8); // cap
        g.fillStyle(0x333333); g.fillCircle(17,8,3); g.fillCircle(27,8,3);
        g.generateTexture('npcScoutTex',44,48); g.destroy();
    }
    // Blacksmith (red/orange)
    if(!scene.textures.exists('npcSmithTex')){
        var g=scene.make.graphics({x:0,y:0,add:false});
        g.fillStyle(0xaa4400); g.fillRoundedRect(4,16,36,30,5);
        g.fillStyle(0xffcc88); g.fillCircle(22,10,12);
        g.fillStyle(0x442211); g.fillCircle(17,8,3); g.fillCircle(27,8,3);
        g.fillStyle(0x666666); g.fillRect(8,20,28,4); // apron
        g.generateTexture('npcSmithTex',44,48); g.destroy();
    }
}

function makeMonsterTex(name,color,size){
    if(scene.textures.exists(name))return;
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color); g.fillRoundedRect(4,10,size-8,size-10,4);
    g.fillStyle(0xffffff); g.fillCircle(12,14,5); g.fillCircle(size-14,14,5);
    g.fillStyle(0x000000); g.fillCircle(13,14,3); g.fillCircle(size-13,14,3);
    g.generateTexture(name,size,size); g.destroy();
}

function makeAllMonsterTex(){
    var all=[POOL_ADV,POOL_SRV,POOL_BRS,POOL_SHADOW];
    all.forEach(function(pool){ Object.keys(pool).forEach(function(k){ makeMonsterTex(k+'Tex',pool[k].color,pool[k].size); }); });
}

function makeOtherTex(){ if(!scene.textures.exists('otherTex')) makeTex('otherTex',0xaa44ff); }

function makeBossTex(name,bd){
    if(scene.textures.exists(name))return;
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(bd.bc); g.fillRoundedRect(5,5,90,90,12);
    g.fillStyle(bd.ec); g.fillCircle(28,28,14); g.fillCircle(72,28,14);
    g.fillStyle(0x000000); g.fillCircle(28,28,8); g.fillCircle(72,28,8);
    g.fillStyle(bd.mc); g.fillRect(22,65,56,12);
    g.generateTexture(name,100,100); g.destroy();
}

function makePotionTex(){
    if(scene.textures.exists('potTex'))return;
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(0xff69b4); g.fillRoundedRect(2,6,26,24,8);
    g.fillStyle(0xffbbdd); g.fillCircle(10,13,6);
    g.generateTexture('potTex',30,32); g.destroy();
}

function makeTombTex(){
    if(scene.textures.exists('tombTex'))return;
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(0x666666); g.fillRoundedRect(5,0,34,40,8);
    g.fillStyle(0x999999); g.fillRect(18,10,4,18); g.fillRect(11,16,18,4);
    g.generateTexture('tombTex',44,44); g.destroy();
}

function makeExtraTex(){
    if(!scene.textures.exists('minionTex')){ var g=scene.make.graphics({x:0,y:0,add:false}); g.fillStyle(0xdddddd); g.fillRoundedRect(5,10,22,24,4); g.fillStyle(0xeeeeee); g.fillCircle(16,8,9); g.generateTexture('minionTex',32,36); g.destroy(); }
    if(!scene.textures.exists('wolfTex')){ var g=scene.make.graphics({x:0,y:0,add:false}); g.fillStyle(0x886644); g.fillEllipse(16,16,30,22); g.fillStyle(0x775533); g.fillCircle(26,10,10); g.generateTexture('wolfTex',36,32); g.destroy(); }
    if(!scene.textures.exists('bulletTex')){ var g=scene.make.graphics({x:0,y:0,add:false}); g.fillStyle(0xffcc00); g.fillCircle(8,8,6); g.generateTexture('bulletTex',16,16); g.destroy(); }
}

function createPlayer(){
    // Story mode: spawn near the castle gate (south area)
    var spawnX = mW/2*tSz;
    var spawnY = storyMode ? 22*tSz : mH/2*tSz;
    player=scene.physics.add.image(spawnX,spawnY,'playerTex');
    scene.physics.world.setBounds(0,0,mW*tSz,mH*tSz);
    player.setCollideWorldBounds(true);
    atkIndicator=scene.add.circle(player.x,player.y,pRange,0xffffff,0).setStrokeStyle(1,0xffffff,0.12).setDepth(8);
}

// ================================
// PORTALS
// ================================
var shadowPortGfx, returnPortGfx, returnPortBody, returnPortLabel;

function buildPortals(){
    portals=scene.physics.add.staticGroup();
    var p1=portals.create(22*tSz,22*tSz,null); p1.setCircle(30); p1.ptype='toShadow';
    returnPortBody=portals.create(4*tSz,4*tSz,null); returnPortBody.setCircle(30); returnPortBody.ptype='toNormal'; returnPortBody.active=false;

    shadowPortGfx=scene.add.graphics();
    returnPortGfx=scene.add.graphics();

    scene.time.addEvent({delay:50,loop:true,callback:function(){
        shadowPortGfx.clear();
        if(!inShadow){
            var a=0.4+Math.sin(Date.now()/300)*0.3;
            shadowPortGfx.lineStyle(5,0xaa00ff,a); shadowPortGfx.strokeCircle(22*tSz,22*tSz,34);
            shadowPortGfx.fillStyle(0xaa00ff,a*0.12); shadowPortGfx.fillCircle(22*tSz,22*tSz,32);
        }
        returnPortGfx.clear();
        if(inShadow){
            var a=0.4+Math.sin(Date.now()/300)*0.3;
            returnPortGfx.lineStyle(5,0xffaa00,a); returnPortGfx.strokeCircle(4*tSz,4*tSz,34);
            returnPortGfx.fillStyle(0xffaa00,a*0.12); returnPortGfx.fillCircle(4*tSz,4*tSz,32);
        }
    }});

    scene.add.text(22*tSz,22*tSz-48,'🌀 Shadow Portal',{fontSize:'12px',fill:'#cc88ff',stroke:'#000',strokeThickness:2}).setOrigin(0.5);
    returnPortLabel=scene.add.text(4*tSz,4*tSz-48,'🌀 Return Portal',{fontSize:'12px',fill:'#ffcc88',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setVisible(false);
}

function onPortal(player,portal){
    if(portalCD)return; portalCD=true; setTimeout(function(){portalCD=false;},2000);
    if(portal.ptype==='toShadow'&&!inShadow) enterShadow();
    else if(portal.ptype==='toNormal'&&inShadow) exitShadow();
}

function enterShadow(){
    inShadow=true;dim=1; S.port(); scene.cameras.main.flash(500,100,0,150);
    normalTiles.forEach(function(t){t.setVisible(false);});
    shadowTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimOverlay,alpha:0.4,duration:1000});
    clearEnemies(); for(var i=0;i<10;i++)spawnEnemy(null,POOL_SHADOW);
    setText('dimensionHUD','🌑 Shadow Realm');
    var dh=el('dimensionHUD');if(dh)dh.style.color='#cc88ff';
    float('🌑 Shadow Realm!',player.x-100,player.y-80,'#cc88ff');
    if(returnPortBody)returnPortBody.active=true;
    if(returnPortLabel)returnPortLabel.setVisible(true);
    updateOtherVis(); checkQ('dimension',{});
    if(myRef)myRef.update({dim:1});
    // Story: chapter 2 objective
    if(storyMode) updateStoryObj('event','shadow_entered');
}

function exitShadow(){
    inShadow=false;dim=0; S.port(); scene.cameras.main.flash(500,50,150,50);
    shadowTiles.forEach(function(t){t.setVisible(false);});
    normalTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimOverlay,alpha:0,duration:1000});
    clearEnemies(); spawnInitial();
    setText('dimensionHUD','🌍 Normal World');
    var dh=el('dimensionHUD');if(dh)dh.style.color='#aaffaa';
    float('🌍 Normal World!',player.x-100,player.y-80,'#aaffaa');
    if(returnPortBody)returnPortBody.active=false;
    if(returnPortLabel)returnPortLabel.setVisible(false);
    updateOtherVis();
    if(myRef)myRef.update({dim:0});
}

function updateOtherVis(){
    Object.values(otherPlayers).forEach(function(op){
        var vis=(op.dim===dim);
        if(op.sprite)op.sprite.setVisible(vis);
        if(op.tag)op.tag.setVisible(vis);
        if(op.hpBar)op.hpBar.setVisible(vis);
        if(op.hpBg)op.hpBg.setVisible(vis);
    });
}

function clearEnemies(){ enemies.getChildren().forEach(function(e){if(e.hpBar)e.hpBar.destroy();if(e.tag)e.tag.destroy();e.destroy();}); }

// ================================
// GAME MODES
// ================================
function modeAdv(){
    spawnInitial();
    scene.time.addEvent({delay:90000,callback:function(){if(player)float('⚠️ Dragon King in 30s!',player.x-140,player.y-80,'#ff8800');}});
    scene.time.addEvent({delay:120000,callback:function(){spawnBoss('adv');}});
}
function modeSrv(){
    setTimeout(function(){nextWave();},2000);
}
function nextWave(){
    if(!gameStarted)return;
    wave++;waveKilled=0;waveTotal=5+wave*3;
    S.wave();
    setText('waveHUD','🌊 Wave '+wave+' — '+waveTotal+' enemies!');
    float('🌊 WAVE '+wave+'!',player.x-60,player.y-100,'#ff4444');
    var ks=Object.keys(POOL_SRV);
    for(var i=0;i<waveTotal;i++)(function(d){setTimeout(function(){if(gameStarted)spawnEnemy(ks[Math.floor(Math.random()*ks.length)],POOL_SRV);},d);})(i*350);
    if(wave%5===0)setTimeout(function(){if(gameStarted)spawnBoss('srv');},waveTotal*350+1500);
}
function onWaveKill(){
    if(selectedMode!=='survival')return;
    waveKilled++;
    if(waveKilled>=waveTotal){
        float('✅ Wave '+wave+' clear!',player.x-100,player.y-80,'#44ff44');
        pH=Math.min(pH+30,pMaxH);updateHP();
        setText('waveHUD','⏳ Next wave in 3s...');
        setTimeout(function(){if(gameStarted)nextWave();},3000);return;
    }
    setText('waveHUD','🌊 Wave '+wave+' — '+(waveTotal-waveKilled)+' left!');
}
function modeBRS(){
    rushIdx=0; float('💀 Boss Rush!',player.x-80,player.y-80,'#cc44ff');
    setTimeout(function(){nextRush();},2000);
}
function nextRush(){
    if(!player||!player.active||!gameStarted)return;
    rushIdx++;
    var bd=BOSS_RUSH[(rushIdx-1)%BOSS_RUSH.length];
    var tKey='rush'+rushIdx;
    makeBossTex(tKey,bd);
    S.boss();
    var x=mW/2*tSz,y=mH/2*tSz;
    boss=scene.physics.add.image(x,y,tKey);
    boss.setCollideWorldBounds(true);
    boss.hp=(bd.hp+pLv*80)*Math.ceil(rushIdx/BOSS_RUSH.length);
    boss.maxHp=boss.hp; boss.speed=bd.speed+pLv*5; boss.xp=bd.xp*rushIdx; boss.gold=bd.gold;
    bossSpawned=true;
    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:600,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.bar).setScrollFactor(0).setDepth(15);
    bossTxt=scene.add.text(640,50,bd.name+' #'+rushIdx,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);
    float('⚠️ '+bd.name,player.x-120,player.y-100,'#cc44ff');
    scene.physics.add.overlap(player,boss,onBossHit,null,scene);
}
function modePvp(){
    addMsg('System','⚔️ PvP! Attack other players!','#ff88ff');
    float('⚔️ PvP Arena! Attack enemies!',player.x-120,player.y-80,'#ff88ff');
    scene.add.text(mW/2*tSz,mH/2*tSz+30,'Walk into range of other players\nand press SPACE to attack! ⚔️',
        {fontSize:'16px',fill:'#ff88ff',stroke:'#000',strokeThickness:3,align:'center'}).setOrigin(0.5).setDepth(6);
}
function modeStory(){
    curPool=POOL_CASTLE;
    for(var i=0;i<8;i++) spawnEnemy(null,POOL_CASTLE);
    addMsg('System','📖 Castle Story! Talk to NPCs (walk near them and press E)','#ffcc44');
    float('📖 Castle Story begins!',player.x-120,player.y-90,'#88aaff');
}

// ================================
// STORY MODE FUNCTIONS
// ================================
function spawnStoryNPCs(){
    // Escaped Prisoner — near the castle gate (south courtyard, chapter 1)
    var prisonX=10*tSz, prisonY=22*tSz;
    var prisonSprite=scene.physics.add.image(prisonX,prisonY,'npcElderTex').setDepth(5).setImmovable(true);
    scene.tweens.add({targets:prisonSprite,y:prisonY-5,duration:1000,yoyo:true,repeat:-1});
    var prisonTag=scene.add.text(prisonX,prisonY-60,'🧑 Prisoner\n[E] Talk',{fontSize:'11px',fill:'#88aaff',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(6);
    storyNPCList.push({sprite:prisonSprite,tag:prisonTag,id:'prisoner',x:prisonX,y:prisonY,chapter:1});

    // Rebel Spy — near inner castle gate (central hall, chapter 2)
    var spyX=17*tSz, spyY=15*tSz;
    var spySprite=scene.physics.add.image(spyX,spyY,'npcScoutTex').setDepth(5).setImmovable(true);
    scene.tweens.add({targets:spySprite,y:spyY-5,duration:900,yoyo:true,repeat:-1});
    var spyTag=scene.add.text(spyX,spyY-60,'🕵️ Rebel Spy\n[E] Talk',{fontSize:'11px',fill:'#cc88ff',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(6);
    storyNPCList.push({sprite:spySprite,tag:spyTag,id:'spy',x:spyX,y:spyY,chapter:2});

    // Court Mage — near throne room entrance (chapter 3)
    var mageX=11*tSz, mageY=9*tSz;
    var mageSprite=scene.physics.add.image(mageX,mageY,'npcSmithTex').setDepth(5).setImmovable(true);
    scene.tweens.add({targets:mageSprite,y:mageY-5,duration:1100,yoyo:true,repeat:-1});
    var mageTag=scene.add.text(mageX,mageY-60,'🧙 Court Mage\n[E] Talk',{fontSize:'11px',fill:'#ffaa44',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(6);
    storyNPCList.push({sprite:mageSprite,tag:mageTag,id:'wizard',x:mageX,y:mageY,chapter:3});
}

function showStoryCutscene(text, color){
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;z-index:500;opacity:0;transition:opacity 0.8s;pointer-events:none;';
    ov.innerHTML='<div style="max-width:500px;padding:36px;text-align:center;"><div style="font-size:52px;margin-bottom:16px;">🏰</div><p style="font-size:18px;color:'+(color||'#ccccff')+';line-height:1.7;font-style:italic;text-shadow:0 0 20px rgba(150,150,255,0.5);">'+text+'</p></div>';
    document.body.appendChild(ov);
    setTimeout(function(){ov.style.opacity='1';},50);
    setTimeout(function(){ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)document.body.removeChild(ov);},800);},3500);
}

function beginStoryChapter(num){
    storyChapter=num;
    storyChapterComplete=false;
    storyBossPhase=0;
    bossSpawned=false;
    if(boss){try{boss.destroy();}catch(e){}boss=null;}
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();

    var chData=STORY_DATA[num-1];
    if(!chData)return;
    storyObjProgress=chData.objectives.map(function(o){return{id:o.id,desc:o.desc,type:o.type,monster:o.monster,key:o.key,target:o.target,n:0,done:false};});

    // Clear existing enemies for new chapter
    enemies.getChildren().slice().forEach(function(e){
        if(e.hpBar)e.hpBar.destroy();if(e.tag)e.tag.destroy();e.destroy();
    });

    // Set pool + spawn enemies for this chapter
    if(num===1){
        curPool=POOL_CASTLE;
        for(var i=0;i<8;i++) spawnEnemy(null,POOL_CASTLE);
    } else if(num===2){
        curPool=POOL_CASTLE_CH2;
        if(chData.cutscene) showStoryCutscene('You force open the castle doors and step into the dark hall...\n\nCommander Vex commands his Dark Knights — destroy the intruder!','#cc88ff');
        for(var i=0;i<8;i++) spawnEnemy(null,POOL_CASTLE_CH2);
    } else if(num===3){
        curPool=POOL_CASTLE_CH3;
        showStoryCutscene('You enter the throne room... shadow magic fills the air.\n\nThe Shadow Master blocks your path to The Dark King!','#ffaa44');
        for(var i=0;i<6;i++) spawnEnemy(null,POOL_CASTLE_CH3);
    }

    setText('storyChapterTitle',chData.title);
    renderStoryPanel();
    float(chData.title,player.x-160,player.y-110,chData.color);
    S.story();
    var mh=el('modeHUD');if(mh){mh.textContent=chData.title;mh.style.color=chData.color;}
}

function renderStoryPanel(){
    var list=el('storyObjList');if(!list)return;
    list.innerHTML='';
    storyObjProgress.forEach(function(o){
        var d=document.createElement('div');
        d.style.cssText='margin-bottom:4px;font-size:11px;'+(o.done?'color:#44ff44;opacity:0.7':'color:#ffffff');
        d.textContent=(o.done?'✅ ':'🔲 ')+o.desc+(o.type!=='auto'&&o.type!=='event'?'  ('+o.n+'/'+o.target+')':'');
        list.appendChild(d);
    });
}

function updateStoryObj(type,data){
    if(!storyMode||!storyObjProgress.length||storyChapterComplete)return;
    var changed=false;
    storyObjProgress.forEach(function(o){
        if(o.done)return;
        if(type==='kill'&&o.type==='kill'&&o.monster===data){o.n=Math.min(o.n+1,o.target);if(o.n>=o.target)o.done=true;changed=true;}
        if(type==='shadow_kill'&&o.type==='shadow_kill'){o.n=Math.min(o.n+1,o.target);if(o.n>=o.target)o.done=true;changed=true;}
        if(type==='event'&&o.type==='event'&&o.key===data){o.n=1;o.done=true;changed=true;}
        if(type==='boss'&&o.type==='boss'){o.n=1;o.done=true;changed=true;}
        if(type==='story_boss_kill'&&o.type==='story_boss'){o.n=1;o.done=true;changed=true;}
    });
    if(changed)renderStoryPanel();

    // Chapter 2: after all dark knights killed → spawn Commander Vex
    if(storyChapter===2 && !bossSpawned){
        var knightsDone=storyObjProgress.some(function(o){return o.id==='kill_darkknight'&&o.done;});
        if(knightsDone){
            setTimeout(function(){if(gameStarted)spawnStoryBoss('vex');},1500);
            float('⚔️ Commander Vex approaches!',player.x-130,player.y-100,'#4466ff');
        }
    }
    // Chapter 3: after all shadow sentries killed → spawn Shadow Master
    if(storyChapter===3 && storyBossPhase===0 && !bossSpawned){
        var sentriesDone=storyObjProgress.some(function(o){return o.id==='kill_shadowsentry'&&o.done;});
        if(sentriesDone){
            storyBossPhase=1;
            setTimeout(function(){if(gameStarted)spawnStoryBoss('shadowmaster');},1500);
            float('🌑 Shadow Master approaches!',player.x-130,player.y-100,'#aa44ff');
        }
    }

    var allDone=storyObjProgress.every(function(o){return o.done;});
    if(allDone&&!storyChapterComplete)completeStoryChapter();
}

function completeStoryChapter(){
    storyChapterComplete=true;
    var chData=STORY_DATA[storyChapter-1];
    S.story(); S.story();
    earnGold(chData.reward);
    addPassXP(200);
    scene.cameras.main.flash(1000,255,255,100);
    float('🎉 '+chData.rewardMsg,player.x-180,player.y-110,'#ffff00');
    addMsg('Story','🎉 '+chData.rewardMsg,'#ffaa44');

    // Chapter 3: grant Dark King Slayer title
    if(storyChapter===3 && typeof pData!=='undefined'){
        if(!pData.titles)pData.titles=[];
        if(pData.titles.indexOf('Dark King Slayer')===-1) pData.titles.push('Dark King Slayer');
        savePData();
    }

    setTimeout(function(){
        if(!gameStarted)return;
        if(storyChapter<3){
            var nextData=STORY_DATA[storyChapter];
            if(nextData){
                float('Talk to NPCs for next chapter!',player.x-180,player.y-80,'#ffcc44');
                beginStoryChapter(storyChapter+1);
            }
        } else {
            showStoryComplete();
        }
    },3500);
}

function showStoryComplete(){
    storyDone=true;
    S.story();S.story();S.story();
    scene.cameras.main.flash(2000,255,220,50);
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0a00 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 2s;font-family:Arial,sans-serif;color:#fff;text-align:center;';
    ov.innerHTML='<div style="max-width:580px;padding:36px;"><div style="font-size:80px;margin-bottom:12px;">🏆</div><h1 style="font-size:48px;color:#ffdd44;text-shadow:0 0 40px #ffaa00;margin-bottom:8px;">STORY COMPLETE!</h1><p style="font-size:16px;color:#ffcc88;margin-bottom:6px;">You have freed the Pixel Realm from The Dark King!</p><p style="font-size:18px;color:#ffaa44;margin-bottom:4px;">'+pClass.icon+' <b>'+pName+'</b> — Level '+pLv+'</p><p style="font-size:15px;color:#ff8844;margin-bottom:4px;">👑 Title Earned: <b>Dark King Slayer</b></p><p style="font-size:22px;color:#ffdd44;margin-bottom:6px;">Score: '+score+'</p><p style="font-size:14px;color:#ffaa00;margin-bottom:24px;">💰 Total Gold: '+gold+'</p><button onclick="location.reload()" style="padding:12px 36px;font-size:16px;background:linear-gradient(135deg,#cc8800,#ffaa00);color:#000;border:none;border-radius:10px;cursor:pointer;font-weight:bold;">🏠 Return to Menu</button></div>';
    document.body.appendChild(ov);
    setTimeout(function(){ov.style.opacity='1';},100);
}

function startNPCDialog(npc){
    if(storyDialogActive)return;
    var chData=STORY_DATA[storyChapter-1];
    if(!chData)return;
    if(chData.npcId!==npc.id){
        // Wrong NPC for this chapter — give generic line
        var genericLines={
            prisoner:[{speaker:'🧑 Escaped Prisoner',text:'"Stay strong! The guards are everywhere — keep fighting! ✊"'}],
            spy:[{speaker:'🕵️ Rebel Spy',text:'"I\'m watching the hallway. Dark knights patrol in pairs — stay alert! 🕵️"'}],
            wizard:[{speaker:'🧙 Court Mage',text:'"The Dark King\'s power grows every second. Hurry — the realm is counting on you! 🔮"'}]
        };
        var lines=genericLines[npc.id]||[{speaker:npc.id,text:'"Hello, traveller!"'}];
        showStoryDialog(lines); return;
    }
    showStoryDialog(chData.dialog);
}

function showStoryDialog(lines){
    if(!lines||!lines.length)return;
    storyDialogActive=true;
    chatOpen=true;
    window._storyDialogLines=lines;
    window._storyDialogIdx=0;
    var entry=lines[0];
    setText('storyDialogSpeaker',entry.speaker||'');
    setText('storyDialogText',entry.text||'');
    var sd=el('storyDialog');
    if(sd){sd.style.display='flex';sd.style.opacity='0';setTimeout(function(){sd.style.opacity='1';},20);}
}

window.advanceStoryDialog=function(){
    window._storyDialogIdx=(window._storyDialogIdx||0)+1;
    var lines=window._storyDialogLines||[];
    if(window._storyDialogIdx>=lines.length){
        var sd=el('storyDialog');if(sd){sd.style.opacity='0';setTimeout(function(){sd.style.display='none';},300);}
        storyDialogActive=false;
        chatOpen=false;
        window._storyDialogLines=[];
    } else {
        var entry=lines[window._storyDialogIdx];
        setText('storyDialogSpeaker',entry.speaker||'');
        setText('storyDialogText',entry.text||'');
    }
};

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
    var x=Phaser.Math.Between(3,mW-3)*tSz,y=Phaser.Math.Between(3,mH-3)*tSz;
    var e=enemies.create(x,y,type+'Tex');
    e.setCollideWorldBounds(true);
    e.mtype=type;e.pool=pool;
    e.hp=m.hp*(1+pLv*0.2);e.maxHp=e.hp;
    e.speed=m.speed+pLv*4;e.dmg=m.dmg;e.xp=m.xp+pLv*5;e.score=m.score;e.gold=m.gold||5;
    e.px=x;e.py=y;
    e.hpBar=scene.add.rectangle(x,y-35,m.size,6,0xff3333).setDepth(6);
    e.tag=scene.add.text(x,y-50,m.name+' Lv.'+pLv,{fontSize:'11px',fill:'#fff',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(6);
    return e;
}

// ================================
// CAMERA + KEYS
// ================================
function setupCam(){
    scene.cameras.main.setBounds(0,0,mW*tSz,mH*tSz);
    scene.cameras.main.startFollow(player,true,0.08,0.08);
    scene.cameras.main.setZoom(0.5);
    scene.tweens.add({targets:scene.cameras.main,zoom:1,duration:1200,ease:'Power2'});
}
function setupKeys(){
    cursors=scene.input.keyboard.createCursorKeys();
    wasd=scene.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D});
    shiftKey=scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    scene.input.keyboard.on('keydown-SPACE',function(){if(!chatOpen)doAtk();});
    scene.input.keyboard.on('keydown-E',function(){
        if(chatOpen)return;
        // Story: talk to NPC if nearby
        if(storyMode&&storyNearNPC){startNPCDialog(storyNearNPC);return;}
        doAbi();
    });
    scene.input.keyboard.on('keydown-F',    function(){if(!chatOpen)doPot();});
    scene.input.keyboard.on('keydown-I',    function(){if(!chatOpen)toggleInv();});
    scene.input.keyboard.on('keydown-T',    function(){openChat();});
    scene.input.keyboard.on('keydown-ENTER',function(){if(!chatOpen)doSave();});
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
// ATTACK (PvP fixed!)
// ================================
function doAtk(){
    var now=Date.now();if(now-lastAtk<pClass.atk)return;lastAtk=now;
    S.atk();
    var sw=scene.add.graphics();
    sw.lineStyle(3,0xffddaa,1);
    sw.arc(player.x,player.y,pRange*0.7,playerFacing===1?-0.5:Math.PI+0.5,playerFacing===1?0.8:Math.PI-0.8);
    sw.strokePath();
    scene.tweens.add({targets:sw,alpha:0,duration:250,onComplete:function(){sw.destroy();}});
    var hit=false;
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active)return;
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<=pRange){
            var dmg=pDmg;
            if(selectedClass==='berserker'){var r=pH/pMaxH;if(r<0.5)dmg=Math.floor(dmg*1.8);if(r<0.25)dmg=Math.floor(dmg*2.5);}
            if(selectedClass==='assassin'){var chains=[]; enemies.getChildren().forEach(function(e2){if(e2!==e&&Phaser.Math.Distance.Between(e.x,e.y,e2.x,e2.y)<120)chains.push(e2);});chains.slice(0,3).forEach(function(ec){ec.hp-=dmg*0.5;if(ec.hp<=0)killEnemy(ec);});}
            if(selectedClass==='vampire'){var lifesteal=Math.floor(dmg*0.3);pH=Math.min(pH+lifesteal,pMaxH);updateHP();}
            var crit=(selectedClass==='rogue'||selectedClass==='assassin')&&Math.random()<0.3;
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

    // ====== PVP FIX: real damage + proper hit detection ======
    if(selectedMode==='pvp'){
        Object.entries(otherPlayers).forEach(function(kv){
            var opId=kv[0],op=kv[1];
            if(!op||!op.sprite||!op.sprite.active)return;
            if(Phaser.Math.Distance.Between(player.x,player.y,op.sprite.x,op.sprite.y)<=pRange){
                var crit=Math.random()<0.25;
                var dmg=Math.floor(pDmg*(crit?2:1));
                pvpHit(opId,dmg);
                // Slash visual on target
                var slash=scene.add.graphics();
                slash.lineStyle(4,0xff44ff,1);
                slash.lineBetween(op.sprite.x-22,op.sprite.y-22,op.sprite.x+22,op.sprite.y+22);
                slash.lineBetween(op.sprite.x+22,op.sprite.y-22,op.sprite.x-22,op.sprite.y+22);
                scene.tweens.add({targets:slash,alpha:0,scaleX:1.5,scaleY:1.5,duration:280,onComplete:function(){slash.destroy();}});
                // Flash other player red
                if(op.sprite){op.sprite.setTint(0xff0000);scene.time.delayedCall(250,function(){if(op&&op.sprite&&op.sprite.active)op.sprite.clearTint();});}
                float((crit?'💥 CRIT! ':'⚔️ ')+dmg,op.sprite.x,op.sprite.y-50,crit?'#ffff00':'#ff44ff');
                hit=true; // prevents "miss" text
            }
        });
    }

    if(!hit&&!(boss&&boss.active)) float('miss',player.x+playerFacing*30,player.y-20,'#444');
}

function onEnemyHit(player,enemy){
    if(invisible||selectedMode==='pvp')return;
    var now=Date.now();if(now-lastHit<1000)return;lastHit=now;
    var dmg=enemy.dmg||10;pH-=dmg;S.hit();
    scene.cameras.main.shake(200,0.008);
    player.setTint(0xff0000);scene.time.delayedCall(200,function(){player.clearTint();});
    updateHP();float('-'+dmg,player.x,player.y-50,'#ff3333');
    if(pH<=0){pH=0;updateHP();showGameOver();}
}

function killEnemy(e){
    if(!e||!e.active)return;
    var pool=e.pool||curPool;var m=pool?pool[e.mtype]:null;
    if(m)particles(e.x,e.y,m.color,12);S.die();
    gainXP(e.xp||20);score+=(e.score||10)*pLv;if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(e.gold||5);
    addPassXP(15);
    if(selectedMode!=='pvp')spawnPotion(e.x,e.y,false);
    var mt=e.mtype||'goblin';
    if(!questStats.kills[mt])questStats.kills[mt]=0;questStats.kills[mt]++;
    checkQ('kill',{m:mt});checkQ('score',{});
    // Story objective tracking
    if(storyMode){
        if(e.pool===POOL_SHADOW) updateStoryObj('shadow_kill',mt);
        else updateStoryObj('kill',mt);
    }
    if(e.hpBar)e.hpBar.destroy();if(e.tag)e.tag.destroy();
    e.destroy();
    if(selectedMode==='survival'){onWaveKill();return;}
    setTimeout(function(){
        if(!gameStarted)return;
        if(selectedMode==='adventure')spawnEnemy(null,POOL_ADV);
        else if(selectedMode==='bossrush')spawnEnemy(null,POOL_BRS);
        else if(selectedMode==='story')spawnEnemy(null,curPool);
    },4000);
}

// ================================
// BOSS
// ================================
function spawnStoryBoss(key){
    if(bossSpawned)return;
    bossSpawned=true;
    var bd;
    if(key==='vex')          bd=BOSS_VEX;
    else if(key==='shadowmaster') bd=BOSS_SHADOW_MASTER;
    else if(key==='darkking')     bd=BOSS_DARK_KING;
    else return;
    S.boss();
    makeBossTex('storyBoss',bd);
    // Spawn boss near center of current chapter's area
    var spawnY=storyChapter===2?(11*tSz):(storyChapter===3?(6*tSz):(18*tSz));
    boss=scene.physics.add.image(mW/2*tSz,spawnY,'storyBoss');
    boss.setCollideWorldBounds(true);
    boss.hp=bd.hp+pLv*80;boss.maxHp=boss.hp;boss.speed=bd.speed+pLv*5;boss.xp=bd.xp+pLv*50;boss.gold=bd.gold||180;
    scene.tweens.add({targets:boss,scaleX:1.12,scaleY:1.12,duration:650,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.bar).setScrollFactor(0).setDepth(15);
    bossTxt=scene.add.text(640,50,bd.name,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);
    if(player)float('⚠️ '+bd.name+'!',player.x-130,player.y-100,'#ff4444');
    addMsg('System','⚠️ '+bd.name+' appears!','#ff4444');
    scene.physics.add.overlap(player,boss,onBossHit,null,scene);
}
function spawnBoss(mode){
    if(bossSpawned)return;
    // Story mode — uses spawnStoryBoss via updateStoryObj triggers
    if(storyMode)return;
    bossSpawned=true;S.boss();
    var bd=mode==='srv'?BOSS_SRV:BOSS_ADV;
    makeBossTex('modeBoss',bd);
    var x=mW/2*tSz,y=mH/2*tSz;
    boss=scene.physics.add.image(x,y,'modeBoss');
    boss.setCollideWorldBounds(true);
    boss.hp=bd.hp+pLv*100;boss.maxHp=boss.hp;boss.speed=bd.speed+pLv*5;boss.xp=bd.xp+pLv*50;boss.gold=bd.gold||150;
    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:700,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.bar).setScrollFactor(0).setDepth(15);
    bossTxt=scene.add.text(640,50,bd.name,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);
    if(player)float('⚠️ '+bd.name+'!',player.x-130,player.y-100,'#ff4444');
    addMsg('System','⚠️ '+bd.name,'#ff4444');
    scene.physics.add.overlap(player,boss,onBossHit,null,scene);
}
var lastBossHit=0;
function onBossHit(p,b){
    var now=Date.now();if(now-lastBossHit<1500)return;lastBossHit=now;
    var dmg=35+pLv*4;pH-=dmg;S.hit();
    player.setTint(0xff0000);scene.cameras.main.shake(350,0.02);
    scene.time.delayedCall(250,function(){player.clearTint();});
    updateHP();float('-'+dmg,player.x,player.y-50,'#ff0000');
    if(pH<=0){pH=0;updateHP();showGameOver();}
}
function killBoss(){
    var wasShadowMaster=(storyMode&&storyChapter===3&&storyBossPhase===1);
    particles(boss.x,boss.y,0xff0000,30);particles(boss.x,boss.y,0xffff00,22);
    gainXP(boss.xp||400);score+=600*pLv;if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(boss.gold||150);
    addPassXP(100);
    for(var i=0;i<4;i++)spawnPotion(boss.x+Phaser.Math.Between(-80,80),boss.y+Phaser.Math.Between(-80,80),true);
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    boss.destroy();boss=null;bossSpawned=false;
    questStats.bossKills++;checkQ('boss',{});

    if(wasShadowMaster){
        // Phase 1 → 2: Shadow Master down, Dark King spawns
        float('💀 Shadow Master falls!',player.x-120,player.y-90,'#aa44ff');
        addMsg('System','💀 Shadow Master defeated! The Dark King rises!','#ff8844');
        updateStoryObj('story_boss_kill','shadowmaster');
        storyBossPhase=0;
        showStoryCutscene('The Shadow Master dissolves into darkness...\n\nA terrible laugh echoes through the throne room — THE DARK KING RISES!','#ff8844');
        setTimeout(function(){
            if(!gameStarted)return;
            storyBossPhase=2;
            spawnStoryBoss('darkking');
        },4200);
    } else {
        float('🏆 BOSS DEFEATED!',player.x-120,player.y-90,'#ffff00');
        addMsg('System','🏆 Boss defeated!','#ffff00');
        if(storyMode) updateStoryObj('boss','boss');
        if(selectedMode==='bossrush') setTimeout(function(){if(gameStarted)nextRush();},3000);
        else if(!storyMode) scene.time.addEvent({delay:180000,callback:function(){if(gameStarted)spawnBoss(selectedMode==='survival'?'srv':'adv');}});
    }
}
function updateBossHP(){
    if(!boss||!bossHPBar)return;
    bossHPBar.width=500*(boss.hp/boss.maxHp);
}

// ================================
// POTION
// ================================
function spawnPotion(x,y,force){
    if(!force&&Math.random()>0.35)return;
    var p=potions.create(x,y,'potTex');p.setCollideWorldBounds(true);
    scene.tweens.add({targets:p,y:p.y-12,duration:600,yoyo:true,repeat:-1});
    p.lbl=scene.add.text(x-8,y-28,'💊',{fontSize:'14px'}); return p;
}
function onPickPotion(player,potion){
    inv.push('Health Potion');updateInvPanel();
    if(potion.lbl)potion.lbl.destroy();potion.destroy();
    S.pick();checkQ('collect',{});float('💊 Potion!',player.x,player.y-60,'#ff69b4');
}
function doPot(){
    var i=inv.indexOf('Health Potion');
    if(i===-1){float('❌ No potions!',player.x,player.y-60,'#f00');return;}
    inv.splice(i,1);updateInvPanel();
    pH=Math.min(pH+40,pMaxH);updateHP();S.pick();float('+40 HP!',player.x,player.y-60,'#44ff44');
}

// ================================
// ABILITIES — all 18 classes
// ================================
function doAbi(){
    var now=Date.now();
    if(now-lastAbi<pClass.cd){ float('⏳ '+Math.ceil((pClass.cd-(now-lastAbi))/1000)+'s',player.x,player.y-60,'#888'); return; }
    lastAbi=now; S.abi();
    var btn=el('abilityBtn');if(btn){btn.classList.remove('ready');btn.classList.add('cooldown');setTimeout(function(){btn.classList.remove('cooldown');btn.classList.add('ready');},pClass.cd);}
    var c=selectedClass;
    if(c==='warrior')      abiWarrior();
    else if(c==='archer')  abiArcher();
    else if(c==='mage')    abiMage();
    else if(c==='rogue')   abiRogue();
    else if(c==='paladin')     abiPaladin();
    else if(c==='necromancer') abiNecro();
    else if(c==='berserker')   abiBerserk();
    else if(c==='ranger')      abiRanger();
    else if(c==='knight')      abiKnight();
    else if(c==='monk')        abiMonk();
    else if(c==='shaman')      abiShaman();
    else if(c==='druid')       abiDruid();
    else if(c==='assassin')    abiAssassin();
    else if(c==='warlord')     abiWarlord();
    else if(c==='archmage')    abiArchmage();
    else if(c==='vampire')     abiVampire();
    else if(c==='gunslinger')  abiGunslinger();
    else if(c==='bard')        abiBard();
}

// Original 8 abilities
function abiWarrior(){ float('🛡️ SHIELD BASH!',player.x-60,player.y-70,'#ff8888');particles(player.x,player.y,0xff6666,16);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<160){var prev=e.speed;e.speed=0;e.setTint(0xffff00);e.hp-=pDmg*2.5;scene.time.delayedCall(2500,function(){if(e&&e.active){e.speed=prev;e.clearTint();}});if(e.hp<=0)killEnemy(e);}}); }
function abiArcher(){ float('🏹 ARROW RAIN!',player.x-60,player.y-70,'#88ff88');for(var i=0;i<16;i++){(function(a){var arr=scene.add.rectangle(player.x,player.y,22,5,0x88ff44).setRotation(a).setDepth(10);scene.tweens.add({targets:arr,x:player.x+Math.cos(a)*280,y:player.y+Math.sin(a)*280,alpha:0,duration:450,onComplete:function(){arr.destroy();}});enemies.getChildren().forEach(function(e){var ex=e.x-player.x,ey=e.y-player.y,d=Math.sqrt(ex*ex+ey*ey);if(d<280&&Math.abs(Math.atan2(ey,ex)-a)<0.25){e.hp-=pDmg;if(e.hp<=0)killEnemy(e);}});})(i/16*Math.PI*2);} }
function abiMage(){ float('🔥 FIREBALL!',player.x-50,player.y-70,'#8888ff');particles(player.x,player.y,0xff4400,28);scene.cameras.main.shake(500,0.02);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<270){e.hp-=pDmg*3.5;if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<270){boss.hp-=pDmg*3.5;updateBossHP();if(boss.hp<=0)killBoss();} }
function abiRogue(){ float('👁️ VANISH!',player.x-40,player.y-70,'#ffaa44');invisible=true;player.setAlpha(0.15);pSpd*=2;scene.time.delayedCall(3000,function(){invisible=false;player.setAlpha(1);pSpd/=2;float('👁️ Visible!',player.x-40,player.y-60,'#ffaa44');}); }
function abiPaladin(){ float('✨ HOLY AURA!',player.x-60,player.y-70,'#ffddaa');var heal=Math.floor(pMaxH*0.35);pH=Math.min(pH+heal,pMaxH);updateHP();for(var i=0;i<20;i++){(function(a){var s=scene.add.circle(player.x+Math.cos(a)*80,player.y+Math.sin(a)*80,6,0xffff88).setDepth(15);scene.tweens.add({targets:s,x:player.x,y:player.y,alpha:0,duration:600,onComplete:function(){s.destroy();}});})(i/20*Math.PI*2);}enemies.getChildren().forEach(function(e){if(['skeleton','boneknight'].indexOf(e.mtype)!==-1&&Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<200){e.hp-=pDmg*4;if(e.hp<=0)killEnemy(e);}});float('+'+heal+' HP!',player.x,player.y-90,'#ffff44'); }
function abiNecro(){ float('☠️ RAISE DEAD!',player.x-60,player.y-70,'#88ff88');for(var i=0;i<3;i++){(function(a){var mx=player.x+Math.cos(a)*60,my=player.y+Math.sin(a)*60;var mn=scene.physics.add.image(mx,my,'minionTex');mn.speed=130;minions.push(mn);mn.lbl=scene.add.text(mx,my-28,'☠️',{fontSize:'14px'}).setOrigin(0.5);scene.physics.add.overlap(mn,enemies,function(m,e){if(!e||!e.active)return;e.hp-=15;if(e.hp<=0)killEnemy(e);});scene.time.delayedCall(15000,function(){if(mn&&mn.active){if(mn.lbl)mn.lbl.destroy();mn.destroy();minions=minions.filter(function(m){return m!==mn;});}});})(i/3*Math.PI*2);} }
function abiBerserk(){ float('😤 BERSERK!',player.x-50,player.y-70,'#ff4444');berserking=true;pSpd*=1.6;pDmg=Math.floor(pDmg*2.5);player.setTint(0xff2200);scene.cameras.main.shake(300,0.015);scene.time.delayedCall(8000,function(){berserking=false;pSpd/=1.6;pDmg=Math.floor(pDmg/2.5);player.clearTint();float('😤 Rage ended',player.x-50,player.y-60,'#888');}); }
function abiRanger(){ float('🐺 WOLF PACK!',player.x-50,player.y-70,'#44ffaa');for(var i=0;i<2;i++){(function(){var wx=player.x+Phaser.Math.Between(-60,60),wy=player.y+Phaser.Math.Between(-60,60);var wf=scene.physics.add.image(wx,wy,'wolfTex');wf.speed=200;wolfPets.push(wf);wf.lbl=scene.add.text(wx,wy-28,'🐺',{fontSize:'14px'}).setOrigin(0.5);scene.physics.add.overlap(wf,enemies,function(w,e){if(!e||!e.active)return;var now=Date.now();if(!w.lb||now-w.lb>800){w.lb=now;e.hp-=20+pLv*3;if(e.hp<=0)killEnemy(e);}});scene.time.delayedCall(18000,function(){if(wf&&wf.active){if(wf.lbl)wf.lbl.destroy();wf.destroy();wolfPets=wolfPets.filter(function(w){return w!==wf;});}});})()} }

// NEW CLASS ABILITIES
function abiKnight(){
    float('💨 CHARGE!',player.x-50,player.y-70,'#aaaaff');
    // Dash forward
    var dashDist=280;var vx=playerFacing*dashDist,vy=0;
    player.setVelocity(playerFacing*1200,0);
    // Damage enemies in path
    scene.time.addEvent({delay:30,repeat:5,callback:function(){
        enemies.getChildren().forEach(function(e){
            if(!e||!e.active)return;
            if(Math.abs(e.x-player.x)<60&&Math.abs(e.y-player.y)<50){
                e.hp-=pDmg*2;e.setTint(0xaaaaff);
                var push=playerFacing*200;e.setVelocityX(push);
                scene.time.delayedCall(300,function(){if(e&&e.active){e.clearTint();e.setVelocityX(0);}});
                float('💨 '+Math.floor(pDmg*2),e.x,e.y-40,'#aaaaff');
                if(e.hp<=0)killEnemy(e);
            }
        });
    }});
    scene.time.delayedCall(200,function(){if(player)player.setVelocity(0);});
    particles(player.x+playerFacing*60,player.y,0xaaaaff,14);
}
function abiMonk(){
    float('👊 COMBO STRIKE!',player.x-70,player.y-70,'#ffcc88');
    var hits=[0,120,240,360,480];
    hits.forEach(function(delay,i){
        setTimeout(function(){
            if(!player||!player.active||!gameStarted)return;
            particles(player.x+playerFacing*pRange*0.5,player.y,0xffcc44,8);
            scene.cameras.main.shake(80,0.004);
            enemies.getChildren().forEach(function(e){
                if(!e||!e.active)return;
                if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<=pRange+20){
                    var dmg=Math.floor(pDmg*(1+i*0.3));
                    e.hp-=dmg;
                    float(dmg,e.x,e.y-30-i*10,'#ffcc44');
                    if(e.hp<=0)killEnemy(e);
                }
            });
            if(i===4)float('💥 5-HIT COMBO!',player.x-80,player.y-90,'#ff8800');
        },delay);
    });
}
function abiShaman(){
    float('🌩️ LIGHTNING STORM!',player.x-80,player.y-70,'#ffff44');
    scene.cameras.main.flash(300,255,255,100);
    var targets=[];
    enemies.getChildren().forEach(function(e){if(e&&e.active)targets.push(e);});
    targets.sort(function(){return Math.random()-0.5;});
    targets.slice(0,8).forEach(function(e,idx){
        setTimeout(function(){
            if(!e||!e.active)return;
            // Lightning bolt visual
            var lx1=e.x+Phaser.Math.Between(-10,10),ly1=e.y-120;
            var bolt=scene.add.graphics();
            bolt.lineStyle(3,0xffff00,1);
            bolt.lineBetween(lx1,ly1,e.x,e.y);
            bolt.lineStyle(2,0xffffff,0.5);
            bolt.lineBetween(lx1+5,ly1+20,e.x+5,e.y-20);
            scene.tweens.add({targets:bolt,alpha:0,duration:300,onComplete:function(){bolt.destroy();}});
            var dmg=Math.floor(pDmg*1.8);
            e.hp-=dmg;e.setTint(0xffff00);
            scene.time.delayedCall(150,function(){if(e&&e.active)e.clearTint();});
            float('⚡ '+dmg,e.x,e.y-50,'#ffff00');
            if(e.hp<=0)killEnemy(e);
        },idx*120);
    });
    if(boss&&boss.active){boss.hp-=pDmg*4;updateBossHP();if(boss.hp<=0)killBoss();}
}

// PREMIUM class abilities
function abiDruid(){ float('🌿 NATURE HEAL!',player.x-70,player.y-70,'#aaffcc');var heal=Math.floor(pMaxH*0.5);pH=Math.min(pH+heal,pMaxH);updateHP();for(var i=0;i<12;i++){(function(a){var leaf=scene.add.circle(player.x+Math.cos(a)*60,player.y+Math.sin(a)*60,7,0x44ff88).setDepth(15);scene.tweens.add({targets:leaf,x:player.x,y:player.y,alpha:0,duration:800,onComplete:function(){leaf.destroy();}});})(i/12*Math.PI*2);}float('+'+heal+' HP!',player.x,player.y-90,'#44ff44'); }
function abiAssassin(){ float('⚡ CHAIN STRIKE!',player.x-70,player.y-70,'#ff6688');var targets=[];enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<300)targets.push(e);});targets.sort(function(a,b){return Phaser.Math.Distance.Between(player.x,player.y,a.x,a.y)-Phaser.Math.Distance.Between(player.x,player.y,b.x,b.y);});targets.slice(0,5).forEach(function(e,i){setTimeout(function(){if(!e||!e.active)return;var dmg=Math.floor(pDmg*2*Math.pow(0.8,i));e.hp-=dmg;float('⚡ '+dmg,e.x,e.y-40,'#ff6688');if(e.hp<=0)killEnemy(e);},i*100);}); }
function abiWarlord(){ float('👑 RALLY ARMY!',player.x-70,player.y-70,'#ffcc44');for(var i=0;i<4;i++){(function(a){var sx=player.x+Math.cos(a)*80,sy=player.y+Math.sin(a)*80;var sol=scene.physics.add.image(sx,sy,'minionTex').setTint(0xffcc44);sol.speed=160;minions.push(sol);sol.lbl=scene.add.text(sx,sy-28,'⚔️',{fontSize:'12px'}).setOrigin(0.5);scene.physics.add.overlap(sol,enemies,function(m,e){if(!e||!e.active)return;e.hp-=pDmg*0.8;if(e.hp<=0)killEnemy(e);});scene.time.delayedCall(20000,function(){if(sol&&sol.active){if(sol.lbl)sol.lbl.destroy();sol.destroy();minions=minions.filter(function(m){return m!==sol;});}});})(i/4*Math.PI*2);} }
function abiArchmage(){ float('💥 METEOR STRIKE!',player.x-80,player.y-70,'#cc88ff');particles(player.x,player.y,0xff4400,40);particles(player.x,player.y,0xcc88ff,30);scene.cameras.main.shake(800,0.035);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<400){e.hp-=pDmg*6;if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<400){boss.hp-=pDmg*6;updateBossHP();if(boss.hp<=0)killBoss();} }

function abiVampire(){
    float('🩸 BLOOD DRAIN!',player.x-70,player.y-70,'#cc0044');
    var totalDrained=0;
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active)return;
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<200){
            var drain=Math.floor(pDmg*1.5);
            e.hp-=drain; totalDrained+=Math.floor(drain*0.6);
            // Blood particles flying back to player
            for(var i=0;i<5;i++){(function(){
                var bx=e.x,by=e.y;
                var bp=scene.add.circle(bx,by,4,0xff0044).setDepth(14);
                scene.tweens.add({targets:bp,x:player.x,y:player.y,duration:400,onComplete:function(){bp.destroy();}});
            })();}
            float('🩸 -'+drain,e.x,e.y-40,'#cc0044');
            if(e.hp<=0)killEnemy(e);
        }
    });
    if(totalDrained>0){pH=Math.min(pH+totalDrained,pMaxH);updateHP();float('🩸 +'+totalDrained+' life steal!',player.x,player.y-90,'#ff4488');}
}

function abiGunslinger(){
    float('💥 BULLET STORM!',player.x-70,player.y-70,'#ffcc00');
    for(var i=0;i<10;i++){(function(angleOffset){
        setTimeout(function(){
            if(!player||!player.active)return;
            var baseAngle=playerFacing===1?0:Math.PI;
            var angle=baseAngle+angleOffset;
            var bullet=scene.add.image(player.x,player.y,'bulletTex').setDepth(12);
            var targetX=player.x+Math.cos(angle)*320;
            var targetY=player.y+Math.sin(angle)*320;
            scene.tweens.add({targets:bullet,x:targetX,y:targetY,duration:220,onComplete:function(){bullet.destroy();}});
            enemies.getChildren().forEach(function(e){
                if(!e||!e.active)return;
                var ex=e.x-player.x,ey=e.y-player.y;
                var d=Math.sqrt(ex*ex+ey*ey);
                var ea=Math.atan2(ey,ex);
                if(d<320&&Math.abs(ea-angle)<0.22){
                    var dmg=Math.floor(pDmg*(Math.random()<0.2?2:1));
                    e.hp-=dmg;float('💥 '+dmg,e.x,e.y-40,'#ffcc00');
                    if(e.hp<=0)killEnemy(e);
                }
            });
            if(boss&&boss.active){
                var bd=Math.atan2(boss.y-player.y,boss.x-player.x);
                if(Math.abs(bd-angle)<0.3){boss.hp-=Math.floor(pDmg*0.8);updateBossHP();if(boss.hp<=0)killBoss();}
            }
        },i*60);
    })((i/10-0.5)*1.2);}
}

function abiBard(){
    float('🎶 BATTLE HYMN!',player.x-70,player.y-70,'#ff88ff');
    // Buff: speed + damage for 6s
    pSpd*=1.4; pDmg=Math.floor(pDmg*1.5);
    player.setTint(0xff88ff);
    // Musical notes fly out
    var notes=['🎵','🎶','🎸','🎺'];
    for(var i=0;i<12;i++){(function(a){
        var note=scene.add.text(player.x+Math.cos(a)*50,player.y+Math.sin(a)*50,notes[Math.floor(Math.random()*notes.length)],{fontSize:'18px'}).setDepth(15);
        scene.tweens.add({targets:note,x:player.x+Math.cos(a)*150,y:player.y+Math.sin(a)*150-40,alpha:0,duration:1200,onComplete:function(){note.destroy();}});
    })(i/12*Math.PI*2);}
    // Heal nearby players via chat (cosmetic)
    pH=Math.min(pH+Math.floor(pMaxH*0.2),pMaxH); updateHP();
    float('🎶 +Buff 6s! +20% HP!',player.x,player.y-90,'#ff88ff');
    scene.time.delayedCall(6000,function(){
        pSpd/=1.4; pDmg=Math.floor(pDmg/1.5);
        player.clearTint();
        float('🎶 Hymn fades...',player.x-50,player.y-60,'#888');
    });
}

// ================================
// XP + LEVEL
// ================================
function gainXP(amount){ pXP+=amount;float('+'+amount+' XP',player.x,player.y-70,'#ffff44');if(pXP>=xpNext)levelUp();if(xpBar)xpBar.width=202*(pXP/xpNext);if(xpText)xpText.setText('XP: '+pXP+'/'+xpNext);checkQ('level',{}); }
function levelUp(){ pXP-=xpNext;pLv++;xpNext=pLv*100;pMaxH+=20;pH=pMaxH;pSpd+=5;pDmg+=5;S.lvup();scene.tweens.add({targets:player,scaleX:1.5,scaleY:1.5,duration:200,yoyo:true,repeat:2});player.setTint(0xffff00);scene.time.delayedCall(800,function(){if(!berserking)player.clearTint();});if(lvTxt)lvTxt.setText('⭐ Lv.'+pLv);if(nameTxt)nameTxt.setText(pClass.icon+' '+pName+' Lv.'+pLv);updateHP();float('🌟 LEVEL UP! '+pLv,player.x-70,player.y-90,'#ffff00');doSave(); }

// ================================
// DAY/NIGHT
// ================================
function startDayNight(){ timeTxt=scene.add.text(640,15,'☀️ Day',{fontSize:'14px',fill:'#ffff88'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(10);scene.time.addEvent({delay:35000,loop:true,callback:function(){dayTime=dayTime===0?1:0;if(dayTime===1){timeTxt.setText('🌙 Night');scene.tweens.add({targets:nightOverlay,alpha:0.5,duration:3000});enemies.getChildren().forEach(function(e){e.speed*=1.25;});float('🌙 Night!',player.x-50,player.y-80,'#aaaaff');}else{timeTxt.setText('☀️ Day');scene.tweens.add({targets:nightOverlay,alpha:0,duration:3000});enemies.getChildren().forEach(function(e){e.speed/=1.25;});float('☀️ Day!',player.x-30,player.y-80,'#ffff88');}}}); }

// ================================
// SURVIVE TIMER
// ================================
function startSurvTimer(){ scene.time.addEvent({delay:1000,loop:true,callback:function(){if(!gameStarted||!player||!player.active)return;survTimer++;checkQ('survive',{});if(survTimer%5===0&&pH<pMaxH){pH=Math.min(pH+1,pMaxH);updateHP();}}}); }

// ================================
// TOMBSTONE
// ================================
function spawnTombstone(x,y){
    addTombVis(x,y,pName,pLv,'#cccccc');
    if(tombsRef&&myId){
        var ref=tombsRef.push({x:x,y:y,name:pClass.icon+' '+pName,level:pLv,mode:selectedMode,sid:myId,t:Date.now()});
        setTimeout(function(){if(ref)ref.remove();},5000);
    }
}
function addTombVis(x,y,name,level,color){
    if(!scene)return;
    var stone=scene.add.image(x,y,'tombTex').setDepth(7);
    var lbl=scene.add.text(x,y-34,'💀 '+name+'\nLv.'+level,{fontSize:'10px',fill:color||'#ccc',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(7);
    tombs.push({stone:stone,lbl:lbl});
    setTimeout(function(){
        if(!scene)return;
        scene.tweens.add({targets:[stone,lbl],alpha:0,duration:1500,onComplete:function(){if(stone&&stone.active)stone.destroy();if(lbl&&lbl.active)lbl.destroy();}});
    },5000);
}

// ================================
// SAVE
// ================================
function doSave(){
    saveGame();S.save();
    var notif=el('saveNotif'); var ntxt=el('saveText');
    if(ntxt)ntxt.textContent='✅ Saved! Lv.'+pLv+'  💰'+gold+'  Score:'+score;
    if(notif){notif.style.display='block';notif.style.opacity='1';setTimeout(function(){notif.style.transition='opacity 0.6s';notif.style.opacity='0';setTimeout(function(){if(notif)notif.style.display='none';},700);},2500);}
    if(player)float('💾 Saved!',player.x,player.y-60,'#00ffff');
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
    scene.add.text(16,131,pClass.icon+' '+pClass.name,{fontSize:'12px',fill:'#ffbb88'}).setScrollFactor(0).setDepth(10);
    if(!isMobile)scene.add.text(16,696,'WASD:Move  SHIFT:Sprint  SPACE:Attack  E:'+(storyMode?'Talk/'+pClass.ability:pClass.ability)+'  F:Potion  I:Bag  T:Chat  ENTER:Save',{fontSize:'10px',fill:'#88aa88'}).setScrollFactor(0).setDepth(10);
    nameTxt=scene.add.text(0,0,pClass.icon+' '+pName+' Lv.'+pLv,{fontSize:'12px',fill:'#fff',stroke:'#000',strokeThickness:2});
}
function updateHP(){
    if(!hpBar||!hpText)return;
    var p=Math.max(0,pH)/pMaxH;hpBar.width=202*p;
    if(p>0.6)hpBar.setFillStyle(0x22cc22);else if(p>0.3)hpBar.setFillStyle(0xddcc00);else hpBar.setFillStyle(0xdd2222);
    hpText.setText('HP: '+Math.max(0,Math.floor(pH))+'/'+pMaxH);
    if(myRef)myRef.update({hp:Math.floor(pH),maxHp:pMaxH});
}

// ================================
// INVENTORY
// ================================
function buildInv(){
    invPanel=scene.add.container(0,0);
    var bg=scene.add.rectangle(640,360,420,310,0x0a0a0a,0.95);
    var title=scene.add.text(640,222,'🎒 Inventory',{fontSize:'22px',fill:'#ffaa00'}).setOrigin(0.5);
    var hint=scene.add.text(640,465,'F: Use Potion   I: Close',{fontSize:'12px',fill:'#555'}).setOrigin(0.5);
    invPanel.add([bg,title,hint]);invPanel.setScrollFactor(0).setDepth(30);invPanel.setVisible(false);
}
function updateInvPanel(){
    invTexts.forEach(function(t){t.destroy();});invTexts=[];
    if(!inv.length){var e=scene.add.text(640,360,'No items...',{fontSize:'16px',fill:'#444'}).setOrigin(0.5).setScrollFactor(0).setDepth(31);invTexts.push(e);return;}
    var counts={};inv.forEach(function(i){counts[i]=(counts[i]||0)+1;});
    var y=275;Object.keys(counts).forEach(function(item){var t=scene.add.text(640,y,'💊 '+item+'  ×'+counts[item],{fontSize:'18px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(31);invTexts.push(t);y+=44;});
}
function toggleInv(){invOpen=!invOpen;invPanel.setVisible(invOpen);if(invOpen)updateInvPanel();}

// ================================
// HELPERS
// ================================
function particles(x,y,color,n){n=n||12;for(var i=0;i<n;i++){(function(a){var p=scene.add.circle(x,y,Phaser.Math.Between(3,9),color).setDepth(15);var spd=Phaser.Math.Between(70,190);scene.tweens.add({targets:p,x:x+Math.cos(a)*spd,y:y+Math.sin(a)*spd,alpha:0,scaleX:0,scaleY:0,duration:Phaser.Math.Between(350,700),onComplete:function(){p.destroy();}});})(i/n*Math.PI*2);}}
function float(msg,x,y,color){var t=scene.add.text(x,y,msg,{fontSize:'15px',fill:color,stroke:'#000',strokeThickness:3}).setDepth(20);scene.tweens.add({targets:t,y:y-55,alpha:0,duration:1400,onComplete:function(){t.destroy();}});}

// ================================
// CHAT
// ================================
function openChat(){
    chatOpen=true;var input=el('chatInput');if(!input)return;
    input.disabled=false;input.focus();
    input.onkeydown=function(e){
        if(e.key==='Enter'){var msg=input.value.trim();if(msg){addMsg(pName,msg,'#aaffaa');if(chatRef&&myId)chatRef.push({name:pClass.icon+' '+pName,msg:msg,sid:myId,t:Date.now()});}input.value='';input.disabled=true;chatOpen=false;input.blur();}
        if(e.key==='Escape'){input.value='';input.disabled=true;chatOpen=false;input.blur();}
        e.stopPropagation();
    };
}
function addMsg(name,msg,color){
    var msgs=el('chatMessages');if(!msgs)return;
    var d=document.createElement('div');d.style.color=color||'#fff';d.style.marginBottom='3px';
    d.innerHTML='<b>'+name+':</b> '+msg;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;
}

// ================================
// MINIMAP
// ================================
function updateMinimap(){
    var canvas=el('minimap');if(!canvas||!player)return;
    canvas.width=130;canvas.height=130;
    var ctx=canvas.getContext('2d'),sx=130/(mW*tSz),sy=130/(mH*tSz);
    var bgM={adventure:'#1a4a1a',survival:'#3d1500',bossrush:'#0d0011',pvp:'#1a1a22',story:'#1a4a1a'};
    ctx.fillStyle=inShadow?'#110022':(bgM[selectedMode]||'#1a4a1a');ctx.fillRect(0,0,130,130);
    enemies.getChildren().forEach(function(e){ctx.fillStyle='#ff4444';ctx.fillRect(e.x*sx-2,e.y*sy-2,4,4);});
    if(boss&&boss.active){ctx.fillStyle='#ff0000';ctx.fillRect(boss.x*sx-5,boss.y*sy-5,10,10);}
    Object.values(otherPlayers).forEach(function(op){if(op.dim!==dim)return;ctx.fillStyle='#cc88ff';ctx.fillRect(op.sprite.x*sx-2,op.sprite.y*sy-2,5,5);});
    // Story: NPC dots
    if(storyMode){
        storyNPCList.forEach(function(npc){
            ctx.fillStyle='#ffcc44';ctx.fillRect(npc.x*sx-3,npc.y*sy-3,6,6);
        });
    }
    if(selectedMode==='adventure'){
        if(!inShadow){ctx.fillStyle='#aa00ff';ctx.fillRect(22*tSz*sx-3,22*tSz*sy-3,6,6);}
        else{ctx.fillStyle='#ffaa00';ctx.fillRect(4*tSz*sx-3,4*tSz*sy-3,6,6);}
    }
    ctx.fillStyle='#'+(skinColor?skinColor.toString(16).padStart(6,'0'):'4488ff');
    ctx.beginPath();ctx.arc(player.x*sx,player.y*sy,5,0,Math.PI*2);ctx.fill();
}

// ================================
// SAVE / LOAD
// ================================
function saveGame(){
    localStorage.setItem('rpgSave',JSON.stringify({pLv:pLv,pXP:pXP,pH:pH,pMaxH:pMaxH,pSpd:pSpd,pDmg:pDmg,xpNext:xpNext,score:score,inv:inv,pName:pName,cls:selectedClass,qStats:questStats,storyChapter:storyChapter}));
    if(typeof pData!=='undefined'){pData.gold=gold;savePData();}
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
// GAME OVER
// ================================
function showGameOver(){
    player.setVelocity(0);player.setActive(false);gameStarted=false;window.gameStarted=false;
    spawnTombstone(player.x,player.y);S.over();
    if(myRef)myRef.update({alive:false});
    setTimeout(function(){
        scene.cameras.main.fade(2000,0,0,0,false,function(cam,prog){
            if(prog!==1)return;
            var mLabels={adventure:'🌲 Adventure',survival:'🔥 Survival — Wave '+wave,bossrush:'💀 Boss Rush — Boss #'+rushIdx,pvp:'⚔️ PvP',story:'📖 Story — Chapter '+storyChapter};
            var ov=document.createElement('div');
            ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s ease;font-family:Arial,sans-serif;color:#fff;';
            ov.innerHTML='<div style="text-align:center;max-width:540px;padding:32px;"><div style="font-size:84px;margin-bottom:10px;">💀</div><h1 style="font-size:52px;color:#ff2222;letter-spacing:6px;text-shadow:0 0 40px #f00;margin-bottom:5px;">GAME OVER</h1><p style="font-size:14px;color:#ffaa00;margin-bottom:3px;">'+mLabels[selectedMode]+'</p><p style="font-size:17px;color:#888;margin-bottom:3px;">'+(pClass?pClass.icon:'')+' <b>'+pName+'</b> — Level '+pLv+'</p><p style="font-size:22px;color:#ffdd44;margin-bottom:5px;">Score: '+score+'</p><p style="font-size:15px;color:#ffaa00;margin-bottom:22px;">💰 '+gold+' Gold earned</p><div style="display:flex;gap:12px;justify-content:center;"><button id="rBtn" style="padding:11px 30px;font-size:15px;background:linear-gradient(135deg,#aa0000,#dd2222);color:#fff;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Arial;">⚔️ Play Again</button><button id="mBtn" style="padding:11px 30px;font-size:15px;background:#1a1a1a;color:#fff;border:2px solid #444;border-radius:10px;cursor:pointer;font-family:Arial;">🏠 Menu</button></div><p style="margin-top:12px;font-size:11px;color:#333;">Press R to restart</p></div>';
            document.body.appendChild(ov);setTimeout(function(){ov.style.opacity='1';},50);
            function restart(){
                ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)document.body.removeChild(ov);},1000);
                pH=100;pMaxH=100;pXP=0;pLv=1;pSpd=200;pDmg=20;xpNext=100;score=0;
                inv=[];bossSpawned=false;dim=0;survTimer=0;minions=[];wolfPets=[];berserking=false;invisible=false;inShadow=false;wave=0;rushIdx=0;normalTiles=[];shadowTiles=[];tombs=[];storyNPCList=[];storyObjProgress=[];storyChapter=0;storyDone=false;storyLairTriggered=false;storyShadowKills=0;storyBossPhase=0;
                gameStarted=false;window.gameStarted=false;
                localStorage.removeItem('rpgSave');
                scene.cameras.main.fadeIn(100);scene.scene.restart();
                setTimeout(function(){
                    // Hide ALL screens first (including loginScreen), then show mainMenu
                    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
                    var mm=document.getElementById('mainMenu');if(mm)mm.classList.add('active');
                    var ls=document.getElementById('loginScreen');if(ls)ls.classList.remove('active');
                    hide('storyPanel');hide('storyDialog');
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
    if((shiftKey&&shiftKey.isDown||window.touchSprinting)&&stamina>0){spd*=1.55;stamina=Math.max(0,stamina-0.8);}
    else{stamina=Math.min(maxSta,stamina+0.3);}
    if(staminaBar)staminaBar.width=202*(stamina/maxSta);

    if(cursors.left.isDown||wasd.left.isDown){player.setVelocityX(-spd);playerFacing=-1;player.setFlipX(true);moving=true;}
    else if(cursors.right.isDown||wasd.right.isDown){player.setVelocityX(spd);playerFacing=1;player.setFlipX(false);moving=true;}
    if(cursors.up.isDown||wasd.up.isDown){player.setVelocityY(-spd);moving=true;}
    else if(cursors.down.isDown||wasd.down.isDown){player.setVelocityY(spd);moving=true;}

    if(jsActive&&(Math.abs(jsDX)>0.1||Math.abs(jsDY)>0.1)){
        player.setVelocityX(jsDX*spd);player.setVelocityY(jsDY*spd);
        if(jsDX<-0.1){playerFacing=-1;player.setFlipX(true);}else if(jsDX>0.1){playerFacing=1;player.setFlipX(false);}
        moving=true;
    }

    if(moving)player.y+=Math.sin(Date.now()/120)*0.5;
    if(atkIndicator)atkIndicator.setPosition(player.x,player.y);

    // Accessory overlay
    if(accessoryOverlay)accessoryOverlay.setPosition(player.x,player.y-28);

    sendPos();

    // Smooth multiplayer lerp
    Object.values(otherPlayers).forEach(function(op){
        if(!op||!op.sprite)return;
        var lerp=0.18;
        op.sprite.x+=(op.tx-op.sprite.x)*lerp;
        op.sprite.y+=(op.ty-op.sprite.y)*lerp;
        if(op.tag)op.tag.setPosition(op.sprite.x-30,op.sprite.y-55);
        if(op.hpBg)op.hpBg.setPosition(op.sprite.x,op.sprite.y-48);
        if(op.hpBar)op.hpBar.setPosition(op.sprite.x-20,op.sprite.y-48);
    });

    updateMinimap();
    if(nameTxt)nameTxt.setPosition(player.x-40,player.y-60);
    potions.getChildren().forEach(function(p){if(p.lbl)p.lbl.setPosition(p.x-8,p.y-28);});

    if(boss&&boss.active){
        var bdx=player.x-boss.x,bdy=player.y-boss.y,bd=Math.sqrt(bdx*bdx+bdy*bdy);
        if(bd>0){boss.setVelocityX(bdx/bd*boss.speed);boss.setVelocityY(bdy/bd*boss.speed);}
        boss.rotation+=0.015;
    }

    minions.forEach(function(m){if(!m||!m.active)return;var dx=player.x-m.x,dy=player.y-m.y,d=Math.sqrt(dx*dx+dy*dy);if(d>80&&d>0){m.setVelocityX(dx/d*m.speed);m.setVelocityY(dy/d*m.speed);}else m.setVelocity(0);if(m.lbl)m.lbl.setPosition(m.x,m.y-28);});
    wolfPets.forEach(function(w){if(!w||!w.active)return;var cl=null,cd=300;enemies.getChildren().forEach(function(e){if(!e||!e.active)return;var d=Phaser.Math.Distance.Between(w.x,w.y,e.x,e.y);if(d<cd){cd=d;cl=e;}});if(cl){var wdx=cl.x-w.x,wdy=cl.y-w.y,wd=Math.sqrt(wdx*wdx+wdy*wdy);if(wd>0){w.setVelocityX(wdx/wd*w.speed);w.setVelocityY(wdy/wd*w.speed);}}else{var pdx=player.x-w.x,pdy=player.y-w.y,pd=Math.sqrt(pdx*pdx+pdy*pdy);if(pd>100&&pd>0){w.setVelocityX(pdx/pd*150);w.setVelocityY(pdy/pd*150);}else w.setVelocity(0);}if(w.lbl)w.lbl.setPosition(w.x,w.y-28);});

    enemies.getChildren().forEach(function(e){
        if(!e||!e.active||e.speed===0)return;
        var dx=player.x-e.x,dy=player.y-e.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<280&&d>0){e.setVelocityX(dx/d*e.speed);e.setVelocityY(dy/d*e.speed);}
        else{var px=(e.px||e.x)-e.x,py=(e.py||e.y)-e.y,pd=Math.sqrt(px*px+py*py);if(pd>100&&pd>0){e.setVelocityX(px/pd*e.speed*0.4);e.setVelocityY(py/pd*e.speed*0.4);}else if(Math.random()<0.008){e.setVelocityX(Phaser.Math.Between(-40,40));e.setVelocityY(Phaser.Math.Between(-40,40));}}
        var pool=e.pool||curPool;var mData=pool?pool[e.mtype]:null;var ms=mData?mData.size:40;
        if(e.hpBar){e.hpBar.setPosition(e.x,e.y-35);e.hpBar.width=ms*(e.hp/e.maxHp);}
        if(e.tag)e.tag.setPosition(e.x,e.y-50);
    });

    // Story NPC proximity check
    if(storyMode&&!storyDialogActive){
        storyNearNPC=null;
        storyNPCList.forEach(function(npc){
            if(!npc.sprite||!npc.sprite.active)return;
            var d=Phaser.Math.Distance.Between(player.x,player.y,npc.x,npc.y);
            if(d<90){
                storyNearNPC=npc;
                if(!npc.promptShown){
                    npc.promptShown=true;
                    if(storyNPCPrompt)storyNPCPrompt.destroy();
                    storyNPCPrompt=scene.add.text(npc.x,npc.y-80,isMobile?'Tap: Talk':'[E] Talk',{fontSize:'13px',fill:'#ffff44',stroke:'#000',strokeThickness:3,backgroundColor:'rgba(0,0,0,0.5)',padding:{x:6,y:3}}).setOrigin(0.5).setDepth(20);
                    scene.tweens.add({targets:storyNPCPrompt,y:npc.y-90,duration:600,yoyo:true,repeat:-1});
                }
            } else {
                npc.promptShown=false;
                if(storyNearNPC===npc){storyNearNPC=null;}
            }
        });
        if(!storyNearNPC&&storyNPCPrompt){storyNPCPrompt.destroy();storyNPCPrompt=null;}

        // Mobile: show/hide NPC talk button
        if(isMobile){
            var talkBtn=el('npcTalkBtn');
            if(talkBtn) talkBtn.style.display = (storyNearNPC&&!storyDialogActive) ? 'block' : 'none';
        }
    }
}
