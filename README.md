## Photos From Here Development Plan:

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
