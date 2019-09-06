console.log("hello");
var config = {
  apiKey: "AIzaSyDkupwZ25wfuxQPgZxoBo1SXdMPjb6FeU4",
  authDomain: "train-scheduler-26932.firebaseapp.com",
  databaseURL: "https://train-scheduler-26932.firebaseio.com",
  projectId: "train-scheduler-26932",
  storageBucket: "train-scheduler-26932.appspot.com",
  messagingSenderId: "394852876903",
  appId: "1:394852876903:web:a5b00387b79e61c3"
};
// Initialize Firebase
firebase.initializeApp(config);

var trainData = firebase.database();
$("add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("train-name-input")
    .val()
    .trim();
  var destination = $("destination-input")
    .val()
    .trim();
  var firstTrain = $("first-train-input")
    .val()
    .trim();
  var frequency = $("frequency-input")
    .val()
    .trim();
  // Populating the data that will be stored
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };
  trainData.ref().push(newTrain);
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);
});
// Firebase event to add train to DB and table
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());
  // Storing in variables
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFirstTrain = childSnapshot.val().firstTrain;
  var tFrequency = childSnapshot.val().frequency;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  // If first train is later than current time, set to first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    // Arrival time add tMinutes to current time
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDestination),
      $("<td>").text(tFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});
