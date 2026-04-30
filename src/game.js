// ================================
// PIXEL WORLD RPG - Clean Version
// Works on GitHub Pages + Firebase
// ================================

var isMobile =
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
  navigator.maxTouchPoints > 1;

var config = {
  type: Phaser.AUTO,
  backgroundColor: "#1a8f2d",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  input: { touch: true, activePointers: 4 },
  scene: { preload: preload, create: create, update: update },
};

var game = new Phaser.Game(config);

// ================================
// CLASS DEFINITIONS
// ================================
var CLASSES = {
  warrior: {
    name: "Warrior",
    icon: "⚔️",
    color: 0xff6666,
    hp: 220,
    speed: 155,
    damage: 35,
    attackRange: 80,
    ability: "Shield Bash",
    abilityIcon: "🛡️",
    abilityCooldown: 5000,
    attackCooldown: 700,
  },
  archer: {
    name: "Archer",
    icon: "🏹",
    color: 0x66ff66,
    hp: 110,
    speed: 285,
    damage: 28,
    attackRange: 200,
    ability: "Arrow Rain",
    abilityIcon: "🏹",
    abilityCooldown: 4000,
    attackCooldown: 500,
  },
  mage: {
    name: "Mage",
    icon: "🧙",
    color: 0x6688ff,
    hp: 80,
    speed: 200,
    damage: 70,
    attackRange: 150,
    ability: "Fireball",
    abilityIcon: "🔥",
    abilityCooldown: 6000,
    attackCooldown: 900,
  },
  rogue: {
    name: "Rogue",
    icon: "🗡️",
    color: 0xffaa44,
    hp: 110,
    speed: 265,
    damage: 50,
    attackRange: 70,
    ability: "Vanish",
    abilityIcon: "👁️",
    abilityCooldown: 8000,
    attackCooldown: 400,
  },
  paladin: {
    name: "Paladin",
    icon: "⚜️",
    color: 0xffddaa,
    hp: 180,
    speed: 155,
    damage: 28,
    attackRange: 90,
    ability: "Holy Aura",
    abilityIcon: "✨",
    abilityCooldown: 7000,
    attackCooldown: 800,
  },
  necromancer: {
    name: "Necromancer",
    icon: "💀",
    color: 0x44ff88,
    hp: 90,
    speed: 195,
    damage: 40,
    attackRange: 130,
    ability: "Raise Dead",
    abilityIcon: "☠️",
    abilityCooldown: 9000,
    attackCooldown: 800,
  },
  berserker: {
    name: "Berserker",
    icon: "🪓",
    color: 0xff2222,
    hp: 180,
    speed: 195,
    damage: 55,
    attackRange: 85,
    ability: "Berserk Rage",
    abilityIcon: "😤",
    abilityCooldown: 10000,
    attackCooldown: 500,
  },
  ranger: {
    name: "Ranger",
    icon: "🌿",
    color: 0x44ffaa,
    hp: 130,
    speed: 245,
    damage: 32,
    attackRange: 160,
    ability: "Wolf Pack",
    abilityIcon: "🐺",
    abilityCooldown: 12000,
    attackCooldown: 600,
  },
};

// ================================
// MONSTER DEFINITIONS
// ================================
var MONSTERS = {
  goblin: {
    name: "👹 Goblin",
    color: 0xff4444,
    size: 36,
    hp: 30,
    speed: 80,
    damage: 8,
    xp: 20,
    score: 10,
  },
  troll: {
    name: "👺 Troll",
    color: 0x44aa44,
    size: 58,
    hp: 90,
    speed: 45,
    damage: 22,
    xp: 45,
    score: 28,
  },
  skeleton: {
    name: "💀 Skeleton",
    color: 0xcccccc,
    size: 36,
    hp: 40,
    speed: 115,
    damage: 14,
    xp: 30,
    score: 20,
  },
  demon: {
    name: "😈 Demon",
    color: 0xaa00ff,
    size: 44,
    hp: 65,
    speed: 95,
    damage: 26,
    xp: 55,
    score: 38,
  },
  orc: {
    name: "🗡️ Orc",
    color: 0x886600,
    size: 50,
    hp: 70,
    speed: 65,
    damage: 18,
    xp: 38,
    score: 25,
  },
  wolf: {
    name: "🐺 Wolf",
    color: 0x888888,
    size: 34,
    hp: 25,
    speed: 140,
    damage: 10,
    xp: 18,
    score: 12,
  },
};

var SHADOW_MONSTERS = {
  wraith: {
    name: "👻 Wraith",
    color: 0x8888ff,
    size: 38,
    hp: 55,
    speed: 125,
    damage: 20,
    xp: 42,
    score: 32,
  },
  vampire: {
    name: "🧛 Vampire",
    color: 0xaa0044,
    size: 42,
    hp: 75,
    speed: 88,
    damage: 28,
    xp: 55,
    score: 44,
  },
  banshee: {
    name: "🌀 Banshee",
    color: 0x00aaff,
    size: 34,
    hp: 38,
    speed: 155,
    damage: 32,
    xp: 48,
    score: 36,
  },
  lich: {
    name: "☠️ Lich",
    color: 0x440088,
    size: 50,
    hp: 110,
    speed: 58,
    damage: 38,
    xp: 75,
    score: 58,
  },
};

// ================================
// QUEST TEMPLATES
// ================================
var QUEST_TEMPLATES = [
  {
    id: "q1",
    desc: "Kill 5 Goblins",
    type: "kill",
    monster: "goblin",
    target: 5,
    reward: 60,
    xpReward: 50,
  },
  {
    id: "q2",
    desc: "Kill 3 Trolls",
    type: "kill",
    monster: "troll",
    target: 3,
    reward: 80,
    xpReward: 75,
  },
  {
    id: "q3",
    desc: "Kill 4 Skeletons",
    type: "kill",
    monster: "skeleton",
    target: 4,
    reward: 70,
    xpReward: 60,
  },
  {
    id: "q4",
    desc: "Kill 2 Demons",
    type: "kill",
    monster: "demon",
    target: 2,
    reward: 100,
    xpReward: 90,
  },
  {
    id: "q5",
    desc: "Kill 3 Orcs",
    type: "kill",
    monster: "orc",
    target: 3,
    reward: 75,
    xpReward: 65,
  },
  {
    id: "q6",
    desc: "Collect 3 Potions",
    type: "collect",
    target: 3,
    reward: 50,
    xpReward: 40,
  },
  {
    id: "q7",
    desc: "Reach Level 3",
    type: "level",
    target: 3,
    reward: 150,
    xpReward: 100,
  },
  {
    id: "q8",
    desc: "Reach Level 5",
    type: "level",
    target: 5,
    reward: 300,
    xpReward: 200,
  },
  {
    id: "q9",
    desc: "Defeat the Dragon King",
    type: "boss",
    target: 1,
    reward: 500,
    xpReward: 400,
  },
  {
    id: "q10",
    desc: "Enter Shadow Realm",
    type: "dimension",
    target: 1,
    reward: 100,
    xpReward: 80,
  },
  {
    id: "q11",
    desc: "Kill 3 Wraiths",
    type: "kill",
    monster: "wraith",
    target: 3,
    reward: 120,
    xpReward: 100,
  },
  {
    id: "q12",
    desc: "Survive 2 minutes",
    type: "survive",
    target: 120,
    reward: 200,
    xpReward: 150,
  },
  {
    id: "q13",
    desc: "Score 500 points",
    type: "score",
    target: 500,
    reward: 180,
    xpReward: 120,
  },
];

// ================================
// GAME VARIABLES
// ================================
var player, cursors, wasd, shiftKey;
var enemies, potions, portals;
var minions = [];
var wolfPets = [];
var boss, bossHealthBar, bossHealthBarBg, bossNameText;
var bossSpawned = false;
var scene;
var gameStarted = false;
var selectedClass = "warrior";
var playerClass;
var playerFacing = 1;
var otherPlayers = {};

// Touch
var joystickActive = false;
var joystickStartX = 0;
var joystickStartY = 0;
var joystickDX = 0;
var joystickDY = 0;
var touchSprinting = false;

// Player stats
var playerHealth = 100;
var playerMaxHealth = 100;
var playerXP = 0;
var playerLevel = 1;
var playerSpeed = 200;
var playerDamage = 20;
var playerAttackRange = 80;
var xpToNextLevel = 100;
var score = 0;
var lastHitTime = 0;
var lastAttackTime = 0;
var playerName = "Hero";
var inventory = [];
var inventoryOpen = false;
var chatOpen = false;
var abilityLastUsed = 0;
var playerInvisible = false;
var isBerserking = false;

// Stamina
var stamina = 100;
var maxStamina = 100;
var staminaBar;

// Dimension
var currentDimension = 0;
var dimensionOverlay, nightOverlay;
var shadowTiles = [];
var normalTiles = [];
var portalCooldown = false;

// Quest system
var activeQuests = [];
var questStats = {
  kills: {},
  potionsCollected: 0,
  bossKills: 0,
  dimensionVisited: 0,
  surviveTime: 0,
};

// Tombstones
var tombstones = [];
var surviveTimer = 0;
var dayTime = 0;
var timeText;

// UI
var healthBar, healthBarBg, healthText;
var xpBar, xpBarBg, xpText;
var levelText, scoreText, playerNameText;
var inventoryPanel;
var inventoryTexts = [];
var attackIndicator;

// Map
var tileSize = 64;
var mapWidth = 30;
var mapHeight = 30;

// Firebase
var myPlayerId = null;
var playersRef = null;
var chatRef = null;
var tombstonesRef = null;

// ================================
// GLOBAL FUNCTIONS
// ================================
window.selectClass = function (cls) {
  selectedClass = cls;
  window._selectedClass = cls;
  document.querySelectorAll(".classCard").forEach(function (c) {
    c.classList.remove("selected");
  });
  var card = document.getElementById("card-" + cls);
  if (card) card.classList.add("selected");
};

window.playerAttack = function () {
  if (gameStarted && player) doAttack();
};
window.useAbility = function () {
  if (gameStarted && player) useAbility();
};
window.usePotion = function () {
  if (gameStarted && player) usePotion();
};
window.touchSprinting = false;

