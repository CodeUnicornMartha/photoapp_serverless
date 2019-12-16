# Serverless PhotoApp

To implement this project, you need to implement a simple TODO application using AWS Lambda and Serverless framework. Search for all comments starting with the `Photo:` in the code to find the placeholders that you need to implement.

# Functionality of the application

This application will allow creating/removing/updating/fetching Photo items. Each Photo item can optionally have an attachment image. Each user only has access to Photo items that he/she has created.

# Photo items

The application should store Photo items, and each Photo item contains the following fields:

* `photoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a Photo item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Photo item

You might also store an id of a user who created a Photo item.

