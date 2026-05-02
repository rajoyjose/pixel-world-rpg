// ================================
// PIXEL WORLD RPG — Complete Fix
// All 13 problems addressed!
// ================================

var isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#1a8f2d',
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    input: { touch: true, activePointers: 4 },
    scene: { preload: preload, create: create, update: update }
};
var game = new Phaser.Game(config);

// ================================
// CLASSES
// ================================
var CLASSES = {
    warrior:     { name:'Warrior',     icon:'⚔️',  hp:220, speed:155, damage:35, attackRange:80,  ability:'Shield Bash', abilityIcon:'🛡️', abilityCooldown:5000,  attackCooldown:700 },
    archer:      { name:'Archer',      icon:'🏹',  hp:110, speed:285, damage:28, attackRange:200, ability:'Arrow Rain',  abilityIcon:'🏹', abilityCooldown:4000,  attackCooldown:500 },
    mage:        { name:'Mage',        icon:'🧙',  hp:80,  speed:200, damage:70, attackRange:150, ability:'Fireball',    abilityIcon:'🔥', abilityCooldown:6000,  attackCooldown:900 },
    rogue:       { name:'Rogue',       icon:'🗡️', hp:110, speed:265, damage:50, attackRange:70,  ability:'Vanish',      abilityIcon:'👁️',abilityCooldown:8000,  attackCooldown:400 },
    paladin:     { name:'Paladin',     icon:'⚜️', hp:180, speed:155, damage:28, attackRange:90,  ability:'Holy Aura',   abilityIcon:'✨', abilityCooldown:7000,  attackCooldown:800 },
    necromancer: { name:'Necromancer', icon:'💀',  hp:90,  speed:195, damage:40, attackRange:130, ability:'Raise Dead',  abilityIcon:'☠️', abilityCooldown:9000,  attackCooldown:800 },
    berserker:   { name:'Berserker',   icon:'🪓',  hp:180, speed:195, damage:55, attackRange:85,  ability:'Berserk Rage',abilityIcon:'😤', abilityCooldown:10000, attackCooldown:500 },
    ranger:      { name:'Ranger',      icon:'🌿',  hp:130, speed:245, damage:32, attackRange:160, ability:'Wolf Pack',   abilityIcon:'🐺', abilityCooldown:12000, attackCooldown:600 }
};

// ================================
// MONSTER POOLS per mode
// FIX 1: PvP has NO monster pool!
// ================================
var POOL_ADVENTURE = {
    goblin:   { name:'👹 Goblin',   color:0xff4444, size:36, hp:30,  speed:80,  damage:8,  xp:20, score:10, gold:5  },
    troll:    { name:'👺 Troll',    color:0x44aa44, size:58, hp:90,  speed:45,  damage:22, xp:45, score:28, gold:15 },
    skeleton: { name:'💀 Skeleton', color:0xcccccc, size:36, hp:40,  speed:115, damage:14, xp:30, score:20, gold:8  },
    demon:    { name:'😈 Demon',    color:0xaa00ff, size:44, hp:65,  speed:95,  damage:26, xp:55, score:38, gold:20 },
    orc:      { name:'🗡️ Orc',     color:0x886600, size:50, hp:70,  speed:65,  damage:18, xp:38, score:25, gold:12 }
};
var POOL_SURVIVAL = {
    firesprite: { name:'🔥 Fire Sprite', color:0xff6600, size:34, hp:35, speed:100, damage:12, xp:25, score:15, gold:6  },
    sandworm:   { name:'🐛 Sand Worm',   color:0xaa7700, size:52, hp:80, speed:50,  damage:20, xp:40, score:26, gold:14 },
    lavabeast:  { name:'🌋 Lava Beast',  color:0xff2200, size:46, hp:70, speed:70,  damage:28, xp:50, score:34, gold:18 },
    scorpion:   { name:'🦂 Scorpion',    color:0xcc8800, size:38, hp:45, speed:110, damage:18, xp:35, score:22, gold:10 }
};
var POOL_BOSSRUSH = {
    darkspirit: { name:'👻 Dark Spirit', color:0x6600aa, size:38, hp:50, speed:120, damage:20, xp:38, score:28, gold:12 },
    boneknight: { name:'⚔️ Bone Knight', color:0xbbbbbb, size:44, hp:85, speed:60,  damage:25, xp:48, score:32, gold:16 },
    voidcreep:  { name:'🌑 Void Creep',  color:0x110033, size:40, hp:55, speed:105, damage:22, xp:42, score:30, gold:14 }
};
// FIX 1: PvP = empty pool (no mobs!)
var POOL_PVP = {};

// Shadow realm monsters (adventure only)
var POOL_SHADOW = {
    wraith:  { name:'👻 Wraith',  color:0x8888ff, size:38, hp:55, speed:125, damage:20, xp:42, score:32, gold:15 },
    vampire: { name:'🧛 Vampire', color:0xaa0044, size:42, hp:75, speed:88,  damage:28, xp:55, score:44, gold:20 },
    banshee: { name:'🌀 Banshee', color:0x00aaff, size:34, hp:38, speed:155, damage:32, xp:48, score:36, gold:18 },
    lich:    { name:'☠️ Lich',    color:0x440088, size:50, hp:110,speed:58,  damage:38, xp:75, score:58, gold:28 }
};

// ================================
// BOSS DEFINITIONS
// ================================
var BOSS_ADVENTURE = { name:'🐉 Dragon King',  bodyColor:0x660000, eyeColor:0xff0000, mouthColor:0xffff00, barColor:0xff0000, hp:600, speed:55, xp:400, score:600, gold:200 };
var BOSS_SURVIVAL  = { name:'🌋 Lava Titan',   bodyColor:0xff4400, eyeColor:0xffff00, mouthColor:0xff8800, barColor:0xff6600, hp:400, speed:45, xp:300, score:400, gold:150 };
var BOSS_RUSH_LIST = [
    { name:'👻 Shadow Wraith', bodyColor:0x220044, eyeColor:0xaa00ff, mouthColor:0x8800ff, barColor:0xaa00ff, hp:300, speed:90,  xp:200, score:300, gold:100 },
    { name:'🧊 Frost Giant',   bodyColor:0x003366, eyeColor:0x00ffff, mouthColor:0x0088ff, barColor:0x00ffff, hp:450, speed:50,  xp:280, score:400, gold:140 },
    { name:'⚡ Storm Lord',    bodyColor:0x443300, eyeColor:0xffff00, mouthColor:0xffaa00, barColor:0xffff00, hp:550, speed:80,  xp:350, score:500, gold:180 },
    { name:'🌑 Void Master',   bodyColor:0x000022, eyeColor:0xff00ff, mouthColor:0xaa00aa, barColor:0xff00ff, hp:650, speed:70,  xp:420, score:600, gold:220 },
    { name:'💀 Death Emperor', bodyColor:0x220000, eyeColor:0xff0000, mouthColor:0x880000, barColor:0xff0000, hp:800, speed:65,  xp:500, score:800, gold:300 }
];

// ================================
// QUESTS
// ================================
var QUESTS = [
    { id:'q1', desc:'Kill 5 Goblins',    type:'kill', monster:'goblin',   target:5,   reward:60,  xpR:50  },
    { id:'q2', desc:'Kill 3 Trolls',     type:'kill', monster:'troll',    target:3,   reward:80,  xpR:75  },
    { id:'q3', desc:'Kill 4 Skeletons',  type:'kill', monster:'skeleton', target:4,   reward:70,  xpR:60  },
    { id:'q4', desc:'Collect 3 Potions', type:'collect',                   target:3,   reward:50,  xpR:40  },
    { id:'q5', desc:'Reach Level 3',     type:'level',                     target:3,   reward:150, xpR:100 },
    { id:'q6', desc:'Defeat the Boss',   type:'boss',                      target:1,   reward:500, xpR:400 },
    { id:'q7', desc:'Survive 2 minutes', type:'survive',                   target:120, reward:200, xpR:150 },
    { id:'q8', desc:'Score 500 points',  type:'score',                     target:500, reward:180, xpR:120 }
];

// ================================
// GAME STATE
// ================================
var scene, player, cursors, wasd, shiftKey;
var enemies, potions, portals;
var minions=[], wolfPets=[];
var boss=null, bossHPBar, bossHPBg, bossNameTxt;
var bossSpawned=false;
var gameStarted=false;
var selectedClass='warrior', selectedMode='adventure';
var playerClass;
var skinColor=0x4488ff;
var playerFacing=1;
var otherPlayers={};
var joystickActive=false, joystickDX=0, joystickDY=0, joystickStartX=0, joystickStartY=0;

// Stats
var playerHealth=100, playerMaxHealth=100;
var playerXP=0, playerLevel=1, playerSpeed=200, playerDamage=20, playerAttackRange=80;
var xpToNextLevel=100, score=0, playerGold=0;
var lastHitTime=0, lastAttackTime=0;
var playerName='Hero';
var inventory=[], inventoryOpen=false, chatOpen=false;
var abilityLastUsed=0, playerInvisible=false, isBerserking=false;
var stamina=100, maxStamina=100, staminaBar;

// Dimension (adventure only)
var currentDimension=0; // 0=normal, 1=shadow
var dimensionOverlay, nightOverlay;
var shadowTiles=[], normalTiles=[], portalCooldown=false;
var inShadowRealm=false;

// Quests
var activeQuests=[];
var questStats={ kills:{}, potionsCollected:0, bossKills:0, surviveTime:0 };

// Tombstones
var tombstones=[];
var surviveTimer=0, dayTime=0, timeText;

// UI
var healthBar, healthBarBg, healthText;
var xpBar, xpText;
var levelText, scoreText, goldText, playerNameText;
var inventoryPanel, inventoryTexts=[];
var attackIndicator;

// Map
var tileSize=64, mapWidth=28, mapHeight=28;
var currentPool=POOL_ADVENTURE;

// Firebase
var myId=null, roomRef=null, myRef=null, playersRef=null, chatRef=null, tombstonesRef=null, pvpRef=null;
var lastPosSent=0;

// Mode vars
var currentWave=0, waveCount=0, waveKilled=0;
var bossRushIdx=0;

// ================================
// TOUCH HANDLERS (no loop!)
// ================================
window._doAttack  = null;
window._doAbility = null;
window._doPotion  = null;

// ================================
// SOUNDS
// ================================
function tone(f,d,t){ try{ var c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination);o.type=t||'sine';o.frequency.value=f;g.gain.setValueAtTime(0.3,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);o.start(c.currentTime);o.stop(c.currentTime+d); }catch(e){} }
var SFX={
    hit:      function(){tone(150,0.1,'square');},
    attack:   function(){tone(220,0.06,'sawtooth');},
    die:      function(){tone(80,0.2,'sawtooth');},
    levelUp:  function(){tone(523,0.1,'sine');setTimeout(function(){tone(659,0.1,'sine');},100);setTimeout(function(){tone(784,0.2,'sine');},200);},
    pickup:   function(){tone(600,0.08,'sine');},
    save:     function(){tone(523,0.1,'sine');setTimeout(function(){tone(659,0.1,'sine');},120);setTimeout(function(){tone(880,0.2,'sine');},240);},
    ability:  function(){tone(300,0.3,'square');},
    portal:   function(){tone(200,0.2,'sine');setTimeout(function(){tone(400,0.3,'sine');},200);},
    quest:    function(){tone(660,0.1,'sine');setTimeout(function(){tone(880,0.2,'sine');},150);},
    bossIn:   function(){tone(100,0.5,'sawtooth');setTimeout(function(){tone(80,0.5,'sawtooth');},300);},
    wave:     function(){tone(440,0.1,'sine');setTimeout(function(){tone(550,0.1,'sine');},100);setTimeout(function(){tone(660,0.2,'sine');},200);},
    over:     function(){tone(400,0.4,'sine');setTimeout(function(){tone(350,0.4,'sine');},400);setTimeout(function(){tone(300,0.4,'sine');},800);setTimeout(function(){tone(200,0.8,'sine');},1600);},
    gold:     function(){tone(700,0.05,'sine');setTimeout(function(){tone(900,0.1,'sine');},60);}
};

