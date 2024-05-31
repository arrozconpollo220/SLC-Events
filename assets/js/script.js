//define global variables
var eventsList;
const eventListEl = document.getElementById("event-list");

//This function processes the data received from the modal form to request data from Ticketmaster
function getEventData(startDate, endDate, eventType) {
  const start = dayjs(startDate).format("YYYY-MM-DD");
  const end = dayjs(endDate).add(1, "day").format("YYYY-MM-DD"); //needs to be end date plus one day for Zulu time conversion
  //convert received list type to API classification
  var eventClass = eventType;
  var APIClass;
  if (eventClass === "Sports") {
    APIClass = "&classificationName=sports";
  } else if (eventClass === "Music") {
    APIClass = "&classificationName=music";
  } else if (eventClass === "Arts & Theatre") {
    APIClass = "&classificationName=arts%20%26%20theatre";
  } else if (eventClass === "Shows") {
    APIClass = "&classificationName=Miscellaneous";
  } else {
    APIClass = "";
  }
  
  //fetches data from Ticketmaster and stores in "eventList" variable
  fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?&city=salt%20lake%20city&apikey=EFLPko3jjswvkWgJxXg6p9OyquHfVL5A&startDateTime=${start}T06:00:00Z&endDateTime=${end}T05:59:59Z&sort=date,asc${APIClass}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      eventsList = data;
      renderEventList();
    });
}

//This function renders the event list to the home page
function renderEventList() {
  const eventsArray = eventsList._embedded.events;
    eventListEl.textContent = "";
  for (i = 0; i < eventsArray.length; i++) {
    //set variables for the data
    const eventID = eventsArray[i].id;
    const eventDate = dayjs(eventsArray[i].dates.start.localDate + ' ' + eventsArray[i].dates.start.localTime).format("MM/DD/YYYY @ h:mm A");
    const eventTime = eventsArray[i].dates.start.localTime;
    const eventLoc = eventsArray[i]._embedded.venues[0].name;
    //dynamically create elements
    const nextEventContainer = document.createElement("div");
    const eventTitle = document.createElement("h1");
    const eventDetails = document.createElement("p");
    //set text content of the elements
    eventTitle.textContent = eventsArray[i].name;
    eventDetails.textContent = `${eventDate}, ${eventLoc}`;
    //render each event item to the page
    nextEventContainer.append(eventTitle);
    nextEventContainer.append(eventDetails);
    eventListEl.append(nextEventContainer);
    //set attributes
    nextEventContainer.classList.add("eventListItem");
    nextEventContainer.setAttribute("index", i);
  }
}

//add event listener to items in event list
eventListEl.addEventListener("click", function (event) {
  event.stopPropagation();
  var index = event.target.getAttribute("index");
  localStorage.setItem(
    "SLCeventData",
    JSON.stringify(eventsList._embedded.events[index])
  );
  window.location.href = "event.html";
});

//when page loads, populate all events for today only
window.onload = (event) => {
  getEventData(dayjs(), dayjs(), "");
};

// Keith: Modal section------------------------------------------------------------------------------------
const modalBox=document.getElementById("modal-js-example");

document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
    modalBox.style.display="block"; 
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
    modalBox.style.display="none"; 
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
});

document.getElementById("search-btn").addEventListener("click", function(e){
    
    const startDate=document.getElementById("start-date").value;
    const endDate=document.getElementById("end-date").value;
    const eventType=document.getElementById("eventTypeSelector").value;
    getEventData(startDate, endDate, eventType);
    modalBox.style.display="none";       
});
// end of modal section
