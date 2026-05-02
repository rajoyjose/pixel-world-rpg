// ================================
// PIXEL WORLD RPG — All Fixed!
// 8 free classes + 4 premium
// All null checks added
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
// ALL 12 CLASSES (8 free + 4 premium)
// ================================
var CLASSES = {
    warrior:    { name:'Warrior',    icon:'⚔️',  hp:220, speed:155, damage:35, range:80,  ability:'Shield Bash',   abilityIcon:'🛡️', cd:5000,  atk:700 },
    archer:     { name:'Archer',     icon:'🏹',  hp:110, speed:285, damage:28, range:200, ability:'Arrow Rain',    abilityIcon:'🏹', cd:4000,  atk:500 },
    mage:       { name:'Mage',       icon:'🧙',  hp:80,  speed:200, damage:70, range:150, ability:'Fireball',      abilityIcon:'🔥', cd:6000,  atk:900 },
    rogue:      { name:'Rogue',      icon:'🗡️', hp:110, speed:265, damage:50, range:70,  ability:'Vanish',        abilityIcon:'👁️',cd:8000,  atk:400 },
    paladin:    { name:'Paladin',    icon:'⚜️', hp:180, speed:155, damage:28, range:90,  ability:'Holy Aura',     abilityIcon:'✨', cd:7000,  atk:800 },
    necromancer:{ name:'Necromancer',icon:'💀',  hp:90,  speed:195, damage:40, range:130, ability:'Raise Dead',    abilityIcon:'☠️', cd:9000,  atk:800 },
    berserker:  { name:'Berserker',  icon:'🪓',  hp:180, speed:195, damage:55, range:85,  ability:'Berserk Rage',  abilityIcon:'😤', cd:10000, atk:500 },
    ranger:     { name:'Ranger',     icon:'🌿',  hp:130, speed:245, damage:32, range:160, ability:'Wolf Pack',     abilityIcon:'🐺', cd:12000, atk:600 },
    // PREMIUM CLASSES
    druid:      { name:'Druid',      icon:'🌙',  hp:150, speed:215, damage:38, range:120, ability:'Nature Heal',   abilityIcon:'🌿', cd:6000,  atk:650 },
    assassin:   { name:'Assassin',   icon:'🥷',  hp:100, speed:310, damage:60, range:75,  ability:'Chain Strike',  abilityIcon:'⚡', cd:5000,  atk:350 },
    warlord:    { name:'Warlord',    icon:'👑',  hp:200, speed:170, damage:45, range:95,  ability:'Rally Army',    abilityIcon:'⚔️', cd:8000,  atk:750 },
    archmage:   { name:'Archmage',   icon:'🔮',  hp:70,  speed:185, damage:90, range:200, ability:'Meteor Strike', abilityIcon:'💥', cd:12000, atk:1000 }
};

// ================================
// MONSTER POOLS per mode
// PvP = EMPTY (fix 1)
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
var POOL_PVP = {}; // FIX 1: no mobs in pvp!
var POOL_SHADOW = {
    wraith:  { name:'👻 Wraith', color:0x8888ff,size:38,hp:55,speed:125,dmg:20,xp:42,score:32,gold:15 },
    vampire: { name:'🧛 Vampire',color:0xaa0044,size:42,hp:75,speed:88, dmg:28,xp:55,score:44,gold:20 },
    banshee: { name:'🌀 Banshee',color:0x00aaff,size:34,hp:38,speed:155,dmg:32,xp:48,score:36,gold:18 },
    lich:    { name:'☠️ Lich',   color:0x440088,size:50,hp:110,speed:58,dmg:38,xp:75,score:58,gold:28 }
};

// ================================
// BOSSES per mode (fix 2)
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
// GAME STATE
// ================================
var scene,player,cursors,wasd,shiftKey;
var enemies,potions,portals;
var minions=[],wolfPets=[];
var boss=null,bossHPBar,bossHPBg,bossTxt;
var bossSpawned=false;
var gameStarted=false;
var selectedClass='warrior',selectedMode='adventure';
var pClass; // player class def
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
var dim=0; // 0=normal,1=shadow
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
    gold: function(){tone(700,0.05,'sine');setTimeout(function(){tone(900,0.1,'sine');},60);}
};

