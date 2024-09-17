const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