// ================================
// PRELOAD
// ================================
function preload(){ console.log('Loading...'); }

// ================================
// CREATE
// ================================
function create(){
    scene=this;
    loadGame();
    initQuests();
    var chk=scene.time.addEvent({delay:100,loop:true,callback:function(){ if(window.gameStarted){ chk.remove(); startGame(); } }});
}

// ================================
// QUESTS
// ================================
function initQuests(){
    activeQuests=QUESTS.slice(0,5).map(function(q){ return {id:q.id,desc:q.desc,type:q.type,monster:q.monster,target:q.target,reward:q.reward,xpR:q.xpR,current:0,done:false}; });
    updateQuestPanel();
}
function checkQuest(type,data){
    activeQuests.forEach(function(q){
        if(q.done)return;
        var prev=q.current;
        if(type==='kill'&&q.type==='kill'&&q.monster===data.m) q.current=Math.min(q.current+1,q.target);
        if(type==='collect'&&q.type==='collect') q.current=Math.min(q.current+1,q.target);
        if(type==='level'&&q.type==='level') q.current=playerLevel;
        if(type==='boss'&&q.type==='boss') q.current=1;
        if(type==='survive'&&q.type==='survive') q.current=Math.floor(surviveTimer);
        if(type==='score'&&q.type==='score') q.current=score;
        if(q.current!==prev) updateQuestPanel();
        if(!q.done&&q.current>=q.target){ q.done=true; completeQuest(q); }
    });
}
function completeQuest(q){
    SFX.quest(); score+=q.reward; if(scoreText)scoreText.setText('Score: '+score);
    earnGold(q.reward/5);
    gainXP(q.xpR);
    if(player)float('📜 Quest! +'+q.reward,player.x-80,player.y-100,'#ffaa00');
    addChat('Quest','✅ '+q.desc,'#ffaa00');
    setTimeout(function(){
        var done=activeQuests.map(function(x){return x.id;});
        for(var i=0;i<QUESTS.length;i++){
            if(done.indexOf(QUESTS[i].id)===-1){
                var next=QUESTS[i];
                var idx=activeQuests.findIndex(function(x){return x.id===q.id;});
                if(idx!==-1) activeQuests[idx]={id:next.id,desc:next.desc,type:next.type,monster:next.monster,target:next.target,reward:next.reward,xpR:next.xpR,current:0,done:false};
                updateQuestPanel(); break;
            }
        }
    },3000);
}
function updateQuestPanel(){
    var list=document.getElementById('questList'); if(!list)return;
    list.innerHTML='';
    activeQuests.forEach(function(q){
        var d=document.createElement('div'); d.className='questItem'+(q.done?' done':'');
        d.innerHTML=(q.done?'✅ ':'🔲 ')+q.desc+'<div class="questProgress">'+q.current+'/'+q.target+'</div><div class="questReward">+'+q.reward+' pts  +'+q.xpR+' XP</div>';
        list.appendChild(d);
    });
}

// ================================
// GOLD
// ================================
function earnGold(amount){
    amount=Math.floor(amount);
    playerGold+=amount;
    if(goldText)goldText.setText('💰 '+playerGold);
    var hud=document.getElementById('goldHUD');if(hud)hud.textContent='💰 '+playerGold+' Gold';
    // Save to playerData
    if(typeof playerData!=='undefined'){playerData.gold=playerGold;savePlayerData();}
    SFX.gold();
}

// ================================
// FIREBASE — room-based!
// ================================
function connectToServer(){
    try{
        myId='p_'+Date.now()+'_'+Math.floor(Math.random()*9999);
        var room=window._roomCode||'public';
        roomRef=db.ref('rooms/'+room);
        playersRef=db.ref('rooms/'+room+'/players');
        chatRef   =db.ref('rooms/'+room+'/chat');
        tombstonesRef=db.ref('rooms/'+room+'/tombstones');
        pvpRef=db.ref('rooms/'+room+'/pvp');

        myRef=playersRef.child(myId);
        myRef.set({
            id:myId, name:playerClass.icon+' '+playerName,
            x:400, y:300, dimension:0, mode:selectedMode, cls:selectedClass,
            skinColor:skinColor,
            hp:playerHealth, maxHp:playerMaxHealth, alive:true
        });
        myRef.onDisconnect().remove();

        // Other players join
        playersRef.on('child_added',function(snap){
            var d=snap.val(); if(!d||d.id===myId)return;
            addOtherPlayer(d);
            addChat('System',d.name+' joined!','#ffff44');
            countPlayers();
        });

        // FIX 3 + 7: sync health, position, dimension
        playersRef.on('child_changed',function(snap){
            var d=snap.val(); if(!d||d.id===myId)return;
            var op=otherPlayers[d.id]; if(!op)return;
            op.targetX=d.x; op.targetY=d.y;
            op.dimension=d.dimension;
            op.alive=d.alive;
            // FIX 7: only show in same dimension
            var vis=(d.dimension===currentDimension);
            if(op.sprite) op.sprite.setVisible(vis);
            if(op.nameTag) op.nameTag.setVisible(vis);
            if(op.hpBar) op.hpBar.setVisible(vis);
            // FIX 3: update health bar
            if(op.hpBar&&d.maxHp>0) op.hpBar.width=40*(d.hp/d.maxHp);
            if(op.hpBar){ if(d.hp/d.maxHp>0.5) op.hpBar.setFillStyle(0x22cc22); else op.hpBar.setFillStyle(0xff4444); }
        });

        playersRef.on('child_removed',function(snap){
            var d=snap.val(); if(!d)return;
            if(otherPlayers[d.id]){
                addChat('System',otherPlayers[d.id].name+' left','#ff8888');
                if(otherPlayers[d.id].sprite)otherPlayers[d.id].sprite.destroy();
                if(otherPlayers[d.id].nameTag)otherPlayers[d.id].nameTag.destroy();
                if(otherPlayers[d.id].hpBar)otherPlayers[d.id].hpBar.destroy();
                delete otherPlayers[d.id]; countPlayers();
            }
        });

        chatRef.limitToLast(1).on('child_added',function(snap){
            var d=snap.val(); if(!d||d.sid===myId)return;
            addChat(d.name,d.msg,'#ffffff');
        });

        // FIX 6: PvP hit events
        pvpRef.on('child_added',function(snap){
            var d=snap.val(); if(!d||d.targetId!==myId)return;
            if(!gameStarted||!player||!player.active)return;
            var now=Date.now(); if(now-lastHitTime<500)return; lastHitTime=now;
            playerHealth-=d.damage; SFX.hit();
            scene.cameras.main.shake(200,0.008);
            player.setTint(0xff0000); scene.time.delayedCall(200,function(){player.clearTint();});
            updateHPBar(); float('-'+d.damage+' (PvP)',player.x,player.y-50,'#ff4444');
            if(playerHealth<=0){playerHealth=0;updateHPBar();showGameOver();}
            snap.ref.remove();
        });

        tombstonesRef.once('value',function(snap){
            snap.forEach(function(c){ var t=c.val(); if(t&&t.mode===selectedMode) addTombVisual(t.x,t.y,t.name,t.level,'#ffaaaa'); });
        });
        tombstonesRef.on('child_added',function(snap){
            var t=snap.val(); if(!t||t.sid===myId) return;
            if(t.mode!==selectedMode) return; // FIX 10: mode-specific tombstones
            addTombVisual(t.x,t.y,t.name,t.level,'#ffaaaa');
            addChat('System','💀 '+t.name+' fell!','#ff8888');
        });

        addChat('System','🌐 Connected! Room: '+(window._roomCode||'public'),'#44ff44');
        countPlayers();
    }catch(e){
        console.log('Offline:',e);
        addChat('System','🌐 Playing offline','#ffaa00');
    }
}

function addOtherPlayer(data){
    if(otherPlayers[data.id]||!scene||!scene.physics)return;
    var sc=data.skinColor||0xaa44ff;
    var texKey='otex_'+data.id;
    makePlayerTex(texKey,sc);
    var sprite=scene.physics.add.image(data.x||400,data.y||300,texKey);
    sprite.setDepth(3);
    var nameTag=scene.add.text(data.x-30,data.y-55,data.name||'Player',{fontSize:'11px',fill:'#cc88ff',stroke:'#000',strokeThickness:1}).setDepth(4);
    // FIX 3: health bar above other player
    var hpBg=scene.add.rectangle(data.x,data.y-48,42,6,0x000000).setDepth(4);
    var hpBar=scene.add.rectangle(data.x-20,data.y-48,40,5,0x22cc22).setOrigin(0,0.5).setDepth(5);
    // FIX 7: visibility based on dimension
    var vis=(data.dimension||0)===currentDimension;
    sprite.setVisible(vis); nameTag.setVisible(vis); hpBar.setVisible(vis); hpBg.setVisible(vis);
    otherPlayers[data.id]={ sprite:sprite, nameTag:nameTag, hpBar:hpBar, hpBg:hpBg, name:data.name, targetX:data.x||400, targetY:data.y||300, dimension:data.dimension||0, alive:true };
}

function countPlayers(){
    if(!playersRef)return;
    playersRef.once('value',function(snap){
        var el=document.getElementById('playerCount');
        if(el) el.innerHTML='🟢 '+snap.numChildren()+' Online';
    });
}

function sendPos(){
    if(!myRef||!player)return;
    var now=Date.now(); if(now-lastPosSent<50)return; lastPosSent=now;
    myRef.update({x:Math.floor(player.x),y:Math.floor(player.y),dimension:currentDimension,hp:Math.floor(playerHealth),maxHp:playerMaxHealth});
}

// FIX 6: PvP damage — sends actual damage to target player
function sendPvpHit(targetId,damage){
    if(!pvpRef)return;
    pvpRef.push({targetId:targetId,damage:damage,attackerId:myId,time:Date.now()});
}

// ================================
// START GAME
// ================================
function startGame(){
    selectedClass = window._selectedClass||'warrior';
    selectedMode  = window._selectedMode||'adventure';
    playerName    = window._playerName||'Hero';
    skinColor     = window._selectedSkinColor||0x4488ff;

    playerClass     = CLASSES[selectedClass];
    playerMaxHealth = playerClass.hp;
    playerHealth    = Math.max(10, Math.min(playerHealth, playerMaxHealth));
    playerSpeed     = playerClass.speed;
    playerDamage    = playerClass.damage;
    playerAttackRange = playerClass.attackRange;

    // Load gold from playerData
    if(typeof playerData!=='undefined') playerGold=playerData.gold||0;

    // Set monster pool
    if(selectedMode==='adventure')      currentPool=POOL_ADVENTURE;
    else if(selectedMode==='survival')  currentPool=POOL_SURVIVAL;
    else if(selectedMode==='bossrush')  currentPool=POOL_BOSSRUSH;
    else if(selectedMode==='pvp')       currentPool=POOL_PVP; // FIX 1: empty!

    // Register touch functions
    window._doAttack  = function(){ doAttack(); };
    window._doAbility = function(){ doAbility(); };
    window._doPotion  = function(){ doPotion(); };

    buildWorld();
    createTextures();
    createPlayer();

    enemies = scene.physics.add.group();
    potions = scene.physics.add.group();

    // FIX 5: portals ONLY in adventure
    if(selectedMode==='adventure'){
        buildPortals();
        scene.physics.add.overlap(player,portals,onPortal,null,scene);
    }

    // Start mode
    if(selectedMode==='adventure')     modeAdventure();
    else if(selectedMode==='survival') modeSurvival();
    else if(selectedMode==='bossrush') modeBossRush();
    else if(selectedMode==='pvp')      modePvp();

    setupCam();
    setupKeys();
    buildUI();
    buildInventory();
    if(selectedMode==='adventure') startDayNight();
    startSurviveTimer();
    setupJoystick();
    connectToServer();

    scene.physics.add.overlap(player,enemies,onEnemyTouch,null,scene);
    scene.physics.add.overlap(player,potions,onPotion,null,scene);

    scene.cameras.main.setBackgroundColor(getBgColor());

    // Update ability icon
    var ai=document.getElementById('abilityIcon'); if(ai)ai.textContent=playerClass.abilityIcon;
    var ai2=document.getElementById('abilityIcon2'); if(ai2)ai2.textContent=playerClass.abilityIcon;

    console.log('Game started:',selectedMode,'as',selectedClass,'skin:',skinColor.toString(16));
}

