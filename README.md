NodeJS  + Express framework sript that provide images and describe for landing site. To run script enter node site.js in comand line. 
Function:
Checks for the gallery folder.
Iterates through each subdirectory in this folder, which represents a separate gallery.
Each folder is searched for an image (. jpg, .jpeg, .png, .webp) and a meta.json metadata file.
Reads metadata from meta.json (if it exists) and are combined with defaults.
Returns a list of objects containing the image path, title, and description.

API Endpoint:
app. get('/api/gallery',...): creates a GET endpoint that returns JSON with gallery data.
Data is cached for one hour using the Cache-Control header.
