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
var player1 = "";
var player2 = "";
var isPlayer1 = false;
var isPlayer2 = false;
var player1WinCount = 0;
var player2WinCount = 0;

// Create a variable to reference the database.
var database = firebase.database();

// --------------------------------------------------------------
// Link to Firebase Database for viewer tracking

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref(dbRefPath + "/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").html(snap.numChildren() + ' viewer(s) connected.');
});


// ----------------------------------------------------------------
// At the page load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the values within the firebase node bidderData changes
database.ref(dbRefPathPlayers).on("value", function(snapshot) {


     var databaseObject = snapshot.val();
    

      player1 = databaseObject.Player1.Name.Name;
      player2 = databaseObject.Player2.Name.Name;

      var player1Choice = null;
      var player2Choice = null;

     if(snapshot.child("Player1").child("Choice").exists()){
        player1Choice = databaseObject.Player1.Choice.Choice;
     }
    
     if(snapshot.child("Player2").child("Choice").exists()){
      player2Choice = databaseObject.Player2.Choice.Choice;
   }


   if(snapshot.child("Player1").child("Wins").exists()){
    player1WinCount = databaseObject.Player1.Wins.Wins;
 }

 if(snapshot.child("Player2").child("Wins").exists()){
  player2WinCount  = databaseObject.Player2.Wins.Wins;
}
 

      if (player1 !== null ){
        $("#player1Name").html(player1);
      }

      if (player2 !== null ){
        $("#player2Name").html(player2);
      }

      if (player1WinCount !== null ){
        $("#player1WinCount").html("Wins: " + player1WinCount);
      }

      if (player2WinCount !== null ){
        $("#player2WinCount").html("Wins: " + player2WinCount);
      }




      if (player1 !== null &&  player2 !== null){
        $("#game-progress").html("Game in Progress! ")

      }




  // // If Firebase has a highPrice and highBidder stored (first case)
  // if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    if (player1Choice !== null ){
      $(".player1Img").attr("src", "./assets/images/checkmark.png");
    }
    if (player2Choice !== null ){
      $(".player2Img").attr("src", "./assets/images/checkmark.png");
    }

    

    if (player1Choice !== null &&  player2Choice !== null){
    

   var player1Wins = false;
   var player2Wins = false;


if (player1Choice ==="r") {
  if (player2Choice ==="p") {
    $(".player1Img").attr("src", "./assets/images/rocklose.png");
    $(".player2Img").attr("src", "./assets/images/paperwin.png");
    statusmsg = player2 + " wins! Paper beats Rock";
    player1Wins = false;
    player2Wins = true;
  }
  else if (player2Choice ==="r") {
    $(".player1Img").attr("src", "./assets/images/rocktie.png");
    $(".player2Img").attr("src", "./assets/images/rocktie.png");
    statusmsg = "It's a tie! " + player1 + " and " + player2 + " chose the same. Rock equals Rock";
    player1Wins = false;
    player2Wins = false;
  }
  else if (player2Choice ==="s") {
    $(".player1Img").attr("src", "./assets/images/rockwin.png");
    $(".player2Img").attr("src", "./assets/images/scissorslose.png");
    statusmsg = player1 + " wins! Rock beats Scissor";
    player1Wins = true;
    player2Wins = false;
  }
}
else if (player1Choice ==="p") {

  if (player2Choice ==="p") {
    $(".player1Img").attr("src", "./assets/images/papertie.png");
    $(".player2Img").attr("src", "./assets/images/papertie.png");
    statusmsg = "It's a tie! " + player1 + " and " + player2 + " chose the same. Paper equals Paper";
    player1Wins = false;
    player2Wins = false;
  }
  else if (player2Choice ==="r") {
    $(".player1Img").attr("src", "./assets/images/paperwin.png");
    $(".player2Img").attr("src", "./assets/images/rocklose.png");
    statusmsg =  player1 + " wins! Paper beats Rock";
    player1Wins = true;
    player2Wins = false;
  }
  else if (player2Choice ==="s") {
    $(".player1Img").attr("src", "./assets/images/paperlose.png");
    $(".player2Img").attr("src", "./assets/images/scissorswin.png");
    statusmsg =  player2 + " wins! Scissor beats Paper";
    player1Wins = false;
    player2Wins = true;
  }
}
else if (player1Choice ==="s") {
 
  if (player2Choice ==="p") {
    $(".player1Img").attr("src", "./assets/images/scissorswin.png");
    $(".player2Img").attr("src", "./assets/images/paperlose.png");
    statusmsg =  player1 + " wins! Scissor beats Paper";
    player1Wins = true;
    player2Wins = false;
  }
  else if (player2Choice ==="r") {
    $(".player1Img").attr("src", "./assets/images/scissorslose.png");
    $(".player2Img").attr("src", "./assets/images/rockwin.png");
    statusmsg =  player2 + " wins! Rock beats Scissor";
    player1Wins = false;
    player2Wins = true;
  }
  else if (player2Choice ==="s") {
    $(".player2Img").attr("src", "./assets/images/scissorstie.png");
    $(".player1Img").attr("src", "./assets/images/scissorstie.png");
    statusmsg =  "It's a tie! " + player1 + " and " + player2 + " chose the same. Scissor equals Scissor";
    player1Wins = false;
    player2Wins = false;
  }
}
else{
  statusmsg = "";
}

if (player1Wins === true){

  player1WinCount++;
  // Save the new price in Firebase
database.ref(dbRefPathPlayers + "Player1/Wins/").set({
  Wins: player1WinCount
});

}
else if (player2Wins === true){
  // Save the new price in Firebase
  player2WinCount++;
database.ref(dbRefPathPlayers + "Player2/Wins/").set({
  Wins: player2WinCount++
});
}








$("#round-results").html(statusmsg);

}


















// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------


// Whenever a user clicks the submit-bid button
$("#add-player1").on("click", function(event) {
  event.preventDefault();
  isPlayer1 = true;
    var nameInput = $("#name-input").val();
    // Save the new price in Firebase
    $("#user").html(nameInput);

    // Save the new price in Firebase
    database.ref(dbRefPathPlayers+ "Player1/Name/").set({
      Name: nameInput
    });
});


$("#add-player2").on("click", function(event) {
  event.preventDefault();
  isPlayer2 = true;
    var nameInput = $("#name-input").val();
    // Save the new price in Firebase
    $("#user").html(nameInput);

    // Save the new price in Firebase
    database.ref(dbRefPathPlayers + "Player2/Name/").set({
      Name: nameInput
    });
});




// Whenever a user clicks the submit-bid button
$("#rock").on("click", function(event) {
  event.preventDefault();

    if (isPlayer1 === true){
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers+ "Player1/Choice/").set({
      Choice: "r",
    });
    
    }
    else if (isPlayer2 === true){
      // Save the new price in Firebase
      database.ref(dbRefPathPlayers+ "Player2/Choice/").set({
        Choice: "r",
      });
      }

});





$("#paper").on("click", function(event) {
  event.preventDefault();

    if (isPlayer1 === true){
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers+ "Player1/Choice/").set({
      Choice: "p",
    });
    }
    else if (isPlayer2 === true){
      // Save the new price in Firebase
      database.ref(dbRefPathPlayers+ "Player2/Choice/").set({
        Choice: "p",
      });
       }

});



$("#scissors").on("click", function(event) {
  event.preventDefault();

    if (isPlayer1 === true){
    // Save the new price in Firebase
    database.ref(dbRefPathPlayers+ "Player1/Choice/").set({
      Choice: "s",
    });


    }
    else if (isPlayer2 === true){
      // Save the new price in Firebase
      database.ref(dbRefPathPlayers+ "Player2/Choice/").set({
        Choice: "s",
      });

      
      }

});




