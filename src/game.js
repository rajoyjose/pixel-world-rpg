// ================================
// PIXEL WORLD RPG - Complete Fix
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
// CLASS DEFINITIONS
// ================================
var CLASSES = {
    warrior:     { name:'Warrior',     icon:'⚔️',  color:0x4488ff, hp:220, speed:155, damage:35, attackRange:80,  ability:'Shield Bash', abilityIcon:'🛡️', abilityCooldown:5000,  attackCooldown:700 },
    archer:      { name:'Archer',      icon:'🏹',  color:0x44cc44, hp:110, speed:285, damage:28, attackRange:200, ability:'Arrow Rain',  abilityIcon:'🏹', abilityCooldown:4000,  attackCooldown:500 },
    mage:        { name:'Mage',        icon:'🧙',  color:0x8844ff, hp:80,  speed:200, damage:70, attackRange:150, ability:'Fireball',    abilityIcon:'🔥', abilityCooldown:6000,  attackCooldown:900 },
    rogue:       { name:'Rogue',       icon:'🗡️', color:0xff8800, hp:110, speed:265, damage:50, attackRange:70,  ability:'Vanish',      abilityIcon:'👁️',abilityCooldown:8000,  attackCooldown:400 },
    paladin:     { name:'Paladin',     icon:'⚜️', color:0xffdd44, hp:180, speed:155, damage:28, attackRange:90,  ability:'Holy Aura',   abilityIcon:'✨', abilityCooldown:7000,  attackCooldown:800 },
    necromancer: { name:'Necromancer', icon:'💀',  color:0x44ff44, hp:90,  speed:195, damage:40, attackRange:130, ability:'Raise Dead',  abilityIcon:'☠️', abilityCooldown:9000,  attackCooldown:800 },
    berserker:   { name:'Berserker',   icon:'🪓',  color:0xff2222, hp:180, speed:195, damage:55, attackRange:85,  ability:'Berserk Rage',abilityIcon:'😤', abilityCooldown:10000, attackCooldown:500 },
    ranger:      { name:'Ranger',      icon:'🌿',  color:0x44ffaa, hp:130, speed:245, damage:32, attackRange:160, ability:'Wolf Pack',   abilityIcon:'🐺', abilityCooldown:12000, attackCooldown:600 }
};

// ================================
// MAP THEMES — unique per mode!
// ================================
var MAP_THEMES = {
    adventure: { bgColor:0x1a8f2d, tileA:0x2d8a2d, tileB:0x267326, pathColor:0x8B6914, waterColor:0x1155aa, treeColor:0x1a6e1a, trunkColor:0x6B3A2A, rockColor:0x888888, fireColor:0xff4400, hasShadow:true  },
    survival:  { bgColor:0x3d1a00, tileA:0x8B3000, tileB:0x6B2200, pathColor:0xcc6600, waterColor:0xff3300, treeColor:0x884400, trunkColor:0x553322, rockColor:0x664422, fireColor:0xff6600, hasShadow:false },
    bossrush:  { bgColor:0x0d0011, tileA:0x1a0033, tileB:0x110022, pathColor:0x330066, waterColor:0x4400aa, treeColor:0x550055, trunkColor:0x330033, rockColor:0x333344, fireColor:0xaa00ff, hasShadow:false },
    pvp:       { bgColor:0x1a1a1a, tileA:0x444444, tileB:0x333333, pathColor:0x666666, waterColor:0x224466, treeColor:0x556644, trunkColor:0x555544, rockColor:0x777777, fireColor:0xffaa00, hasShadow:false }
};

// ================================
// BOSS DEFINITIONS — unique per mode!
// ================================
var BOSS_DEFS = {
    adventure: { name:'🐉 Dragon King',   bodyColor:0x660000, eyeColor:0xff0000, mouthColor:0xffff00, barColor:0xff0000, hp:600, speed:55, xp:400, score:600 },
    survival:  { name:'🌋 Lava Titan',    bodyColor:0xff4400, eyeColor:0xffff00, mouthColor:0xff8800, barColor:0xff6600, hp:400, speed:45, xp:300, score:400 },
    bossrush:  [
        { name:'👻 Shadow Wraith', bodyColor:0x220044, eyeColor:0xaa00ff, mouthColor:0x8800ff, barColor:0xaa00ff, hp:300, speed:90, xp:200, score:300 },
        { name:'🧊 Frost Giant',   bodyColor:0x003366, eyeColor:0x00ffff, mouthColor:0x0088ff, barColor:0x00ffff, hp:450, speed:50, xp:280, score:400 },
        { name:'⚡ Storm Lord',    bodyColor:0x443300, eyeColor:0xffff00, mouthColor:0xffaa00, barColor:0xffff00, hp:550, speed:80, xp:350, score:500 },
        { name:'🌑 Void Master',   bodyColor:0x000022, eyeColor:0xff00ff, mouthColor:0xaa00aa, barColor:0xff00ff, hp:650, speed:70, xp:420, score:600 },
        { name:'💀 Death Emperor', bodyColor:0x220000, eyeColor:0xff0000, mouthColor:0x880000, barColor:0xff0000, hp:800, speed:65, xp:500, score:800 }
    ]
};

// ================================
// MONSTERS per mode
// ================================
var MONSTERS_ADVENTURE = {
    goblin:   { name:'👹 Goblin',   color:0xff4444, size:36, hp:30,  speed:80,  damage:8,  xp:20, score:10 },
    troll:    { name:'👺 Troll',    color:0x44aa44, size:58, hp:90,  speed:45,  damage:22, xp:45, score:28 },
    skeleton: { name:'💀 Skeleton', color:0xcccccc, size:36, hp:40,  speed:115, damage:14, xp:30, score:20 },
    demon:    { name:'😈 Demon',    color:0xaa00ff, size:44, hp:65,  speed:95,  damage:26, xp:55, score:38 },
    orc:      { name:'🗡️ Orc',     color:0x886600, size:50, hp:70,  speed:65,  damage:18, xp:38, score:25 }
};
var MONSTERS_SURVIVAL = {
    firesprite:  { name:'🔥 Fire Sprite', color:0xff6600, size:34, hp:35, speed:100, damage:12, xp:25, score:15 },
    sandworm:    { name:'🐛 Sand Worm',   color:0xaa7700, size:52, hp:80, speed:50,  damage:20, xp:40, score:26 },
    lavabeast:   { name:'🌋 Lava Beast',  color:0xff2200, size:46, hp:70, speed:70,  damage:28, xp:50, score:34 },
    scorpion:    { name:'🦂 Scorpion',    color:0xcc8800, size:38, hp:45, speed:110, damage:18, xp:35, score:22 }
};
var MONSTERS_BOSSRUSH = {
    darkspirit: { name:'👻 Dark Spirit', color:0x6600aa, size:38, hp:50, speed:120, damage:20, xp:38, score:28 },
    boneknight: { name:'⚔️ Bone Knight', color:0xbbbbbb, size:44, hp:85, speed:60,  damage:25, xp:48, score:32 },
    voidcreep:  { name:'🌑 Void Creep',  color:0x110033, size:40, hp:55, speed:105, damage:22, xp:42, score:30 }
};
var MONSTERS_PVP = {
    gladiator:  { name:'⚔️ Gladiator',   color:0x888888, size:46, hp:75, speed:70,  damage:22, xp:40, score:28 },
    arenabeast: { name:'🦁 Arena Beast', color:0x886600, size:50, hp:90, speed:80,  damage:26, xp:48, score:34 }
};

// ================================
// QUESTS
// ================================
var QUEST_TEMPLATES = [
    { id:'q1', desc:'Kill 5 Goblins',    type:'kill', monster:'goblin',   target:5,   reward:60,  xpReward:50  },
    { id:'q2', desc:'Kill 3 Trolls',     type:'kill', monster:'troll',    target:3,   reward:80,  xpReward:75  },
    { id:'q3', desc:'Kill 4 Skeletons',  type:'kill', monster:'skeleton', target:4,   reward:70,  xpReward:60  },
    { id:'q4', desc:'Collect 3 Potions', type:'collect',                   target:3,   reward:50,  xpReward:40  },
    { id:'q5', desc:'Reach Level 3',     type:'level',                     target:3,   reward:150, xpReward:100 },
    { id:'q6', desc:'Defeat the Boss',   type:'boss',                      target:1,   reward:500, xpReward:400 },
    { id:'q7', desc:'Survive 2 minutes', type:'survive',                   target:120, reward:200, xpReward:150 },
    { id:'q8', desc:'Score 500 points',  type:'score',                     target:500, reward:180, xpReward:120 }
];

// ================================
// GAME VARIABLES
// ================================
var player, cursors, wasd, shiftKey;
var enemies, potions, portals;
var minions = [], wolfPets = [];
var boss = null, bossHealthBar, bossHealthBarBg, bossNameText;
var bossSpawned = false;
var scene;
var gameStarted = false;
var selectedClass = 'warrior', selectedMode = 'adventure';
var playerClass, mapTheme;
var playerFacing = 1;
var otherPlayers = {};

// Touch
var joystickActive = false, joystickStartX = 0, joystickStartY = 0;
var joystickDX = 0, joystickDY = 0;

// Player stats
var playerHealth = 100, playerMaxHealth = 100;
var playerXP = 0, playerLevel = 1;
var playerSpeed = 200, playerDamage = 20, playerAttackRange = 80;
var xpToNextLevel = 100, score = 0;
var lastHitTime = 0, lastAttackTime = 0;
var playerName = 'Hero';
var inventory = [], inventoryOpen = false, chatOpen = false;
var abilityLastUsed = 0, playerInvisible = false, isBerserking = false;

// Stamina
var stamina = 100, maxStamina = 100, staminaBar;

// Dimension
var currentDimension = 0, dimensionOverlay, nightOverlay;
var shadowTiles = [], normalTiles = [], portalCooldown = false;

// Quests
var activeQuests = [];
var questStats = { kills: {}, potionsCollected: 0, bossKills: 0, surviveTime: 0 };

// Other
var tombstones = [], surviveTimer = 0, dayTime = 0, timeText;
var healthBar, healthBarBg, healthText;
var xpBar, xpBarBg, xpText;
var levelText, scoreText, playerNameText;
var inventoryPanel, inventoryTexts = [];
var attackIndicator;
var tileSize = 64, mapWidth = 28, mapHeight = 28;

// Firebase
var myPlayerId = null, playersRef = null, chatRef = null, tombstonesRef = null;
var lastPosSent = 0;

// Mode vars
var currentWave = 0, waveEnemyCount = 0, waveEnemiesKilled = 0;
var bossRushIndex = 0;
var currentMonsterPool = MONSTERS_ADVENTURE;

