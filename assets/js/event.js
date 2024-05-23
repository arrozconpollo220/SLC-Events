//get event data from local storage
var eventData = JSON.parse(localStorage.getItem('SLCeventData'));
console.log(eventData);  //Remove this line after Ricardo is complete with the page rendering <-----------------------------------------------------

function populateEvent(event) {
    const eventImage = document.getElementById('event-image'); //I created a variable to store information
    const eventDescription = document.getElementById('event-description'); //I created a variable to store information
    const eventVideo = document.getElementById('event-video'); //I created a variable to store information

    // get the fisrt image using the index 0
    if (event.images && event.images.length > 0) {
        eventImage.src = event.images[0].url;
        eventImage.alt = event.name || 'Event Image';
    } else {
        eventImage.src = ''; // path to a placeholder image
        eventImage.alt = 'Placeholder Image';
    }

    // shows the description of the event
    eventDescription.textContent = event.info || 'No description available.';

    // if we get a URL from youtube shows a video using the index 0
    if (event.externalLinks && event.externalLinks.youtube && event.externalLinks.youtube.length > 0) {
        const youtubeUrl = event.externalLinks.youtube[0].url;
        const videoElement = document.createElement('iframe');
        videoElement.src = youtubeUrl;
        videoElement.width = '100%';
        videoElement.height = '200px';
        videoElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        videoElement.allowFullscreen = true;

        eventVideo.innerHTML = ''; // clear the previus content
        eventVideo.appendChild(videoElement);
    } else {
        eventVideo.textContent = 'No video available';
    }
}
