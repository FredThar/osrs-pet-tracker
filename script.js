// Pet data with drop rates and formulas
const pets = {
    rockGolem: {
        name: 'Rock Golem',
        skill: 'Mining',
        baseRate: 306250,
        formula: (level) => 306250 / (1 + (level / 25)),
        methods: ['copper', 'tin', 'iron', 'coal', 'gold', 'mithril', 'adamantite', 'runite', 'motherlode', 'amethyst']
    },
    heron: {
        name: 'Heron',
        skill: 'Fishing',
        baseRate: 500000,
        formula: (level) => 500000 / (1 + (level / 50)),
        methods: ['shrimp', 'anchovies', 'sardines', 'herring', 'mackerel', 'trout', 'salmon', 'tuna', 'lobster', 'swordfish']
    },
    squirrel: {
        name: 'Giant Squirrel',
        skill: 'Agility',
        baseRate: 750000,
        formula: (level) => 750000 / (1 + (level / 75)),
        methods: ['gnomeStronghold', 'wildernessCourse', 'apeAtoll', 'falador', 'barbarian', 'penguin', 'seers', 'pollnivneach', 'rellekka', 'ardougne']
    }
};

// XP tables for skills
const skillXPTable = [
    0, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973,
    4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648,
    37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886,
    273742, 302288, 333804, 368599, 407015, 449428, 496254, 548821, 607373, 672201, 744683, 825422, 916210, 1019683, 1136678, 1268639, 1415882, 1579027, 1760912, 1962011,
    2185038, 2433453, 2714410, 3029639, 3381276, 3772999, 4208255, 4690409, 5221946, 5808024, 6456751, 7170840, 7944614, 8782069, 9684577, 10654680, 11694886, 12800292, 13971294, 15207895
];

// Action types per pet/method
const methodData = {
    // Mining
    copper: { name: 'Copper Ore', xpPerAction: 17.5 },
    tin: { name: 'Tin Ore', xpPerAction: 17.5 },
    iron: { name: 'Iron Ore', xpPerAction: 35 },
    coal: { name: 'Coal Ore', xpPerAction: 50 },
    gold: { name: 'Gold Ore', xpPerAction: 65 },
    mithril: { name: 'Mithril Ore', xpPerAction: 100 },
    adamantite: { name: 'Adamantite Ore', xpPerAction: 95 },
    runite: { name: 'Runite Ore', xpPerAction: 125 },
    motherlode: { name: 'Motherlode Mine', xpPerAction: 60 },
    amethyst: { name: 'Amethyst', xpPerAction: 240 },
    // Fishing
    shrimp: { name: 'Shrimp', xpPerAction: 10 },
    anchovies: { name: 'Anchovies', xpPerAction: 10 },
    sardines: { name: 'Sardines', xpPerAction: 20 },
    herring: { name: 'Herring', xpPerAction: 30 },
    mackerel: { name: 'Mackerel', xpPerAction: 40 },
    trout: { name: 'Trout', xpPerAction: 50 },
    salmon: { name: 'Salmon', xpPerAction: 70 },
    tuna: { name: 'Tuna', xpPerAction: 80 },
    lobster: { name: 'Lobster', xpPerAction: 90 },
    swordfish: { name: 'Swordfish', xpPerAction: 100 },
    // Agility
    gnomeStronghold: { name: 'Gnome Stronghold', xpPerAction: 86.5 },
    wildernessCourse: { name: 'Wilderness Course', xpPerAction: 571.4 },
    apeAtoll: { name: 'Ape Atoll', xpPerAction: 580 },
    falador: { name: 'Falador Course', xpPerAction: 235 },
    barbarian: { name: 'Barbarian Outpost', xpPerAction: 246.6 },
    penguin: { name: 'Penguin Course', xpPerAction: 722 },
    seers: { name: 'Seers\' Village', xpPerAction: 570 },
    pollnivneach: { name: 'Pollnivneach', xpPerAction: 463 },
    rellekka: { name: 'Rellekka', xpPerAction: 1114 },
    ardougne: { name: 'Ardougne Course', xpPerAction: 793.5 }
};

// Calculate cumulative chance given number of actions
function getCumulativeChance(actions, dropRate) {
    const probabilityPerAction = 1 / dropRate;
    const cumulativeChance = 1 - Math.pow(1 - probabilityPerAction, actions);
    return cumulativeChance * 100;
}

// Inverse: Given a cumulative chance %, calculate actions needed
function getActionsNeeded(targetChance, dropRate) {
    const targetDecimal = targetChance / 100;
    const probabilityPerAction = 1 / dropRate;
    
    if (targetDecimal >= 0.9999) {
        return Infinity;
    }
    
    const actions = Math.log(1 - targetDecimal) / Math.log(1 - probabilityPerAction);
    return Math.ceil(actions);
}

// Get level from total XP
function getLevelFromXP(totalXP) {
    for (let level = 99; level >= 1; level--) {
        if (totalXP >= skillXPTable[level]) {
            return level;
        }
    }
    return 1;
}

