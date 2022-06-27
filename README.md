# Exam #2: "Meme Generator"
## Student: s284055 COLOMBO GUGLIELMO

## React Client Application Routes

- Route `/`: redirect to /Public
- Route `/Public`: page that shows public memes
- Route `/Protected`: page that shows protected memes
- Route `/login`: page containing a form to login

## API Server

- POST `/api/sessions`
  * Description: logs a user in the application
  * Request: POST http://localhost:3001/api/sessions HTTP/1.1
  * Request body: An object with user authentication parameters

```json
{
  "username": "guglielmo.colombo@polito.it",
  "password": "password"
}
```
  * Response: `401 Unauthorized` (failed login) or `200 OK` (success). If the request body is not valid. If the request body is not valid, `422 Unprocessable Entity` (validation error). Otherwise `500 Internal Server Error`(generic error).
  * Response body: An object with user info

```json
{
  "id": 1,
  "email": "guglielmo.colombo@polito.it",
  "name": "Guglielmo"
}
```

- GET `/api/sessions/current`
  * Description: Verifies wether the user is authenticaded or not
  * Request: GET http://localhost:3001/api/sessions/current HTTP/1.1
  * Request body: None
  * Response: `200 OK` (Success), `401 Unauthorized` (Not logged in). Otherwise `500 Internal Server Error`(generic error).
  * Response body: An object containing all the information of the user

```json
{
  "id": 1,
  "email": "guglielmo.colombo@polito.it",
  "name": "Guglielmo"
}
```

- DELETE `/api/sessions/current`
  * Description: : Performs the logout
  * Request: DELETE http://localhost:3001/api/sessions/current HTTP/1.1
  * Request body: None
  * Response: `200 OK` (success), `503 Service Unavailable` (generic error)
  * Response body: None


- GET `/api/images`
  * Description: retrieves the backgound images and relative properties from db.
  * Request: GET http://localhost:3001/api/images HTTP/1.1
  * Request body: None
  * Response: `200 OK` (Success), `500 Internal Server Error`(generic error) or `404 Not found`
  * Response body: An array of objects, each describing a background image.

```json
[
  {
    "id": 1,
    "path": "/images/Morgan.jpg",
    "name": "Morgan",
    "ntext": 1,
    "css": "top-m",

  },
  {...}
]
```
- GET `/api/memes`
  * Description: retrieves all memes from db.
  * Request: GET http://localhost:3001/api/memes/Public HTTP/1.1
  * Request body: None
  * Response: `200 OK` (Success), `500 Internal Server Error`(generic error) or `404 Not found`
  * Response body: An array of objects, each with the informations of a public meme.

```json
[ 
  {
     "id": 1,
     "id_image": 1,
     "meme_title": "Meme1 Utente1",
     "id_user": 1,
     "name_user": "Guglielmo",
     "text1": "Scritta Top",
     "text2": "",
     "text3": "",
     "font": "sans-serif",
     "color": "white",
     "protected": 0
  },
  {...}
]
```
- GET `/api/memes/Public`
  * Description: retrieves all public memes from db.
  * Request: GET http://localhost:3001/api/memes/Public HTTP/1.1
  * Request body: None
  * Response: `200 OK` (Success), `500 Internal Server Error`(generic error) or `404 Not found`
  * Response body: An array of objects, each with the informations of a public meme.

```json
[ 
  {
     "id": 1,
     "id_image": 1,
     "meme_title": "Meme1 Utente1",
     "id_user": 1,
     "name_user": "Guglielmo",
     "text1": "Scritta Top",
     "text2": "",
     "text3": "",
     "font": "sans-serif",
     "color": "white",
     "protected": 0
  },
  {...}
]
```
- GET `/api/memes/Protected`
  * Description: retrieves all protected memes from db.
  * Request: GET http://localhost:3001/api/memes/Protected HTTP/1.1
  * Request body: None
  * Response: `200 OK` (Success), `500 Internal Server Error`(generic error), `404 Not found`, `401 Unauthorized`
  * Response body: An array of objects, each with the informations of a public meme.

```json
[
  {
     "id": 3,
     "id_image": 3,
     "meme_title": "Meme3(copia) Utente2",
     "id_user": 3,
     "name_user": "Stefano",
     "text1": "Scritta Top",
     "text2": "",
     "text3": "Scritta Bottom",
     "font": "sans-serif",
     "color": "black",
     "protected": 1
  },
  {...}
]
```
- POST `/api/addMeme`
  * Description: Add a new meme to the list of memes.
  * Request: POST http://localhost:3001/api/addMeme HTTP/1.1
  * Request body: An object representing a meme (Content-Type: application/json).

```json
{
  "id": null,
  "bim": {
    "id": 1,
    "path": "/images/morgan.jpg",
    "name": "Morgan",
    "ntextmax": 2,
    "position": "top-m"
  },
  "title": "Esempio",
  "idUser": null,
  "userName": null,
  "font": "sans-serif",
  "color": "white",
  "text1": "prova",
  "text2": "",
  "text3": "",
  "isProtected": 0,
  "status": "added"
}
```
* Response: `201 Created` (success) or `503 Service Unavailable` (generic error) or `401 Unauthorized`. If the request body is not valid, `422 Unprocessable Entity` (validation error).
  * Response body:

```json
{
  "lastID": 14
}
```
- DELETE `/api/deletememe/:id`
  * Description: : Delete an existing meme, identified by its id `id`
  * Request: DELETE http://localhost:3001/api/deletememe/7 HTTP/1.1
  * Request body: None
  * Response: `204 No Content` (success), `503 Service Unavailable` (generic error), `422 Unprocessable Entity` (validation error).
  * Response body: None


## Database Tables

- Table `users` - contains id email name hash
- Table `images` - contains id path name ntext css
- Table `memes` - contains id id_image meme_title id_user name_user text1 text2 text3 font color protected

## Main React Components

- `MyNavbar` (in `MyNavbar.js`): App navbar.
- `MySidebar` (in `MySidebar.js`): App sidebar.
- `MyMain` (in `MyMain.js`): App main content showing list of memes and modals to view, create and copy memes.
- `MyModal` (in `MyModal.js`): Modal used to create a new meme from a base image in the list.
- `MyModalView` (in `MyModalView.js`): Modal used to view info of a meme from the list.
- `MyModalError` (in `MyModalError.js`): Modal used to signal you have no rights to perform a delete.
- `NoAuthentication` (in `NoAuthentication.js`): Module used to signal you have no rights to view Personal or Protected memes.
- `Meme` (in `MemeView.js`): Element containing a meme (image + text) and 3 buttons (view, copy, delete).
- `LoginForm` (in `LoginComponents.js`): Form to manage login.

## Screenshot

![Foto1](./ScreenShot/modal_create.jpg)
![Foto2](./ScreenShot/modal_copy.jpg)


## Users Credentials

- username, password (plus any other requested info)
- guglielmo.colombo@polito.it , password , Guglielmo (Nome). Meme Creati: "Meme1 Utente1"(pubblico), "Meme2 Utente1"(pubblico), "Meme3(copia) Utente1"(protetto)
- stefano.degrandis@polito.it, password1 , Stefano (Nome). Meme Creati: "Meme1 Utente2"(pubblico), "Meme2 Utente2"(pubblico), "Meme3(copia) Utente2"(protetto)
- mario.sconcerti@polito.it, password2, Mario (Nome). Meme Creati: "Meme1 Utente3"(pubblico), "Meme2 Utente3"(pubblico), "Meme3(copia) Utente3"(protetto)
#   p r o v a _ a p p _ t e s i  
 