// ================================
// START BUTTON
// ================================
document.getElementById("startBtn").onclick = function () {
  var v = document.getElementById("nameInput").value.trim();
  if (v) playerName = v;

  if (window._selectedClass) selectedClass = window._selectedClass;

  document.getElementById("startMenu").style.display = "none";

  function show(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "block";
  }
  function showFlex(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = "flex";
  }

  show("chatBox");
  show("playerCount");
  show("minimap");
  show("dimensionIndicator");
  show("questPanel");

  if (isMobile) {
    show("joystickZone");
    showFlex("actionButtons");
    var icon2 = document.getElementById("abilityIcon2");
    if (icon2) icon2.textContent = CLASSES[selectedClass].abilityIcon;
  } else {
    showFlex("abilityBar");
    show("attackHint");
    setTimeout(function () {
      var hint = document.getElementById("attackHint");
      if (hint) {
        hint.style.transition = "opacity 1s";
        hint.style.opacity = "0";
        setTimeout(function () {
          if (hint) hint.style.display = "none";
        }, 1000);
      }
    }, 4000);
  }

  var icon = document.getElementById("abilityIcon");
  if (icon) icon.textContent = CLASSES[selectedClass].abilityIcon;

  gameStarted = true;
  console.log("Game started as", selectedClass);
};

document.getElementById("nameInput").onkeydown = function (e) {
  if (e.key === "Enter") document.getElementById("startBtn").click();
};

// ================================
// SOUNDS
// ================================
function playTone(freq, dur, type) {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch (e) {}
}

var sounds = {
  hit: function () {
    playTone(150, 0.1, "square");
  },
  attack: function () {
    playTone(220, 0.06, "sawtooth");
  },
  enemyDie: function () {
    playTone(80, 0.2, "sawtooth");
  },
  levelUp: function () {
    playTone(523, 0.1, "sine");
    setTimeout(function () {
      playTone(659, 0.1, "sine");
    }, 100);
    setTimeout(function () {
      playTone(784, 0.2, "sine");
    }, 200);
  },
  pickup: function () {
    playTone(600, 0.08, "sine");
  },
  save: function () {
    playTone(440, 0.1, "sine");
  },
  ability: function () {
    playTone(300, 0.3, "square");
  },
  portal: function () {
    playTone(200, 0.2, "sine");
    setTimeout(function () {
      playTone(400, 0.3, "sine");
    }, 200);
  },
  questDone: function () {
    playTone(660, 0.1, "sine");
    setTimeout(function () {
      playTone(880, 0.2, "sine");
    }, 150);
  },
  bossSpawn: function () {
    playTone(100, 0.5, "sawtooth");
    setTimeout(function () {
      playTone(80, 0.5, "sawtooth");
    }, 300);
  },
  gameOver: function () {
    playTone(400, 0.4, "sine");
    setTimeout(function () {
      playTone(350, 0.4, "sine");
    }, 400);
    setTimeout(function () {
      playTone(300, 0.4, "sine");
    }, 800);
    setTimeout(function () {
      playTone(250, 0.4, "sine");
    }, 1200);
    setTimeout(function () {
      playTone(200, 0.8, "sine");
    }, 1600);
  },
};

// ================================
// PRELOAD
// ================================
function preload() {
  console.log("Loading...");
}

// ================================
// CREATE
// ================================
function create() {
  scene = this;
  loadGame();
  initQuests();

  var check = scene.time.addEvent({
    delay: 100,
    loop: true,
    callback: function () {
      if (gameStarted) {
        check.remove();
        startGame();
      }
    },
  });
}

// ================================
// QUESTS
// ================================
function initQuests() {
  activeQuests = QUEST_TEMPLATES.slice(0, 5).map(function (q) {
    return {
      id: q.id,
      desc: q.desc,
      type: q.type,
      monster: q.monster,
      target: q.target,
      reward: q.reward,
      xpReward: q.xpReward,
      current: 0,
      done: false,
    };
  });
  updateQuestPanel();
}

function updateQuests(type, data) {
  var changed = false;
  activeQuests.forEach(function (quest) {
    if (quest.done) return;
    if (
      type === "kill" &&
      quest.type === "kill" &&
      quest.monster === data.monster
    ) {
      quest.current = Math.min(quest.current + 1, quest.target);
      changed = true;
    }
    if (type === "collect" && quest.type === "collect") {
      quest.current = Math.min(quest.current + 1, quest.target);
      changed = true;
    }
    if (type === "level" && quest.type === "level") {
      quest.current = playerLevel;
      changed = true;
    }
    if (type === "boss" && quest.type === "boss") {
      quest.current = 1;
      changed = true;
    }
    if (type === "dimension" && quest.type === "dimension") {
      quest.current = 1;
      changed = true;
    }
    if (type === "survive" && quest.type === "survive") {
      quest.current = Math.floor(surviveTimer);
      changed = true;
    }
    if (type === "score" && quest.type === "score") {
      quest.current = score;
      changed = true;
    }
    if (!quest.done && quest.current >= quest.target) {
      quest.done = true;
      completeQuest(quest);
    }
  });
  if (changed) updateQuestPanel();
}

function completeQuest(quest) {
  sounds.questDone();
  score += quest.reward;
  if (scoreText) scoreText.setText("Score: " + score);
  gainXP(quest.xpReward);
  if (player)
    showFloatingText(
      "📜 Quest Done! +" + quest.reward,
      player.x - 100,
      player.y - 100,
      "#ffaa00",
    );
  addChatMessage("Quest", "✅ " + quest.desc, "#ffaa00");
  setTimeout(function () {
    var doneIds = activeQuests.map(function (q) {
      return q.id;
    });
    for (var i = 0; i < QUEST_TEMPLATES.length; i++) {
      if (doneIds.indexOf(QUEST_TEMPLATES[i].id) === -1) {
        var next = QUEST_TEMPLATES[i];
        var idx = activeQuests.findIndex(function (q) {
          return q.id === quest.id;
        });
        if (idx !== -1)
          activeQuests[idx] = {
            id: next.id,
            desc: next.desc,
            type: next.type,
            monster: next.monster,
            target: next.target,
            reward: next.reward,
            xpReward: next.xpReward,
            current: 0,
            done: false,
          };
        updateQuestPanel();
        break;
      }
    }
  }, 3000);
}

function updateQuestPanel() {
  var list = document.getElementById("questList");
  if (!list) return;
  list.innerHTML = "";
  activeQuests.forEach(function (quest) {
    var div = document.createElement("div");
    div.className = "questItem" + (quest.done ? " done" : "");
    div.innerHTML =
      (quest.done ? "✅ " : "🔲 ") +
      quest.desc +
      '<div class="questProgress">' +
      quest.current +
      "/" +
      quest.target +
      "</div>" +
      '<div class="questReward">+' +
      quest.reward +
      " pts  +" +
      quest.xpReward +
      " XP</div>";
    list.appendChild(div);
  });
}

// ================================
// FIREBASE MULTIPLAYER
// ================================
function connectToServer() {
  try {
    myPlayerId =
      "player_" + Date.now() + "_" + Math.floor(Math.random() * 9999);
    playersRef = firebase.database().ref("players");
    chatRef = firebase.database().ref("chat");
    tombstonesRef = firebase.database().ref("tombstones");

    var myRef = playersRef.child(myPlayerId);
    myRef.set({
      id: myPlayerId,
      name: playerClass.icon + " " + playerName,
      x: 400,
      y: 300,
      level: playerLevel,
      dimension: 0,
    });
    myRef.onDisconnect().remove();

    playersRef.on("child_added", function (snapshot) {
      var data = snapshot.val();
      if (!data || data.id === myPlayerId) return;
      addOtherPlayerFirebase(data);
      addChatMessage("System", data.name + " joined!", "#ffff44");
      updateOnlineCount();
    });

    playersRef.on("child_changed", function (snapshot) {
      var data = snapshot.val();
      if (!data || data.id === myPlayerId) return;
      if (otherPlayers[data.id]) {
        otherPlayers[data.id].sprite.setPosition(data.x, data.y);
        otherPlayers[data.id].nameTag.setPosition(data.x - 30, data.y - 52);
      }
    });

    playersRef.on("child_removed", function (snapshot) {
      var data = snapshot.val();
      if (!data) return;
      if (otherPlayers[data.id]) {
        addChatMessage("System", data.name + " left", "#ff8888");
        otherPlayers[data.id].sprite.destroy();
        otherPlayers[data.id].nameTag.destroy();
        delete otherPlayers[data.id];
        updateOnlineCount();
      }
    });

    chatRef.limitToLast(1).on("child_added", function (snapshot) {
      var data = snapshot.val();
      if (!data || data.senderId === myPlayerId) return;
      addChatMessage(data.name, data.message, "#ffffff");
    });

    tombstonesRef.once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        var t = child.val();
        if (t && t.dimension === currentDimension)
          addTombstoneVisual(t.x, t.y, t.name, t.level, "#ffaaaa");
      });
    });

    tombstonesRef.on("child_added", function (snapshot) {
      var t = snapshot.val();
      if (!t || t.senderId === myPlayerId) return;
      if (t.dimension === currentDimension) {
        addTombstoneVisual(t.x, t.y, t.name, t.level, "#ffaaaa");
        addChatMessage("System", "💀 " + t.name + " fell!", "#ff8888");
      }
    });

    addChatMessage("System", "🌐 Multiplayer connected!", "#44ff44");
    updateOnlineCount();
    console.log("Firebase multiplayer connected!");
  } catch (e) {
    console.log("Offline mode:", e);
    addChatMessage("System", "🌐 Playing offline", "#ffaa00");
  }
}

function addOtherPlayerFirebase(data) {
  if (otherPlayers[data.id] || !scene || !scene.physics) return;
  var sprite = scene.physics.add.image(
    data.x || 400,
    data.y || 300,
    "otherPlayerTex",
  );
  var nameTag = scene.add.text(
    data.x - 30,
    data.y - 52,
    data.name || "Player",
    { fontSize: "12px", fill: "#cc88ff" },
  );
  otherPlayers[data.id] = { sprite: sprite, nameTag: nameTag, name: data.name };
}

function updateOnlineCount() {
  if (!playersRef) return;
  playersRef.once("value", function (snapshot) {
    updatePlayerCount(snapshot.numChildren());
  });
}

function sendPositionToFirebase() {
  if (!playersRef || !myPlayerId || !player) return;
  playersRef
    .child(myPlayerId)
    .update({
      x: Math.floor(player.x),
      y: Math.floor(player.y),
      dimension: currentDimension,
    });
}

