import express from 'express';

const app = express();

const PORT = 3000;
const HOST = '0.0.0.0';


app.get('/', (req, res) => {
  res.send('Hello, World! asdasdasw213123asdasdasdasdd ');
});


app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});