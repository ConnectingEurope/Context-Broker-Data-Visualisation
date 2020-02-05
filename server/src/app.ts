import express from 'express';

const app: express.Express = express();
const port: number = 3005;

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});