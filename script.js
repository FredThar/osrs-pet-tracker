// XP tables for Mining levels
const miningXPTable = [
    0, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523, 3973,
    4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648,
    37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886,
    273742, 302288, 333804, 368599, 407015, 449428, 496254, 548821, 607373, 672201, 744683, 825422, 916210, 1019683, 1136678, 1268639, 1415882, 1579027, 1760912, 1962011,
    2185038, 2433453, 2714410, 3029639, 3381276, 3772999, 4208255, 4690409, 5221946, 5808024, 6456751, 7170840, 7944614, 8782069, 9684577, 10654680, 11694886, 12800292, 13971294, 15207895
];

// Mining XP per ore (approximate)
const oreXPValues = {
    copper: 17.5,
    tin: 17.5,
    iron: 35,
    coal: 50,
    gold: 65,
    mithril: 100,
    adamantite: 95,
    runite: 125,
    motherlode: 60, // Average
    amethyst: 240
};

// Mining methods and their ore count per minute (for estimation)
const miningMethods = {
    copper: { name: 'Copper Ore', timePerOre: 3000, xpPerOre: 17.5 },
    tin: { name: 'Tin Ore', timePerOre: 3000, xpPerOre: 17.5 },
    iron: { name: 'Iron Ore', timePerOre: 5000, xpPerOre: 35 },
    coal: { name: 'Coal Ore', timePerOre: 6000, xpPerOre: 50 },
    gold: { name: 'Gold Ore', timePerOre: 7000, xpPerOre: 65 },
    mithril: { name: 'Mithril Ore', timePerOre: 8000, xpPerOre: 100 },
    adamantite: { name: 'Adamantite Ore', timePerOre: 8500, xpPerOre: 95 },
    runite: { name: 'Runite Ore', timePerOre: 10000, xpPerOre: 125 },
    motherlode: { name: 'Motherlode Mine', timePerOre: 5000, xpPerOre: 60 },
    amethyst: { name: 'Amethyst', timePerOre: 8000, xpPerOre: 240 }
};

// Rock Golem drop rate formula: 306,250 / (1 + (level / 25))
function getDropRate(level) {
    const baseRate = 306250;
    const denominator = 1 + (level / 25);
    return baseRate / denominator;
}

// Calculate cumulative chance given number of actions
function getCumulativeChance(actions, dropRate) {
    // Formula: 1 - (1 - 1/rate)^actions
    const probabilityPerAction = 1 / dropRate;
    const cumulativeChance = 1 - Math.pow(1 - probabilityPerAction, actions);
    return cumulativeChance * 100; // Return as percentage
}

// Inverse: Given a cumulative chance %, calculate actions needed
function getActionsNeeded(targetChance, dropRate) {
    // Solve: 1 - (1 - 1/rate)^actions = target
    // (1 - 1/rate)^actions = 1 - target
    // actions = ln(1 - target) / ln(1 - 1/rate)
    
    const targetDecimal = targetChance / 100;
    const probabilityPerAction = 1 / dropRate;
    
    if (targetDecimal >= 0.9999) {
        return Infinity; // Essentially impossible to reach 100%
    }
    
    const actions = Math.log(1 - targetDecimal) / Math.log(1 - probabilityPerAction);
    return Math.ceil(actions);
}

// Get level and experience from total XP
function getLevelFromXP(totalXP) {
    for (let level = 99; level >= 1; level--) {
        if (totalXP >= miningXPTable[level]) {
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

// Update stats when inputs change
function updateStats() {
    const level = parseInt(document.getElementById('currentLevel').value) || 1;
    const currentXP = parseInt(document.getElementById('currentXP').value) || 0;
    
    const dropRate = getDropRate(level);
    const actionsMined = Math.floor(currentXP / oreXPValues[document.getElementById('miningMethod').value]);
    const cumulativeChance = getCumulativeChance(actionsMined, dropRate);
    
    document.getElementById('dropRate').textContent = `1 in ${formatNumber(dropRate)}`;
    document.getElementById('cumulativeChance').textContent = cumulativeChance.toFixed(2) + '%';
    document.getElementById('actionsMined').textContent = formatNumber(actionsMined);
}

// Calculate goal projection
function calculateGoal() {
    const level = parseInt(document.getElementById('currentLevel').value) || 1;
    const currentXP = parseInt(document.getElementById('currentXP').value) || 0;
    const goalChance = parseFloat(document.getElementById('goalChance').value) || 95;
    const method = document.getElementById('miningMethod').value;
    
    const dropRate = getDropRate(level);
    const xpPerOre = oreXPValues[method];
    const actionsMined = Math.floor(currentXP / xpPerOre);
    const currentChance = getCumulativeChance(actionsMined, dropRate);
    
    // Calculate actions needed for goal
    const actionsNeededForGoal = getActionsNeeded(goalChance, dropRate);
    const additionalActionsNeeded = Math.max(0, actionsNeededForGoal - actionsMined);
    const additionalXPNeeded = additionalActionsNeeded * xpPerOre;
    const finalXP = currentXP + additionalXPNeeded;
    const finalLevel = getLevelFromXP(finalXP);
    
    // Display results
    document.getElementById('resultCurrentChance').textContent = currentChance.toFixed(2) + '%';
    document.getElementById('resultGoalChance').textContent = goalChance.toFixed(2) + '%';
    document.getElementById('resultActionsNeeded').textContent = formatNumber(additionalActionsNeeded);
    document.getElementById('resultXPNeeded').textContent = formatNumber(additionalXPNeeded);
    document.getElementById('resultResourcesNeeded').textContent = formatNumber(additionalActionsNeeded) + ' ' + miningMethods[method].name;
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
document.getElementById('currentLevel').addEventListener('input', updateStats);
document.getElementById('currentXP').addEventListener('input', updateStats);
document.getElementById('miningMethod').addEventListener('change', updateStats);
document.getElementById('calculateBtn').addEventListener('click', calculateGoal);

// Initialize on page load
updateStats();