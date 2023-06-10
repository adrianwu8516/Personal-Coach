function getFormComponentByTitle(title="Backup List") {
  var matchedList = []
  // Iterate through each form item
  for (var i = 0; i < FORM_ITEM.length; i++) {
    var item = FORM_ITEM[i];
    
    // Get the item type and title
    var itemType = item.getType();
    var itemTitle = item.getTitle();
    var itemId = item.getId();

    if(itemTitle.includes(title)) {
      // Process the item type and title as per your requirements
      // For example, you can log them to the console or store them in an array
      Logger.log('Item Type: ' + itemType);
      Logger.log('Item Title: ' + itemTitle);
      Logger.log('Item Id: ' + itemId);
      matchedList.push(findProperFormItemType(FORM.getItemById(itemId)))
    }
  }
  // console.log(matchedList)
  return matchedList
}

function findProperFormItemType(item) {
  var itemType = item.getType();
  
  switch (itemType) {
    case FormApp.ItemType.CHECKBOX:
      var checkboxItem = item.asCheckboxItem();
      // Perform actions specific to CheckboxItem
      // Example: checkboxItem.setTitle("Updated title");
      return checkboxItem;
      
    case FormApp.ItemType.CHECKBOX_GRID:
      var checkboxGridItem = item.asCheckboxGridItem();
      // Perform actions specific to CheckboxItem
      // Example: checkboxItem.setTitle("Updated title");
      return checkboxGridItem;

    case FormApp.ItemType.MULTIPLE_CHOICE:
      var multipleChoiceItem = item.asMultipleChoiceItem();
      // Perform actions specific to MultipleChoiceItem
      // Example: multipleChoiceItem.setPoints(5);
      return multipleChoiceItem;
      
    case FormApp.ItemType.TEXT:
      var textItem = item.asTextItem();
      // Perform actions specific to TextItem
      // Example: textItem.setRequired(true);
      return textItem;
      
    case FormApp.ItemType.GRID:
      var gridItem = item.asGridItem();
      // Perform actions specific to GridItem
      // Example: gridItem.setRows(["Row 1", "Row 2", "Row 3"]);
      return gridItem;
      
    case FormApp.ItemType.PARAGRAPH_TEXT:
      var paragraphTextItem = item.asParagraphTextItem();
      // Perform actions specific to ParagraphTextItem
      // Example: paragraphTextItem.setRequired(true);
      return paragraphTextItem;
      
    case FormApp.ItemType.LIST:
      var listItem = item.asListItem();
      // Perform actions specific to ListItem
      // Example: listItem.setChoiceValues(["Option 1", "Option 2", "Option 3"]);
      return listItem;
      
    case FormApp.ItemType.DATE:
      var dateItem = item.asDateItem();
      // Perform actions specific to DateItem
      // Example: dateItem.setRequired(true);
      return dateItem;
      
    case FormApp.ItemType.TIME:
      var timeItem = item.asTimeItem();
      // Perform actions specific to TimeItem
      // Example: timeItem.setRequired(true);
      return timeItem;
      
    case FormApp.ItemType.DATETIME:
      var dateTimeItem = item.asDateTimeItem();
      // Perform actions specific to DateTimeItem
      // Example: dateTimeItem.setRequired(true);
      return dateTimeItem;
      
    case FormApp.ItemType.SCALE:
      var scaleItem = item.asScaleItem();
      // Perform actions specific to ScaleItem
      // Example: scaleItem.setLowerBound(1).setUpperBound(5);
      return scaleItem;
      
    case FormApp.ItemType.GRID_SCALE:
      var gridScaleItem = item.asGridScaleItem();
      // Perform actions specific to GridScaleItem
      // Example: gridScaleItem.setRows(["Row 1", "Row 2", "Row 3"]);
      return gridScaleItem;
      
    // Add more cases for other item types as needed
    
    default:
      // Handle any other item types that require special handling
      return item;
  }
}

function convertStringToJson(inputString=testString) {
  var lines = inputString.split('\n');
  var json = {};
  var currentGoal = '';

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();

    if (line.endsWith('Goal:')) {
      currentGoal = line.replace(':', '').trim();
      json[currentGoal] = [];
    } else if (line !== '') {
      json[currentGoal].push(line.trim().replace(/[0-9]. /g, "")); // Remove order
    }
  }
  // console.log(json)
  return json;
}

function convertJsonToString(inputJson=testJson) {
  var result = '';

  for (var goal in inputJson) {
    if (inputJson.hasOwnProperty(goal)) {
      result += goal + ':\n';

      var items = inputJson[goal];
      for (var i = 0; i < items.length; i++) {
        result += (i + 1) + '. ' + items[i] + '\n'; // Add order back
      }

      result += '\n';
    }
  }
  return result.trim();
}

function convertNewIdeasStringToJson(str=inputIdeaString) {
  var json = {};

  // Remove square brackets and split string by comma
  var items = str.replace(/\[|\]/g, '').split(', ');

  for (var i = 0; i < items.length; i++) {
    var item = items[i].split(' ');
    var category = item[0] + " Goal";
    var value = item[1];

    if (!json[category]) {
      json[category] = [];
    }

    json[category].push(value);
  }
  console.log(json);
  return json;
}

function combineJSONItems(combinedJSON=testCombinedJSON, json=testJson) {
  for (var goal in json) {
    if (json.hasOwnProperty(goal)) {
      var items = json[goal];
      var modifiedItems = [];

      for (var i = 0; i < items.length; i++) {
        var modifiedItem = items[i];
        modifiedItems.push(modifiedItem);
      }

      if (combinedJSON.hasOwnProperty(goal)) {
        combinedJSON[goal] = combinedJSON[goal].concat(modifiedItems);
      } else {
        combinedJSON[goal] = modifiedItems;
      }
    }
  }
  console.log(combinedJSON)
  return combinedJSON;
}

var inputIdeaString = '[Working] OOXX111, [Leisure] XXOO111, [Learning] SSXX111 [Working] SSSS111, [Learning] WWWW111';
var testString = `Learning Goal:
1. SSS
2. XXX

Working Goal:
1. XDXXX
2. SSS

Leisure Goal:
1. ZZZZ
2. OOO`;

var testCombinedJSON = {
  "Learning Goal": [
    "Build an add-on and publish",
    "Check David's Code using ChatGPT",
    "Finish how to Defi",
    "Build a basic version personal coach using GAS and ChatGPT",
    "Make a donation",
    "Try AgentGPT and Linked to system service",
    "SSXX",
    "WWWW"
  ],
  "Working Goal": [
    "Excel Research",
    "Competition reports research",
    "OOXX",
    "SSSS"
  ],
  "Leisure Goal": [
    "OOXX"
  ]
}

var testJson = {
  "Working Goal": [
    "OOXX111"
  ],
  "Leisure Goal": [
    "XXOO111"
  ],
  "Learning Goal": [
    "SSXX111",
    "WWWW111"
  ]
}
