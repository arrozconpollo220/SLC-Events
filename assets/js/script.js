//define global variables
var eventID;
var eventsList;

//This function processes the data received from the modal form to request data from Ticketmaster
function getEventData(startDate, endDate, eventType) {  
    const start = dayjs(startDate).format(YYYY-MM-DD);  
    const end = dayjs(endDate).add(1, day).format(YYYY-MM-DD);  //needs to be end date plus one day for Zulu time conversion

    //convert received list type to API classification
    var APIClass
    if (eventType = "") {  //Waiting for modal to be completed to finish line <---------------------------------
        APIClass = "&classificationName=sports";
    } else if (eventType = "") {  //Waiting for modal to be completed to finish line <---------------------------------
        APIClass = "&classificationName=music"; 
    } else if (eventType = "") {  //Waiting for modal to be completed to finish line <---------------------------------
        APIClass = "&classificationName=arts%20%26%20theatre"; 
    } else if (eventType = "") {  //Waiting for modal to be completed to finish line <---------------------------------
        APIClass = "&classificationName=Miscellaneous"; 
    } else {
        APIClass = ""
    }

    //fetches data from Ticketmaster and stores in eventsList variable
    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?&city=salt%20lake%20city&apikey=EFLPko3jjswvkWgJxXg6p9OyquHfVL5A&startDateTime=${start}T06:00:00Z&endDateTime=${end}T05:59:59Z${APIClass}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        eventsList = data;
        console.data(eventsList);
        //call function to render events list - Waiting for function to be available <----------------------------
    })
    .catch(error => {
        console.error("Could not fetch event data.")
    })
}