// ================================
// SAFE DOM HELPER — fixes null error!
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

        // Others join
        playersRef.on('child_added',function(snap){
            var d=snap.val();if(!d||d.id===myId)return;
            addOtherPlayer(d);
            addMsg('System',d.name+' joined!','#ffff44');
            countOnline();
        });

        // FIX 3+7: sync health + dimension visibility
        playersRef.on('child_changed',function(snap){
            var d=snap.val();if(!d||d.id===myId)return;
            var op=otherPlayers[d.id];if(!op)return;
            op.tx=d.x; op.ty=d.y;
            op.dim=d.dim||0;
            // FIX 7: visibility = same dimension
            var vis=(d.dim||0)===dim;
            if(op.sprite) op.sprite.setVisible(vis);
            if(op.tag)    op.tag.setVisible(vis);
            if(op.hpBar)  op.hpBar.setVisible(vis);
            if(op.hpBg)   op.hpBg.setVisible(vis);
            // FIX 3: update their HP bar
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

        // FIX 6: receive PvP damage
        pvpRef.on('child_added',function(snap){
            var d=snap.val();if(!d||d.tid!==myId)return;
            if(!gameStarted||!player||!player.active)return;
            var now=Date.now();if(now-lastHit<500)return;lastHit=now;
            pH-=d.dmg; S.hit();
            if(scene)scene.cameras.main.shake(200,0.008);
            if(player){player.setTint(0xff0000);scene.time.delayedCall(200,function(){player.clearTint();});}
            updateHP(); float('-'+d.dmg+' ⚔️PvP',player.x,player.y-50,'#ff44ff');
            if(pH<=0){pH=0;updateHP();showGameOver();}
            snap.ref.remove();
        });

        // Tombstones — FIX 10: mode-tagged
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

// FIX 6: send real PvP damage
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

    pClass   = CLASSES[selectedClass];
    pMaxH    = pClass.hp;
    pH       = Math.max(10,Math.min(pH,pMaxH));
    pSpd     = pClass.speed;
    pDmg     = pClass.damage;
    pRange   = pClass.range;

    if(typeof pData!=='undefined') gold=pData.gold||0;

    // Set pool — FIX 1: PvP empty
    curPool = selectedMode==='adventure'?POOL_ADV : selectedMode==='survival'?POOL_SRV : selectedMode==='bossrush'?POOL_BRS : POOL_PVP;

    // Register safe touch callbacks
    window._doAttack  = function(){ doAtk(); };
    window._doAbility = function(){ doAbi(); };
    window._doPotion  = function(){ doPot(); };

    buildMap();
    makeTex('playerTex',skinColor);
    makeAllMonsterTex();
    makeOtherTex();
    makePotionTex();
    makeTombTex();
    makeExtraTex();

    createPlayer();
    enemies=scene.physics.add.group();
    potions=scene.physics.add.group();

    // FIX 5: portals only in adventure
    if(selectedMode==='adventure'){
        buildPortals();
        scene.physics.add.overlap(player,portals,onPortal,null,scene);
    }

    if(selectedMode==='adventure')     modeAdv();
    else if(selectedMode==='survival') modeSrv();
    else if(selectedMode==='bossrush') modeBRS();
    else if(selectedMode==='pvp')      modePvp();

    setupCam();
    setupKeys();
    buildUI();
    buildInv();
    if(selectedMode==='adventure')startDayNight();
    startSurvTimer();
    setupJoystick();
    connectServer();

    scene.physics.add.overlap(player,enemies,onEnemyHit,null,scene);
    scene.physics.add.overlap(player,potions,onPickPotion,null,scene);
    scene.cameras.main.setBackgroundColor(bgCol());

    // Set ability icons — with null checks
    var ai=el('abilityIcon');if(ai)ai.textContent=pClass.abilityIcon;
    var ai2=el('abilityIcon2');if(ai2)ai2.textContent=pClass.abilityIcon;
    gameStarted=true;
}

function bgCol(){
    var m={adventure:'#1a5c1a',survival:'#3d1a00',bossrush:'#0d0011',pvp:'#1a1a22'};
    return m[selectedMode]||'#1a5c1a';
}

// ================================
// BUILD MAP — FIX 2: genuinely different layouts
// ================================
function buildMap(){
    if(selectedMode==='adventure')     buildForest();
    else if(selectedMode==='survival') buildLava();
    else if(selectedMode==='bossrush') buildDungeon();
    else if(selectedMode==='pvp')      buildArena();

    // FIX 5: shadow realm only in adventure
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
}

// ADVENTURE: Forest with river, cross path, campfires, cave
function buildForest(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){
        var c=(x===14||(y===14&&x>4&&x<24))?0x8B6914:((x+y)%2===0?0x2d8a2d:0x267326);
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,c));
    }
    // River (right side, flowing down)
    for(var i=0;i<mH;i++){
        var rx=20+Math.floor(i*0.3); if(rx<mW){
            var rv=scene.add.rectangle(rx*tSz+tSz/2,i*tSz+tSz/2,tSz*2,tSz,0x1155aa);
            scene.tweens.add({targets:rv,fillColor:0x2266cc,duration:1200+Math.random()*400,yoyo:true,repeat:-1});
            normalTiles.push(rv);
        }
    }
    // Tree clusters
    [{x:1,y:1},{x:2,y:1},{x:3,y:2},{x:4,y:1},{x:5,y:2},{x:1,y:3},{x:22,y:1},{x:23,y:2},{x:24,y:1},{x:25,y:2},{x:1,y:13},{x:2,y:14},{x:25,y:12},{x:26,y:14},{x:9,y:20},{x:10,y:21},{x:11,y:19}].forEach(function(p){
        var tx=p.x*tSz+tSz/2,ty=p.y*tSz+tSz/2;
        normalTiles.push(scene.add.rectangle(tx,ty,14,28,0x6B3A2A));
        normalTiles.push(scene.add.circle(tx,ty-14,24,0x1a6e1a));
        normalTiles.push(scene.add.circle(tx-7,ty-20,16,0x228822));
    });
    // Campfires
    [{x:8,y:8},{x:18,y:6}].forEach(function(p){
        var fx=p.x*tSz+tSz/2,fy=p.y*tSz+tSz/2;
        scene.add.rectangle(fx,fy+4,22,8,0x6B3A2A);
        var f1=scene.add.triangle(fx,fy-16,-8,8,8,8,0,-12,0xff4400);
        var f2=scene.add.triangle(fx-5,fy-10,-5,6,5,6,0,-8,0xff8800);
        scene.tweens.add({targets:[f1,f2],scaleX:0.85,scaleY:1.15,duration:160,yoyo:true,repeat:-1});
    });
    // Cave
    for(var i=0;i<3;i++) for(var j=0;j<2;j++)
        normalTiles.push(scene.add.rectangle((1+i)*tSz+tSz/2,(24+j)*tSz+tSz/2,tSz-1,tSz-1,0x222222));
    scene.add.text(2*tSz,24*tSz,'🏔️ Cave',{fontSize:'12px',fill:'#777',stroke:'#000',strokeThickness:2});
}