function addTombstoneVisual(x, y, name, level, color) {
  if (!scene) return;
  var stone = scene.add.image(x, y, "tombstoneTex").setDepth(7);
  var label = scene.add
    .text(x, y - 34, "💀 " + name + "\nLv." + level, {
      fontSize: "10px",
      fill: color || "#cccccc",
      stroke: "#000",
      strokeThickness: 2,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(7);
  tombstones.push({ stone: stone, label: label });
}

// ================================
// START GAME
// ================================
function startGame() {
  if (window._selectedClass) selectedClass = window._selectedClass;
  playerClass = CLASSES[selectedClass];
  playerMaxHealth = playerClass.hp;
  playerHealth = playerMaxHealth;
  playerSpeed = playerClass.speed;
  playerDamage = playerClass.damage;
  playerAttackRange = playerClass.attackRange;

  buildWorld();
  createTextures();
  createPlayer();
  createPortals();

  enemies = scene.physics.add.group();
  potions = scene.physics.add.group();

  spawnInitialEnemies();
  setupCamera();
  setupKeyboard();
  buildUI();
  buildInventoryPanel();
  startDayNightCycle();
  startBossTimer();
  startSurviveTimer();
  setupJoystick();
  connectToServer();

  scene.physics.add.overlap(player, enemies, hitEnemy, null, scene);
  scene.physics.add.overlap(player, potions, pickUpPotion, null, scene);
  scene.physics.add.overlap(player, portals, touchPortal, null, scene);

  console.log("Game started as " + playerClass.name);
}

// ================================
// BUILD WORLD
// ================================
function buildWorld() {
  for (var x = 0; x < mapWidth; x++) {
    for (var y = 0; y < mapHeight; y++) {
      var color;
      if (Math.abs(x - y) < 2 || Math.abs(x + y - mapWidth) < 2) {
        color = 0x8b6914;
      } else if ((x + y) % 2 === 0) {
        color = 0x2d8a2d;
      } else {
        color = 0x267326;
      }
      var tile = scene.add.rectangle(
        x * tileSize + tileSize / 2,
        y * tileSize + tileSize / 2,
        tileSize - 1,
        tileSize - 1,
        color,
      );
      normalTiles.push(tile);
    }
  }

  for (var i = 5; i < 15; i++) {
    var water = scene.add.rectangle(
      22 * tileSize + tileSize / 2,
      i * tileSize + tileSize / 2,
      tileSize - 1,
      tileSize - 1,
      0x1155aa,
    );
    normalTiles.push(water);
  }

  var treePts = [
    { x: 2, y: 2 },
    { x: 3, y: 4 },
    { x: 5, y: 3 },
    { x: 8, y: 1 },
    { x: 9, y: 3 },
    { x: 15, y: 4 },
    { x: 16, y: 6 },
    { x: 18, y: 7 },
    { x: 3, y: 12 },
    { x: 4, y: 14 },
    { x: 20, y: 15 },
    { x: 21, y: 17 },
    { x: 10, y: 20 },
    { x: 11, y: 22 },
    { x: 7, y: 8 },
    { x: 12, y: 5 },
    { x: 1, y: 18 },
    { x: 25, y: 5 },
    { x: 26, y: 7 },
    { x: 28, y: 12 },
  ];
  treePts.forEach(function (pos) {
    var tx = pos.x * tileSize + tileSize / 2,
      ty = pos.y * tileSize + tileSize / 2;
    normalTiles.push(scene.add.rectangle(tx, ty, 16, 28, 0x6b3a2a));
    normalTiles.push(scene.add.circle(tx, ty - 14, 26, 0x1a6e1a));
    normalTiles.push(scene.add.circle(tx - 8, ty - 20, 18, 0x228822));
  });

  [
    { x: 6, y: 6 },
    { x: 11, y: 9 },
    { x: 19, y: 3 },
    { x: 4, y: 16 },
  ].forEach(function (pos) {
    normalTiles.push(
      scene.add.ellipse(
        pos.x * tileSize + tileSize / 2,
        pos.y * tileSize + tileSize / 2,
        36,
        26,
        0x888888,
      ),
    );
  });

  [
    { x: 10, y: 10 },
    { x: 20, y: 5 },
    { x: 5, y: 22 },
  ].forEach(function (pos) {
    var fx = pos.x * tileSize + tileSize / 2,
      fy = pos.y * tileSize + tileSize / 2;
    scene.add.rectangle(fx, fy + 5, 28, 8, 0x6b3a2a);
    var flame1 = scene.add.triangle(
      fx,
      fy - 20,
      -10,
      10,
      10,
      10,
      0,
      -15,
      0xff4400,
    );
    var flame2 = scene.add.triangle(
      fx - 6,
      fy - 12,
      -6,
      8,
      6,
      8,
      0,
      -10,
      0xff8800,
    );
    scene.tweens.add({
      targets: [flame1, flame2],
      scaleX: 0.85,
      scaleY: 1.15,
      duration: 150 + Math.random() * 100,
      yoyo: true,
      repeat: -1,
    });
    normalTiles.push(flame1, flame2);
  });

  for (var sx = 0; sx < mapWidth; sx++) {
    for (var sy = 0; sy < mapHeight; sy++) {
      var sc = (sx + sy) % 2 === 0 ? 0x1a0033 : 0x220044;
      shadowTiles.push(
        scene.add
          .rectangle(
            sx * tileSize + tileSize / 2,
            sy * tileSize + tileSize / 2,
            tileSize - 1,
            tileSize - 1,
            sc,
          )
          .setVisible(false),
      );
    }
  }

  [
    { x: 3, y: 3 },
    { x: 8, y: 6 },
    { x: 14, y: 2 },
    { x: 20, y: 8 },
  ].forEach(function (pos) {
    var c1 = scene.add
      .triangle(
        pos.x * tileSize + tileSize / 2,
        pos.y * tileSize + tileSize / 4,
        -8,
        15,
        8,
        15,
        0,
        -20,
        0x8800ff,
      )
      .setVisible(false);
    scene.tweens.add({
      targets: c1,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    shadowTiles.push(c1);
  });

  nightOverlay = scene.add
    .rectangle(0, 0, mapWidth * tileSize, mapHeight * tileSize, 0x000033, 0)
    .setOrigin(0, 0)
    .setDepth(5);
  dimensionOverlay = scene.add
    .rectangle(0, 0, mapWidth * tileSize, mapHeight * tileSize, 0x220044, 0)
    .setOrigin(0, 0)
    .setDepth(4);
}

// ================================
// CREATE TEXTURES
// ================================
function createTextures() {
  var pg = scene.make.graphics({ x: 0, y: 0, add: false });
  pg.fillStyle(playerClass.color);
  pg.fillRoundedRect(4, 12, 32, 28, 5);
  pg.fillStyle(0xffddaa);
  pg.fillCircle(20, 10, 12);
  pg.generateTexture("playerTex", 40, 42);
  pg.destroy();

  var opg = scene.make.graphics({ x: 0, y: 0, add: false });
  opg.fillStyle(0xaa44ff);
  opg.fillRoundedRect(4, 12, 32, 28, 5);
  opg.fillStyle(0xffddaa);
  opg.fillCircle(20, 10, 12);
  opg.generateTexture("otherPlayerTex", 40, 42);
  opg.destroy();

  Object.keys(MONSTERS).forEach(function (key) {
    var m = MONSTERS[key];
    var mg = scene.make.graphics({ x: 0, y: 0, add: false });
    mg.fillStyle(m.color);
    mg.fillRoundedRect(4, 10, m.size - 8, m.size - 10, 4);
    mg.fillStyle(0xffffff);
    mg.fillCircle(12, 14, 5);
    mg.fillCircle(m.size - 14, 14, 5);
    mg.fillStyle(0x000000);
    mg.fillCircle(13, 14, 3);
    mg.fillCircle(m.size - 13, 14, 3);
    mg.generateTexture(key + "Tex", m.size, m.size);
    mg.destroy();
  });

  Object.keys(SHADOW_MONSTERS).forEach(function (key) {
    var m = SHADOW_MONSTERS[key];
    var smg = scene.make.graphics({ x: 0, y: 0, add: false });
    smg.fillStyle(m.color, 0.85);
    smg.fillRoundedRect(4, 10, m.size - 8, m.size - 10, 6);
    smg.fillStyle(0xff4488);
    smg.fillCircle(12, 14, 5);
    smg.fillCircle(m.size - 14, 14, 5);
    smg.generateTexture(key + "Tex", m.size, m.size);
    smg.destroy();
  });

  var bg = scene.make.graphics({ x: 0, y: 0, add: false });
  bg.fillStyle(0x440000);
  bg.fillRoundedRect(5, 5, 90, 90, 10);
  bg.fillStyle(0xcc0000);
  bg.fillRoundedRect(15, 15, 70, 70, 8);
  bg.fillStyle(0xff0000);
  bg.fillCircle(30, 30, 16);
  bg.fillCircle(70, 30, 16);
  bg.fillStyle(0xffffff);
  bg.fillCircle(30, 30, 8);
  bg.fillCircle(70, 30, 8);
  bg.fillStyle(0xffff00);
  bg.fillRect(25, 65, 50, 12);
  bg.generateTexture("bossTex", 100, 100);
  bg.destroy();

  var potg = scene.make.graphics({ x: 0, y: 0, add: false });
  potg.fillStyle(0xff69b4);
  potg.fillRoundedRect(2, 6, 26, 24, 8);
  potg.fillStyle(0xffbbdd);
  potg.fillCircle(10, 13, 6);
  potg.generateTexture("potionTex", 30, 32);
  potg.destroy();

  var tg = scene.make.graphics({ x: 0, y: 0, add: false });
  tg.fillStyle(0x666666);
  tg.fillRoundedRect(5, 0, 34, 40, 8);
  tg.fillStyle(0x999999);
  tg.fillRect(18, 10, 4, 18);
  tg.fillRect(11, 16, 18, 4);
  tg.generateTexture("tombstoneTex", 44, 44);
  tg.destroy();

  var smg2 = scene.make.graphics({ x: 0, y: 0, add: false });
  smg2.fillStyle(0xdddddd);
  smg2.fillRoundedRect(5, 10, 22, 24, 4);
  smg2.fillStyle(0xeeeeee);
  smg2.fillCircle(16, 8, 9);
  smg2.generateTexture("minionTex", 32, 36);
  smg2.destroy();

  var wg = scene.make.graphics({ x: 0, y: 0, add: false });
  wg.fillStyle(0x886644);
  wg.fillEllipse(16, 16, 30, 22);
  wg.fillStyle(0x775533);
  wg.fillCircle(26, 10, 10);
  wg.generateTexture("wolfTex", 36, 32);
  wg.destroy();
}

// ================================
// CREATE PLAYER
// ================================
function createPlayer() {
  player = scene.physics.add.image(400, 300, "playerTex");
  scene.physics.world.setBounds(
    0,
    0,
    mapWidth * tileSize,
    mapHeight * tileSize,
  );
  player.setCollideWorldBounds(true);
  attackIndicator = scene.add
    .circle(player.x, player.y, playerAttackRange, 0xffffff, 0)
    .setStrokeStyle(1, 0xffffff, 0.2)
    .setDepth(8);
}

// ================================
// PORTALS
// ================================
function createPortals() {
  portals = scene.physics.add.staticGroup();
  var p1 = portals.create(24 * tileSize, 24 * tileSize, null);
  p1.setCircle(32);
  p1.portalType = "toShadow";
  var p2 = portals.create(4 * tileSize, 4 * tileSize, null);
  p2.setCircle(32);
  p2.portalType = "toNormal";

  var pDefs = [
    {
      x: 24 * tileSize,
      y: 24 * tileSize,
      color: 0xaa00ff,
      label: "🌀 Shadow Portal",
    },
    {
      x: 4 * tileSize,
      y: 4 * tileSize,
      color: 0xffaa00,
      label: "🌀 Return Portal",
    },
  ];
  pDefs.forEach(function (pd) {
    var gfx = scene.add.graphics();
    scene.time.addEvent({
      delay: 50,
      loop: true,
      callback: function () {
        gfx.clear();
        var a = 0.4 + Math.sin(Date.now() / 300) * 0.3;
        gfx.lineStyle(5, pd.color, a);
        gfx.strokeCircle(pd.x, pd.y, 36);
        gfx.fillStyle(pd.color, a * 0.15);
        gfx.fillCircle(pd.x, pd.y, 34);
      },
    });
    scene.add
      .text(pd.x, pd.y - 52, pd.label, {
        fontSize: "13px",
        fill: "#ffffff",
        stroke: "#000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  });
}

function touchPortal(player, portal) {
  if (portalCooldown) return;
  portalCooldown = true;
  setTimeout(function () {
    portalCooldown = false;
  }, 2000);
  if (portal.portalType === "toShadow" && currentDimension === 0)
    enterShadowRealm();
  else if (portal.portalType === "toNormal" && currentDimension === 1)
    enterNormalWorld();
}

function enterShadowRealm() {
  currentDimension = 1;
  sounds.portal();
  scene.cameras.main.flash(500, 100, 0, 150);
  normalTiles.forEach(function (t) {
    t.setVisible(false);
  });
  shadowTiles.forEach(function (t) {
    t.setVisible(true);
  });
  scene.tweens.add({ targets: dimensionOverlay, alpha: 0.4, duration: 1000 });
  clearEnemies();
  for (var i = 0; i < 10; i++) spawnShadowEnemy();
  var di = document.getElementById("dimensionIndicator");
  if (di) {
    di.innerHTML = "🌑 Shadow Realm";
    di.style.color = "#cc88ff";
  }
  showFloatingText(
    "🌑 Shadow Realm!",
    player.x - 100,
    player.y - 80,
    "#cc88ff",
  );
  questStats.dimensionVisited = 1;
  updateQuests("dimension", {});
  if (playersRef && myPlayerId)
    playersRef.child(myPlayerId).update({ dimension: 1 });
}

function enterNormalWorld() {
  currentDimension = 0;
  sounds.portal();
  scene.cameras.main.flash(500, 50, 150, 50);
  shadowTiles.forEach(function (t) {
    t.setVisible(false);
  });
  normalTiles.forEach(function (t) {
    t.setVisible(true);
  });
  scene.tweens.add({ targets: dimensionOverlay, alpha: 0, duration: 1000 });
  clearEnemies();
  spawnInitialEnemies();
  var di = document.getElementById("dimensionIndicator");
  if (di) {
    di.innerHTML = "🌍 Normal World";
    di.style.color = "#aaffaa";
  }
  showFloatingText(
    "🌍 Normal World!",
    player.x - 100,
    player.y - 80,
    "#aaffaa",
  );
  if (playersRef && myPlayerId)
    playersRef.child(myPlayerId).update({ dimension: 0 });
}

function clearEnemies() {
  enemies.getChildren().forEach(function (e) {
    if (e.healthBar) e.healthBar.destroy();
    if (e.nameTag) e.nameTag.destroy();
    e.destroy();
  });
}

// ================================
// SPAWN ENEMIES
// ================================
function spawnInitialEnemies() {
  var types = Object.keys(MONSTERS);
  for (var i = 0; i < 14; i++)
    spawnEnemy(types[Math.floor(Math.random() * types.length)]);
}

function spawnEnemy(type) {
  var types = Object.keys(MONSTERS);
  if (!type) type = types[Math.floor(Math.random() * types.length)];
  var m = MONSTERS[type];
  var x = Phaser.Math.Between(4, mapWidth - 3) * tileSize;
  var y = Phaser.Math.Between(4, mapHeight - 3) * tileSize;
  var enemy = enemies.create(x, y, type + "Tex");
  enemy.setCollideWorldBounds(true);
  enemy.monsterType = type;
  enemy.isShadow = false;
  enemy.health = m.hp * (1 + playerLevel * 0.2);
  enemy.maxHealth = enemy.health;
  enemy.speed = m.speed + playerLevel * 4;
  enemy.damage = m.damage;
  enemy.xpReward = m.xp + playerLevel * 5;
  enemy.scoreValue = m.score;
  enemy.patrolX = x;
  enemy.patrolY = y;
  enemy.healthBar = scene.add
    .rectangle(x, y - 35, m.size, 6, 0xff3333)
    .setDepth(6);
  enemy.nameTag = scene.add
    .text(x, y - 50, m.name + " Lv." + playerLevel, {
      fontSize: "11px",
      fill: "#ffffff",
      stroke: "#000",
      strokeThickness: 2,
    })
    .setOrigin(0.5)
    .setDepth(6);
  return enemy;
}

function spawnShadowEnemy(type) {
  var types = Object.keys(SHADOW_MONSTERS);
  if (!type) type = types[Math.floor(Math.random() * types.length)];
  var m = SHADOW_MONSTERS[type];
  var x = Phaser.Math.Between(3, mapWidth - 2) * tileSize;
  var y = Phaser.Math.Between(3, mapHeight - 2) * tileSize;
  var enemy = enemies.create(x, y, type + "Tex");
  enemy.setCollideWorldBounds(true);
  enemy.monsterType = type;
  enemy.isShadow = true;
  enemy.health = m.hp * (1 + playerLevel * 0.2);
  enemy.maxHealth = enemy.health;
  enemy.speed = m.speed + playerLevel * 4;
  enemy.damage = m.damage;
  enemy.xpReward = m.xp + playerLevel * 5;
  enemy.scoreValue = m.score;
  enemy.patrolX = x;
  enemy.patrolY = y;
  scene.tweens.add({
    targets: enemy,
    alpha: 0.5,
    duration: 500 + Math.random() * 200,
    yoyo: true,
    repeat: -1,
  });
  enemy.healthBar = scene.add
    .rectangle(x, y - 35, m.size, 6, 0x8800ff)
    .setDepth(6);
  enemy.nameTag = scene.add
    .text(x, y - 50, m.name + " Lv." + playerLevel, {
      fontSize: "11px",
      fill: "#cc88ff",
      stroke: "#000",
      strokeThickness: 2,
    })
    .setOrigin(0.5)
    .setDepth(6);
  return enemy;
}

// ================================
// CAMERA + KEYBOARD
// ================================
function setupCamera() {
  scene.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
  scene.cameras.main.startFollow(player, true, 0.08, 0.08);
  scene.cameras.main.setZoom(0.5);
  scene.tweens.add({
    targets: scene.cameras.main,
    zoom: 1,
    duration: 1200,
    ease: "Power2",
  });
}

function setupKeyboard() {
  cursors = scene.input.keyboard.createCursorKeys();
  wasd = scene.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });
  shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  scene.input.keyboard.on("keydown-SPACE", function () {
    if (!chatOpen) doAttack();
  });
  scene.input.keyboard.on("keydown-I", function () {
    if (!chatOpen) toggleInventory();
  });
  scene.input.keyboard.on("keydown-F", function () {
    if (!chatOpen) usePotion();
  });
  scene.input.keyboard.on("keydown-E", function () {
    if (!chatOpen) useAbility();
  });
  scene.input.keyboard.on("keydown-T", function () {
    openChat();
  });
  scene.input.keyboard.on("keydown-ENTER", function () {
    if (!chatOpen) {
      saveGame();
      sounds.save();
      showFloatingText("💾 Saved!", player.x, player.y - 60, "#00ffff");
    }
  });
}

// ================================
// JOYSTICK
// ================================
function setupJoystick() {
  if (!isMobile) return;
  var zone = document.getElementById("joystickZone");
  var base = document.getElementById("joystickBase");
  var thumb = document.getElementById("joystickThumb");
  if (!zone || !base || !thumb) return;
  var maxDist = 42;
  zone.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      var touch = e.changedTouches[0];
      joystickActive = true;
      joystickStartX = touch.clientX;
      joystickStartY = touch.clientY;
      var zoneRect = zone.getBoundingClientRect();
      base.style.left = touch.clientX - zoneRect.left - 55 + "px";
      base.style.bottom = "auto";
      base.style.top = touch.clientY - zoneRect.top - 55 + "px";
    },
    { passive: false },
  );
  zone.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      if (!joystickActive) return;
      var touch = e.changedTouches[0];
      var dx = touch.clientX - joystickStartX,
        dy = touch.clientY - joystickStartY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
      }
      thumb.style.transform = "translate(" + dx + "px, " + dy + "px)";
      joystickDX = dx / maxDist;
      joystickDY = dy / maxDist;
    },
    { passive: false },
  );
  zone.addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
      joystickActive = false;
      joystickDX = 0;
      joystickDY = 0;
      thumb.style.transform = "translate(0px, 0px)";
      base.style.left = "50px";
      base.style.top = "auto";
      base.style.bottom = "30px";
    },
    { passive: false },
  );
}

