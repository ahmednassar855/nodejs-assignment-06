import express from 'express'
import  {dbConnection}  from './databases/dbConnection.js'
import userRouter from './src/modules/users/user.router.js';
import productRouter from './src/modules/produtcs/product.router.js';

const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))


app.use(userRouter);

app.use(productRouter);

dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))