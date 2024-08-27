import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello, Jest');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
