const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler untuk SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Debate Tabulator running on port', PORT);
});