// SURVIVAL: Lava fortress with moat, platforms
function buildLava(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++)
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x8B3000:0x6B2200));
    // Lava moat at edges
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++){
        if(x<2||x>mW-3||y<2||y>mH-3){
            var lv=scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0xff3300);
            scene.tweens.add({targets:lv,fillColor:0xff6600,duration:600+Math.random()*400,yoyo:true,repeat:-1});
            normalTiles.push(lv);
        }
    }
    // Stone platforms
    [{x:5,y:5,w:4,h:4},{x:14,y:3,w:5,h:3},{x:20,y:6,w:4,h:4},{x:5,y:18,w:5,h:4},{x:18,y:17,w:4,h:5}].forEach(function(pl){
        for(var px=pl.x;px<pl.x+pl.w;px++) for(var py=pl.y;py<pl.y+pl.h;py++)
            normalTiles.push(scene.add.rectangle(px*tSz+tSz/2,py*tSz+tSz/2,tSz-1,tSz-1,0xcc6600));
    });
    // Lava pools
    for(var i=0;i<4;i++){
        var lp=scene.add.ellipse(Phaser.Math.Between(8,20)*tSz,Phaser.Math.Between(8,20)*tSz,80+Math.random()*50,50+Math.random()*30,0xff3300);
        scene.tweens.add({targets:lp,fillColor:0xff6600,scaleX:1.05,duration:800,yoyo:true,repeat:-1});
    }
    // Geysers
    for(var i=0;i<5;i++){
        var gv=scene.add.rectangle(Phaser.Math.Between(4,23)*tSz,Phaser.Math.Between(4,23)*tSz,8,36,0xff6600);
        scene.tweens.add({targets:gv,scaleY:1.8,alpha:0.3,duration:700+Math.random()*400,yoyo:true,repeat:-1});
    }
}

// BOSS RUSH: Dungeon rooms connected by corridors
function buildDungeon(){
    // Walls everywhere
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++)
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,0x111122));
    // Rooms
    [{x:1,y:1,w:8,h:7},{x:12,y:1,w:8,h:7},{x:1,y:13,w:8,h:7},{x:12,y:13,w:8,h:7},{x:6,y:6,w:10,h:8}].forEach(function(r,ri){
        var cols=[0x222233,0x1a1a2e,0x22223a,0x1e1e30,0x2a2a40];
        for(var rx=r.x;rx<r.x+r.w;rx++) for(var ry=r.y;ry<r.y+r.h;ry++)
            normalTiles.push(scene.add.rectangle(rx*tSz+tSz/2,ry*tSz+tSz/2,tSz-1,tSz-1,cols[ri%5]));
        scene.add.text((r.x+1)*tSz,(r.y+1)*tSz,ri===4?'⚔️ Boss Chamber':'Room '+(ri+1),{fontSize:'11px',fill:'#445',stroke:'#000',strokeThickness:1});
    });
    // Corridors
    for(var i=8;i<13;i++) normalTiles.push(scene.add.rectangle(i*tSz+tSz/2,4*tSz+tSz/2,tSz-1,tSz,0x1c1c2e));
    for(var i=8;i<13;i++) normalTiles.push(scene.add.rectangle(i*tSz+tSz/2,14*tSz+tSz/2,tSz-1,tSz,0x1c1c2e));
    for(var i=8;i<14;i++) normalTiles.push(scene.add.rectangle(4*tSz+tSz/2,i*tSz+tSz/2,tSz,tSz-1,0x1c1c2e));
    for(var i=8;i<14;i++) normalTiles.push(scene.add.rectangle(20*tSz+tSz/2,i*tSz+tSz/2,tSz,tSz-1,0x1c1c2e));
    // Pillars + purple torches
    [{x:2,y:2},{x:8,y:2},{x:2,y:8},{x:8,y:8},{x:13,y:2},{x:19,y:2},{x:2,y:14},{x:8,y:14},{x:13,y:14},{x:19,y:14}].forEach(function(p){
        scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,20,56,0x222233);
    });
    for(var i=0;i<10;i++){
        var tf=scene.add.circle(Phaser.Math.Between(2,25)*tSz,Phaser.Math.Between(2,25)*tSz,10,0xaa00ff,0.8);
        scene.tweens.add({targets:tf,radius:14,alpha:0.4,duration:280+Math.random()*200,yoyo:true,repeat:-1});
    }
}

