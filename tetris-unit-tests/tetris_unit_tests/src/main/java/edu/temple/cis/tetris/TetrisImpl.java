package edu.temple.cis.tetris;

public class TetrisImpl implements Tetris {
    private int level;
    private int time;
    private int apm;
    private int lines;
    private int score;
    private int puzzles;
    private int actions;
    private int leftMovements;
    private int rightMovements;
    private int rotations;
    private boolean isSprint;
    private boolean isGarbage;
    private boolean wonSprintGame;
    private int speed;
    private HighScoreImpl normalHighScores = new HighScoreImpl();
    private HighScoreImpl sprintHighScores = new HighScoreImpl();
    private HighScoreImpl garbageHighScores = new HighScoreImpl();

    // Simulates initializing the game.
    public void initialize() {
        level = 1;
        time = 0;
        apm = 0;
        if (isSprint) {
            lines = 20;
        } else {
            lines = 0;
        }
        score = 0;
        puzzles = 0;
        actions = 0;
        leftMovements = 0;
        rightMovements = 0;
        rotations = 0;
        if (isSprint) {
            speed = 300;
        } else {
            speed = 780;
        }
        wonSprintGame = false;
    }

    // Simulates incrementing the time played by one second.
    public void addTime() {
        time = time + 1;
        apm = (actions/time)*60;
        // In Sprint mode, the score is equivalent to the time.
        if (isSprint) {
            score = time;
        }
    }

    // Simulates adding a puzzle piece to the Tetris board.
    public void addPuzzle() {
        puzzles = puzzles + 1;
        if (!isSprint && !isGarbage) {
            if (puzzles >= 10 + level*2) {
                level = level + 1;
                speed = 80 + (700 / level);
                puzzles = 0;
            }
        }
    }

    // Simulates clearing lines.
    public void addLines(int linesToAdd) {
        // In sprint mode, clearing lines reduces the number left.
        if (isSprint) {
            lines = lines - linesToAdd;
            // The sprint game is won if >= 20 lines have been cleared.
            wonSprintGame = (lines <= 0);
            // Do not show a negative number of lines.
            if (lines <= 0) {
                lines = 0;
            }
        }
        // In garbage mode, clearing lines increases the number, and also
        // increases the score by the same amount. Every
        else if (isGarbage) {
            score = score + linesToAdd;
            lines = lines + linesToAdd;
            level = (int)Math.ceil((lines + 1)/5.0);
            speed = 80 + (700 / level);
        }
        // In normal mode, clearing lines increases the number, and increases
        // the score based on the number of lines cleared and current level.
        else {
            score = score + 1000 * level * linesToAdd;
            lines = lines + linesToAdd;
        }
    }

    // Determines if a garbage line should be added. This depends on the time and level.
    public boolean shouldAddGarbageLine() {
        return (time % (16-Math.floor(level/3.0)) == 0);
    }

    // Determines if a sprint game should end.
    public boolean shouldEndSprintGame() {
        return (isSprint && (lines <= 0));
    }

    // Sets the game mode to either sprint, normal, or garbage.
    public void setSprint() {
        isSprint = true;
        isGarbage = false;
    }

    public void setNormal() {
        isSprint = false;
        isGarbage = false;
    }

    public void setGarbage() {
        isSprint = false;
        isGarbage = true;
    }

    public int getScore() {
        return score;
    }

    public int getLevel() {
        return level;
    }

    public int getLines() {
        return lines;
    }

    public int getTime() {
        return time;
    }

    public int getApm() {
        return apm;
    }

    public int getPuzzles() {
        return puzzles;
    }

    public int getActions() {
        return actions;
    }

    public int getLeftMovements() {
        return leftMovements;
    }

    public int getRightMovements() {
        return rightMovements;
    }

    public int getRotations() {
        return rotations;
    }

    public int getSpeed() {
        return speed;
    }

    public int[] getNormalHighScores() {
        return normalHighScores.getScores();
    }

    public int[] getSprintHighScores() {
        return sprintHighScores.getScores();
    }

    public int[] getGarbageHighScores() {
        return garbageHighScores.getScores();
    }

    public void up() {
        actions = actions + 1;
        rotations = rotations + 1;
    }

    public void up2() {
        actions = actions + 1;
        rotations = rotations + 1;
    }

    public void down() {
        if (!isSprint) {
            score = score + 5 + level;
        }
        actions = actions + 1;
    }

    public void down2() {
        if (!isSprint && !isGarbage) {
            score = score + 5 + level;
        }
        actions = actions + 1;
    }

    public void left() {
        actions = actions + 1;
        leftMovements = leftMovements + 1;
    }

    public void left2() {
        actions = actions + 1;
        leftMovements = leftMovements + 1;
    }

    public void right() {
        actions = actions + 1;
        rightMovements = rightMovements + 1;
    }

    public void right2() {
        actions = actions + 1;
        rightMovements = rightMovements + 1;
    }

    public void gameOver() {
        // The game ended. See if the high score can be added.
        if (isGarbage) {
            if (garbageHighScores.canAdd(score, false)) {
                garbageHighScores.add(score, false);
            }
        } else if (isSprint) {
            if (wonSprintGame) {
                if (sprintHighScores.canAdd(score, true)) {
                    sprintHighScores.add(score, true);
                }
            }
        } else {
            if (normalHighScores.canAdd(score, false)) {
                normalHighScores.add(score, false);
            }
        }
    }
}
