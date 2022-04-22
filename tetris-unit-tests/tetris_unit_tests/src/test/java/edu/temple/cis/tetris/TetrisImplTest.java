package edu.temple.cis.tetris;

import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.internal.*;

public class TetrisImplTest {
    Tetris tetris_game;

    @Before
    public void setup() {
        tetris_game = new TetrisImpl();
    }

    @Test
    public void countsNumberOfRotationsForUpToTwoPlayers() {
        // Set the game mode to Normal and initialize the game.
        tetris_game.setNormal();
        tetris_game.initialize();
        // Perform rotations for both players
        tetris_game.up();
        tetris_game.up2();
        tetris_game.up();
        tetris_game.up();
        tetris_game.up2();
        assertEquals("Both up and up2 should increment the number of rotations",
                     5, tetris_game.getRotations());
    }

    @Test
    public void countsNumberOfLeftMovementsForUpToTwoPlayers() {
        // Set the game mode to Normal and initialize the game.
        tetris_game.setNormal();
        tetris_game.initialize();
        // Perform left movements for both players
        tetris_game.left();
        tetris_game.left2();
        tetris_game.left2();
        tetris_game.left2();
        tetris_game.left();
        tetris_game.left();
        assertEquals("Both left and left2 should increment the number of left movements",
                     6, tetris_game.getLeftMovements());
    }

    @Test
    public void countsNumberOfRightMovementsForUpToTwoPlayers() {
        // Set the game mode to Normal and initialize the game.
        tetris_game.setNormal();
        tetris_game.initialize();
        // Perform right movements for both players
        tetris_game.right();
        tetris_game.right2();
        tetris_game.right2();
        tetris_game.right2();
        tetris_game.right();
        tetris_game.right();
        tetris_game.right2();
        assertEquals("Both right and right2 should increment the number of right movements",
                     7, tetris_game.getRightMovements());
    }

    @Test
    public void countsTotalNumberOfActions() {
        // Set the game mode to Normal and initialize the game.
        tetris_game.setNormal();
        tetris_game.initialize();
        // Spam a bunch of actions and verify that they are all counted.
        tetris_game.left();
        tetris_game.left2();
        tetris_game.right();
        tetris_game.right2();
        tetris_game.up();
        tetris_game.up2();
        tetris_game.down();
        tetris_game.down2();
        tetris_game.up();
        tetris_game.down2();
        tetris_game.down();
        tetris_game.left2();
        assertEquals("Should count all the actions",
                     12, tetris_game.getActions());
    }

    @Test
    public void actionsOnlyIncrementOneMovementCounter() {
        // Set the game mode to Normal and initialize the game.
        tetris_game.setNormal();
        tetris_game.initialize();
        // Spam a bunch of actions
        tetris_game.left();
        tetris_game.left2();
        tetris_game.right();
        tetris_game.right2();
        tetris_game.up();
        tetris_game.up2();
        tetris_game.down();
        tetris_game.down2();
        tetris_game.down();
        tetris_game.up2();
        tetris_game.left2();
        tetris_game.left2();
        tetris_game.right();
        tetris_game.up();
        // Check the individual movement counters
        assertEquals("Pressing left or left2 should only increment the left movement counter",
                     4, tetris_game.getLeftMovements());
        assertEquals("Pressing right or right2 should only increment the right movement counter",
                     3, tetris_game.getRightMovements());
        assertEquals("Pressing up or up2 should only increment the rotation counter",
                     4, tetris_game.getRotations());
        assertEquals("Pressing down or down2 should only increment the total action counter",
                     14, tetris_game.getActions());
    }

    @Test
    public void resettingGameClearsActionCounters() {
        // Set the game mode to Normal and initialize the game.
        tetris_game.setNormal();
        tetris_game.initialize();
        // Spam a bunch of actions
        tetris_game.up();
        tetris_game.up2();
        tetris_game.down();
        tetris_game.down2();
        tetris_game.right();
        tetris_game.right();
        tetris_game.right2();
        tetris_game.left();
        tetris_game.left();
        tetris_game.left2();
        // End the game
        tetris_game.gameOver();
        // Re-initialize the game
        tetris_game.initialize();
        // Verify that all the added counters return to 0
        assertEquals("The left movement counter resets to 0 after initializing",
                     0, tetris_game.getLeftMovements());
        assertEquals("The right movement counter resets to 0 after initializing",
                     0, tetris_game.getRightMovements());
        assertEquals("The rotation counter resets to 0 after initializing",
                     0, tetris_game.getRotations());
        assertEquals("The action counter resets to 0 after initializing",
                     0, tetris_game.getActions());
    }

    @Test
    public void shouldSetLinesTo20AtStartOfSprintGame() {
        // Set the game mode to Sprint and initialize the game.
        tetris_game.setSprint();
        tetris_game.initialize();
        assertEquals("Should initialize Sprint game to 20 lines",
                     20, tetris_game.getLines());
    }

