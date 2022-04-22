package edu.temple.cis.tetris;

public class HighScoreImpl {

    private int[] scores = new int[5];
    private int maxScores;
    private int scoresEntered;

    public HighScoreImpl() {
        for (int i = 0; i < 4; i++) {
            scores[i] = 0;
        }
        maxScores = 5;
        scoresEntered = 0;
    }

    public boolean canAdd(int score, boolean isSprint) {
        // If fewer than 5 scores have been entered, the current score can
        // be entered.
        if (scoresEntered < maxScores) {
            return true;
        }
        // Otherwise, the score can be entered if it is lower than one of the lowest
        // scores in Sprint mode, or higher than one of the highest 5 scores in any
        // other mode.
        for (int i = 4; i >= 0; --i) {
            if (!isSprint) {
                if (scores[i] < score) {
                    return true;
                }
            } else {
                if (scores[i] > score) {
                    return true;
                }
            }
        }
        return false;
    }

    public void add(int score, boolean isSprint) {
        for (int i = 0; i <= 4; i++) {
            if (!isSprint) {
                // If the score in position i is lower than the submitted score, or the score is zeor...
                // If the score is 0 it is identical to an empty position. The player should be able to enter a score here
                if (scores[i] < score || scores[i] == 0) {
                    // Move all the scores in positions i through 4 down one position
                    for (int j = 3; j >= i; j--) {
                        scores[j + 1] = scores[j];
                    }
                    // Add the new score
                    scores[i] = score;
                    // Increment the number of scores entered
                    scoresEntered = scoresEntered + 1;
                    break;
                }
            } else {
                // If the score in position i is higher than the submitted score, or the score is zero...
                // If the score is 0 it is identical to an empty position. The player should be able to enter a score here
                if (scores[i] > score || scores[i] == 0) {
                    // Move all the scores in positions i through 4 down one position
                    for (int j = 3; j >= i; j--) {
                        scores[j + 1] = scores[j];
                    }
                    // Add the new score
                    scores[i] = score;
                    // Increment the number of scores entered
                    scoresEntered = scoresEntered + 1;
                    break;
                }
            }
        }
    }

    public int[] getScores() {
        return scores;
    }

    public void clearScores() {
        for (int i = 0; i < 4; i++) {
            scores[i] = 0;
        }
    }

}