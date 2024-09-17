const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'user-management-app/build')));

app.use('/api', authRoutes);

// The "catchall" handler: for any request that doesn't match one above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'user-management-app/build', 'index.html'));
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});