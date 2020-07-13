
// !IMPORTANT: REPLACE WITH YOUR OWN CONFIG OBJECT BELOW

// Create room
// Invite people - Send an email or share a link to you friends 
// gmail login
// Create a separate page , authenticate and join
// Left Side pane
// Heading Room name
// List of People with a + button to invite more people
// Start Round 1
// Radio button with Tick button
// collapsible  

/// Collect Votes 
// Finalize Votes -- What should be done if there are two players with same vote
//leave room
// find current player and room
// calculate game progress and report it 
// Integrate video


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAOxmKShY0hmVIW6nPDpp3oSsiV_4bRikc",
    authDomain: "mafia-331bb.firebaseapp.com",
    databaseURL: "https://mafia-331bb.firebaseio.com",
    projectId: "mafia-331bb",
    storageBucket: "mafia-331bb.appspot.com",
    messagingSenderId: "827388164758",
    appId: "1:827388164758:web:e9cc32a673a9de9e4f20b7"
  };


firebase.initializeApp(config);

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const roomRef = dbRef.child('room');
/*let current_room_name = "room1";
let current_player_name = "p1";
let current_player_role = "villager";
let is_current_user_moderator = "1";
let my_current_vote = "";
*/


let current_room_name = "dandy";
let current_player_name = "Vikki";
let current_player_role = "villager";
let is_current_user_moderator = "";
let my_current_vote = "";




	readUserData(); 
	

// --------------------------
// READ
// --------------------------
function readUserData() {

	const playerListUI = document.getElementById("player-list");
	const revealedPlayerListUI = document.getElementById("revealed-player-list");
	const currentPlayerListUI = document.getElementById("current-player-details");
	
	roomRef.child(current_room_name).child("players").on("value", snap => {

		playerListUI.innerHTML = ""
		revealedPlayerListUI.innerHTML = ""
		currentPlayerListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()
  			let data = childSnap.val();

  			if ( data['is_revealed'] == "0")
  			{
				let $li = document.createElement("li");

				// edit icon
				let editIconUI = document.createElement("span");
				editIconUI.class = "edit-user";
				editIconUI.innerHTML = "               ✎";
				editIconUI.setAttribute("userid", key);
				editIconUI.addEventListener("click", voteButtonClicked)

				/*// delete icon
				let deleteIconUI = document.createElement("span");
				deleteIconUI.class = "delete-user";
				deleteIconUI.innerHTML = " ☓";
				deleteIconUI.setAttribute("userid", key);
				deleteIconUI.addEventListener("click", deleteButtonClicked)
				*/

				$li.innerHTML = value.player_name;
				$li.append(editIconUI);
				//$li.append(deleteIconUI);

				$li.setAttribute("user-key", key);
				$li.addEventListener("click", userClicked)
				
				if ( current_player_role == "mafia"){

					let color = (data['player_role'] === "mafia") ? 'red'  : 'green' ;
					$li.setAttribute("style", "background-color: " + color);
				}
								
				playerListUI.append($li);

			}
			else{
						let $revealedPlayerlistli = document.createElement("li");
						$revealedPlayerlistli.innerHTML = value.player_name;
						$revealedPlayerlistli.setAttribute("user-key", key);

						let color = (data['player_role'] === "mafia") ? 'red'  : 'green' ; 
						$revealedPlayerlistli.setAttribute("style", "background-color: " + color);
						
						//$mafia_li.addEventListener("click", userClicked)
						revealedPlayerListUI.append($revealedPlayerlistli);  					


			}
			

		});

			let $current_player_name = document.createElement("li");
			$current_player_name.innerHTML = current_player_name;
			currentPlayerListUI.append($current_player_name);

			let $current_room_name = document.createElement("li");
			$current_room_name.innerHTML = current_room_name;
			currentPlayerListUI.append($current_room_name);


			let $current_player_role = document.createElement("li");
			$current_player_role.innerHTML = current_player_role;
			currentPlayerListUI.append($current_player_role);

			let $my_current_vote = document.createElement("li");
			$my_current_vote.innerHTML = my_current_vote;
			currentPlayerListUI.append($my_current_vote);
	})

}



function userClicked(e) {


		var userID = e.target.getAttribute("user-key");

		const userRef = dbRef.child('users/' + userID);
		const userDetailUI = document.getElementById("user-detail");

		userRef.on("value", snap => {

			userDetailUI.innerHTML = ""

			snap.forEach(childSnap => {
				var $p = document.createElement("p");
				$p.innerHTML = childSnap.key  + " - " +  childSnap.val();
				userDetailUI.append($p);
			})

		});
	

}