// ARENA: Circular colosseum, sand center, spectator stands
function buildArena(){
    for(var x=0;x<mW;x++) for(var y=0;y<mH;y++)
        normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x<3||x>mW-4||y<3||y>mH-4)?0x222222:0x333333));
    // Sand circle center
    var cx=mW/2*tSz,cy=mH/2*tSz,r=8*tSz;
    for(var x=4;x<mW-4;x++) for(var y=4;y<mH-4;y++){
        var dx=(x*tSz+tSz/2)-cx,dy=(y*tSz+tSz/2)-cy;
        if(Math.sqrt(dx*dx+dy*dy)<r)
            normalTiles.push(scene.add.rectangle(x*tSz+tSz/2,y*tSz+tSz/2,tSz-1,tSz-1,(x+y)%2===0?0x998855:0x887744));
    }
    // Corner towers
    [{x:3,y:3},{x:24,y:3},{x:3,y:24},{x:24,y:24}].forEach(function(p){
        scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,40,72,0x888888);
        scene.add.rectangle(p.x*tSz+tSz/2,p.y*tSz+tSz/2,48,18,0x999999);
        var flame=scene.add.circle(p.x*tSz+tSz/2,p.y*tSz+tSz/2-46,9,0xffaa00);
        scene.tweens.add({targets:flame,radius:13,alpha:0.5,duration:280,yoyo:true,repeat:-1});
    });
    scene.add.text(cx,cy-r-20,'⚔️ PvP ARENA ⚔️',{fontSize:'16px',fill:'#ffaa00',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
}

// ================================
// TEXTURES — NO fillArc anywhere!
// ================================
function makeTex(name,color){
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color); g.fillRoundedRect(4,12,32,28,4);
    g.fillStyle(0xffddaa); g.fillCircle(20,9,12); // fillCircle only!
    g.fillStyle(0x000000); g.fillCircle(15,8,3); g.fillCircle(25,8,3);
    g.fillStyle(0xffffff,0.25); g.fillRect(8,16,24,5);
    g.generateTexture(name,44,44); g.destroy();
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
}

function createPlayer(){
    player=scene.physics.add.image(mW/2*tSz,mH/2*tSz,'playerTex');
    scene.physics.world.setBounds(0,0,mW*tSz,mH*tSz);
    player.setCollideWorldBounds(true);
    atkIndicator=scene.add.circle(player.x,player.y,pRange,0xffffff,0).setStrokeStyle(1,0xffffff,0.12).setDepth(8);
}

// ================================
// PORTALS — FIX 4: return portal hidden until in shadow
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
    // FIX 4: show return portal now
    if(returnPortBody)returnPortBody.active=true;
    if(returnPortLabel)returnPortLabel.setVisible(true);
    updateOtherVis(); checkQ('dimension',{});
    if(myRef)myRef.update({dim:1});
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
    // FIX 4: hide return portal again
    if(returnPortBody)returnPortBody.active=false;
    if(returnPortLabel)returnPortLabel.setVisible(false);
    updateOtherVis();
    if(myRef)myRef.update({dim:0});
}

// FIX 7: show/hide others by dimension
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
// FIX 1: PvP = no mobs!
function modePvp(){
    addMsg('System','⚔️ PvP! Attack other players!','#ff88ff');
    float('⚔️ PvP Arena!',player.x-100,player.y-80,'#ff88ff');
}

// ================================
// SPAWN ENEMIES
// ================================
function spawnInitial(){
    if(selectedMode==='pvp')return; // FIX 1
    var ks=Object.keys(curPool);if(!ks.length)return;
    for(var i=0;i<12;i++)spawnEnemy(ks[Math.floor(Math.random()*ks.length)],curPool);
}
function spawnEnemy(type,pool){
    pool=pool||curPool;
    if(!pool||!Object.keys(pool).length)return; // FIX 1: safety
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
    scene.input.keyboard.on('keydown-E',    function(){if(!chatOpen)doAbi();});
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
// ATTACK
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
    // FIX 6: PvP real damage
    if(selectedMode==='pvp'){
        Object.entries(otherPlayers).forEach(function(kv){
            var opId=kv[0],op=kv[1];
            if(!op||!op.sprite||!op.sprite.active)return;
            if(Phaser.Math.Distance.Between(player.x,player.y,op.sprite.x,op.sprite.y)<=pRange){
                var dmg=Math.floor(pDmg*(Math.random()<0.3?2:1));
                pvpHit(opId,dmg);
                float('⚔️ -'+dmg,op.sprite.x,op.sprite.y-40,'#ff44ff');
            }
        });
    }
    if(!hit&&!(boss&&boss.active))float('miss',player.x+playerFacing*30,player.y-20,'#444');
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
    if(selectedMode!=='pvp')spawnPotion(e.x,e.y,false);
    var mt=e.mtype||'goblin';
    if(!questStats.kills[mt])questStats.kills[mt]=0;questStats.kills[mt]++;
    checkQ('kill',{m:mt});checkQ('score',{});
    if(e.hpBar)e.hpBar.destroy();if(e.tag)e.tag.destroy();
    var ws=(e.pool===POOL_SHADOW),pool2=e.pool;e.destroy();
    if(selectedMode==='survival'){onWaveKill();return;}
    setTimeout(function(){
        if(!gameStarted)return;
        if(selectedMode==='adventure')spawnEnemy(null,ws?POOL_SHADOW:POOL_ADV);
        else if(selectedMode==='bossrush')spawnEnemy(null,POOL_BRS);
    },4000);
}