// ================================
// START BUTTON
// ================================
document.getElementById('startBtn').onclick = function() {
    var v = document.getElementById('nameInput').value.trim();
    if (v) playerName = v;
    selectedClass = window._selectedClass || 'warrior';
    selectedMode  = window._selectedMode  || 'adventure';

    document.getElementById('startMenu').style.display = 'none';

    function show(id) { var el = document.getElementById(id); if (el) el.style.display = 'block'; }
    function showFlex(id) { var el = document.getElementById(id); if (el) el.style.display = 'flex'; }

    show('chatBox'); show('playerCount'); show('minimap');
    show('dimensionIndicator'); show('questPanel'); show('gameModeHUD');

    var labels = { adventure:'🌲 Adventure', survival:'🔥 Survival', bossrush:'💀 Boss Rush', pvp:'⚔️ PvP Arena' };
    var mi = document.getElementById('gameModeHUD');
    if (mi) mi.textContent = labels[selectedMode] || '🌲 Adventure';

    if (selectedMode === 'survival') show('waveHUD');

    if (isMobile) {
        show('joystickZone'); showFlex('actionButtons');
        var i2 = document.getElementById('abilityIcon2');
        if (i2) i2.textContent = CLASSES[selectedClass].abilityIcon;
    } else {
        showFlex('abilityBar'); show('attackHint');
        setTimeout(function() {
            var h = document.getElementById('attackHint');
            if (h) { h.style.transition = 'opacity 1s'; h.style.opacity = '0'; setTimeout(function() { if (h) h.style.display = 'none'; }, 1000); }
        }, 4000);
    }

    var icon = document.getElementById('abilityIcon');
    if (icon) icon.textContent = CLASSES[selectedClass].abilityIcon;

    window.gameStarted = true;
    gameStarted = true;
};

document.getElementById('nameInput').onkeydown = function(e) { if (e.key === 'Enter') document.getElementById('startBtn').click(); };

// Touch handlers — these safely call game functions
window._selectedClass = 'warrior';
window._selectedMode  = 'adventure';
window.touchSprinting = false;
window.gameStarted    = false;

// ================================
// SOUNDS
// ================================
function playTone(freq, dur, type) {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = type || 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
    } catch(e) {}
}

var sounds = {
    hit:       function() { playTone(150, 0.1, 'square'); },
    attack:    function() { playTone(220, 0.06, 'sawtooth'); },
    enemyDie:  function() { playTone(80, 0.2, 'sawtooth'); },
    levelUp:   function() { playTone(523, 0.1, 'sine'); setTimeout(function() { playTone(659, 0.1, 'sine'); }, 100); setTimeout(function() { playTone(784, 0.2, 'sine'); }, 200); },
    pickup:    function() { playTone(600, 0.08, 'sine'); },
    save:      function() { playTone(523, 0.1, 'sine'); setTimeout(function() { playTone(659, 0.1, 'sine'); }, 120); setTimeout(function() { playTone(880, 0.2, 'sine'); }, 240); },
    ability:   function() { playTone(300, 0.3, 'square'); },
    portal:    function() { playTone(200, 0.2, 'sine'); setTimeout(function() { playTone(400, 0.3, 'sine'); }, 200); },
    questDone: function() { playTone(660, 0.1, 'sine'); setTimeout(function() { playTone(880, 0.2, 'sine'); }, 150); },
    bossSpawn: function() { playTone(100, 0.5, 'sawtooth'); setTimeout(function() { playTone(80, 0.5, 'sawtooth'); }, 300); },
    wave:      function() { playTone(440, 0.1, 'sine'); setTimeout(function() { playTone(550, 0.1, 'sine'); }, 100); setTimeout(function() { playTone(660, 0.2, 'sine'); }, 200); },
    gameOver:  function() { playTone(400, 0.4, 'sine'); setTimeout(function() { playTone(350, 0.4, 'sine'); }, 400); setTimeout(function() { playTone(300, 0.4, 'sine'); }, 800); setTimeout(function() { playTone(200, 0.8, 'sine'); }, 1600); }
};

// ================================
// PRELOAD
// ================================
function preload() { console.log('Loading...'); }

// ================================
// CREATE
// ================================
function create() {
    scene = this;
    loadGame();
    initQuests();
    var check = scene.time.addEvent({ delay: 100, loop: true, callback: function() { if (gameStarted) { check.remove(); startGame(); } } });
}

// ================================
// QUESTS
// ================================
function initQuests() {
    activeQuests = QUEST_TEMPLATES.slice(0, 5).map(function(q) {
        return { id: q.id, desc: q.desc, type: q.type, monster: q.monster, target: q.target, reward: q.reward, xpReward: q.xpReward, current: 0, done: false };
    });
    updateQuestPanel();
}

function updateQuests(type, data) {
    var changed = false;
    activeQuests.forEach(function(q) {
        if (q.done) return;
        if (type === 'kill'     && q.type === 'kill'      && q.monster === data.monster) { q.current = Math.min(q.current + 1, q.target); changed = true; }
        if (type === 'collect'  && q.type === 'collect')  { q.current = Math.min(q.current + 1, q.target); changed = true; }
        if (type === 'level'    && q.type === 'level')    { q.current = playerLevel; changed = true; }
        if (type === 'boss'     && q.type === 'boss')     { q.current = 1; changed = true; }
        if (type === 'survive'  && q.type === 'survive')  { q.current = Math.floor(surviveTimer); changed = true; }
        if (type === 'score'    && q.type === 'score')    { q.current = score; changed = true; }
        if (!q.done && q.current >= q.target) { q.done = true; completeQuest(q); }
    });
    if (changed) updateQuestPanel();
}

function completeQuest(q) {
    sounds.questDone();
    score += q.reward;
    if (scoreText) scoreText.setText('Score: ' + score);
    gainXP(q.xpReward);
    if (player) showFloatingText('📜 Quest! +' + q.reward, player.x - 80, player.y - 100, '#ffaa00');
    addChatMessage('Quest', '✅ ' + q.desc, '#ffaa00');
    setTimeout(function() {
        var doneIds = activeQuests.map(function(x) { return x.id; });
        for (var i = 0; i < QUEST_TEMPLATES.length; i++) {
            if (doneIds.indexOf(QUEST_TEMPLATES[i].id) === -1) {
                var next = QUEST_TEMPLATES[i];
                var idx = activeQuests.findIndex(function(x) { return x.id === q.id; });
                if (idx !== -1) activeQuests[idx] = { id: next.id, desc: next.desc, type: next.type, monster: next.monster, target: next.target, reward: next.reward, xpReward: next.xpReward, current: 0, done: false };
                updateQuestPanel();
                break;
            }
        }
    }, 3000);
}

function updateQuestPanel() {
    var list = document.getElementById('questList');
    if (!list) return;
    list.innerHTML = '';
    activeQuests.forEach(function(q) {
        var div = document.createElement('div');
        div.className = 'questItem' + (q.done ? ' done' : '');
        div.innerHTML = (q.done ? '✅ ' : '🔲 ') + q.desc + '<div class="questProgress">' + q.current + '/' + q.target + '</div><div class="questReward">+' + q.reward + ' pts  +' + q.xpReward + ' XP</div>';
        list.appendChild(div);
    });
}

// ================================
// FIREBASE
// ================================
function connectToServer() {
    try {
        myPlayerId = 'p_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
        playersRef    = firebase.database().ref('players');
        chatRef       = firebase.database().ref('chat');
        tombstonesRef = firebase.database().ref('tombstones');

        var myRef = playersRef.child(myPlayerId);
        myRef.set({ id: myPlayerId, name: playerClass.icon + ' ' + playerName, x: 400, y: 300, level: playerLevel, dimension: 0, cls: selectedClass });
        myRef.onDisconnect().remove();

        playersRef.on('child_added', function(snap) {
            var d = snap.val(); if (!d || d.id === myPlayerId) return;
            addOtherPlayer(d);
            addChatMessage('System', d.name + ' joined!', '#ffff44');
            updateOnlineCount();
        });

        playersRef.on('child_changed', function(snap) {
            var d = snap.val(); if (!d || d.id === myPlayerId) return;
            if (otherPlayers[d.id]) {
                // Store target for smooth lerp
                otherPlayers[d.id].targetX = d.x;
                otherPlayers[d.id].targetY = d.y;
            }
        });

        playersRef.on('child_removed', function(snap) {
            var d = snap.val(); if (!d) return;
            if (otherPlayers[d.id]) {
                addChatMessage('System', d.name + ' left', '#ff8888');
                if (otherPlayers[d.id].sprite) otherPlayers[d.id].sprite.destroy();
                if (otherPlayers[d.id].nameTag) otherPlayers[d.id].nameTag.destroy();
                delete otherPlayers[d.id];
                updateOnlineCount();
            }
        });

        chatRef.limitToLast(1).on('child_added', function(snap) {
            var d = snap.val(); if (!d || d.senderId === myPlayerId) return;
            addChatMessage(d.name, d.message, '#ffffff');
        });

        tombstonesRef.once('value', function(snap) {
            snap.forEach(function(child) { var t = child.val(); if (t) addTombstoneVisual(t.x, t.y, t.name, t.level, '#ffaaaa'); });
        });

        tombstonesRef.on('child_added', function(snap) {
            var t = snap.val(); if (!t || t.senderId === myPlayerId) return;
            addTombstoneVisual(t.x, t.y, t.name, t.level, '#ffaaaa');
            addChatMessage('System', '💀 ' + t.name + ' fell!', '#ff8888');
        });

        addChatMessage('System', '🌐 Multiplayer connected!', '#44ff44');
        updateOnlineCount();
    } catch(e) {
        console.log('Offline:', e);
        addChatMessage('System', '🌐 Playing offline', '#ffaa00');
    }
}

function addOtherPlayer(data) {
    if (otherPlayers[data.id] || !scene || !scene.physics) return;
    var sprite = scene.physics.add.image(data.x || 400, data.y || 300, 'otherPlayerTex');
    var nameTag = scene.add.text(data.x - 30, data.y - 52, data.name || 'Player', { fontSize: '12px', fill: '#cc88ff', stroke: '#000', strokeThickness: 1 });
    otherPlayers[data.id] = { sprite: sprite, nameTag: nameTag, name: data.name, targetX: data.x || 400, targetY: data.y || 300 };
}

function updateOnlineCount() {
    if (!playersRef) return;
    playersRef.once('value', function(snap) { updatePlayerCount(snap.numChildren()); });
}

function sendPosition() {
    if (!playersRef || !myPlayerId || !player) return;
    var now = Date.now();
    if (now - lastPosSent < 50) return; // max 20/sec
    lastPosSent = now;
    playersRef.child(myPlayerId).update({ x: Math.floor(player.x), y: Math.floor(player.y), dimension: currentDimension });
}

// ================================
// START GAME
// ================================
function startGame() {
    playerClass = CLASSES[selectedClass];
    mapTheme    = MAP_THEMES[selectedMode];

    playerMaxHealth = playerClass.hp;
    playerHealth    = Math.min(playerHealth, playerMaxHealth);
    if (playerHealth < 10) playerHealth = playerMaxHealth;
    playerSpeed       = playerClass.speed;
    playerDamage      = playerClass.damage;
    playerAttackRange = playerClass.attackRange;

    // Set monster pool per mode
    if      (selectedMode === 'adventure') currentMonsterPool = MONSTERS_ADVENTURE;
    else if (selectedMode === 'survival')  currentMonsterPool = MONSTERS_SURVIVAL;
    else if (selectedMode === 'bossrush')  currentMonsterPool = MONSTERS_BOSSRUSH;
    else if (selectedMode === 'pvp')       currentMonsterPool = MONSTERS_PVP;

    buildWorld();
    createTextures();
    createPlayer();

    enemies = scene.physics.add.group();
    potions = scene.physics.add.group();

    if (selectedMode === 'adventure') {
        createPortals();
        scene.physics.add.overlap(player, portals, touchPortal, null, scene);
    }

    // Start mode
    if      (selectedMode === 'adventure') startAdventure();
    else if (selectedMode === 'survival')  startSurvival();
    else if (selectedMode === 'bossrush')  startBossRush();
    else if (selectedMode === 'pvp')       startPvp();

    setupCamera();
    setupKeyboard();
    buildUI();
    buildInventoryPanel();
    if (selectedMode === 'adventure') startDayNightCycle();
    startSurviveTimer();
    setupJoystick();
    connectToServer();

    scene.physics.add.overlap(player, enemies, onPlayerTouchEnemy, null, scene);
    scene.physics.add.overlap(player, potions, pickUpPotion, null, scene);

    // Set background color
    scene.cameras.main.setBackgroundColor(mapTheme.bgColor);

    console.log('Started:', selectedMode, 'as', playerClass.name);
}

