const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { parse } = require('csv-parse');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  fs.createReadStream(file.path)
    .pipe(parse({ columns: true }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.unlinkSync(file.path); // Clean up uploaded file
      res.json({ transactions: results });
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)); 