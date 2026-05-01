// ================================
// PIXEL WORLD RPG — Full Version
// Different maps, bosses, smooth
// movement, class textures, save!
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
// CLASSES — each has unique look
// ================================
var CLASSES = {
    warrior:     { name:'Warrior',     icon:'⚔️',  color:0xff4444, bodyColor:0xcc2222, headColor:0xffddaa, detailColor:0xffaa00, hp:220, speed:155, damage:35, attackRange:80,  ability:'Shield Bash', abilityIcon:'🛡️', abilityCooldown:5000,  attackCooldown:700 },
    archer:      { name:'Archer',      icon:'🏹',  color:0x44cc44, bodyColor:0x228822, headColor:0xffddaa, detailColor:0x88ff44, hp:110, speed:285, damage:28, attackRange:200, ability:'Arrow Rain',  abilityIcon:'🏹', abilityCooldown:4000,  attackCooldown:500 },
    mage:        { name:'Mage',        icon:'🧙',  color:0x4444ff, bodyColor:0x2222aa, headColor:0xffddbb, detailColor:0xaa88ff, hp:80,  speed:200, damage:70, attackRange:150, ability:'Fireball',    abilityIcon:'🔥', abilityCooldown:6000,  attackCooldown:900 },
    rogue:       { name:'Rogue',       icon:'🗡️', color:0xcc8800, bodyColor:0x885500, headColor:0xffccaa, detailColor:0xffdd44, hp:110, speed:265, damage:50, attackRange:70,  ability:'Vanish',      abilityIcon:'👁️',abilityCooldown:8000,  attackCooldown:400 },
    paladin:     { name:'Paladin',     icon:'⚜️', color:0xffdd88, bodyColor:0xddaa44, headColor:0xffeedd, detailColor:0xffffff, hp:180, speed:155, damage:28, attackRange:90,  ability:'Holy Aura',   abilityIcon:'✨', abilityCooldown:7000,  attackCooldown:800 },
    necromancer: { name:'Necromancer', icon:'💀',  color:0x44ff88, bodyColor:0x116633, headColor:0xaaffcc, detailColor:0x00ff44, hp:90,  speed:195, damage:40, attackRange:130, ability:'Raise Dead',  abilityIcon:'☠️', abilityCooldown:9000,  attackCooldown:800 },
    berserker:   { name:'Berserker',   icon:'🪓',  color:0xff2200, bodyColor:0xaa1100, headColor:0xffbbaa, detailColor:0xff6600, hp:180, speed:195, damage:55, attackRange:85,  ability:'Berserk Rage',abilityIcon:'😤', abilityCooldown:10000, attackCooldown:500 },
    ranger:      { name:'Ranger',      icon:'🌿',  color:0x44ffaa, bodyColor:0x228855, headColor:0xccffee, detailColor:0x88ffcc, hp:130, speed:245, damage:32, attackRange:160, ability:'Wolf Pack',   abilityIcon:'🐺', abilityCooldown:12000, attackCooldown:600 }
};

// ================================
// MONSTERS
// ================================
var MONSTERS = {
    goblin:   { name:'👹 Goblin',   color:0xff4444, size:36, hp:30,  speed:80,  damage:8,  xp:20, score:10 },
    troll:    { name:'👺 Troll',    color:0x44aa44, size:58, hp:90,  speed:45,  damage:22, xp:45, score:28 },
    skeleton: { name:'💀 Skeleton', color:0xcccccc, size:36, hp:40,  speed:115, damage:14, xp:30, score:20 },
    demon:    { name:'😈 Demon',    color:0xaa00ff, size:44, hp:65,  speed:95,  damage:26, xp:55, score:38 },
    orc:      { name:'🗡️ Orc',     color:0x886600, size:50, hp:70,  speed:65,  damage:18, xp:38, score:25 },
    wolf:     { name:'🐺 Wolf',     color:0x888888, size:34, hp:25,  speed:140, damage:10, xp:18, score:12 }
};

var SHADOW_MONSTERS = {
    wraith:  { name:'👻 Wraith',  color:0x8888ff, size:38, hp:55,  speed:125, damage:20, xp:42, score:32 },
    vampire: { name:'🧛 Vampire', color:0xaa0044, size:42, hp:75,  speed:88,  damage:28, xp:55, score:44 },
    banshee: { name:'🌀 Banshee', color:0x00aaff, size:34, hp:38,  speed:155, damage:32, xp:48, score:36 },
    lich:    { name:'☠️ Lich',    color:0x440088, size:50, hp:110, speed:58,  damage:38, xp:75, score:58 }
};

// ================================
// MAP CONFIGS — different per mode
// ================================
var MAP_CONFIGS = {
    adventure: {
        bgColor: '#1a8f2d',
        grassColors: [0x2d8a2d, 0x267326],
        pathColor: 0x8B6914,
        waterColor: 0x1155aa,
        name: 'Green World'
    },
    survival: {
        bgColor: '#1a1a1a',
        grassColors: [0x333333, 0x2a2a2a],
        pathColor: 0x555555,
        waterColor: 0x002244,
        name: 'Dark Arena'
    },
    bossrush: {
        bgColor: '#1a0000',
        grassColors: [0x330000, 0x220000],
        pathColor: 0x661100,
        waterColor: 0x440000,
        name: 'Volcanic Dungeon'
    },
    pvp: {
        bgColor: '#000033',
        grassColors: [0x000066, 0x000055],
        pathColor: 0x003366,
        waterColor: 0x0000aa,
        name: 'Crystal Arena'
    }
};

// ================================
// BOSS CONFIGS — different per mode
// ================================
var BOSS_CONFIGS = {
    adventure: {
        name: '💀 DRAGON KING',
        color: 0x660000, eyeColor: 0xff0000, mouthColor: 0xffff00,
        hp: 600, speed: 55, xpReward: 400,
        barColor: 0xff0000,
        spawnMsg: '⚠️ THE DRAGON KING APPEARS!'
    },
    survival: {
        name: '🕷️ SWARM QUEEN',
        color: 0x222200, eyeColor: 0xffff00, mouthColor: 0x00ff00,
        hp: 400, speed: 80, xpReward: 500,
        barColor: 0xaaff00,
        spawnMsg: '⚠️ THE SWARM QUEEN AWAKENS!',
        spawnsMinions: true
    },
    bossrush: {
        name: '🔥 FIRE TITAN',
        color: 0xff4400, eyeColor: 0xffff00, mouthColor: 0xff8800,
        hp: 350, speed: 70, xpReward: 300,
        barColor: 0xff4400,
        spawnMsg: '⚠️ THE FIRE TITAN RISES!'
    }
};

// Boss rush sequence
var BOSS_RUSH_SEQUENCE = [
    { name:'🔥 Fire Titan',   color:0xff4400, eyeColor:0xffff00, hp:350, speed:70,  xpReward:300, barColor:0xff4400 },
    { name:'❄️ Ice Giant',    color:0x0088ff, eyeColor:0xffffff, hp:450, speed:55,  xpReward:400, barColor:0x0088ff },
    { name:'⚡ Storm Lord',   color:0xffff00, eyeColor:0xffffff, hp:500, speed:85,  xpReward:450, barColor:0xffff00 },
    { name:'🌑 Shadow King',  color:0x220044, eyeColor:0xff00ff, hp:600, speed:65,  xpReward:500, barColor:0xaa00ff },
    { name:'💀 Dragon King',  color:0x660000, eyeColor:0xff0000, hp:800, speed:60,  xpReward:700, barColor:0xff0000 }
];

// ================================
// QUEST TEMPLATES
// ================================
var QUEST_TEMPLATES = [
    { id:'q1',  desc:'Kill 5 Goblins',    type:'kill',     monster:'goblin',   target:5,   reward:60,  xpReward:50  },
    { id:'q2',  desc:'Kill 3 Trolls',     type:'kill',     monster:'troll',    target:3,   reward:80,  xpReward:75  },
    { id:'q3',  desc:'Kill 4 Skeletons',  type:'kill',     monster:'skeleton', target:4,   reward:70,  xpReward:60  },
    { id:'q4',  desc:'Kill 2 Demons',     type:'kill',     monster:'demon',    target:2,   reward:100, xpReward:90  },
    { id:'q5',  desc:'Collect 3 Potions', type:'collect',                      target:3,   reward:50,  xpReward:40  },
    { id:'q6',  desc:'Reach Level 3',     type:'level',                        target:3,   reward:150, xpReward:100 },
    { id:'q7',  desc:'Defeat the Boss',   type:'boss',                         target:1,   reward:500, xpReward:400 },
    { id:'q8',  desc:'Enter Shadow Realm',type:'dimension',                    target:1,   reward:100, xpReward:80  },
    { id:'q9',  desc:'Survive 2 minutes', type:'survive',                      target:120, reward:200, xpReward:150 },
    { id:'q10', desc:'Score 500 points',  type:'score',                        target:500, reward:180, xpReward:120 },
    { id:'q11', desc:'Kill 3 Wraiths',    type:'kill',     monster:'wraith',   target:3,   reward:120, xpReward:100 },
    { id:'q12', desc:'Reach Level 5',     type:'level',                        target:5,   reward:300, xpReward:200 }
];

// ================================
// GAME VARIABLES
// ================================
var player, cursors, wasd, shiftKey;
var enemies, potions, portals;
var minions = [], wolfPets = [];
var boss, bossHealthBar, bossHealthBarBg, bossNameText;
var bossSpawned = false;
var scene;
var gameStarted = false;
var selectedClass = 'warrior';
var selectedMode  = 'adventure';
var playerClass;
var playerFacing = 1;
var otherPlayers = {};

// Touch
var joystickActive=false, joystickStartX=0, joystickStartY=0, joystickDX=0, joystickDY=0;

// Player stats
var playerHealth=100, playerMaxHealth=100;
var playerXP=0, playerLevel=1;
var playerSpeed=200, playerDamage=20, playerAttackRange=80;
var xpToNextLevel=100, score=0;
var lastHitTime=0, lastAttackTime=0;
var playerName='Hero';
var inventory=[], inventoryOpen=false, chatOpen=false;
var abilityLastUsed=0, playerInvisible=false, isBerserking=false;

// Stamina
var stamina=100, maxStamina=100, staminaBar;

// Dimension
var currentDimension=0, dimensionOverlay, nightOverlay;
var shadowTiles=[], normalTiles=[], portalCooldown=false;

// Quests
var activeQuests=[];
var questStats={ kills:{}, potionsCollected:0, bossKills:0, dimensionVisited:0, surviveTime:0 };

// Tombstones
var tombstones=[], surviveTimer=0, dayTime=0, timeText;

// UI
var healthBar, healthBarBg, healthText;
var xpBar, xpBarBg, xpText;
var levelText, scoreText, playerNameText;
var inventoryPanel, inventoryTexts=[];
var attackIndicator;

// Map
var tileSize=64, mapWidth=30, mapHeight=30;

// Firebase
var myPlayerId=null, playersRef=null, chatRef=null, tombstonesRef=null;

// Game mode
var currentWave=0, waveEnemyCount=0, waveEnemiesKilled=0;
var bossRushIndex=0;
var pvpMode=false;

