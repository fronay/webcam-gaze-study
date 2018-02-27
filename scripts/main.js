/* --- Doc ready loop ---- */ 
$(document).ready(function () {
	
	console.log("Grid created "+  createGrid());
	//listenForClick();
	

	// $("body").hide();
	// $("#wrapper").show();
	
	// declare global round presets arrays
	$("#wrapper").hide();
	$("#quitbuttondiv").hide();
	$("#drawbuttondiv").hide();
	//$('<div id="click-div" style="width:40px;height:40px;background-color:red;z-index:2;position:fixed;bottom:0;></div>').appendTo("#superbody");
	currentRound = 0;
	currentSector = 0;
	lastSecondSector = 99;
	pleaseMarkDivs = false;
	globalSaveData = [];
	// intended milliseconds per tracking & logging frame:
	// in reality, would be about 10ms more than that depending on browser speed...
	trackingInterval = 20;
	// EDIT - SAVE
	//globalTimingData = [];
	// read in csv file with round presets
	parseCSV();
	// listen for quit hotkey, prevent scrolling
	listenForSpecialButtons();
	// listenForClick();
	// ---- 1. Welcome message and first instructions ----
	var welcomeLoopCounter = 1;
	setUpWelcome(welcomeLoopCounter);
	// demonstration rounds
	// ---- 2. Calibration ----
	// start calibration screens once start event has been observed
	// ---- 3. Loop over trials
	// ---- 4. Thank you screen
	// endExperiment();
	
	

});

/* --- Actual function declarations --- */ 

function listenForClick() {
	$("body").click(function (e) { 
	   //Default mouse Position 
       console.log(e.pageX + ' , ' + e.pageY);
       // var clickDiv = '<div id="#click-div" style="width:20px;height:20px;background-color:red;z-index:2;position:fixed;bottom:' + 0+';'+'right:' + 0 + ';></div>';
       $("#clicker").css({top: e.pageY, left: e.pageX});
    });

}

function listenForSpecialButtons() {
	$("#quitbuttondiv").hide();
	$("#drawbuttondiv").hide();
	// if q pressed, go to exit screen
	$(document).keydown(function(e) {
		if (e.keyCode == 81) {
			// delete this at some point
			// endExperiment();
			//
			console.log("detected q, showing end-button");
			e.preventDefault();
			$("#quitbuttondiv").show();
		}
		else if (e.keyCode == 68) {
			console.log("detected d, showing draw-button");
			e.preventDefault();
			$("#drawbuttondiv").show();
		}
	});
	// if button is visible to click, do this:
	$("#quit-button").click(function() {
		endExperiment();
	});
	$("#dont-quit-button").click(function(){
		$("#quitbuttondiv").hide();

	});
	$("#draw-button").click(function() {
		// TODO: complete this
		console.log("hit draw visualisation, does nothing atm");
	});
	$("#dont-draw-button").click(function() {
		$("#drawbuttondiv").hide();
		trackedExperiment();
	});
}

function drawScreen() {
	//TODO: complete this.
}

function parseCSV() {
	// round - outcome - fixation_time - fractal_time -square_time - outcome_time
	ROUND = [];
	FRACTAL_TYPE = []
	OUTCOME = [];
	FIXATION_TIME = [];
	FRACTAL_TIME = [];
	SQUARE_TIME = [];
	OUTCOME_TIME = [];
	d3.text("RundenVorgaben.csv", function(text) {
		console.log("parsing csv");
		var csv = d3.csvParseRows(text);
		MAX_ROUNDS = csv.length;
		var header =  csv.shift();
		csv.forEach(function(row) {
			convertedRow = rowConvert(row);
			// this could be done more concisely but anyway here goes:
			ROUND.push(convertedRow[0]);
			FRACTAL_TYPE.push(convertedRow[1]);
			OUTCOME.push(convertedRow[2]);
			FIXATION_TIME.push(convertedRow[3]);
			FRACTAL_TIME.push(convertedRow[4]);
			SQUARE_TIME.push(convertedRow[5]);
			OUTCOME_TIME.push(convertedRow[6]);
		});
		console.log("header: " + header);
		console.log("first row: "+ csv[1]);
	});

}

function rowConvert(row) {
	var splitRow = row[0].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
	splitRow.forEach(function(entry, index, theArray){
		if (!isNaN(Number(entry))) {
			theArray[index] = Number(entry);
		}
	});
	return splitRow;
}