// ================================
// BUILD WORLD — unique per mode!
// ================================
function buildWorld() {
    var t = mapTheme;

    // Base ground tiles
    for (var x = 0; x < mapWidth; x++) {
        for (var y = 0; y < mapHeight; y++) {
            var color;
            if (Math.abs(x - y) < 2 || Math.abs(x + y - mapWidth) < 2) color = t.pathColor;
            else if ((x + y) % 2 === 0) color = t.tileA;
            else color = t.tileB;
            var tile = scene.add.rectangle(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize - 1, tileSize - 1, color);
            normalTiles.push(tile);
        }
    }

    // Mode-specific environment
    if (selectedMode === 'adventure') {
        // River
        for (var i = 5; i < 14; i++) {
            var w = scene.add.rectangle(20 * tileSize + tileSize / 2, i * tileSize + tileSize / 2, tileSize - 1, tileSize - 1, t.waterColor);
            normalTiles.push(w);
        }
        // Trees
        var treePts = [{x:2,y:2},{x:5,y:3},{x:8,y:1},{x:14,y:4},{x:16,y:7},{x:3,y:11},{x:10,y:19},{x:7,y:7},{x:11,y:4},{x:23,y:5},{x:25,y:11}];
        treePts.forEach(function(pos) {
            var tx = pos.x * tileSize + tileSize / 2, ty = pos.y * tileSize + tileSize / 2;
            normalTiles.push(scene.add.rectangle(tx, ty, 14, 28, t.trunkColor));
            normalTiles.push(scene.add.circle(tx, ty - 14, 24, t.treeColor));
            normalTiles.push(scene.add.circle(tx - 7, ty - 20, 16, t.treeColor));
        });
        // Rocks
        [{x:6,y:6},{x:11,y:9},{x:18,y:3}].forEach(function(pos) {
            normalTiles.push(scene.add.ellipse(pos.x * tileSize + tileSize / 2, pos.y * tileSize + tileSize / 2, 32, 22, t.rockColor));
        });
        // Campfires
        [{x:9,y:9},{x:19,y:5}].forEach(function(pos) {
            var fx = pos.x * tileSize + tileSize / 2, fy = pos.y * tileSize + tileSize / 2;
            scene.add.rectangle(fx, fy + 4, 24, 8, t.trunkColor);
            var f1 = scene.add.triangle(fx, fy - 18, -9, 9, 9, 9, 0, -13, t.fireColor);
            var f2 = scene.add.triangle(fx - 5, fy - 11, -5, 7, 5, 7, 0, -9, 0xff8800);
            scene.tweens.add({ targets: [f1, f2], scaleX: 0.85, scaleY: 1.15, duration: 160 + Math.random() * 100, yoyo: true, repeat: -1 });
        });

    } else if (selectedMode === 'survival') {
        // Lava pools
        for (var i = 0; i < 7; i++) {
            var lx = Phaser.Math.Between(3, 24) * tileSize, ly = Phaser.Math.Between(3, 24) * tileSize;
            var lava = scene.add.ellipse(lx, ly, 70 + Math.random() * 50, 40 + Math.random() * 30, t.waterColor);
            scene.tweens.add({ targets: lava, scaleX: 1.05, duration: 1000 + Math.random() * 500, yoyo: true, repeat: -1 });
            normalTiles.push(lava);
        }
        // Dead trees / rocks
        for (var i = 0; i < 8; i++) {
            var rx = Phaser.Math.Between(2, 25) * tileSize, ry = Phaser.Math.Between(2, 25) * tileSize;
            normalTiles.push(scene.add.rectangle(rx, ry, 10, 30, t.trunkColor));
            normalTiles.push(scene.add.ellipse(rx, ry, 28, 20, t.rockColor));
        }
        // Geysers
        for (var i = 0; i < 5; i++) {
            var gx = Phaser.Math.Between(3, 24) * tileSize, gy = Phaser.Math.Between(3, 24) * tileSize;
            var geyser = scene.add.rectangle(gx, gy, 8, 36, t.fireColor);
            scene.tweens.add({ targets: geyser, scaleY: 1.8, alpha: 0.3, duration: 700 + Math.random() * 400, yoyo: true, repeat: -1 });
        }

    } else if (selectedMode === 'bossrush') {
        // Dungeon pillars
        for (var i = 0; i < 10; i++) {
            var px = Phaser.Math.Between(2, 25) * tileSize, py = Phaser.Math.Between(2, 25) * tileSize;
            scene.add.rectangle(px, py, 22, 56, 0x222233);
            scene.add.rectangle(px, py, 30, 14, 0x333344);
        }
        // Purple torches
        for (var i = 0; i < 8; i++) {
            var torchX = Phaser.Math.Between(2, 25) * tileSize, torchY = Phaser.Math.Between(2, 25) * tileSize;
            var flame = scene.add.circle(torchX, torchY, 11, t.fireColor, 0.8);
            scene.tweens.add({ targets: flame, radius: 15, alpha: 0.4, duration: 280 + Math.random() * 200, yoyo: true, repeat: -1 });
        }

    } else if (selectedMode === 'pvp') {
        // Arena center
        scene.add.rectangle(mapWidth / 2 * tileSize, mapHeight / 2 * tileSize, 560, 380, 0x998855, 0.35).setOrigin(0.5);
        // Corner pillars with fire
        [{x:7,y:7},{x:21,y:7},{x:7,y:21},{x:21,y:21}].forEach(function(pos) {
            scene.add.rectangle(pos.x * tileSize, pos.y * tileSize, 36, 70, 0x888888);
            scene.add.rectangle(pos.x * tileSize, pos.y * tileSize, 44, 18, 0x999999);
            var f = scene.add.circle(pos.x * tileSize, pos.y * tileSize - 46, 9, t.fireColor);
            scene.tweens.add({ targets: f, radius: 13, alpha: 0.5, duration: 280, yoyo: true, repeat: -1 });
        });
    }

    // Shadow realm (adventure only)
    if (selectedMode === 'adventure') {
        for (var sx = 0; sx < mapWidth; sx++) {
            for (var sy = 0; sy < mapHeight; sy++) {
                shadowTiles.push(scene.add.rectangle(sx * tileSize + tileSize / 2, sy * tileSize + tileSize / 2, tileSize - 1, tileSize - 1, (sx + sy) % 2 === 0 ? 0x1a0033 : 0x110022).setVisible(false));
            }
        }
        [{x:3,y:3},{x:8,y:6},{x:13,y:2},{x:19,y:8}].forEach(function(pos) {
            var c = scene.add.triangle(pos.x * tileSize + tileSize / 2, pos.y * tileSize + tileSize / 4, -7, 14, 7, 14, 0, -18, 0x8800ff).setVisible(false);
            scene.tweens.add({ targets: c, alpha: 0.4, duration: 800, yoyo: true, repeat: -1 });
            shadowTiles.push(c);
        });
    }

    nightOverlay    = scene.add.rectangle(0, 0, mapWidth * tileSize, mapHeight * tileSize, 0x000033, 0).setOrigin(0, 0).setDepth(5);
    dimensionOverlay = scene.add.rectangle(0, 0, mapWidth * tileSize, mapHeight * tileSize, 0x220044, 0).setOrigin(0, 0).setDepth(4);
}

// ================================
// CREATE TEXTURES — fixed, no fillArc!
// ================================
function makeSpriteTexture(name, bodyColor, headColor, detailColor, shape) {
    var g = scene.make.graphics({ x: 0, y: 0, add: false });

    // Body
    g.fillStyle(bodyColor);
    if (shape === 'big')  g.fillRect(0, 10, 44, 30);
    else if (shape === 'slim') g.fillRect(6, 12, 28, 28);
    else if (shape === 'robe') g.fillRect(4, 14, 32, 26);
    else g.fillRoundedRect(4, 12, 32, 28, 4);

    // Head — use circle!
    g.fillStyle(headColor);
    g.fillCircle(20, 9, 12);

    // Eyes
    g.fillStyle(0x000000);
    g.fillCircle(15, 8, 3);
    g.fillCircle(25, 8, 3);

    // Detail color stripe
    g.fillStyle(detailColor);
    g.fillRect(8, 18, 24, 5);

    g.generateTexture(name, 44, 44);
    g.destroy();
}

function createTextures() {
    // Player — unique look per class
    makeSpriteTexture('playerTex', playerClass.color, 0xffddaa, 0xffffff, playerClass.name === 'Berserker' ? 'big' : (playerClass.name === 'Mage' || playerClass.name === 'Necromancer') ? 'robe' : (playerClass.name === 'Archer' || playerClass.name === 'Rogue' || playerClass.name === 'Ranger') ? 'slim' : 'normal');

    // Other player textures for each class
    Object.keys(CLASSES).forEach(function(cls) {
        var c = CLASSES[cls];
        var shape = (cls === 'berserker') ? 'big' : (cls === 'mage' || cls === 'necromancer') ? 'robe' : (cls === 'archer' || cls === 'rogue' || cls === 'ranger') ? 'slim' : 'normal';
        makeSpriteTexture('otherTex_' + cls, c.color, 0xffddaa, 0xaa44ff, shape);
    });

    // Default other player texture
    makeSpriteTexture('otherPlayerTex', 0xaa44ff, 0xffddaa, 0x8822cc, 'normal');

    // Monster textures
    var allMonsters = Object.assign({}, MONSTERS_ADVENTURE, MONSTERS_SURVIVAL, MONSTERS_BOSSRUSH, MONSTERS_PVP);
    Object.keys(allMonsters).forEach(function(key) {
        var m = allMonsters[key];
        if (!scene.textures.exists(key + 'Tex')) {
            var mg = scene.make.graphics({ x: 0, y: 0, add: false });
            mg.fillStyle(m.color);
            mg.fillRoundedRect(4, 10, m.size - 8, m.size - 10, 4);
            mg.fillStyle(0xffffff);
            mg.fillCircle(12, 14, 5);
            mg.fillCircle(m.size - 14, 14, 5);
            mg.fillStyle(0x000000);
            mg.fillCircle(13, 14, 3);
            mg.fillCircle(m.size - 13, 14, 3);
            mg.generateTexture(key + 'Tex', m.size, m.size);
            mg.destroy();
        }
    });

    // Potion
    var potg = scene.make.graphics({ x: 0, y: 0, add: false });
    potg.fillStyle(0xff69b4); potg.fillRoundedRect(2, 6, 26, 24, 8);
    potg.fillStyle(0xffbbdd); potg.fillCircle(10, 13, 6);
    potg.generateTexture('potionTex', 30, 32); potg.destroy();

    // Tombstone
    var tg = scene.make.graphics({ x: 0, y: 0, add: false });
    tg.fillStyle(0x666666); tg.fillRoundedRect(5, 0, 34, 40, 8);
    tg.fillStyle(0x999999); tg.fillRect(18, 10, 4, 18); tg.fillRect(11, 16, 18, 4);
    tg.generateTexture('tombstoneTex', 44, 44); tg.destroy();

    // Minion
    var smg = scene.make.graphics({ x: 0, y: 0, add: false });
    smg.fillStyle(0xdddddd); smg.fillRoundedRect(5, 10, 22, 24, 4);
    smg.fillStyle(0xeeeeee); smg.fillCircle(16, 8, 9);
    smg.generateTexture('minionTex', 32, 36); smg.destroy();

    // Wolf
    var wg = scene.make.graphics({ x: 0, y: 0, add: false });
    wg.fillStyle(0x886644); wg.fillEllipse(16, 16, 30, 22);
    wg.fillStyle(0x775533); wg.fillCircle(26, 10, 10);
    wg.generateTexture('wolfTex', 36, 32); wg.destroy();
}