// ================================
// START BUTTON
// ================================
document.getElementById('startBtn').onclick = function() {
    var v = document.getElementById('nameInput').value.trim();
    if (v) playerName = v;
    selectedClass = window._selectedClass || 'warrior';
    selectedMode  = window._selectedMode  || 'adventure';

    document.getElementById('startMenu').style.display = 'none';

    function show(id){ var el=document.getElementById(id); if(el) el.style.display='block'; }
    function showFlex(id){ var el=document.getElementById(id); if(el) el.style.display='flex'; }

    show('chatBox'); show('playerCount'); show('minimap');
    show('dimensionIndicator'); show('questPanel'); show('gameModeIndicator');

    var modeLabels = { adventure:'🌍 Adventure', survival:'🌊 Survival', bossrush:'💀 Boss Rush', pvp:'⚔️ PvP Arena' };
    var mi = document.getElementById('gameModeIndicator');
    if (mi) mi.textContent = modeLabels[selectedMode] || '🌍 Adventure';

    if (selectedMode === 'survival') show('waveIndicator');

    if (isMobile) {
        show('joystickZone'); showFlex('actionButtons');
        var icon2 = document.getElementById('abilityIcon2');
        if (icon2) icon2.textContent = CLASSES[selectedClass].abilityIcon;
    } else {
        showFlex('abilityBar'); show('attackHint');
        setTimeout(function(){
            var hint=document.getElementById('attackHint');
            if(hint){ hint.style.transition='opacity 1s'; hint.style.opacity='0'; setTimeout(function(){if(hint)hint.style.display='none';},1000); }
        },4000);
    }

    var icon = document.getElementById('abilityIcon');
    if (icon) icon.textContent = CLASSES[selectedClass].abilityIcon;

    window.gameStarted = true;
    gameStarted = true;
};

document.getElementById('nameInput').onkeydown = function(e){ if(e.key==='Enter') document.getElementById('startBtn').click(); };

// Register touch functions
window._doAttack  = null;
window._doAbility = null;
window._doPotion  = null;

// ================================
// SOUNDS
// ================================
function playTone(freq,dur,type) {
    try {
        var ctx=new(window.AudioContext||window.webkitAudioContext)();
        var osc=ctx.createOscillator(), gain=ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type=type||'sine'; osc.frequency.value=freq;
        gain.gain.setValueAtTime(0.3,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime+dur);
    } catch(e){}
}
var sounds = {
    hit:       function(){ playTone(150,0.1,'square'); },
    attack:    function(){ playTone(220,0.06,'sawtooth'); },
    enemyDie:  function(){ playTone(80,0.2,'sawtooth'); },
    levelUp:   function(){ playTone(523,0.1,'sine'); setTimeout(function(){playTone(659,0.1,'sine');},100); setTimeout(function(){playTone(784,0.2,'sine');},200); },
    pickup:    function(){ playTone(600,0.08,'sine'); },
    save:      function(){ playTone(523,0.08,'sine'); setTimeout(function(){playTone(659,0.08,'sine');},80); setTimeout(function(){playTone(784,0.15,'sine');},160); },
    ability:   function(){ playTone(300,0.3,'square'); },
    portal:    function(){ playTone(200,0.2,'sine'); setTimeout(function(){playTone(400,0.3,'sine');},200); },
    questDone: function(){ playTone(660,0.1,'sine'); setTimeout(function(){playTone(880,0.2,'sine');},150); },
    bossSpawn: function(){ playTone(100,0.5,'sawtooth'); setTimeout(function(){playTone(80,0.5,'sawtooth');},300); },
    gameOver:  function(){ playTone(400,0.4,'sine'); setTimeout(function(){playTone(350,0.4,'sine');},400); setTimeout(function(){playTone(300,0.4,'sine');},800); setTimeout(function(){playTone(200,0.8,'sine');},1600); },
    wave:      function(){ playTone(440,0.1,'sine'); setTimeout(function(){playTone(550,0.1,'sine');},100); setTimeout(function(){playTone(660,0.2,'sine');},200); }
};

// ================================
// PRELOAD
// ================================
function preload(){ console.log('Loading...'); }

// ================================
// CREATE
// ================================
function create() {
    scene = this;
    loadGame();
    initQuests();
    var check = scene.time.addEvent({
        delay:100, loop:true,
        callback:function(){ if(gameStarted){ check.remove(); startGame(); } }
    });
}

// ================================
// QUESTS
// ================================
function initQuests() {
    activeQuests = QUEST_TEMPLATES.slice(0,5).map(function(q){
        return { id:q.id, desc:q.desc, type:q.type, monster:q.monster, target:q.target, reward:q.reward, xpReward:q.xpReward, current:0, done:false };
    });
    updateQuestPanel();
}

function updateQuests(type, data) {
    var changed=false;
    activeQuests.forEach(function(q){
        if(q.done) return;
        if(type==='kill'&&q.type==='kill'&&q.monster===data.monster){ q.current=Math.min(q.current+1,q.target); changed=true; }
        if(type==='collect'&&q.type==='collect'){ q.current=Math.min(q.current+1,q.target); changed=true; }
        if(type==='level'&&q.type==='level'){ q.current=playerLevel; changed=true; }
        if(type==='boss'&&q.type==='boss'){ q.current=1; changed=true; }
        if(type==='dimension'&&q.type==='dimension'){ q.current=1; changed=true; }
        if(type==='survive'&&q.type==='survive'){ q.current=Math.floor(surviveTimer); changed=true; }
        if(type==='score'&&q.type==='score'){ q.current=score; changed=true; }
        if(!q.done&&q.current>=q.target){ q.done=true; completeQuest(q); }
    });
    if(changed) updateQuestPanel();
}

function completeQuest(q) {
    sounds.questDone(); score+=q.reward;
    if(scoreText) scoreText.setText('Score: '+score);
    gainXP(q.xpReward);
    if(player) showFloatingText('📜 Quest! +'+q.reward, player.x-80, player.y-100, '#ffaa00');
    addChatMessage('Quest','✅ '+q.desc,'#ffaa00');
    setTimeout(function(){
        var doneIds=activeQuests.map(function(x){return x.id;});
        for(var i=0;i<QUEST_TEMPLATES.length;i++){
            if(doneIds.indexOf(QUEST_TEMPLATES[i].id)===-1){
                var next=QUEST_TEMPLATES[i];
                var idx=activeQuests.findIndex(function(x){return x.id===q.id;});
                if(idx!==-1) activeQuests[idx]={id:next.id,desc:next.desc,type:next.type,monster:next.monster,target:next.target,reward:next.reward,xpReward:next.xpReward,current:0,done:false};
                updateQuestPanel(); break;
            }
        }
    },3000);
}

function updateQuestPanel() {
    var list=document.getElementById('questList'); if(!list) return;
    list.innerHTML='';
    activeQuests.forEach(function(q){
        var div=document.createElement('div');
        div.className='questItem'+(q.done?' done':'');
        div.innerHTML=(q.done?'✅ ':'🔲 ')+q.desc+'<div class="questProgress">'+q.current+'/'+q.target+'</div><div class="questReward">+'+q.reward+' pts  +'+q.xpReward+' XP</div>';
        list.appendChild(div);
    });
}

// ================================
// FIREBASE — SMOOTH MOVEMENT
// ================================
function connectToServer() {
    try {
        myPlayerId = 'p_'+Date.now()+'_'+Math.floor(Math.random()*9999);
        playersRef    = firebase.database().ref('players');
        chatRef       = firebase.database().ref('chat');
        tombstonesRef = firebase.database().ref('tombstones');

        var myRef = playersRef.child(myPlayerId);
        myRef.set({ id:myPlayerId, name:playerClass.icon+' '+playerName, x:400, y:300, level:playerLevel, dimension:0 });
        myRef.onDisconnect().remove();

        playersRef.on('child_added', function(snap){
            var d=snap.val(); if(!d||d.id===myPlayerId) return;
            addOtherPlayer(d);
            addChatMessage('System', d.name+' joined!', '#ffff44');
            updateOnlineCount();
        });

        // *** SMOOTH MOVEMENT ***
        // When another player's position changes
        // we tween their sprite smoothly to the new position
        playersRef.on('child_changed', function(snap){
            var d=snap.val(); if(!d||d.id===myPlayerId) return;
            if(otherPlayers[d.id] && otherPlayers[d.id].sprite){
                var op = otherPlayers[d.id];
                // Cancel any existing tween
                if(op.tween) op.tween.stop();
                // Smooth tween to new position over 100ms
                op.tween = scene.tweens.add({
                    targets: op.sprite,
                    x: d.x, y: d.y,
                    duration: 100,
                    ease: 'Linear',
                    onUpdate: function(){
                        if(op.nameTag) op.nameTag.setPosition(op.sprite.x-30, op.sprite.y-52);
                    }
                });
            }
        });

        playersRef.on('child_removed', function(snap){
            var d=snap.val(); if(!d) return;
            if(otherPlayers[d.id]){
                addChatMessage('System', d.name+' left', '#ff8888');
                if(otherPlayers[d.id].sprite) otherPlayers[d.id].sprite.destroy();
                if(otherPlayers[d.id].nameTag) otherPlayers[d.id].nameTag.destroy();
                delete otherPlayers[d.id];
                updateOnlineCount();
            }
        });

        chatRef.limitToLast(1).on('child_added', function(snap){
            var d=snap.val(); if(!d||d.senderId===myPlayerId) return;
            addChatMessage(d.name, d.message, '#ffffff');
        });

        tombstonesRef.once('value', function(snap){
            snap.forEach(function(child){
                var t=child.val();
                if(t&&t.dimension===currentDimension) addTombstoneVisual(t.x,t.y,t.name,t.level,'#ffaaaa');
            });
        });

        tombstonesRef.on('child_added', function(snap){
            var t=snap.val(); if(!t||t.senderId===myPlayerId) return;
            if(t.dimension===currentDimension){
                addTombstoneVisual(t.x,t.y,t.name,t.level,'#ffaaaa');
                addChatMessage('System','💀 '+t.name+' fell!','#ff8888');
            }
        });

        addChatMessage('System','🌐 Multiplayer connected!','#44ff44');
        updateOnlineCount();

    } catch(e) {
        console.log('Offline:', e);
        addChatMessage('System','🌐 Playing offline','#ffaa00');
    }
}

function addOtherPlayer(data) {
    if(otherPlayers[data.id]||!scene||!scene.physics) return;
    var sprite = scene.physics.add.image(data.x||400, data.y||300, 'otherPlayerTex');
    var nameTag = scene.add.text(data.x-30, data.y-52, data.name||'Player', { fontSize:'12px', fill:'#cc88ff' });
    otherPlayers[data.id] = { sprite:sprite, nameTag:nameTag, name:data.name, tween:null };
}

function updateOnlineCount() {
    if(!playersRef) return;
    playersRef.once('value', function(snap){ updatePlayerCount(snap.numChildren()); });
}

var lastPosSent=0;
function sendPosition() {
    if(!playersRef||!myPlayerId||!player) return;
    var now=Date.now(); if(now-lastPosSent<80) return;
    lastPosSent=now;
    playersRef.child(myPlayerId).update({ x:Math.floor(player.x), y:Math.floor(player.y), dimension:currentDimension });
}

function addTombstoneVisual(x,y,name,level,color) {
    if(!scene) return;
    var stone=scene.add.image(x,y,'tombstoneTex').setDepth(7);
    var label=scene.add.text(x,y-34,'💀 '+name+'\nLv.'+level,{ fontSize:'10px', fill:color||'#cccccc', stroke:'#000', strokeThickness:2, align:'center' }).setOrigin(0.5).setDepth(7);
    tombstones.push({stone:stone,label:label});
}