    @Test
    public void shouldKeepLevelAt1DuringSprintGame() {
        // Set the game mode to Sprint and initialize the game.
        tetris_game.setSprint();
        tetris_game.initialize();
        assertEquals("Should initialize Sprint game to level 1",
                     1, tetris_game.getLevel());
        // Clear a bunch of lines and spam a bunch of pieces
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        // Verify that the level is still 1
        assertEquals("Should keep the Sprint game at level 1",
                     1, tetris_game.getLevel());
    }

    @Test
    public void shouldKeepSpeedAt300DuringSprintGame() {
        // Set the game mode to Sprint and initialize the game.
        tetris_game.setSprint();
        tetris_game.initialize();
        assertEquals("Should initialize Sprint game to speed 300",
                     300, tetris_game.getSpeed());
        // Clear a bunch of lines and spam a bunch of pieces
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        tetris_game.addPuzzle();
        // Verify that the speed is still 300
        assertEquals("Should keep the Sprint game at speed 300",
                     300, tetris_game.getSpeed());
    }

    @Test
    public void sprintGameDecrementsLines() {
        // Make sure clearing lines in sprint mode decreases the number shown to the user.
        tetris_game.setSprint();
        tetris_game.initialize();
        tetris_game.addLines(4);
        assertEquals("The Sprint game should show 16 lines after 4 have been cleared",
                     16, tetris_game.getLines());
        tetris_game.addLines(3);
        assertEquals("The Sprint game should show 13 lines after 7 have been cleared",
                     13, tetris_game.getLines());
        tetris_game.addLines(2);
        tetris_game.addLines(1);
        assertEquals("The Sprint game should show 10 lines after 10 have been cleared",
                     10, tetris_game.getLines());
    }

    @Test
    public void sprintGameIsWonAfter20Lines() {
        // Make sure the sprint game ends after 20 lines.
        tetris_game.setSprint();
        tetris_game.initialize();
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        assertFalse("The Sprint game should not have ended after 12 lines",
                     tetris_game.shouldEndSprintGame());
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        assertTrue("The Sprint game should have ended after 20 lines",
                    tetris_game.shouldEndSprintGame());
    }

    @Test
    public void sprintGameDoesNotShowNegativeLines() {
        // Make sure the sprint game does not show negative lines when it ends.
        tetris_game.setSprint();
        tetris_game.initialize();
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(3);
        assertFalse("The Sprint game should not have ended after 19 lines",
                     tetris_game.shouldEndSprintGame());
        tetris_game.addLines(4);
        assertTrue("The Sprint game should have ended after 23 lines",
                     tetris_game.shouldEndSprintGame());
        assertEquals("The number of lines displayed should be zero despite clearing more than 20 lines",
                     0, tetris_game.getLines());
    }

    @Test
    public void sprintGameUsesTimeAsScore() {
        // Make sure the sprint game uses the time taken as the score.
        tetris_game.setSprint();
        tetris_game.initialize();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        assertEquals("The Sprint game's score is 4 when 4 seconds have elapsed",
                     4, tetris_game.getScore());
    }

    @Test
    public void sprintGameDoesNotEnterHighScoreWhenPlayerFailed() {
        tetris_game.setSprint();
        tetris_game.initialize();
        // Set the score to 2
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 4 lines
        tetris_game.addLines(4);
        tetris_game.gameOver();
        assertArrayEquals("The player should not be able to set a high score if they failed in Sprint mode",
                          new int[]{0,0,0,0,0}, tetris_game.getSprintHighScores());
    }

    @Test
    public void shouldAddFirstSprintHighScore() {
        tetris_game.setSprint();
        tetris_game.initialize();
        // Set the time (score) to 3
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        assertArrayEquals("The player should be allowed to enter a high score when they complete a Sprint game and the array is empty",
                          new int[]{3,0,0,0,0}, tetris_game.getSprintHighScores());
    }

    @Test
    public void shouldSortSprintHighScoresInAscendingOrder() {
        tetris_game.setSprint();
        tetris_game.initialize();
        // Set the time (score) to 8
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the time (score) to 4
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Verify the scores were added in ascending order
        assertArrayEquals("The Sprint high scores should be in ascending order",
                new int[]{4,8,0,0,0}, tetris_game.getSprintHighScores());
    }

    @Test
    public void shouldRemoveWorseSprintHighScores() {
        tetris_game.setSprint();
        tetris_game.initialize();
        // Set the time (score) to 1
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the time (score) to 2
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the time (score) to 3
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the time (score) to 4
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the time (score) to 6
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Verify the scores were added in ascending order
        assertArrayEquals("The Sprint high scores should be in ascending order",
                new int[]{1,2,3,4,6}, tetris_game.getSprintHighScores());
        // Set the time (score) to 5
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Clear 20 lines to end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Verify the inferior high score was kicked out of the array
        assertArrayEquals("The Sprint high scores should reflect the 5 best scores",
                          new int[]{1,2,3,4,5}, tetris_game.getSprintHighScores());
    }