// ================================
// CREATE PLAYER
// ================================
function createPlayer() {
    player = scene.physics.add.image(400, 300, 'playerTex');
    scene.physics.world.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
    player.setCollideWorldBounds(true);
    attackIndicator = scene.add.circle(player.x, player.y, playerAttackRange, 0xffffff, 0).setStrokeStyle(1, 0xffffff, 0.15).setDepth(8);
}

// ================================
// PORTALS
// ================================
function createPortals() {
    portals = scene.physics.add.staticGroup();
    var p1 = portals.create(22 * tileSize, 22 * tileSize, null); p1.setCircle(30); p1.portalType = 'toShadow';
    var p2 = portals.create(3 * tileSize, 3 * tileSize, null);   p2.setCircle(30); p2.portalType = 'toNormal';
    [{ x: 22 * tileSize, y: 22 * tileSize, color: 0xaa00ff, label: '🌀 Shadow Portal' },
     { x: 3  * tileSize, y: 3  * tileSize, color: 0xffaa00, label: '🌀 Return' }
    ].forEach(function(pd) {
        var gfx = scene.add.graphics();
        scene.time.addEvent({ delay: 50, loop: true, callback: function() {
            gfx.clear();
            var a = 0.4 + Math.sin(Date.now() / 300) * 0.3;
            gfx.lineStyle(5, pd.color, a); gfx.strokeCircle(pd.x, pd.y, 34);
            gfx.fillStyle(pd.color, a * 0.15); gfx.fillCircle(pd.x, pd.y, 32);
        }});
        scene.add.text(pd.x, pd.y - 48, pd.label, { fontSize: '12px', fill: '#ffffff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5);
    });
}

function touchPortal(player, portal) {
    if (portalCooldown) return; portalCooldown = true; setTimeout(function() { portalCooldown = false; }, 2000);
    if (portal.portalType === 'toShadow' && currentDimension === 0) enterShadowRealm();
    else if (portal.portalType === 'toNormal' && currentDimension === 1) enterNormalWorld();
}

function enterShadowRealm() {
    currentDimension = 1; sounds.portal(); scene.cameras.main.flash(500, 100, 0, 150);
    normalTiles.forEach(function(t) { t.setVisible(false); }); shadowTiles.forEach(function(t) { t.setVisible(true); });
    scene.tweens.add({ targets: dimensionOverlay, alpha: 0.4, duration: 1000 });
    clearEnemies(); for (var i = 0; i < 10; i++) spawnEnemy();
    var di = document.getElementById('dimensionIndicator'); if (di) { di.innerHTML = '🌑 Shadow Realm'; di.style.color = '#cc88ff'; }
    showFloatingText('🌑 Shadow Realm!', player.x - 100, player.y - 80, '#cc88ff');
    if (playersRef && myPlayerId) playersRef.child(myPlayerId).update({ dimension: 1 });
}

function enterNormalWorld() {
    currentDimension = 0; sounds.portal(); scene.cameras.main.flash(500, 50, 150, 50);
    shadowTiles.forEach(function(t) { t.setVisible(false); }); normalTiles.forEach(function(t) { t.setVisible(true); });
    scene.tweens.add({ targets: dimensionOverlay, alpha: 0, duration: 1000 });
    clearEnemies(); spawnInitialEnemies();
    var di = document.getElementById('dimensionIndicator'); if (di) { di.innerHTML = '🌍 Normal World'; di.style.color = '#aaffaa'; }
    showFloatingText('🌍 Normal World!', player.x - 100, player.y - 80, '#aaffaa');
    if (playersRef && myPlayerId) playersRef.child(myPlayerId).update({ dimension: 0 });
}

function clearEnemies() {
    enemies.getChildren().forEach(function(e) { if (e.healthBar) e.healthBar.destroy(); if (e.nameTag) e.nameTag.destroy(); e.destroy(); });
}

// ================================
// GAME MODES
// ================================
function startAdventure() {
    spawnInitialEnemies();
    scene.time.addEvent({ delay: 90000, callback: function() { if (player) showFloatingText('⚠️ Boss in 30s!', player.x - 120, player.y - 80, '#ff8800'); } });
    scene.time.addEvent({ delay: 120000, callback: function() { spawnBoss(); } });
}

function startSurvival() {
    var wi = document.getElementById('waveHUD'); if (wi) wi.style.display = 'block';
    showFloatingText('🔥 Survive the waves!', player ? player.x - 110 : 400, player ? player.y - 80 : 200, '#ff8844');
    setTimeout(function() { startNextWave(); }, 2000);
}

function startNextWave() {
    if (!gameStarted) return;
    currentWave++; waveEnemiesKilled = 0;
    waveEnemyCount = 5 + currentWave * 3;
    sounds.wave();
    var wi = document.getElementById('waveHUD');
    if (wi) wi.textContent = '🌊 Wave ' + currentWave + ' — ' + waveEnemyCount + ' enemies!';
    showFloatingText('🌊 WAVE ' + currentWave + '!', player.x - 60, player.y - 100, '#ff4444');
    var types = Object.keys(currentMonsterPool);
    for (var i = 0; i < waveEnemyCount; i++) {
        (function(delay) { setTimeout(function() { if (gameStarted) spawnEnemy(types[Math.floor(Math.random() * types.length)]); }, delay); })(i * 350);
    }
    // Boss every 5 waves
    if (currentWave % 5 === 0) {
        setTimeout(function() { if (gameStarted) spawnBoss(); }, waveEnemyCount * 350 + 1500);
    }
}

function onWaveKill() {
    if (selectedMode !== 'survival') return;
    waveEnemiesKilled++;
    if (waveEnemiesKilled >= waveEnemyCount) {
        showFloatingText('✅ Wave ' + currentWave + ' clear!', player.x - 100, player.y - 80, '#44ff44');
        playerHealth = Math.min(playerHealth + 30, playerMaxHealth); updateHealthBar();
        var wi = document.getElementById('waveHUD'); if (wi) wi.textContent = '⏳ Next wave in 3s...';
        setTimeout(function() { if (gameStarted) startNextWave(); }, 3000);
        return;
    }
    var wi = document.getElementById('waveHUD');
    if (wi) wi.textContent = '🌊 Wave ' + currentWave + ' — ' + (waveEnemyCount - waveEnemiesKilled) + ' left!';
}

function startBossRush() {
    bossRushIndex = 0;
    showFloatingText('💀 Boss Rush!', player ? player.x - 80 : 400, player ? player.y - 80 : 200, '#cc44ff');
    setTimeout(function() { spawnNextBossRush(); }, 2000);
}

function spawnNextBossRush() {
    if (!player || !player.active || !gameStarted) return;
    bossRushIndex++;
    var bossList = BOSS_DEFS.bossrush;
    var bd = bossList[(bossRushIndex - 1) % bossList.length];
    var texKey = 'rushBoss' + bossRushIndex;

    var brg = scene.make.graphics({ x: 0, y: 0, add: false });
    brg.fillStyle(bd.bodyColor); brg.fillRoundedRect(5, 5, 90, 90, 12);
    brg.fillStyle(bd.eyeColor);  brg.fillCircle(28, 28, 14); brg.fillCircle(72, 28, 14);
    brg.fillStyle(0x000000);     brg.fillCircle(28, 28, 8);  brg.fillCircle(72, 28, 8);
    brg.fillStyle(bd.mouthColor); brg.fillRect(22, 65, 56, 12);
    brg.generateTexture(texKey, 100, 100); brg.destroy();

    sounds.bossSpawn();
    var x = (mapWidth / 2) * tileSize, y = (mapHeight / 2) * tileSize;
    boss = scene.physics.add.image(x, y, texKey);
    boss.setCollideWorldBounds(true);
    boss.health = (bd.hp + playerLevel * 80) * Math.ceil(bossRushIndex / bossList.length);
    boss.maxHealth = boss.health;
    boss.speed = bd.speed + playerLevel * 5;
    boss.xpReward = bd.xp * bossRushIndex;
    bossSpawned = true;

    scene.tweens.add({ targets: boss, scaleX: 1.1, scaleY: 1.1, duration: 600, yoyo: true, repeat: -1 });

    if (bossHealthBarBg) bossHealthBarBg.destroy();
    if (bossHealthBar)   bossHealthBar.destroy();
    if (bossNameText)    bossNameText.destroy();
    bossHealthBarBg = scene.add.rectangle(640, 50, 504, 28, 0x000000).setScrollFactor(0).setDepth(15);
    bossHealthBar   = scene.add.rectangle(640, 50, 500, 24, bd.barColor).setScrollFactor(0).setDepth(15);
    bossNameText    = scene.add.text(640, 50, bd.name + ' #' + bossRushIndex, { fontSize: '14px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(15);

    showFloatingText('⚠️ ' + bd.name + '!', player.x - 120, player.y - 100, '#cc44ff');
    addChatMessage('System', '⚠️ ' + bd.name, '#cc44ff');
    scene.physics.add.overlap(player, boss, hitByBoss, null, scene);
}

function startPvp() {
    spawnInitialEnemies();
    addChatMessage('System', '⚔️ PvP Arena! Fight!', '#ff88ff');
    showFloatingText('⚔️ PvP Arena!', player ? player.x - 80 : 400, player ? player.y - 80 : 200, '#ff88ff');
}

// ================================
// SPAWN ENEMIES
// ================================
function spawnInitialEnemies() {
    var types = Object.keys(currentMonsterPool);
    for (var i = 0; i < 12; i++) spawnEnemy(types[Math.floor(Math.random() * types.length)]);
}

function spawnEnemy(type) {
    var pool = currentMonsterPool;
    var types = Object.keys(pool);
    if (!type || !pool[type]) type = types[Math.floor(Math.random() * types.length)];
    var m = pool[type];
    var x = Phaser.Math.Between(3, mapWidth - 3) * tileSize;
    var y = Phaser.Math.Between(3, mapHeight - 3) * tileSize;
    var texKey = type + 'Tex';

    // Generate texture if not exists
    if (!scene.textures.exists(texKey)) {
        var mg = scene.make.graphics({ x: 0, y: 0, add: false });
        mg.fillStyle(m.color); mg.fillRoundedRect(4, 10, m.size - 8, m.size - 10, 4);
        mg.fillStyle(0xffffff); mg.fillCircle(12, 14, 5); mg.fillCircle(m.size - 14, 14, 5);
        mg.fillStyle(0x000000); mg.fillCircle(13, 14, 3); mg.fillCircle(m.size - 13, 14, 3);
        mg.generateTexture(texKey, m.size, m.size); mg.destroy();
    }

    var enemy = enemies.create(x, y, texKey);
    enemy.setCollideWorldBounds(true);
    enemy.monsterType = type;
    enemy.health      = m.hp * (1 + playerLevel * 0.2);
    enemy.maxHealth   = enemy.health;
    enemy.speed       = m.speed + playerLevel * 4;
    enemy.damage      = m.damage;
    enemy.xpReward    = m.xp + playerLevel * 5;
    enemy.scoreValue  = m.score;
    enemy.patrolX     = x;
    enemy.patrolY     = y;

    enemy.healthBar = scene.add.rectangle(x, y - 35, m.size, 6, 0xff3333).setDepth(6);
    enemy.nameTag   = scene.add.text(x, y - 50, m.name + ' Lv.' + playerLevel, { fontSize: '11px', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5).setDepth(6);
    return enemy;
}

// ================================
// CAMERA + KEYBOARD
// ================================
function setupCamera() {
    scene.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
    scene.cameras.main.startFollow(player, true, 0.08, 0.08);
    scene.cameras.main.setZoom(0.5);
    scene.tweens.add({ targets: scene.cameras.main, zoom: 1, duration: 1200, ease: 'Power2' });
}

function setupKeyboard() {
    cursors  = scene.input.keyboard.createCursorKeys();
    wasd     = scene.input.keyboard.addKeys({ up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S, left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D });
    shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    scene.input.keyboard.on('keydown-SPACE', function() { if (!chatOpen) doAttack(); });
    scene.input.keyboard.on('keydown-E',     function() { if (!chatOpen) doAbility(); });
    scene.input.keyboard.on('keydown-F',     function() { if (!chatOpen) doPotion(); });
    scene.input.keyboard.on('keydown-I',     function() { if (!chatOpen) toggleInventory(); });
    scene.input.keyboard.on('keydown-T',     function() { openChat(); });
    scene.input.keyboard.on('keydown-ENTER', function() { if (!chatOpen) doSave(); });
}

// ================================
// JOYSTICK
// ================================
function setupJoystick() {
    if (!isMobile) return;
    var zone = document.getElementById('joystickZone'), base = document.getElementById('joystickBase'), thumb = document.getElementById('joystickThumb');
    if (!zone || !base || !thumb) return;
    var maxDist = 42;
    zone.addEventListener('touchstart', function(e) { e.preventDefault(); var t = e.changedTouches[0]; joystickActive = true; joystickStartX = t.clientX; joystickStartY = t.clientY; var r = zone.getBoundingClientRect(); base.style.left = (t.clientX - r.left - 55) + 'px'; base.style.bottom = 'auto'; base.style.top = (t.clientY - r.top - 55) + 'px'; }, { passive: false });
    zone.addEventListener('touchmove',  function(e) { e.preventDefault(); if (!joystickActive) return; var t = e.changedTouches[0]; var dx = t.clientX - joystickStartX, dy = t.clientY - joystickStartY, dist = Math.sqrt(dx * dx + dy * dy); if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; } thumb.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; joystickDX = dx / maxDist; joystickDY = dy / maxDist; }, { passive: false });
    zone.addEventListener('touchend',   function(e) { e.preventDefault(); joystickActive = false; joystickDX = 0; joystickDY = 0; thumb.style.transform = 'translate(0px,0px)'; base.style.left = '48px'; base.style.top = 'auto'; base.style.bottom = '28px'; }, { passive: false });
}

// ================================
// ATTACK
// ================================
function doAttack() {
    var now = Date.now();
    if (now - lastAttackTime < playerClass.attackCooldown) return;
    lastAttackTime = now;
    sounds.attack();

    // Swing arc
    var swing = scene.add.graphics();
    swing.lineStyle(3, 0xffddaa, 1);
    swing.arc(player.x, player.y, playerAttackRange * 0.7, playerFacing === 1 ? -0.5 : Math.PI + 0.5, playerFacing === 1 ? 0.8 : Math.PI - 0.8);
    swing.strokePath();
    scene.tweens.add({ targets: swing, alpha: 0, duration: 250, onComplete: function() { swing.destroy(); } });

    var hitAny = false;
    enemies.getChildren().forEach(function(e) {
        if (!e || !e.active) return;
        if (Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) <= playerAttackRange) {
            var dmg = playerDamage;
            if (selectedClass === 'berserker') { var r = playerHealth / playerMaxHealth; if (r < 0.5) dmg = Math.floor(dmg * 1.8); if (r < 0.25) dmg = Math.floor(dmg * 2.5); }
            var crit = (selectedClass === 'rogue' && Math.random() < 0.3);
            if (crit) dmg = Math.floor(dmg * 2);
            e.health -= dmg;
            e.setTint(0xffffff);
            scene.time.delayedCall(100, function() { if (e && e.active) e.clearTint(); });
            showFloatingText((crit ? '⚡ ' : '') + dmg, e.x, e.y - 40, crit ? '#ffff00' : '#ffddaa');
            hitAny = true;
            if (e.health <= 0) killEnemy(e);
        }
    });

    if (boss && boss.active && Phaser.Math.Distance.Between(player.x, player.y, boss.x, boss.y) <= playerAttackRange + 50) {
        boss.health -= playerDamage; updateBossHealthBar();
        if (boss.health <= 0) killBoss();
    }

    if (!hitAny) showFloatingText('miss', player.x + playerFacing * 30, player.y - 20, '#555555');
}

// ================================
// TOUCH ENEMY
// ================================
function onPlayerTouchEnemy(player, enemy) {
    if (playerInvisible) return;
    var now = Date.now(); if (now - lastHitTime < 1000) return; lastHitTime = now;
    var dmg = enemy.damage || 10; playerHealth -= dmg; sounds.hit();
    scene.cameras.main.shake(200, 0.008);
    player.setTint(0xff0000); scene.time.delayedCall(200, function() { player.clearTint(); });
    updateHealthBar();
    showFloatingText('-' + dmg, player.x, player.y - 50, '#ff3333');
    if (playerHealth <= 0) { playerHealth = 0; updateHealthBar(); showGameOver(); }
}

// ================================
// KILL ENEMY
// ================================
function killEnemy(enemy) {
    if (!enemy || !enemy.active) return;
    var pool = currentMonsterPool;
    var m = pool[enemy.monsterType] || MONSTERS_ADVENTURE.goblin;
    spawnParticles(enemy.x, enemy.y, m.color, 12); sounds.enemyDie();
    gainXP(enemy.xpReward);
    score += enemy.scoreValue * playerLevel;
    if (scoreText) scoreText.setText('Score: ' + score);
    if (selectedMode !== 'pvp') spawnPotion(enemy.x, enemy.y, false);
    if (!questStats.kills[enemy.monsterType]) questStats.kills[enemy.monsterType] = 0;
    questStats.kills[enemy.monsterType]++;
    updateQuests('kill', { monster: enemy.monsterType });
    updateQuests('score', {});
    if (enemy.healthBar) enemy.healthBar.destroy();
    if (enemy.nameTag)   enemy.nameTag.destroy();
    enemy.destroy();
    if (selectedMode === 'survival') { onWaveKill(); return; }
    setTimeout(function() { if (gameStarted) spawnEnemy(); }, 4000);
}

// ================================
// BOSS
// ================================
function spawnBoss() {
    if (bossSpawned) return; bossSpawned = true; sounds.bossSpawn();
    var bd = selectedMode === 'survival' ? BOSS_DEFS.survival : BOSS_DEFS.adventure;

    var brg = scene.make.graphics({ x: 0, y: 0, add: false });
    brg.fillStyle(bd.bodyColor); brg.fillRoundedRect(5, 5, 90, 90, 12);
    brg.fillStyle(bd.eyeColor);  brg.fillCircle(28, 28, 14); brg.fillCircle(72, 28, 14);
    brg.fillStyle(0x000000);     brg.fillCircle(28, 28, 8);  brg.fillCircle(72, 28, 8);
    brg.fillStyle(bd.mouthColor); brg.fillRect(22, 65, 56, 12);
    brg.generateTexture('modeBossTex', 100, 100); brg.destroy();

    var x = (mapWidth / 2) * tileSize, y = (mapHeight / 2) * tileSize;
    boss = scene.physics.add.image(x, y, 'modeBossTex');
    boss.setCollideWorldBounds(true);
    boss.health   = bd.hp + playerLevel * 100;
    boss.maxHealth = boss.health;
    boss.speed    = bd.speed + playerLevel * 5;
    boss.xpReward = bd.xp + playerLevel * 50;

    scene.tweens.add({ targets: boss, scaleX: 1.1, scaleY: 1.1, duration: 700, yoyo: true, repeat: -1 });

    if (bossHealthBarBg) bossHealthBarBg.destroy();
    if (bossHealthBar)   bossHealthBar.destroy();
    if (bossNameText)    bossNameText.destroy();
    bossHealthBarBg = scene.add.rectangle(640, 50, 504, 28, 0x000000).setScrollFactor(0).setDepth(15);
    bossHealthBar   = scene.add.rectangle(640, 50, 500, 24, bd.barColor).setScrollFactor(0).setDepth(15);
    bossNameText    = scene.add.text(640, 50, bd.name, { fontSize: '14px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(15);

    showFloatingText('⚠️ ' + bd.name + '!', player.x - 130, player.y - 100, '#ff4444');
    addChatMessage('System', '⚠️ ' + bd.name + ' appeared!', '#ff4444');
    scene.physics.add.overlap(player, boss, hitByBoss, null, scene);
}

var lastBossHit = 0;
function hitByBoss(player, boss) {
    var now = Date.now(); if (now - lastBossHit < 1500) return; lastBossHit = now;
    var dmg = 35 + playerLevel * 4; playerHealth -= dmg; sounds.hit();
    player.setTint(0xff0000); scene.cameras.main.shake(350, 0.02);
    scene.time.delayedCall(250, function() { player.clearTint(); });
    updateHealthBar(); showFloatingText('-' + dmg, player.x, player.y - 50, '#ff0000');
    if (playerHealth <= 0) { playerHealth = 0; updateHealthBar(); showGameOver(); }
}

function killBoss() {
    spawnParticles(boss.x, boss.y, 0xff0000, 30); spawnParticles(boss.x, boss.y, 0xffff00, 22);
    gainXP(boss.xpReward); score += 600 * playerLevel;
    if (scoreText) scoreText.setText('Score: ' + score);
    for (var i = 0; i < 4; i++) spawnPotion(boss.x + Phaser.Math.Between(-80, 80), boss.y + Phaser.Math.Between(-80, 80), true);
    if (bossHealthBarBg) bossHealthBarBg.destroy(); if (bossHealthBar) bossHealthBar.destroy(); if (bossNameText) bossNameText.destroy();
    boss.destroy(); boss = null; bossSpawned = false;
    questStats.bossKills++; updateQuests('boss', {});
    showFloatingText('🏆 BOSS DEFEATED!', player.x - 120, player.y - 90, '#ffff00');
    addChatMessage('System', '🏆 Boss defeated!', '#ffff00');
    if (selectedMode === 'bossrush') {
        setTimeout(function() { if (gameStarted) spawnNextBossRush(); }, 3000);
    } else {
        scene.time.addEvent({ delay: 180000, callback: function() { if (gameStarted) spawnBoss(); } });
    }
}

function updateBossHealthBar() {
    if (!boss || !bossHealthBar) return;
    bossHealthBar.width = 500 * (boss.health / boss.maxHealth);
    if (bossNameText && boss) bossNameText.setText(bossNameText.text.split(' HP:')[0] + ' HP: ' + Math.max(0, Math.floor(boss.health)) + '/' + boss.maxHealth);
}

// ================================
// POTION
// ================================
function spawnPotion(x, y, force) {
    if (!force && Math.random() > 0.35) return;
    var p = potions.create(x, y, 'potionTex'); p.setCollideWorldBounds(true);
    scene.tweens.add({ targets: p, y: p.y - 12, duration: 600, yoyo: true, repeat: -1 });
    p.label = scene.add.text(x - 8, y - 28, '💊', { fontSize: '14px' });
    return p;
}

function pickUpPotion(player, potion) {
    inventory.push('Health Potion'); updateInventoryPanel();
    if (potion.label) potion.label.destroy(); potion.destroy();
    sounds.pickup(); questStats.potionsCollected++;
    updateQuests('collect', {});
    showFloatingText('💊 Potion!', player.x, player.y - 60, '#ff69b4');
}

function doPotion() {
    var i = inventory.indexOf('Health Potion');
    if (i === -1) { showFloatingText('❌ No potions!', player.x, player.y - 60, '#ff0000'); return; }
    inventory.splice(i, 1); updateInventoryPanel();
    playerHealth = Math.min(playerHealth + 40, playerMaxHealth);
    updateHealthBar(); sounds.pickup();
    showFloatingText('+40 HP!', player.x, player.y - 60, '#44ff44');
}

// ================================
// ABILITIES
// ================================
function doAbility() {
    var now = Date.now();
    if (now - abilityLastUsed < playerClass.abilityCooldown) {
        var rem = Math.ceil((playerClass.abilityCooldown - (now - abilityLastUsed)) / 1000);
        showFloatingText('⏳ ' + rem + 's', player.x, player.y - 60, '#888'); return;
    }
    abilityLastUsed = now; sounds.ability();
    var btn = document.getElementById('abilityBtn');
    if (btn) { btn.classList.remove('ready'); btn.classList.add('cooldown'); setTimeout(function() { btn.classList.remove('cooldown'); btn.classList.add('ready'); }, playerClass.abilityCooldown); }
    if      (selectedClass === 'warrior')     abilityWarrior();
    else if (selectedClass === 'archer')      abilityArcher();
    else if (selectedClass === 'mage')        abilityMage();
    else if (selectedClass === 'rogue')       abilityRogue();
    else if (selectedClass === 'paladin')     abilityPaladin();
    else if (selectedClass === 'necromancer') abilityNecromancer();
    else if (selectedClass === 'berserker')   abilityBerserker();
    else if (selectedClass === 'ranger')      abilityRanger();
}

function abilityWarrior() {
    showFloatingText('🛡️ SHIELD BASH!', player.x - 60, player.y - 70, '#ff8888');
    spawnParticles(player.x, player.y, 0xff6666, 16);
    enemies.getChildren().forEach(function(e) {
        if (Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) < 160) {
            var prev = e.speed; e.speed = 0; e.setTint(0xffff00); e.health -= playerDamage * 2.5;
            scene.time.delayedCall(2500, function() { if (e && e.active) { e.speed = prev; e.clearTint(); } });
            if (e.health <= 0) killEnemy(e);
        }
    });
}

function abilityArcher() {
    showFloatingText('🏹 ARROW RAIN!', player.x - 60, player.y - 70, '#88ff88');
    for (var i = 0; i < 16; i++) {
        (function(angle) {
            var arrow = scene.add.rectangle(player.x, player.y, 22, 5, 0x88ff44).setRotation(angle).setDepth(10);
            scene.tweens.add({ targets: arrow, x: player.x + Math.cos(angle) * 280, y: player.y + Math.sin(angle) * 280, alpha: 0, duration: 450, onComplete: function() { arrow.destroy(); } });
            enemies.getChildren().forEach(function(e) {
                var ex = e.x - player.x, ey = e.y - player.y, dist = Math.sqrt(ex * ex + ey * ey);
                if (dist < 280 && Math.abs(Math.atan2(ey, ex) - angle) < 0.25) { e.health -= playerDamage; if (e.health <= 0) killEnemy(e); }
            });
        })((i / 16) * Math.PI * 2);
    }
}

function abilityMage() {
    showFloatingText('🔥 FIREBALL!', player.x - 50, player.y - 70, '#8888ff');
    spawnParticles(player.x, player.y, 0xff4400, 28); scene.cameras.main.shake(500, 0.02);
    enemies.getChildren().forEach(function(e) { if (Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) < 270) { e.health -= playerDamage * 3.5; if (e.health <= 0) killEnemy(e); } });
    if (boss && boss.active && Phaser.Math.Distance.Between(player.x, player.y, boss.x, boss.y) < 270) { boss.health -= playerDamage * 3.5; updateBossHealthBar(); if (boss.health <= 0) killBoss(); }
}

function abilityRogue() {
    showFloatingText('👁️ VANISH!', player.x - 40, player.y - 70, '#ffaa44');
    playerInvisible = true; player.setAlpha(0.15); playerSpeed *= 2;
    scene.time.delayedCall(3000, function() { playerInvisible = false; player.setAlpha(1); playerSpeed /= 2; showFloatingText('👁️ Visible!', player.x - 40, player.y - 60, '#ffaa44'); });
}

function abilityPaladin() {
    showFloatingText('✨ HOLY AURA!', player.x - 60, player.y - 70, '#ffddaa');
    var heal = Math.floor(playerMaxHealth * 0.35);
    playerHealth = Math.min(playerHealth + heal, playerMaxHealth); updateHealthBar();
    for (var i = 0; i < 20; i++) {
        (function(angle) {
            var star = scene.add.circle(player.x + Math.cos(angle) * 80, player.y + Math.sin(angle) * 80, 6, 0xffff88).setDepth(15);
            scene.tweens.add({ targets: star, x: player.x, y: player.y, alpha: 0, duration: 600, onComplete: function() { star.destroy(); } });
        })((i / 20) * Math.PI * 2);
    }
    enemies.getChildren().forEach(function(e) {
        if (['skeleton', 'boneknight'].indexOf(e.monsterType) !== -1 && Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) < 200) { e.health -= playerDamage * 4; if (e.health <= 0) killEnemy(e); }
    });
    showFloatingText('+' + heal + ' HP!', player.x, player.y - 90, '#ffff44');
}

function abilityNecromancer() {
    showFloatingText('☠️ RAISE DEAD!', player.x - 60, player.y - 70, '#88ff88');
    for (var i = 0; i < 3; i++) {
        (function(angle) {
            var mx = player.x + Math.cos(angle) * 60, my = player.y + Math.sin(angle) * 60;
            var minion = scene.physics.add.image(mx, my, 'minionTex');
            minion.speed = 130; minions.push(minion);
            minion.label = scene.add.text(mx, my - 28, '☠️', { fontSize: '14px' }).setOrigin(0.5);
            scene.physics.add.overlap(minion, enemies, function(m, e) { if (!e || !e.active) return; e.health -= 15; if (e.health <= 0) killEnemy(e); });
            scene.time.delayedCall(15000, function() { if (minion && minion.active) { if (minion.label) minion.label.destroy(); minion.destroy(); minions = minions.filter(function(m) { return m !== minion; }); } });
        })((i / 3) * Math.PI * 2);
    }
}

function abilityBerserker() {
    showFloatingText('😤 BERSERK!', player.x - 50, player.y - 70, '#ff4444');
    isBerserking = true; playerSpeed *= 1.6; playerDamage = Math.floor(playerDamage * 2.5);
    player.setTint(0xff2200); scene.cameras.main.shake(300, 0.015);
    scene.time.delayedCall(8000, function() { isBerserking = false; playerSpeed /= 1.6; playerDamage = Math.floor(playerDamage / 2.5); player.clearTint(); showFloatingText('😤 Rage ended', player.x - 50, player.y - 60, '#888'); });
}

function abilityRanger() {
    showFloatingText('🐺 WOLF PACK!', player.x - 50, player.y - 70, '#44ffaa');
    for (var i = 0; i < 2; i++) {
        (function() {
            var wx = player.x + Phaser.Math.Between(-60, 60), wy = player.y + Phaser.Math.Between(-60, 60);
            var wolf = scene.physics.add.image(wx, wy, 'wolfTex');
            wolf.speed = 200; wolfPets.push(wolf);
            wolf.label = scene.add.text(wx, wy - 28, '🐺', { fontSize: '14px' }).setOrigin(0.5);
            scene.physics.add.overlap(wolf, enemies, function(w, e) { if (!e || !e.active) return; var now = Date.now(); if (!w.lastBite || now - w.lastBite > 800) { w.lastBite = now; e.health -= 20 + playerLevel * 3; if (e.health <= 0) killEnemy(e); } });
            scene.time.delayedCall(18000, function() { if (wolf && wolf.active) { if (wolf.label) wolf.label.destroy(); wolf.destroy(); wolfPets = wolfPets.filter(function(w) { return w !== wolf; }); } });
        })();
    }
}

// ================================
// XP + LEVEL
// ================================
function gainXP(amount) {
    playerXP += amount;
    if (player) showFloatingText('+' + amount + ' XP', player.x, player.y - 70, '#ffff44');
    if (playerXP >= xpToNextLevel) levelUp();
    updateXPBar();
}

function levelUp() {
    playerXP -= xpToNextLevel; playerLevel++;
    xpToNextLevel = playerLevel * 100; playerMaxHealth += 20; playerHealth = playerMaxHealth; playerSpeed += 5; playerDamage += 5;
    sounds.levelUp();
    scene.tweens.add({ targets: player, scaleX: 1.5, scaleY: 1.5, duration: 200, yoyo: true, repeat: 2 });
    player.setTint(0xffff00); scene.time.delayedCall(800, function() { if (!isBerserking) player.clearTint(); });
    if (levelText) levelText.setText('⭐ Lv.' + playerLevel);
    if (playerNameText) playerNameText.setText(playerClass.icon + ' ' + playerName + ' Lv.' + playerLevel);
    updateHealthBar(); updateXPBar(); updateQuests('level', {});
    showFloatingText('🌟 LEVEL UP! ' + playerLevel, player.x - 70, player.y - 90, '#ffff00');
    saveGame(); // Auto save on level up
}

// ================================
// DAY/NIGHT (adventure only)
// ================================
function startDayNightCycle() {
    timeText = scene.add.text(640, 15, '☀️ Day', { fontSize: '15px', fill: '#ffff88' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);
    scene.time.addEvent({ delay: 35000, loop: true, callback: function() {
        dayTime = dayTime === 0 ? 1 : 0;
        if (dayTime === 1) { timeText.setText('🌙 Night'); scene.tweens.add({ targets: nightOverlay, alpha: 0.5, duration: 3000 }); enemies.getChildren().forEach(function(e) { e.speed *= 1.25; }); showFloatingText('🌙 Night!', player.x - 60, player.y - 80, '#aaaaff'); }
        else { timeText.setText('☀️ Day'); scene.tweens.add({ targets: nightOverlay, alpha: 0, duration: 3000 }); enemies.getChildren().forEach(function(e) { e.speed /= 1.25; }); showFloatingText('☀️ Day!', player.x - 40, player.y - 80, '#ffff88'); }
    }});
}

// ================================
// SURVIVE TIMER
// ================================
function startSurviveTimer() {
    scene.time.addEvent({ delay: 1000, loop: true, callback: function() {
        if (gameStarted && player && player.active) {
            surviveTimer++; updateQuests('survive', {});
            if (surviveTimer % 5 === 0 && playerHealth < playerMaxHealth) { playerHealth = Math.min(playerHealth + 1, playerMaxHealth); updateHealthBar(); }
        }
    }});
}

// ================================
// TOMBSTONE — disappears after 10s!
// ================================
function spawnTombstone(x, y) {
    addTombstoneVisual(x, y, playerName, playerLevel, '#cccccc');
    if (tombstonesRef && myPlayerId) {
        tombstonesRef.push({ x: x, y: y, name: playerClass.icon + ' ' + playerName, level: playerLevel, dimension: currentDimension, senderId: myPlayerId, time: Date.now() });
    }
}

function addTombstoneVisual(x, y, name, level, color) {
    if (!scene) return;
    var stone = scene.add.image(x, y, 'tombstoneTex').setDepth(7);
    var label = scene.add.text(x, y - 34, '💀 ' + name + '\nLv.' + level, { fontSize: '10px', fill: color || '#cccccc', stroke: '#000', strokeThickness: 2, align: 'center' }).setOrigin(0.5).setDepth(7);
    tombstones.push({ stone: stone, label: label });

    // Fade out and disappear after 10 seconds!
    setTimeout(function() {
        if (!scene) return;
        scene.tweens.add({
            targets: [stone, label],
            alpha: 0,
            duration: 2000,
            onComplete: function() {
                if (stone) stone.destroy();
                if (label) label.destroy();
            }
        });
    }, 10000);
}

// ================================
// SAVE — shows popup!
// ================================
function doSave() {
    saveGame();
    sounds.save();
    var notif = document.getElementById('saveNotif');
    var notifText = document.getElementById('saveNotifText');
    if (notif && notifText) {
        notifText.textContent = '✅ Game Saved!  Lv.' + playerLevel + '  Score: ' + score;
        notif.style.display = 'block';
        notif.style.opacity = '1';
        setTimeout(function() {
            notif.style.transition = 'opacity 0.6s';
            notif.style.opacity = '0';
            setTimeout(function() { if (notif) notif.style.display = 'none'; }, 700);
        }, 2500);
    }
    showFloatingText('💾 Saved!', player.x, player.y - 60, '#00ffff');
}

// ================================
// BUILD UI
// ================================
function buildUI() {
    healthBarBg = scene.add.rectangle(16, 16, 206, 22, 0x111111).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    healthBar   = scene.add.rectangle(18, 18, 202, 18, 0x22cc22).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    healthText  = scene.add.text(22, 18, 'HP: ' + playerHealth + '/' + playerMaxHealth, { fontSize: '12px', fill: '#fff' }).setScrollFactor(0).setDepth(11);

    xpBarBg = scene.add.rectangle(16, 44, 206, 14, 0x111111).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    xpBar   = scene.add.rectangle(18, 46, 0, 10, 0xdddd00).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    xpText  = scene.add.text(22, 45, 'XP: 0/' + xpToNextLevel, { fontSize: '10px', fill: '#ddd' }).setScrollFactor(0).setDepth(11);

    scene.add.rectangle(16, 62, 206, 10, 0x111111).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    staminaBar = scene.add.rectangle(18, 64, 202, 6, 0x44aaff).setOrigin(0, 0).setScrollFactor(0).setDepth(10);

    levelText = scene.add.text(16, 76, '⭐ Lv.' + playerLevel, { fontSize: '15px', fill: '#ffdd00' }).setScrollFactor(0).setDepth(10);
    scoreText = scene.add.text(16, 96, 'Score: ' + score, { fontSize: '14px', fill: '#fff' }).setScrollFactor(0).setDepth(10);
    scene.add.text(16, 115, playerClass.icon + ' ' + playerClass.name, { fontSize: '13px', fill: '#ffbb88' }).setScrollFactor(0).setDepth(10);

    if (!isMobile) scene.add.text(16, 696, 'WASD: Move  SHIFT: Sprint  SPACE: Attack  E: ' + playerClass.ability + '  F: Potion  I: Bag  T: Chat  ENTER: Save', { fontSize: '10px', fill: '#88aa88' }).setScrollFactor(0).setDepth(10);

    playerNameText = scene.add.text(0, 0, playerClass.icon + ' ' + playerName + ' Lv.' + playerLevel, { fontSize: '13px', fill: '#fff', stroke: '#000', strokeThickness: 2 });
}

function updateHealthBar() {
    var p = Math.max(0, playerHealth) / playerMaxHealth;
    healthBar.width = 202 * p;
    if (p > 0.6) healthBar.setFillStyle(0x22cc22);
    else if (p > 0.3) healthBar.setFillStyle(0xddcc00);
    else healthBar.setFillStyle(0xdd2222);
    healthText.setText('HP: ' + Math.max(0, Math.floor(playerHealth)) + '/' + playerMaxHealth);
}

function updateXPBar() {
    xpBar.width = 202 * (playerXP / xpToNextLevel);
    xpText.setText('XP: ' + playerXP + '/' + xpToNextLevel);
}

// ================================
// INVENTORY
// ================================
function buildInventoryPanel() {
    inventoryPanel = scene.add.container(0, 0);
    var bg    = scene.add.rectangle(640, 360, 420, 310, 0x0a0a0a, 0.95);
    var title = scene.add.text(640, 222, '🎒 Inventory', { fontSize: '22px', fill: '#ffaa00' }).setOrigin(0.5);
    var hint  = scene.add.text(640, 465, 'F: Use Potion   I: Close', { fontSize: '12px', fill: '#555' }).setOrigin(0.5);
    inventoryPanel.add([bg, title, hint]);
    inventoryPanel.setScrollFactor(0).setDepth(30);
    inventoryPanel.setVisible(false);
}

function updateInventoryPanel() {
    inventoryTexts.forEach(function(t) { t.destroy(); }); inventoryTexts = [];
    if (inventory.length === 0) { var e = scene.add.text(640, 360, 'No items yet...', { fontSize: '16px', fill: '#444' }).setOrigin(0.5).setScrollFactor(0).setDepth(31); inventoryTexts.push(e); return; }
    var counts = {}; inventory.forEach(function(i) { counts[i] = (counts[i] || 0) + 1; });
    var y = 275;
    Object.keys(counts).forEach(function(item) { var t = scene.add.text(640, y, '💊 ' + item + '  ×' + counts[item], { fontSize: '18px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(31); inventoryTexts.push(t); y += 44; });
}

function toggleInventory() { inventoryOpen = !inventoryOpen; inventoryPanel.setVisible(inventoryOpen); if (inventoryOpen) updateInventoryPanel(); }

// ================================
// HELPERS
// ================================
function spawnParticles(x, y, color, count) {
    count = count || 12;
    for (var i = 0; i < count; i++) {
        (function(angle) {
            var p = scene.add.circle(x, y, Phaser.Math.Between(3, 9), color).setDepth(15);
            var spd = Phaser.Math.Between(70, 190);
            scene.tweens.add({ targets: p, x: x + Math.cos(angle) * spd, y: y + Math.sin(angle) * spd, alpha: 0, scaleX: 0, scaleY: 0, duration: Phaser.Math.Between(350, 700), onComplete: function() { p.destroy(); } });
        })((i / count) * Math.PI * 2);
    }
}

function showFloatingText(msg, x, y, color) {
    var t = scene.add.text(x, y, msg, { fontSize: '15px', fill: color, stroke: '#000000', strokeThickness: 3 }).setDepth(20);
    scene.tweens.add({ targets: t, y: y - 55, alpha: 0, duration: 1400, onComplete: function() { t.destroy(); } });
}

// ================================
// CHAT
// ================================
function openChat() {
    chatOpen = true;
    var input = document.getElementById('chatInput'); if (!input) return;
    input.disabled = false; input.focus();
    input.onkeydown = function(e) {
        if (e.key === 'Enter') { var msg = input.value.trim(); if (msg) { addChatMessage(playerName, msg, '#aaffaa'); if (chatRef && myPlayerId) chatRef.push({ name: playerClass.icon + ' ' + playerName, message: msg, senderId: myPlayerId, time: Date.now() }); } input.value = ''; input.disabled = true; chatOpen = false; input.blur(); }
        if (e.key === 'Escape') { input.value = ''; input.disabled = true; chatOpen = false; input.blur(); }
        e.stopPropagation();
    };
}

function addChatMessage(name, msg, color) {
    var msgs = document.getElementById('chatMessages'); if (!msgs) return;
    var div = document.createElement('div'); div.style.color = color || '#fff'; div.style.marginBottom = '3px';
    div.innerHTML = '<b>' + name + ':</b> ' + msg; msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}

function updatePlayerCount(count) {
    var el = document.getElementById('playerCount');
    if (el) el.innerHTML = '🟢 ' + count + ' Player' + (count !== 1 ? 's' : '') + ' Online';
}

// ================================
// SAVE / LOAD
// ================================
function saveGame() {
    localStorage.setItem('pixelRPGSave', JSON.stringify({
        playerLevel: playerLevel, playerXP: playerXP, playerHealth: playerHealth,
        playerMaxHealth: playerMaxHealth, playerSpeed: playerSpeed, playerDamage: playerDamage,
        xpToNextLevel: xpToNextLevel, score: score, inventory: inventory,
        playerName: playerName, selectedClass: selectedClass, questStats: questStats
    }));
    console.log('Saved! Level ' + playerLevel + ', Score ' + score);
}

function loadGame() {
    try {
        var saved = localStorage.getItem('pixelRPGSave'); if (!saved) return;
        var d = JSON.parse(saved); if (!d) return;
        playerLevel     = d.playerLevel     || 1;
        playerXP        = d.playerXP        || 0;
        playerHealth    = d.playerHealth    || 100;
        playerMaxHealth = d.playerMaxHealth || 100;
        playerSpeed     = d.playerSpeed     || 200;
        playerDamage    = d.playerDamage    || 20;
        xpToNextLevel   = d.xpToNextLevel   || 100;
        score           = d.score           || 0;
        inventory       = d.inventory       || [];
        playerName      = d.playerName      || 'Hero';
        if (d.questStats) questStats = d.questStats;
        if (d.selectedClass) window._selectedClass = d.selectedClass;
        console.log('Loaded! Level ' + playerLevel);
    } catch(e) { console.log('No save'); }
}

// ================================
// MINIMAP
// ================================
function updateMinimap() {
    var canvas = document.getElementById('minimap'); if (!canvas || !player) return;
    canvas.width = 130; canvas.height = 130;
    var ctx = canvas.getContext('2d'), sx = 130 / (mapWidth * tileSize), sy = 130 / (mapHeight * tileSize);
    var bgMap = { adventure: '#1a4a1a', survival: '#3d1500', bossrush: '#0d0011', pvp: '#222' };
    ctx.fillStyle = bgMap[selectedMode] || '#1a4a1a'; ctx.fillRect(0, 0, 130, 130);
    enemies.getChildren().forEach(function(e) { ctx.fillStyle = '#ff4444'; ctx.fillRect(e.x * sx - 2, e.y * sy - 2, 4, 4); });
    if (boss && boss.active) { ctx.fillStyle = '#ff0000'; ctx.fillRect(boss.x * sx - 5, boss.y * sy - 5, 10, 10); }
    tombstones.forEach(function(ts) { if (ts.stone && ts.stone.active) { ctx.fillStyle = '#777'; ctx.fillRect(ts.stone.x * sx - 2, ts.stone.y * sy - 2, 4, 4); } });
    Object.values(otherPlayers).forEach(function(op) { ctx.fillStyle = '#cc88ff'; ctx.fillRect(op.sprite.x * sx - 2, op.sprite.y * sy - 2, 5, 5); });
    if (selectedMode === 'adventure') { ctx.fillStyle = '#aa00ff'; ctx.fillRect(22 * tileSize * sx - 3, 22 * tileSize * sy - 3, 6, 6); ctx.fillStyle = '#ffaa00'; ctx.fillRect(3 * tileSize * sx - 3, 3 * tileSize * sy - 3, 6, 6); }
    ctx.fillStyle = '#' + (playerClass ? playerClass.color.toString(16).padStart(6, '0') : '4488ff');
    ctx.beginPath(); ctx.arc(player.x * sx, player.y * sy, 5, 0, Math.PI * 2); ctx.fill();
}

// ================================
// GAME OVER
// ================================
function showGameOver() {
    player.setVelocity(0); player.setActive(false); gameStarted = false; window.gameStarted = false;
    spawnTombstone(player.x, player.y); sounds.gameOver();
    setTimeout(function() {
        scene.cameras.main.fade(2000, 0, 0, 0, false, function(cam, progress) {
            if (progress !== 1) return;
            var modeLabels = { adventure: '🌲 Adventure', survival: '🔥 Survival — Wave ' + currentWave, bossrush: '💀 Boss Rush — Boss #' + bossRushIndex, pvp: '⚔️ PvP Arena' };
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s ease;font-family:Arial,sans-serif;color:#fff;';
            overlay.innerHTML =
                '<div style="text-align:center;max-width:560px;padding:40px;">' +
                '<div style="font-size:88px;margin-bottom:14px;">💀</div>' +
                '<h1 style="font-size:56px;color:#ff2222;letter-spacing:6px;text-shadow:0 0 40px #ff0000;margin-bottom:6px;">GAME OVER</h1>' +
                '<p style="font-size:16px;color:#ffaa00;margin-bottom:4px;">' + modeLabels[selectedMode] + '</p>' +
                '<p style="font-size:19px;color:#888;margin-bottom:5px;">' + (playerClass ? playerClass.icon : '') + ' <b>' + playerName + '</b> — Level ' + playerLevel + '</p>' +
                '<p style="font-size:26px;color:#ffdd44;margin-bottom:28px;">Score: ' + score + '</p>' +
                '<p style="font-size:13px;color:#333;font-style:italic;margin-bottom:28px;">Your tombstone remains where you fell...</p>' +
                '<div style="display:flex;gap:14px;justify-content:center;">' +
                '<button id="restartBtn" style="padding:13px 34px;font-size:17px;background:linear-gradient(135deg,#aa0000,#dd2222);color:#fff;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Arial;">⚔️ Play Again</button>' +
                '<button id="menuBtn" style="padding:13px 34px;font-size:17px;background:#1a1a1a;color:#fff;border:2px solid #444;border-radius:10px;cursor:pointer;font-family:Arial;">🏠 Main Menu</button>' +
                '</div><p style="margin-top:14px;font-size:11px;color:#333;">Press R to play again</p></div>';
            document.body.appendChild(overlay);
            setTimeout(function() { overlay.style.opacity = '1'; }, 50);

            function restartGame() {
                overlay.style.opacity = '0';
                setTimeout(function() { if (overlay.parentNode) document.body.removeChild(overlay); }, 1000);
                playerHealth = 100; playerMaxHealth = 100; playerXP = 0; playerLevel = 1;
                playerSpeed = 200; playerDamage = 20; xpToNextLevel = 100; score = 0;
                inventory = []; bossSpawned = false; currentDimension = 0; surviveTimer = 0;
                minions = []; wolfPets = []; isBerserking = false; playerInvisible = false;
                currentWave = 0; bossRushIndex = 0; normalTiles = []; shadowTiles = []; tombstones = [];
                gameStarted = false; window.gameStarted = false;
                localStorage.removeItem('pixelRPGSave');
                scene.cameras.main.fadeIn(100); scene.scene.restart();
                setTimeout(function() { var m = document.getElementById('startMenu'); if (m) m.style.display = 'flex'; }, 500);
            }

            document.getElementById('restartBtn').onclick = restartGame;
            document.getElementById('menuBtn').onclick = restartGame;
            document.addEventListener('keydown', function onR(e) { if (e.key === 'r' || e.key === 'R') { document.removeEventListener('keydown', onR); restartGame(); } });
        });
    }, 1000);
}

// ================================
// UPDATE — 60 times per second
// ================================
function update() {
    if (!gameStarted || !player || !player.active) return;
    if (chatOpen) return;

    player.setVelocity(0);
    var speed = playerSpeed, moving = false;

    // Sprint
    if ((shiftKey && shiftKey.isDown || window.touchSprinting) && stamina > 0) { speed *= 1.55; stamina = Math.max(0, stamina - 0.8); }
    else { stamina = Math.min(maxStamina, stamina + 0.3); }
    if (staminaBar) staminaBar.width = 202 * (stamina / maxStamina);

    // Keyboard movement
    if (cursors.left.isDown  || wasd.left.isDown)  { player.setVelocityX(-speed); playerFacing = -1; player.setFlipX(true);  moving = true; }
    else if (cursors.right.isDown || wasd.right.isDown) { player.setVelocityX(speed);  playerFacing =  1; player.setFlipX(false); moving = true; }
    if (cursors.up.isDown    || wasd.up.isDown)    { player.setVelocityY(-speed); moving = true; }
    else if (cursors.down.isDown  || wasd.down.isDown)  { player.setVelocityY(speed);  moving = true; }

    // Joystick movement
    if (joystickActive && (Math.abs(joystickDX) > 0.1 || Math.abs(joystickDY) > 0.1)) {
        player.setVelocityX(joystickDX * speed); player.setVelocityY(joystickDY * speed);
        if (joystickDX < -0.1) { playerFacing = -1; player.setFlipX(true); }
        else if (joystickDX > 0.1) { playerFacing = 1; player.setFlipX(false); }
        moving = true;
    }

    if (moving) player.y += Math.sin(Date.now() / 120) * 0.5;
    if (attackIndicator) attackIndicator.setPosition(player.x, player.y);

    // Send position to Firebase
    sendPosition();

    // ====================================
    // SMOOTH OTHER PLAYERS — lerp!
    // Slides smoothly to target position
    // ====================================
    Object.values(otherPlayers).forEach(function(op) {
        if (!op || !op.sprite) return;
        var lerp = 0.18;
        op.sprite.x += (op.targetX - op.sprite.x) * lerp;
        op.sprite.y += (op.targetY - op.sprite.y) * lerp;
        if (op.nameTag) op.nameTag.setPosition(op.sprite.x - 30, op.sprite.y - 52);
    });

    updateMinimap();
    if (playerNameText) playerNameText.setPosition(player.x - 40, player.y - 58);
    potions.getChildren().forEach(function(p) { if (p.label) p.label.setPosition(p.x - 8, p.y - 28); });

    // Boss AI
    if (boss && boss.active) {
        var bdx = player.x - boss.x, bdy = player.y - boss.y, bdist = Math.sqrt(bdx * bdx + bdy * bdy);
        if (bdist > 0) { boss.setVelocityX((bdx / bdist) * boss.speed); boss.setVelocityY((bdy / bdist) * boss.speed); }
        boss.rotation += 0.015;
    }

    // Minion AI
    minions.forEach(function(m) {
        if (!m || !m.active) return;
        var dx = player.x - m.x, dy = player.y - m.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 80 && dist > 0) { m.setVelocityX((dx / dist) * m.speed); m.setVelocityY((dy / dist) * m.speed); } else m.setVelocity(0);
        if (m.label) m.label.setPosition(m.x, m.y - 28);
    });

    // Wolf AI
    wolfPets.forEach(function(wolf) {
        if (!wolf || !wolf.active) return;
        var closest = null, closestDist = 300;
        enemies.getChildren().forEach(function(e) { if (!e || !e.active) return; var d = Phaser.Math.Distance.Between(wolf.x, wolf.y, e.x, e.y); if (d < closestDist) { closestDist = d; closest = e; } });
        if (closest) { var wdx = closest.x - wolf.x, wdy = closest.y - wolf.y, wdist = Math.sqrt(wdx * wdx + wdy * wdy); if (wdist > 0) { wolf.setVelocityX((wdx / wdist) * wolf.speed); wolf.setVelocityY((wdy / wdist) * wolf.speed); } }
        else { var pdx = player.x - wolf.x, pdy = player.y - wolf.y, pdist = Math.sqrt(pdx * pdx + pdy * pdy); if (pdist > 100 && pdist > 0) { wolf.setVelocityX((pdx / pdist) * 150); wolf.setVelocityY((pdy / pdist) * 150); } else wolf.setVelocity(0); }
        if (wolf.label) wolf.label.setPosition(wolf.x, wolf.y - 28);
    });

    // Enemy AI — patrol + chase
    enemies.getChildren().forEach(function(e) {
        if (!e || !e.active || e.speed === 0) return;
        var dx = player.x - e.x, dy = player.y - e.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 280 && dist > 0) { e.setVelocityX((dx / dist) * e.speed); e.setVelocityY((dy / dist) * e.speed); }
        else {
            var pdx = (e.patrolX || e.x) - e.x, pdy = (e.patrolY || e.y) - e.y, pdist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pdist > 100 && pdist > 0) { e.setVelocityX((pdx / pdist) * e.speed * 0.4); e.setVelocityY((pdy / pdist) * e.speed * 0.4); }
            else if (Math.random() < 0.008) { e.setVelocityX(Phaser.Math.Between(-40, 40)); e.setVelocityY(Phaser.Math.Between(-40, 40)); }
        }
        var pool = currentMonsterPool;
        var mSize = (pool[e.monsterType] || MONSTERS_ADVENTURE.goblin).size || 40;
        if (e.healthBar) { e.healthBar.setPosition(e.x, e.y - 35); e.healthBar.width = mSize * (e.health / e.maxHealth); }
        if (e.nameTag) e.nameTag.setPosition(e.x, e.y - 50);
    });
}
