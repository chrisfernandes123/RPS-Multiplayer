/* global moment firebase */

// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
var config = {
  //From Chris Fernandes personal project on Firebase.
  apiKey: "AIzaSyDuLLYyag4uSszoGcosqr3idA_PmKEDsOE",
  authDomain: "my-project-1475612656552.firebaseapp.com",
  databaseURL: "https://my-project-1475612656552.firebaseio.com",
  projectId: "my-project-1475612656552",
  storageBucket: "",
  messagingSenderId: "359506709188"
};

firebase.initializeApp(config);

var dbRefPath = "RPS-Multiplayer/"
var dbRefPathPlayers = dbRefPath + "Players/"
var dbRefPathAddPlayers = dbRefPath + "AddPlayers/"
var dbRefPathCareer = dbRefPath + "Career/"
var dbRefPathPlayer1Career = "";
var dbRefPathPlayer2Career = "";
var player1CareerWinCount = 0;
var player2CareerWinCount = 0;
var player1 = "";
var player2 = "";
var player1Code = "";
var player2Code = "";
var isPlayer1 = false;
var isPlayer2 = false;
var player1WinCount = 0;
var player2WinCount = 0;
var player1Wins = false;
var player2Wins = false;
var startResultsTimeout;
var player1ResultImg = "";
var player2ResultImg = "";
var bRoundComplete = false;
var con;


// Create a variable to reference the database.
var database = firebase.database();

database.ref(dbRefPathAddPlayers).on("value", function (snapshot) {
  var databaseObject = snapshot.val();

$("#p1name").html(databaseObject.Player1.name);
$("#p2name").html(databaseObject.Player2.name);

getPlayer1Career(databaseObject.Player1.career);
getPlayer2Career(databaseObject.Player2.career);

  

});



// Whenever a user clicks the submit-bid button
$("#add-player").on("click", function (event) {
  event.preventDefault();

  
    if (dbRefPathPlayer1Career !== ""){

   
  getPlayer1Career(dbRefPathPlayer1Career);
}

if (dbRefPathPlayer2Career !== ""){

  getPlayer2Career(dbRefPathPlayer2Career);
}

  $("#add-player").empty();

  database.ref(dbRefPathAddPlayers).on("value", function (snapshot) {
    var databaseObject = snapshot.val();

    if (snapshot.child("Player1").exists() && databaseObject.Player1.key !== con.key && bRoundComplete === false) {
      
    
      
      if (snapshot.child("Player2").exists() && databaseObject.Player2.key !== con.key && bRoundComplete === false) {
        
      
      }
      else{
       
         player2 = $("#name-input").val();
          player2Code = $("#code-input").val();
          dbRefPathPlayer2Career = dbRefPath + "Career/" + player2 + "|" + player2Code +  "/";
        $("#div-add-player").empty();
        isPlayer2 = true;

  
          $("#game-progress").html("Game in Progress! ")
       
          con.update({
            name: player2
         });
        
        database.ref(dbRefPathAddPlayers + "Player2/").set({
          name: player2,
          key: con.key,
          code: player2Code,
        career: dbRefPathPlayer2Career
        });
      // }

      getPlayer1Career(dbRefPathPlayer1Career);
      getPlayer2Career(dbRefPathPlayer2Career);

          
      }
    }
    else {
    
       player1 = $("#name-input").val();
        player1Code = $("#code-input").val();
        
        dbRefPathPlayer1Career = dbRefPath + "Career/" + player1 + "|" + player1Code +  "/";
        $("#div-add-player").empty();
       
      isPlayer1 = true;
      //player1 = databaseObject.Player1.name;
      con.update({
        name: player1
     });


      database.ref(dbRefPathAddPlayers + "Player1/").set({
        name: player1,
        key: con.key,
        code: player1Code,
        career: dbRefPathPlayer1Career
      });
    // }


    getPlayer1Career(dbRefPathPlayer1Career);
    getPlayer2Career(dbRefPathPlayer2Career);


    }


  

  });


    $("#player1CareerWinCount").html("Career Wins: " + 0);
    $("#player2CareerWinCount").html("Career Wins: " + 0);
    getPlayer1Career(databaseObject.Player1.career);
getPlayer2Career(databaseObject.Player2.career);


  });






function getPlayer1Career(career){

database.ref(career).on("value", function (snapshot) {

  var databaseObject = snapshot.val();
 
  if (snapshot.child("Wins").exists()) {
    player1CareerWinCount = databaseObject.Wins;
    
    $("#player1CareerWinCount").html("Career Wins: " + player1CareerWinCount);
  }
  else{
    $("#player1CareerWinCount").html("Career Wins: 0" );
  }
  

  });
}