// Format numbers with commas
function formatNumber(num) {
    if (num === Infinity) return '∞';
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Update pet selection and methods
function updatePetSelection() {
    const petKey = document.getElementById('petSelect').value;
    const pet = pets[petKey];
    
    // Update methods dropdown
    const methodSelect = document.getElementById('methodSelect');
    methodSelect.innerHTML = '';
    
    pet.methods.forEach(method => {
        const option = document.createElement('option');
        option.value = method;
        option.textContent = methodData[method].name;
        methodSelect.appendChild(option);
    });
    
    updateStats();
}

// Update stats when inputs change
function updateStats() {
    const petKey = document.getElementById('petSelect').value;
    const pet = pets[petKey];
    const level = parseInt(document.getElementById('currentLevel').value) || 1;
    const currentXP = parseInt(document.getElementById('currentXP').value) || 0;
    const inputActions = parseInt(document.getElementById('inputActions').value) || 0;
    const inputChance = parseFloat(document.getElementById('inputChance').value) || 0;
    
    const method = document.getElementById('methodSelect').value;
    const xpPerAction = methodData[method].xpPerAction;
    
    const dropRate = pet.formula(level);
    
    // Determine actions: prioritize input actions, then calculate from XP
    let actionsMined = inputActions > 0 ? inputActions : Math.floor(currentXP / xpPerAction);
    let cumulativeChance;
    
    // Determine cumulative chance: prioritize input chance, then calculate from actions
    if (inputChance > 0) {
        cumulativeChance = inputChance;
    } else {
        cumulativeChance = getCumulativeChance(actionsMined, dropRate);
    }
    
    document.getElementById('dropRate').textContent = `1 in ${formatNumber(dropRate)}`;
    document.getElementById('cumulativeChance').textContent = cumulativeChance.toFixed(2) + '%';
    document.getElementById('displayActions').textContent = formatNumber(actionsMined);
}

// Calculate goal projection
function calculateGoal() {
    const petKey = document.getElementById('petSelect').value;
    const pet = pets[petKey];
    const level = parseInt(document.getElementById('currentLevel').value) || 1;
    const currentXP = parseInt(document.getElementById('currentXP').value) || 0;
    const inputActions = parseInt(document.getElementById('inputActions').value) || 0;
    const inputChance = parseFloat(document.getElementById('inputChance').value) || 0;
    const goalChance = parseFloat(document.getElementById('goalChance').value) || 95;
    const method = document.getElementById('methodSelect').value;
    
    const xpPerAction = methodData[method].xpPerAction;
    const dropRate = pet.formula(level);
    
    // Determine starting actions
    let actionsMined = inputActions > 0 ? inputActions : Math.floor(currentXP / xpPerAction);
    
    // Determine starting chance
    let currentChance;
    if (inputChance > 0) {
        currentChance = inputChance;
        // Calculate actions from chance if not provided
        if (inputActions === 0) {
            actionsMined = getActionsNeeded(inputChance, dropRate);
        }
    } else {
        currentChance = getCumulativeChance(actionsMined, dropRate);
    }
    
    // Calculate actions needed for goal
    const actionsNeededForGoal = getActionsNeeded(goalChance, dropRate);
    const additionalActionsNeeded = Math.max(0, actionsNeededForGoal - actionsMined);
    const additionalXPNeeded = additionalActionsNeeded * xpPerAction;
    const finalXP = currentXP + additionalXPNeeded;
    const finalLevel = getLevelFromXP(finalXP);
    
    // Display results
    document.getElementById('resultCurrentChance').textContent = currentChance.toFixed(2) + '%';
    document.getElementById('resultGoalChance').textContent = goalChance.toFixed(2) + '%';
    document.getElementById('resultActionsNeeded').textContent = formatNumber(additionalActionsNeeded);
    document.getElementById('resultXPNeeded').textContent = formatNumber(additionalXPNeeded);
    document.getElementById('resultResourcesNeeded').textContent = formatNumber(additionalActionsNeeded) + ' ' + methodData[method].name;
    document.getElementById('resultNewLevel').textContent = finalLevel;
    document.getElementById('resultFinalXP').textContent = formatNumber(finalXP);
    
    // Update progress bar
    const progressPercent = (currentChance / goalChance) * 100;
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = Math.min(progressPercent, 100) + '%';
    
    document.getElementById('currentChanceLabel').textContent = currentChance.toFixed(2) + '%';
    document.getElementById('goalChanceLabel').textContent = goalChance.toFixed(2) + '%';
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
}

// Event listeners
document.getElementById('petSelect').addEventListener('change', updatePetSelection);
document.getElementById('currentLevel').addEventListener('input', updateStats);
document.getElementById('currentXP').addEventListener('input', updateStats);
document.getElementById('inputActions').addEventListener('input', updateStats);
document.getElementById('inputChance').addEventListener('input', updateStats);
document.getElementById('methodSelect').addEventListener('change', updateStats);
document.getElementById('calculateBtn').addEventListener('click', calculateGoal);

// Initialize on page load
updatePetSelection();
