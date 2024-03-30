# There - Social Media
[My Notes](notes.md)

## Description deliverable

### Elevator pitch
Imagine connecting with others at events in real-time, where physical presence unlocks exclusive conversations. With "There," events become more than just memories – they become immersive experiences. Here's how it works: Events are marked geographically, ensuring that only those physically present can engage in the chat. Share the excitement, laughter, and moments that define the event with a select audience, fostering genuine connections that transcend the virtual world. Meanwhile, everyone else is going to wake up the next morning with a bad case of FOMO. Some message can even be marked public igniting the curiosity of those not in attendance even more while they see all the messages they missed out on. So don't miss out. Be "There".

### Design
A list of events near you, an explore page.  
![MockEvents](Mockup/ThereMockup-Events.png)

A chat for someone who did not attend. For those that did it will look like a normal chat.  
![MockChat](Mockup/ThereMockup-Chat.png)

Sequence Diagram  
![SequenceDiagram](Mockup/ThereMockup-Sequence.png)  

### Key feature
- Secure login over HTTPS
- Setup events at a given time and date as well as location
- Search for events near your geographical location
- Chat with people live while at an event physically
- See old chats from events (if you did not attend only the public chats)

### Technologies
I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Pages will include:
  - create account
  - login
  - explore nearby events
  - create new event
  - chat at events
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, location information, display events, display chat.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving events
  - creating events
  - retrieving chats
  - creating chats
- **DB/Login** - Store users, events, chats in database. Register and login users. Credentials securely stored in database. Can't chat unless authenticated.
- **WebSocket** - As each user sends chat messages, all users will see the message update.
- **React** - Application ported to use the React web framework.

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

- **HTML pages** - Five HTML pages that represent the ability to view and create events, see all events, see the user's events, and sign in/sign up.
- **Links** - Clicking on an event takes you to the chat, header links the sign in, profile, and new event together. Signing in takes you to your profile.
- **Text** - Lorem ipsums as a place holder of event details and chat messages.
- **Images** - Google maps image to represent the live visualization of google maps.
- **DB/Login** - Input box and submit button for login. The events and their chats represent data pulled from the database.
- **WebSocket** - The chat messages will be updated live by websockets. 

## CSS deliverable
For this deliverable I properly styled the application into its final appearance.

  - Header, footer, and main content body use flex for proper responsive layout
  - Navigation elements - I dropped the underlines and changed the color for anchor elements. I also added a hover effect to show an underline.
  - Responsive to window resizing - My app looks great on all window sizes and devices
  - Application elements - Used good contrast and whitespace
  - Application text content - Consistent fonts
  - Application images - Demo images are properly used and sized.

## JavaScript deliverable

For this deliverable I implemented by JavaScript so that the application works for a multiple users using the same browser (localhost). I also added placeholders for future technology.

- **login** - You can sign up and login which will send you to the profile page.
- **database** - Create places, messages, and users. Be able to display this information on appropriate pages. Currently this is stored and retrieved from local storage, but it will be replaced with the database data later.
- **WebSocket** - I used the setInterval function to periodically send a chat message in every place. This will be replaced with WebSocket messages later.
- **application logic** - Page to allow for creating a place and setting it's bounds on a google map, name, and description. User can send in messages while signed in and at a physical location.

## Service deliverable

For this deliverable I added backend endpoints to store all data in localstorage now in the server memory. The goals is to turn this into database endpoints when we implement the databse.

- **Node.js/Express HTTP service** - done!
- **Static middleware for frontend** - done!
- **Calls to third party endpoints** - Using dad jokes api to get random user messages in the chats.
- **Backend service endpoints** - Endpoints to perform basic database functionality.
- **Frontend calls service endpoints** - I did this using the fetch function.

## DB/Login deliverable

For this deliverable I associated the places and messages with the user. I store this data in the database.

- **MongoDB Atlas database created** - done!
- **Stores data in MongoDB** - done!
- **User registration** - Creates a new account in the database.
- **existing user** - Stores the places and messages under the same user if the user already exists.
- **Use MongoDB to store credentials** - Stores both user and their places and messages.
- **Restricts functionality** - You cannot message or create places until you have logged in. This is restricted on the backend.

## WebSocket deliverable

For this deliverable I used webSocket to update the chat messages on the frontend in realtime.

- **Backend listens for WebSocket connection** - done!
- **Frontend makes WebSocket connection** - done!
- **Data sent over WebSocket connection** - done!
- **WebSocket data displayed** - All user messages display in realtime.