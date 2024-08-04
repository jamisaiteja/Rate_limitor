const http = require("http");
const fs = require("fs");
const isRateLimited = require("./ratelimitor");

const server = http.createServer(function (req, res) {
  const ip = req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    res.statusCode = 429;
    const rateLimitMessage =
      "Rate limit exceeded. Please wait 2 minutes before making another request.";
    fs.appendFileSync(
      "error.txt",
      `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] Rate limit exceeded for IP: ${ip}\n`
    );
    return res.end(rateLimitMessage);
  }

  const data = `[Date : ${new Date().toLocaleDateString()}, Time : ${new Date().toLocaleTimeString()}, Ip Address : ${ip}, Path : ${
    req.url
  }, StatusCode:${res.statusCode}]\n`;
  fs.appendFileSync("log.csv", data);

  try {
    switch (req.url) {
      case "/":
        return res.end("Homepage");
      case "/about":
        return res.end("I am Jami Saiteja");
      case "/search":
        return res.endd("You are in search page");
      case "/logs": {
        const data1 = fs.readFileSync("log.csv", "utf-8");
        return res.end(data1);
      }
    }
    res.statusCode = 404;
    return res.end("Not Found, Please Try Someother thing");
  } catch (err) {
    res.statusCode = 500;
    const error = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] : ${err}`;
    fs.appendFileSync("error.txt", error);
    return res.end(
      "500 Internal Server, Something went Wrong, Please try again in sometime"
    );
  }
  //   console.log("server inside");
  //   res.end("Hello server");
});

server.listen(8000, () => {
  console.log("server listening on port no 8000");
});