function getBgColor(){
    var colors={adventure:'#1a5c1a',survival:'#3d1a00',bossrush:'#0d0011',pvp:'#1a1a22'};
    return colors[selectedMode]||'#1a5c1a';
}

// ================================
// BUILD WORLD — genuinely different layouts!
// FIX 2: Unique map structures
// ================================
function buildWorld(){
    if(selectedMode==='adventure')     buildForest();
    else if(selectedMode==='survival') buildLavaDesert();
    else if(selectedMode==='bossrush') buildDungeon();
    else if(selectedMode==='pvp')      buildArena();

    // Shadow realm (adventure only) — FIX 5
    if(selectedMode==='adventure'){
        for(var sx=0;sx<mapWidth;sx++){
            for(var sy=0;sy<mapHeight;sy++){
                shadowTiles.push(scene.add.rectangle(sx*tileSize+tileSize/2,sy*tileSize+tileSize/2,tileSize-1,tileSize-1,(sx+sy)%2===0?0x1a0033:0x110022).setVisible(false));
            }
        }
        // Shadow crystals
        [{x:3,y:3},{x:8,y:6},{x:14,y:2},{x:19,y:8},{x:6,y:18}].forEach(function(p){
            var c=scene.add.triangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/4,-7,14,7,14,0,-18,0x8800ff).setVisible(false);
            scene.tweens.add({targets:c,alpha:0.4,duration:800,yoyo:true,repeat:-1}); shadowTiles.push(c);
        });
        // Shadow portal background lighting (only in shadow realm — FIX 4: only return portal visible there)
    }

    nightOverlay=scene.add.rectangle(0,0,mapWidth*tileSize,mapHeight*tileSize,0x000033,0).setOrigin(0,0).setDepth(5);
    dimensionOverlay=scene.add.rectangle(0,0,mapWidth*tileSize,mapHeight*tileSize,0x220044,0).setOrigin(0,0).setDepth(4);
}

// ADVENTURE: Organic forest with river, caves, clearings
function buildForest(){
    // Base grass
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            var c=(x+y)%2===0?0x2d8a2d:0x267326;
            // Dirt paths forming a cross
            if(x===14||(y===14&&x>4&&x<24)) c=0x8B6914;
            normalTiles.push(scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,c));
        }
    }
    // River flowing diagonally
    for(var i=0;i<mapHeight;i++){
        var rx=20+Math.floor(i*0.3);
        if(rx<mapWidth){
            var w=scene.add.rectangle(rx*tileSize+tileSize/2,i*tileSize+tileSize/2,tileSize*2,tileSize,0x1155aa);
            scene.tweens.add({targets:w,fillColor:0x2266cc,duration:1200+Math.random()*400,yoyo:true,repeat:-1});
            normalTiles.push(w);
        }
    }
    // Dense tree clusters (north and south)
    var trees=[];
    for(var i=0;i<6;i++) trees.push({x:1+i,y:1}); // top row
    for(var i=0;i<5;i++) trees.push({x:1+i,y:2});
    for(var i=0;i<4;i++) trees.push({x:22+i,y:1});
    for(var i=0;i<4;i++) trees.push({x:22+i,y:2});
    [{x:1,y:12},{x:2,y:13},{x:1,y:14},{x:3,y:12},{x:25,y:12},{x:26,y:13},{x:25,y:14},{x:24,y:11}].forEach(function(p){trees.push(p);});
    trees.forEach(function(p){
        var tx=p.x*tileSize+tileSize/2,ty=p.y*tileSize+tileSize/2;
        normalTiles.push(scene.add.rectangle(tx,ty,14,28,0x6B3A2A));
        normalTiles.push(scene.add.circle(tx,ty-14,24,0x1a6e1a));
        normalTiles.push(scene.add.circle(tx-7,ty-20,16,0x228822));
    });
    // Campfires
    [{x:8,y:8},{x:18,y:6},{x:5,y:20}].forEach(function(p){
        var fx=p.x*tileSize+tileSize/2,fy=p.y*tileSize+tileSize/2;
        scene.add.rectangle(fx,fy+4,22,8,0x6B3A2A);
        var f1=scene.add.triangle(fx,fy-16,-8,8,8,8,0,-12,0xff4400);
        var f2=scene.add.triangle(fx-5,fy-10,-5,6,5,6,0,-8,0xff8800);
        scene.tweens.add({targets:[f1,f2],scaleX:0.85,scaleY:1.15,duration:160+Math.random()*100,yoyo:true,repeat:-1});
    });
    // Rocks
    [{x:5,y:5},{x:10,y:18},{x:22,y:10}].forEach(function(p){
        normalTiles.push(scene.add.ellipse(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,30,20,0x888888));
    });
    // Cave entrance (dark area bottom-left)
    for(var i=0;i<3;i++){
        for(var j=0;j<2;j++){
            normalTiles.push(scene.add.rectangle((1+i)*tileSize+tileSize/2,(24+j)*tileSize+tileSize/2,tileSize-1,tileSize-1,0x222222));
        }
    }
    scene.add.text(2*tileSize,24*tileSize,'🏔️ Cave',{fontSize:'12px',fill:'#888',stroke:'#000',strokeThickness:2});
}

// SURVIVAL: Lava fortress with moat, platforms, bridges
function buildLavaDesert(){
    // All dark ground
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            var c=(x+y)%2===0?0x8B3000:0x6B2200;
            normalTiles.push(scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,c));
        }
    }
    // Lava moat around edges
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            if(x<2||x>mapWidth-3||y<2||y>mapHeight-3){
                var lava=scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,0xff3300);
                scene.tweens.add({targets:lava,fillColor:0xff6600,duration:600+Math.random()*400,yoyo:true,repeat:-1});
                normalTiles.push(lava);
            }
        }
    }
    // Stone platforms (raised areas)
    var platforms=[{x:5,y:5,w:4,h:4},{x:14,y:3,w:5,h:3},{x:20,y:6,w:4,h:4},{x:5,y:18,w:5,h:4},{x:18,y:17,w:4,h:5}];
    platforms.forEach(function(pl){
        for(var px=pl.x;px<pl.x+pl.w;px++){
            for(var py=pl.y;py<pl.y+pl.h;py++){
                normalTiles.push(scene.add.rectangle(px*tileSize+tileSize/2,py*tileSize+tileSize/2,tileSize-1,tileSize-1,0xcc6600));
            }
        }
    });
    // Lava lakes in center
    [{cx:12,cy:12,rw:60,rh:40},{cx:10,cy:8,rw:40,rh:30}].forEach(function(l){
        var lk=scene.add.ellipse(l.cx*tileSize,l.cy*tileSize,l.rw,l.rh,0xff3300);
        scene.tweens.add({targets:lk,fillColor:0xff6600,scaleX:1.05,duration:800+Math.random()*400,yoyo:true,repeat:-1});
        normalTiles.push(lk);
    });
    // Volcanic vents
    for(var i=0;i<6;i++){
        var vx=Phaser.Math.Between(4,23)*tileSize,vy=Phaser.Math.Between(4,23)*tileSize;
        var vent=scene.add.rectangle(vx,vy,8,36,0xff6600);
        scene.tweens.add({targets:vent,scaleY:1.8,alpha:0.3,duration:600+Math.random()*400,yoyo:true,repeat:-1});
    }
    // Dead skull totems
    [{x:8,y:15},{x:19,y:20},{x:14,y:8}].forEach(function(p){
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,8,32,0x553322);
        var skull=scene.add.circle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2-24,10,0xbbbbbb);
        scene.add.circle(p.x*tileSize+tileSize/2-4,p.y*tileSize+tileSize/2-26,3,0x000000);
        scene.add.circle(p.x*tileSize+tileSize/2+4,p.y*tileSize+tileSize/2-26,3,0x000000);
        normalTiles.push(skull);
    });
}

// BOSS RUSH: Dungeon with rooms and corridors
function buildDungeon(){
    // Fill with dark stone
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            normalTiles.push(scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,0x111122));
        }
    }
    // Rooms connected by corridors
    var rooms=[
        {x:1,y:1,w:8,h:7},   // start room
        {x:12,y:1,w:8,h:7},  // top right room
        {x:1,y:12,w:8,h:7},  // bottom left room
        {x:12,y:12,w:8,h:7}, // bottom right room
        {x:6,y:6,w:10,h:8}   // center room
    ];
    rooms.forEach(function(r,ri){
        var floorColors=[0x222233,0x1a1a2e,0x22223a,0x1e1e30,0x2a2a40];
        for(var rx=r.x;rx<r.x+r.w;rx++){
            for(var ry=r.y;ry<r.y+r.h;ry++){
                normalTiles.push(scene.add.rectangle(rx*tileSize+tileSize/2,ry*tileSize+tileSize/2,tileSize-1,tileSize-1,floorColors[ri%floorColors.length]));
            }
        }
        // Room label
        scene.add.text((r.x+1)*tileSize,(r.y+1)*tileSize,(ri===4?'⚔️ Boss Chamber':'Room '+(ri+1)),{fontSize:'11px',fill:'#555',stroke:'#000',strokeThickness:1});
    });
    // Corridors connecting rooms
    var corridors=[{x:8,y:4,w:5,h:2},{x:4,y:8,w:2,h:5},{x:12,y:4,w:2,h:-1},{x:8,y:13,w:5,h:2}];
    corridors.forEach(function(c){
        for(var cx=c.x;cx<c.x+(Math.abs(c.w)||2);cx++){
            for(var cy=c.y;cy<c.y+Math.abs(c.h||2);cy++){
                normalTiles.push(scene.add.rectangle(cx*tileSize+tileSize/2,cy*tileSize+tileSize/2,tileSize-1,tileSize-1,0x1c1c2e));
            }
        }
    });
    // Pillars
    [{x:2,y:2},{x:8,y:2},{x:2,y:7},{x:8,y:7},{x:13,y:2},{x:19,y:2},{x:2,y:13},{x:8,y:13},{x:13,y:13},{x:19,y:13}].forEach(function(p){
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,20,56,0x222233);
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,28,14,0x333344);
    });
    // Purple torches
    for(var i=0;i<10;i++){
        var tx=Phaser.Math.Between(2,25)*tileSize,ty=Phaser.Math.Between(2,25)*tileSize;
        var f=scene.add.circle(tx,ty,10,0xaa00ff,0.8);
        scene.tweens.add({targets:f,radius:14,alpha:0.4,duration:280+Math.random()*200,yoyo:true,repeat:-1});
    }
    // Bones on floor
    for(var i=0;i<12;i++){
        var bx=Phaser.Math.Between(3,24)*tileSize,by=Phaser.Math.Between(3,24)*tileSize;
        scene.add.rectangle(bx,by,20,4,0x888888);
        scene.add.circle(bx-12,by,4,0x999999);
        scene.add.circle(bx+12,by,4,0x999999);
    }
}