// ================================
// BOSS
// ================================
function spawnBoss(mode){
    if(bossSpawned)return;bossSpawned=true;S.boss();
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
    float('⚠️ '+bd.name+'!',player.x-130,player.y-100,'#ff4444');
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
    particles(boss.x,boss.y,0xff0000,30);particles(boss.x,boss.y,0xffff00,22);
    gainXP(boss.xp||400);score+=600*pLv;if(scoreTxt)scoreTxt.setText('Score: '+score);
    earnGold(boss.gold||150);
    for(var i=0;i<4;i++)spawnPotion(boss.x+Phaser.Math.Between(-80,80),boss.y+Phaser.Math.Between(-80,80),true);
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossTxt)bossTxt.destroy();
    boss.destroy();boss=null;bossSpawned=false;
    questStats.bossKills++;checkQ('boss',{});
    float('🏆 BOSS DEFEATED!',player.x-120,player.y-90,'#ffff00');
    addMsg('System','🏆 Boss defeated!','#ffff00');
    if(selectedMode==='bossrush')setTimeout(function(){if(gameStarted)nextRush();},3000);
    else scene.time.addEvent({delay:180000,callback:function(){if(gameStarted)spawnBoss(selectedMode==='survival'?'srv':'adv');}});
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
// ABILITIES
// ================================
function doAbi(){
    var now=Date.now();
    if(now-lastAbi<pClass.cd){ float('⏳ '+Math.ceil((pClass.cd-(now-lastAbi))/1000)+'s',player.x,player.y-60,'#888'); return; }
    lastAbi=now; S.abi();
    var btn=el('abilityBtn');if(btn){btn.classList.remove('ready');btn.classList.add('cooldown');setTimeout(function(){btn.classList.remove('cooldown');btn.classList.add('ready');},pClass.cd);}
    var c=selectedClass;
    if(c==='warrior')     abiWarrior();
    else if(c==='archer') abiArcher();
    else if(c==='mage')   abiMage();
    else if(c==='rogue')  abiRogue();
    else if(c==='paladin')    abiPaladin();
    else if(c==='necromancer')abiNecro();
    else if(c==='berserker')  abiBerserk();
    else if(c==='ranger')     abiRanger();
    else if(c==='druid')      abiDruid();
    else if(c==='assassin')   abiAssassin();
    else if(c==='warlord')    abiWarlord();
    else if(c==='archmage')   abiArchmage();
}
function abiWarrior(){ float('🛡️ SHIELD BASH!',player.x-60,player.y-70,'#ff8888');particles(player.x,player.y,0xff6666,16);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<160){var prev=e.speed;e.speed=0;e.setTint(0xffff00);e.hp-=pDmg*2.5;scene.time.delayedCall(2500,function(){if(e&&e.active){e.speed=prev;e.clearTint();}});if(e.hp<=0)killEnemy(e);}}); }
function abiArcher(){ float('🏹 ARROW RAIN!',player.x-60,player.y-70,'#88ff88');for(var i=0;i<16;i++){(function(a){var arr=scene.add.rectangle(player.x,player.y,22,5,0x88ff44).setRotation(a).setDepth(10);scene.tweens.add({targets:arr,x:player.x+Math.cos(a)*280,y:player.y+Math.sin(a)*280,alpha:0,duration:450,onComplete:function(){arr.destroy();}});enemies.getChildren().forEach(function(e){var ex=e.x-player.x,ey=e.y-player.y,d=Math.sqrt(ex*ex+ey*ey);if(d<280&&Math.abs(Math.atan2(ey,ex)-a)<0.25){e.hp-=pDmg;if(e.hp<=0)killEnemy(e);}});})(i/16*Math.PI*2);} }
function abiMage(){ float('🔥 FIREBALL!',player.x-50,player.y-70,'#8888ff');particles(player.x,player.y,0xff4400,28);scene.cameras.main.shake(500,0.02);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<270){e.hp-=pDmg*3.5;if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<270){boss.hp-=pDmg*3.5;updateBossHP();if(boss.hp<=0)killBoss();} }
function abiRogue(){ float('👁️ VANISH!',player.x-40,player.y-70,'#ffaa44');invisible=true;player.setAlpha(0.15);pSpd*=2;scene.time.delayedCall(3000,function(){invisible=false;player.setAlpha(1);pSpd/=2;float('👁️ Visible!',player.x-40,player.y-60,'#ffaa44');}); }
function abiPaladin(){ float('✨ HOLY AURA!',player.x-60,player.y-70,'#ffddaa');var heal=Math.floor(pMaxH*0.35);pH=Math.min(pH+heal,pMaxH);updateHP();for(var i=0;i<20;i++){(function(a){var s=scene.add.circle(player.x+Math.cos(a)*80,player.y+Math.sin(a)*80,6,0xffff88).setDepth(15);scene.tweens.add({targets:s,x:player.x,y:player.y,alpha:0,duration:600,onComplete:function(){s.destroy();}});})(i/20*Math.PI*2);}enemies.getChildren().forEach(function(e){if(['skeleton','boneknight'].indexOf(e.mtype)!==-1&&Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<200){e.hp-=pDmg*4;if(e.hp<=0)killEnemy(e);}});float('+'+heal+' HP!',player.x,player.y-90,'#ffff44'); }
function abiNecro(){ float('☠️ RAISE DEAD!',player.x-60,player.y-70,'#88ff88');for(var i=0;i<3;i++){(function(a){var mx=player.x+Math.cos(a)*60,my=player.y+Math.sin(a)*60;var mn=scene.physics.add.image(mx,my,'minionTex');mn.speed=130;minions.push(mn);mn.lbl=scene.add.text(mx,my-28,'☠️',{fontSize:'14px'}).setOrigin(0.5);scene.physics.add.overlap(mn,enemies,function(m,e){if(!e||!e.active)return;e.hp-=15;if(e.hp<=0)killEnemy(e);});scene.time.delayedCall(15000,function(){if(mn&&mn.active){if(mn.lbl)mn.lbl.destroy();mn.destroy();minions=minions.filter(function(m){return m!==mn;});}});})(i/3*Math.PI*2);} }
function abiBerserk(){ float('😤 BERSERK!',player.x-50,player.y-70,'#ff4444');berserking=true;pSpd*=1.6;pDmg=Math.floor(pDmg*2.5);player.setTint(0xff2200);scene.cameras.main.shake(300,0.015);scene.time.delayedCall(8000,function(){berserking=false;pSpd/=1.6;pDmg=Math.floor(pDmg/2.5);player.clearTint();float('😤 Rage ended',player.x-50,player.y-60,'#888');}); }
function abiRanger(){ float('🐺 WOLF PACK!',player.x-50,player.y-70,'#44ffaa');for(var i=0;i<2;i++){(function(){var wx=player.x+Phaser.Math.Between(-60,60),wy=player.y+Phaser.Math.Between(-60,60);var wf=scene.physics.add.image(wx,wy,'wolfTex');wf.speed=200;wolfPets.push(wf);wf.lbl=scene.add.text(wx,wy-28,'🐺',{fontSize:'14px'}).setOrigin(0.5);scene.physics.add.overlap(wf,enemies,function(w,e){if(!e||!e.active)return;var now=Date.now();if(!w.lb||now-w.lb>800){w.lb=now;e.hp-=20+pLv*3;if(e.hp<=0)killEnemy(e);}});scene.time.delayedCall(18000,function(){if(wf&&wf.active){if(wf.lbl)wf.lbl.destroy();wf.destroy();wolfPets=wolfPets.filter(function(w){return w!==wf;});}});})()} }
// PREMIUM class abilities
function abiDruid(){ float('🌿 NATURE HEAL!',player.x-70,player.y-70,'#aaffcc');var heal=Math.floor(pMaxH*0.5);pH=Math.min(pH+heal,pMaxH);updateHP();for(var i=0;i<12;i++){(function(a){var leaf=scene.add.circle(player.x+Math.cos(a)*60,player.y+Math.sin(a)*60,7,0x44ff88).setDepth(15);scene.tweens.add({targets:leaf,x:player.x,y:player.y,alpha:0,duration:800,onComplete:function(){leaf.destroy();}});})(i/12*Math.PI*2);}float('+'+heal+' HP!',player.x,player.y-90,'#44ff44'); }
function abiAssassin(){ float('⚡ CHAIN STRIKE!',player.x-70,player.y-70,'#ff6688');var targets=[];enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<300)targets.push(e);});targets.sort(function(a,b){return Phaser.Math.Distance.Between(player.x,player.y,a.x,a.y)-Phaser.Math.Distance.Between(player.x,player.y,b.x,b.y);});targets.slice(0,5).forEach(function(e,i){setTimeout(function(){if(!e||!e.active)return;var dmg=Math.floor(pDmg*2*Math.pow(0.8,i));e.hp-=dmg;float('⚡ '+dmg,e.x,e.y-40,'#ff6688');if(e.hp<=0)killEnemy(e);},i*100);}); }
function abiWarlord(){ float('👑 RALLY ARMY!',player.x-70,player.y-70,'#ffcc44');for(var i=0;i<4;i++){(function(a){var sx=player.x+Math.cos(a)*80,sy=player.y+Math.sin(a)*80;var sol=scene.physics.add.image(sx,sy,'minionTex').setTint(0xffcc44);sol.speed=160;minions.push(sol);sol.lbl=scene.add.text(sx,sy-28,'⚔️',{fontSize:'12px'}).setOrigin(0.5);scene.physics.add.overlap(sol,enemies,function(m,e){if(!e||!e.active)return;e.hp-=pDmg*0.8;if(e.hp<=0)killEnemy(e);});scene.time.delayedCall(20000,function(){if(sol&&sol.active){if(sol.lbl)sol.lbl.destroy();sol.destroy();minions=minions.filter(function(m){return m!==sol;});}});})(i/4*Math.PI*2);} }
function abiArchmage(){ float('💥 METEOR STRIKE!',player.x-80,player.y-70,'#cc88ff');particles(player.x,player.y,0xff4400,40);particles(player.x,player.y,0xcc88ff,30);scene.cameras.main.shake(800,0.035);enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<400){e.hp-=pDmg*6;if(e.hp<=0)killEnemy(e);}});if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<400){boss.hp-=pDmg*6;updateBossHP();if(boss.hp<=0)killBoss();} }