function setUpWelcome(welcomeLoopCounter) {
	console.log("setting up welcome screens and participant id form");
	// console.log("here's the OUTCOME array to check we've imported all right:");
	// console.log(OUTCOME);
	// register participant ID and continue to welcome screens:
	$("#participant-id-submit-button").click(function(e) {
		participantID = $("#participant-id-input").val()
		console.log(participantID);
		$("#participant-id-div").hide();
		$("#welcome-msg").show();
	});

	// cycle through remaining divs based on "next" button
	$(".next-button").click(function(e) {
		// check if we still have some divs left to go:
		if (welcomeLoopCounter < $("#instructions").children().length) {
			// hide all others child divs, but show currently active one:
			hideAllChildren("#instructions");
			$("#instructions").children().eq(welcomeLoopCounter).show();
			welcomeLoopCounter += 1;
			}
		else {
			// hide divs, unbind event
			hideAllChildren("#instructions");
			// and begin next stage
			clickDemoScreen(true);
			}
		});
}

function hideAllChildren(divID) {
	$(divID).children().each(function(elem) {
		$(this).hide();
	});
}

function clickDemoScreen(isClickRound) {
	// show the three sectors of experiment screen
	$("#experiment-screen").show();
	console.log("entered interactive-click demo round");

	var demoFixationTime = 2000;
	var demoFractalTime = 3000;
	var demoClickTime = 1500;
	var demoRewardTime = 1500;
	// First time out: show fixation sign for 2 seconds, then hide.
	$("#fixation-sign").show();
	setTimeout(function() {
		// Second time out: show fractal for 3 seconds, then hide
		$("#fixation-sign").hide();
		$("#fractal-img").show();
		setTimeout(function() {
			// thirdly, either end with click of 3rd timeout depending on demo round
			$("#fractal-img").hide();
			$("#right-imgbox").css("background-color", "black");
			$("#experiment-instruction-div").css("opacity", 1.0);
			// explicitly make sure isClickRound was set, hence not just "if (clickRound)"
			if (isClickRound === true) {
				// on space bar, unhide rectangle
				$(window).keydown(function(e) {
				if (e.keyCode == 32) {
					e.preventDefault();
					$(window).off("keydown");
					$("#reward-img").show();
					$("#right-imgbox").css("background-color", "#bbb");
					setTimeout(function() {
						$(window).off("keydown");
						$("#reward-img").hide();
						// show intermediate explanation div 
						$("#experiment-screen").hide();
						$("#no-click-demo-round").show();
						$("#no-click-round-next-button").click(function() {
							$("#no-click-demo-round").hide();
							// change text and call demoScreen again
							$("#experiment-instruction-div").text("Drücken Sie jetzt KEINE Taste!")
							clickDemoScreen(false);
							});
						}, demoRewardTime);
					}
				});
			}
			else if (isClickRound === false) {
				console.log("NO CLICK ROUND");
				$(window).off("keydown");
				setTimeout(function() {
					$("#reward-img").show();
					$("#right-imgbox").css("background-color", "#bbb");
					setTimeout(thatWasEasyMsg, demoClickTime);
				}, demoRewardTime);
			}	
		}, demoFractalTime);
	}, demoFixationTime)
}

function thatWasEasyMsg() {
	$("#reward-img").hide();
	$("#experiment-instruction-div").css("opacity", 0.0);
	$("#experiment-screen").hide();
	$("#that-was-easy-msg").show();
	$("#right-imgbox").css("background-color", "#bbb");
	$("#next-calibration-msg-button").click(function() {
		moreInfoOnCalibration();
	});
}

function moreInfoOnCalibration() {
	$("#that-was-easy-msg").hide();
	$("#click-the-icons-msg").show();
	$("#start-calibration-button").click(function() {
		console.log("demo stuff ended, clicked start calibration button");
		$("#click-the-icons-msg").hide();
		// now set up webgazer, and start calibration screen...
		setUpWebGaze();
		mouseCalibrationScreen(true);
	});
}

	

