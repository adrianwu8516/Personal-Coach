function weeklyNotification() {
  // GetDate
  var today = new Date();
  var sevenDaysAfter = new Date();
  sevenDaysAfter.setDate(today.getDate() + 7);
  
  //To do processing
  var toDoItem = getFormComponentByTitle(title="This Week To Do")[0]
  var toDoItemJSON = convertStringToJson(toDoItem.getHelpText())
  for (var goal of Object.keys(toDoItemJSON)){
    var title = "【" + goal + "】" + toDoItemJSON[goal].map(item => item.replace(/([\s\S]*?) - [\s\S]*/, "$1")).join("  |  ")
    console.log(title)
    var event = CalendarApp.getDefaultCalendar().createAllDayEvent(title, today, sevenDaysAfter);
  }

  // Calendar Event Analysis and Notification
  var hoursTaken = calendarEventAnalysis()
  notificationMailer(toDoItem.getHelpText(), hoursTaken)
}

function calendarEventAnalysis() {
  // Init
  var eventThisWeek = {"Work":[], "Meeting":[], "SideProject":[],"Life":[],"Learn":[]}
  // Time Span
  var today = new Date();
  var sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  var calendars = CalendarApp.getAllCalendars();

  for (var i = 0; i < calendars.length; i++) {
    var calendar = calendars[i];
    var calendarId = calendar.getId()
    switch(calendarId){
      case WORK_CALENDAR_A:
        var msftEvents = calendar.getEvents(sevenDaysAgo, today);
        if (msftEvents.length > 0) {
          Logger.log('Events from calendar "' + calendar.getName() + '" in the past 7 days between 8am and 7pm:');
          for (var j = 0; j < msftEvents.length; j++) {
            var event = msftEvents[j];
            var startTime = event.getStartTime();
            var endTime = event.getEndTime();

            // Check if the event falls between 8am and 7pm
            if (startTime.getHours() >= 8 && endTime.getHours() <= 20) {
              if (!event.getTitle().match(MeetingNotAttending))
              eventThisWeek['Meeting'].push(event)
            }
          }
        }
        break;
      case WORK_CALENDAR_B:
        var events = calendar.getEvents(sevenDaysAgo, today);
        if (events.length > 0) events.forEach(event => eventThisWeek['Work'].push(event))
        break;
      case SIDE_PROJECT_CALENDAR:
        var events = calendar.getEvents(sevenDaysAgo, today);
        if (events.length > 0) events.forEach(event => eventThisWeek['SideProject'].push(event))
        break;
      case LIFE_CALENDAR:
        var events = calendar.getEvents(sevenDaysAgo, today);
        if (events.length > 0) events.forEach(event => eventThisWeek['Life'].push(event))
        break;
      case LEARN_CALENDAR:
        var events = calendar.getEvents(sevenDaysAgo, today);
        if (events.length > 0) events.forEach(event => eventThisWeek['Learn'].push(event))
        break;
    }
  }
  var hoursTaken = countHoursByGroup(eventThisWeek)
  return hoursTaken
}

function countHoursByGroup(jsonData) {
  var groups = Object.keys(jsonData);
  var hoursTaken = {};

  // Initialize hoursTaken object
  groups.forEach(function (group) {
    hoursTaken[group] = 0;
  });
  // Process events for each group
  groups.forEach(function (group, index) {
    var events = jsonData[group];
    console.log(`=========================${group}=========================`)
    events.forEach(function (event) {
      if (!event.isAllDayEvent()) {
        console.log(`${event.getTitle()} spend ${Math.round((event.getEndTime() - event.getStartTime())/1800000)/2} hours`)
        hoursTaken[group] += Math.round((event.getEndTime() - event.getStartTime())/1800000)/2;
      }
    });
  });
  // Logger.log("Hours taken in each group:");
  // groups.forEach(function (group) {
  //   Logger.log(group + ": " + hoursTaken[group] + " hours");
  // });
  console.log(hoursTaken)
  return hoursTaken
}

function notificationMailer(toDoItemStr, hoursTaken={ "Work": 18, "Meeting": 10.5, "SideProject": 25, "Life": 16.5, "Learn": 0 }) {
  // Data Processing  
  var groups = Object.keys(hoursTaken);
  var pct = {}
  var highestHour = 0
  Logger.log("Hours taken in each group:");
  groups.forEach(function (group) {
    Logger.log(group + ": " + hoursTaken[group] + " hours");
    if(hoursTaken[group]>highestHour) highestHour = hoursTaken[group]
  });
  groups.forEach(group => pct[group] = Math.round((hoursTaken[group]/highestHour)*100));

  // Recording
  var recordSheet = getRecordSpreadsheet().getSheetByName("WeeklyAnalysis")
  recordSheet.insertRowAfter(1)
  recordSheet.getRange("A2:F2").setValues([[
    hoursTaken['Work'], hoursTaken['Meeting'], hoursTaken['SideProject'], hoursTaken['Life'], hoursTaken['Learn'], generateTimestamp()
  ]])

  // Email Generation
  var template = HtmlService.createTemplateFromFile('email_template');
  template.toDoItemStrArr = toDoItemStr.split(/\n/).map(str => str.replace(/[0-9]*. ([\s\S]*)/, "$1"))
  template.hoursTaken = hoursTaken;
  template.pct = pct;
  var htmlBody = template.evaluate().getContent();

  //GetChart
  var charts = recordSheet.getCharts();
  var chartBlobs = new Array(charts.length); 
  var emailImages={};
  for(var i=0;i<charts.length;i++){
    chartBlobs[i]= charts[i].getAs("image/png").setName("chartBlob"+i);
    htmlBody += "<img src='cid:chart"+i+"'><br>";
    emailImages["chart"+i]= chartBlobs[i];
  }

  GmailApp.sendEmail('adrianwu8516@gmail.com', 'Your Weekly Progress Report', '', {
    htmlBody: htmlBody,
    inlineImages:emailImages
  });
}