// ================================
// START GAME
// ================================
function startGame() {
    selectedClass = window._selectedClass || 'warrior';
    selectedMode  = window._selectedMode  || 'adventure';
    pvpMode = (selectedMode === 'pvp');

    playerClass     = CLASSES[selectedClass];
    playerMaxHealth = playerClass.hp;
    playerHealth    = playerMaxHealth;
    playerSpeed     = playerClass.speed;
    playerDamage    = playerClass.damage;
    playerAttackRange = playerClass.attackRange;

    // Register touch functions
    window._doAttack  = function(){ doAttack(); };
    window._doAbility = function(){ doAbility(); };
    window._doPotion  = function(){ doPotion(); };

    // Set background color for this mode
    var mapCfg = MAP_CONFIGS[selectedMode] || MAP_CONFIGS.adventure;
    game.canvas.style.background = mapCfg.bgColor;

    buildWorld();
    createTextures();
    createPlayer();

    enemies = scene.physics.add.group();
    potions = scene.physics.add.group();

    if(selectedMode !== 'bossrush' && selectedMode !== 'pvp') {
        createPortals();
        scene.physics.add.overlap(player, portals, touchPortal, null, scene);
    }

    // Start correct mode
    if     (selectedMode === 'adventure') startAdventureMode();
    else if(selectedMode === 'survival')  startSurvivalMode();
    else if(selectedMode === 'bossrush') startBossRushMode();
    else if(selectedMode === 'pvp')      startPvpMode();

    setupCamera();
    setupKeyboard();
    buildUI();
    buildInventoryPanel();
    if(selectedMode !== 'bossrush') startDayNightCycle();
    startSurviveTimer();
    setupJoystick();
    connectToServer();

    scene.physics.add.overlap(player, enemies, onPlayerTouchEnemy, null, scene);
    scene.physics.add.overlap(player, potions, pickUpPotion, null, scene);

    console.log('Game: '+selectedMode+' as '+playerClass.name);
}

// ================================
// ADVENTURE MODE
// ================================
function startAdventureMode() {
    spawnInitialEnemies();
    startBossTimer();
}

// ================================
// SURVIVAL MODE
// ================================
function startSurvivalMode() {
    currentWave=0;
    setTimeout(function(){ startNextWave(); },2000);
}

function startNextWave() {
    currentWave++;
    waveEnemiesKilled=0;
    waveEnemyCount=5+(currentWave*3);
    sounds.wave();
    var wi=document.getElementById('waveIndicator');
    if(wi) wi.textContent='🌊 Wave '+currentWave+' — '+waveEnemyCount+' enemies!';
    showFloatingText('🌊 WAVE '+currentWave+'!', player.x-60, player.y-100, '#ff4444');
    var types=Object.keys(MONSTERS);
    // Higher waves include shadow monsters
    if(currentWave>=3) types=types.concat(Object.keys(SHADOW_MONSTERS));
    for(var i=0;i<waveEnemyCount;i++){
        (function(delay){
            setTimeout(function(){
                var type=types[Math.floor(Math.random()*types.length)];
                if(SHADOW_MONSTERS[type]) spawnShadowEnemy(type);
                else spawnEnemy(type);
            },delay);
        })(i*350);
    }
    // Spawn survival boss every 5 waves
    if(currentWave%5===0) setTimeout(function(){ spawnModeBoss('survival'); },waveEnemyCount*350+1000);
}

function onWaveEnemyKilled() {
    if(selectedMode!=='survival') return;
    waveEnemiesKilled++;
    if(waveEnemiesKilled>=waveEnemyCount) {
        showFloatingText('✅ Wave '+currentWave+' complete!',player.x-100,player.y-80,'#44ff44');
        playerHealth=Math.min(playerHealth+30,playerMaxHealth);
        updateHealthBar();
        var wi=document.getElementById('waveIndicator');
        if(wi) wi.textContent='🌊 Next wave in 3s...';
        setTimeout(function(){ startNextWave(); },3000);
    } else {
        var wi=document.getElementById('waveIndicator');
        if(wi) wi.textContent='🌊 Wave '+currentWave+' — '+(waveEnemyCount-waveEnemiesKilled)+' left!';
    }
}

// ================================
// BOSS RUSH MODE
// ================================
function startBossRushMode() {
    bossRushIndex=0;
    // Fill arena with obstacles for visual variety
    showFloatingText('💀 BOSS RUSH BEGINS!',player.x-120,player.y-80,'#ff4444');
    addChatMessage('System','💀 Boss Rush Mode! No breaks!','#ff4444');
    setTimeout(function(){ spawnBossRushBoss(); },2000);
}

function spawnBossRushBoss() {
    if(!player||!player.active) return;
    var cfg = BOSS_RUSH_SEQUENCE[bossRushIndex % BOSS_RUSH_SEQUENCE.length];
    bossRushIndex++;
    sounds.bossSpawn();

    var x=Phaser.Math.Between(300,mapWidth*tileSize-300);
    var y=Phaser.Math.Between(300,mapHeight*tileSize-300);

    // Make unique boss texture
    var brg=scene.make.graphics({x:0,y:0,add:false});
    brg.fillStyle(cfg.color); brg.fillRoundedRect(5,5,90,90,12);
    brg.fillStyle(0xffffff,0.3); brg.fillRoundedRect(15,15,70,70,8);
    brg.fillStyle(cfg.eyeColor); brg.fillCircle(30,30,14); brg.fillCircle(70,30,14);
    brg.fillStyle(0x000000); brg.fillCircle(30,30,8); brg.fillCircle(70,30,8);
    brg.fillStyle(cfg.eyeColor); brg.fillRect(25,65,50,10);
    brg.generateTexture('rushBoss'+bossRushIndex,100,100); brg.destroy();

    boss=scene.physics.add.image(x,y,'rushBoss'+bossRushIndex);
    boss.setCollideWorldBounds(true);
    boss.health=cfg.hp+(bossRushIndex*100)+(playerLevel*50);
    boss.maxHealth=boss.health;
    boss.speed=cfg.speed+(bossRushIndex*5);
    boss.xpReward=cfg.xpReward+bossRushIndex*100;
    bossSpawned=true;

    scene.tweens.add({targets:boss,scaleX:1.1,scaleY:1.1,duration:500,yoyo:true,repeat:-1});

    if(bossHealthBarBg) bossHealthBarBg.destroy();
    if(bossHealthBar)   bossHealthBar.destroy();
    if(bossNameText)    bossNameText.destroy();

    bossHealthBarBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHealthBar  =scene.add.rectangle(640,50,500,24,cfg.barColor).setScrollFactor(0).setDepth(15);
    bossNameText   =scene.add.text(640,50,cfg.name+' #'+bossRushIndex,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);

    showFloatingText('⚠️ '+cfg.name,player.x-100,player.y-100,'#ff4444');
    scene.physics.add.overlap(player,boss,hitByBoss,null,scene);
}

// ================================
// PVP MODE
// ================================
function startPvpMode() {
    addChatMessage('System','⚔️ PvP Arena! Fight other players!','#ff88ff');
    showFloatingText('⚔️ PvP Arena!',player.x-80,player.y-80,'#ff88ff');
    // Some monsters for chaos
    for(var i=0;i<8;i++) spawnEnemy();
}

// ================================
// SPAWN MODE BOSS
// ================================
function spawnModeBoss(mode) {
    if(bossSpawned) return;
    var cfg = BOSS_CONFIGS[mode] || BOSS_CONFIGS.adventure;
    bossSpawned=true; sounds.bossSpawn();

    var x=(mapWidth/2)*tileSize, y=(mapHeight/2)*tileSize;

    // Make mode boss texture
    var bg=scene.make.graphics({x:0,y:0,add:false});
    bg.fillStyle(cfg.color); bg.fillRoundedRect(5,5,90,90,10);
    bg.fillStyle(cfg.eyeColor); bg.fillCircle(30,30,15); bg.fillCircle(70,30,15);
    bg.fillStyle(0x000000); bg.fillCircle(30,30,9); bg.fillCircle(70,30,9);
    bg.fillStyle(cfg.mouthColor); bg.fillRect(25,65,50,12);
    bg.generateTexture('modeBossTex',100,100); bg.destroy();

    boss=scene.physics.add.image(x,y,'modeBossTex');
    boss.setCollideWorldBounds(true);
    boss.health=cfg.hp+(playerLevel*100);
    boss.maxHealth=boss.health;
    boss.speed=cfg.speed+(playerLevel*5);
    boss.xpReward=cfg.xpReward+(playerLevel*60);
    boss.bossConfig=cfg;

    scene.tweens.add({targets:boss,scaleX:1.12,scaleY:1.12,duration:700,yoyo:true,repeat:-1});

    if(bossHealthBarBg) bossHealthBarBg.destroy();
    if(bossHealthBar)   bossHealthBar.destroy();
    if(bossNameText)    bossNameText.destroy();

    bossHealthBarBg=scene.add.rectangle(640,50,504,28,0x000000).setScrollFactor(0).setDepth(15);
    bossHealthBar  =scene.add.rectangle(640,50,500,24,cfg.barColor||0xff0000).setScrollFactor(0).setDepth(15);
    bossNameText   =scene.add.text(640,50,cfg.name+'  '+boss.health+'/'+boss.maxHealth,{fontSize:'14px',fill:'#fff'}).setOrigin(0.5).setScrollFactor(0).setDepth(15);

    showFloatingText('⚠️ '+cfg.spawnMsg,player.x-180,player.y-100,'#ff0000');
    addChatMessage('System','⚠️ BOSS SPAWNED!','#ff0000');
    scene.physics.add.overlap(player,boss,hitByBoss,null,scene);

    // Swarm Queen spawns minions!
    if(cfg.spawnsMinions) {
        scene.time.addEvent({
            delay:3000, loop:true,
            callback:function(){
                if(boss&&boss.active) {
                    var types=Object.keys(MONSTERS);
                    for(var i=0;i<3;i++) spawnEnemy(types[Math.floor(Math.random()*types.length)]);
                }
            }
        });
    }
}

// ================================
// BUILD WORLD — different per mode
// ================================
function buildWorld() {
    var mapCfg = MAP_CONFIGS[selectedMode] || MAP_CONFIGS.adventure;

    // Tiles
    for(var x=0;x<mapWidth;x++){
        for(var y=0;y<mapHeight;y++){
            var color;
            // Path pattern
            if(Math.abs(x-y)<2||Math.abs(x+y-mapWidth)<2) color=mapCfg.pathColor;
            else if((x+y)%2===0) color=mapCfg.grassColors[0];
            else color=mapCfg.grassColors[1];
            var tile=scene.add.rectangle(x*tileSize+tileSize/2,y*tileSize+tileSize/2,tileSize-1,tileSize-1,color);
            normalTiles.push(tile);
        }
    }

    // Add mode-specific decorations
    if(selectedMode==='adventure') buildAdventureDecorations(mapCfg);
    else if(selectedMode==='survival') buildSurvivalDecorations(mapCfg);
    else if(selectedMode==='bossrush') buildBossRushDecorations(mapCfg);
    else if(selectedMode==='pvp') buildPvpDecorations(mapCfg);

    // Shadow realm tiles (adventure only)
    if(selectedMode==='adventure'){
        for(var sx=0;sx<mapWidth;sx++){
            for(var sy=0;sy<mapHeight;sy++){
                shadowTiles.push(scene.add.rectangle(sx*tileSize+tileSize/2,sy*tileSize+tileSize/2,tileSize-1,tileSize-1,(sx+sy)%2===0?0x1a0033:0x220044).setVisible(false));
            }
        }
        [{x:3,y:3},{x:8,y:6},{x:14,y:2},{x:20,y:8}].forEach(function(pos){
            var c=scene.add.triangle(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/4,-8,15,8,15,0,-20,0x8800ff).setVisible(false);
            scene.tweens.add({targets:c,alpha:0.4,duration:800,yoyo:true,repeat:-1}); shadowTiles.push(c);
        });
    }

    nightOverlay=scene.add.rectangle(0,0,mapWidth*tileSize,mapHeight*tileSize,0x000033,0).setOrigin(0,0).setDepth(5);
    dimensionOverlay=scene.add.rectangle(0,0,mapWidth*tileSize,mapHeight*tileSize,0x220044,0).setOrigin(0,0).setDepth(4);
}

