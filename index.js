if (process.env.DATABASE_URL === undefined) require('dotenv').config();
const server = require('./server');

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`\n\n \u{1F680}\u{1F680} Express API Running on Port ${port} \n\n`));