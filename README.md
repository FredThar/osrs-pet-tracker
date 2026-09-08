# OSRS Pet Tracker

A comprehensive tracker for Old School RuneScape (OSRS) skilling pets that calculates your cumulative chance and projects how far you need to go to reach your goal.

## Features

✨ **Current Status Tracking**
- Input your current Mining level and XP
- Select your mining method
- View your current drop rate and cumulative chance
- See how many actions you've completed

📊 **Goal Projection**
- Set a target cumulative chance (e.g., 95%)
- Get precise calculations for:
  - Actions needed to reach your goal
  - XP required
  - Resources needed (ores, etc.)
  - Estimated new level
  - Final XP total

📈 **Visual Progress**
- Progress bar showing how close you are to your goal
- Real-time updates as you change inputs
- Clear breakdown of your current vs. target chance

## How to Use

### Web App

1. Open `index.html` in your browser (or access via GitHub Pages)
2. Enter your current Mining level
3. Input your current XP (optional - defaults to 0)
4. Select your mining method from the dropdown
5. View your current cumulative chance and drop rate
6. Set your target cumulative chance percentage
7. Click "Calculate" to see your projection

### Drop Rate Formula

The Rock Golem pet drop rate is calculated using the OSRS formula:

```
Drop Rate = 306,250 / (1 + (Mining Level / 25))
```

This means:
- **Level 1**: 1 in 306,250
- **Level 99**: 1 in ~136,744

### Cumulative Chance Formula

The cumulative chance after N actions is:

```
Cumulative Chance = 1 - (1 - 1/DropRate)^Actions
```

This accounts for the probability that you've received at least one pet by the time you've completed N mining actions.

## Supported Mining Methods

- Copper Ore (17.5 XP each)
- Tin Ore (17.5 XP each)
- Iron Ore (35 XP each)
- Coal Ore (50 XP each)
- Gold Ore (65 XP each)
- Mithril Ore (100 XP each)
- Adamantite Ore (95 XP each)
- Runite Ore (125 XP each)
- Motherlode Mine (60 XP average)
- Amethyst (240 XP each)

## Google Sheets Version

A Google Sheets version is also available for offline use and easy sharing. The spreadsheet includes:
- Automatic calculations based on your inputs
- Drop rate scaling by level
- Cumulative chance calculations
- Goal projections

[Link to Google Sheets](#) *(To be added)*

## Files

- `index.html` - Main web app interface
- `styles.css` - Styling and responsive design
- `script.js` - All calculations and logic
- `README.md` - This file

## Calculation Details

### What is "Cumulative Chance"?

Cumulative chance is the probability that you've received **at least one** Rock Golem pet by the time you've completed N mining actions.

**Example:**
- Drop rate: 1 in 200,000
- After 100,000 actions: ~39.3% cumulative chance
- After 200,000 actions: ~63.2% cumulative chance
- After 300,000 actions: ~77.9% cumulative chance

### How it's Different from XP

This tracker uses **actions** (number of ores mined), not XP, for probability calculations. Each action gives you one independent roll for the pet, regardless of how much XP it grants.

The tracker converts your XP to actions based on your selected mining method's XP per ore.

## Important Notes

⚠️ **Accuracy Disclaimer:**
- Calculations are based on drop rates from the OSRS Wiki
- Actual results may vary due to randomness
- The tracker assumes you're actively mining (not AFK timing out)
- Different methods may have slight variations in rates

## Data Source

All drop rates and game mechanics are sourced from:
- [OSRS Wiki - Rock Golem](https://oldschool.runescape.wiki/w/Rock_golem)

## Future Features

- Support for additional pets (Heron, Giant Squirrel, etc.)
- Historical tracking (log your progress over time)
- XP/hour calculations
- Time estimates based on mining rates
- Export/share results

## License

This project is open source and available under the MIT License.

---

Good luck getting your pet! 🪨✨