    @Test
    public void shouldSetLinesTo0AtStartOfGarbageGame() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        assertEquals("The number of lines should be set to 0 in garbage mode",
                     0, tetris_game.getLines());
    }

    @Test
    public void shouldSetScoreToNumberOfLinesInGarbageMode() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        // Clear some lines
        tetris_game.addLines(4);
        tetris_game.addLines(3);
        tetris_game.addLines(1);
        tetris_game.addLines(4);
        tetris_game.addLines(2);
        assertEquals("In garbage mode, the score should equal the number of lines cleared",
                     14, tetris_game.getScore());
    }

    @Test
    public void shouldIncreaseLevelEvery5LinesInGarbageMode() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        assertEquals("In garbage mode, the number of lines should initialize to 1",
                     1, tetris_game.getLevel());
        // Clear 5 lines
        tetris_game.addLines(3);
        tetris_game.addLines(2);
        assertEquals("In garbage mode, the level should increment after 5 lines have been cleared",
                     2, tetris_game.getLevel());
        // Clear 13 lines
        tetris_game.addLines(4);
        tetris_game.addLines(3);
        tetris_game.addLines(4);
        tetris_game.addLines(3);
        assertEquals("In garbage mode, the level should increment 3 times after 18 lines have been cleared",
                     4, tetris_game.getLevel());
    }

    @Test
    public void shouldIncreaseSpeedWithLevelInGarbageMode() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        assertEquals("In garbage mode, the speed should initialize to 780",
                     780, tetris_game.getSpeed());
        // Clear 5 lines to increase the level
        tetris_game.addLines(3);
        tetris_game.addLines(1);
        tetris_game.addLines(1);
        assertEquals("In garbage mode, the speed should drop to 80 + 700/2 = 430 after reaching level 2",
                     430, tetris_game.getSpeed());
        // Clear 13 lines to increase the level 2 more times
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(1);
        assertEquals("In garbage mode, the speed should drop to 80 + 700/4 = 255 after reaching level 4",
                     255, tetris_game.getSpeed());
    }

    @Test
    public void shouldPlaceGarbageLinesAtPeriodicIntervalsInGarbageMode() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        // Set the time to 16 - this is when the first garbage line should be placed
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Verify that the garbage line would be placed here
        assertTrue("In garbage mode, the first garbage line is placed at t = 16",
                     tetris_game.shouldAddGarbageLine());
        // Wait another 16 seconds and verify that the next garbage line should be placed
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        // Verify that the garbage line would be placed here
        assertTrue("In garbage mode at level 1, the second garbage line is placed at t = 32",
                   tetris_game.shouldAddGarbageLine());
        // Verify that a garbage line would not be placed 1 second later
        tetris_game.addTime();
        assertFalse("In garbage mode at level 1, there would not be garbage line placed at t = 33",
                     tetris_game.shouldAddGarbageLine());
    }

    @Test
    public void shouldIncreaseSpeedOfGarbageLinesAsLevelIncreases() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        // Clear 25 lines to set the level to 6
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(1);
        // Verify that the first garbage line is placed at t = 14
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        assertTrue("In garbage mode at level 6, the first garbage line is placed at t = 14",
                   tetris_game.shouldAddGarbageLine());
        // Verify that the second garbage line is placed at t = 28
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        tetris_game.addTime();
        assertTrue("In garbage mode at level 6, the second garbage line is placed at t = 28",
                   tetris_game.shouldAddGarbageLine());
    }

    @Test
    public void shouldAddFirstGarbageHighScore() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        // Set the number of lines (score) to 20 and end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        assertArrayEquals("The player should be allowed to enter a high score when they complete a Garbage game and the array is empty",
                new int[]{20,0,0,0,0}, tetris_game.getGarbageHighScores());
    }

    @Test
    public void shouldSortGarbageHighScoresInDescendingOrder() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        // Set the number of lines (score) to 4 and end the game.
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the number of lines (score) to 12 and end the game.
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Verify the scores were added in descending order
        assertArrayEquals("The Garbage high scores should be in descending order",
                new int[]{12,4,0,0,0}, tetris_game.getGarbageHighScores());
    }

    @Test
    public void shouldRemoveWorseGarbageHighScores() {
        tetris_game.setGarbage();
        tetris_game.initialize();
        // Set the number of lines (score) to 1 and end the game
        tetris_game.addLines(1);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the number of lines (score) to 2 and end the game
        tetris_game.addLines(2);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the number of lines (score) to 3 and end the game
        tetris_game.addLines(3);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the number of lines (score) to 4 and end the game
        tetris_game.addLines(4);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Set the number of lines (score) to 5 and end the game
        tetris_game.addLines(4);
        tetris_game.addLines(1);
        tetris_game.gameOver();
        // Reset the game
        tetris_game.initialize();
        // Verify the scores were added in descending order
        assertArrayEquals("The Garbage high scores should be in descending order",
                new int[]{5,4,3,2,1}, tetris_game.getGarbageHighScores());
        // Set the number of lines (score) to 6 and end the game
        tetris_game.addLines(4);
        tetris_game.addLines(2);
        tetris_game.gameOver();
        // Verify the inferior high score was kicked out of the array
        assertArrayEquals("The Garbage high scores should reflect the 5 best scores",
                new int[]{6,5,4,3,2}, tetris_game.getGarbageHighScores());
    }
}