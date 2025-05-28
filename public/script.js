const characterDiceRolls = {
    "Donkey Kong": [5, 0, 0, 0, 10, 10],
    "Bowser": [-3, -3, 1, 8, 9, 10],
    "Boo": [-2, -2, 5, 5, 7, 7],
    "Wario": [6, 6, 6, 6, -2, -2],
    "Peach": [0, 2, 4, 4, 4, 6],
    "Daisy": [3, 3, 3, 3, 4, 4],
    "Dry Bones": [1, 1, 1, 6, 6, 6],
    "Pom Pom": [0, 3, 3, 3, 3, 8],
    "Mario": [1, 3, 3, 3, 5, 6],
    "Luigi": [1, 1, 1, 5, 6, 7],
    "Waluigi": [-3, 1, 3, 5, 5, 7],
    "Goomba": [2, 2, 3, 4, 5, 6],
    "Bowser Jr.": [1, 1, 1, 4, 4, 9],
    "Rosalina": [2, 2, 2, 3, 4, 8],
    "Diddy Kong": [0, 0, 0, 7, 7, 7],
    "Monty Mole": [1, 2, 3, 4, 5, 6],
    "Shy Guy": [0, 4, 4, 4, 4, 4],
    "Yoshi": [0, 1, 3, 3, 5, 7],
    "Hammer Bro": [3, 1, 1, 5, 5, 5],
    "Koopa": [1, 1, 2, 3, 3, 10]
};

let selectedCharacter = null;
let histogramChart = null;

// Initialize the character grid
function initializeCharacterGrid() {
    const grid = document.getElementById('character-grid');
    Object.keys(characterDiceRolls).forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.textContent = character;
        card.onclick = () => selectCharacter(character);
        grid.appendChild(card);
    });
}

// Function to highlight the character selection area
function highlightCharacterSelection() {
    const characterSelect = document.querySelector('.character-select h2');
    characterSelect.classList.add('highlight-select');
}

// Function to remove the highlight
function removeHighlight() {
    const characterSelect = document.querySelector('.character-select h2');
    characterSelect.classList.remove('highlight-select');
}

// Select a character and update the display
function selectCharacter(character) {
    selectedCharacter = character;
    
    // Update character card selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.toggle('selected', card.textContent === character);
    });

    // Update dice display
    const diceValues = characterDiceRolls[character];
    const diceContainer = document.getElementById('dice-values');
    diceContainer.innerHTML = '';
    diceValues.forEach(value => {
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.textContent = value;
        diceContainer.appendChild(dice);
    });

    // Update statistics
    updateStatistics(character);

    // Remove highlight after selection
    removeHighlight();

    // Reset to 'Add Current Roll' button
    resetToOriginalButton();
}

// Calculate and display statistics
function updateStatistics(character) {
    const rolls = characterDiceRolls[character];
    const adjustedRolls = rolls.map(roll => roll > 0 ? roll : 0);
    
    const stats = {
        '📊 Expected Value': (adjustedRolls.reduce((a, b) => a + b, 0) / adjustedRolls.length).toFixed(2),
        '📈 Variance': calculateVariance(adjustedRolls).toFixed(2),
        '📏 Standard Deviation': Math.sqrt(calculateVariance(adjustedRolls)).toFixed(2),
        '🎯 Median': calculateMedian(adjustedRolls),
        '🔢 Mode': calculateMode(adjustedRolls),
        '✅ Prob. Roll ≥ 4': (calculateProbabilityAtLeast(adjustedRolls, 4) * 100).toFixed(1) + '%',
        '⚠️ Prob. Roll ≤ 2': (calculateProbabilityAtMost(adjustedRolls, 2) * 100).toFixed(1) + '%'
    };

    const statsContainer = document.getElementById('stats-values');
    statsContainer.innerHTML = '';
    Object.entries(stats).forEach(([label, value]) => {
        const statRow = document.createElement('div');
        statRow.className = 'stat-row';
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'stat-label';
        labelDiv.textContent = label + ':';
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'stat-value';
        valueDiv.textContent = value;
        
        statRow.appendChild(labelDiv);
        statRow.appendChild(valueDiv);
        statsContainer.appendChild(statRow);
    });
}