// ================================
// XP + LEVEL
// ================================
function gainXP(amount){ pXP+=amount;float('+'+amount+' XP',player.x,player.y-70,'#ffff44');if(pXP>=xpNext)levelUp();if(xpBar)xpBar.width=202*(pXP/xpNext);if(xpText)xpText.setText('XP: '+pXP+'/'+xpNext); }
function levelUp(){ pXP-=xpNext;pLv++;xpNext=pLv*100;pMaxH+=20;pH=pMaxH;pSpd+=5;pDmg+=5;S.lvup();scene.tweens.add({targets:player,scaleX:1.5,scaleY:1.5,duration:200,yoyo:true,repeat:2});player.setTint(0xffff00);scene.time.delayedCall(800,function(){if(!berserking)player.clearTint();});if(lvTxt)lvTxt.setText('⭐ Lv.'+pLv);if(nameTxt)nameTxt.setText(pClass.icon+' '+pName+' Lv.'+pLv);updateHP();checkQ('level',{});float('🌟 LEVEL UP! '+pLv,player.x-70,player.y-90,'#ffff00');doSave(); }

// ================================
// DAY/NIGHT
// ================================
function startDayNight(){ timeTxt=scene.add.text(640,15,'☀️ Day',{fontSize:'14px',fill:'#ffff88'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(10);scene.time.addEvent({delay:35000,loop:true,callback:function(){dayTime=dayTime===0?1:0;if(dayTime===1){timeTxt.setText('🌙 Night');scene.tweens.add({targets:nightOverlay,alpha:0.5,duration:3000});enemies.getChildren().forEach(function(e){e.speed*=1.25;});float('🌙 Night!',player.x-50,player.y-80,'#aaaaff');}else{timeTxt.setText('☀️ Day');scene.tweens.add({targets:nightOverlay,alpha:0,duration:3000});enemies.getChildren().forEach(function(e){e.speed/=1.25;});float('☀️ Day!',player.x-30,player.y-80,'#ffff88');}}}); }

// ================================
// SURVIVE TIMER
// ================================
function startSurvTimer(){ scene.time.addEvent({delay:1000,loop:true,callback:function(){if(!gameStarted||!player||!player.active)return;survTimer++;checkQ('survive',{});if(survTimer%5===0&&pH<pMaxH){pH=Math.min(pH+1,pMaxH);updateHP();}}}); }

// ================================
// TOMBSTONE — FIX 10: 5 sec, mode-tagged
// ================================
function spawnTombstone(x,y){
    addTombVis(x,y,pName,pLv,'#cccccc');
    if(tombsRef&&myId){
        var ref=tombsRef.push({x:x,y:y,name:pClass.icon+' '+pName,level:pLv,mode:selectedMode,sid:myId,t:Date.now()});
        // FIX 10: auto-delete after 5 seconds
        setTimeout(function(){if(ref)ref.remove();},5000);
    }
}
function addTombVis(x,y,name,level,color){
    if(!scene)return;
    var stone=scene.add.image(x,y,'tombTex').setDepth(7);
    var lbl=scene.add.text(x,y-34,'💀 '+name+'\nLv.'+level,{fontSize:'10px',fill:color||'#ccc',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(7);
    tombs.push({stone:stone,lbl:lbl});
    // FIX 10: disappear after 5 seconds
    setTimeout(function(){
        if(!scene)return;
        scene.tweens.add({targets:[stone,lbl],alpha:0,duration:1500,onComplete:function(){if(stone&&stone.active)stone.destroy();if(lbl&&lbl.active)lbl.destroy();}});
    },5000);
}

// ================================
// SAVE — popup with null check
// ================================
function doSave(){
    saveGame();S.save();
    // All null-checked!
    var notif=el('saveNotif'); var ntxt=el('saveText');
    if(ntxt)ntxt.textContent='✅ Saved! Lv.'+pLv+'  💰'+gold+'  Score:'+score;
    if(notif){notif.style.display='block';notif.style.opacity='1';setTimeout(function(){notif.style.transition='opacity 0.6s';notif.style.opacity='0';setTimeout(function(){if(notif)notif.style.display='none';},700);},2500);}
    float('💾 Saved!',player.x,player.y-60,'#00ffff');
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
    if(!isMobile)scene.add.text(16,696,'WASD:Move  SHIFT:Sprint  SPACE:Attack  E:'+pClass.ability+'  F:Potion  I:Bag  T:Chat  ENTER:Save',{fontSize:'10px',fill:'#88aa88'}).setScrollFactor(0).setDepth(10);
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
    var bgM={adventure:'#1a4a1a',survival:'#3d1500',bossrush:'#0d0011',pvp:'#1a1a22'};
    ctx.fillStyle=inShadow?'#110022':(bgM[selectedMode]||'#1a4a1a');ctx.fillRect(0,0,130,130);
    enemies.getChildren().forEach(function(e){ctx.fillStyle='#ff4444';ctx.fillRect(e.x*sx-2,e.y*sy-2,4,4);});
    if(boss&&boss.active){ctx.fillStyle='#ff0000';ctx.fillRect(boss.x*sx-5,boss.y*sy-5,10,10);}
    // FIX 7: only minimap dots in same dimension
    Object.values(otherPlayers).forEach(function(op){if(op.dim!==dim)return;ctx.fillStyle='#cc88ff';ctx.fillRect(op.sprite.x*sx-2,op.sprite.y*sy-2,5,5);});
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
    localStorage.setItem('rpgSave',JSON.stringify({pLv:pLv,pXP:pXP,pH:pH,pMaxH:pMaxH,pSpd:pSpd,pDmg:pDmg,xpNext:xpNext,score:score,inv:inv,pName:pName,cls:selectedClass,qStats:questStats}));
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
            var mLabels={adventure:'🌲 Adventure',survival:'🔥 Survival — Wave '+wave,bossrush:'💀 Boss Rush — Boss #'+rushIdx,pvp:'⚔️ PvP'};
            var ov=document.createElement('div');
            ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s ease;font-family:Arial,sans-serif;color:#fff;';
            ov.innerHTML='<div style="text-align:center;max-width:540px;padding:32px;"><div style="font-size:84px;margin-bottom:10px;">💀</div><h1 style="font-size:52px;color:#ff2222;letter-spacing:6px;text-shadow:0 0 40px #f00;margin-bottom:5px;">GAME OVER</h1><p style="font-size:14px;color:#ffaa00;margin-bottom:3px;">'+mLabels[selectedMode]+'</p><p style="font-size:17px;color:#888;margin-bottom:3px;">'+(pClass?pClass.icon:'')+' <b>'+pName+'</b> — Level '+pLv+'</p><p style="font-size:22px;color:#ffdd44;margin-bottom:5px;">Score: '+score+'</p><p style="font-size:15px;color:#ffaa00;margin-bottom:22px;">💰 '+gold+' Gold earned</p><div style="display:flex;gap:12px;justify-content:center;"><button id="rBtn" style="padding:11px 30px;font-size:15px;background:linear-gradient(135deg,#aa0000,#dd2222);color:#fff;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Arial;">⚔️ Play Again</button><button id="mBtn" style="padding:11px 30px;font-size:15px;background:#1a1a1a;color:#fff;border:2px solid #444;border-radius:10px;cursor:pointer;font-family:Arial;">🏠 Menu</button></div><p style="margin-top:12px;font-size:11px;color:#333;">Press R to restart</p></div>';
            document.body.appendChild(ov);setTimeout(function(){ov.style.opacity='1';},50);
            function restart(){
                ov.style.opacity='0';setTimeout(function(){if(ov.parentNode)document.body.removeChild(ov);},1000);
                pH=100;pMaxH=100;pXP=0;pLv=1;pSpd=200;pDmg=20;xpNext=100;score=0;
                inv=[];bossSpawned=false;dim=0;survTimer=0;minions=[];wolfPets=[];berserking=false;invisible=false;inShadow=false;wave=0;rushIdx=0;normalTiles=[];shadowTiles=[];tombs=[];
                gameStarted=false;window.gameStarted=false;
                localStorage.removeItem('rpgSave');
                scene.cameras.main.fadeIn(100);scene.scene.restart();
                setTimeout(function(){
                    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
                    var mm=document.getElementById('mainMenu');if(mm)mm.classList.add('active');
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
    sendPos();

    // SMOOTH MULTIPLAYER — lerp
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

    if(boss&&boss.active){var bdx=player.x-boss.x,bdy=player.y-boss.y,bd=Math.sqrt(bdx*bdx+bdy*bdy);if(bd>0){boss.setVelocityX(bdx/bd*boss.speed);boss.setVelocityY(bdy/bd*boss.speed);}boss.rotation+=0.015;}

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
}