// ================================
// ATTACK
// ================================
function doAttack() {
  var now = Date.now();
  if (now - lastAttackTime < playerClass.attackCooldown) return;
  lastAttackTime = now;
  sounds.attack();

  var swing = scene.add.graphics();
  swing.lineStyle(3, 0xffddaa, 1);
  swing.arc(
    player.x,
    player.y,
    playerAttackRange * 0.7,
    playerFacing === 1 ? -0.5 : Math.PI + 0.5,
    playerFacing === 1 ? 0.8 : Math.PI - 0.8,
  );
  swing.strokePath();
  scene.tweens.add({
    targets: swing,
    alpha: 0,
    duration: 250,
    onComplete: function () {
      swing.destroy();
    },
  });

  var hitAny = false;
  enemies.getChildren().forEach(function (enemy) {
    if (!enemy || !enemy.active) return;
    if (
      Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) <=
      playerAttackRange
    ) {
      var dmg = playerDamage;
      if (selectedClass === "berserker") {
        var r = playerHealth / playerMaxHealth;
        if (r < 0.5) dmg = Math.floor(dmg * 1.8);
        if (r < 0.25) dmg = Math.floor(dmg * 2.5);
      }
      var crit = selectedClass === "rogue" && Math.random() < 0.3;
      if (crit) dmg = Math.floor(dmg * 2);
      enemy.health -= dmg;
      enemy.setTint(0xffffff);
      scene.time.delayedCall(100, function () {
        if (enemy && enemy.active) enemy.clearTint();
      });
      showFloatingText(
        (crit ? "⚡ CRIT! " : "") + dmg,
        enemy.x,
        enemy.y - 40,
        crit ? "#ffff00" : "#ffddaa",
      );
      hitAny = true;
      if (enemy.health <= 0) killEnemy(enemy);
    }
  });

  if (
    boss &&
    boss.active &&
    Phaser.Math.Distance.Between(player.x, player.y, boss.x, boss.y) <=
      playerAttackRange + 50
  ) {
    boss.health -= playerDamage;
    updateBossHealthBar();
    if (boss.health <= 0) killBoss();
  }
  if (!hitAny)
    showFloatingText(
      "miss",
      player.x + playerFacing * 30,
      player.y - 20,
      "#666666",
    );
}