// ARENA: Circular colosseum with spectator stands, center sand
function buildArena(){
    // Stone base everywhere
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            normalTiles.push(scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,0x333333));
        }
    }
    // Outer spectator stands (darker)
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            if(x<3||x>mapWidth-4||y<3||y>mapHeight-4){
                normalTiles.push(scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,0x222222));
            }
        }
    }
    // Sand fighting area (circular)
    var cx=mapWidth/2*tileSize,cy=mapHeight/2*tileSize,r=8*tileSize;
    for(var x=4;x<mapWidth-4;x++){
        for(var y=4;y<mapHeight-4;y++){
            var dx=(x*tileSize+tileSize/2)-cx, dy=(y*tileSize+tileSize/2)-cy;
            if(Math.sqrt(dx*dx+dy*dy)<r){
                normalTiles.push(scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,(x+y)%2===0?0x998855:0x887744));
            }
        }
    }
    // Corner towers
    [{x:3,y:3},{x:24,y:3},{x:3,y:24},{x:24,y:24}].forEach(function(p){
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,40,72,0x888888);
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,48,18,0x999999);
        var flame=scene.add.circle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2-46,9,0xffaa00);
        scene.tweens.add({targets:flame,radius:13,alpha:0.5,duration:280,yoyo:true,repeat:-1});
    });
    // Entrance gates (North and South)
    [{x:14,y:3},{x:14,y:24}].forEach(function(p){
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2,64,16,0x666666);
        scene.add.rectangle(p.x*tileSize+tileSize/2,p.y*tileSize+tileSize/2-18,64,10,0x555555);
    });
    // Decorative crowd (tiny colored dots)
    for(var i=0;i<40;i++){
        var crowdX=Phaser.Math.Between(0,3)*tileSize+(Math.random()>0.5?(mapWidth-3)*tileSize:0);
        var crowdY=Phaser.Math.Between(0,mapHeight)*tileSize;
        scene.add.circle(crowdX+Math.random()*tileSize,crowdY+Math.random()*tileSize,4,Phaser.Math.Between(0,0xffffff));
    }
    scene.add.text(cx,cy-r-24,'⚔️ PvP ARENA ⚔️',{fontSize:'18px',fill:'#ffaa00',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
}

// ================================
// TEXTURES — using fillCircle NOT fillArc!
// ================================
function makePlayerTex(name,color){
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color);
    g.fillRoundedRect(4,12,32,28,4);
    g.fillStyle(0xffddaa);
    g.fillCircle(20,9,12); // head — fillCircle, not fillArc!
    g.fillStyle(0x000000);
    g.fillCircle(15,8,3);
    g.fillCircle(25,8,3);
    g.fillStyle(0xffffff,0.3);
    g.fillRect(8,16,24,5);
    g.generateTexture(name,44,44);
    g.destroy();
}

function makeMonsterTex(name,color,size){
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(color);
    g.fillRoundedRect(4,10,size-8,size-10,4);
    g.fillStyle(0xffffff);
    g.fillCircle(12,14,5);
    g.fillCircle(size-14,14,5);
    g.fillStyle(0x000000);
    g.fillCircle(13,14,3);
    g.fillCircle(size-13,14,3);
    g.generateTexture(name,size,size);
    g.destroy();
}

function makeBossTex(name,bd){
    var g=scene.make.graphics({x:0,y:0,add:false});
    g.fillStyle(bd.bodyColor);
    g.fillRoundedRect(5,5,90,90,12);
    g.fillStyle(bd.eyeColor);
    g.fillCircle(28,28,14);
    g.fillCircle(72,28,14);
    g.fillStyle(0x000000);
    g.fillCircle(28,28,8);
    g.fillCircle(72,28,8);
    g.fillStyle(bd.mouthColor);
    g.fillRect(22,65,56,12);
    g.generateTexture(name,100,100);
    g.destroy();
}

function createTextures(){
    // Player texture with skin color
    makePlayerTex('playerTex',skinColor);

    // Monster textures
    var allPools=[POOL_ADVENTURE,POOL_SURVIVAL,POOL_BOSSRUSH,POOL_SHADOW];
    allPools.forEach(function(pool){
        Object.keys(pool).forEach(function(key){
            if(!scene.textures.exists(key+'Tex')){
                makeMonsterTex(key+'Tex',pool[key].color,pool[key].size);
            }
        });
    });

    // Potion
    var p=scene.make.graphics({x:0,y:0,add:false});
    p.fillStyle(0xff69b4); p.fillRoundedRect(2,6,26,24,8);
    p.fillStyle(0xffbbdd); p.fillCircle(10,13,6);
    p.generateTexture('potionTex',30,32); p.destroy();

    // Tombstone
    var t=scene.make.graphics({x:0,y:0,add:false});
    t.fillStyle(0x666666); t.fillRoundedRect(5,0,34,40,8);
    t.fillStyle(0x999999); t.fillRect(18,10,4,18); t.fillRect(11,16,18,4);
    t.generateTexture('tombTex',44,44); t.destroy();

    // Minion
    var m=scene.make.graphics({x:0,y:0,add:false});
    m.fillStyle(0xdddddd); m.fillRoundedRect(5,10,22,24,4);
    m.fillStyle(0xeeeeee); m.fillCircle(16,8,9);
    m.generateTexture('minionTex',32,36); m.destroy();

    // Wolf
    var w=scene.make.graphics({x:0,y:0,add:false});
    w.fillStyle(0x886644); w.fillEllipse(16,16,30,22);
    w.fillStyle(0x775533); w.fillCircle(26,10,10);
    w.generateTexture('wolfTex',36,32); w.destroy();
}

function createPlayer(){
    player=scene.physics.add.image(mapWidth/2*tileSize,mapHeight/2*tileSize,'playerTex');
    scene.physics.world.setBounds(0,0,mapWidth*tileSize,mapHeight*tileSize);
    player.setCollideWorldBounds(true);
    attackIndicator=scene.add.circle(player.x,player.y,playerAttackRange,0xffffff,0).setStrokeStyle(1,0xffffff,0.15).setDepth(8);
}

// ================================
// PORTALS — FIX 4 + FIX 5
// Shadow portal to enter shadow realm
// Return portal ONLY appears inside shadow realm!
// ================================
var shadowPortalGfx, returnPortalGfx;
var returnPortalBody;

function buildPortals(){
    portals=scene.physics.add.staticGroup();

    // Shadow portal — always visible in normal world
    var p1=portals.create(22*tileSize,22*tileSize,null); p1.setCircle(30); p1.portalType='toShadow';
    shadowPortalGfx=scene.add.graphics();
    scene.time.addEvent({delay:50,loop:true,callback:function(){
        shadowPortalGfx.clear();
        if(!inShadowRealm){
            var a=0.4+Math.sin(Date.now()/300)*0.3;
            shadowPortalGfx.lineStyle(5,0xaa00ff,a); shadowPortalGfx.strokeCircle(22*tileSize,22*tileSize,34);
            shadowPortalGfx.fillStyle(0xaa00ff,a*0.15); shadowPortalGfx.fillCircle(22*tileSize,22*tileSize,32);
        }
    }});
    scene.add.text(22*tileSize,22*tileSize-50,'🌀 Shadow Portal',{fontSize:'12px',fill:'#cc88ff',stroke:'#000',strokeThickness:2}).setOrigin(0.5);

    // FIX 4: Return portal — body created but HIDDEN until in shadow realm
    returnPortalBody=portals.create(4*tileSize,4*tileSize,null); returnPortalBody.setCircle(30); returnPortalBody.portalType='toNormal';
    returnPortalBody.active=false; // start inactive
    returnPortalGfx=scene.add.graphics();
    // Return portal text — also hidden
    var returnLabel=scene.add.text(4*tileSize,4*tileSize-50,'🌀 Return Portal',{fontSize:'12px',fill:'#ffcc88',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setVisible(false);
    returnPortalBody._label=returnLabel;
    scene.time.addEvent({delay:50,loop:true,callback:function(){
        returnPortalGfx.clear();
        if(inShadowRealm){
            var a=0.4+Math.sin(Date.now()/300)*0.3;
            returnPortalGfx.lineStyle(5,0xffaa00,a); returnPortalGfx.strokeCircle(4*tileSize,4*tileSize,34);
            returnPortalGfx.fillStyle(0xffaa00,a*0.15); returnPortalGfx.fillCircle(4*tileSize,4*tileSize,32);
        }
    }});
}

function onPortal(player,portal){
    if(portalCooldown)return; portalCooldown=true; setTimeout(function(){portalCooldown=false;},2000);
    if(portal.portalType==='toShadow'&&!inShadowRealm) enterShadow();
    else if(portal.portalType==='toNormal'&&inShadowRealm) exitShadow();
}

function enterShadow(){
    inShadowRealm=true; currentDimension=1; SFX.portal();
    scene.cameras.main.flash(500,100,0,150);
    normalTiles.forEach(function(t){t.setVisible(false);});
    shadowTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimensionOverlay,alpha:0.4,duration:1000});
    clearEnemies();
    for(var i=0;i<10;i++) spawnEnemy(null,POOL_SHADOW);
    var di=document.getElementById('dimensionIndicator');
    if(di){di.innerHTML='🌑 Shadow Realm';di.style.color='#cc88ff';}
    showFloatingText('🌑 Shadow Realm!',player.x-100,player.y-80,'#cc88ff');
    checkQuest('dimension',{});
    // FIX 4: Show return portal now!
    if(returnPortalBody){returnPortalBody.active=true;}
    if(returnPortalBody&&returnPortalBody._label)returnPortalBody._label.setVisible(true);
    // FIX 7: update other player visibility
    updateOtherPlayerVisibility();
    if(myRef)myRef.update({dimension:1});
}

function exitShadow(){
    inShadowRealm=false; currentDimension=0; SFX.portal();
    scene.cameras.main.flash(500,50,150,50);
    shadowTiles.forEach(function(t){t.setVisible(false);});
    normalTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimensionOverlay,alpha:0,duration:1000});
    clearEnemies(); spawnInitial();
    var di=document.getElementById('dimensionIndicator');
    if(di){di.innerHTML='🌍 Normal World';di.style.color='#aaffaa';}
    showFloatingText('🌍 Normal World!',player.x-100,player.y-80,'#aaffaa');
    // FIX 4: Hide return portal again
    if(returnPortalBody){returnPortalBody.active=false;}
    if(returnPortalBody&&returnPortalBody._label)returnPortalBody._label.setVisible(false);
    // FIX 7
    updateOtherPlayerVisibility();
    if(myRef)myRef.update({dimension:0});
}

// FIX 7: show/hide other players based on dimension
function updateOtherPlayerVisibility(){
    Object.values(otherPlayers).forEach(function(op){
        var vis=(op.dimension===currentDimension);
        if(op.sprite) op.sprite.setVisible(vis);
        if(op.nameTag) op.nameTag.setVisible(vis);
        if(op.hpBar) op.hpBar.setVisible(vis);
        if(op.hpBg) op.hpBg.setVisible(vis);
    });
}

function clearEnemies(){enemies.getChildren().forEach(function(e){if(e.hpBar)e.hpBar.destroy();if(e.nameTag)e.nameTag.destroy();e.destroy();}); }