function buildAdventureDecorations(mapCfg) {
    // Water river
    for(var i=5;i<15;i++) normalTiles.push(scene.add.rectangle(22*tileSize+tileSize/2,i*tileSize+tileSize/2,tileSize-1,tileSize-1,mapCfg.waterColor));
    // Trees
    [{x:2,y:2},{x:5,y:3},{x:8,y:1},{x:15,y:4},{x:18,y:7},{x:3,y:12},{x:10,y:20},{x:7,y:8},{x:12,y:5},{x:25,y:5},{x:28,y:12}].forEach(function(pos){
        var tx=pos.x*tileSize+tileSize/2, ty=pos.y*tileSize+tileSize/2;
        normalTiles.push(scene.add.rectangle(tx,ty,16,28,0x6B3A2A));
        normalTiles.push(scene.add.circle(tx,ty-14,26,0x1a6e1a));
        normalTiles.push(scene.add.circle(tx-8,ty-20,18,0x228822));
    });
    // Rocks
    [{x:6,y:6},{x:11,y:9},{x:19,y:3},{x:4,y:16}].forEach(function(pos){
        normalTiles.push(scene.add.ellipse(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/2,36,26,0x888888));
    });
    // Campfires
    [{x:10,y:10},{x:20,y:5},{x:5,y:22}].forEach(function(pos){
        var fx=pos.x*tileSize+tileSize/2, fy=pos.y*tileSize+tileSize/2;
        scene.add.rectangle(fx,fy+5,28,8,0x6B3A2A);
        var f1=scene.add.triangle(fx,fy-20,-10,10,10,10,0,-15,0xff4400);
        var f2=scene.add.triangle(fx-6,fy-12,-6,8,6,8,0,-10,0xff8800);
        scene.tweens.add({targets:[f1,f2],scaleX:0.85,scaleY:1.15,duration:150+Math.random()*100,yoyo:true,repeat:-1});
        normalTiles.push(f1,f2);
    });
}

function buildSurvivalDecorations(mapCfg) {
    // Arena walls — dark rocks and barriers
    [{x:5,y:5},{x:10,y:3},{x:15,y:5},{x:20,y:3},{x:3,y:10},{x:25,y:10},{x:3,y:20},{x:25,y:20},{x:5,y:25},{x:15,y:25},{x:25,y:25}].forEach(function(pos){
        normalTiles.push(scene.add.rectangle(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/2,tileSize*2,tileSize*2,0x444444));
    });
    // Skull decorations
    [{x:7,y:7},{x:22,y:7},{x:7,y:22},{x:22,y:22},{x:14,y:14}].forEach(function(pos){
        var skull=scene.add.text(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/2,'💀',{fontSize:'30px'}).setOrigin(0.5);
        normalTiles.push(skull);
    });
    // Torches
    [{x:4,y:4},{x:25,y:4},{x:4,y:25},{x:25,y:25}].forEach(function(pos){
        var tx=pos.x*tileSize+tileSize/2, ty=pos.y*tileSize+tileSize/2;
        var f=scene.add.circle(tx,ty,12,0xff6600);
        scene.tweens.add({targets:f,alpha:0.5,scaleX:0.8,duration:200+Math.random()*100,yoyo:true,repeat:-1});
        normalTiles.push(scene.add.rectangle(tx,ty+15,6,20,0x663300),f);
    });
}

function buildBossRushDecorations(mapCfg) {
    // Lava pools
    [{x:8,y:8},{x:20,y:5},{x:5,y:20},{x:22,y:22},{x:14,y:14}].forEach(function(pos){
        var lava=scene.add.rectangle(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/2,tileSize*2,tileSize,0xff4400);
        scene.tweens.add({targets:lava,fillColor:0xff8800,duration:800+Math.random()*400,yoyo:true,repeat:-1});
        normalTiles.push(lava);
    });
    // Pillars
    [{x:3,y:3},{x:26,y:3},{x:3,y:26},{x:26,y:26},{x:14,y:3},{x:14,y:26},{x:3,y:14},{x:26,y:14}].forEach(function(pos){
        normalTiles.push(scene.add.rectangle(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/2,tileSize-4,tileSize*2,0x440000));
        normalTiles.push(scene.add.circle(pos.x*tileSize+tileSize/2,pos.y*tileSize,8,0xff4400));
    });
    // Chains
    for(var cx=0;cx<mapWidth;cx+=5){
        normalTiles.push(scene.add.rectangle(cx*tileSize+tileSize/2,4*tileSize,6,tileSize*3,0x332200));
    }
}

function buildPvpDecorations(mapCfg) {
    // Crystal arena — symmetric
    // Center crystal
    var crystal=scene.add.triangle(mapWidth/2*tileSize,mapHeight/2*tileSize-40,-20,30,20,30,0,-40,0x4488ff);
    scene.tweens.add({targets:crystal,alpha:0.5,duration:1000,yoyo:true,repeat:-1});
    normalTiles.push(crystal);
    // Blue pillars at corners
    [{x:3,y:3},{x:26,y:3},{x:3,y:26},{x:26,y:26}].forEach(function(pos){
        var p=scene.add.rectangle(pos.x*tileSize+tileSize/2,pos.y*tileSize+tileSize/2,tileSize,tileSize*2,0x002266);
        var glow=scene.add.circle(pos.x*tileSize+tileSize/2,pos.y*tileSize-20,15,0x0088ff);
        scene.tweens.add({targets:glow,alpha:0.3,scale:1.3,duration:600+Math.random()*200,yoyo:true,repeat:-1});
        normalTiles.push(p,glow);
    });
    // Arena boundary
    for(var ax=0;ax<mapWidth;ax++){
        normalTiles.push(scene.add.rectangle(ax*tileSize+tileSize/2,2*tileSize,tileSize-2,tileSize,0x001133));
        normalTiles.push(scene.add.rectangle(ax*tileSize+tileSize/2,(mapHeight-2)*tileSize,tileSize-2,tileSize,0x001133));
    }
    for(var ay=0;ay<mapHeight;ay++){
        normalTiles.push(scene.add.rectangle(2*tileSize,ay*tileSize+tileSize/2,tileSize,tileSize-2,0x001133));
        normalTiles.push(scene.add.rectangle((mapWidth-2)*tileSize,ay*tileSize+tileSize/2,tileSize,tileSize-2,0x001133));
    }
}

// ================================
// CREATE TEXTURES
// Each class has UNIQUE look!
// ================================
function createTextures() {
    // PLAYER TEXTURE — unique per class!
    var pg=scene.make.graphics({x:0,y:0,add:false});
    var cls=playerClass;

    // Body shape
    pg.fillStyle(cls.bodyColor);
    pg.fillRoundedRect(4,14,32,26,5);

    // Head
    pg.fillStyle(cls.headColor);
    pg.fillCircle(20,10,11);

    // Class-specific detail
    pg.fillStyle(cls.detailColor);

    if(selectedClass==='warrior'){
        // Shield on arm
        pg.fillRect(1,16,8,16);
        pg.fillRect(34,20,5,10);
    } else if(selectedClass==='archer'){
        // Bow
        pg.lineStyle(2,cls.detailColor,1);
        pg.strokeCircle(35,20,8);
        pg.fillRect(2,14,4,26);
    } else if(selectedClass==='mage'){
        // Robe hem and staff
        pg.fillTriangle(4,40,20,30,36,40);
        pg.fillRect(35,8,3,30);
        pg.fillCircle(36,8,5);
    } else if(selectedClass==='rogue'){
        // Hood and daggers
        pg.fillArc(20,6,12,200,340,false);
        pg.fillRect(2,20,5,8);
        pg.fillRect(33,20,5,8);
    } else if(selectedClass==='paladin'){
        // Cross on chest
        pg.fillRect(17,16,6,18);
        pg.fillRect(11,22,18,6);
        // Halo
        pg.lineStyle(2,cls.detailColor,1);
        pg.strokeCircle(20,2,8);
    } else if(selectedClass==='necromancer'){
        // Dark robe with skull
        pg.fillTriangle(4,40,20,28,36,40);
        pg.fillStyle(0xffffff);
        pg.fillCircle(20,20,5);
        pg.fillRect(17,24,6,4);
    } else if(selectedClass==='berserker'){
        // Horns and axe
        pg.fillTriangle(8,6,12,0,16,6);
        pg.fillTriangle(24,6,28,0,32,6);
        pg.fillRect(35,14,5,20);
        pg.fillRect(32,12,10,6);
    } else if(selectedClass==='ranger'){
        // Leaves and bow
        pg.fillCircle(6,16,6);
        pg.fillCircle(4,24,5);
        pg.fillCircle(35,18,5);
        pg.fillRect(34,14,3,20);
    }

    pg.generateTexture('playerTex',42,42);
    pg.destroy();

    // OTHER PLAYER — neutral purple
    var opg=scene.make.graphics({x:0,y:0,add:false});
    opg.fillStyle(0x8844cc); opg.fillRoundedRect(4,14,32,26,5);
    opg.fillStyle(0xddbbff); opg.fillCircle(20,10,11);
    opg.fillStyle(0xaa66ff); opg.fillRect(1,16,8,16);
    opg.generateTexture('otherPlayerTex',42,42); opg.destroy();

    // MONSTERS — each unique
    Object.keys(MONSTERS).forEach(function(key){
        var m=MONSTERS[key];
        var mg=scene.make.graphics({x:0,y:0,add:false});
        mg.fillStyle(m.color); mg.fillRoundedRect(4,10,m.size-8,m.size-10,4);
        mg.fillStyle(0xffffff); mg.fillCircle(12,14,5); mg.fillCircle(m.size-14,14,5);
        mg.fillStyle(0x000000); mg.fillCircle(13,14,3); mg.fillCircle(m.size-13,14,3);
        // Mouth
        mg.fillStyle(m.color===0xcccccc?0x000000:0x000000);
        mg.fillRect(Math.floor(m.size/2)-6,m.size-14,12,4);
        mg.generateTexture(key+'Tex',m.size,m.size); mg.destroy();
    });

    // SHADOW MONSTERS
    Object.keys(SHADOW_MONSTERS).forEach(function(key){
        var m=SHADOW_MONSTERS[key];
        var smg=scene.make.graphics({x:0,y:0,add:false});
        smg.fillStyle(m.color,0.85); smg.fillRoundedRect(4,10,m.size-8,m.size-10,6);
        smg.fillStyle(0xff4488); smg.fillCircle(12,14,5); smg.fillCircle(m.size-14,14,5);
        smg.fillStyle(0xff0066,0.5); smg.fillRect(Math.floor(m.size/2)-5,m.size-14,10,4);
        smg.generateTexture(key+'Tex',m.size,m.size); smg.destroy();
    });

    // BOSS
    var bg=scene.make.graphics({x:0,y:0,add:false});
    bg.fillStyle(0x440000); bg.fillRoundedRect(5,5,90,90,10);
    bg.fillStyle(0xcc0000); bg.fillRoundedRect(15,15,70,70,8);
    bg.fillStyle(0xff0000); bg.fillCircle(30,30,16); bg.fillCircle(70,30,16);
    bg.fillStyle(0xffffff); bg.fillCircle(30,30,8); bg.fillCircle(70,30,8);
    bg.fillStyle(0xffff00); bg.fillRect(25,65,50,12);
    bg.generateTexture('bossTex',100,100); bg.destroy();

    // POTION
    var potg=scene.make.graphics({x:0,y:0,add:false});
    potg.fillStyle(0x884400); potg.fillRect(10,0,10,8);
    potg.fillStyle(0xff69b4); potg.fillRoundedRect(2,6,26,24,8);
    potg.fillStyle(0xffbbdd); potg.fillCircle(10,13,6);
    potg.generateTexture('potionTex',30,32); potg.destroy();

    // TOMBSTONE
    var tg=scene.make.graphics({x:0,y:0,add:false});
    tg.fillStyle(0x666666); tg.fillRoundedRect(5,0,34,40,8);
    tg.fillStyle(0x999999); tg.fillRect(18,10,4,18); tg.fillRect(11,16,18,4);
    tg.generateTexture('tombstoneTex',44,44); tg.destroy();

    // MINION
    var smg2=scene.make.graphics({x:0,y:0,add:false});
    smg2.fillStyle(0xdddddd); smg2.fillRoundedRect(5,10,22,24,4);
    smg2.fillStyle(0xeeeeee); smg2.fillCircle(16,8,9);
    smg2.generateTexture('minionTex',32,36); smg2.destroy();

    // WOLF
    var wg=scene.make.graphics({x:0,y:0,add:false});
    wg.fillStyle(0x886644); wg.fillEllipse(16,16,30,22);
    wg.fillStyle(0x775533); wg.fillCircle(26,10,10);
    wg.generateTexture('wolfTex',36,32); wg.destroy();
}

