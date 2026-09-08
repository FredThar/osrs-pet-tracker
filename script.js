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
    if (actions === 0) return 0;
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
    const petSelect = document.getElementById('petSelect');
    const methodSelect = document.getElementById('methodSelect');
    
    if (!petSelect) {
        console.error('petSelect element not found');
        return;
    }
    
    if (!methodSelect) {
        console.error('methodSelect element not found');
        return;
    }
    
    const petKey = petSelect.value;
    const pet = pets[petKey];
    
    if (!pet) {
        console.error('Pet not found for key:', petKey);
        return;
    }
    
    // Clear existing options
    methodSelect.innerHTML = '';
    
    // Add new options
    pet.methods.forEach(method => {
        if (!methodData[method]) {
            console.warn('Method data not found for:', method);
            return;
        }
        
        const option = document.createElement('option');
        option.value = method;
        option.textContent = methodData[method].name;
        methodSelect.appendChild(option);
    });
    
    updateStats();
}

// Update stats when inputs change
function updateStats() {
    const petSelect = document.getElementById('petSelect');
    const methodSelect = document.getElementById('methodSelect');
    const currentLevel = document.getElementById('currentLevel');
    const currentXP = document.getElementById('currentXP');
    const inputActions = document.getElementById('inputActions');
    const inputChance = document.getElementById('inputChance');
    
    if (!petSelect || !methodSelect || !currentLevel || !currentXP || !inputActions || !inputChance) {
        console.error('Some form elements not found');
        return;
    }
    
    const petKey = petSelect.value;
    const pet = pets[petKey];
    if (!pet) return;
    
    const level = parseInt(currentLevel.value) || 1;
    const xp = parseInt(currentXP.value) || 0;
    const actions = parseInt(inputActions.value) || 0;
    const chance = parseFloat(inputChance.value) || 0;
    
    const method = methodSelect.value;
    if (!methodData[method]) {
        console.warn('Method data not found for:', method);
        return;
    }
    
    const xpPerAction = methodData[method].xpPerAction;
    const dropRate = pet.formula(level);
    
    // Determine actions: prioritize input actions, then calculate from XP
    let actionsMined = actions > 0 ? actions : Math.floor(xp / xpPerAction);
    let cumulativeChance;
    
    // Determine cumulative chance: prioritize input chance, then calculate from actions
    if (chance > 0) {
        cumulativeChance = chance;
    } else {
        cumulativeChance = getCumulativeChance(actionsMined, dropRate);
    }
    
    const dropRateEl = document.getElementById('dropRate');
    const cumulativeChanceEl = document.getElementById('cumulativeChance');
    const displayActionsEl = document.getElementById('displayActions');
    
    if (dropRateEl) dropRateEl.textContent = `1 in ${formatNumber(dropRate)}`;
    if (cumulativeChanceEl) cumulativeChanceEl.textContent = cumulativeChance.toFixed(2) + '%';
    if (displayActionsEl) displayActionsEl.textContent = formatNumber(actionsMined);
}

// Calculate goal projection
function calculateGoal() {
    const petSelect = document.getElementById('petSelect');
    const methodSelect = document.getElementById('methodSelect');
    const currentLevel = document.getElementById('currentLevel');
    const currentXP = document.getElementById('currentXP');
    const inputActions = document.getElementById('inputActions');
    const inputChance = document.getElementById('inputChance');
    const goalChance = document.getElementById('goalChance');
    
    if (!petSelect || !methodSelect || !currentLevel || !currentXP || !inputActions || !inputChance || !goalChance) {
        console.error('Some elements not found in calculateGoal');
        return;
    }
    
    const petKey = petSelect.value;
    const pet = pets[petKey];
    if (!pet) return;
    
    const level = parseInt(currentLevel.value) || 1;
    const xp = parseInt(currentXP.value) || 0;
    const actions = parseInt(inputActions.value) || 0;
    const chance = parseFloat(inputChance.value) || 0;
    const goal = parseFloat(goalChance.value) || 95;
    const method = methodSelect.value;
    
    if (!methodData[method]) {
        console.warn('Method data not found for:', method);
        return;
    }
    
    const xpPerAction = methodData[method].xpPerAction;
    const dropRate = pet.formula(level);
    
    // Determine starting actions
    let actionsMined = actions > 0 ? actions : Math.floor(xp / xpPerAction);
    
    // Determine starting chance
    let currentChance;
    if (chance > 0) {
        currentChance = chance;
        if (actions === 0) {
            actionsMined = getActionsNeeded(chance, dropRate);
        }
    } else {
        currentChance = getCumulativeChance(actionsMined, dropRate);
    }
    
    // Calculate actions needed for goal
    const actionsNeededForGoal = getActionsNeeded(goal, dropRate);
    const additionalActionsNeeded = Math.max(0, actionsNeededForGoal - actionsMined);
    const additionalXPNeeded = additionalActionsNeeded * xpPerAction;
    const finalXP = xp + additionalXPNeeded;
    const finalLevel = getLevelFromXP(finalXP);
    
    // Display results
    document.getElementById('resultCurrentChance').textContent = currentChance.toFixed(2) + '%';
    document.getElementById('resultGoalChance').textContent = goal.toFixed(2) + '%';
    document.getElementById('resultActionsNeeded').textContent = formatNumber(additionalActionsNeeded);
    document.getElementById('resultXPNeeded').textContent = formatNumber(additionalXPNeeded);
    document.getElementById('resultResourcesNeeded').textContent = formatNumber(additionalActionsNeeded) + ' ' + methodData[method].name;
    document.getElementById('resultNewLevel').textContent = finalLevel;
    document.getElementById('resultFinalXP').textContent = formatNumber(finalXP);
    
    // Update progress bar
    const progressPercent = (currentChance / goal) * 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = Math.min(progressPercent, 100) + '%';
    
    document.getElementById('currentChanceLabel').textContent = currentChance.toFixed(2) + '%';
    document.getElementById('goalChanceLabel').textContent = goal.toFixed(2) + '%';
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('Initializing app...');
    
    const petSelect = document.getElementById('petSelect');
    const currentLevel = document.getElementById('currentLevel');
    const currentXP = document.getElementById('currentXP');
    const inputActions = document.getElementById('inputActions');
    const inputChance = document.getElementById('inputChance');
    const methodSelect = document.getElementById('methodSelect');
    const calculateBtn = document.getElementById('calculateBtn');
    
    // Add event listeners
    if (petSelect) petSelect.addEventListener('change', updatePetSelection);
    if (currentLevel) currentLevel.addEventListener('input', updateStats);
    if (currentXP) currentXP.addEventListener('input', updateStats);
    if (inputActions) inputActions.addEventListener('input', updateStats);
    if (inputChance) inputChance.addEventListener('input', updateStats);
    if (methodSelect) methodSelect.addEventListener('change', updateStats);
    if (calculateBtn) calculateBtn.addEventListener('click', calculateGoal);
    
    // Initialize dropdown with first pet
    updatePetSelection();
    
    console.log('App initialized successfully');
}
