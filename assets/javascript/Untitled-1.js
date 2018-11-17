//  This code will run as soon as the page loads.
window.onload = function () {
  $("#start").click(stopwatch.start);
};

var questionCount = 0;
//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;
var startTimeout;

// prevents the clock from being sped up unnecessarily
var clockRunning = false;

var totaltime = 0;
var correctanswers = 0;
var incorrectanswers = 0;

var currentCorrectAnswer = "";
var currentCorrectAnswerPic = "";

function showAnswer() {
  clearTimeout(startTimeout);
  clearInterval(intervalId);
  $("#timer").empty();
  $("#questions").empty();
  $("#correctAnswer").append("The correct answer was <b>" + currentCorrectAnswer + "</b><br><br>");

  var img = $("<img>");
  img.attr("src", currentCorrectAnswerPic);
  img.attr("id", "correctAnswerImg");
  $("#correctAnswerImg").html(img);

  startTimeout = setTimeout(function () {
    stopwatch.start();
  }, 5000);
}

function showResults() {
  clearTimeout(startTimeout);
  clearInterval(intervalId);

  questionCount = 0;
  clockRunning = false;
  totaltime = 0;


  $("#timer").empty();
  $("#questions").empty();
  $("#correctAnswer").empty();
   $("#results").append("<br>Correct answers: <b>" + correctanswers + "</b><br>");
  $("#results").append("<br>Incorrect answers: <b>" + incorrectanswers + "</b><br>");

  if (correctanswers > incorrectanswers) {
    $("#resultsHeader").append(trivia["results"]["w"]);
    currentCorrectAnswerPic = trivia["results"]["wp"];
  } else {
    $("#resultsHeader").append(trivia["results"]["l"]);
    currentCorrectAnswerPic = trivia["results"]["lp"];
  }

  $("#resultsHeader").append("<br><br>Thank you for playing! <br> (Your statistics are below)<br><br>");
    $("#results").append("<br><b>Statistics</b> <br>")
    for (i = 1; i < (trivia.maxQuestions+1); i++) {
    $("#results").append("Q" + i + ": " + trivia["question" + i]["t"] + " (secs) <br>");
    
  }
  $("#results").append("<br><b>Total elapsed time:</b> " + trivia.totaltime + " (secs)<br>")

  var img = $("<img>");
  img.attr("src", currentCorrectAnswerPic);
  img.attr("id", "correctAnswerImg");
  $("#correctAnswerImg").html(img);

  var btn = $("<button>");
  btn.attr("id", "start");
  btn.addClass("btn btn-info");
  btn.text("Try Again");
  $("#buttons").html(btn);

  $('#start').on('click', function (event) {
    clearInterval(intervalId);
    correctanswers = 0;
    incorrectanswers = 0;
    trivia.totaltime = 0;

    for (i = 1; i < (trivia.maxQuestions+1); i++) {
        trivia["question" + i]["t"] = 0;
    }

    stopwatch.start();

  });

}

trivia = {
  maxQuestions: 3,
  totaltime: 0,
  //q = question, a = answers, s = solution (Correct answer), p = picture, c = class of button, t = time to answer the question
  question1: {
    q: "Q1) Who was the legendary Benedictine monk who invented champagne?",
    a: ["Maximus Bolinger", "Dom Perignon", "Louis Roederer", "Piper Heidsieck"],
    s: "Dom Perignon",
    p: "./assets/images/dom.jpg",
    c: "btn-danger",
    t: 0
  },

  question2: {
    q: "Q2) Name the largest freshwater lake in the world?",
    a: ["Lake Erie", "Lake Huron", "Lake Superior", "Lake Ontario"],
    s: "Lake Superior",
    p: "./assets/images/lakesuperior.png",
    c: "btn-warning",
    t: 0
  },

  question3: {
    q: "Q3) Where would you find the Sea of Tranquility?",
    a: ["The Moon", "The Earth", "Saturn", "Mars"],
    s: "The Moon",
    p: "./assets/images/moon.jpg",
    c: "btn-success",
    t: 0
  },


  results: {
    //w = winner, l = loser, wp = winner picture, lp = loser picture
    w: "Congratulations! You won!",
    l: "You lost...don't be mad. Try again?",
    wp: "./assets/images/winner.jpg",
    lp: "./assets/images/loser.jpg"
  }


};