// ================================
// CREATE PLAYER
// ================================
function createPlayer() {
    player=scene.physics.add.image(400,300,'playerTex');
    scene.physics.world.setBounds(0,0,mapWidth*tileSize,mapHeight*tileSize);
    player.setCollideWorldBounds(true);
    attackIndicator=scene.add.circle(player.x,player.y,playerAttackRange,0xffffff,0).setStrokeStyle(1,0xffffff,0.2).setDepth(8);
}

// ================================
// PORTALS
// ================================
function createPortals() {
    portals=scene.physics.add.staticGroup();
    var p1=portals.create(24*tileSize,24*tileSize,null); p1.setCircle(32); p1.portalType='toShadow';
    var p2=portals.create(4*tileSize,4*tileSize,null);   p2.setCircle(32); p2.portalType='toNormal';
    [{x:24*tileSize,y:24*tileSize,color:0xaa00ff,label:'🌀 Shadow Portal'},{x:4*tileSize,y:4*tileSize,color:0xffaa00,label:'🌀 Return Portal'}].forEach(function(pd){
        var gfx=scene.add.graphics();
        scene.time.addEvent({delay:50,loop:true,callback:function(){
            gfx.clear(); var a=0.4+Math.sin(Date.now()/300)*0.3;
            gfx.lineStyle(5,pd.color,a); gfx.strokeCircle(pd.x,pd.y,36);
            gfx.fillStyle(pd.color,a*0.15); gfx.fillCircle(pd.x,pd.y,34);
        }});
        scene.add.text(pd.x,pd.y-52,pd.label,{fontSize:'13px',fill:'#ffffff',stroke:'#000',strokeThickness:2}).setOrigin(0.5);
    });
}

function touchPortal(player,portal) {
    if(portalCooldown) return; portalCooldown=true;
    setTimeout(function(){portalCooldown=false;},2000);
    if(portal.portalType==='toShadow'&&currentDimension===0) enterShadowRealm();
    else if(portal.portalType==='toNormal'&&currentDimension===1) enterNormalWorld();
}

function enterShadowRealm() {
    currentDimension=1; sounds.portal();
    scene.cameras.main.flash(500,100,0,150);
    normalTiles.forEach(function(t){t.setVisible(false);});
    shadowTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimensionOverlay,alpha:0.4,duration:1000});
    clearEnemies(); for(var i=0;i<10;i++) spawnShadowEnemy();
    var di=document.getElementById('dimensionIndicator'); if(di){di.innerHTML='🌑 Shadow Realm';di.style.color='#cc88ff';}
    showFloatingText('🌑 Shadow Realm!',player.x-100,player.y-80,'#cc88ff');
    questStats.dimensionVisited=1; updateQuests('dimension',{});
    if(playersRef&&myPlayerId) playersRef.child(myPlayerId).update({dimension:1});
}

function enterNormalWorld() {
    currentDimension=0; sounds.portal();
    scene.cameras.main.flash(500,50,150,50);
    shadowTiles.forEach(function(t){t.setVisible(false);});
    normalTiles.forEach(function(t){t.setVisible(true);});
    scene.tweens.add({targets:dimensionOverlay,alpha:0,duration:1000});
    clearEnemies(); spawnInitialEnemies();
    var di=document.getElementById('dimensionIndicator'); if(di){di.innerHTML='🌍 Normal World';di.style.color='#aaffaa';}
    showFloatingText('🌍 Normal World!',player.x-100,player.y-80,'#aaffaa');
    if(playersRef&&myPlayerId) playersRef.child(myPlayerId).update({dimension:0});
}

function clearEnemies() {
    enemies.getChildren().forEach(function(e){if(e.healthBar)e.healthBar.destroy();if(e.nameTag)e.nameTag.destroy();e.destroy();});
}

// ================================
// SPAWN ENEMIES
// ================================
function spawnInitialEnemies() {
    var types=Object.keys(MONSTERS);
    for(var i=0;i<14;i++) spawnEnemy(types[Math.floor(Math.random()*types.length)]);
}

function spawnEnemy(type) {
    var types=Object.keys(MONSTERS);
    if(!type) type=types[Math.floor(Math.random()*types.length)];
    var m=MONSTERS[type];
    var x=Phaser.Math.Between(4,mapWidth-3)*tileSize, y=Phaser.Math.Between(4,mapHeight-3)*tileSize;
    var enemy=enemies.create(x,y,type+'Tex');
    enemy.setCollideWorldBounds(true); enemy.monsterType=type; enemy.isShadow=false;
    enemy.health=m.hp*(1+playerLevel*0.2); enemy.maxHealth=enemy.health;
    enemy.speed=m.speed+playerLevel*4; enemy.damage=m.damage;
    enemy.xpReward=m.xp+playerLevel*5; enemy.scoreValue=m.score;
    enemy.patrolX=x; enemy.patrolY=y;
    enemy.healthBar=scene.add.rectangle(x,y-35,m.size,6,0xff3333).setDepth(6);
    enemy.nameTag=scene.add.text(x,y-50,m.name+' Lv.'+playerLevel,{fontSize:'11px',fill:'#ffffff',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(6);
    return enemy;
}

function spawnShadowEnemy(type) {
    var types=Object.keys(SHADOW_MONSTERS);
    if(!type) type=types[Math.floor(Math.random()*types.length)];
    var m=SHADOW_MONSTERS[type];
    var x=Phaser.Math.Between(3,mapWidth-2)*tileSize, y=Phaser.Math.Between(3,mapHeight-2)*tileSize;
    var enemy=enemies.create(x,y,type+'Tex');
    enemy.setCollideWorldBounds(true); enemy.monsterType=type; enemy.isShadow=true;
    enemy.health=m.hp*(1+playerLevel*0.2); enemy.maxHealth=enemy.health;
    enemy.speed=m.speed+playerLevel*4; enemy.damage=m.damage;
    enemy.xpReward=m.xp+playerLevel*5; enemy.scoreValue=m.score;
    enemy.patrolX=x; enemy.patrolY=y;
    scene.tweens.add({targets:enemy,alpha:0.5,duration:500+Math.random()*200,yoyo:true,repeat:-1});
    enemy.healthBar=scene.add.rectangle(x,y-35,m.size,6,0x8800ff).setDepth(6);
    enemy.nameTag=scene.add.text(x,y-50,m.name+' Lv.'+playerLevel,{fontSize:'11px',fill:'#cc88ff',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(6);
    return enemy;
}

// ================================
// CAMERA + KEYBOARD
// ================================
function setupCamera() {
    scene.cameras.main.setBounds(0,0,mapWidth*tileSize,mapHeight*tileSize);
    scene.cameras.main.startFollow(player,true,0.08,0.08);
    scene.cameras.main.setZoom(0.5);
    scene.tweens.add({targets:scene.cameras.main,zoom:1,duration:1200,ease:'Power2'});
}

function setupKeyboard() {
    cursors=scene.input.keyboard.createCursorKeys();
    wasd=scene.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D});
    shiftKey=scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    scene.input.keyboard.on('keydown-SPACE',function(){ if(!chatOpen) doAttack(); });
    scene.input.keyboard.on('keydown-E',    function(){ if(!chatOpen) doAbility(); });
    scene.input.keyboard.on('keydown-F',    function(){ if(!chatOpen) doPotion(); });
    scene.input.keyboard.on('keydown-I',    function(){ if(!chatOpen) toggleInventory(); });
    scene.input.keyboard.on('keydown-T',    function(){ openChat(); });
    scene.input.keyboard.on('keydown-ENTER',function(){
        if(!chatOpen){
            doSaveGame();
        }
    });
}

// ================================
// JOYSTICK
// ================================
function setupJoystick() {
    if(!isMobile) return;
    var zone=document.getElementById('joystickZone'),base=document.getElementById('joystickBase'),thumb=document.getElementById('joystickThumb');
    if(!zone||!base||!thumb) return;
    var maxDist=42;
    zone.addEventListener('touchstart',function(e){
        e.preventDefault(); var t=e.changedTouches[0];
        joystickActive=true; joystickStartX=t.clientX; joystickStartY=t.clientY;
        var r=zone.getBoundingClientRect(); base.style.left=(t.clientX-r.left-55)+'px'; base.style.bottom='auto'; base.style.top=(t.clientY-r.top-55)+'px';
    },{passive:false});
    zone.addEventListener('touchmove',function(e){
        e.preventDefault(); if(!joystickActive) return; var t=e.changedTouches[0];
        var dx=t.clientX-joystickStartX,dy=t.clientY-joystickStartY,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist>maxDist){dx=(dx/dist)*maxDist;dy=(dy/dist)*maxDist;}
        thumb.style.transform='translate('+dx+'px,'+dy+'px)'; joystickDX=dx/maxDist; joystickDY=dy/maxDist;
    },{passive:false});
    zone.addEventListener('touchend',function(e){
        e.preventDefault(); joystickActive=false; joystickDX=0; joystickDY=0;
        thumb.style.transform='translate(0px,0px)'; base.style.left='50px'; base.style.top='auto'; base.style.bottom='30px';
    },{passive:false});
}

// ================================
// SAVE GAME — actually works!
// Shows popup + saves all data
// ================================
function doSaveGame() {
    // Save everything to localStorage
    var saveData = {
        playerName:     playerName,
        selectedClass:  selectedClass,
        playerLevel:    playerLevel,
        playerXP:       playerXP,
        playerHealth:   playerHealth,
        playerMaxHealth:playerMaxHealth,
        playerSpeed:    playerSpeed,
        playerDamage:   playerDamage,
        xpToNextLevel:  xpToNextLevel,
        score:          score,
        inventory:      inventory,
        questStats:     questStats,
        savedAt:        new Date().toLocaleString()
    };

    localStorage.setItem('pixelRPGSave', JSON.stringify(saveData));
    sounds.save();

    // Show proper save popup in the game!
    var savedX = player.x;
    var savedY = player.y;

    // Create save popup container
    var savePopup = scene.add.container(0, 0).setScrollFactor(0).setDepth(50);

    var popBg = scene.add.rectangle(640, 360, 380, 200, 0x000000, 0.9);
    var popBorder = scene.add.rectangle(640, 360, 384, 204).setStrokeStyle(3, 0x44ff44).setFillStyle(0,0);

    var title = scene.add.text(640, 300, '💾 GAME SAVED!', {
        fontSize: '28px', fill: '#44ff44',
        stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    var info1 = scene.add.text(640, 345, playerClass.icon+' '+playerName+'  —  Level '+playerLevel, {
        fontSize: '16px', fill: '#ffffff'
    }).setOrigin(0.5);

    var info2 = scene.add.text(640, 375, 'Score: '+score+'   XP: '+playerXP+'/'+xpToNextLevel, {
        fontSize: '14px', fill: '#aaaaaa'
    }).setOrigin(0.5);

    var info3 = scene.add.text(640, 400, '🎒 Inventory: '+inventory.length+' items', {
        fontSize: '13px', fill: '#ffaa44'
    }).setOrigin(0.5);

    var info4 = scene.add.text(640, 425, new Date().toLocaleString(), {
        fontSize: '11px', fill: '#666666'
    }).setOrigin(0.5);

    savePopup.add([popBg, popBorder, title, info1, info2, info3, info4]);

    // Fade in then out after 2 seconds
    savePopup.setAlpha(0);
    scene.tweens.add({
        targets: savePopup, alpha: 1, duration: 300,
        onComplete: function() {
            scene.time.delayedCall(2000, function() {
                scene.tweens.add({
                    targets: savePopup, alpha: 0, duration: 400,
                    onComplete: function() { savePopup.destroy(); }
                });
            });
        }
    });

    console.log('Game saved!', saveData);
}

// ================================
// ATTACK
// ================================
function doAttack() {
    var now=Date.now();
    if(now-lastAttackTime<playerClass.attackCooldown) return;
    lastAttackTime=now; sounds.attack();

    var swing=scene.add.graphics();
    swing.lineStyle(3,0xffddaa,1);
    swing.arc(player.x,player.y,playerAttackRange*0.7,playerFacing===1?-0.5:Math.PI+0.5,playerFacing===1?0.8:Math.PI-0.8);
    swing.strokePath();
    scene.tweens.add({targets:swing,alpha:0,duration:250,onComplete:function(){swing.destroy();}});

    var hitAny=false;
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active) return;
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<=playerAttackRange){
            var dmg=playerDamage;
            if(selectedClass==='berserker'){ var r=playerHealth/playerMaxHealth; if(r<0.5)dmg=Math.floor(dmg*1.8); if(r<0.25)dmg=Math.floor(dmg*2.5); }
            var crit=(selectedClass==='rogue'&&Math.random()<0.3);
            if(crit) dmg=Math.floor(dmg*2);
            e.health-=dmg;
            e.setTint(0xffffff); scene.time.delayedCall(100,function(){if(e&&e.active)e.clearTint();});
            showFloatingText((crit?'⚡ ':'')+dmg,e.x,e.y-40,crit?'#ffff00':'#ffddaa');
            hitAny=true;
            if(e.health<=0) killEnemy(e);
        }
    });

    if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<=playerAttackRange+50){
        boss.health-=playerDamage; updateBossHealthBar();
        if(boss.health<=0) killBoss();
    }

    if(!hitAny) showFloatingText('miss',player.x+playerFacing*30,player.y-20,'#666666');
}

