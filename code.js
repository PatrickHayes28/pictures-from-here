// To run this assignment, right click on index.html in the Visual Studio file explorer to the left
// and select "Open with Live Server"

//this is my key to use the flickr api
//Key:
//c30e406bc6b257d9450039b95efe1416
//this secret came with the api key                 //im getting images related to my location but when I get to the end of the set clicking next photo doesn't go back to the first photo
//Secret:
//78ab41834364bee8

// Your Code Here.
class FlickrPhotos {
  //this is the class we are using with the prototypes
  constructor(location) {
    this.term = "near me "; //this is the search term we are using to search for images from flickr and changing it will change what images we get
    this.location = location;
    this.container = document.getElementById("photoContainer");
    this.page = 1; //there will be 1 page
    this.perPage = 5; //and 5 photos will be shown per page
    this.currentPhotoIndex = 0; //starting at the 1st photo
    this.photos = []; // the photos will be stored in an array
    this.isLoading = false; // as long as isLoading is false the button will work
    document
      .getElementById("next")
      .addEventListener("click", this.displayNextPhoto.bind(this)); //this event listener relates to the button with id next and the keyword this is bound to the current object
  }

  startSlideShow() {
    setInterval(this.displayNextPhoto.bind(this), 1000); //this creates a delay to display the next photo 1000 milliseconds or 1 second after clicking the button to displayNextPhoto
  }

  displayNextPhoto() {
    this.currentPhotoIndex += 1; //thin increments the index of the photo array by one
    // if the data is being loaded, disable the button
    if (this.isLoading) {
      return;
    } //if the current photo is less than the array length
    if (this.currentPhotoIndex < this.photos.length) {
      let photoObject = this.photos[this.currentPhotoIndex];
      this.displayPhotoObject(photoObject); //display an image
    } else {
      // if its not less than the array console.log the message
      this.page += 1; //and move on to the next page
      this.currentPhotoIndex = 0;
      this.fetchDataFromFlickr();
    }
  }

  displayPhotoObject(photoObj) {
    //this displays the photos to the page by creating a img element and setting the image url to that img element and then appending it to the container of images
    let imageUrl = this.constructImageURL(photoObj);
    let img = document.createElement("img");
    img.src = imageUrl;
    this.container.innerHTML = "";
    this.container.append(img);
  }

  processFlickrResponse(parsedResponse) {
    //this handles the response from flickr to display the photos
    this.setLoading(false);
    this.photos = parsedResponse.photos.photo;
    if (this.photos.length > 0) {
      let firstPhotoObject = this.photos[this.currentPhotoIndex];
      this.displayPhotoObject(firstPhotoObject);
    } else {
      this.container.innerHTML = "No more pictures";
    }
  }

  setLoading(isLoading) {
    //this sends out a message if its taking longer to display the photo
    let loadingSpan = document.getElementById("loading");
    if (isLoading) {
      this.isLoading = true; //if its true the button will be disabled until the photo loads
      loadingSpan.innerHTML = "Loading please wait";
    } else {
      this.isLoading = false;
      loadingSpan.innerHTML = "";
    }
  }

  fetchDataFromFlickr() {
    //this uses fetch to get the data from flickr
    let url = this.generateApiUrl();
    let fetchPromise = fetch(url); //using asyncronous code promise to do the task sometime in the future
    this.setLoading(true);
    fetchPromise
      .then((response) => response.json()) //then syntax means after the promise is done,json helps js read the data coming from flickr
      .then((parsedResponse) => this.processFlickrResponse(parsedResponse)); //parsedResponse is just a variable describing how jason converts the data to real javascript
  }

  generateApiUrl() {
    return (
      "https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/" +
      "?api_key=c30e406bc6b257d9450039b95efe1416" +
      "&format=json" +
      "&nojsoncallback=1" +
      "&method=flickr.photos.search" +
      "&safe_search=1" +
      "&per_page=" +
      this.perPage +
      "&page=" +
      this.page +
      "&text=" +
      this.term +
      "&lat=" +
      this.location.latitude +
      "&lon=" +
      this.location.longitude +
      "&text=near me"
    );
  }

  constructImageURL(photoObj) {
    return (
      "https://farm" +
      photoObj.farm +
      ".staticflickr.com/" +
      photoObj.server +
      "/" +
      photoObj.id +
      "_" +
      photoObj.secret +
      ".jpg"
    );
  }
}

function onSuccess(data) {
  // this function is run when the app is successful at getting the user's location
  let location = data.coords;
  let gallery = new FlickrPhotos(location);
  gallery.fetchDataFromFlickr();
}

function onError() {
  //this function will run when the app is unsucessful at getting the user's location
  const fallbackLocation = { latitude: 35.6762, longitude: 139.6503 }; // tokyo, japan
  let gallery = new FlickrPhotos(fallbackLocation);
  gallery.fetchDataFromFlickr();
}

navigator.geolocation.watchPosition(onSuccess, onError);

/*
Photos From Here Development Plan:
----------------------------------
A. Get location that we want to see photos of
  1. use Geolocation API to get coordinates (lat and lon) or use a fallback location
	- [ this is a link to the documentation ]
B. Get photo info from Flickr
  1. use fetch() to send a GET request to flickr.com/services/rest
	- Include the lat and lon
	- Include a search term
  2. Process the promises to get the photo data
	- Convert JSON to a usable object ("rehydrate")
	- Send the photo data to a display function
C. Display photos
  1. Create the image URLs from the photo data (function)
	- https://www.flickr.com/services/api/misc.urls.html
  2. Insert an <img> tag into the page
	- crate an img element
	- set src attribute to image URL
	- append the element to the right place in the document
  3. Display link to the image's Flickr page (function)
	- (Same stuff as the img tag)
D. Provide a way to advance through photos
1. Get the geographic location from the browser
2. Construct the query URL
3. Use fetch to send the request to Flickr
4. Process the response data into an object
5. Use the values in the response object to construct an image source URL
6. Display the first image on the page
7. In response to some event (e.g. a button click or a setInterval), show the next image in the collection
*/