// ================================
// GAME MODES
// ================================
function modeAdventure(){
    spawnInitial();
    scene.time.addEvent({delay:90000,callback:function(){if(player)showFloatingText('⚠️ Dragon King in 30s!',player.x-140,player.y-80,'#ff8800');}});
    scene.time.addEvent({delay:120000,callback:function(){spawnBoss('adventure');}});
}

function modeSurvival(){
    var wi=document.getElementById('waveHUD');if(wi)wi.style.display='block';
    setTimeout(function(){nextWave();},2000);
}
function nextWave(){
    if(!gameStarted)return;
    currentWave++; waveKilled=0;
    waveCount=5+currentWave*3;
    SFX.wave();
    var wi=document.getElementById('waveHUD');if(wi)wi.textContent='🌊 Wave '+currentWave+' — '+waveCount+' enemies!';
    showFloatingText('🌊 WAVE '+currentWave+'!',player.x-60,player.y-100,'#ff4444');
    var keys=Object.keys(POOL_SURVIVAL);
    for(var i=0;i<waveCount;i++){
        (function(d){setTimeout(function(){if(gameStarted)spawnEnemy(keys[Math.floor(Math.random()*keys.length)],POOL_SURVIVAL);},d);})(i*350);
    }
    if(currentWave%5===0)setTimeout(function(){if(gameStarted)spawnBoss('survival');},waveCount*350+1500);
}
function onWaveKill(){
    if(selectedMode!=='survival')return;
    waveKilled++;
    if(waveKilled>=waveCount){
        showFloatingText('✅ Wave '+currentWave+' clear!',player.x-100,player.y-80,'#44ff44');
        playerHealth=Math.min(playerHealth+30,playerMaxHealth); updateHPBar();
        var wi=document.getElementById('waveHUD');if(wi)wi.textContent='⏳ Next wave in 3s...';
        setTimeout(function(){if(gameStarted)nextWave();},3000); return;
    }
    var wi=document.getElementById('waveHUD');if(wi)wi.textContent='🌊 Wave '+currentWave+' — '+(waveCount-waveKilled)+' left!';
}

function modeBossRush(){
    bossRushIdx=0;
    showFloatingText('💀 Boss Rush begins!',player.x-100,player.y-80,'#cc44ff');
    setTimeout(function(){nextBossRush();},2000);
}
function nextBossRush(){
    if(!player||!player.active||!gameStarted)return;
    bossRushIdx++;
    var bd=BOSS_RUSH_LIST[(bossRushIdx-1)%BOSS_RUSH_LIST.length];
    var texKey='brBoss'+bossRushIdx;
    makeBossTex(texKey,bd);
    SFX.bossIn();
    var x=mapWidth/2*tileSize,y=mapHeight/2*tileSize;
    boss=scene.physics.add.image(x,y,texKey);
    boss.setCollideWorldBounds(true);
    boss.hp=(bd.hp+playerLevel*80)*Math.ceil(bossRushIdx/BOSS_RUSH_LIST.length);
    boss.maxHp=boss.hp; boss.speed=bd.speed+playerLevel*5; boss.xp=bd.xp*bossRushIdx; boss.gold=bd.gold;
    bossSpawned=true;
    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:600,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossNameTxt)bossNameTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.barColor).setScrollFactor(0).setDepth(15);
    bossNameTxt=scene.add.text(640,50,bd.name+' #'+bossRushIdx,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);
    showFloatingText('⚠️ '+bd.name,player.x-120,player.y-100,'#cc44ff');
    scene.physics.add.overlap(player,boss,onBossTouch,null,scene);
}

// FIX 1: PvP — NO mobs spawn! Just players vs players
function modePvp(){
    addChat('System','⚔️ PvP Mode! Attack other players!','#ff88ff');
    showFloatingText('⚔️ PvP Arena! Fight!',player.x-100,player.y-80,'#ff88ff');
    // No enemy spawning at all
}

// ================================
// SPAWN ENEMIES
// ================================
function spawnInitial(){
    if(selectedMode==='pvp')return; // FIX 1: no mobs in pvp
    var keys=Object.keys(currentPool);
    if(keys.length===0)return;
    for(var i=0;i<12;i++) spawnEnemy(keys[Math.floor(Math.random()*keys.length)],currentPool);
}

function spawnEnemy(type,pool){
    pool=pool||currentPool;
    if(!pool||Object.keys(pool).length===0)return; // FIX 1: safety check
    var keys=Object.keys(pool);
    if(!type||!pool[type])type=keys[Math.floor(Math.random()*keys.length)];
    var m=pool[type]; if(!m)return;
    var texKey=type+'Tex';
    if(!scene.textures.exists(texKey)) makeMonsterTex(texKey,m.color,m.size);
    var x=Phaser.Math.Between(3,mapWidth-3)*tileSize, y=Phaser.Math.Between(3,mapHeight-3)*tileSize;
    var e=enemies.create(x,y,texKey);
    e.setCollideWorldBounds(true);
    e.mtype=type; e.pool=pool;
    e.hp=m.hp*(1+playerLevel*0.2); e.maxHp=e.hp;
    e.speed=m.speed+playerLevel*4; e.damage=m.damage;
    e.xp=m.xp+playerLevel*5; e.score=m.score; e.gold=m.gold||5;
    e.px=x; e.py=y;
    e.hpBar=scene.add.rectangle(x,y-35,m.size,6,0xff3333).setDepth(6);
    e.nameTag=scene.add.text(x,y-50,m.name+' Lv.'+playerLevel,{fontSize:'11px',fill:'#fff',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(6);
    return e;
}

// ================================
// CAMERA + KEYS
// ================================
function setupCam(){
    scene.cameras.main.setBounds(0,0,mapWidth*tileSize,mapHeight*tileSize);
    scene.cameras.main.startFollow(player,true,0.08,0.08);
    scene.cameras.main.setZoom(0.5);
    scene.tweens.add({targets:scene.cameras.main,zoom:1,duration:1200,ease:'Power2'});
}
function setupKeys(){
    cursors=scene.input.keyboard.createCursorKeys();
    wasd=scene.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D});
    shiftKey=scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    scene.input.keyboard.on('keydown-SPACE',function(){if(!chatOpen)doAttack();});
    scene.input.keyboard.on('keydown-E',    function(){if(!chatOpen)doAbility();});
    scene.input.keyboard.on('keydown-F',    function(){if(!chatOpen)doPotion();});
    scene.input.keyboard.on('keydown-I',    function(){if(!chatOpen)toggleInv();});
    scene.input.keyboard.on('keydown-T',    function(){openChat();});
    scene.input.keyboard.on('keydown-ENTER',function(){if(!chatOpen)doSave();});
}

// ================================
// JOYSTICK
// ================================
function setupJoystick(){
    if(!isMobile)return;
    var zone=document.getElementById('joystickZone'),base=document.getElementById('joystickBase'),thumb=document.getElementById('joystickThumb');
    if(!zone||!base||!thumb)return;
    var max=42;
    zone.addEventListener('touchstart',function(e){e.preventDefault();var t=e.changedTouches[0];joystickActive=true;joystickStartX=t.clientX;joystickStartY=t.clientY;var r=zone.getBoundingClientRect();base.style.left=(t.clientX-r.left-55)+'px';base.style.bottom='auto';base.style.top=(t.clientY-r.top-55)+'px';},{passive:false});
    zone.addEventListener('touchmove',function(e){e.preventDefault();if(!joystickActive)return;var t=e.changedTouches[0];var dx=t.clientX-joystickStartX,dy=t.clientY-joystickStartY,dist=Math.sqrt(dx*dx+dy*dy);if(dist>max){dx=dx/dist*max;dy=dy/dist*max;}thumb.style.transform='translate('+dx+'px,'+dy+'px)';joystickDX=dx/max;joystickDY=dy/max;},{passive:false});
    zone.addEventListener('touchend',function(e){e.preventDefault();joystickActive=false;joystickDX=0;joystickDY=0;thumb.style.transform='translate(0,0)';base.style.left='48px';base.style.top='auto';base.style.bottom='28px';},{passive:false});
}

// ================================
// ATTACK
// ================================
function doAttack(){
    var now=Date.now(); if(now-lastAttackTime<playerClass.attackCooldown)return; lastAttackTime=now;
    SFX.attack();
    var sw=scene.add.graphics();
    sw.lineStyle(3,0xffddaa,1);
    sw.arc(player.x,player.y,playerAttackRange*0.7,playerFacing===1?-0.5:Math.PI+0.5,playerFacing===1?0.8:Math.PI-0.8);
    sw.strokePath();
    scene.tweens.add({targets:sw,alpha:0,duration:250,onComplete:function(){sw.destroy();}});
    var hit=false;
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active)return;
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<=playerAttackRange){
            var dmg=playerDamage;
            if(selectedClass==='berserker'){var r=playerHealth/playerMaxHealth;if(r<0.5)dmg*=1.8;if(r<0.25)dmg*=2.5;dmg=Math.floor(dmg);}
            var crit=(selectedClass==='rogue'&&Math.random()<0.3);
            if(crit)dmg=Math.floor(dmg*2);
            e.hp-=dmg; e.setTint(0xffffff);
            scene.time.delayedCall(100,function(){if(e&&e.active)e.clearTint();});
            showFloatingText((crit?'⚡ ':'')+dmg,e.x,e.y-40,crit?'#ffff00':'#ffddaa');
            hit=true; if(e.hp<=0)killEnemy(e);
        }
    });
    if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<=playerAttackRange+50){
        boss.hp-=playerDamage; updateBossHP(); if(boss.hp<=0)killBoss();
    }
    // FIX 6: PvP — actually damage other players via Firebase!
    if(selectedMode==='pvp'){
        Object.entries(otherPlayers).forEach(function(entry){
            var opId=entry[0], op=entry[1];
            if(!op||!op.sprite||!op.sprite.active)return;
            if(Phaser.Math.Distance.Between(player.x,player.y,op.sprite.x,op.sprite.y)<=playerAttackRange){
                var dmg=Math.floor(playerDamage*(selectedClass==='rogue'&&Math.random()<0.3?2:1));
                sendPvpHit(opId,dmg); // Send real damage!
                showFloatingText('⚔️ HIT! -'+dmg,op.sprite.x,op.sprite.y-40,'#ff88ff');
            }
        });
    }
    if(!hit&&!(boss&&boss.active))showFloatingText('miss',player.x+playerFacing*30,player.y-20,'#444444');
}

// ================================
// ENEMY COLLISION
// ================================
function onEnemyTouch(player,enemy){
    if(playerInvisible||selectedMode==='pvp')return; // pvp = no mob damage
    var now=Date.now();if(now-lastHitTime<1000)return;lastHitTime=now;
    var dmg=enemy.damage||10; playerHealth-=dmg; SFX.hit();
    scene.cameras.main.shake(200,0.008);
    player.setTint(0xff0000); scene.time.delayedCall(200,function(){player.clearTint();});
    updateHPBar(); showFloatingText('-'+dmg,player.x,player.y-50,'#ff3333');
    if(playerHealth<=0){playerHealth=0;updateHPBar();showGameOver();}
}