// ================================
// HIT ENEMY (collision)
// ================================
function hitEnemy(player, enemy) {
  if (playerInvisible) return;
  var now = Date.now();
  if (now - lastHitTime < 1000) return;
  lastHitTime = now;
  var dmg = enemy.damage || 10;
  playerHealth -= dmg;
  sounds.hit();
  scene.cameras.main.shake(200, 0.008);
  player.setTint(0xff0000);
  scene.time.delayedCall(200, function () {
    player.clearTint();
  });
  updateHealthBar();
  showFloatingText("-" + dmg, player.x, player.y - 50, "#ff3333");
  if (playerHealth <= 0) {
    playerHealth = 0;
    updateHealthBar();
    showGameOver();
  }
}

function killEnemy(enemy) {
  if (!enemy || !enemy.active) return;
  var m = enemy.isShadow
    ? SHADOW_MONSTERS[enemy.monsterType] || SHADOW_MONSTERS.wraith
    : MONSTERS[enemy.monsterType] || MONSTERS.goblin;
  spawnParticles(enemy.x, enemy.y, m.color, 12);
  sounds.enemyDie();
  gainXP(enemy.xpReward);
  score += enemy.scoreValue * playerLevel;
  if (scoreText) scoreText.setText("Score: " + score);
  spawnPotion(enemy.x, enemy.y, false);
  questStats.kills[enemy.monsterType] =
    (questStats.kills[enemy.monsterType] || 0) + 1;
  updateQuests("kill", { monster: enemy.monsterType });
  updateQuests("score", {});
  if (enemy.healthBar) enemy.healthBar.destroy();
  if (enemy.nameTag) enemy.nameTag.destroy();
  var wasShadow = enemy.isShadow;
  enemy.destroy();
  setTimeout(function () {
    if (currentDimension === 1 && wasShadow) spawnShadowEnemy();
    else if (currentDimension === 0 && !wasShadow) spawnEnemy();
  }, 4000);
}

// ================================
// POTIONS
// ================================
function spawnPotion(x, y, force) {
  if (!force && Math.random() > 0.35) return;
  var potion = potions.create(x, y, "potionTex");
  potion.setCollideWorldBounds(true);
  scene.tweens.add({
    targets: potion,
    y: potion.y - 12,
    duration: 600,
    yoyo: true,
    repeat: -1,
  });
  potion.label = scene.add.text(x - 18, y - 28, "💊 Potion", {
    fontSize: "10px",
    fill: "#ffaacc",
  });
  return potion;
}

function pickUpPotion(player, potion) {
  inventory.push("Health Potion");
  updateInventoryPanel();
  if (potion.label) potion.label.destroy();
  potion.destroy();
  sounds.pickup();
  questStats.potionsCollected++;
  updateQuests("collect", {});
  showFloatingText("💊 Potion!", player.x, player.y - 60, "#ff69b4");
}

function usePotion() {
  var i = inventory.indexOf("Health Potion");
  if (i === -1) {
    showFloatingText("❌ No potions!", player.x, player.y - 60, "#ff0000");
    return;
  }
  inventory.splice(i, 1);
  updateInventoryPanel();
  playerHealth = Math.min(playerHealth + 40, playerMaxHealth);
  updateHealthBar();
  sounds.pickup();
  showFloatingText("+40 HP!", player.x, player.y - 60, "#44ff44");
}

// ================================
// ABILITIES
// ================================
function useAbility() {
  var now = Date.now();
  if (now - abilityLastUsed < playerClass.abilityCooldown) {
    var rem = Math.ceil(
      (playerClass.abilityCooldown - (now - abilityLastUsed)) / 1000,
    );
    showFloatingText("⏳ " + rem + "s", player.x, player.y - 60, "#888");
    return;
  }
  abilityLastUsed = now;
  sounds.ability();
  var btn = document.getElementById("abilityBtn");
  if (btn) {
    btn.classList.remove("ready");
    btn.classList.add("cooldown");
    setTimeout(function () {
      btn.classList.remove("cooldown");
      btn.classList.add("ready");
    }, playerClass.abilityCooldown);
  }
  if (selectedClass === "warrior") abilityWarrior();
  else if (selectedClass === "archer") abilityArcher();
  else if (selectedClass === "mage") abilityMage();
  else if (selectedClass === "rogue") abilityRogue();
  else if (selectedClass === "paladin") abilityPaladin();
  else if (selectedClass === "necromancer") abilityNecromancer();
  else if (selectedClass === "berserker") abilityBerserker();
  else if (selectedClass === "ranger") abilityRanger();
}

function abilityWarrior() {
  showFloatingText("🛡️ SHIELD BASH!", player.x - 60, player.y - 70, "#ff8888");
  spawnParticles(player.x, player.y, 0xff6666, 16);
  enemies.getChildren().forEach(function (enemy) {
    if (
      Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 160
    ) {
      var prev = enemy.speed;
      enemy.speed = 0;
      enemy.setTint(0xffff00);
      enemy.health -= playerDamage * 2.5;
      scene.time.delayedCall(2500, function () {
        if (enemy && enemy.active) {
          enemy.speed = prev;
          enemy.clearTint();
        }
      });
      if (enemy.health <= 0) killEnemy(enemy);
    }
  });
}

function abilityArcher() {
  showFloatingText("🏹 ARROW RAIN!", player.x - 60, player.y - 70, "#88ff88");
  for (var i = 0; i < 16; i++) {
    (function (angle) {
      var arrow = scene.add
        .rectangle(player.x, player.y, 22, 5, 0x88ff44)
        .setRotation(angle)
        .setDepth(10);
      scene.tweens.add({
        targets: arrow,
        x: player.x + Math.cos(angle) * 280,
        y: player.y + Math.sin(angle) * 280,
        alpha: 0,
        duration: 450,
        onComplete: function () {
          arrow.destroy();
        },
      });
      enemies.getChildren().forEach(function (enemy) {
        var ex = enemy.x - player.x,
          ey = enemy.y - player.y,
          dist = Math.sqrt(ex * ex + ey * ey);
        if (dist < 280 && Math.abs(Math.atan2(ey, ex) - angle) < 0.25) {
          enemy.health -= playerDamage;
          if (enemy.health <= 0) killEnemy(enemy);
        }
      });
    })((i / 16) * Math.PI * 2);
  }
}

function abilityMage() {
  showFloatingText("🔥 FIREBALL!", player.x - 50, player.y - 70, "#8888ff");
  spawnParticles(player.x, player.y, 0xff4400, 28);
  scene.cameras.main.shake(500, 0.02);
  enemies.getChildren().forEach(function (enemy) {
    if (
      Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 270
    ) {
      enemy.health -= playerDamage * 3.5;
      if (enemy.health <= 0) killEnemy(enemy);
    }
  });
  if (
    boss &&
    boss.active &&
    Phaser.Math.Distance.Between(player.x, player.y, boss.x, boss.y) < 270
  ) {
    boss.health -= playerDamage * 3.5;
    updateBossHealthBar();
    if (boss.health <= 0) killBoss();
  }
}

function abilityRogue() {
  showFloatingText("👁️ VANISH!", player.x - 40, player.y - 70, "#ffaa44");
  playerInvisible = true;
  player.setAlpha(0.15);
  playerSpeed *= 2;
  scene.time.delayedCall(3000, function () {
    playerInvisible = false;
    player.setAlpha(1);
    playerSpeed /= 2;
    showFloatingText("👁️ Visible!", player.x - 40, player.y - 60, "#ffaa44");
  });
}

