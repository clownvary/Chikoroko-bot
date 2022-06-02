const http = require('http');

http.createServer((req, res) => {
    res.write("Hello, i am alive!");
    res.end();
}).listen(8080, () => {
    console.log(`app listening at http://localhost:8080`);
});