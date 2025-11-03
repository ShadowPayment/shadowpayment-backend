
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Dummy payment storage
const paymentsFile = 'payments.json';
if (!fs.existsSync(paymentsFile)) fs.writeFileSync(paymentsFile, JSON.stringify([]));

app.post('/upload', upload.single('proof'), (req, res) => {
  const payments = JSON.parse(fs.readFileSync(paymentsFile));
  payments.push({
    id: Date.now(),
    filename: req.file.filename,
    method: req.body.method,
    status: 'pending'
  });
  fs.writeFileSync(paymentsFile, JSON.stringify(payments));
  res.json({ success: true });
});

app.get('/status', (req, res) => {
  const payments = JSON.parse(fs.readFileSync(paymentsFile));
  res.json(payments);
});

app.listen(3000, () => console.log('Server running on port 3000'));
