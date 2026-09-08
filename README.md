# OSRS Pet Tracker

A comprehensive tracker for Old School RuneScape (OSRS) skilling pets that calculates your cumulative chance and projects how far you need to go to reach your goal.

## Features

✨ **Multi-Pet Support**
- Track Rock Golem (Mining), Heron (Fishing), or Giant Squirrel (Agility)
- Switch between pets instantly
- Each pet has its own drop rate formula and training methods

✨ **Current Status Tracking**
- Input your current level and XP
- Optionally input your actions mined or cumulative chance directly
- Select your training method
- View your current drop rate and cumulative chance
- See how many actions you've completed

📊 **Goal Projection**
- Set a target cumulative chance (e.g., 95%)
- Get precise calculations for:
  - Actions needed to reach your goal
  - XP required
  - Resources needed
  - Estimated new level
  - Final XP total

📈 **Visual Progress**
- Progress bar showing how close you are to your goal
- Real-time updates as you change inputs
- Clear breakdown of your current vs. target chance

## How to Use

### Web App

1. Open `index.html` in your browser (or access via GitHub Pages)
2. Select the pet you want to track from the dropdown
3. Enter your current level
4. Input your current XP (optional)
5. Select your training method from the dropdown
6. (Optional) Input your actions mined or cumulative chance directly
7. View your current stats
8. Set your target cumulative chance percentage
9. Click "Calculate" to see your projection

## Supported Pets

### Rock Golem (Mining)
- **Drop Rate Formula**: `306,250 / (1 + (Level / 25))`
- **Level 1**: 1 in 306,250
- **Level 99**: 1 in ~136,744
- **Methods**: Copper, Tin, Iron, Coal, Gold, Mithril, Adamantite, Runite, Motherlode, Amethyst

### Heron (Fishing)
- **Drop Rate Formula**: `500,000 / (1 + (Level / 50))`
- **Level 1**: 1 in 500,000
- **Level 99**: 1 in ~333,333
- **Methods**: Shrimp, Anchovies, Sardines, Herring, Mackerel, Trout, Salmon, Tuna, Lobster, Swordfish

### Giant Squirrel (Agility)
- **Drop Rate Formula**: `750,000 / (1 + (Level / 75))`
- **Level 1**: 1 in 750,000
- **Level 99**: 1 in ~500,000
- **Methods**: Gnome Stronghold, Wilderness, Ape Atoll, Falador, Barbarian, Penguin, Seers', Pollnivneach, Rellekka, Ardougne

## Calculation Details

### What is "Cumulative Chance"?

Cumulative chance is the probability that you've received **at least one** pet by the time you've completed N actions.

**Example:**
- Drop rate: 1 in 200,000
- After 100,000 actions: ~39.3% cumulative chance
- After 200,000 actions: ~63.2% cumulative chance
- After 300,000 actions: ~77.9% cumulative chance

### Cumulative Chance Formula

```
Cumulative Chance = 1 - (1 - 1/DropRate)^Actions
```

### Action vs XP

The tracker uses **actions** (number of resources obtained), not XP, for probability calculations. Each action gives you one independent roll for the pet, regardless of how much XP it grants.

The tracker converts your XP to actions based on your selected method's XP per action.

### Inputting Your Own Values

You can optionally input:
- **Actions Mined**: Direct number of actions completed (overrides XP calculation)
- **Cumulative Chance %**: Your current chance percentage (if you're tracking from external sources)

## Files

- `index.html` - Main web app interface
- `styles.css` - Styling and responsive design
- `script.js` - All calculations and logic
- `README.md` - This file

## Important Notes

⚠️ **Accuracy Disclaimer:**
- Calculations are based on drop rates from the OSRS Wiki
- Actual results may vary due to randomness
- The tracker assumes you're actively training (not timing out)
- Different methods may have slight variations in rates

## Data Source

All drop rates and game mechanics are sourced from:
- [OSRS Wiki](https://oldschool.runescape.wiki/)

## Future Features

- Historical tracking (log your progress over time)
- XP/hour calculations
- Time estimates based on training rates
- Export/share results
- Additional pets as support expands

## License

This project is open source and available under the MIT License.

---

Good luck getting your pet! 🎯✨