// --------------------------
// ADD Room
// --------------------------

const addRoomBtnUI = document.getElementById("add-room-btn");
addRoomBtnUI.addEventListener("click", addRoomBtnClicked)

function addRoomBtnClicked() {


	const roomName = document.getElementById('room-name');
  
  const moderatorName = document.getElementById('moderator-name');
  


roomRef.child(roomName).set({
  is_game_started : "0"}
  );


window.sessionStorage.setItem("room",addRoomInputsUI[0].value)
window.sessionStorage.setItem("is_moderator","true")


console.log(window.sessionStorage.getItem("room"))
console.log(window.sessionStorage.getItem("is_moderator"))




}


// --------------------------
// ADD
// --------------------------


function addPlayerBtnClicked() {


  console.log("here")
	const addUserInputsUI = document.getElementsByClassName("user-input");

 	// this object will hold the new user information
    let newUser = {};

    // loop through View to get the data for the model 
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
       if ( key == "room_name")
       {
       	current_room_name = value;	
       }
       else 
       {
       	newUser[key] = value;
       }
        console.log(key)
        console.log(value)
    }
    newUser['is_revealed'] = "0";
    newUser['player_role'] = "Villager";
    newUser['is_moderator'] = "0";
 	let is_game_started  = 0;



   roomRef.child(current_room_name).once("value",snapshot => {
    if (! snapshot.exists()){
      newUser['is_moderator'] = "1";
      roomRef.child(current_room_name).update({"is_game_started" : "0"});
      //console.log("Did not exists!", userData);
    }
    if(snapshot.val()['is_game_started'] != "1" ){
		roomRef.child(current_room_name + "/players").child(newUser['player_name']).update(newUser)
		this.current_player_name = newUser['player_name'];
		this.current_room_name = current_room_name;
    }
 	else
    {
   		alert("Room Closed : New Users cant join")
    }
$('.pop-up').css({"display": "none"});
});
    
  
}

const startGameBtnUI = document.getElementById("start-game-btn");
startGameBtnUI.addEventListener("click", startGameButtonClicked)

function startGameButtonClicked(){
	roomRef.child(current_room_name).once("value",snapshot => {
	  var data = snapshot.val();

	  if (data['is_game_started'] == "0" )
	  {


	  var number_of_players = Object.keys(data['players']).length;
	  var number_of_mafia = Math.round(number_of_players * 35/ 100 )
	  var mafia = [];
	  while(mafia.length < number_of_mafia){
		r = Math.floor(Math.random() * number_of_players)
		if(mafia.indexOf(r) === -1) mafia.push(r);
	  }

	  console.log(mafia);
	  console.log("number_of_players : "  +  number_of_players)
		let i = 0 ;

  		for(let key in data['players']){
   
      		if ( mafia.includes(i))
      		{
      			console.log(key);
      			roomRef.child(current_room_name).child('players').child(key).update({"player_role" : "mafia"})
      			//console.log("data[key]",data['players'][key]);
      		}
    		i++;

    	}

    	roomRef.child(current_room_name).update({"is_game_started" : "1"})
		}

	});

}


const finalizeVoteBtnUI = document.getElementById("finalize-vote-btn");
finalizeVoteBtnUI.addEventListener("click", finalizeVotesButtonClicked);

function finalizeVotesButtonClicked() {

	let vote_count = {}
	roomRef.child(current_room_name).child("players").on("value", snap => {

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()
  			let data = childSnap.val();

  			//console.log(key)

  			 if(! vote_count.hasOwnProperty("value['vote_for']")){
       				vote_count[value['vote_for']]  = 0 ;
   			}
  			vote_count[value['vote_for']] = vote_count[value['vote_for']] + 1 ;

	});
		let max_vote = 0 ;
		let max_vote_player = "";
		for ( key in vote_count)
		{
			if (vote_count[key] > max_vote)
			{
				max_vote = vote_count[key];
				max_vote_player = key;

			}
		}

		roomRef.child(current_room_name).child('players').child(max_vote_player).update({"is_revealed" : "1"})

	});		
}

function voteButtonClicked(e) {

	console.log(e.target.getAttribute("userid"));
	my_current_vote = e.target.getAttribute("userid")

	const userRef = roomRef.child(current_room_name).child('players').child(current_player_name);
	userRef.update({"vote_for" : e.target.getAttribute("userid")})
}




        







