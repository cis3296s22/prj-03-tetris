/*
 * PROJECT:  JsTetris
 * VERSION:  1.20
 * LICENSE:  BSD (revised)
 * AUTHOR:   (c) 2004 Czarek Tomczak
 * WEBSITE:  https://github.com/cztomczak/jstetris
 *
 * This game can be used freely as long as all
 * copyright messages are intact.
 */

/**
 * Tetris Game
 * Initializes the buttons automatically, no additional actions required
 *
 * Score:
 * 1) puzzle speed = 80+700/level
 * 2) if puzzles created in current level >= 10+level*2 then increase level
 * 3) after puzzle falling score is increased by 1000*level*linesRemoved
 * 4) each down action increases score by 5+level
 *
 * API:
 *
 * public - method can be called outside of the object
 * event - method is used as event, "this" refers to html object, "self" refers to javascript object
 *
 * class Tetris
 * ------------
 * public event void start()
 * public event void multiplayerCoop()
 * public event void multiplayerComp()
 * public event void sprint()
 * public event void garbage()
 * public event void reset()
 * public event void pause()
 * public event void gameOver()
 * public event void up()
 * public event void up2()
 * public event void down()
 * public event void down2()
 * public event void left()
 * public event void left2()
 * public event void right()
 * public event void right2()
 * public event void space()
 * public event void tab()
 *
 * class Window
 * ------------
 * event void activate()
 * event void close()
 * public bool isActive()
 *
 * class Keyboard
 * --------------
 * public void set(int key, function func)
 * event void event(object e)
 *
 * class Stats
 * -----------
 * public void start()
 * public void stop()
 * public void reset()
 * public event void incTime()
 * public void setScore(int i)
 * public void setScore2(int i)
 * public void setLevel(int i)
 * public void setLevel2(int i)
 * public void setLines(int i)
 * public void setLines2(int i)
 * public void setPuzzles(int i)
 * public void setActions(int i)
 * public void setActions2(int i)
 * public void setLeftMovements(int i)
 * public void setLeftMovements2(int i)
 * public void setRightMovements(int i)
 * public void setRightMovements2(int i)
 * public void setRotations(int i)
 * public void setRotations2(int i)
 * public int getScore()
 * public int getScore2()
 * public int getLevel()
 * public int getLevel2()
 * public int getLines()
 * public int getLines2()
 * public int getPuzzles()
 * public int getActions()
 * public int getActions2()
 * public int getLeftMovements()
 * public int getLeftMovements2()
 * public int getRightMovements()
 * public int getRightMovements2()
 * public int getRotations()
 * public int getRotations2()
 *
 * class Area
 * ----------
 * public Constructor(int unit, int x, int y, string id)
 * public void destroy()
 * public int removeFullLines()
 * public bool isLineFull(int y)
 * public void removeLine(int y)
 * public mixed getBlock(int y, int x)
 * public void addElement(htmlObject el)
 *
 * class Puzzle
 * ------------
 * public Constructor(object area)
 * public void reset()
 * public bool isRunning()
 * public bool isStopped()
 * public int getX()
 * public int getY()
 * public bool mayPlace()
 * public void place()
 * public void destroy()
 * private array createEmptyPuzzle(int y, int x)
 * event void fallDown()
 * public event void forceMoveDown()
 * public void stop()
 * public bool mayRotate()
 * public void rotate()
 * public bool mayMoveDown()
 * public void moveDown()
 * public bool mayMoveLeft()
 * public void moveLeft()
 * public bool mayMoveRight()
 * public void moveRight()
 *
 * class Highscores
 * ----------------
 * public Constructor(maxscores)
 * public void load()
 * public void save()
 * public bool mayAdd(int score)
 * public void add(string name, int score)
 * public array getScores()
 * public string toHtml()
 * private void sort()
 *
 * class Cookie
 * ------------
 * public string get(string name)
 * public void set(string name, string value, int seconds, string path, string domain, bool secure)
 * public void del(string name)
 *
 * TODO:
 * document.getElementById("tetris-nextpuzzle") cache ?
 *
 */

