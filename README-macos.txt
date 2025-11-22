
MacOS Setup Instructions (Apple Silicon, Node 3.11.8)

1. Make sure you are in this project folder in Terminal, for example:
   cd ~/Desktop/standly_hospital_management

2. Backend:
   cd backend
   npm install
   npm start

3. Frontend:
   # In a second terminal window/tab
   cd ~/Desktop/standly_hospital_management
   npm install
   npm run dev

4. MongoDB
   Make sure MongoDB is running via Homebrew:
   brew services start mongodb/brew/mongodb-community@7.0

All node_modules and lock files were removed so that MacOS can install native dependencies cleanly.