function getPlayer2Career(career){

  database.ref(career).on("value", function (snapshot) {

    var databaseObject = snapshot.val();

   
    if (snapshot.child("Wins").exists()) {
      player2CareerWinCount = databaseObject.Wins;
      $("#player2CareerWinCount").html("Career Wins: " + player2CareerWinCount);
    }
    else{
      $("#player2CareerWinCount").html("Career Wins: 0" );
    }

  

    });
  }






// --------------------------------------------------------------
// Link to Firebase Database for viewer tracking

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref(dbRefPath + "/connections/");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");


var player1Ref = database.ref(dbRefPathAddPlayers + "Player1/");
var player2Ref = database.ref(dbRefPathAddPlayers + "Player2/");


// When the client's connection state changes...
connectedRef.on("value", function (snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
   
   // con.onDisconnect().set("I disconnected!");




  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").html(snap.numChildren() + ' viewer(s) connected.');
  
  
});






// ----------------------------------------------------------------
// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes
database.ref(dbRefPathPlayers).on("value", function (snapshot) {


  var databaseObject = snapshot.val();

  if (snapshot.child("Player1").child("Name").exists()) {
    player1 = databaseObject.Player1.name;
    $("#player1Name").html(player1);
  }

  if (snapshot.child("Player2").child("Name").exists()) {
    player2 = databaseObject.Player2.name;
      $("#player2Name").html(player2);
  }

  var player1Choice = null;
  var player2Choice = null;

  if (snapshot.child("Player1").child("Choice").exists()) {
    player1Choice = databaseObject.Player1.Choice.Choice;
  }

  if (snapshot.child("Player2").child("Choice").exists()) {
    player2Choice = databaseObject.Player2.Choice.Choice;
  }


  if (snapshot.child("Player1").child("Wins").exists()) {
    player1WinCount = databaseObject.Player1.Wins.Wins;
  }

  if (snapshot.child("Player2").child("Wins").exists()) {
    player2WinCount = databaseObject.Player2.Wins.Wins;
  }





  if (player1WinCount !== null) {
    $("#player1WinCount").html("Wins: " + player1WinCount);
  }

  if (player2WinCount !== null) {
    $("#player2WinCount").html("Wins: " + player2WinCount);
  }


   


  if (player1Choice !== null) {
    $(".player1Img").attr("src", "./assets/images/checkmark.png");
  } 
  else if (bRoundComplete === true){
    $(".player1Img").attr("src", player1ResultImg );
  }
  else {
     $(".player1Img").attr("src", "./assets/images/question.png");
   }

  if (player2Choice !== null) {
    $(".player2Img").attr("src", "./assets/images/checkmark.png");
  } 
  else if (bRoundComplete === true){
    $(".player2Img").attr("src", player2ResultImg );

  }
  else {
    $(".player2Img").attr("src", "./assets/images/question.png");
  }


  


  if (player1Choice !== null && player2Choice !== null) {
    
    bRoundComplete = true;

if (bRoundComplete === true){
  
  startResultsTimeout = setTimeout(function () {

    clearTimeout(startResultsTimeout);
    bRoundComplete = false;
          $(".player1Img").attr("src", "./assets/images/question.png");
         $(".player2Img").attr("src", "./assets/images/question.png");
      

       }, 2000);


}


    player1Wins = false;
    player2Wins = false;


    if (player1Choice === "r") {
      if (player2Choice === "p") {
        player1ResultImg = "./assets/images/rocklose.png";
        player2ResultImg = "./assets/images/paperwin.png";
        statusmsg = player2 + " wins! Paper beats Rock";
        player1Wins = false;
        player2Wins = true;
      } else if (player2Choice === "r") {
        player1ResultImg = "./assets/images/rocktie.png";
        player2ResultImg = "./assets/images/rocktie.png";
        statusmsg = "It's a tie! " + player1 + " and " + player2 + " chose the same. Rock equals Rock";
        player1Wins = false;
        player2Wins = false;
      } else if (player2Choice === "s") {
        player1ResultImg = "./assets/images/rockwin.png";
        player2ResultImg = "./assets/images/scissorslose.png";
        statusmsg = player1 + " wins! Rock beats Scissor";
        player1Wins = true;
        player2Wins = false;
      }
    } else if (player1Choice === "p") {

      if (player2Choice === "p") {
        player1ResultImg = "./assets/images/papertie.png";
        player2ResultImg = "./assets/images/papertie.png";
        statusmsg = "It's a tie! " + player1 + " and " + player2 + " chose the same. Paper equals Paper";
        player1Wins = false;
        player2Wins = false;
      } else if (player2Choice === "r") {
        player1ResultImg = "./assets/images/paperwin.png";
        player2ResultImg = "./assets/images/rocklose.png";
        statusmsg = player1 + " wins! Paper beats Rock";
        player1Wins = true;
        player2Wins = false;
      } else if (player2Choice === "s") {
        player1ResultImg = "./assets/images/paperlose.png";
        player2ResultImg = "./assets/images/scissorswin.png";
        statusmsg = player2 + " wins! Scissor beats Paper";
        player1Wins = false;
        player2Wins = true;
      }
    } else if (player1Choice === "s") {

      if (player2Choice === "p") {
        player1ResultImg = "./assets/images/scissorswin.png";
        player2ResultImg = "./assets/images/paperlose.png";
        statusmsg = player1 + " wins! Scissor beats Paper";
        player1Wins = true;
        player2Wins = false;
      } else if (player2Choice === "r") {
        player1ResultImg = "./assets/images/scissorslose.png";
        player2ResultImg = "./assets/images/rockwin.png";
        statusmsg = player2 + " wins! Rock beats Scissor";
        player1Wins = false;
        player2Wins = true;
      } else if (player2Choice === "s") {
        player1ResultImg = "./assets/images/scissorstie.png";
        player2ResultImg = "./assets/images/scissorstie.png";
        statusmsg = "It's a tie! " + player1 + " and " + player2 + " chose the same. Scissor equals Scissor";
        player1Wins = false;
        player2Wins = false;
      }
    

       



    } else {
      statusmsg = "";
    }





    database.ref(dbRefPathPlayers + "Player1/Choice/").set({
      Choice: null
    });

    database.ref(dbRefPathPlayers + "Player2/Choice/").set({
      Choice: null
    });
   

    if (player1Wins === true) {
      player1Wins = false;
      player2Wins = false;
      player1WinCount++;
      player1CareerWinCount++;
      // Save the new price in Firebase
      database.ref(dbRefPathPlayers + "Player1/Wins/").set({
        Wins: player1WinCount
      }); 

     
      database.ref(dbRefPathPlayer1Career).set({
        Wins: player1CareerWinCount
      });




    } else if (player2Wins === true) {
      player1Wins = false;
      player2Wins = false;
      player2WinCount++;
      player2CareerWinCount++;
      database.ref(dbRefPathPlayers + "Player2/Wins/").set({
        Wins: player2WinCount
      });

      
      database.ref(dbRefPathPlayer2Career).set({
        Wins: player2CareerWinCount
      });




    }








    $("#round-results").html(statusmsg);
    player1Wins = false;
    player2Wins = false;
   



  }


















  // If any errors are experienced, log them to console.
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



// Whenever a user clicks the rock button
$("#rock").on("click", function (event) {
  event.preventDefault();

  if (isPlayer1 === true) {
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player1/Choice/").set({
      Choice: "r",
    });

  } else if (isPlayer2 === true) {
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player2/Choice/").set({
      Choice: "r",
    });
  }

});