function shuffle(array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function mouseCalibrationScreen(demoMode) {
	$("*").css("cursor", "auto");
	// recolor screen so people understand something else is happening :)
	console.log("setting up calibration, round is :" + currentRound);
	// show experiment screen 
	$("#experiment-screen").show();
	/*------- Grid-based calibration experiment-------*/ 
	clickIndices = createGrid();
	$("#wrapper").show();
	if (demoMode==false) {
		$("#calibrationPopUp").show();
		setTimeout(function() {
			$("#calibrationPopUp").hide();
		}, 1000);
	}
	// initial four clicks: if clicked, show next one 
	// then if wanted, click four more random ones
	$(clickIndices[0]).css("background", "CornflowerBlue");
	$(clickIndices[0]).prepend("<img class='mini-reticle' src='img/mark.png'>");
	console.log("prepended some stuff already");
	calibrationClickCounter = 1;
	$(document).on("click", ".mini-reticle", function() {
		// first, mark the four "must-have" clickable corners one after the other:
		$(".mini-reticle").remove(); // hide previous if applicable
		if (calibrationClickCounter < 4) {
			console.log("sub-4 happening");
			targetClickDiv = clickIndices[calibrationClickCounter];
		}
		else if (calibrationClickCounter == 4 && demoMode == true)	{
			console.log("equals-4 happening under true demo");
			randChoice = getRandom(clickGrid, 4)
			subRandomCounter = 0;
			targetClickDiv = "#"+randChoice[subRandomCounter];
			subRandomCounter += 1;
		}
		else if (calibrationClickCounter == 4 && demoMode == false) {
			console.log("more-4 happening under false demo");
			$("#wrapper").hide();
			$(".mini-reticle").remove();
			$(document).off("click");
			trackedExperiment();
			return 0;
		}
		else if (calibrationClickCounter > 7 && demoMode == true) {
			console.log("more-7 under true demo; hide wrapper etc");
			$("#wrapper").hide();
			$(".mini-reticle").remove();
			$(document).off("click");
			preTaskCountdown();
			return 0;
		}
		else if (calibrationClickCounter > 4 && demoMode == true) {
			console.log("more-4 under true demo; hide wrapper etc");
			targetClickDiv = "#"+randChoice[subRandomCounter];
			subRandomCounter += 1;
		}
		console.log("calibration click counter : "+ calibrationClickCounter + "  targetClickDiv: " + targetClickDiv);
		if(typeof targetClickDiv !== "undefined") {
			$(targetClickDiv).css("background", "CornflowerBlue");
			$(targetClickDiv).prepend("<img class='mini-reticle' src='img/mark.png'>");
			}
		else if (typeof targetClickDiv == "undefined") {
			trackedExperiment();
		}
		calibrationClickCounter += 1;
	});
}
	/* 
	// ------ Previous single reticle calibration experiment
	// -- initalise calibration marks, show mouse calibration message 
	// $("#reticle").show();
	$("#reticle").css("z-index","1");
	$("#mouse-calib").show();
	// $("#second-mouse-calib").hide();
	var calibrationMarks = ["#right-mark", "#center-mark", "#left-mark"];
	shuffle(calibrationMarks);
	$(calibrationMarks[0]).show();
	var len = calibrationMarks.length;
	var calibrationCycles = 1;
	var calibrationCounter = 0;
	console.log("calib counter: " + calibrationCounter);
	function calcInd(c, len) {
		// return index "ind" when looping "c" times through array of length "len" 
		var ind = c - len*Math.floor(c/len);
		return ind;
	}

	function calibrationClickHandler(demoMode) {
		if (calibrationCounter == 0) {
			// swap out messages
			// $("#second-mouse-calib").show();
			$("#first-mouse-calib").css("opacity", 0.0);
		}
		// check if haven't exceeded cycles:
		if (calibrationCounter < calibrationCycles*len-1) {
			// get indices
			var currentInd = calcInd(calibrationCounter, calibrationMarks.length)
			var nextInd = calcInd(calibrationCounter + 1, calibrationMarks.length)
			// hide current, show next
			$(calibrationMarks[currentInd]).hide();
			$(calibrationMarks[nextInd]).show();
			// increment counter
			calibrationCounter += 1;
		}
		else {
			console.log("hiding all calibration marks");
			// hide all calibration marks again
			calibrationMarks.forEach(function(elem) {
				$(elem).hide();
			});
			// unbind calibration click handler
			$(".calibration-img").off("click");

			// start Eye Calibration (??)
			// TBD

			if (demoMode === true) {
				console.log("starting pre-task countdown");
				preTaskCountdown();		
			}
			else if (demoMode === false) {
				console.log("re-entering trackedExperiment");
				trackedExperiment();
			}
		}
	}

	$(".calibration-img").click(function(e) {
		calibrationClickHandler(demoMode);
	});
}
	*/


function eyeCalibrationScreen() {
	// TODO: expand this to test that calibration is working
	$("#mouse-calib").hide();
	$("#eye-calib").show();
	// Show a symbol and start recording eye stuff
	actOnDirectionNextSecond(-1, 0);
	// TODO: move this eye movement tracking session somewhere else:
	// start main task loop

	// start pretask (?)
	// ...
}

/*
function actOnDirectionNextSecond(direction, divind) {
	var calibrationMarks = ["#right-mark", "#center-mark", "#left-mark"];
	$(calibrationMarks[divind]).show();
	console.log("(re-)starting direction-last-second loop");
	var sumDirections = 0;
	var sumPred = setInterval(function() {
		sumDirections += currentSector;
	}, 100); 
	setTimeout(function() {
		clearInterval(sumPred);
		if (sumDirections < -7) {
			console.log("looked hard left " + sumDirections);
			lastSecondSector = -1;
		}
		else if (sumDirections > 7) {
			console.log("looked hard right " + sumDirections);
			lastSecondSector = 1;
		}
		else {
			console.log("I dunno, but here's sumDirections anyway: " + sumDirections);
			lastSecondSector = 0;
		}
		if (lastSecondSector == direction) {
			$(calibrationMarks[divind]).hide();
			if (divind < 2) {
				$(calibrationMarks[divind+1]).show();
				actOnDirectionNextSecond(direction+1, divind+1);
			}
			else {
				preTaskCountdown();
			}
		}
		else {
			actOnDirectionNextSecond(direction, divind, isdemo);
		}
	}, 1000);
}

*/ 

function preTaskCountdown() {
	console.log("pre-task loop message");
	$("#experiment-screen").hide();
	$("#about-to-start-msg").show();
	var countdownSeconds = 4;
	var preLoopCountdown = setInterval(function(){
		countdownSeconds -= 1;
		$("#pre-loop-countdown").text(countdownSeconds + "...");
		}, 1000);
	setTimeout(function() {
		clearInterval(preLoopCountdown);
		$("#about-to-start-msg").hide();
		console.log("starting task loop");
		$("#experiment-screen").show();
		trackedExperiment();
	}, 4000);

	// show stuff
}

function trackedExperiment() {
	$("*").css("cursor", "none");
	console.log("entered interactive-click round");
	console.log("here are the round presets: ");
	// increment global round counter here - it starts at zero and reliably with trackedExperiment start 
	// then load the round presets
	// REMINDER: round - fractal_type - outcome - fixation_time - fractal_time - square_time - outcome_time
	currentRound += 1;
	if (currentRound <= MAX_ROUNDS) {
		// minus one due to 0-based JS indexing
		presetIndex = currentRound-1;
		var currentOutcome = OUTCOME[presetIndex];
		var currentFractalType = FRACTAL_TYPE[presetIndex];
		var currentFixationTime = FIXATION_TIME[presetIndex];
		var currentFractalTime = FRACTAL_TIME[presetIndex];
		var currentSquareTime = SQUARE_TIME[presetIndex];
		var currentOutcomeTime = OUTCOME_TIME[presetIndex];
		var presetMessage = "round nr.: " + currentRound + "\n";
		// extra tracking variable for position of target divs to make sure nothing has changed
		presetMessage += "outcome: " + currentOutcome + "\n";
		presetMessage += "fractal type: " + currentFractalType+ "\n";
		console.log(presetMessage);
		// set fractal image and reward for this round based on round-presets:
		$("#fractal-img").attr("src",  "img/" + currentFractalType + ".png");
		$("#reward-img").attr("src",  "img/" + currentOutcome + ".png");
		// START TRACKING HERE
		// create row for round array to append to global datastructure
		var roundSaveData = [];
		// EDIT - SAVE
		// var roundTimingData = [];
		roundSaveData.currentRound = currentRound;
		roundSaveData.fractalType = currentFractalType;
		roundSaveData.outcome = currentOutcome;
		var intervalCounter = 0;
		// First time out: show fixation sign for 2 seconds, then hide.
		$("#fixation-sign").show();
		var currentFixationPositionX = Math.round($("#fixation-sign").offset().top);
		var currentFixationPositionY = Math.round($("#fixation-sign").offset().left);
		roundSaveData.fixationPositionX = currentFixationPositionX;
		roundSaveData.fixationPositionY = currentFixationPositionY;
		var fixationTimeOut = setTimeout(function() {
			// Second time out: show fractal for 3 seconds, then hide
			$("#fixation-sign").hide();
			$("#fractal-img").show();
			// log the position of the fractal Div
			var currentFractalPositionX = Math.round($("#fractal-img").offset().top);
			var currentFractalPositionY = Math.round($("#fractal-img").offset().left);
			console.log("fractal position is - top - "+ currentFractalPositionX + " left - " + currentFractalPositionY);
			console.log("putative center is - top - "+ (currentFractalPositionX + 150) + " left - " + (currentFractalPositionY + 150));
			roundSaveData.fractalPositionX = currentFractalPositionX;
			roundSaveData.fractalPositionY = currentFractalPositionY;
			var startTrackTime = new Date();
			roundSaveData.startFractalTime = startTrackTime;
			// pre-initalise, update later:
			roundSaveData.endFractalTime = "NaN";
			roundSaveData.elapsedFractalTime = "NaN";
			roundSaveData.rewardStartTime = "NaN";
			roundSaveData.rewardEndTime = "NaN";
			roundSaveData.rewardElapsedTime = "NaN";
			roundSaveData.trackingInterval = trackingInterval;
			// pre-initialise header for roundSaveData
			var numIntervalKeys = Math.round(currentFractalTime / (trackingInterval+10));
			console.log("cfTime: "+ currentFractalTime + " trackingInterval : "+ trackingInterval +"therefore num-intervals:"+ numIntervalKeys);
			for (grr = 1; grr < numIntervalKeys; grr++) {
				var tk = "t_#" + grr;
				var xk = "x_#" + grr;
				var yk = "y_#" + grr;
    			roundSaveData[tk] = "NaN";
				roundSaveData[xk] = "NaN";
				roundSaveData[yk] = "NaN"; 
			}
			var gazeTracker = setInterval(function() {
				// in this part, update the pre-generated array with actual timestamps
				// NaNs stay NaN if not updated
				var midTrackTime = new Date() - startTrackTime;
				prediction = webgazer.getCurrentPrediction();
				var x_coord = prediction.x;
				var y_coord = prediction.y;
				intervalCounter += 1;
				if (intervalCounter <= numIntervalKeys) {
					var timeKey = "t_#" + intervalCounter;
					var intervalKeyX = "x_#" + intervalCounter;
					var intervalKeyY = "y_#" + intervalCounter;
					//roundTimingData[timeKey] = midTrackTime; 

					// EDIT - SAVE
					roundSaveData[intervalKeyX] = x_coord;
					roundSaveData[intervalKeyY] = y_coord;
					roundSaveData[timeKey] = midTrackTime; 
				}
				/*
				roundTimingData[intervalKeyX] = x_coord;
				roundTimingData[intervalKeyY] = y_coord;
				*/
				// console.log("time: " + midTrackTime + " x_coord: " + x_coord + " y_coord:" + y_coord);
			}, trackingInterval);
			var fractalTimeout = setTimeout(function() {
				// STOP TRACKING AFTER 5000ms...
				// SHOW REWARD and wait for TIMEOUT or KEYPRESS
				clearInterval(gazeTracker);
				var endTrackTime = new Date();
				var elapsedTrackTime = endTrackTime - startTrackTime;
				roundSaveData.endFractalTime = endTrackTime;
				roundSaveData.elapsedFractalTime = elapsedTrackTime;
				console.log("time elapsed" + elapsedTrackTime);
				$("#fractal-img").hide();
				$("#right-imgbox").css("background-color", "black");
				roundSaveData.rewardStartTime = new Date();

				// Setup listener  to SHOW REWARD IF SPACEBAR...
				$(window).keydown(function(e) {
					if (e.keyCode == 32) {
						$(window).off("keydown");
						clearTimeout(rewardTimeout);
						console.log("ending round " + roundSaveData.currentRound + " by clicking");
						roundSaveData.rewardEndTime = new Date();
						roundSaveData.rewardElapsedTime = roundSaveData.rewardEndTime - roundSaveData.rewardStartTime;
						globalSaveData.push(roundSaveData);
						// EDIT - SAVE
						//globalTimingData.push(roundTimingData);
						e.preventDefault();
						$("#reward-img").show();
						$("#right-imgbox").css("background-color", "#bbb");
						setTimeout(function() {
							// THEN NEXT ONE
							$("#reward-img").hide();
							console.log("debuggo! CALLING MOUSE CALIB at CLICK_SPACE of fractal");
							conditionalMouseCalibration(currentRound);
						}, currentOutcomeTime);
					}	
				});

				// Setup timer to SHOW REWARD IF TIMEOUT...
				var rewardTimeout = setTimeout( function() {
					$(window).off("keydown");
					console.log("ending round " + roundSaveData.currentRound + " by timeout");
					roundSaveData.rewardEndTime = new Date();
					roundSaveData.rewardElapsedTime = roundSaveData.rewardEndTime - roundSaveData.rewardStartTime;
					globalSaveData.push(roundSaveData);
					// EDIT - SAVE
					//globalTimingData.push(roundTimingData);
					$("#reward-img").show();
					$("#right-imgbox").css("background-color", "#bbb");
					setTimeout(function() {
						// THEN NEXT ONE
						$("#reward-img").hide();
						console.log("debuggo! CALLING MOUSE CALIB at TIMEOUT of fractal");
						conditionalMouseCalibration(currentRound);
					}, currentOutcomeTime);
				}, currentSquareTime);
			}, currentFractalTime);
		}, currentFixationTime);
	}
	else {
		endExperiment();
	}
}

function conditionalMouseCalibration (r) {
	if (r>0 && r%2 ==0) {
		mouseCalibrationScreen(false);
	}
	else {
		trackedExperiment();
	}
}

function endExperiment() {
	$("#experiment-screen").remove();
	$("#wrapper").remove();
	$("*").css("cursor", "auto");
	$("#end-screen").show();
	console.log("ending experiment, here's the raw data:")
	console.log("length of globalSaveData: " + globalSaveData.length);
	csvContent = "data:text/csv;charset=utf-8,";
	// create csv header:
	var csvHeader = [];
	Object.keys(globalSaveData[0]).forEach(function(key) {
		csvHeader.push(key);
	});
	// EDIT - SAVE
	/*
	Object.keys(globalTimingData[0]).forEach(function(key) {
		csvHeader.push(key);
	});*/
	csvContent += csvHeader.join(",") + "\r\n";

	// EDIT - SAVE
	globalSaveData.forEach(function(roundObject, combinedIndex){
		var formattedRow = [];
		Object.keys(roundObject).forEach(function(key,index) {
			formattedRow.push(roundObject[key]);
		    // key: the name of the object key
		    // index: the ordinal position of the key within the object 
		});
		csvContent +=  formattedRow.join(",") + "\r\n";
	}); 
	// fill in data:
	// console.log("Here is the globalTimingData:");
	// console.log(globalTimingData);
	/* NEW TRIAL --
	arrayCombined.forEach(function(roundObject, combinedIndex){
		var formattedRow = [];
		Object.keys(roundObject).forEach(function(key,index) {
			formattedRow.push(roundObject[key]);
		    // key: the name of the object key
		    // index: the ordinal position of the key within the object 
		});
				});
---*/

/*
	// -- fix off-by-one error if interweaving-- :
	// interweave arrays for pushing into csv:
	var arrayCombined = globalSaveData.map(function(v,i) { 
		return [v, globalTimingData[i]]; }).reduce( function(a,b) { 
			return a.concat(b); });
		// return return a.concat(b); });
	arrayCombined.forEach(function(roundObject, combinedIndex){
		var formattedRow = [];
		Object.keys(roundObject).forEach(function(key,index) {
			formattedRow.push(roundObject[key]);
		    // key: the name of the object key
		    // index: the ordinal position of the key within the object 
		});
	
		if (combinedIndex % 2 == 0) {
			csvContent += formattedRow.join(",");
		}
		else {
			csvContent +=  formattedRow.join(",") + "\r\n";;
		}

	}); 
	
*/

	console.log("here's the csv data: " + csvContent);
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	var csvName = "participant" + participantID + "attention_task.csv";
	link.setAttribute("download", csvName);
	document.body.appendChild(link); // Required for FF
	console.log("finished csv setup, call link.click() to download.");
	// TODO: uncomment once clear that not using.
	link.click();
	debugger;
}
/*---------------------------*/










/* --- WebGazer Section --- */ 

function setUpWebGaze() {
	 webgazer.setRegression('ridge') /* currently must set regression and tracker */
		  .setTracker('clmtrackr')
		  .setGazeListener(function(data, clock) {
			//   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
			//   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
		  })
		  .begin()
		  // .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

	 var width = 224;
	 var height = 168;
	 var topDist = '1px';
	 var leftDist = '63px';
	 
	 var setup = function() {
		  var video = document.getElementById('webgazerVideoFeed');
		  video.style.display = 'block';
		  video.style.position = 'absolute';
		  video.style.top = topDist;
		  video.style.left = leftDist;
		  video.width = width;
		  video.height = height;
		  video.style.margin = '0px';
		  //-- this hides overlay, reverse with JS or uncomment to show:
		  video.style.display = 'none'

		  webgazer.params.imgWidth = width;
		  webgazer.params.imgHeight = height;

		  var overlay = document.createElement('canvas');
		  overlay.id = "overlay";
		  overlay.style.position = 'absolute';
		  overlay.width = width;
		  overlay.height = height;
		  overlay.style.top = topDist;
		  overlay.style.left = leftDist;
		  overlay.style.margin = '0px';
		  //--- this hides overlay, reverse with JS or uncomment to show:
		  overlay.style.display = 'none'

		  document.body.appendChild(overlay);

		  var cl = webgazer.getTracker().clm;

		  var canv = document.getElementById("full-canvas");

		  function markDiv(id, color) {
				div = document.getElementById(id);
				div.style.backgroundColor=color;
		  }


		  function cookieClicker() {
				var w = window.innerWidth;
				var h = window.innerHeight;

				var prediction = webgazer.getCurrentPrediction();
				if (prediction) {
					 var x = prediction.x;
					 var y = prediction.y;
					 msg = " pred_x: " + x + " pred y: " + y + " win-wid: " + w + " win-h: " + h;
					 console.log(msg);
					 if (x > w*0.5) {
						  console.log("looking RIGHT");
					 }
					 else {
						  console.log("looking LEFT");
					 }
					 // setTimeout(assHat(x,y), 200);
				}
		  }
		  function drawLoop() {
				requestAnimFrame(drawLoop);
				// clear overlay canvas
				overlay.getContext('2d').clearRect(0,0,width,height);
				prediction = webgazer.getCurrentPrediction();
				/*
				if (prediction) {
					 var x = prediction.x;
					 var y = prediction.y;
					 var w = window.innerWidth;
					 var h = window.innerHeight;
					 $("#reticle").offset({top: y, left:x});
					 // console.log(msg);
					 if (x <= w*0.33) {
						  // console.log("looking RIGHT");
						  currentSector = -1;
						  if (pleaseMarkDivs) {
							  markDiv("left-gaze", "pink");
							  markDiv("center-gaze", "white");
							  markDiv("right-gaze", "white");
						  }

					 }
					 else if (x >= w*0.66) {
					 	 currentSector = 1;
					 	if (pleaseMarkDivs) {
						  markDiv("left-gaze", "white");
						  markDiv("center-gaze", "white");
						  markDiv("right-gaze", "pink");					 		
					 	}

						  // console.log("looking LEFT");
					 }
					 else {
					 	  currentSector = 0
					 	  if (pleaseMarkDivs) {
							  markDiv("left-gaze", "white");
							  markDiv("center-gaze", "pink");
							  markDiv("right-gaze", "white");					 	  	
					 	  }

					 }
				}
				*/
				if (cl.getCurrentPosition()) {
					 // draw on video overlay
					 cl.draw(overlay);
					 /* ---- */
					 // draw on main screen
					 /*----- */ 

				}
		  }
		  drawLoop();
	 };


	 function checkIfReady() {
		  if (webgazer.isReady()) {
				setup();
		  } else {
				setTimeout(checkIfReady, 100);
		  }
	 }
	 setTimeout(checkIfReady,100);
};


window.onbeforeunload = function() {
	 //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
	 window.localStorage.clear(); //Comment out if you want to save data across different sessions 
}


/* --- Grid ---*/

function createGrid() {
	console.log("Executing Order 66, and also createGrid()");
	$(".grid-row").remove();
	var $row = $("<div />", {
	    class: "grid-row"
	});
	var $square = $("<div />", {
	    class: "grid-square"
	});
	// <img class='mini-reticule' src='img/mark.png'>
	//var rows = 5;
	//var columns = 8;
	// assuming 100px square with 10px margin either side
	var grid_square_width = 110;
	var window_height = $(window).height();
	var window_width = $(window).width();
	var rows = Math.floor(window_height/grid_square_width);
	var columns = Math.floor(window_width/grid_square_width);
	console.log("h: " + window_height + " w: " + window_width + " r: " + rows + "c: " + columns);
	//add columns to the the temp row object
    for (var i = 0; i < columns; i++) {
        $row.append($square.clone());
    }
    //clone the temp row object with the columns to the wrapper
    for (var j = 0; j < rows; j++) {
        $("#wrapper").append($row.clone());
    }

    clickGrid = [];
    $("#wrapper").children().each(function(y_index) {
    	$(this).children().each(function(x_index) {
    		var squareIndex = "square-" + y_index + "-" + x_index;
    		$(this).attr("id", squareIndex);
    		clickGrid.push(squareIndex);
    		console.log($(this).position());
    	});
    });

    // sample sequence:
    // left right top down -> square-3-0; square-3-12; square-0-6; square-7-6;
    // i.e. middle y, first x (0); middle y, last x; middle x, first y; middle x, last y;
    // and then four random 

    // --- these get returned:
    var leftSquare = "#square-" + (Math.ceil(rows/2.0)-1) + "-" + 0;
    var rightSquare = "#square-" + (Math.ceil(rows/2.0)-1) + "-" + (columns-1);
    var bottomSquare = "#square-" + 0 + "-" + (Math.ceil(columns/2.0)-1);
    var topSquare = "#square-" +  (rows-1) + "-" + (Math.ceil(columns/2.0)-1);
    

    //randChoice = chooseNfromList(clickGrid,5);
    // var timerMultiple = 1;
    /*
	randChoice.forEach(function(elem){
		setTimeout(function() {
        // do something with 'el'
        makeAllWhite("#wrapper");
        $("#"+elem).css("background", "red");
    	},i*500);
    	i += 1;
	});
	*/

	/* --- red clicker and remover - careful not to clash with others
	$(document).click(function(e) {
		// calculate position and ID
		var x_ind = Math.round((e.pageX+55)/110-1);
		var y_ind = Math.round((e.pageY+55)/110-1);
		var sight_id = "#square-" + y_ind + "-" + x_ind;
		console.log("acquired target: "+ sight_id);
		// remove previous "decorations"
		makeAllWhite("#wrapper");
		// $(".mini-reticle").remove();
		// add current decorations so people see they clicked right thing
		$(sight_id).css("background", "red");
		// $("#"+sight_id).prepend("<img class='mini-reticle' src='img/mark.png'>");
	});
	*/

	[leftSquare, rightSquare, bottomSquare, topSquare].forEach(function(elem) {
		$(elem).css("background","css");
	});
	return [leftSquare, rightSquare, bottomSquare, topSquare];
	/*
	setInterval(function() {
			//console.log("measuring gaze");
			//var prediction = webgazer.getCurrentPrediction();
			//if (prediction) {
				if (prediction) {
				 var x_ind = Math.round((prediction.x+60)/120)-1;
				 var y_ind = Math.round((prediction.y+60)/120)-1;
				 var sight_id = "square-" + y_ind + "-" + x_ind;
				 console.log("acquired target: "+ sight_id);
				 makeAllWhite("#wrapper");
    			 $("#"+sight_id).css("background", "red");
				 // setTimeout(assHat(x,y), 200);
			}
	}, 100);
	*/

}

function makeAllWhite(divID) {
		$(divID).children().each(function(elem) {
			$(this).children().each(function(){
				$(this).css("background", "white");
			});
		});
	}



function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
}

function chooseNfromList(list, N) {
    	jist = list.slice();
    	result = [];
    	for (var i =0; i <N; i++) {
    		var randIndex = Math.floor(Math.random() * clickGrid.length);
    		result.push(list.pop(randIndex));
    	}
    	return result;
    }