function killEnemy(e){
    if(!e||!e.active)return;
    var m=e.pool?e.pool[e.mtype]:null; if(!m)m={color:0xff4444};
    particles(e.x,e.y,m.color,12); SFX.die();
    gainXP(e.xp||20);
    score+=(e.score||10)*playerLevel;
    if(scoreText)scoreText.setText('Score: '+score);
    earnGold(e.gold||5);
    if(selectedMode!=='pvp') spawnPotion(e.x,e.y,false);
    var mtype=e.mtype||'goblin';
    if(!questStats.kills[mtype])questStats.kills[mtype]=0;
    questStats.kills[mtype]++;
    checkQuest('kill',{m:mtype}); checkQuest('score',{});
    if(e.hpBar)e.hpBar.destroy();if(e.nameTag)e.nameTag.destroy();
    var ws=(e.pool===POOL_SHADOW),pool2=e.pool; e.destroy();
    if(selectedMode==='survival'){onWaveKill();return;}
    setTimeout(function(){
        if(!gameStarted)return;
        if(selectedMode==='adventure'){
            if(ws)spawnEnemy(null,POOL_SHADOW); else spawnEnemy(null,POOL_ADVENTURE);
        } else if(selectedMode==='bossrush'){
            spawnEnemy(null,POOL_BOSSRUSH);
        }
    },4000);
}

// ================================
// BOSS
// ================================
function spawnBoss(mode){
    if(bossSpawned)return; bossSpawned=true; SFX.bossIn();
    var bd=mode==='survival'?BOSS_SURVIVAL:BOSS_ADVENTURE;
    makeBossTex('modeBoss',bd);
    var x=mapWidth/2*tileSize, y=mapHeight/2*tileSize;
    boss=scene.physics.add.image(x,y,'modeBoss');
    boss.setCollideWorldBounds(true);
    boss.hp=bd.hp+playerLevel*100; boss.maxHp=boss.hp;
    boss.speed=bd.speed+playerLevel*5; boss.xp=bd.xp+playerLevel*50; boss.gold=bd.gold||150;
    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:700,yoyo:true,repeat:-1});
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossNameTxt)bossNameTxt.destroy();
    bossHPBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHPBar=scene.add.rectangle(640,50,500,24,bd.barColor).setScrollFactor(0).setDepth(15);
    bossNameTxt=scene.add.text(640,50,bd.name,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);
    showFloatingText('⚠️ '+bd.name+'!',player.x-130,player.y-100,'#ff4444');
    addChat('System','⚠️ '+bd.name+' appeared!','#ff4444');
    scene.physics.add.overlap(player,boss,onBossTouch,null,scene);
}
var lastBossHit=0;
function onBossTouch(player,boss){
    var now=Date.now();if(now-lastBossHit<1500)return;lastBossHit=now;
    var dmg=35+playerLevel*4; playerHealth-=dmg; SFX.hit();
    player.setTint(0xff0000); scene.cameras.main.shake(350,0.02);
    scene.time.delayedCall(250,function(){player.clearTint();});
    updateHPBar(); showFloatingText('-'+dmg,player.x,player.y-50,'#ff0000');
    if(playerHealth<=0){playerHealth=0;updateHPBar();showGameOver();}
}
function killBoss(){
    particles(boss.x,boss.y,0xff0000,30); particles(boss.x,boss.y,0xffff00,22);
    gainXP(boss.xp||400); score+=600*playerLevel; earnGold(boss.gold||150);
    if(scoreText)scoreText.setText('Score: '+score);
    for(var i=0;i<4;i++) spawnPotion(boss.x+Phaser.Math.Between(-80,80),boss.y+Phaser.Math.Between(-80,80),true);
    if(bossHPBg)bossHPBg.destroy();if(bossHPBar)bossHPBar.destroy();if(bossNameTxt)bossNameTxt.destroy();
    boss.destroy();boss=null;bossSpawned=false;
    questStats.bossKills++;checkQuest('boss',{});
    showFloatingText('🏆 BOSS DEFEATED!',player.x-120,player.y-90,'#ffff00');
    addChat('System','🏆 Boss defeated!','#ffff00');
    if(selectedMode==='bossrush'){ setTimeout(function(){if(gameStarted)nextBossRush();},3000); }
    else { scene.time.addEvent({delay:180000,callback:function(){if(gameStarted)spawnBoss(selectedMode);}}); }
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
    var p=potions.create(x,y,'potionTex');p.setCollideWorldBounds(true);
    scene.tweens.add({targets:p,y:p.y-12,duration:600,yoyo:true,repeat:-1});
    p.label=scene.add.text(x-8,y-28,'💊',{fontSize:'14px'});return p;
}
function onPotion(player,potion){
    inventory.push('Health Potion');updateInvPanel();
    if(potion.label)potion.label.destroy();potion.destroy();
    SFX.pickup();questStats.potionsCollected++;checkQuest('collect',{});
    showFloatingText('💊 Potion!',player.x,player.y-60,'#ff69b4');
}
function doPotion(){
    var i=inventory.indexOf('Health Potion');
    if(i===-1){showFloatingText('❌ No potions!',player.x,player.y-60,'#ff0000');return;}
    inventory.splice(i,1);updateInvPanel();
    playerHealth=Math.min(playerHealth+40,playerMaxHealth); updateHPBar(); SFX.pickup();
    showFloatingText('+40 HP!',player.x,player.y-60,'#44ff44');
}

// ================================
// ABILITIES
// ================================
function doAbility(){
    var now=Date.now();
    if(now-abilityLastUsed<playerClass.abilityCooldown){
        var rem=Math.ceil((playerClass.abilityCooldown-(now-abilityLastUsed))/1000);
        showFloatingText('⏳ '+rem+'s',player.x,player.y-60,'#888');return;
    }
    abilityLastUsed=now; SFX.ability();
    var btn=document.getElementById('abilityBtn');
    if(btn){btn.classList.remove('ready');btn.classList.add('cooldown');setTimeout(function(){btn.classList.remove('cooldown');btn.classList.add('ready');},playerClass.abilityCooldown);}
    if(selectedClass==='warrior')abilityWarrior();
    else if(selectedClass==='archer')abilityArcher();
    else if(selectedClass==='mage')abilityMage();
    else if(selectedClass==='rogue')abilityRogue();
    else if(selectedClass==='paladin')abilityPaladin();
    else if(selectedClass==='necromancer')abilityNecro();
    else if(selectedClass==='berserker')abilityBerserker();
    else if(selectedClass==='ranger')abilityRanger();
}
function abilityWarrior(){
    showFloatingText('🛡️ SHIELD BASH!',player.x-60,player.y-70,'#ff8888');
    particles(player.x,player.y,0xff6666,16);
    enemies.getChildren().forEach(function(e){
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<160){
            var prev=e.speed;e.speed=0;e.setTint(0xffff00);e.hp-=playerDamage*2.5;
            scene.time.delayedCall(2500,function(){if(e&&e.active){e.speed=prev;e.clearTint();}});
            if(e.hp<=0)killEnemy(e);
        }
    });
}
function abilityArcher(){
    showFloatingText('🏹 ARROW RAIN!',player.x-60,player.y-70,'#88ff88');
    for(var i=0;i<16;i++){
        (function(ang){
            var arr=scene.add.rectangle(player.x,player.y,22,5,0x88ff44).setRotation(ang).setDepth(10);
            scene.tweens.add({targets:arr,x:player.x+Math.cos(ang)*280,y:player.y+Math.sin(ang)*280,alpha:0,duration:450,onComplete:function(){arr.destroy();}});
            enemies.getChildren().forEach(function(e){var ex=e.x-player.x,ey=e.y-player.y,d=Math.sqrt(ex*ex+ey*ey);if(d<280&&Math.abs(Math.atan2(ey,ex)-ang)<0.25){e.hp-=playerDamage;if(e.hp<=0)killEnemy(e);}});
        })((i/16)*Math.PI*2);
    }
}
function abilityMage(){
    showFloatingText('🔥 FIREBALL!',player.x-50,player.y-70,'#8888ff');
    particles(player.x,player.y,0xff4400,28);scene.cameras.main.shake(500,0.02);
    enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<270){e.hp-=playerDamage*3.5;if(e.hp<=0)killEnemy(e);}});
    if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<270){boss.hp-=playerDamage*3.5;updateBossHP();if(boss.hp<=0)killBoss();}
}
function abilityRogue(){
    showFloatingText('👁️ VANISH!',player.x-40,player.y-70,'#ffaa44');
    playerInvisible=true;player.setAlpha(0.15);playerSpeed*=2;
    scene.time.delayedCall(3000,function(){playerInvisible=false;player.setAlpha(1);playerSpeed/=2;showFloatingText('👁️ Visible!',player.x-40,player.y-60,'#ffaa44');});
}
function abilityPaladin(){
    showFloatingText('✨ HOLY AURA!',player.x-60,player.y-70,'#ffddaa');
    var heal=Math.floor(playerMaxHealth*0.35);playerHealth=Math.min(playerHealth+heal,playerMaxHealth);updateHPBar();
    for(var i=0;i<20;i++){(function(a){var s=scene.add.circle(player.x+Math.cos(a)*80,player.y+Math.sin(a)*80,6,0xffff88).setDepth(15);scene.tweens.add({targets:s,x:player.x,y:player.y,alpha:0,duration:600,onComplete:function(){s.destroy();}});})(i/20*Math.PI*2);}
    enemies.getChildren().forEach(function(e){if(['skeleton','boneknight'].indexOf(e.mtype)!==-1&&Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<200){e.hp-=playerDamage*4;if(e.hp<=0)killEnemy(e);}});
    showFloatingText('+'+heal+' HP!',player.x,player.y-90,'#ffff44');
}
function abilityNecro(){
    showFloatingText('☠️ RAISE DEAD!',player.x-60,player.y-70,'#88ff88');
    for(var i=0;i<3;i++){(function(ang){
        var mx=player.x+Math.cos(ang)*60,my=player.y+Math.sin(ang)*60;
        var mn=scene.physics.add.image(mx,my,'minionTex');mn.speed=130;minions.push(mn);
        mn.label=scene.add.text(mx,my-28,'☠️',{fontSize:'14px'}).setOrigin(0.5);
        scene.physics.add.overlap(mn,enemies,function(m,e){if(!e||!e.active)return;e.hp-=15;if(e.hp<=0)killEnemy(e);});
        scene.time.delayedCall(15000,function(){if(mn&&mn.active){if(mn.label)mn.label.destroy();mn.destroy();minions=minions.filter(function(m){return m!==mn;});}});
    })((i/3)*Math.PI*2);}
}
function abilityBerserker(){
    showFloatingText('😤 BERSERK!',player.x-50,player.y-70,'#ff4444');
    isBerserking=true;playerSpeed*=1.6;playerDamage=Math.floor(playerDamage*2.5);
    player.setTint(0xff2200);scene.cameras.main.shake(300,0.015);
    scene.time.delayedCall(8000,function(){isBerserking=false;playerSpeed/=1.6;playerDamage=Math.floor(playerDamage/2.5);player.clearTint();showFloatingText('😤 Rage ended',player.x-50,player.y-60,'#888');});
}
function abilityRanger(){
    showFloatingText('🐺 WOLF PACK!',player.x-50,player.y-70,'#44ffaa');
    for(var i=0;i<2;i++){(function(){
        var wx=player.x+Phaser.Math.Between(-60,60),wy=player.y+Phaser.Math.Between(-60,60);
        var wf=scene.physics.add.image(wx,wy,'wolfTex');wf.speed=200;wolfPets.push(wf);
        wf.label=scene.add.text(wx,wy-28,'🐺',{fontSize:'14px'}).setOrigin(0.5);
        scene.physics.add.overlap(wf,enemies,function(w,e){if(!e||!e.active)return;var now=Date.now();if(!w.lb||now-w.lb>800){w.lb=now;e.hp-=20+playerLevel*3;if(e.hp<=0)killEnemy(e);}});
        scene.time.delayedCall(18000,function(){if(wf&&wf.active){if(wf.label)wf.label.destroy();wf.destroy();wolfPets=wolfPets.filter(function(w){return w!==wf;});}});
    })();}
}