// ================================
// COLLISION
// ================================
function onPlayerTouchEnemy(player,enemy) {
    if(playerInvisible) return;
    var now=Date.now(); if(now-lastHitTime<1000) return; lastHitTime=now;
    var dmg=enemy.damage||10; playerHealth-=dmg; sounds.hit();
    scene.cameras.main.shake(200,0.008);
    player.setTint(0xff0000); scene.time.delayedCall(200,function(){player.clearTint();});
    updateHealthBar(); showFloatingText('-'+dmg,player.x,player.y-50,'#ff3333');
    if(playerHealth<=0){playerHealth=0;updateHealthBar();showGameOver();}
}

// ================================
// KILL ENEMY
// ================================
function killEnemy(enemy) {
    if(!enemy||!enemy.active) return;
    var m=enemy.isShadow?(SHADOW_MONSTERS[enemy.monsterType]||SHADOW_MONSTERS.wraith):(MONSTERS[enemy.monsterType]||MONSTERS.goblin);
    spawnParticles(enemy.x,enemy.y,m.color,12); sounds.enemyDie();
    gainXP(enemy.xpReward);
    score+=enemy.scoreValue*playerLevel;
    if(scoreText) scoreText.setText('Score: '+score);
    if(selectedMode!=='pvp') spawnPotion(enemy.x,enemy.y,false);
    questStats.kills[enemy.monsterType]=(questStats.kills[enemy.monsterType]||0)+1;
    updateQuests('kill',{monster:enemy.monsterType}); updateQuests('score',{});
    if(enemy.healthBar) enemy.healthBar.destroy();
    if(enemy.nameTag)   enemy.nameTag.destroy();
    var wasShadow=enemy.isShadow; enemy.destroy();

    if(selectedMode==='survival') onWaveEnemyKilled();

    setTimeout(function(){
        if(selectedMode==='adventure'||selectedMode==='pvp'){
            if(currentDimension===1&&wasShadow) spawnShadowEnemy();
            else if(currentDimension===0&&!wasShadow) spawnEnemy();
        }
    },4000);
}

// ================================
// POTION
// ================================
function spawnPotion(x,y,force) {
    if(!force&&Math.random()>0.35) return;
    var p=potions.create(x,y,'potionTex'); p.setCollideWorldBounds(true);
    scene.tweens.add({targets:p,y:p.y-12,duration:600,yoyo:true,repeat:-1});
    p.label=scene.add.text(x-18,y-28,'💊',{fontSize:'16px'});
    return p;
}

function pickUpPotion(player,potion) {
    inventory.push('Health Potion'); updateInventoryPanel();
    if(potion.label) potion.label.destroy(); potion.destroy();
    sounds.pickup(); questStats.potionsCollected++;
    updateQuests('collect',{}); showFloatingText('💊 Potion!',player.x,player.y-60,'#ff69b4');
}

function doPotion() {
    var i=inventory.indexOf('Health Potion');
    if(i===-1){showFloatingText('❌ No potions!',player.x,player.y-60,'#ff0000');return;}
    inventory.splice(i,1); updateInventoryPanel();
    playerHealth=Math.min(playerHealth+40,playerMaxHealth);
    updateHealthBar(); sounds.pickup();
    showFloatingText('+40 HP!',player.x,player.y-60,'#44ff44');
}

// ================================
// ABILITIES
// ================================
function doAbility() {
    var now=Date.now();
    if(now-abilityLastUsed<playerClass.abilityCooldown){
        var rem=Math.ceil((playerClass.abilityCooldown-(now-abilityLastUsed))/1000);
        showFloatingText('⏳ '+rem+'s',player.x,player.y-60,'#888'); return;
    }
    abilityLastUsed=now; sounds.ability();
    var btn=document.getElementById('abilityBtn');
    if(btn){btn.classList.remove('ready');btn.classList.add('cooldown');setTimeout(function(){btn.classList.remove('cooldown');btn.classList.add('ready');},playerClass.abilityCooldown);}

    if     (selectedClass==='warrior')     abilityWarrior();
    else if(selectedClass==='archer')      abilityArcher();
    else if(selectedClass==='mage')        abilityMage();
    else if(selectedClass==='rogue')       abilityRogue();
    else if(selectedClass==='paladin')     abilityPaladin();
    else if(selectedClass==='necromancer') abilityNecromancer();
    else if(selectedClass==='berserker')   abilityBerserker();
    else if(selectedClass==='ranger')      abilityRanger();
}

function abilityWarrior(){
    showFloatingText('🛡️ SHIELD BASH!',player.x-60,player.y-70,'#ff8888');
    spawnParticles(player.x,player.y,0xff6666,16);
    enemies.getChildren().forEach(function(e){
        if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<160){
            var prev=e.speed;e.speed=0;e.setTint(0xffff00);e.health-=playerDamage*2.5;
            scene.time.delayedCall(2500,function(){if(e&&e.active){e.speed=prev;e.clearTint();}});
            if(e.health<=0)killEnemy(e);
        }
    });
}
function abilityArcher(){
    showFloatingText('🏹 ARROW RAIN!',player.x-60,player.y-70,'#88ff88');
    for(var i=0;i<16;i++){(function(angle){
        var arrow=scene.add.rectangle(player.x,player.y,22,5,0x88ff44).setRotation(angle).setDepth(10);
        scene.tweens.add({targets:arrow,x:player.x+Math.cos(angle)*280,y:player.y+Math.sin(angle)*280,alpha:0,duration:450,onComplete:function(){arrow.destroy();}});
        enemies.getChildren().forEach(function(e){var ex=e.x-player.x,ey=e.y-player.y,dist=Math.sqrt(ex*ex+ey*ey);if(dist<280&&Math.abs(Math.atan2(ey,ex)-angle)<0.25){e.health-=playerDamage;if(e.health<=0)killEnemy(e);}});
    })((i/16)*Math.PI*2);}
}
function abilityMage(){
    showFloatingText('🔥 FIREBALL!',player.x-50,player.y-70,'#8888ff');
    spawnParticles(player.x,player.y,0xff4400,28); scene.cameras.main.shake(500,0.02);
    enemies.getChildren().forEach(function(e){if(Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<270){e.health-=playerDamage*3.5;if(e.health<=0)killEnemy(e);}});
    if(boss&&boss.active&&Phaser.Math.Distance.Between(player.x,player.y,boss.x,boss.y)<270){boss.health-=playerDamage*3.5;updateBossHealthBar();if(boss.health<=0)killBoss();}
}
function abilityRogue(){
    showFloatingText('👁️ VANISH!',player.x-40,player.y-70,'#ffaa44');
    playerInvisible=true;player.setAlpha(0.15);playerSpeed*=2;
    scene.time.delayedCall(3000,function(){playerInvisible=false;player.setAlpha(1);playerSpeed/=2;showFloatingText('👁️ Visible!',player.x-40,player.y-60,'#ffaa44');});
}
function abilityPaladin(){
    showFloatingText('✨ HOLY AURA!',player.x-60,player.y-70,'#ffddaa');
    var heal=Math.floor(playerMaxHealth*0.35);
    playerHealth=Math.min(playerHealth+heal,playerMaxHealth);updateHealthBar();
    for(var i=0;i<20;i++){(function(angle){
        var star=scene.add.circle(player.x+Math.cos(angle)*80,player.y+Math.sin(angle)*80,6,0xffff88).setDepth(15);
        scene.tweens.add({targets:star,x:player.x,y:player.y,alpha:0,duration:600,onComplete:function(){star.destroy();}});
    })((i/20)*Math.PI*2);}
    enemies.getChildren().forEach(function(e){if(['skeleton','wraith','lich'].indexOf(e.monsterType)!==-1&&Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<200){e.health-=playerDamage*4;if(e.health<=0)killEnemy(e);}});
    showFloatingText('+'+heal+' HP!',player.x,player.y-90,'#ffff44');
}
function abilityNecromancer(){
    showFloatingText('☠️ RAISE DEAD!',player.x-60,player.y-70,'#88ff88');
    for(var i=0;i<3;i++){(function(angle){
        var mx=player.x+Math.cos(angle)*60,my=player.y+Math.sin(angle)*60;
        var minion=scene.physics.add.image(mx,my,'minionTex');
        minion.speed=130;minions.push(minion);
        minion.label=scene.add.text(mx,my-28,'☠️',{fontSize:'14px'}).setOrigin(0.5);
        scene.physics.add.overlap(minion,enemies,function(m,e){if(!e||!e.active)return;e.health-=15;if(e.health<=0)killEnemy(e);});
        scene.time.delayedCall(15000,function(){if(minion&&minion.active){if(minion.label)minion.label.destroy();minion.destroy();minions=minions.filter(function(m){return m!==minion;});}});
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
        var wolf=scene.physics.add.image(wx,wy,'wolfTex');
        wolf.speed=200;wolfPets.push(wolf);
        wolf.label=scene.add.text(wx,wy-28,'🐺',{fontSize:'14px'}).setOrigin(0.5);
        scene.physics.add.overlap(wolf,enemies,function(w,e){if(!e||!e.active)return;var now=Date.now();if(!w.lastBite||now-w.lastBite>800){w.lastBite=now;e.health-=20+playerLevel*3;if(e.health<=0)killEnemy(e);}});
        scene.time.delayedCall(18000,function(){if(wolf&&wolf.active){if(wolf.label)wolf.label.destroy();wolf.destroy();wolfPets=wolfPets.filter(function(w){return w!==wolf;});}});
    })();}
}