function Tetris()
{
	var self = this;

	this.stats = new Stats();
	this.puzzle = null;
	this.area = null;

	this.unit; // unit = x pixels
	this.areaX; // area width = x units
	this.areaY;// area height = y units

	this.normalHighscores = new Highscores(5);
	this.sprintHighscores = new Highscores(5);
	this.garbageHighscores = new Highscores(5);
	this.switchOn = false;
	this.paused = false;

	/**
	 * @return void
	 * @access public event
	 */
	this.start = function()
	{
		if (self.puzzle && !confirm('Are you sure you want to start a new game ?')) return;
		self.reset();
		self.stats.start(false);
		document.getElementById("tetris-nextpuzzle").style.display = "block";
		//document.getElementById("tetris-keys-player1").style.display = "none";
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", false);
		self.puzzle = new Puzzle(self, self.area, true, false, false);
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			self.gameOver(false, false, false);
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	 this.multiplayerComp  = function()
	 {
		if (self.puzzle && !confirm('Are you sure you want to start a new game ?')) return;
		self.reset();
		document.getElementById("right").style.display = "block";
		self.stats.start(false);
		document.getElementById("tetris-nextpuzzle").style.display = "block";
		//document.getElementById("tetris-keys-player1").style.display = "none";
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", false);
		self.puzzle = new Puzzle(self, self.area, false, false, false, true, false);
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			self.gameOver(false, false, false);
		}
	 };

	 this.multiplayerCoop  = function()
	 {
		if (self.puzzle && !confirm('Are you sure you want to start a new game ?')) return;
		self.reset();
		self.stats.start(false);
		//document.getElementById("tetris-nextpuzzle").style.display = "block";
		//document.getElementById("tetris-keys-player1").style.display = "none";
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", false);
		self.puzzle = new Puzzle(self, self.area, false, false, false, false, true);
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			self.gameOver(false, false, false);
		}
	 };

	/**
	 * @return void
	 * @access public event
	 */
	this.sprint = function()
	{
		if (self.puzzle && !confirm('Are you sure you want to start a new game ?')) return;
		self.reset();
		self.stats.start(true);
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", false);
		self.puzzle = new Puzzle(self, self.area, true, true, false);
		// Start the sprint game. This is necessary here to avoid the game contiuing after a
		// sprint game has been won.
		self.puzzle.startSprintGame();
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			// Despite this being in sprint mode, failing to clear all lines should not allow
			// the user to enter a high score for sprint mode.
			self.gameOver(true, false, false);
		}
	}

	/**
	 * @return void
	 * @access public event
	 */
	this.garbage = function()
	{
		if (self.puzzle && !confirm("Are you sure you want to start a new game ?'")) return;
		self.reset();
		self.stats.start(false);
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", true);
		self.puzzle = new Puzzle(self, self.area, true, false, true);
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			self.gameOver(false, false, true);
		}
	}

	/**
	 * @return void
	 * @access public event
	 */
	this.sprint = function()
	{
		if (self.puzzle && !confirm('Are you sure you want to start a new game ?')) return;
		self.reset();
		self.stats.start(true);
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", false);
		self.puzzle = new Puzzle(self, self.area, true, true, false);
		document.getElementById("tetris-nextpuzzle").style.display = "block";
		// Start the sprint game. This is necessary here to avoid the game contiuing after a
		// sprint game has been won.
		self.puzzle.startSprintGame();
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			// Despite this being in sprint mode, failing to clear all lines should not allow
			// the user to enter a high score for sprint mode.
			self.gameOver(true, false, false);
		}
	}

	/**
	 * @return void
	 * @access public event
	 */
	this.garbage = function()
	{
		if (self.puzzle && !confirm("Are you sure you want to start a new game ?'")) return;
		self.reset();
		self.stats.start(false);
		document.getElementById("tetris-nextpuzzle").style.display = "block";
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area1", true);
		self.puzzle = new Puzzle(self, self.area, true, false, true);
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			self.gameOver(false, false, true);
		}
	}

	/**
	 * @return void
	 * @access public event
	 */
	this.reset = function()
	{
		if (self.puzzle) {
			self.puzzle.destroy();
			self.puzzle = null;
		}
		if (self.area) {
			self.area.destroy();
			self.area = null;
		}
		document.getElementById("tetris-gameover").style.display = "none";
		document.getElementById("tetris-nextpuzzle").style.display = "none";
		document.getElementById("tetris-keys-player1").style.display = "block";
		self.stats.reset(false);
		self.paused = false;
		document.getElementById('tetris-pause').style.display = 'block';
		document.getElementById('tetris-resume').style.display = 'none';
	};

	/**
	 * Pause / Resume.
	 * @return void
	 * @access public event
	 */
	this.pause = function()
	{
		if (self.puzzle == null) return;
		if (self.paused) {
			self.puzzle.running = true;
			self.puzzle.fallDownID = setTimeout(self.puzzle.fallDown, self.puzzle.speed);
			document.getElementById('tetris-pause').style.display = 'block';
			document.getElementById('tetris-resume').style.display = 'none';
			self.stats.timerId = setInterval(self.stats.incTime, 1000);
			self.paused = false;
		} else {
			if (!self.puzzle.isRunning()) return;
			if (self.puzzle.fallDownID) clearTimeout(self.puzzle.fallDownID);
			document.getElementById('tetris-pause').style.display = 'none';
			document.getElementById('tetris-resume').style.display = 'block';
			clearTimeout(self.stats.timerId);
			self.paused = true;
			self.puzzle.running = false;
		}
	};

	/**
	 * End game.
	 * Stop stats, ...
	 * @return void
	 * @access public event
	 */
	this.gameOver = function(isSprint, wonSprintGame, isGarbage)
	{
		self.stats.stop();
		self.puzzle.stop();
		document.getElementById("tetris-nextpuzzle").style.display = "none";
		document.getElementById("tetris-gameover").style.display = "block";
		document.getElementById("right").style.display = "none";

		// Add garbage high scores
		if (isGarbage == true) {
			if (this.garbageHighscores.mayAdd(this.stats.getScore(), false)) {
				var name = prompt("Game Over !\n Edited by Giray, Shiv, and Tommy! Enter your name!:", "");
				if (name && name.trim().length) {
					this.garbageHighscores.add(name, this.stats.getScore(), false);
				}
			}
		// If the player did not manage to clear 20 lines in a sprint game, it should not add a high score.
		// Otherwise add the sprint high score
		} else if (wonSprintGame == true) {
			if (this.sprintHighscores.mayAdd(this.stats.getScore(), true)) {
				var name = prompt("Game Over !\n Enter your name!:", "");
				if (name && name.trim().length) {
					this.sprintHighscores.add(name, this.stats.getScore(), true);
				}
			}
		// Add high scores for standard mode
		} else if (isSprint == false) {
			if (this.normalHighscores.mayAdd(this.stats.getScore(), false)) {
				var name = prompt("Game Over !\n Enter your name!:", "");
				if (name && name.trim().length) {
					this.normalHighscores.add(name, this.stats.getScore(), false);
				}
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.up = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()&& (self.puzzle.number % 2 == 0) ) {
			if (self.puzzle.mayRotate()) {
				self.puzzle.rotate();
				self.stats.setActions(self.stats.getActions() + 1);
				self.stats.setRotations(self.stats.getRotations() + 1);
				
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	 this.up2 = function()
	 {
		 if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()&& (self.puzzle.number % 2 == 1) ) {
			 if (self.puzzle.mayRotate()) {
				self.puzzle.rotate();
				if(self.puzzle.isComp == true){
					self.stats.setActions2(self.stats.getActions2() + 1);
					self.stats.setRotations2(self.stats.getRotations2() + 1); 
				}
				else{
					self.stats.setActions(self.stats.getActions() + 1);
					self.stats.setRotations(self.stats.getRotations() + 1); 
				}
			 }
		 }
	 };

	/**
	 * @return void
	 * @access public event
	 */
	this.down = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 0) ) {
			if (self.puzzle.mayMoveDown()) {
				if (self.puzzle.sprint == false && self.puzzle.isGarbage == false) {
					self.stats.setScore(self.stats.getScore() + 5 + self.stats.getLevel());
				}
				self.puzzle.moveDown();
				self.stats.setActions(self.stats.getActions() + 1);
			}
		}
	};

	this.down2 = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 1) ) {
			if (self.puzzle.mayMoveDown()) {
				if (self.puzzle.sprint == false && self.puzzle.isGarbage == false) {
					if(self.puzzle.isComp == true){
						self.stats.setScore2(self.stats.getScore2() + 5 + self.stats.getLevel());
					}
					else{
						self.stats.setScore(self.stats.getScore() + 5 + self.stats.getLevel());
					}
				}
				self.puzzle.moveDown();
				if(self.puzzle.isComp == true){
					self.stats.setActions2(self.stats.getActions2() + 1);
				}
				else{
					self.stats.setActions(self.stats.getActions() + 1);
				}
				
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.left = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 0) ) {
			if (self.puzzle.mayMoveLeft()) {
				self.puzzle.moveLeft();
				self.stats.setActions(self.stats.getActions() + 1);
				self.stats.setLeftMovements(self.stats.getLeftMovements() + 1);
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	 this.left2 = function()
	 {
		 if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 1) ) {
			 if (self.puzzle.mayMoveLeft()) {
				self.puzzle.moveLeft();
				if(self.puzzle.isComp == true){
					self.stats.setActions2(self.stats.getActions2() + 1);
					self.stats.setLeftMovements2(self.stats.getLeftMovements2() + 1);
				}
				else{
					self.stats.setActions(self.stats.getActions() + 1);
					self.stats.setLeftMovements(self.stats.getLeftMovements() + 1);
				}
				
			 }
		 }
	 };
 

	/**
	 * @return void
	 * @access public event
	 */
	this.right = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 0) ) {
			if (self.puzzle.mayMoveRight()) {
				self.puzzle.moveRight();
				self.stats.setActions(self.stats.getActions() + 1);
				self.stats.setRightMovements(self.stats.getRightMovements() + 1);
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	 this.right2 = function()
	 {
		 if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 1) ) {
			 if (self.puzzle.mayMoveRight()) {
				self.puzzle.moveRight();
				if(self.puzzle.isComp == true){
					self.stats.setActions2(self.stats.getActions2() + 1);
					self.stats.setRightMovements2(self.stats.getRightMovements2() + 1);
				}
				else{
					self.stats.setActions(self.stats.getActions() + 1);
					self.stats.setRightMovements(self.stats.getRightMovements() + 1);
				}
				
			 }
		 }
	 };

	/**
	 * @return void
	 * @access public event
	 */
	this.space = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 0) ) {
			self.puzzle.stop();
			self.puzzle.forceMoveDown();
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	 this.tab = function()
	 {
		 if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped() && (self.puzzle.number % 2 == 1) ) {
			 self.puzzle.stop();
			 self.puzzle.forceMoveDown();
		 }
	 };

	// windows
	var helpwindow = new Window("tetris-help");
	var highscores = new Window("tetris-highscores");
	var multiplayerMenu = new Window("multiplayerWindow");

	// game menu
	document.getElementById("tetris-menu-start").onclick = function() { helpwindow.close(); highscores.close(); self.start(); this.blur(); };
	document.getElementById("tetris-menu-sprint-start").onclick = function() { helpwindow.close(); highscores.close(); self.sprint(); this.blur(); };
	document.getElementById("tetris-menu-garbage-start").onclick = function() { helpwindow.close(); highscores.close(); self.garbage(); this.blur(); };
	document.getElementById("tetris-menu-multiplayer").onclick = function() { helpwindow.close(); highscores.close(); multiplayerMenu.activate(); this.blur(); };
	document.getElementById("multiplayerCooperative").onclick = function() { helpwindow.close(); highscores.close(); multiplayerMenu.close(); self.start(); self.multiplayerCoop(); this.blur(); };
	document.getElementById("multiplayerCompetitive").onclick = function() { helpwindow.close(); highscores.close(); self.start(); multiplayerMenu.close(); self.multiplayerComp(); this.blur(); };
	// document.getElementById("tetris-menu-reset").onclick = function() { helpwindow.close(); highscores.close(); self.reset(); this.blur(); };

	document.getElementById("tetris-menu-pause").onclick = function() { self.pause(); this.blur(); };
	document.getElementById("tetris-menu-resume").onclick = function() { self.pause(); this.blur(); };

	// help
	document.getElementById("tetris-menu-help").onclick = function() { highscores.close(); helpwindow.activate(); this.blur(); };
	document.getElementById("tetris-help-close").onclick = helpwindow.close;

	// highscores
	document.getElementById("tetris-menu-highscores").onclick = function()
	{
		helpwindow.close();
		document.getElementById("tetris-normal-highscores-content").innerHTML = self.normalHighscores.toHtml(false, false);
		document.getElementById("tetris-sprint-highscores-content").innerHTML = self.sprintHighscores.toHtml(true, false);
		document.getElementById("tetris-garbage-highscores-content").innerHTML = self.garbageHighscores.toHtml(false, true);
		highscores.activate();
		this.blur();
	};
	document.getElementById("tetris-highscores-close").onclick = highscores.close;

	document.getElementById("switch").onclick = function(e){ e.preventDefault(); discoSwitch(); }

	// keyboard - buttons
	//document.getElementById("tetris-keyboard-up").onclick = function() { self.up(); this.blur(); };
	//document.getElementById("tetris-keyboard-down").onclick = function() { self.down(); this.blur(); };
	//document.getElementById("tetris-keyboard-left").onclick = function () { self.left(); this.blur(); };
	//document.getElementById("tetris-keyboard-right").onclick = function() { self.right(); this.blur(); };

	// keyboard
	var keyboard = new Keyboard();
	keyboard.set(keyboard.n, this.start);
	//keyboard.set(keyboard.r, this.reset);
	keyboard.set(keyboard.p, this.pause);
	keyboard.set(keyboard.up, this.up);
	keyboard.set(keyboard.up2, this.up2);
	keyboard.set(keyboard.down, this.down);
	keyboard.set(keyboard.down2, this.down2);
	keyboard.set(keyboard.left, this.left);
	keyboard.set(keyboard.left2, this.left2);
	keyboard.set(keyboard.right, this.right);
	keyboard.set(keyboard.right2, this.right2);
	keyboard.set(keyboard.space, this.space);
	keyboard.set(keyboard.tab, this.tab);
	document.onkeydown = keyboard.event;

	function colorChanger(){
		const colors = ["DarkViolet", "DeepPink", "GreenYellow", "DodgerBlue", "Crimson", "DarkSalmon", "Black"];
		var select = Math.floor(Math.random() * 6);
		var BackgroundColor= colors[select];
		document.body.style.backgroundColor=BackgroundColor;
	}

	function dancerMover(){
		var holder = document.getElementById("discoDancer").offsetLeft;
		holder += 10;
		if(holder >= 1000){
			holder = 0;
		}
		document.getElementById("discoDancer").style.left = holder + 'px';
	}

	function discoSwitch(){
		var px = 0;
		if(self.switchOn == false){
			document.getElementById("disco1").style.display = "initial";
			document.getElementById("disco2").style.display = "initial";
			document.getElementById("discoDancer").style.display = "initial";
			document.getElementById("discoMusic").play();
			colorChange = setInterval(colorChanger, 150);
			moveDancer = setInterval(dancerMover, 300);
			self.switchOn = true;
		}
		else{
			document.getElementById("disco1").style.display = "none";
			document.getElementById("disco2").style.display = "none";
			document.getElementById("discoDancer").style.display = "none"
			document.getElementById("discoMusic").pause();
			clearInterval(colorChange);
			clearInterval(moveDancer);
			document.body.style.backgroundColor = "bisque";

			self.switchOn = false;
		}
		
		
	}

	/**
	 * Window replaces game area, for example help window
	 * @param string id
	 */
	function Window(id)
	{
		this.id = id;
		this.el = document.getElementById(this.id);
		var self = this;

		/**
		 * Activate or deactivate a window - update html
		 * @return void
		 * @access event
		 */
		this.activate = function()
		{
			self.el.style.display = (self.el.style.display == "block" ? "none" : "block");
		};

		/**
		 * Close window - update html
		 * @return void
		 * @access event
		 */
		this.close = function()
		{
			self.el.style.display = "none";
		};

		/**
		 * @return bool
		 * @access public
		 */
		this.isActive = function()
		{
			return (self.el.style.display == "block");
		};
	}

	/**
	 * Assigning functions to keyboard events
	 * When key is pressed, searching in a table if any function has been assigned to this key, execute the function.
	 */
	function Keyboard()
	{
		this.up = 38;
		this.up2 = 87;
		this.down = 40;
		this.down2 = 83;
		this.left = 37;
		this.left2 = 65;
		this.right = 39;
		this.right2 = 68;
		this.n = 78;
		this.p = 80;
		this.r = 82;
		this.space = 32;
		this.tab = 9;
		this.f12 = 123;
		this.escape = 27;

		this.keys = [];
		this.funcs = [];

		var self = this;

		/**
		 * @param int key
		 * @param function func
		 * @return void
		 * @access public
		 */
		this.set = function(key, func)
		{
			this.keys.push(key);
			this.funcs.push(func);
		};

		/**
		 * @param object e
		 * @return void
		 * @access event
		 */
		this.event = function(e)
		{
			if (!e) { e = window.event; }
			for (var i = 0; i < self.keys.length; i++) {
				if (e.keyCode == self.keys[i]) {
					self.funcs[i]();
				}
			}
		};
	}

	/**
	 * Live game statistics
	 * Updating html
	 */
	function Stats()
	{
		isComp = this.isComp;
		this.level;
		this.time;
		this.apm;
		this.lines;
		this.score;
		this.puzzles; // number of puzzles created on current level

		this.actions;
		this.leftMovements;
		this.rightMovements;
		this.rotations;

		this.el = {
			"level": document.getElementById("tetris-stats-level"),
			"time":  document.getElementById("tetris-stats-time"),
			"apm":  document.getElementById("tetris-stats-apm"),
			"lines": document.getElementById("tetris-stats-lines"),
			"score": document.getElementById("tetris-stats-score"),
			"actions": document.getElementById("tetris-stats-actions"),
			"leftMovements": document.getElementById("tetris-stats-left-movements"),
			"rightMovements": document.getElementById("tetris-stats-right-movements"),
			"rotations": document.getElementById("tetris-stats-rotations"),
			"level2": document.getElementById("tetris-stats-level2"),
			"time2":  document.getElementById("tetris-stats-time2"),
			"apm2":  document.getElementById("tetris-stats-apm2"),
			"lines2": document.getElementById("tetris-stats-lines2"),
			"score2": document.getElementById("tetris-stats-score2"),
			"actions2": document.getElementById("tetris-stats-actions2"),
			"leftMovements2": document.getElementById("tetris-stats-left-movements2"),
			"rightMovements2": document.getElementById("tetris-stats-right-movements2"),
			"rotations2": document.getElementById("tetris-stats-rotations2")
		}

		this.timerId = null;
		var self = this;

		/**
		 * Start counting statistics, reset stats, turn on the timer
		 * @return void
		 * @access public
		 */
		this.start = function(isSprint)
		{
			this.reset(isSprint);
			this.timerId = setInterval(this.incTime, 1000);
		};

		/**
		 * Stop counting statistics, turn off the timer
		 * @return void
		 * @access public
		 */
		this.stop = function()
		{
			if (this.timerId) {
				clearInterval(this.timerId);
			}
		};

		/**
		 * Reset statistics - update html
		 * @return void
		 * @access public
		 */
		this.reset = function(isSprint)
		{
			console.log("Resetting the game!");
			console.log(isSprint);
			this.stop();
			this.level = 1;
			this.time  = 0;
			this.apm   = 0;
			// In sprint mode, the user needs to clear 20 lines to end the game.
			if (isSprint == true) {
				this.lines = 20;
			} else {
				this.lines = 0;
			}
			this.score = 0;
			this.puzzles = 0;
			this.actions = 0;
			this.leftMovements = 0;
			this.rightMovements = 0;
			this.rotations = 0;
			this.el.level.innerHTML = this.level;
			this.el.time.innerHTML = this.time;
			this.el.apm.innerHTML = this.apm;
			this.el.lines.innerHTML = this.lines;
			this.el.score.innerHTML = this.score;
			this.el.actions.innerHTML = this.actions;
			this.el.leftMovements.innerHTML = this.leftMovements;
			this.el.rightMovements.innerHTML = this.rightMovements;
			this.el.rotations.innerHTML = this.rotations;
			this.score2 = 0;
			this.time2 = 0;
			this.actions2 = 0;
			this.lines2 = 0;
			this.leftMovements2 = 0;
			this.rightMovements2 = 0;
			this.rotations2 = 0;
			this.el.level2.innerHTML = this.level;
			this.el.time2.innerHTML = this.time;
			this.el.apm2.innerHTML = this.apm;
			this.el.lines2.innerHTML = this.lines;
			this.el.score2.innerHTML = this.score;
			this.el.actions2.innerHTML = this.actions;
			this.el.leftMovements2.innerHTML = this.leftMovements;
			this.el.rightMovements2.innerHTML = this.rightMovements;
			this.el.rotations2.innerHTML = this.rotations;
		};

		/**
		 * Increase time, update apm - update html
		 * This func is called by setInterval()
		 * @return void
		 * @access public event
		 */
		this.incTime = function()
		{
			self.time++;
			self.el.time.innerHTML = self.time;
			self.apm = parseInt((self.actions / self.time) * 60);
			self.el.apm.innerHTML = self.apm;
			self.time2++;
			self.el.time2.innerHTML = self.time2;
			self.apm2 = parseInt((self.actions2 / self.time2) * 60);
			self.el.apm2.innerHTML = self.apm2;
			
		};

		/**
		 * Set score - update html
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setScore = function(i)
		{
			this.score = i;
			this.el.score.innerHTML = this.score;
		};

		this.setScore2 = function(i)
		{
			this.score2 = i;
			this.el.score2.innerHTML = this.score2;
		};

		/**
		 * Set level - update html
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setLevel = function(i)
		{
			this.level = i;
			this.el.level.innerHTML = this.level;
		};

		/**
		 * Set lines - update html
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setLines = function(i)
		{
			this.lines = i;
			this.el.lines.innerHTML = this.lines;
		};
		this.setLines2 = function(i)
		{
			this.lines2 = i;
			this.el.lines2.innerHTML = this.lines2;
		};

		/**
		 * Number of puzzles created on current level
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setPuzzles = function(i)
		{
			this.puzzles = i;
		};

		/**
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setActions = function(i)
		{
			this.actions = i;
			this.el.actions.innerHTML = this.actions;
		};

		this.setActions2 = function(i){
			this.actions2 = i;
			this.el.actions2.innerHTML = this.actions2;
		}
		/**
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setLeftMovements = function(i)
		{
			this.leftMovements = i;
			this.el.leftMovements.innerHTML = this.leftMovements;
		};
	
		this.setLeftMovements2 = function(i)
		{
			this.leftMovements2 = i;
			this.el.leftMovements2.innerHTML = this.leftMovements2;
		};
		/**
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setRightMovements = function(i)
		{
			this.rightMovements = i;
			this.el.rightMovements.innerHTML = this.rightMovements;
		};
		this.setRightMovements2 = function(i)
		{
			this.rightMovements2 = i;
			this.el.rightMovements2.innerHTML = this.rightMovements2;
		};
		/**
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setRotations = function(i)
		{
			this.rotations = i;
			this.el.rotations.innerHTML = this.rotations;
		};

		this.setRotations2 = function(i)
		{
			this.rotations2 = i;
			this.el.rotations2.innerHTML = this.rotations2;
		};
		/**
		 * @return int
		 * @access public
		 */
		this.getScore = function()
		{
			return this.score;
		};
		this.getScore2 = function()
		{
			return this.score2;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getLevel = function()
		{
			return this.level;
		};

		this.getLevel2 = function()
		{
			return this.level2;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getLines = function()
		{
			return this.lines;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getLines2 = function()
		{
			return this.lines2;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getTime = function()
		{
			return this.time;
		};
		this.getTime2 = function()
		{
			return this.time2;
		};

		/**
		 * Number of puzzles created on current level
		 * @return int
		 * @access public
		 */
		this.getPuzzles = function()
		{
			return this.puzzles;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getActions = function()
		{
			return this.actions;
		};

		this.getActions2 = function(){
			return this.actions2;
		};
		/**
		 * @return int
		 * @access public
		 */
		this.getLeftMovements = function()
		{
			return this.leftMovements;
		};
		this.getLeftMovements2 = function()
		{
			return this.leftMovements2;
		};
		/**
		 * @return int
		 * @access public
		 */
		this.getRightMovements = function()
		{
			return this.rightMovements;
		};
		this.getRightMovements2 = function()
		{
			return this.rightMovements2;
		};
		/**
		 * @return int
		 * @access public
		*/
		this.getRotations = function()
		{
			return this.rotations;
		}
		this.getRotations2 = function()
		{
			return this.rotations2;
		}
	}

	/**
	 * Area consists of blocks (2 dimensional board).
	 * Block contains "0" (if empty) or Html Object.
	 * @param int x
	 * @param int y
	 * @param string id
	 */
	function Area(unit, x, y, id, isGarbage)
	{
		this.unit = unit;
		this.x = x;
		this.y = y;
		this.el = document.getElementById(id);

		this.board = [];

		// create 2-dimensional board
		for (var y = 0; y < this.y; y++) {
			this.board.push(new Array());
			for (var x = 0; x < this.x; x++) {
				this.board[y].push(0);
			}
		}

		// Add garbage elements to the newly created board if this is a garbage mode game.
		// In garbage mode, the first 6 lines can spwan with random garbage. The odds that
		// a garbage block is placed in each position is 35%.
		if (isGarbage == true) {
			for (var y = 0; y < this.y; y++) {
				for (var x = 0; x < this.x; x++) {
					if (y > this.y-6 && random(100) < 35) {
						var el = document.createElement("div");
						el.className = "block7";
						el.style.left = x * this.unit + "px";
						el.style.top = y * this.unit + "px";
						this.board[y][x] = el;
						this.el.appendChild(el);
					}
				}
			}
		}

		/**
		 * Removing html elements from area.
		 * @return void
		 * @access public
		 */
		this.destroy = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						this.el.removeChild(this.board[y][x]);
						this.board[y][x] = 0;
					}
				}
			}
		};

		/**
		 * Searching for full lines.
		 * Must go from the bottom of area to the top.
		 * Returns the number of lines removed - needed for Stats.score.
		 * @see isLineFull() removeLine()
		 * @return void
		 * @access public
		 */
		this.removeFullLines = function()
		{
			var lines = 0;
			for (var y = this.y - 1; y > 0; y--) {
				if (this.isLineFull(y)) {
					this.removeLine(y);
					lines++;
					y++;
				}
			}
			return lines;
		};

		/**
		 * @param int y
		 * @return bool
		 * @access public
		 */
		this.isLineFull = function(y)
		{
			for (var x = 0; x < this.x; x++) {
				if (!this.board[y][x]) { return false; }
			}
			return true;
		};

		/**
		 * Remove given line
		 * Remove html objects
		 * All lines that are above given line move down by 1 unit
		 * @param int y
		 * @return void
		 * @access public
		 */
		this.removeLine = function(y)
		{
			for (var x = 0; x < this.x; x++) {
				this.el.removeChild(this.board[y][x]);
				this.board[y][x] = 0;
			}
			y--;
			for (; y > 0; y--) {
				for (var x = 0; x < this.x; x++) {
					if (this.board[y][x]) {
						var el = this.board[y][x];
						el.style.top = el.offsetTop + this.unit + "px";
						this.board[y+1][x] = el;
						this.board[y][x] = 0;
					}
				}
			}
		};

		/**
		 * Add line of random garbage
		 * All lines move up by 1 unit
		 * @return void
		 * @access public
		 */
		this.addGarbageLine = function()
		{
			// Move every existing line up by 1 unit.
			for (var y = 1; y < this.y; y++) {
				for (var x = 0; x < this.x; x++) {
					if (this.board[y][x]) {
						var el = this.board[y][x];
						el.style.top = el.offsetTop - this.unit + "px";
						this.board[y-1][x] = el;
						this.board[y][x] = 0;
					}
				}
			}
			// Add a garbage line at the bottom. There is an 80% chance these lines will contain blocks;
			// it makes sense to make these "blockier" so the player can clear them more easily.
			var numBlocksPlaced = 0;
			for (var x = 0; x < this.x; x++) {
				// Do not place full lines - that's kind of pointless
				if (random(100) < 80 && numBlocksPlaced < this.x-1) {
					var el = document.createElement("div");
					el.className = "block7";
					el.style.left = x * this.unit + "px";
					el.style.top = (this.y-1) * this.unit + "px";
					this.board[this.y-1][x] = el;
					this.el.appendChild(el);
					numBlocksPlaced = numBlocksPlaced + 1;
				}
			}
		}

		/**
		 * @param int y
		 * @param int x
		 * @return mixed 0 or Html Object
		 * @access public
		 */
		this.getBlock = function(y, x)
		{
			if (y < 0) { return 0; }
			if (y < this.y && x < this.x) {
				return this.board[y][x];
			} else {
				throw "Area.getBlock("+y+", "+x+") failed";
			}
		};

		/**
		 * Add Html Element to the area.
		 * Find (x,y) position using offsetTop and offsetLeft
		 * @param object el
		 * @return void
		 * @access public
		 */
		this.addElement = function(el)
		{
			var x = parseInt(el.offsetLeft / this.unit);
			var y = parseInt(el.offsetTop / this.unit);
			if (y >= 0 && y < this.y && x >= 0 && x < this.x) {
				this.board[y][x] = el;
			} else {
				// not always an error ..
			}
		};
	}

	/**
	 * Puzzle consists of blocks.
	 * Each puzzle after rotating 4 times, returns to its primitive position.
	 */
	function Puzzle(tetris, area, singleplayer, sprint, isGarbage, isComp, isCoop)
	{
		var self = this;
		this.tetris = tetris;
		this.area = area;
		this.singleplayer = singleplayer;
		this.sprint = sprint;
		this.isGarbage = isGarbage;
		this.isComp = isComp;
		this.isCoop = isCoop; 

		// timeout ids
		this.fallDownID = null;
		this.forceMoveDownID = null;

		this.number = null; 
		this.type = null; // 0..6
		this.nextType = null; // next puzzle
		this.position = null; // 0..3
		this.speed = null;
		this.running = null;
		this.stopped = null;
		this.sprintGameOver = null;
		this.prevTime = null;

		this.board = []; // filled with html elements after placing on area
		this.elements = [];
		this.nextElements = []; // next board elements


		// (x,y) position of the puzzle (top-left)
		this.x = null;
		this.y = null;

		// width & height must be the same
		this.puzzles = [
			[
				[0,0,1],
				[1,1,1],
				[0,0,0]
			],
			[
				[1,0,0],
				[1,1,1],
				[0,0,0]
			],
			[
				[0,1,1],
				[1,1,0],
				[0,0,0]
			],
			[
				[1,1,0],
				[0,1,1],
				[0,0,0]
			],
			[
				[0,1,0],
				[1,1,1],
				[0,0,0]
			],
			[
				[1,1],
				[1,1]
			],
			[
				[0,0,0,0],
				[1,1,1,1],
				[0,0,0,0],
				[0,0,0,0]
			]
		];


		/**
		 * Reset puzzle. It does not destroy html elements in this.board.
		 * @return void
		 * @access public
		 */
		this.reset = function()
		{
			if (this.fallDownID) {
				clearTimeout(this.fallDownID);
			}
			if (this.forceMoveDownID) {
				clearTimeout(this.forceMoveDownID);
			}
			
			if(singleplayer == true){
				this.number = this.number;
			}
			else{
				this.number = this.number + 1;
			}
			
			this.type = this.nextType;
			this.nextType = random(this.puzzles.length);
			this.position = 0;
			// Sprint mode uses a fixed speed.
			if (sprint == true) {
				this.speed = 300;
			} else {
				this.speed = 80 + (700 / this.tetris.stats.getLevel());
			}
			this.running = false;
			this.stopped = false;
			this.board = [];
			this.elements = [];
			for (var i = 0; i < this.nextElements.length; i++) {
				document.getElementById("tetris-nextpuzzle").removeChild(this.nextElements[i]);
			}
			this.nextElements = [];
			this.x = null;
			this.y = null;
			this.prevTime = 0;
		};

		this.nextType = random(this.puzzles.length);
		this.reset();

		/**
		 * Check whether puzzle is running.
		 * @return bool
		 * @access public
		 */
		this.isRunning = function()
		{
			return this.running;
		};

		/**
		 * Check whether puzzle has been stopped by user. It happens when user clicks
		 * "down" when puzzle is already at the bottom of area. The puzzle may still
		 * be running with event fallDown(). When puzzle is stopped, no actions will be
		 * performed when user press a key.
		 * @return bool
		 * @access public
		 */
		this.isStopped = function()
		{
			return this.stopped;
		};

		/**
		 * Check if the sprint game ended.
		 * @return bool
		 * @access public
		 */
		this.sprintGameEnded = function()
		{
			return this.sprintGameOver;
		};
		/**
		 * Stops the sprint game.
		 * @return void
		 * @access public
		 */
		this.stopSprintGame = function()
		{
			this.sprintGameOver = true;
		};
		/**
		 * Starts the sprint game.
		 * @return void
		 * @access public
		 */
		this.startSprintGame = function()
		{
			this.sprintGameOver = false;
		};
	
		/**
		 * Gets the previous time.
		 * @return int
		 * @access public
		 */
		this.getPrevTime = function()
		{
			return this.prevTime;
		}
		/**
		 * Sets the previous time.
		 * @return void
		 * @access public
		 */
		this.setPrevTime = function(prevTime)
		{
			this.prevTime = prevTime;
		}

		/**
		 * Get X position of puzzle (top-left)
		 * @return int
		 * @access public
		 */
		this.getX = function()
		{
			return this.x;
		};

		/**
		 * Get Y position of puzzle (top-left)
		 * @return int
		 * @access public
		 */
		this.getY = function()
		{
			return this.y;
		};

		/**
		 * Check whether new puzzle may be placed on the area.
		 * Find (x,y) in area where beginning of the puzzle will be placed.
		 * Check if first puzzle line (checking from the bottom) can be placed on the area.
		 * @return bool
		 * @access public
		 */
		this.mayPlace = function()
		{
			var puzzle = this.puzzles[this.type];
			var areaStartX = parseInt((this.area.x - puzzle[0].length) / 2);
			var areaStartY = 1;
			var lineFound = false;
			var lines = 0;
			for (var y = puzzle.length - 1; y >= 0; y--) {
				for (var x = 0; x < puzzle[y].length; x++) {
					if (puzzle[y][x]) {
						lineFound = true;
						if (this.area.getBlock(areaStartY, areaStartX + x)) { return false; }
					}
				}
				if (lineFound) {
					lines++;
				}
				if (areaStartY - lines < 0) {
					break;
				}
			}
			return true;
		};

		/**
		 * Create empty board, create blocks in area - html objects, update puzzle board.
		 * Check puzzles on current level, increase level if needed.
		 * @return void
		 * @access public
		 */
		this.place = function()
		{
			// stats
			this.tetris.stats.setPuzzles(this.tetris.stats.getPuzzles() + 1);
			// The level increases normally in standard mode. In sprint mode, the level does not
			// increase; rather, the speed is fixed. In garbage mode, the level increases every
			// time the player clears 5 lines.
			if (sprint == true) {
				this.tetris.stats.setLevel(1);
			}
			else if (isGarbage == true) {
				this.tetris.stats.setLevel(Math.ceil((this.tetris.stats.getLines() + 1) / 5));
			}
			else if (this.tetris.stats.getPuzzles() >= (10 + this.tetris.stats.getLevel() * 2)) {
				this.tetris.stats.setLevel(this.tetris.stats.getLevel() + 1);
				this.tetris.stats.setPuzzles(0);
			}
			// init
			var puzzle = this.puzzles[this.type];
			var areaStartX = parseInt((this.area.x - puzzle[0].length) / 2);
			var areaStartY = 1;
			var lineFound = false;
			var lines = 0;
			this.x = areaStartX;
			this.y = 1;
			this.board = this.createEmptyPuzzle(puzzle.length, puzzle[0].length);
			// create puzzle

			for (var y = puzzle.length - 1; y >= 0; y--) {
				for (var x = 0; x < puzzle[y].length; x++) {

					if (puzzle[y][x]) {
						lineFound = true;
						var el = document.createElement("div");
						el.className = "block" + this.type;
						el.style.left = (areaStartX + x) * this.area.unit + "px";
						el.style.top = (areaStartY - lines) * this.area.unit + "px";
						this.area.el.appendChild(el);
						this.board[y][x] = el;
						this.elements.push(el);
					}
				}
				if (lines) {
					this.y--;
				}
				if (lineFound) {
					lines++;
			}// end for (var y = puzzle.length - 1; y >= 0; y--)
		}

			this.running = true;
			this.fallDownID = setTimeout(this.fallDown, this.speed);
			// next puzzle
			var nextPuzzle = this.puzzles[this.nextType];


			//Created for different puzzle shapes!

			/*var i =5;

			for (i in nextPuzzle){
				let firstElement = nextPuzzle[i];
				for (let innerArray in nextPuzzle){
					if (nextPuzzle[innerArray][0]===firstElement[0] && i != innerArray){
						for (let k =1; k<firstElement.length;k++){
							firstElement[k] = firstElement[k]+nextPuzzle[innerArray][k];
						}
					}
				}
			}*/

					for (var y = 0; y < nextPuzzle.length; y++) {
						for (var x = 0; x < nextPuzzle[y].length; x++) {
							if (nextPuzzle[y][x]) {
								var el = document.createElement("div");
								el.className = "block" + this.nextType;
								el.style.left = (x * this.area.unit) + "px";
								el.style.top = (y * this.area.unit) + "px";
								document.getElementById("tetris-nextpuzzle").appendChild(el);
								this.nextElements.push(el);

					}
				}
			}//end for (var y = 0; y < nextPuzzle.length; y++)

		};

		/**
		 * Remove puzzle from the area.
		 * Clean some other stuff, see reset()
		 * @return void
		 * @access public
		 */
		this.destroy = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.area.el.removeChild(this.elements[i]);
			}
			this.elements = [];
			this.board = [];
			this.reset();
		};

		/**
		 * @param int y
		 * @param int x
		 * @return array
		 * @access private
		 */
		this.createEmptyPuzzle = function(y, x)
		{
			var puzzle = [];
			for (var y2 = 0; y2 < y; y2++) {
				puzzle.push(new Array());
				for (var x2 = 0; x2 < x; x2++) {
					puzzle[y2].push(0);
				}
			}
			return puzzle;
		};

		/**
		 * Puzzle fall from the top to the bottom.
		 * After placing a puzzle, this event will be called as long as the puzzle is running.
		 * @see place() stop()
		 * @return void
		 * @access event
		 */
		this.fallDown = function()
		{
			// Add additional garbage lines based on what level the user is on. The higher the level,
			// the more often garbage lines wil appear.
			if (isGarbage == true) {
				// Only check once per second to avoid sending multiple lines when only one should be sent.
				if ((this.tetris.stats.getTime() % (16-Math.floor(this.tetris.stats.getLevel()/3)) == 0) && (this.tetris.stats.getTime() != self.getPrevTime())) {
					self.area.addGarbageLine();
				}
				self.setPrevTime(this.tetris.stats.getTime());
			}
			if (self.isRunning() && !self.sprintGameEnded()) {
				if (self.mayMoveDown()) {
					self.moveDown();
					self.fallDownID = setTimeout(self.fallDown, self.speed);
				} else {
					// move blocks into area board
					for (var i = 0; i < self.elements.length; i++) {
						self.area.addElement(self.elements[i]);
					}
					// stats
					var lines = self.area.removeFullLines();
					if (lines) {
						// If lines have been cleared, remove them from the amount the player still needs to clear in sprint mode.
						// Do not increment the score, as the time is the score in this mode.
						if (sprint == true) {
							self.tetris.stats.setLines(self.tetris.stats.getLines() - lines);
							// In Sprint mode, the game ends when the player has cleared 20 lines.
							if (self.tetris.stats.getLines() <= 0) {
								// Stop the board so pieces do not continue to fall after the game ends.
								self.stopSprintGame();
								// In sprint mode, the score is equivalent to the time it took to clear the lines.
								self.tetris.stats.setScore(self.tetris.stats.getTime());
								// Do not display a negative number of lines when the game ends.
								if (self.tetris.stats.getLines() < 0) {
									self.tetris.stats.setLines(0);
								}
								// End the game.
								self.tetris.gameOver(true, true, false);
							}
						} else if (isGarbage == true) {
							// In garbage mode, the score is equivalent to the number of lines cleared.
							self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
							self.tetris.stats.setScore(self.tetris.stats.getLines());
						} 
						else if(isComp == true){
							if( (self.number % 2) == 1){
								self.tetris.stats.setLines2(self.tetris.stats.getLines2() + lines);
								self.tetris.stats.setScore2(self.tetris.stats.getScore2() + (1000 * self.tetris.stats.getLevel() * lines) );
							}
							else{
								self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
								self.tetris.stats.setScore(self.tetris.stats.getScore() + (1000 * self.tetris.stats.getLevel() * lines) );
							}
						}
						else {
							self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
							self.tetris.stats.setScore(self.tetris.stats.getScore() + (1000 * self.tetris.stats.getLevel() * lines));
						}
					}
					// reset puzzle
					self.reset();
					if (self.mayPlace()) {
						self.place();
					} else {
						self.tetris.gameOver(sprint, false, isGarbage);
					}
				}
			}
		};

		/**
		 * After clicking "space" the puzzle is forced to move down, no user action is performed after
		 * this event is called. this.running must be set to false. This func is similiar to fallDown()
		 * Also update score & actions - like Tetris.down()
		 * @see fallDown()
		 * @return void
		 * @access public event
		 */
		this.forceMoveDown = function()
		{
			if ((!self.isRunning() && !self.isStopped()) && !self.sprintGameEnded()) {
				if (self.mayMoveDown()) {
					// stats: score, actions
					if (sprint == false && isGarbage == false) {
						self.tetris.stats.setScore(self.tetris.stats.getScore() + 5 + self.tetris.stats.getLevel());
					}
					self.tetris.stats.setActions(self.tetris.stats.getActions() + 1);
					self.moveDown();
					self.forceMoveDownID = setTimeout(self.forceMoveDown, 30);
				} else {
					// move blocks into area board
					for (var i = 0; i < self.elements.length; i++) {
						self.area.addElement(self.elements[i]);
					}
					// stats: lines
					var lines = self.area.removeFullLines();
					if (lines) {
						// If lines have been cleared, remove them from the amount the player still needs to clear in sprint mode.
						// Do not increment the score, as the time is the score in this mode.
						if (sprint == true) {
							self.tetris.stats.setLines(self.tetris.stats.getLines() - lines);
							// In Sprint mode, the game ends when the player has cleared 20 lines.
							if (self.tetris.stats.getLines() <= 0) {
								// Stop the board so pieces do not continue to fall after the game ends.
								self.stopSprintGame();
								// In sprint mode, the score is equivalent to the time it took to clear the lines.
								self.tetris.stats.setScore(self.tetris.stats.getTime());
								// Do not display a negative number of lines when the game ends.
								if (self.tetris.stats.getLines() < 0) {
									self.tetris.stats.setLines(0);
								}
								// End the game.
								self.tetris.gameOver(true, true, false);
							}
						} else if (isGarbage == true) {
							// In garbage mode, the score is equivalent to the number of lines cleared.
							self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
							self.tetris.stats.setScore(self.tetris.stats.getLines());
						} 
						else if(isComp == true){
							if( (this.number) % 2 == 1){
								self.tetris.stats.setLines2(self.tetris.stats.getLines2() + lines);
								self.tetris.stats.setScore2(self.tetris.stats.getScore2() + (1000 * self.tetris.stats.getLevel2() * lines) );
							}
							else{
								self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
								self.tetris.stats.setScore(self.tetris.stats.getScore() + (1000 * self.tetris.stats.getLevel() * lines));
							}
						}
						else {
							self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
							self.tetris.stats.setScore(self.tetris.stats.getScore() + (1000 * self.tetris.stats.getLevel() * lines));
						}
					}
					// reset puzzle
					self.reset();
					if (self.mayPlace()) {
						self.place();
					} else {
						self.tetris.gameOver(sprint, false, isGarbage);
					}
				}
			}
		};

		/**
		 * Stop the puzzle falling
		 * @return void
		 * @access public
		 */
		this.stop = function()
		{
			this.running = false;
		};

		/**
		 * Check whether puzzle may be rotated.
		 * Check down, left, right, rotate
		 * @return bool
		 * @access public
		 */
		this.mayRotate = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						var newY = this.getY() + this.board.length - 1 - x;
						var newX = this.getX() + y;
						if (newY >= this.area.y) { return false; }
						if (newX < 0) { return false; }
						if (newX >= this.area.x) { return false; }
						if (this.area.getBlock(newY, newX)) { return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Rotate the puzzle to the left.
		 * @return void
		 * @access public
		 */
		this.rotate = function()
		{
			var puzzle = this.createEmptyPuzzle(this.board.length, this.board[0].length);
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						var newY = puzzle.length - 1 - x;
						var newX = y;
						var el = this.board[y][x];
						var moveY = newY - y;
						var moveX = newX - x;
						el.style.left = el.offsetLeft + (moveX * this.area.unit) + "px";
						el.style.top = el.offsetTop + (moveY * this.area.unit) + "px";
						puzzle[newY][newX] = el;
					}
				}
			}
			this.board = puzzle;
		};

		/**
		 * Check whether puzzle may be moved down.
		 * - is any other puzzle on the way ?
		 * - is it end of the area ?
		 * If false, then true is assigned to variable this.stopped - no user actions will be performed to this puzzle,
		 * so this func should be used carefully, only in Tetris.down() and Tetris.puzzle.fallDown()
		 * @return bool
		 * @access public
		 */
		this.mayMoveDown = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						if (this.getY() + y + 1 >= this.area.y) { this.stopped = true; return false; }
						if (this.area.getBlock(this.getY() + y + 1, this.getX() + x)) { this.stopped = true; return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Move the puzzle down by 1 unit.
		 * @return void
		 * @access public
		 */
		this.moveDown = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style.top = this.elements[i].offsetTop + this.area.unit + "px";
			}
			this.y++;
		};

		/**
		 * Check whether puzzle may be moved left.
		 * - is any other puzzle on the way ?
		 * - is the end of the area
		 * @return bool
		 * @access public
		 */
		this.mayMoveLeft = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						if (this.getX() + x - 1 < 0) { return false; }
						if (this.area.getBlock(this.getY() + y, this.getX() + x - 1)) { return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Move the puzzle left by 1 unit
		 * @return void
		 * @access public
		 */
		this.moveLeft = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style.left = this.elements[i].offsetLeft - this.area.unit + "px";
			}
			this.x--;
		};

		/**
		 * Check whether puzle may be moved right.
		 * - is any other puzzle on the way ?
		 * - is the end of the area
		 * @return bool
		 * @access public
		 */
		this.mayMoveRight = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						if (this.getX() + x + 1 >= this.area.x) { return false; }
						if (this.area.getBlock(this.getY() + y, this.getX() + x + 1)) { return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Move the puzzle right by 1 unit.
		 * @return void
		 * @access public
		 */
		this.moveRight = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style.left = this.elements[i].offsetLeft + this.area.unit + "px";
			}
			this.x++;
		};
	}

	/**
	 * Generates random number that is >= 0 and < i
	 * @return int
	 * @access private
	 */
	function random(i)
	{
		return Math.floor(Math.random() * i);
	}

	/**
	 * Store highscores in cookie.
	 */
	function Highscores(maxscores)
	{
		this.maxscores = maxscores;
		this.scores = [];

		/**
		 * Load scores from cookie.
		 * Note: it is automatically called when creating new instance of object Highscores.
		 * @return void
		 * @access public
		 */
		this.load = function()
		{
			var cookie = new Cookie();
			var s = cookie.get("tetris-highscores");
			this.scores = [];
			if (s.length) {
				var scores = s.split("|");
				for (var i = 0; i < scores.length; ++i) {
					var a = scores[i].split(":");
					this.scores.push(new Score(a[0], Number(a[1])));
				}
			}
		};

		/**
		 * Save scores to cookie.
		 * Note: it is automatically called after adding new score.
		 * @return void
		 * @access public
		 */
		this.save = function()
		{
			var cookie = new Cookie();
			var a = [];
			for (var i = 0; i < this.scores.length; ++i) {
				a.push(this.scores[i].name+":"+this.scores[i].score);
			}
			var s = a.join("|");
			cookie.set("tetris-highscores", s, 3600*24*1000);
		};

		/**
		 * Is the score high enough to be able to add ?
		 * @return bool
		 * @access public
		 */
		this.mayAdd = function(score, isSprint)
		{
			if (this.scores.length < this.maxscores) { return true; }
			for (var i = this.scores.length - 1; i >= 0; --i) {
				if (isSprint == false) {
					if (this.scores[i].score < score) { return true; }
				} else {
					if (this.scores[i].score > score) { return true; }
				}
			}
			return false;
		};

		/**
		 * @param string name
		 * @param int score
		 * @return void
		 * @access public
		 */
		this.add = function(name, score, isSprint)
		{
			name = name.replace(/[;=:|]/g, "?");
			name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			if (this.scores.length < this.maxscores) {
				this.scores.push(new Score(name, score));
			} else {
				for (var i = this.scores.length - 1; i >= 0; --i) {
					if (isSprint == false) {
						if (this.scores[i].score < score) {
							this.scores.removeByIndex(i);
							this.scores.push(new Score(name, score));
							break;
						}
					} else {
						if (this.scores[i].score > score) {
							this.scores.removeByIndex(i);
							this.scores.push(new Score(name, score));
							break;
						}
					}
				}
			}
			this.sort(isSprint);
			this.save();
		};

		/**
		 * Get array of scores.
		 * @return array [Score, Score, ..]
		 * @access public
		 */
		this.getScores = function()
		{
			return this.scores;
		};

		/**
		 * All highscores returned in html friendly format.
		 * @return string
		 * @access public
		 */
		this.toHtml = function(isSprint, isGarbage)
		{
			// Show a different table header depending on which high scores are being shown.
			if (isSprint == true) {
				var s = '<br>Sprint Highscores</br>';
			} else if (isGarbage == true) {
				var s = '<br>Garbage Highscores</br>';
			} else {
				var s = '<br>Normal Highscores</br>';
			}
			s += '<table cellspacing="0" cellpadding="2"><tr><th></th><th>Name</th><th>Score</th></tr>';
			for (var i = 0; i < this.scores.length; ++i) {
				s += '<tr><td>?.</td><td>?</td><td>?</td></tr>'.format(i+1, this.scores[i].name, this.scores[i].score);
			}
			s += '</table>';
			return s;
		};

		/**
		 * Sort table with scores.
		 * @return void
		 * @access private
		 */
		this.sort = function(isSprint)
		{
			var scores = this.scores;
			var len = scores.length;
			this.scores = [];
			for (var i = 0; i < len; ++i) {
				var el = null, index = null;
				for (var j = 0; j < scores.length; ++j) {
					if (isSprint == false) {
						if (!el || (scores[j].score > el.score)) {
							el = scores[j];
							index = j;
						}
					} else {
						if (!el || (scores[j].score < el.score)) {
							el = scores[j];
							index = j;
						}
					}
				}
				scores.removeByIndex(index);
				this.scores.push(el);
			}
		};

		/* Simple score object. */
		function Score(name, score)
		{
			this.name = name;
			this.score = score;
		}

		this.load();
	}

	/**
	 * Managing cookies.
	 */
	function Cookie()
	{
		/**
		 * @param string name
		 * @return string
		 * @access public
		 */
		this.get = function(name)
		{
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; ++i) {
				var a = cookies[i].split("=");
				if (a.length == 2) {
					a[0] = a[0].trim();
					a[1] = a[1].trim();
					if (a[0] == name) {
						return unescape(a[1]);
					}
				}
			}
			return "";
		};

		/**
		 * @param string name
		 * @param string value (do not use special chars like ";" "=")
		 * @param int seconds
		 * @param string path
		 * @param string domain
		 * @param bool secure
		 * @return void
		 * @access public
		 */
		this.set = function(name, value, seconds, path, domain, secure)
		{
			this.del(name);
			if (!path) path = '/';

			var cookie = (name + "=" + escape(value));
			if (seconds) {
				var date = new Date(new Date().getTime()+seconds*1000);
				cookie += ("; expires="+date.toGMTString());
			}
			cookie += (path    ? "; path="+path : "");
			cookie += (domain  ? "; domain="+domain : "");
			cookie += (secure  ? "; secure" : "");
			document.cookie = cookie;
		};

		/**
		 * @param name
		 * @return void
		 * @access public
		 */
		this.del = function(name)
		{
			document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT";
		};
	}
}

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s*|\s*$/g, "");
	};
}

if (!Array.prototype.removeByIndex) {
	Array.prototype.removeByIndex = function(index) {
		this.splice(index, 1);
	};
}

if (!String.prototype.format) {
	String.prototype.format = function() {
		if (!arguments.length) { throw "String.format() failed, no arguments passed, this = "+this; }
		var tokens = this.split("?");
		if (arguments.length != (tokens.length - 1)) { throw "String.format() failed, tokens != arguments, this = "+this; }
		var s = tokens[0];
		for (var i = 0; i < arguments.length; ++i) {
			s += (arguments[i] + tokens[i + 1]);
		}
		return s;
	};
}
