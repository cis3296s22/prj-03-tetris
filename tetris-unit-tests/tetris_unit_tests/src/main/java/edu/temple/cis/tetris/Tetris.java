package edu.temple.cis.tetris;

public interface Tetris {

    void initialize();
    void addTime();
    void addPuzzle();
    void addLines(int linesToAdd);
    boolean shouldAddGarbageLine();
    boolean shouldEndSprintGame();
    void setSprint();
    void setNormal();
    void setGarbage();
    int getScore();
    int getLevel();
    int getLines();
    int getTime();
    int getApm();
    int getPuzzles();
    int getActions();
    int getLeftMovements();
    int getRightMovements();
    int getRotations();
    int getSpeed();
    void up();
    void up2();
    void down();
    void down2();
    void left();
    void left2();
    void right();
    void right2();
    void gameOver();
    int[] getNormalHighScores();
    int[] getSprintHighScores();
    int[] getGarbageHighScores();

}