$("#paper").on("click", function (event) {
  event.preventDefault();

  if (isPlayer1 === true) {
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player1/Choice/").set({
      Choice: "p",
    });
  } else if (isPlayer2 === true) {
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player2/Choice/").set({
      Choice: "p",
    });
  }

});



$("#scissors").on("click", function (event) {
  event.preventDefault();

  if (isPlayer1 === true) {
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player1/Choice/").set({
      Choice: "s",
    });


  } else if (isPlayer2 === true) {
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player2/Choice/").set({
      Choice: "s",
    });


  }

});


// //  This code will run as soon as the page loads.
// window.onload = function () {
//   $("#start").click(stopwatch.start);
// };

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

//  Our stopwatch object.
var stopwatch = {
  maxtime: 0,
  time: 0,

  reset: function () {

    stopwatch.maxtime = 5;
    stopwatch.time = stopwatch.maxtime;
    $("#timer").html(stopwatch.timeConverter(stopwatch.maxtime));


  },

  start: function () {

    stopwatch.reset();
      //   Used setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      clearInterval(intervalId);
      //IMPORTANT NOTE: You do not want to use stopwatch.count() as that "CALLS" the function. 
      //If you are passing a function, you must not use the brackets.

      intervalId = setInterval(stopwatch.count, 1000);

      //Connects the onclick event to the buttons.
      $('.btnAnswer').on('click', function (event) {
        $("#timer").empty();

    
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