//  Our stopwatch object.
var stopwatch = {
  maxtime: 0,
  time: 0,

  reset: function () {

    stopwatch.maxtime = 30;
    stopwatch.time = stopwatch.maxtime;
    currentCorrectAnswer = "";
    currentCorrectAnswerPic = "";
    $("#correctAnswer").empty();
    $("#correctAnswerImg").empty();
    $("#resultsHeader").empty();
    $("#results").empty();
    $("#timer").html(stopwatch.timeConverter(stopwatch.maxtime));


  },

  start: function () {

    if (questionCount === trivia.maxQuestions) {
      clearInterval(intervalId);
      showResults();
      return;
    }

    stopwatch.reset();
    questionCount++;
    //   Used setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      clearInterval(intervalId);
      //IMPORTANT NOTE: You do not want to use stopwatch.count() as that "CALLS" the function. 
      //If you are passing a function, you must not use the brackets.

      intervalId = setInterval(stopwatch.count, 1000);

      var currentQuestion = trivia["question" + questionCount]["q"];
      var currentAnswers = trivia["question" + questionCount]["a"];
      currentCorrectAnswer = trivia["question" + questionCount]["s"];
      currentCorrectAnswerPic = trivia["question" + questionCount]["p"];
      var currentBtnClass = trivia["question" + questionCount]["c"];

      $("#questions").append(currentQuestion + "<br><br>");

      for (i = 0; i < currentAnswers.length; i++) {

        var btn = $("<button>");
        btn.attr("name", "answer");
        btn.addClass("btnAnswer btn " + currentBtnClass + " answer" + i);
        btn.attr("value", currentAnswers[i]);
        btn.text(currentAnswers[i]);
        $("#questions").append(btn);
        $("#questions").append("<br><br>");
      }


      $("#buttons").empty();

      //Connects the onclick event to the buttons.
      $('.btnAnswer').on('click', function (event) {
        $("#timer").empty();

        var totaltimetemp = stopwatch.maxtime - stopwatch.time;
        trivia["question" + questionCount]["t"] = totaltimetemp;
        trivia.totaltime += totaltimetemp;

        var $element = $(this);
        //This will return the value of the element that was clicked.
        var value = $element.attr("value");

        //Checks for a win scneario 
        if (currentCorrectAnswer === value) {
          correctanswers++;
          $("#correctAnswer").html("You are correct! <br>Elapsed time: " + trivia["question" + questionCount]["t"]  + ' (secs) <br><br>');

          /*Checks for a loss scneario  */
        } else {
          incorrectanswers++;
          $("#correctAnswer").html("Sorry, you were incorrect. <br>Elapsed time: " + trivia["question" + questionCount]["t"]  + ' (secs) <br><br>');

        }
        
        showAnswer();
      });



    }

  },

  stop: function () {

    //Used clearInterval to stop the count here and set the clock to not be running.
    clearInterval(intervalId);
  },


  count: function () {


    stopwatch.time--;

    // Get the current time, pass that into the stopwatch.timeConverter function,
    //        and save the result in a variable.
    var timeConverted = stopwatch.timeConverter(stopwatch.time);


    //Used variable you just created to show the converted time in the "display" div.
    $("#timer").html(timeConverted);

    if (stopwatch.time === 0) {


      var totaltimetemp = stopwatch.maxtime;
      trivia["question" + questionCount]["t"] = totaltimetemp;
      trivia.totaltime += totaltimetemp;

      incorrectanswers++;
      showAnswer();
      stopwatch.stop();
    }


  },

  timeConverter: function (t) {

    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    } else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }







};