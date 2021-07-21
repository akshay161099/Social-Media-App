To run backend server, cd into nodeapi.
Create a .env file with following credentials.

APP_NAME=nodeapi
MONGO_URI=mongodb://localhost:27017/nodeapi
PORT=8080
JWT_SECRET=xxxxxx
CLIENT_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=xxxxxx.apps.googleusercontent.com

then run: npm install
npm start(or npm run dev)

To run the react frontend server, cd into react-frontend and create .env file with following credentials:
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_GOOGLE_CLIENT_ID=xxxxxx.apps.googleusercontent.com


and run: npm install
npm start

You can access the website at localhost:3000
