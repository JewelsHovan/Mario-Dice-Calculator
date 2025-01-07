import statistics

character_dice_rolls = {
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
}

def calculate_probability_at_least(rolls, x):
    """Calculates the probability of rolling at least x."""
    favorable_outcomes = sum(1 for roll in rolls if roll >= x)
    return favorable_outcomes / len(rolls)

def calculate_probability_at_most(rolls, x):
    """Calculates the probability of rolling at most x."""
    favorable_outcomes = sum(1 for roll in rolls if roll <= x)
    return favorable_outcomes / len(rolls)

def display_dice_statistics(character_dice_rolls):
    """
    Calculates and displays statistics for each character's dice rolls.

    Args:
        character_dice_rolls (dict): A dictionary where keys are character names and values are lists of dice rolls.
    """
    for character, rolls in character_dice_rolls.items():
        # Consider negative values as 0 for movement calculation
        adjusted_rolls = [roll if roll > 0 else 0 for roll in rolls]

        expected_value = sum(adjusted_rolls) / len(adjusted_rolls)
        variance = sum([(x - expected_value) ** 2 for x in adjusted_rolls]) / len(adjusted_rolls)
        stdev = variance ** 0.5
        
        median = statistics.median(adjusted_rolls)
        # Calculate mode, handling potential multiple modes
        try:
            mode = statistics.mode(adjusted_rolls)
        except statistics.StatisticsError:
            mode = "Multiple modes"

        # Calculate probabilities
        prob_at_least_4 = calculate_probability_at_least(adjusted_rolls, 4)
        prob_at_most_2 = calculate_probability_at_most(adjusted_rolls, 2)

        print(f"Character: {character}")
        print(f"  Expected Value: {expected_value:.2f}")
        print(f"  Variance: {variance:.2f}")
        print(f"  Standard Deviation: {stdev:.2f}")
        print(f"  Median: {median}")
        print(f"  Mode: {mode}")
        print(f"  Probability of rolling at least 4: {prob_at_least_4:.2f}")
        print(f"  Probability of rolling at most 2: {prob_at_most_2:.2f}")
        print("-" * 20)

display_dice_statistics(character_dice_rolls)