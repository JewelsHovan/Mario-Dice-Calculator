import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import binom
import secrets

class DiceSimulator:
    def __init__(self, dice_rolls):
        self.dice_rolls = dice_rolls
        self.results = []

    def simulate(self, num_simulations):
        """
        Simulates rolling the chosen dice a specified number of times.

        Args:
            num_simulations (int): The number of simulations to run.
        """
        self.results = [secrets.choice(self.dice_rolls) for _ in range(num_simulations)]

    def visualize_histogram(self):
        """
        Visualizes the results of the simulations as a histogram.
        """
        plt.hist(self.results, bins=range(min(self.dice_rolls), max(self.dice_rolls) + 2), align='left', rwidth=0.8)
        plt.xlabel("Roll Value")
        plt.ylabel("Frequency")
        plt.title("Dice Roll Simulation Results")
        plt.show()

    def visualize_binomial_distribution(self, num_trials):
        """
        Visualizes the binomial distribution based on the dice probabilities,
        where a success is defined as rolling the maximum value.

        Args:
            num_trials (int): The number of trials for the binomial distribution.
        """
        # Find the maximum value on the dice
        max_value = max(self.dice_rolls)

        # Calculate the probability of success (rolling the maximum value)
        success_probability = self.dice_rolls.count(max_value) / len(self.dice_rolls)

        # Generate the binomial distribution
        x = np.arange(0, num_trials + 1)
        y = binom.pmf(x, num_trials, success_probability)

        # Plot the distribution
        plt.plot(x, y, 'bo-')
        plt.xlabel(f"Number of Times Rolling {max_value} (Successes)")
        plt.ylabel("Probability")
        plt.title(f"Binomial Distribution (Success = Rolling {max_value})")
        plt.show()


if __name__ == "__main__":
    bowser_dice = [-3, -3, 1, 8, 9, 10]
    bowser_simulator = DiceSimulator(bowser_dice)
    bowser_simulator.simulate(10)
    bowser_simulator.visualize_histogram()
    bowser_simulator.visualize_binomial_distribution(10000)