// ================================
// XP + LEVEL
// ================================
function gainXP(amount){
    playerXP+=amount;
    if(player) showFloatingText('+'+amount+' XP',player.x,player.y-70,'#ffff44');
    if(playerXP>=xpToNextLevel) levelUp();
    updateXPBar();
}

function levelUp(){
    playerXP-=xpToNextLevel;playerLevel++;
    xpToNextLevel=playerLevel*100;playerMaxHealth+=20;playerHealth=playerMaxHealth;playerSpeed+=5;playerDamage+=5;
    sounds.levelUp();
    scene.tweens.add({targets:player,scaleX:1.5,scaleY:1.5,duration:200,yoyo:true,repeat:2});
    player.setTint(0xffff00);scene.time.delayedCall(800,function(){if(!isBerserking)player.clearTint();});
    if(levelText) levelText.setText('⭐ Lv.'+playerLevel);
    if(playerNameText) playerNameText.setText(playerClass.icon+' '+playerName+' Lv.'+playerLevel);
    updateHealthBar();updateXPBar();updateQuests('level',{});
    showFloatingText('🌟 LEVEL UP! '+playerLevel,player.x-70,player.y-90,'#ffff00');
    doSaveGame(); // Auto-save on level up!
}

// ================================
// BOSS — Adventure Mode
// ================================
function startBossTimer(){
    scene.time.addEvent({delay:90000,callback:function(){showFloatingText('⚠️ Boss in 30s!',player.x-100,player.y-80,'#ff8800');}});
    scene.time.addEvent({delay:120000,callback:function(){spawnModeBoss('adventure');}});
}

var lastBossHit=0;
function hitByBoss(player,boss){
    var now=Date.now();if(now-lastBossHit<1500)return;lastBossHit=now;
    var dmg=35+playerLevel*4;playerHealth-=dmg;sounds.hit();
    player.setTint(0xff0000);scene.cameras.main.shake(350,0.02);
    scene.time.delayedCall(250,function(){player.clearTint();});updateHealthBar();
    showFloatingText('-'+dmg,player.x,player.y-50,'#ff0000');
    if(playerHealth<=0){playerHealth=0;updateHealthBar();showGameOver();}
}

function killBoss(){
    spawnParticles(boss.x,boss.y,0xff0000,30);spawnParticles(boss.x,boss.y,0xffff00,22);
    gainXP(boss.xpReward);score+=600*playerLevel;if(scoreText)scoreText.setText('Score: '+score);
    for(var i=0;i<4;i++) spawnPotion(boss.x+Phaser.Math.Between(-80,80),boss.y+Phaser.Math.Between(-80,80),true);
    if(bossHealthBarBg)bossHealthBarBg.destroy();if(bossHealthBar)bossHealthBar.destroy();if(bossNameText)bossNameText.destroy();
    boss.destroy();boss=null;bossSpawned=false;
    questStats.bossKills++;updateQuests('boss',{});
    showFloatingText('🏆 BOSS DEFEATED!',player.x-100,player.y-90,'#ffff00');
    addChatMessage('System','🏆 Boss defeated!','#ffff00');

    if(selectedMode==='bossrush'){
        setTimeout(function(){spawnBossRushBoss();},3000);
    } else {
        scene.time.addEvent({delay:180000,callback:function(){spawnModeBoss(selectedMode);}});
    }
}

function updateBossHealthBar(){
    if(!boss||!bossHealthBar) return;
    bossHealthBar.width=500*(boss.health/boss.maxHealth);
    var cfg=boss.bossConfig;
    var bossLabel=cfg?cfg.name:'💀 BOSS';
    if(bossNameText) bossNameText.setText(bossLabel+'  '+Math.max(0,Math.floor(boss.health))+'/'+boss.maxHealth);
}

// ================================
// DAY/NIGHT (adventure only)
// ================================
function startDayNightCycle(){
    timeText=scene.add.text(640,15,'☀️ Day',{fontSize:'15px',fill:'#ffff88'}).setOrigin(0.5,0).setScrollFactor(0).setDepth(10);
    scene.time.addEvent({delay:35000,loop:true,callback:function(){
        dayTime=dayTime===0?1:0;
        if(dayTime===1){timeText.setText('🌙 Night');scene.tweens.add({targets:nightOverlay,alpha:0.5,duration:3000});enemies.getChildren().forEach(function(e){e.speed*=1.25;});showFloatingText('🌙 Night!',player.x-60,player.y-80,'#aaaaff');}
        else{timeText.setText('☀️ Day');scene.tweens.add({targets:nightOverlay,alpha:0,duration:3000});enemies.getChildren().forEach(function(e){e.speed/=1.25;});showFloatingText('☀️ Day!',player.x-40,player.y-80,'#ffff88');}
    }});
}

function startSurviveTimer(){
    scene.time.addEvent({delay:1000,loop:true,callback:function(){
        if(gameStarted&&player&&player.active){
            surviveTimer++;updateQuests('survive',{});
            if(surviveTimer%5===0&&playerHealth<playerMaxHealth){playerHealth=Math.min(playerHealth+1,playerMaxHealth);updateHealthBar();}
        }
    }});
}

// ================================
// TOMBSTONE
// ================================
function spawnTombstone(x,y){
    addTombstoneVisual(x,y,playerName,playerLevel,'#cccccc');
    if(tombstonesRef&&myPlayerId) tombstonesRef.push({x:x,y:y,name:playerClass.icon+' '+playerName,level:playerLevel,dimension:currentDimension,senderId:myPlayerId,time:Date.now()});
}