function abilityPaladin() {
  showFloatingText("✨ HOLY AURA!", player.x - 60, player.y - 70, "#ffddaa");
  var heal = Math.floor(playerMaxHealth * 0.35);
  playerHealth = Math.min(playerHealth + heal, playerMaxHealth);
  updateHealthBar();
  for (var i = 0; i < 20; i++) {
    (function (angle) {
      var star = scene.add
        .circle(
          player.x + Math.cos(angle) * 80,
          player.y + Math.sin(angle) * 80,
          6,
          0xffff88,
        )
        .setDepth(15);
      scene.tweens.add({
        targets: star,
        x: player.x,
        y: player.y,
        alpha: 0,
        duration: 600,
        onComplete: function () {
          star.destroy();
        },
      });
    })((i / 20) * Math.PI * 2);
  }
  enemies.getChildren().forEach(function (enemy) {
    if (["skeleton", "wraith", "lich"].indexOf(enemy.monsterType) !== -1) {
      if (
        Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 200
      ) {
        enemy.health -= playerDamage * 4;
        if (enemy.health <= 0) killEnemy(enemy);
      }
    }
  });
  showFloatingText("+" + heal + " HP!", player.x, player.y - 90, "#ffff44");
}

function abilityNecromancer() {
  showFloatingText("☠️ RAISE DEAD!", player.x - 60, player.y - 70, "#88ff88");
  for (var i = 0; i < 3; i++) {
    (function (angle) {
      var mx = player.x + Math.cos(angle) * 60,
        my = player.y + Math.sin(angle) * 60;
      var minion = scene.physics.add.image(mx, my, "minionTex");
      minion.speed = 130;
      minions.push(minion);
      minion.label = scene.add
        .text(mx, my - 28, "☠️ Minion", {
          fontSize: "10px",
          fill: "#88ff88",
          stroke: "#000",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
      scene.physics.add.overlap(minion, enemies, function (m, enemy) {
        if (!enemy || !enemy.active) return;
        enemy.health -= 15;
        if (enemy.health <= 0) killEnemy(enemy);
      });
      scene.time.delayedCall(15000, function () {
        if (minion && minion.active) {
          if (minion.label) minion.label.destroy();
          minion.destroy();
          minions = minions.filter(function (m) {
            return m !== minion;
          });
        }
      });
    })((i / 3) * Math.PI * 2);
  }
}

function abilityBerserker() {
  showFloatingText("😤 BERSERK RAGE!", player.x - 70, player.y - 70, "#ff4444");
  isBerserking = true;
  playerSpeed *= 1.6;
  playerDamage = Math.floor(playerDamage * 2.5);
  player.setTint(0xff2200);
  scene.cameras.main.shake(300, 0.015);
  scene.time.delayedCall(8000, function () {
    isBerserking = false;
    playerSpeed /= 1.6;
    playerDamage = Math.floor(playerDamage / 2.5);
    player.clearTint();
    showFloatingText("😤 Rage ended", player.x - 50, player.y - 60, "#888");
  });
}

function abilityRanger() {
  showFloatingText("🐺 WOLF PACK!", player.x - 50, player.y - 70, "#44ffaa");
  for (var i = 0; i < 2; i++) {
    (function () {
      var wx = player.x + Phaser.Math.Between(-60, 60),
        wy = player.y + Phaser.Math.Between(-60, 60);
      var wolf = scene.physics.add.image(wx, wy, "wolfTex");
      wolf.speed = 200;
      wolfPets.push(wolf);
      wolf.label = scene.add
        .text(wx, wy - 28, "🐺 Wolf", {
          fontSize: "10px",
          fill: "#44ffaa",
          stroke: "#000",
          strokeThickness: 2,
        })
        .setOrigin(0.5);
      scene.physics.add.overlap(wolf, enemies, function (w, enemy) {
        if (!enemy || !enemy.active) return;
        var now = Date.now();
        if (!w.lastBite || now - w.lastBite > 800) {
          w.lastBite = now;
          enemy.health -= 20 + playerLevel * 3;
          if (enemy.health <= 0) killEnemy(enemy);
        }
      });
      scene.time.delayedCall(18000, function () {
        if (wolf && wolf.active) {
          if (wolf.label) wolf.label.destroy();
          wolf.destroy();
          wolfPets = wolfPets.filter(function (w) {
            return w !== wolf;
          });
        }
      });
    })();
  }
}

// ================================
// XP + LEVEL
// ================================
function gainXP(amount) {
  playerXP += amount;
  if (player)
    showFloatingText("+" + amount + " XP", player.x, player.y - 70, "#ffff44");
  if (playerXP >= xpToNextLevel) levelUp();
  updateXPBar();
}

function levelUp() {
  playerXP -= xpToNextLevel;
  playerLevel++;
  xpToNextLevel = playerLevel * 100;
  playerMaxHealth += 20;
  playerHealth = playerMaxHealth;
  playerSpeed += 5;
  playerDamage += 5;
  sounds.levelUp();
  scene.tweens.add({
    targets: player,
    scaleX: 1.5,
    scaleY: 1.5,
    duration: 200,
    yoyo: true,
    repeat: 2,
  });
  player.setTint(0xffff00);
  scene.time.delayedCall(800, function () {
    if (!isBerserking) player.clearTint();
  });
  if (levelText) levelText.setText("⭐ Lv." + playerLevel);
  if (playerNameText)
    playerNameText.setText(
      playerClass.icon + " " + playerName + " Lv." + playerLevel,
    );
  updateHealthBar();
  updateXPBar();
  updateQuests("level", {});
  showFloatingText(
    "🌟 LEVEL UP! " + playerLevel,
    player.x - 70,
    player.y - 90,
    "#ffff00",
  );
  saveGame();
}

// ================================
// BOSS
// ================================
function startBossTimer() {
  scene.time.addEvent({
    delay: 90000,
    callback: function () {
      showFloatingText(
        "⚠️ Boss in 30s!",
        player.x - 100,
        player.y - 80,
        "#ff8800",
      );
    },
  });
  scene.time.addEvent({
    delay: 120000,
    callback: function () {
      spawnBoss();
    },
  });
}

function spawnBoss() {
  if (bossSpawned) return;
  bossSpawned = true;
  sounds.bossSpawn();
  var x = (mapWidth / 2) * tileSize,
    y = (mapHeight / 2) * tileSize;
  boss = scene.physics.add.image(x, y, "bossTex");
  boss.setCollideWorldBounds(true);
  boss.health = 600 + playerLevel * 120;
  boss.maxHealth = boss.health;
  boss.speed = 55 + playerLevel * 5;
  boss.xpReward = 400 + playerLevel * 60;
  scene.tweens.add({
    targets: boss,
    scaleX: 1.12,
    scaleY: 1.12,
    duration: 700,
    yoyo: true,
    repeat: -1,
  });
  bossHealthBarBg = scene.add
    .rectangle(640, 50, 504, 28, 0x000000)
    .setScrollFactor(0)
    .setDepth(15);
  bossHealthBar = scene.add
    .rectangle(640, 50, 500, 24, 0xff0000)
    .setScrollFactor(0)
    .setDepth(15);
  bossNameText = scene.add
    .text(640, 50, "💀 DRAGON KING  " + boss.health + "/" + boss.maxHealth, {
      fontSize: "14px",
      fill: "#fff",
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(15);
  showFloatingText(
    "⚠️ THE DRAGON KING APPEARS!",
    player.x - 160,
    player.y - 100,
    "#ff0000",
  );
  addChatMessage("System", "⚠️ BOSS SPAWNED!", "#ff0000");
  scene.physics.add.overlap(player, boss, hitByBoss, null, scene);
}

var lastBossHit = 0;
function hitByBoss(player, boss) {
  var now = Date.now();
  if (now - lastBossHit < 1500) return;
  lastBossHit = now;
  var dmg = 35 + playerLevel * 4;
  playerHealth -= dmg;
  sounds.hit();
  player.setTint(0xff0000);
  scene.cameras.main.shake(350, 0.02);
  scene.time.delayedCall(250, function () {
    player.clearTint();
  });
  updateHealthBar();
  showFloatingText("-" + dmg, player.x, player.y - 50, "#ff0000");
  if (playerHealth <= 0) {
    playerHealth = 0;
    updateHealthBar();
    showGameOver();
  }
}

function killBoss() {
  spawnParticles(boss.x, boss.y, 0xff0000, 30);
  spawnParticles(boss.x, boss.y, 0xffff00, 22);
  gainXP(boss.xpReward);
  score += 600 * playerLevel;
  if (scoreText) scoreText.setText("Score: " + score);
  for (var i = 0; i < 4; i++)
    spawnPotion(
      boss.x + Phaser.Math.Between(-80, 80),
      boss.y + Phaser.Math.Between(-80, 80),
      true,
    );
  if (bossHealthBarBg) bossHealthBarBg.destroy();
  if (bossHealthBar) bossHealthBar.destroy();
  if (bossNameText) bossNameText.destroy();
  boss.destroy();
  boss = null;
  bossSpawned = false;
  questStats.bossKills++;
  updateQuests("boss", {});
  showFloatingText(
    "🏆 BOSS DEFEATED!",
    player.x - 100,
    player.y - 90,
    "#ffff00",
  );
  addChatMessage("System", "🏆 Boss defeated!", "#ffff00");
  scene.time.addEvent({
    delay: 180000,
    callback: function () {
      spawnBoss();
    },
  });
}

function updateBossHealthBar() {
  if (!boss || !bossHealthBar) return;
  bossHealthBar.width = 500 * (boss.health / boss.maxHealth);
  if (bossNameText)
    bossNameText.setText(
      "💀 DRAGON KING  " +
        Math.max(0, Math.floor(boss.health)) +
        "/" +
        boss.maxHealth,
    );
}

// ================================
// DAY / NIGHT
// ================================
function startDayNightCycle() {
  timeText = scene.add
    .text(640, 15, "☀️ Day", { fontSize: "15px", fill: "#ffff88" })
    .setOrigin(0.5, 0)
    .setScrollFactor(0)
    .setDepth(10);
  scene.time.addEvent({
    delay: 35000,
    loop: true,
    callback: function () {
      dayTime = dayTime === 0 ? 1 : 0;
      if (dayTime === 1) {
        timeText.setText("🌙 Night");
        scene.tweens.add({ targets: nightOverlay, alpha: 0.5, duration: 3000 });
        enemies.getChildren().forEach(function (e) {
          e.speed *= 1.25;
        });
        showFloatingText("🌙 Night!", player.x - 60, player.y - 80, "#aaaaff");
      } else {
        timeText.setText("☀️ Day");
        scene.tweens.add({ targets: nightOverlay, alpha: 0, duration: 3000 });
        enemies.getChildren().forEach(function (e) {
          e.speed /= 1.25;
        });
        showFloatingText("☀️ Day!", player.x - 40, player.y - 80, "#ffff88");
      }
    },
  });
}

// ================================
// SURVIVE TIMER
// ================================
function startSurviveTimer() {
  scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: function () {
      if (gameStarted && player && player.active) {
        surviveTimer++;
        updateQuests("survive", {});
        if (surviveTimer % 5 === 0 && playerHealth < playerMaxHealth) {
          playerHealth = Math.min(playerHealth + 1, playerMaxHealth);
          updateHealthBar();
        }
      }
    },
  });
}

// ================================
// TOMBSTONE
// ================================
function spawnTombstone(x, y) {
  addTombstoneVisual(x, y, playerName, playerLevel, "#cccccc");
  if (tombstonesRef && myPlayerId) {
    tombstonesRef.push({
      x: x,
      y: y,
      name: playerClass.icon + " " + playerName,
      level: playerLevel,
      dimension: currentDimension,
      senderId: myPlayerId,
      time: Date.now(),
    });
  }
}

// ================================
// BUILD UI
// ================================
function buildUI() {
  healthBarBg = scene.add
    .rectangle(16, 16, 206, 22, 0x111111)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(10);
  healthBar = scene.add
    .rectangle(18, 18, 202, 18, 0x22cc22)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(10);
  healthText = scene.add
    .text(22, 18, "HP: " + playerHealth + "/" + playerMaxHealth, {
      fontSize: "12px",
      fill: "#fff",
    })
    .setScrollFactor(0)
    .setDepth(11);

  xpBarBg = scene.add
    .rectangle(16, 44, 206, 14, 0x111111)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(10);
  xpBar = scene.add
    .rectangle(18, 46, 0, 10, 0xdddd00)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(10);
  xpText = scene.add
    .text(22, 45, "XP: 0/" + xpToNextLevel, { fontSize: "10px", fill: "#ddd" })
    .setScrollFactor(0)
    .setDepth(11);

  var staminaBg = scene.add
    .rectangle(16, 62, 206, 10, 0x111111)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(10);
  staminaBar = scene.add
    .rectangle(18, 64, 202, 6, 0x44aaff)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(10);

  levelText = scene.add
    .text(16, 76, "⭐ Lv." + playerLevel, { fontSize: "15px", fill: "#ffdd00" })
    .setScrollFactor(0)
    .setDepth(10);
  scoreText = scene.add
    .text(16, 96, "Score: " + score, { fontSize: "14px", fill: "#ffffff" })
    .setScrollFactor(0)
    .setDepth(10);
  scene.add
    .text(16, 115, playerClass.icon + " " + playerClass.name, {
      fontSize: "13px",
      fill: "#ffbb88",
    })
    .setScrollFactor(0)
    .setDepth(10);

  if (!isMobile) {
    scene.add
      .text(
        16,
        696,
        "WASD:Move  SHIFT:Sprint  SPACE:Attack  E:" +
          playerClass.ability +
          "  F:Potion  I:Bag  T:Chat  Enter:Save",
        { fontSize: "10px", fill: "#88aa88" },
      )
      .setScrollFactor(0)
      .setDepth(10);
  }

  playerNameText = scene.add.text(
    0,
    0,
    playerClass.icon + " " + playerName + " Lv." + playerLevel,
    { fontSize: "13px", fill: "#ffffff", stroke: "#000", strokeThickness: 2 },
  );
}

function updateHealthBar() {
  var pct = Math.max(0, playerHealth) / playerMaxHealth;
  healthBar.width = 202 * pct;
  if (pct > 0.6) healthBar.setFillStyle(0x22cc22);
  else if (pct > 0.3) healthBar.setFillStyle(0xddcc00);
  else healthBar.setFillStyle(0xdd2222);
  healthText.setText(
    "HP: " + Math.max(0, Math.floor(playerHealth)) + "/" + playerMaxHealth,
  );
}

function updateXPBar() {
  xpBar.width = 202 * (playerXP / xpToNextLevel);
  xpText.setText("XP: " + playerXP + "/" + xpToNextLevel);
}

// ================================
// INVENTORY
// ================================
function buildInventoryPanel() {
  inventoryPanel = scene.add.container(0, 0);
  var bg = scene.add.rectangle(640, 360, 420, 310, 0x0a0a0a, 0.95);
  var title = scene.add
    .text(640, 222, "🎒 Inventory", { fontSize: "22px", fill: "#ffaa00" })
    .setOrigin(0.5);
  var hint = scene.add
    .text(640, 465, "F: Use Potion   I: Close", {
      fontSize: "12px",
      fill: "#666",
    })
    .setOrigin(0.5);
  inventoryPanel.add([bg, title, hint]);
  inventoryPanel.setScrollFactor(0).setDepth(30);
  inventoryPanel.setVisible(false);
}

function updateInventoryPanel() {
  inventoryTexts.forEach(function (t) {
    t.destroy();
  });
  inventoryTexts = [];
  if (inventory.length === 0) {
    var e = scene.add
      .text(640, 360, "No items yet...", { fontSize: "16px", fill: "#555" })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(31);
    inventoryTexts.push(e);
    return;
  }
  var counts = {};
  inventory.forEach(function (i) {
    counts[i] = (counts[i] || 0) + 1;
  });
  var y = 275;
  Object.keys(counts).forEach(function (item) {
    var t = scene.add
      .text(640, y, "💊 " + item + "  ×" + counts[item], {
        fontSize: "18px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(31);
    inventoryTexts.push(t);
    y += 44;
  });
}

function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  inventoryPanel.setVisible(inventoryOpen);
  if (inventoryOpen) updateInventoryPanel();
}

// ================================
// PARTICLES + FLOATING TEXT
// ================================
function spawnParticles(x, y, color, count) {
  count = count || 12;
  for (var i = 0; i < count; i++) {
    (function (angle) {
      var p = scene.add
        .circle(x, y, Phaser.Math.Between(3, 9), color)
        .setDepth(15);
      var spd = Phaser.Math.Between(70, 190);
      scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * spd,
        y: y + Math.sin(angle) * spd,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: Phaser.Math.Between(350, 700),
        onComplete: function () {
          p.destroy();
        },
      });
    })((i / count) * Math.PI * 2);
  }
}

function showFloatingText(msg, x, y, color) {
  var t = scene.add
    .text(x, y, msg, {
      fontSize: "15px",
      fill: color,
      stroke: "#000000",
      strokeThickness: 3,
    })
    .setDepth(20);
  scene.tweens.add({
    targets: t,
    y: y - 55,
    alpha: 0,
    duration: 1400,
    onComplete: function () {
      t.destroy();
    },
  });
}

// ================================
// CHAT
// ================================
function openChat() {
  chatOpen = true;
  var input = document.getElementById("chatInput");
  if (!input) return;
  input.disabled = false;
  input.focus();
  input.onkeydown = function (e) {
    if (e.key === "Enter") {
      var msg = input.value.trim();
      if (msg) {
        addChatMessage(playerName, msg, "#aaffaa");
        if (chatRef && myPlayerId)
          chatRef.push({
            name: playerClass.icon + " " + playerName,
            message: msg,
            senderId: myPlayerId,
            time: Date.now(),
          });
      }
      input.value = "";
      input.disabled = true;
      chatOpen = false;
      input.blur();
    }
    if (e.key === "Escape") {
      input.value = "";
      input.disabled = true;
      chatOpen = false;
      input.blur();
    }
    e.stopPropagation();
  };
}

function addChatMessage(name, msg, color) {
  var msgs = document.getElementById("chatMessages");
  if (!msgs) return;
  var div = document.createElement("div");
  div.style.color = color || "#fff";
  div.style.marginBottom = "3px";
  div.innerHTML = "<b>" + name + ":</b> " + msg;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function updatePlayerCount(count) {
  var el = document.getElementById("playerCount");
  if (el)
    el.innerHTML =
      "🟢 " + count + " Player" + (count !== 1 ? "s" : "") + " Online";
}

// ================================
// SAVE / LOAD
// ================================
function saveGame() {
  localStorage.setItem(
    "pixelRPGSave",
    JSON.stringify({
      playerLevel: playerLevel,
      playerXP: playerXP,
      playerHealth: playerHealth,
      playerMaxHealth: playerMaxHealth,
      playerSpeed: playerSpeed,
      playerDamage: playerDamage,
      xpToNextLevel: xpToNextLevel,
      score: score,
      inventory: inventory,
      playerName: playerName,
      selectedClass: selectedClass,
      questStats: questStats,
    }),
  );
}

function loadGame() {
  try {
    var saved = localStorage.getItem("pixelRPGSave");
    if (!saved) return;
    var data = JSON.parse(saved);
    if (!data) return;
    playerLevel = data.playerLevel || 1;
    playerXP = data.playerXP || 0;
    playerHealth = data.playerHealth || 100;
    playerMaxHealth = data.playerMaxHealth || 100;
    playerSpeed = data.playerSpeed || 200;
    playerDamage = data.playerDamage || 20;
    xpToNextLevel = data.xpToNextLevel || 100;
    score = data.score || 0;
    inventory = data.inventory || [];
    playerName = data.playerName || "Hero";
    if (data.questStats) questStats = data.questStats;
  } catch (e) {
    console.log("No save found");
  }
}

// ================================
// MINIMAP
// ================================
function updateMinimap() {
  var canvas = document.getElementById("minimap");
  if (!canvas || !player) return;
  canvas.width = 130;
  canvas.height = 130;
  var ctx = canvas.getContext("2d");
  var sx = 130 / (mapWidth * tileSize),
    sy = 130 / (mapHeight * tileSize);
  ctx.fillStyle = currentDimension === 1 ? "#110022" : "#1a4a1a";
  ctx.fillRect(0, 0, 130, 130);
  enemies.getChildren().forEach(function (e) {
    ctx.fillStyle = e.isShadow ? "#8888ff" : "#ff4444";
    ctx.fillRect(e.x * sx - 2, e.y * sy - 2, 4, 4);
  });
  if (boss && boss.active) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(boss.x * sx - 5, boss.y * sy - 5, 10, 10);
  }
  tombstones.forEach(function (ts) {
    if (ts.stone && ts.stone.active) {
      ctx.fillStyle = "#777777";
      ctx.fillRect(ts.stone.x * sx - 2, ts.stone.y * sy - 2, 4, 4);
    }
  });
  Object.values(otherPlayers).forEach(function (op) {
    ctx.fillStyle = "#cc88ff";
    ctx.fillRect(op.sprite.x * sx - 2, op.sprite.y * sy - 2, 5, 5);
  });
  ctx.fillStyle = "#aa00ff";
  ctx.fillRect(24 * tileSize * sx - 3, 24 * tileSize * sy - 3, 6, 6);
  ctx.fillStyle = "#ffaa00";
  ctx.fillRect(4 * tileSize * sx - 3, 4 * tileSize * sy - 3, 6, 6);
  var pc =
    "#" +
    (playerClass ? playerClass.color.toString(16).padStart(6, "0") : "4488ff");
  ctx.fillStyle = pc;
  ctx.beginPath();
  ctx.arc(player.x * sx, player.y * sy, 5, 0, Math.PI * 2);
  ctx.fill();
}

// ================================
// GAME OVER
// ================================
function showGameOver() {
  player.setVelocity(0);
  player.setActive(false);
  gameStarted = false;
  spawnTombstone(player.x, player.y);
  sounds.gameOver();
  setTimeout(function () {
    scene.cameras.main.fade(2000, 0, 0, 0, false, function (cam, progress) {
      if (progress !== 1) return;
      var overlay = document.createElement("div");
      overlay.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0000 0%,#000000 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 1.5s ease;font-family:Arial,sans-serif;color:white;";
      overlay.innerHTML =
        '<div style="text-align:center;max-width:560px;padding:40px;">' +
        '<div style="font-size:90px;margin-bottom:16px;">💀</div>' +
        '<h1 style="font-size:60px;color:#ff2222;letter-spacing:6px;text-shadow:0 0 40px #ff0000;margin-bottom:8px;">GAME OVER</h1>' +
        '<p style="font-size:20px;color:#888;margin-bottom:6px;">' +
        (playerClass ? playerClass.icon : "") +
        " <b>" +
        playerName +
        "</b> — Level " +
        playerLevel +
        "</p>" +
        '<p style="font-size:28px;color:#ffdd44;margin-bottom:36px;">Score: ' +
        score +
        "</p>" +
        '<p style="font-size:14px;color:#444;font-style:italic;margin-bottom:36px;">Your tombstone remains where you fell...</p>' +
        '<div style="display:flex;gap:16px;justify-content:center;">' +
        '<button id="restartBtn" style="padding:14px 36px;font-size:18px;background:linear-gradient(135deg,#aa0000,#dd2222);color:white;border:2px solid #ff4444;border-radius:10px;cursor:pointer;font-family:Arial;">⚔️ Play Again</button>' +
        '<button id="menuBtn" style="padding:14px 36px;font-size:18px;background:#1a1a1a;color:white;border:2px solid #444;border-radius:10px;cursor:pointer;font-family:Arial;">🏠 Main Menu</button>' +
        '</div><p style="margin-top:18px;font-size:12px;color:#333;">Press R to play again</p></div>';
      document.body.appendChild(overlay);
      setTimeout(function () {
        overlay.style.opacity = "1";
      }, 50);

      function restartGame() {
        overlay.style.opacity = "0";
        setTimeout(function () {
          if (overlay.parentNode) document.body.removeChild(overlay);
        }, 1000);
        playerHealth = 100;
        playerMaxHealth = 100;
        playerXP = 0;
        playerLevel = 1;
        playerSpeed = 200;
        playerDamage = 20;
        xpToNextLevel = 100;
        score = 0;
        inventory = [];
        bossSpawned = false;
        currentDimension = 0;
        surviveTimer = 0;
        minions = [];
        wolfPets = [];
        isBerserking = false;
        playerInvisible = false;
        gameStarted = false;
        localStorage.removeItem("pixelRPGSave");
        scene.cameras.main.fadeIn(100);
        scene.scene.restart();
        setTimeout(function () {
          var menu = document.getElementById("startMenu");
          if (menu) menu.style.display = "flex";
        }, 500);
      }

      document.getElementById("restartBtn").onclick = restartGame;
      document.getElementById("menuBtn").onclick = restartGame;
      document.addEventListener("keydown", function onR(e) {
        if (e.key === "r" || e.key === "R") {
          document.removeEventListener("keydown", onR);
          restartGame();
        }
      });
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
  var speed = playerSpeed,
    moving = false;

  if (((shiftKey && shiftKey.isDown) || window.touchSprinting) && stamina > 0) {
    speed *= 1.55;
    stamina = Math.max(0, stamina - 0.8);
  } else {
    stamina = Math.min(maxStamina, stamina + 0.3);
  }
  if (staminaBar) staminaBar.width = 202 * (stamina / maxStamina);

  if (cursors.left.isDown || wasd.left.isDown) {
    player.setVelocityX(-speed);
    playerFacing = -1;
    player.setFlipX(true);
    moving = true;
  } else if (cursors.right.isDown || wasd.right.isDown) {
    player.setVelocityX(speed);
    playerFacing = 1;
    player.setFlipX(false);
    moving = true;
  }
  if (cursors.up.isDown || wasd.up.isDown) {
    player.setVelocityY(-speed);
    moving = true;
  } else if (cursors.down.isDown || wasd.down.isDown) {
    player.setVelocityY(speed);
    moving = true;
  }

  if (
    joystickActive &&
    (Math.abs(joystickDX) > 0.1 || Math.abs(joystickDY) > 0.1)
  ) {
    player.setVelocityX(joystickDX * speed);
    player.setVelocityY(joystickDY * speed);
    if (joystickDX < -0.1) {
      playerFacing = -1;
      player.setFlipX(true);
    } else if (joystickDX > 0.1) {
      playerFacing = 1;
      player.setFlipX(false);
    }
    moving = true;
  }

  if (moving) player.y += Math.sin(Date.now() / 120) * 0.5;
  if (attackIndicator) attackIndicator.setPosition(player.x, player.y);

  if (scene.game.getFrame() % 5 === 0) sendPositionToFirebase();

  updateMinimap();
  if (playerNameText) playerNameText.setPosition(player.x - 40, player.y - 58);

  potions.getChildren().forEach(function (p) {
    if (p.label) p.label.setPosition(p.x - 18, p.y - 28);
  });

  if (boss && boss.active) {
    var bdx = player.x - boss.x,
      bdy = player.y - boss.y,
      bdist = Math.sqrt(bdx * bdx + bdy * bdy);
    if (bdist > 0) {
      boss.setVelocityX((bdx / bdist) * boss.speed);
      boss.setVelocityY((bdy / bdist) * boss.speed);
    }
    boss.rotation += 0.015;
  }

  minions.forEach(function (minion) {
    if (!minion || !minion.active) return;
    var mdx = player.x - minion.x,
      mdy = player.y - minion.y,
      mdist = Math.sqrt(mdx * mdx + mdy * mdy);
    if (mdist > 80 && mdist > 0) {
      minion.setVelocityX((mdx / mdist) * minion.speed);
      minion.setVelocityY((mdy / mdist) * minion.speed);
    } else minion.setVelocity(0);
    if (minion.label) minion.label.setPosition(minion.x, minion.y - 28);
  });

  wolfPets.forEach(function (wolf) {
    if (!wolf || !wolf.active) return;
    var closest = null,
      closestDist = 300;
    enemies.getChildren().forEach(function (e) {
      if (!e || !e.active) return;
      var d = Phaser.Math.Distance.Between(wolf.x, wolf.y, e.x, e.y);
      if (d < closestDist) {
        closestDist = d;
        closest = e;
      }
    });
    if (closest) {
      var wdx = closest.x - wolf.x,
        wdy = closest.y - wolf.y,
        wdist = Math.sqrt(wdx * wdx + wdy * wdy);
      if (wdist > 0) {
        wolf.setVelocityX((wdx / wdist) * wolf.speed);
        wolf.setVelocityY((wdy / wdist) * wolf.speed);
      }
    } else {
      var pdx = player.x - wolf.x,
        pdy = player.y - wolf.y,
        pdist = Math.sqrt(pdx * pdx + pdy * pdy);
      if (pdist > 100 && pdist > 0) {
        wolf.setVelocityX((pdx / pdist) * 150);
        wolf.setVelocityY((pdy / pdist) * 150);
      } else wolf.setVelocity(0);
    }
    if (wolf.label) wolf.label.setPosition(wolf.x, wolf.y - 28);
  });

  enemies.getChildren().forEach(function (enemy) {
    if (!enemy || !enemy.active || enemy.speed === 0) return;
    var dx = player.x - enemy.x,
      dy = player.y - enemy.y,
      dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 280 && dist > 0) {
      enemy.setVelocityX((dx / dist) * enemy.speed);
      enemy.setVelocityY((dy / dist) * enemy.speed);
    } else {
      var pdx2 = (enemy.patrolX || enemy.x) - enemy.x,
        pdy2 = (enemy.patrolY || enemy.y) - enemy.y,
        pdist2 = Math.sqrt(pdx2 * pdx2 + pdy2 * pdy2);
      if (pdist2 > 100 && pdist2 > 0) {
        enemy.setVelocityX((pdx2 / pdist2) * enemy.speed * 0.4);
        enemy.setVelocityY((pdy2 / pdist2) * enemy.speed * 0.4);
      } else if (Math.random() < 0.008) {
        enemy.setVelocityX(Phaser.Math.Between(-40, 40));
        enemy.setVelocityY(Phaser.Math.Between(-40, 40));
      }
    }
    var mSize = enemy.isShadow
      ? (SHADOW_MONSTERS[enemy.monsterType] || SHADOW_MONSTERS.wraith).size ||
        40
      : (MONSTERS[enemy.monsterType] || MONSTERS.goblin).size || 40;
    if (enemy.healthBar) {
      enemy.healthBar.setPosition(enemy.x, enemy.y - 35);
      enemy.healthBar.width = mSize * (enemy.health / enemy.maxHealth);
    }
    if (enemy.nameTag) enemy.nameTag.setPosition(enemy.x, enemy.y - 50);
  });
}