// Statistical calculation functions
function calculateVariance(rolls) {
    const mean = rolls.reduce((a, b) => a + b, 0) / rolls.length;
    return rolls.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rolls.length;
}

function calculateMedian(rolls) {
    const sorted = [...rolls].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);
}

function calculateMode(rolls) {
    const counts = {};
    rolls.forEach(roll => counts[roll] = (counts[roll] || 0) + 1);
    const maxCount = Math.max(...Object.values(counts));
    const modes = Object.entries(counts)
        .filter(([_, count]) => count === maxCount)
        .map(([value, _]) => value);
    return modes.length === rolls.length ? "None" : modes.join(", ");
}

function calculateProbabilityAtLeast(rolls, x) {
    return rolls.filter(roll => roll >= x).length / rolls.length;
}

function calculateProbabilityAtMost(rolls, x) {
    return rolls.filter(roll => roll <= x).length / rolls.length;
}

// Simulation functions
function simulateRolls(numRolls) {
    if (!selectedCharacter) {
        showCustomPopup('Please select a character first!');
        return;
    }
    
    const rolls = characterDiceRolls[selectedCharacter];
    const results = Array(numRolls).fill(0).map(() => {
        return rolls[Math.floor(Math.random() * rolls.length)];
    });
    
    updateHistogram(results);
}