// ================================
// BUILD UI
// ================================
function buildUI(){
    healthBarBg=scene.add.rectangle(16,16,206,22,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    healthBar  =scene.add.rectangle(18,18,202,18,0x22cc22).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    healthText =scene.add.text(22,18,'HP: '+playerHealth+'/'+playerMaxHealth,{fontSize:'12px',fill:'#fff'}).setScrollFactor(0).setDepth(11);
    xpBarBg=scene.add.rectangle(16,44,206,14,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    xpBar  =scene.add.rectangle(18,46,0,10,0xdddd00).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    xpText =scene.add.text(22,45,'XP: 0/'+xpToNextLevel,{fontSize:'10px',fill:'#ddd'}).setScrollFactor(0).setDepth(11);
    var stBg=scene.add.rectangle(16,62,206,10,0x111111).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    staminaBar=scene.add.rectangle(18,64,202,6,0x44aaff).setOrigin(0,0).setScrollFactor(0).setDepth(10);
    levelText=scene.add.text(16,76,'⭐ Lv.'+playerLevel,{fontSize:'15px',fill:'#ffdd00'}).setScrollFactor(0).setDepth(10);
    scoreText=scene.add.text(16,96,'Score: '+score,{fontSize:'14px',fill:'#ffffff'}).setScrollFactor(0).setDepth(10);
    scene.add.text(16,115,playerClass.icon+' '+playerClass.name,{fontSize:'13px',fill:'#ffbb88'}).setScrollFactor(0).setDepth(10);
    if(!isMobile) scene.add.text(16,696,'WASD:Move  SHIFT:Sprint  SPACE:Attack  E:'+playerClass.ability+'  F:Potion  I:Bag  T:Chat  Enter:SAVE',{fontSize:'10px',fill:'#88aa88'}).setScrollFactor(0).setDepth(10);
    playerNameText=scene.add.text(0,0,playerClass.icon+' '+playerName+' Lv.'+playerLevel,{fontSize:'13px',fill:'#ffffff',stroke:'#000',strokeThickness:2});
}

function updateHealthBar(){var p=Math.max(0,playerHealth)/playerMaxHealth;healthBar.width=202*p;if(p>0.6)healthBar.setFillStyle(0x22cc22);else if(p>0.3)healthBar.setFillStyle(0xddcc00);else healthBar.setFillStyle(0xdd2222);healthText.setText('HP: '+Math.max(0,Math.floor(playerHealth))+'/'+playerMaxHealth);}
function updateXPBar(){xpBar.width=202*(playerXP/xpToNextLevel);xpText.setText('XP: '+playerXP+'/'+xpToNextLevel);}

// ================================
// INVENTORY
// ================================
function buildInventoryPanel(){
    inventoryPanel=scene.add.container(0,0);
    var bg=scene.add.rectangle(640,360,420,310,0x0a0a0a,0.95);
    var title=scene.add.text(640,222,'🎒 Inventory',{fontSize:'22px',fill:'#ffaa00'}).setOrigin(0.5);
    var hint=scene.add.text(640,465,'F: Use Potion   I: Close',{fontSize:'12px',fill:'#666'}).setOrigin(0.5);
    inventoryPanel.add([bg,title,hint]);inventoryPanel.setScrollFactor(0).setDepth(30);inventoryPanel.setVisible(false);
}
function updateInventoryPanel(){
    inventoryTexts.forEach(function(t){t.destroy();});inventoryTexts=[];
    if(inventory.length===0){var e=scene.add.text(640,360,'No items yet...',{fontSize:'16px',fill:'#555'}).setOrigin(0.5).setScrollFactor(0).setDepth(31);inventoryTexts.push(e);return;}
    var counts={};inventory.forEach(function(i){counts[i]=(counts[i]||0)+1;});
    var y=275;Object.keys(counts).forEach(function(item){var t=scene.add.text(640,y,'💊 '+item+'  ×'+counts[item],{fontSize:'18px',fill:'#ffffff'}).setOrigin(0.5).setScrollFactor(0).setDepth(31);inventoryTexts.push(t);y+=44;});
}
function toggleInventory(){inventoryOpen=!inventoryOpen;inventoryPanel.setVisible(inventoryOpen);if(inventoryOpen)updateInventoryPanel();}

// ================================
// HELPERS
// ================================
function spawnParticles(x,y,color,count){
    count=count||12;
    for(var i=0;i<count;i++){(function(angle){
        var p=scene.add.circle(x,y,Phaser.Math.Between(3,9),color).setDepth(15);
        var spd=Phaser.Math.Between(70,190);
        scene.tweens.add({targets:p,x:x+Math.cos(angle)*spd,y:y+Math.sin(angle)*spd,alpha:0,scaleX:0,scaleY:0,duration:Phaser.Math.Between(350,700),onComplete:function(){p.destroy();}});
    })((i/count)*Math.PI*2);}
}
function showFloatingText(msg,x,y,color){
    var t=scene.add.text(x,y,msg,{fontSize:'15px',fill:color,stroke:'#000000',strokeThickness:3}).setDepth(20);
    scene.tweens.add({targets:t,y:y-55,alpha:0,duration:1400,onComplete:function(){t.destroy();}});
}

// ================================
// CHAT
// ================================
function openChat(){
    chatOpen=true;var input=document.getElementById('chatInput');if(!input)return;
    input.disabled=false;input.focus();
    input.onkeydown=function(e){
        if(e.key==='Enter'){var msg=input.value.trim();if(msg){addChatMessage(playerName,msg,'#aaffaa');if(chatRef&&myPlayerId)chatRef.push({name:playerClass.icon+' '+playerName,message:msg,senderId:myPlayerId,time:Date.now()});}input.value='';input.disabled=true;chatOpen=false;input.blur();}
        if(e.key==='Escape'){input.value='';input.disabled=true;chatOpen=false;input.blur();}
        e.stopPropagation();
    };
}
function addChatMessage(name,msg,color){var msgs=document.getElementById('chatMessages');if(!msgs)return;var div=document.createElement('div');div.style.color=color||'#fff';div.style.marginBottom='3px';div.innerHTML='<b>'+name+':</b> '+msg;msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;}
function updatePlayerCount(count){var el=document.getElementById('playerCount');if(el)el.innerHTML='🟢 '+count+' Player'+(count!==1?'s':'')+' Online';}

// ================================
// SAVE / LOAD
// ================================
function loadGame(){
    try{
        var saved=localStorage.getItem('pixelRPGSave');if(!saved)return;
        var d=JSON.parse(saved);if(!d)return;
        playerLevel=d.playerLevel||1;playerXP=d.playerXP||0;playerHealth=d.playerHealth||100;
        playerMaxHealth=d.playerMaxHealth||100;playerSpeed=d.playerSpeed||200;playerDamage=d.playerDamage||20;
        xpToNextLevel=d.xpToNextLevel||100;score=d.score||0;inventory=d.inventory||[];
        playerName=d.playerName||'Hero';if(d.questStats)questStats=d.questStats;
        if(d.selectedClass) { window._selectedClass=d.selectedClass; }
        console.log('Loaded save from '+d.savedAt);
    }catch(e){console.log('No save found');}
}

// ================================
// MINIMAP
// ================================
function updateMinimap(){
    var canvas=document.getElementById('minimap');if(!canvas||!player)return;
    canvas.width=130;canvas.height=130;
    var ctx=canvas.getContext('2d'),sx=130/(mapWidth*tileSize),sy=130/(mapHeight*tileSize);
    var mapCfg=MAP_CONFIGS[selectedMode]||MAP_CONFIGS.adventure;
    ctx.fillStyle=currentDimension===1?'#110022':'#1a4a1a';ctx.fillRect(0,0,130,130);
    enemies.getChildren().forEach(function(e){ctx.fillStyle=e.isShadow?'#8888ff':'#ff4444';ctx.fillRect(e.x*sx-2,e.y*sy-2,4,4);});
    if(boss&&boss.active){ctx.fillStyle='#ff0000';ctx.fillRect(boss.x*sx-5,boss.y*sy-5,10,10);}
    tombstones.forEach(function(ts){if(ts.stone&&ts.stone.active){ctx.fillStyle='#777777';ctx.fillRect(ts.stone.x*sx-2,ts.stone.y*sy-2,4,4);}});
    Object.values(otherPlayers).forEach(function(op){ctx.fillStyle='#cc88ff';ctx.fillRect(op.sprite.x*sx-2,op.sprite.y*sy-2,5,5);});
    ctx.fillStyle='#aa00ff';ctx.fillRect(24*tileSize*sx-3,24*tileSize*sy-3,6,6);
    ctx.fillStyle='#ffaa00';ctx.fillRect(4*tileSize*sx-3,4*tileSize*sy-3,6,6);
    var pc='#'+(playerClass?playerClass.color.toString(16).padStart(6,'0'):'4488ff');
    ctx.fillStyle=pc;ctx.beginPath();ctx.arc(player.x*sx,player.y*sy,5,0,Math.PI*2);ctx.fill();
}

// ================================
// GAME OVER
// ================================
function showGameOver(){
    player.setVelocity(0);player.setActive(false);gameStarted=false;window.gameStarted=false;
    spawnTombstone(player.x,player.y);sounds.gameOver();
    setTimeout(function(){
        scene.cameras.main.fade(2000,0,0,0,false,function(cam,progress){
            if(progress!==1)return;
            var modeLabel={adventure:'🌍 Adventure',survival:'🌊 Survival — Wave '+currentWave,bossrush:'💀 Boss Rush — Boss #'+bossRushIndex,pvp:'⚔️ PvP Arena'}[selectedMode]||'';
            var overlay=document.createElement('div');
            overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s ease;font-family:Arial,sans-serif;color:white;';
            overlay.innerHTML='<div style="text-align:center;max-width:560px;padding:40px;"><div style="font-size:90px;margin-bottom:16px;">💀</div><h1 style="font-size:60px;color:#ff2222;letter-spacing:6px;text-shadow:0 0 40px #ff0000;margin-bottom:8px;">GAME OVER</h1><p style="font-size:18px;color:#ffaa00;margin-bottom:4px;">'+modeLabel+'</p><p style="font-size:20px;color:#888;margin-bottom:6px;">'+(playerClass?playerClass.icon:'')+' <b>'+playerName+'</b> — Level '+playerLevel+'</p><p style="font-size:28px;color:#ffdd44;margin-bottom:36px;">Score: '+score+'</p><p style="font-size:14px;color:#444;font-style:italic;margin-bottom:36px;">Your tombstone remains where you fell...</p><div style="display:flex;gap:16px;justify-content:center;"><button id="restartBtn" style="padding:14px 36px;font-size:18px;background:linear-gradient(135deg,#aa0000,#dd2222);color:white;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Arial;">⚔️ Play Again</button><button id="menuBtn" style="padding:14px 36px;font-size:18px;background:#1a1a1a;color:white;border:2px solid #444;border-radius:10px;cursor:pointer;font-family:Arial;">🏠 Main Menu</button></div><p style="margin-top:18px;font-size:12px;color:#333;">Press R to play again</p></div>';
            document.body.appendChild(overlay);
            setTimeout(function(){overlay.style.opacity='1';},50);
            function restartGame(){
                overlay.style.opacity='0';
                setTimeout(function(){if(overlay.parentNode)document.body.removeChild(overlay);},1000);
                playerHealth=100;playerMaxHealth=100;playerXP=0;playerLevel=1;
                playerSpeed=200;playerDamage=20;xpToNextLevel=100;score=0;
                inventory=[];bossSpawned=false;currentDimension=0;surviveTimer=0;
                minions=[];wolfPets=[];isBerserking=false;playerInvisible=false;
                currentWave=0;waveEnemiesKilled=0;bossRushIndex=0;
                gameStarted=false;window.gameStarted=false;
                normalTiles=[];shadowTiles=[];
                localStorage.removeItem('pixelRPGSave');
                scene.cameras.main.fadeIn(100);scene.scene.restart();
                setTimeout(function(){var m=document.getElementById('startMenu');if(m)m.style.display='flex';},500);
            }
            document.getElementById('restartBtn').onclick=restartGame;
            document.getElementById('menuBtn').onclick=restartGame;
            document.addEventListener('keydown',function onR(e){if(e.key==='r'||e.key==='R'){document.removeEventListener('keydown',onR);restartGame();}});
        });
    },1000);
}

// ================================
// UPDATE — 60 times per second
// ================================
function update(){
    if(!gameStarted||!player||!player.active)return;
    if(chatOpen)return;

    player.setVelocity(0);var speed=playerSpeed,moving=false;

    if((shiftKey&&shiftKey.isDown||window.touchSprinting)&&stamina>0){speed*=1.55;stamina=Math.max(0,stamina-0.8);}
    else{stamina=Math.min(maxStamina,stamina+0.3);}
    if(staminaBar)staminaBar.width=202*(stamina/maxStamina);

    if(cursors.left.isDown||wasd.left.isDown){player.setVelocityX(-speed);playerFacing=-1;player.setFlipX(true);moving=true;}
    else if(cursors.right.isDown||wasd.right.isDown){player.setVelocityX(speed);playerFacing=1;player.setFlipX(false);moving=true;}
    if(cursors.up.isDown||wasd.up.isDown){player.setVelocityY(-speed);moving=true;}
    else if(cursors.down.isDown||wasd.down.isDown){player.setVelocityY(speed);moving=true;}

    if(joystickActive&&(Math.abs(joystickDX)>0.1||Math.abs(joystickDY)>0.1)){
        player.setVelocityX(joystickDX*speed);player.setVelocityY(joystickDY*speed);
        if(joystickDX<-0.1){playerFacing=-1;player.setFlipX(true);}else if(joystickDX>0.1){playerFacing=1;player.setFlipX(false);}
        moving=true;
    }

    if(moving) player.y+=Math.sin(Date.now()/120)*0.5;
    if(attackIndicator)attackIndicator.setPosition(player.x,player.y);

    sendPosition();
    updateMinimap();

    if(playerNameText)playerNameText.setPosition(player.x-40,player.y-58);

    potions.getChildren().forEach(function(p){if(p.label)p.label.setPosition(p.x-8,p.y-28);});

    // Boss AI
    if(boss&&boss.active){
        var bdx=player.x-boss.x,bdy=player.y-boss.y,bdist=Math.sqrt(bdx*bdx+bdy*bdy);
        if(bdist>0){boss.setVelocityX((bdx/bdist)*boss.speed);boss.setVelocityY((bdy/bdist)*boss.speed);}
        boss.rotation+=0.015;
    }

    // Minion AI
    minions.forEach(function(m){
        if(!m||!m.active)return;
        var dx=player.x-m.x,dy=player.y-m.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist>80&&dist>0){m.setVelocityX((dx/dist)*m.speed);m.setVelocityY((dy/dist)*m.speed);}else m.setVelocity(0);
        if(m.label)m.label.setPosition(m.x,m.y-28);
    });

    // Wolf AI
    wolfPets.forEach(function(wolf){
        if(!wolf||!wolf.active)return;
        var closest=null,closestDist=300;
        enemies.getChildren().forEach(function(e){if(!e||!e.active)return;var d=Phaser.Math.Distance.Between(wolf.x,wolf.y,e.x,e.y);if(d<closestDist){closestDist=d;closest=e;}});
        if(closest){var wdx=closest.x-wolf.x,wdy=closest.y-wolf.y,wd=Math.sqrt(wdx*wdx+wdy*wdy);if(wd>0){wolf.setVelocityX((wdx/wd)*wolf.speed);wolf.setVelocityY((wdy/wd)*wolf.speed);}}
        else{var pdx=player.x-wolf.x,pdy=player.y-wolf.y,pd=Math.sqrt(pdx*pdx+pdy*pdy);if(pd>100&&pd>0){wolf.setVelocityX((pdx/pd)*150);wolf.setVelocityY((pdy/pd)*150);}else wolf.setVelocity(0);}
        if(wolf.label)wolf.label.setPosition(wolf.x,wolf.y-28);
    });

    // Enemy AI
    enemies.getChildren().forEach(function(e){
        if(!e||!e.active||e.speed===0)return;
        var dx=player.x-e.x,dy=player.y-e.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<280&&dist>0){e.setVelocityX((dx/dist)*e.speed);e.setVelocityY((dy/dist)*e.speed);}
        else{
            var pdx=(e.patrolX||e.x)-e.x,pdy=(e.patrolY||e.y)-e.y,pdist=Math.sqrt(pdx*pdx+pdy*pdy);
            if(pdist>100&&pdist>0){e.setVelocityX((pdx/pdist)*e.speed*0.4);e.setVelocityY((pdy/pdist)*e.speed*0.4);}
            else if(Math.random()<0.008){e.setVelocityX(Phaser.Math.Between(-40,40));e.setVelocityY(Phaser.Math.Between(-40,40));}
        }
        var mSize=e.isShadow?((SHADOW_MONSTERS[e.monsterType]||SHADOW_MONSTERS.wraith).size||40):((MONSTERS[e.monsterType]||MONSTERS.goblin).size||40);
        if(e.healthBar){e.healthBar.setPosition(e.x,e.y-35);e.healthBar.width=mSize*(e.health/e.maxHealth);}
        if(e.nameTag)e.nameTag.setPosition(e.x,e.y-50);
    });
}
