# Setup Instructions

## Environment Variables Setup

To enable MongoDB and AI features, you need to create a `.env` file in the `project/server/` directory.

### 1. Create the .env file
Create a file named `.env` in: `C:\Users\Admin\OneDrive\Desktop\Ai_timetable\project\server\.env`

### 2. Add your configuration
Add the following content to your `.env` file:

```
# MongoDB Connection String
# Get this from MongoDB Atlas (https://www.mongodb.com/atlas/database)
# Format: mongodb+srv://username:password@cluster.mongodb.net/database_name
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/timetable_db

# Gemini API Key
# Get this from Google AI Studio (https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Enable MongoDB in server/index.js
After creating the `.env` file, uncomment the MongoDB connection code in `server/index.js`:

```js
// Remove the comments from these lines:
console.log('MONGODB_URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
```

### 4. Restart your application
Run `npm run dev` from the project directory to restart with the new configuration.

## Current Status
- ✅ Frontend is working
- ✅ Teachers page now supports subject selection
- ✅ Timetable generation is functional
- ⏳ MongoDB connection (requires .env setup)
- ⏳ AI chatbot (requires valid API key)

## Features Fixed
1. **Teachers Page**: Now properly handles subject selection with checkboxes and custom subject input
2. **Timetable Generation**: Basic timetable generation is working
3. **PDF Export**: PDF export functionality is implemented
4. **Backend**: Server is running and ready for database integration 