function updateHistogram(results) {
    const ctx = document.getElementById('histogram').getContext('2d');
    
    if (histogramChart) {
        histogramChart.destroy();
    }

    const counts = {};
    results.forEach(result => {
        counts[result] = (counts[result] || 0) + 1;
    });

    const labels = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
    const data = labels.map(label => counts[label]);

    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequency',
                data: data,
                backgroundColor: labels.map(label => {
                    const value = parseInt(label);
                    if (value < 0) return 'rgba(230, 0, 18, 0.6)'; // Red for negative
                    if (value === 0) return 'rgba(109, 117, 125, 0.6)'; // Gray for zero
                    if (value <= 3) return 'rgba(251, 208, 0, 0.6)'; // Yellow for low
                    if (value <= 6) return 'rgba(4, 156, 219, 0.6)'; // Blue for medium
                    return 'rgba(67, 176, 71, 0.6)'; // Green for high
                }),
                borderColor: labels.map(label => {
                    const value = parseInt(label);
                    if (value < 0) return 'rgba(230, 0, 18, 1)';
                    if (value === 0) return 'rgba(109, 117, 125, 1)';
                    if (value <= 3) return 'rgba(251, 208, 0, 1)';
                    if (value <= 6) return 'rgba(4, 156, 219, 1)';
                    return 'rgba(67, 176, 71, 1)';
                }),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Roll Value',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Dice Roll Distribution',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const percentage = ((value / results.length) * 100).toFixed(1);
                            return `Count: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Game tracking state
let gameRolls = [];

// Track a new roll
function addGameRoll() {
    if (!selectedCharacter) {
        showCustomPopup('Please select a character first!');
        return;
    }

    const currentRolls = characterDiceRolls[selectedCharacter];
    const trackerControls = document.querySelector('.tracker-controls');

    // Remove existing dice button container if it exists
    const existingContainer = document.querySelector('.dice-button-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create a container for the dice buttons
    const diceButtonContainer = document.createElement('div');
    diceButtonContainer.className = 'dice-button-container';

    currentRolls.forEach(roll => {
        const button = document.createElement('button');
        button.className = 'dice-roll-button';
        button.textContent = roll;
        button.onclick = () => {
            gameRolls.push(roll);
            updateGameStats();
            diceButtonContainer.remove(); // Remove the dice buttons after selection
        };
        diceButtonContainer.appendChild(button);
    });

    // Insert the dice buttons container after the tracker controls
    trackerControls.insertAdjacentElement('afterend', diceButtonContainer);
}

// Reset game tracking
function resetGameTracker() {
    gameRolls = [];
    updateGameStats();

    // Remove dice button container if it exists
    const existingDiceButtonContainer = document.querySelector('.dice-button-container');
    if (existingDiceButtonContainer) {
        existingDiceButtonContainer.remove();
    }
}

// Update game statistics
function updateGameStats() {
    const luckStats = document.getElementById('luck-stats');
    const rollHistory = document.getElementById('roll-history');
    
    // Clear previous stats
    luckStats.innerHTML = '';
    rollHistory.innerHTML = '';

    if (gameRolls.length === 0) {
        luckStats.innerHTML = '<div class="stat-label">No rolls yet</div>';
        return;
    }

    // Calculate statistics
    const adjustedRolls = gameRolls.map(roll => roll > 0 ? roll : 0);
    const sum = adjustedRolls.reduce((a, b) => a + b, 0);
    const average = sum / adjustedRolls.length;
    
    // Calculate expected value for comparison
    const currentRolls = characterDiceRolls[selectedCharacter];
    const adjustedCurrentRolls = currentRolls.map(roll => roll > 0 ? roll : 0);
    const expectedValue = adjustedCurrentRolls.reduce((a, b) => a + b, 0) / adjustedCurrentRolls.length;
    
    // Calculate luck percentage (how far from expected value)
    const luckPercentage = ((average - expectedValue) / expectedValue * 100).toFixed(1);
    const isLucky = average > expectedValue;

    // Calculate total movement
    const totalMovement = adjustedRolls.reduce((a, b) => a + b, 0);

    // Display luck statistics
    const stats = {
        'Total Rolls': gameRolls.length,
        'Average Roll': average.toFixed(2),
        'Expected Value': expectedValue.toFixed(2),
        'Luck Rating': `${isLucky ? '+' : ''}${luckPercentage}%`,
        'Highest Roll': Math.max(...adjustedRolls),
        'Lowest Roll': Math.min(...gameRolls),
        'Total Movement': totalMovement
    };

    Object.entries(stats).forEach(([label, value]) => {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'stat-label';
        labelDiv.textContent = label + ':';
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'stat-value';
        if (label === 'Luck Rating') {
            valueDiv.classList.add(isLucky ? 'lucky' : 'unlucky');
        }
        valueDiv.textContent = value;
        
        luckStats.appendChild(labelDiv);
        luckStats.appendChild(valueDiv);
    });

    // Display roll history (most recent first)
    [...gameRolls].reverse().forEach((roll, index) => {
        const entry = document.createElement('div');
        entry.className = 'roll-entry';
        const actualRoll = roll > 0 ? roll : 0;
        const variance = actualRoll - expectedValue;
        const isGoodRoll = variance > 0;
        
        entry.innerHTML = `
            <span>Roll #${gameRolls.length - index}: ${roll}</span>
            <span class="${isGoodRoll ? 'lucky' : 'unlucky'}">
                (${isGoodRoll ? '+' : ''}${variance.toFixed(1)})
            </span>
        `;
        rollHistory.appendChild(entry);
    });
}

// Function to show a custom popup
function showCustomPopup(message) {
    // Create the popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'custom-popup';

    // Create the message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.className = 'popup-message';

    // Add the message to the popup
    popupContainer.appendChild(messageElement);

    // Add the popup to the body
    document.body.appendChild(popupContainer);

    // Remove the popup after a few seconds
    setTimeout(() => {
        document.body.removeChild(popupContainer);
    }, 3000);
}

// Initialize empty histogram
function initializeEmptyHistogram() {
    const ctx = document.getElementById('histogram').getContext('2d');
    
    histogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Frequency',
                data: [],
                backgroundColor: 'rgba(4, 156, 219, 0.6)',
                borderColor: 'rgba(4, 156, 219, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Roll Value',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Select a character and run simulation',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeCharacterGrid();
    
    // Initialize empty histogram
    initializeEmptyHistogram();
    
    // Highlight character selection on load
    highlightCharacterSelection();
    
    document.getElementById('simulate-btn').onclick = () => {
        const numRolls = parseInt(document.getElementById('num-rolls').value);
        simulateRolls(numRolls);
    };

    document.getElementById('add-roll-btn').onclick = addGameRoll;
    document.getElementById('reset-tracker-btn').onclick = resetGameTracker;
});