// ================================
// XP + LEVEL
// ================================
function gainXP(amount){
    playerXP+=amount;
    if(player)showFloatingText('+'+amount+' XP',player.x,player.y-70,'#ffff44');
    if(playerXP>=xpToNextLevel)levelUp();
    if(xpBar)xpBar.width=202*(playerXP/xpToNextLevel);
    if(xpText)xpText.setText('XP: '+playerXP+'/'+xpToNextLevel);
}
function levelUp(){
    playerXP-=xpToNextLevel;playerLevel++;xpToNextLevel=playerLevel*100;
    playerMaxHealth+=20;playerHealth=playerMaxHealth;playerSpeed+=5;playerDamage+=5;
    SFX.levelUp();
    scene.tweens.add({targets:player,scaleX:1.5,scaleY:1.5,duration:200,yoyo:true,repeat:2});
    player.setTint(0xffff00);scene.time.delayedCall(800,function(){if(!isBerserking)player.clearTint();});
    if(levelText)levelText.setText('⭐ Lv.'+playerLevel);
    if(playerNameText)playerNameText.setText(playerClass.icon+' '+playerName+' Lv.'+playerLevel);
    updateHPBar();checkQuest('level',{});
    showFloatingText('🌟 LEVEL UP! '+playerLevel,player.x-70,player.y-90,'#ffff00');
    doSave(); // auto-save on level up
}

