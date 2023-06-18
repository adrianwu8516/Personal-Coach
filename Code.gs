// To DO: Adding and deleting new categories
// To DO: Set up Google Calendar
// To DO: Read each section progress and update to each section
// To DO: Gen new section via idea parking lot, dismiss section when finished
// To DO: Email notification, to fill, to remind (maybe use GPT)

const FORM_ID = '1b_brDkld5sZVjydl3bIFkpesNnmyAP3-5RBVe1hFfrk'
const FORM = FormApp.openById(FORM_ID); // Replace 'FORM_ID' with the actual ID of your Google Form
const FORM_ITEM = FORM.getItems();
function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  var actionItem = [];
  // Iterate through each item response in the form response
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];    
    var section = itemResponse.getItem().getTitle();
    var reply = itemResponse.getResponse();
    console.log(section, reply)
    switch (section) {
    case 'What did you finished last week?':
      var [toDoItemJSON, backlogJSON] = toDoManegement(reply)
      break;
    case 'Idea Parking Lot':
      var newIdea = reply;
      break;
    default:
      // Perform actions for any other cases
      if(section.includes("Goal")) actionItem.push([section, reply]);
      break;
    }
  }
  // Process Flow
  var [toDoItemJSON, backlogJSON] = backlogManegement(actionItem, toDoItemJSON, backlogJSON)
  if(newIdea) {
    var backlogJSON = ideasToBacklog(newIdea, backlogJSON);
  }
  backlogSync(backlogJSON);
  weeklyToDoSync(toDoItemJSON);
}

function ideasToBacklog(str=inputIdeaString, backlogJSON) {
  // Remove square brackets and split the string by commas
  var newItemObj = convertNewIdeasStringToJson(str)
  // Get backlog JSON
  if (backlogJSON === undefined) {
    var backlogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
    var backlogJSON = convertStringToJson(backlogItem.getHelpText())
  }
  backlogJSON = combineJSONItems(backlogJSON, newItemObj)
  return backlogJSON
  // bocklogItem.setHelpText(convertJsonToString(backlogJSON))
}

function backlogSync(backlogJSON) {
  // Get backlog JSON
  if (backlogJSON === undefined) {
    var backlogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
    var backlogJSON = convertStringToJson(backlogItem.getHelpText())
  }
  for(var key of Object.keys(backlogJSON)){
    var targetComponent = getFormComponentByTitle(key)[0]
    console.log(backlogJSON[key])
    targetComponent.setRows(backlogJSON[key].sort())
  }
  return
}

function weeklyToDoSync(toDoItemJSON) {
  var toDoList = []
  if (toDoItemJSON === undefined) {
    var toDoItem = getFormComponentByTitle(title="This Week To Do")[0]
    var toDoItemJSON = convertStringToJson(toDoItem.getHelpText())
  }
  for(var key of Object.keys(toDoItemJSON)){
    for(var item of toDoItemJSON[key]){
      toDoList.push("[" + key.replace(" Goal", "") + "] " + item)
    }
    // console.log(toDoList)
    var progressCheckItem = getFormComponentByTitle(title="What did you finished last week?")[0]
    progressCheckItem.setRows(toDoList.sort())
  }
  return
}
//actionItem=[[ 'Working Goal', [ null, "Challenge Accepted", 'Deleted This', null, null, null ]]]
function backlogManegement(actionItem, toDoItemJSON, backlogJSON){
  // Notice that the toDoManegement might prolong the backlog list and made it longer than form response
  var toDoItem = getFormComponentByTitle(title="This Week To Do")[0]
  if (toDoItemJSON === undefined) var toDoItemJSON = convertStringToJson(toDoItem.getHelpText())
  var backlogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
  if (backlogJSON === undefined) var backlogJSON = convertStringToJson(backlogItem.getHelpText())
  for(var pair of actionItem){
    var [section, actionList] = pair
    var goalComponent = getFormComponentByTitle(section)[0]
    var goalList = goalComponent.getRows()
    for (var i in goalList){
      if(actionList[i] === null){
        continue;
      }else if(actionList[i] == "Challenge Accepted"){
        toDoItemJSON[section].push(goalList[i])
      }
      var index = backlogJSON[section].indexOf(goalList[i]);
      if (index > -1) { // only splice array when item is found
        backlogJSON[section].splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  }
  // console.log(toDoItemJSON)
  // console.log(backlogJSON)
  toDoItem.setHelpText(convertJsonToString(toDoItemJSON))
  bocklogItem.setHelpText(convertJsonToString(backlogJSON))
  return [toDoItemJSON, backlogJSON];
}
//actionArray = [ '80%','Pending','50%','Pending','Pending','Done','Pending','Pending','Pending','Done','Done',null,null ]
function toDoManegement(actionArray, toDoItemJSON, backlogJSON){
  if (toDoItemJSON === undefined) {
    var toDoItem = getFormComponentByTitle(title="This Week To Do")[0]
    var toDoItemJSON = convertStringToJson(toDoItem.getHelpText())
  }
  if (backlogJSON === undefined) {
    var backlogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
    var backlogJSON = convertStringToJson(backlogItem.getHelpText())
  }
  var recordSheet = getRecordSpreadsheet()
  // console.log(toDoItemJSON)
  // console.log(backlogJSON)
  for(var i in actionArray){
    var progress = actionArray[i]
    if(progress != null){
      console.log(progress)
      var key = itemReview[i].split("] ")[0].replace("[","") + " Goal"
      var target = itemReview[i].split("] ")[1]
      var index = toDoItemJSON[key].indexOf(target);
      // console.log(key, target, index)
      if(progress == "Done" && index > -1){
        // only splice array when item is found, 2nd parameter means remove one item only
        toDoItemJSON[key].splice(index, 1); 
        recordSheet.insertRowAfter(1)
        recordSheet.getRange("A2:C2").setValues([[key, target, generateTimestamp()]])
      }else if (progress == "Pending" ){
        toDoItemJSON[key].splice(index, 1); 
        backlogJSON[key]? backlogJSON[key].push(target) : backlogJSON[key] = [target]
      }else{
        toDoItemJSON[key][index] = toDoItemJSON[key][index] + ` - ${progress}`
      }
    }
  }
  // console.log(toDoItemJSON)
  // console.log(backlogJSON)
  // pass the data to next function = backlogManegement
  return [toDoItemJSON, backlogJSON];
}







