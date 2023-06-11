// To DO: Set up Google Calendar
// To DO: Read each section progress and update to each section
// To DO: Gen new section via idea parking lot, dismiss section when finished
// To DO: Email notification, to fill, to remind (maybe use GPT)
const FORM = FormApp.openById(FORM_ID); // Replace 'FORM_ID' with the actual ID of your Google Form

function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  // Iterate through each item response in the form response
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];    
    var section = itemResponse.getItem().getTitle();
    var reply = itemResponse.getResponse();
    var actionItem = []
    switch (section) {
    case 'What did you finished last week?':
      break;
    case 'Idea Parking Lot':
      var newIdea = reply;
      break;
    default:
      // Perform actions for any other cases
      if(section.includes("Goal")){
        actionItem.push([section, reply])
      }
      break;
    }
  }
  // Process Flow
  backlogManegement(actionItem)
  if(newIdea) ideasToBacklog(newIdea);
  backlogSync();
  weeklyToDoSync();
}

function ideasToBacklog(str=inputIdeaString) {
  // Remove square brackets and split the string by commas
  var newItemObj = convertNewIdeasStringToJson(str)
  // Get backlog JSON
  var bocklogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
  var backlogJSON = convertStringToJson(bocklogItem.getHelpText())
  backlogJSON = combineJSONItems(backlogJSON, newItemObj)
  bocklogItem.setHelpText(convertJsonToString(backlogJSON))
}

function backlogSync() {
  // Get backlog JSON
  var bocklogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
  var backlogJSON = convertStringToJson(bocklogItem.getHelpText())
  for(var key of Object.keys(backlogJSON)){
    var targetComponent = getFormComponentByTitle(key)[0]
    console.log(backlogJSON[key])
    targetComponent.setRows(backlogJSON[key])
  }
  return
}

function weeklyToDoSync() {
  var toDoList = []
  // Get backlog JSON
  var toDoItem = getFormComponentByTitle(title="This Week To Do")[0]
  var toDoItemJSON = convertStringToJson(toDoItem.getHelpText())
  for(var key of Object.keys(toDoItemJSON)){
    for(var item of toDoItemJSON[key]){
      toDoList.push("[" + key.replace(" Goal", "") + "]" + item)
    }
    // console.log(toDoList)
    var progressCheckItem = getFormComponentByTitle(title="What did you finished last week?")[0]
    progressCheckItem.setRows(toDoList)
  }
  return
}

function backlogManegement(actionItem=[[ 'Working Goal', [ null, "Challenge Accepted", 'Deleted This', null, null, null ]]]){
  var toDoItem = getFormComponentByTitle(title="This Week To Do")[0]
  var toDoItemJSON = convertStringToJson(toDoItem.getHelpText())
  var bocklogItem = getFormComponentByTitle(title="Backup To Do Items")[0]
  var backlogJSON = convertStringToJson(bocklogItem.getHelpText())
  for(var pair of actionItem){
    console.log(pair)
    var [section, actionList] = pair
    var goalComponent = getFormComponentByTitle(section)[0]
    var goalList = goalComponent.getRows()
    console.log(goalList.length)
    for (var i in goalList){
      if(actionList[i] === null){
        console.log(i + "=null")
        continue;
      }else if(actionList[i] == "Challenge Accepted"){
        console.log(i + "=accpet")
        toDoItemJSON[section].push(goalList[i])
      }
      console.log(i + "=delete")
      var index = backlogJSON[section].indexOf(goalList[i]);
      if (index > -1) { // only splice array when item is found
        console.log("Item change")
        backlogJSON[section].splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  }
  console.log(toDoItemJSON)
  console.log(backlogJSON)
  // return
  toDoItem.setHelpText(convertJsonToString(toDoItemJSON))
  bocklogItem.setHelpText(convertJsonToString(backlogJSON))
}

function toDoManegement(){
}