// ================================
// DAY/NIGHT
// ================================
function startDayNight(){
    timeText=scene.add.text(640,15,'☀️ Day',{fontSize:'15px',fill:'#ffff88'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(10);
    scene.time.addEvent({delay:35000,loop:true,callback:function(){
        dayTime=dayTime===0?1:0;
        if(dayTime===1){timeText.setText('🌙 Night');scene.tweens.add({targets:nightOverlay,alpha:0.5,duration:3000});enemies.getChildren().forEach(function(e){e.speed*=1.25;});showFloatingText('🌙 Night!',player.x-60,player.y-80,'#aaaaff');}
        else{timeText.setText('☀️ Day');scene.tweens.add({targets:nightOverlay,alpha:0,duration:3000});enemies.getChildren().forEach(function(e){e.speed/=1.25;});showFloatingText('☀️ Day!',player.x-40,player.y-80,'#ffff88');}
    }});
}

// ================================
// SURVIVE TIMER
// ================================
function startSurviveTimer(){
    scene.time.addEvent({delay:1000,loop:true,callback:function(){
        if(!gameStarted||!player||!player.active)return;
        surviveTimer++;checkQuest('survive',{});
        if(surviveTimer%5===0&&playerHealth<playerMaxHealth){playerHealth=Math.min(playerHealth+1,playerMaxHealth);updateHPBar();}
    }});
}

// ================================
// TOMBSTONE — FIX 10: 5 sec, mode-tagged
// ================================
function spawnTombstone(x,y){
    addTombVisual(x,y,playerName,playerLevel,'#cccccc');
    if(tombstonesRef&&myId){
        var ref=tombstonesRef.push({x:x,y:y,name:playerClass.icon+' '+playerName,level:playerLevel,mode:selectedMode,sid:myId,time:Date.now()});
        // FIX 10: auto-delete from Firebase after 5 seconds
        setTimeout(function(){if(ref)ref.remove();},5000);
    }
}

function addTombVisual(x,y,name,level,color){
    if(!scene)return;
    var stone=scene.add.image(x,y,'tombTex').setDepth(7);
    var label=scene.add.text(x,y-34,'💀 '+name+'\nLv.'+level,{fontSize:'10px',fill:color||'#cccccc',stroke:'#000',strokeThickness:2,align:'center'}).setOrigin(0.5).setDepth(7);
    tombstones.push({stone:stone,label:label});
    // FIX 10: disappear after 5 seconds (not 10!)
    setTimeout(function(){
        if(!scene)return;
        scene.tweens.add({targets:[stone,label],alpha:0,duration:1500,onComplete:function(){if(stone)stone.destroy();if(label)label.destroy();}});
    },5000);
}

// ================================
// SAVE — shows popup
// ================================
function doSave(){
    saveGame(); SFX.save();
    var notif=document.getElementById('saveNotif');
    var notifText=document.getElementById('saveNotifText');
    if(notif&&notifText){
        notifText.textContent='✅ Saved! Lv.'+playerLevel+'  💰'+playerGold+'  Score:'+score;
        notif.style.display='block'; notif.style.opacity='1';
        setTimeout(function(){
            notif.style.transition='opacity 0.6s'; notif.style.opacity='0';
            setTimeout(function(){if(notif)notif.style.display='none';},700);
        },2500);
    }
    showFloatingText('💾 Saved!',player.x,player.y-60,'#00ffff');
}

// ================================
// BUILD UI
// ================================
function buildUI(){
    var hpBg=scene.add.rectangle(16,16,206,22,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    healthBar=scene.add.rectangle(18,18,202,18,0x22cc22).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    healthText=scene.add.text(22,18,'HP: '+playerHealth+'/'+playerMaxHealth,{fontSize:'12px',fill:'#fff'}).setScrollFactor(0).setDepth(11);
    var xpBg=scene.add.rectangle(16,44,206,14,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    xpBar=scene.add.rectangle(18,46,0,10,0xdddd00).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    xpText=scene.add.text(22,45,'XP: 0/'+xpToNextLevel,{fontSize:'10px',fill:'#ddd'}).setScrollFactor(0).setDepth(11);
    scene.add.rectangle(16,62,206,10,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    staminaBar=scene.add.rectangle(18,64,202,6,0x44aaff).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    levelText=scene.add.text(16,76,'⭐ Lv.'+playerLevel,{fontSize:'15px',fill:'#ffdd00'}).setScrollFactor(0).setDepth(10);
    scoreText=scene.add.text(16,96,'Score: '+score,{fontSize:'14px',fill:'#fff'}).setScrollFactor(0).setDepth(10);
    goldText=scene.add.text(16,115,'💰 '+playerGold,{fontSize:'13px',fill:'#ffdd44'}).setScrollFactor(0).setDepth(10);
    scene.add.text(16,133,playerClass.icon+' '+playerClass.name,{fontSize:'12px',fill:'#ffbb88'}).setScrollFactor(0).setDepth(10);
    if(!isMobile)scene.add.text(16,696,'WASD:Move  SHIFT:Sprint  SPACE:Attack  E:'+playerClass.ability+'  F:Potion  I:Bag  T:Chat  ENTER:Save',{fontSize:'10px',fill:'#88aa88'}).setScrollFactor(0).setDepth(10);
    playerNameText=scene.add.text(0,0,playerClass.icon+' '+playerName+' Lv.'+playerLevel,{fontSize:'13px',fill:'#fff',stroke:'#000',strokeThickness:2});
}

function updateHPBar(){
    if(!healthBar||!healthText)return;
    var p=Math.max(0,playerHealth)/playerMaxHealth;
    healthBar.width=202*p;
    if(p>0.6)healthBar.setFillStyle(0x22cc22);else if(p>0.3)healthBar.setFillStyle(0xddcc00);else healthBar.setFillStyle(0xdd2222);
    healthText.setText('HP: '+Math.max(0,Math.floor(playerHealth))+'/'+playerMaxHealth);
    // Sync health to Firebase so others can see
    if(myRef)myRef.update({hp:Math.floor(playerHealth),maxHp:playerMaxHealth});
}

// ================================
// INVENTORY
// ================================
function buildInventory(){
    inventoryPanel=scene.add.container(0,0);
    var bg=scene.add.rectangle(640,360,420,310,0x0a0a0a,0.95);
    var title=scene.add.text(640,222,'🎒 Inventory',{fontSize:'22px',fill:'#ffaa00'}).setOrigin(0.5);
    var hint=scene.add.text(640,465,'F: Use Potion   I: Close',{fontSize:'12px',fill:'#555'}).setOrigin(0.5);
    inventoryPanel.add([bg,title,hint]);inventoryPanel.setScrollFactor(0).setDepth(30);inventoryPanel.setVisible(false);
}
function updateInvPanel(){
    inventoryTexts.forEach(function(t){t.destroy();}); inventoryTexts=[];
    if(inventory.length===0){var e=scene.add.text(640,360,'No items...',{fontSize:'16px',fill:'#444'}).setOrigin(0.5).setScrollFactor(0).setDepth(31);inventoryTexts.push(e);return;}
    var counts={};inventory.forEach(function(i){counts[i]=(counts[i]||0)+1;});
    var y=275;Object.keys(counts).forEach(function(item){var t=scene.add.text(640,y,'💊 '+item+'  ×'+counts[item],{fontSize:'18px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(31);inventoryTexts.push(t);y+=44;});
}
function toggleInv(){inventoryOpen=!inventoryOpen;inventoryPanel.setVisible(inventoryOpen);if(inventoryOpen)updateInvPanel();}

// ================================
// HELPERS
// ================================
function particles(x,y,color,count){
    count=count||12;
    for(var i=0;i<count;i++){
        (function(a){var p=scene.add.circle(x,y,Phaser.Math.Between(3,9),color).setDepth(15);var spd=Phaser.Math.Between(70,190);scene.tweens.add({targets:p,x:x+Math.cos(a)*spd,y:y+Math.sin(a)*spd,alpha:0,scaleX:0,scaleY:0,duration:Phaser.Math.Between(350,700),onComplete:function(){p.destroy();}});})(i/count*Math.PI*2);
    }
}
function showFloatingText(msg,x,y,color){
    var t=scene.add.text(x,y,msg,{fontSize:'15px',fill:color,stroke:'#000000',strokeThickness:3}).setDepth(20);
    scene.tweens.add({targets:t,y:y-55,alpha:0,duration:1400,onComplete:function(){t.destroy();}});
}
// Alias
var float=showFloatingText;

// ================================
// CHAT
// ================================
function openChat(){
    chatOpen=true;var input=document.getElementById('chatInput');if(!input)return;
    input.disabled=false;input.focus();
    input.onkeydown=function(e){
        if(e.key==='Enter'){var msg=input.value.trim();if(msg){addChat(playerName,msg,'#aaffaa');if(chatRef&&myId)chatRef.push({name:playerClass.icon+' '+playerName,msg:msg,sid:myId,t:Date.now()});}input.value='';input.disabled=true;chatOpen=false;input.blur();}
        if(e.key==='Escape'){input.value='';input.disabled=true;chatOpen=false;input.blur();}
        e.stopPropagation();
    };
}
function addChat(name,msg,color){
    var msgs=document.getElementById('chatMessages');if(!msgs)return;
    var div=document.createElement('div');div.style.color=color||'#fff';div.style.marginBottom='3px';
    div.innerHTML='<b>'+name+':</b> '+msg;msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
}

// ================================
// SAVE / LOAD
// ================================
function saveGame(){
    localStorage.setItem('rpgGameSave',JSON.stringify({
        playerLevel:playerLevel,playerXP:playerXP,playerHealth:playerHealth,
        playerMaxHealth:playerMaxHealth,playerSpeed:playerSpeed,playerDamage:playerDamage,
        xpToNextLevel:xpToNextLevel,score:score,inventory:inventory,
        playerName:playerName,selectedClass:selectedClass,questStats:questStats
    }));
    // Save gold to player data
    if(typeof playerData!=='undefined'){playerData.gold=playerGold;savePlayerData();}
    console.log('Saved! Lv.'+playerLevel+' Score:'+score+' Gold:'+playerGold);
}
function loadGame(){
    try{
        var saved=localStorage.getItem('rpgGameSave');if(!saved)return;
        var d=JSON.parse(saved);if(!d)return;
        playerLevel=d.playerLevel||1; playerXP=d.playerXP||0;
        playerHealth=d.playerHealth||100; playerMaxHealth=d.playerMaxHealth||100;
        playerSpeed=d.playerSpeed||200; playerDamage=d.playerDamage||20;
        xpToNextLevel=d.xpToNextLevel||100; score=d.score||0;
        inventory=d.inventory||[];playerName=d.playerName||'Hero';
        if(d.questStats)questStats=d.questStats;
        if(d.selectedClass)window._selectedClass=d.selectedClass;
        console.log('Loaded! Lv.'+playerLevel);
    }catch(e){console.log('No save');}
}

// ================================
// MINIMAP
// ================================
function updateMinimap(){
    var canvas=document.getElementById('minimap');if(!canvas||!player)return;
    canvas.width=130;canvas.height=130;
    var ctx=canvas.getContext('2d'),sx=130/(mapWidth*tileSize),sy=130/(mapHeight*tileSize);
    var bgMap={adventure:'#1a4a1a',survival:'#3d1500',bossrush:'#0d0011',pvp:'#1a1a22'};
    ctx.fillStyle=inShadowRealm?'#110022':(bgMap[selectedMode]||'#1a4a1a');ctx.fillRect(0,0,130,130);
    enemies.getChildren().forEach(function(e){ctx.fillStyle='#ff4444';ctx.fillRect(e.x*sx-2,e.y*sy-2,4,4);});
    if(boss&&boss.active){ctx.fillStyle='#ff0000';ctx.fillRect(boss.x*sx-5,boss.y*sy-5,10,10);}
    tombstones.forEach(function(ts){if(ts.stone&&ts.stone.active){ctx.fillStyle='#777';ctx.fillRect(ts.stone.x*sx-2,ts.stone.y*sy-2,4,4);}});
    // FIX 7: only show players in same dimension on minimap
    Object.values(otherPlayers).forEach(function(op){
        if(op.dimension!==currentDimension)return;
        ctx.fillStyle='#cc88ff';ctx.fillRect(op.sprite.x*sx-2,op.sprite.y*sy-2,5,5);
    });
    if(selectedMode==='adventure'&&!inShadowRealm){ctx.fillStyle='#aa00ff';ctx.fillRect(22*tileSize*sx-3,22*tileSize*sy-3,6,6);}
    if(selectedMode==='adventure'&&inShadowRealm){ctx.fillStyle='#ffaa00';ctx.fillRect(4*tileSize*sx-3,4*tileSize*sy-3,6,6);}
    var pc='#'+(skinColor?skinColor.toString(16).padStart(6,'0'):'4488ff');
    ctx.fillStyle=pc;ctx.beginPath();ctx.arc(player.x*sx,player.y*sy,5,0,Math.PI*2);ctx.fill();
}

// ================================
// GAME OVER
// ================================
function showGameOver(){
    player.setVelocity(0);player.setActive(false);gameStarted=false;window.gameStarted=false;
    spawnTombstone(player.x,player.y); SFX.over();
    if(myRef)myRef.update({alive:false});
    setTimeout(function(){
        scene.cameras.main.fade(2000,0,0,0,false,function(cam,prog){
            if(prog!==1)return;
            var modeLabels={adventure:'🌲 Adventure',survival:'🔥 Survival — Wave '+currentWave,bossrush:'💀 Boss Rush — Boss #'+bossRushIdx,pvp:'⚔️ PvP Arena'};
            var overlay=document.createElement('div');
            overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s ease;font-family:Arial,sans-serif;color:#fff;';
            overlay.innerHTML=
                '<div style="text-align:center;max-width:560px;padding:36px;">'+
                '<div style="font-size:86px;margin-bottom:12px;">💀</div>'+
                '<h1 style="font-size:54px;color:#ff2222;letter-spacing:6px;text-shadow:0 0 40px #ff0000;margin-bottom:6px;">GAME OVER</h1>'+
                '<p style="font-size:15px;color:#ffaa00;margin-bottom:4px;">'+modeLabels[selectedMode]+'</p>'+
                '<p style="font-size:18px;color:#888;margin-bottom:4px;">'+(playerClass?playerClass.icon:'')+' <b>'+playerName+'</b> — Level '+playerLevel+'</p>'+
                '<p style="font-size:24px;color:#ffdd44;margin-bottom:6px;">Score: '+score+'</p>'+
                '<p style="font-size:18px;color:var(--gold);margin-bottom:24px;">💰 Gold earned this run</p>'+
                '<p style="font-size:12px;color:#333;font-style:italic;margin-bottom:24px;">Your tombstone remains for 5 seconds...</p>'+
                '<div style="display:flex;gap:14px;justify-content:center;">'+
                '<button id="restartBtn" style="padding:12px 32px;font-size:16px;background:linear-gradient(135deg,#aa0000,#dd2222);color:#fff;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Arial;">⚔️ Play Again</button>'+
                '<button id="menuBtn" style="padding:12px 32px;font-size:16px;background:#1a1a1a;color:#fff;border:2px solid #444;border-radius:10px;cursor:pointer;font-family:Arial;">🏠 Main Menu</button>'+
                '</div><p style="margin-top:14px;font-size:11px;color:#333;">Press R to play again</p></div>';
            document.body.appendChild(overlay);
            setTimeout(function(){overlay.style.opacity='1';},50);
            function restart(){
                overlay.style.opacity='0';
                setTimeout(function(){if(overlay.parentNode)document.body.removeChild(overlay);},1000);
                playerHealth=100;playerMaxHealth=100;playerXP=0;playerLevel=1;playerSpeed=200;playerDamage=20;
                xpToNextLevel=100;score=0;inventory=[];bossSpawned=false;currentDimension=0;surviveTimer=0;
                minions=[];wolfPets=[];isBerserking=false;playerInvisible=false;inShadowRealm=false;
                currentWave=0;bossRushIdx=0;normalTiles=[];shadowTiles=[];tombstones=[];
                gameStarted=false;window.gameStarted=false;
                localStorage.removeItem('rpgGameSave');
                scene.cameras.main.fadeIn(100);scene.scene.restart();
                setTimeout(function(){
                    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
                    document.getElementById('mainMenu').classList.add('active');
                },500);
            }
            document.getElementById('restartBtn').onclick=restart;
            document.getElementById('menuBtn').onclick=restart;
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
    var speed=playerSpeed,moving=false;

    // Sprint
    if((shiftKey&&shiftKey.isDown||window.touchSprinting)&&stamina>0){speed*=1.55;stamina=Math.max(0,stamina-0.8);}
    else{stamina=Math.min(maxStamina,stamina+0.3);}
    if(staminaBar)staminaBar.width=202*(stamina/maxStamina);

    // Move
    if(cursors.left.isDown||wasd.left.isDown){player.setVelocityX(-speed);playerFacing=-1;player.setFlipX(true);moving=true;}
    else if(cursors.right.isDown||wasd.right.isDown){player.setVelocityX(speed);playerFacing=1;player.setFlipX(false);moving=true;}
    if(cursors.up.isDown||wasd.up.isDown){player.setVelocityY(-speed);moving=true;}
    else if(cursors.down.isDown||wasd.down.isDown){player.setVelocityY(speed);moving=true;}

    // Joystick
    if(joystickActive&&(Math.abs(joystickDX)>0.1||Math.abs(joystickDY)>0.1)){
        player.setVelocityX(joystickDX*speed);player.setVelocityY(joystickDY*speed);
        if(joystickDX<-0.1){playerFacing=-1;player.setFlipX(true);}else if(joystickDX>0.1){playerFacing=1;player.setFlipX(false);}
        moving=true;
    }

    if(moving)player.y+=Math.sin(Date.now()/120)*0.5;
    if(attackIndicator)attackIndicator.setPosition(player.x,player.y);

    // Send position to Firebase
    sendPos();

    // ====== SMOOTH OTHER PLAYERS — lerp ======
    Object.values(otherPlayers).forEach(function(op){
        if(!op||!op.sprite)return;
        var lerp=0.18;
        op.sprite.x+=(op.targetX-op.sprite.x)*lerp;
        op.sprite.y+=(op.targetY-op.sprite.y)*lerp;
        if(op.nameTag)op.nameTag.setPosition(op.sprite.x-30,op.sprite.y-55);
        if(op.hpBg)op.hpBg.setPosition(op.sprite.x,op.sprite.y-48);
        if(op.hpBar)op.hpBar.setPosition(op.sprite.x-20,op.sprite.y-48);
    });

    updateMinimap();
    if(playerNameText)playerNameText.setPosition(player.x-40,player.y-60);
    potions.getChildren().forEach(function(p){if(p.label)p.label.setPosition(p.x-8,p.y-28);});

    // Boss AI
    if(boss&&boss.active){
        var bdx=player.x-boss.x,bdy=player.y-boss.y,bd=Math.sqrt(bdx*bdx+bdy*bdy);
        if(bd>0){boss.setVelocityX((bdx/bd)*boss.speed);boss.setVelocityY((bdy/bd)*boss.speed);}
        boss.rotation+=0.015;
    }

    // Minion AI
    minions.forEach(function(m){
        if(!m||!m.active)return;
        var dx=player.x-m.x,dy=player.y-m.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d>80&&d>0){m.setVelocityX((dx/d)*m.speed);m.setVelocityY((dy/d)*m.speed);}else m.setVelocity(0);
        if(m.label)m.label.setPosition(m.x,m.y-28);
    });

    // Wolf AI
    wolfPets.forEach(function(w){
        if(!w||!w.active)return;
        var closest=null,cd=300;
        enemies.getChildren().forEach(function(e){if(!e||!e.active)return;var d=Phaser.Math.Distance.Between(w.x,w.y,e.x,e.y);if(d<cd){cd=d;closest=e;}});
        if(closest){var wdx=closest.x-w.x,wdy=closest.y-w.y,wd=Math.sqrt(wdx*wdx+wdy*wdy);if(wd>0){w.setVelocityX((wdx/wd)*w.speed);w.setVelocityY((wdy/wd)*w.speed);}}
        else{var pdx=player.x-w.x,pdy=player.y-w.y,pd=Math.sqrt(pdx*pdx+pdy*pdy);if(pd>100&&pd>0){w.setVelocityX((pdx/pd)*150);w.setVelocityY((pdy/pd)*150);}else w.setVelocity(0);}
        if(w.label)w.label.setPosition(w.x,w.y-28);
    });

    // Enemy AI
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active||e.speed===0)return;
        var dx=player.x-e.x,dy=player.y-e.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<280&&d>0){e.setVelocityX((dx/d)*e.speed);e.setVelocityY((dy/d)*e.speed);}
        else{
            var px=(e.px||e.x)-e.x,py=(e.py||e.y)-e.y,pd=Math.sqrt(px*px+py*py);
            if(pd>100&&pd>0){e.setVelocityX((px/pd)*e.speed*0.4);e.setVelocityY((py/pd)*e.speed*0.4);}
            else if(Math.random()<0.008){e.setVelocityX(Phaser.Math.Between(-40,40));e.setVelocityY(Phaser.Math.Between(-40,40));}
        }
        var pool=e.pool||currentPool;
        var mData=pool?pool[e.mtype]:null;
        var ms=mData?mData.size:40;
        if(e.hpBar){e.hpBar.setPosition(e.x,e.y-35);e.hpBar.width=ms*(e.hp/e.maxHp);}
        if(e.nameTag)e.nameTag.setPosition(e.x,e.y-50);
    });
}
