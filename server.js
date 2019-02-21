const http = require("http");
const hostname = "localhost";
const port = 8080;
const fs = require("fs");
const querystring = require("querystring");

let elementCounter = 2;

const server = http.createServer((req, res) => {
  const { url, method } = req;
  console.log(method);

  if (method === "GET") {
    switch (url) {
      case "/":
      case "/index.html": {
        fs.readFile("./public/index.html", (err, data) => {
          if (err) {
            console.log(err);
          }
          res.write(data.toString());
          res.end();
        });
        break;
      }
      case "/hydrogen.html":
        fs.readFile("./public/elements/hydrogen.html", (err, data) => {
          if (err) {
            console.log(err);
          }
          res.write(data.toString());
          res.end();
        });
        break;
      case "/helium.html":
        fs.readFile("./public/elements/helium.html", (err, data) => {
          if (err) {
            console.log(err);
          }
          res.write(data.toString());
          res.end();
        });
        break;
      case "/css/styles.css":
        fs.readFile("./public/css/styles.css", (err, data) => {
          if (err) {
            console.log(err);
          }
          res.write(data.toString());
          res.end();
        });
        break;
      case "/favicon.ico":
        res.end();
        break;
      default:
        console.log("url", url.toString());
        fs.readFile("./public/elements" + url, (err, data) => {
          if (err) {
            fs.readFile("./public/404.html", (err, data) => {
              if (err) {
                console.log(err);
                res.write(data.toString());
                res.end();
              } else {
                res.write(data.toString());
                res.end();
              }
            });
          } else {
            console.log(data.toString());
            res.write(data.toString());
            res.end();
          }
        });
        break;
    }
  }
  if (method === "POST") {
    let body = [];
    req
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        let parsedBody = querystring.parse(body);
        let lowerElementName = parsedBody.elementName.toLowerCase();
        fs.writeFile(
          `public/elements/${lowerElementName}.html`,
          createElement("parsed", parsedBody),
          err => {
            if (err) {
              console.log(err);
            }
          }
        );
        addElementToIndex();
      });
  }
});

const updatedIndex = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>

  <body>
    <h1>The Elements</h1>
    <h2>These are all the known elements.</h2>
    <h3>These are ${elementCounter}</h3>
    <ol>

    </ol>
  </body>
</html>`;

let splittedChunk = updatedIndex.split("</ol>");
console.log("splittedChunk = ", splittedChunk);

const addElementToIndex = () => {
  elementCounter++;
  fs.readdir("public/elements", (err, data) => {
    data.map(element => {
      console.log("element = ", element);
      let capitalizeElement = element.split(".")[0];
      console.log("capitalizeElement = ", capitalizeElement);
      let elementName =
        capitalizeElement.charAt(0).toUpperCase() + capitalizeElement.slice(1);
      console.log("elementName = ", elementName);

      let newLi = `<li> <a href="/${element}">${elementName}</a></li>`;

      splittedChunk.splice(1, 0, newLi);
      console.log(splittedChunk);
      let updatedHTML = splittedChunk.join("");
      console.log("updatedHTML = ", updatedHTML);

      fs.writeFile("public/index.html", updatedHTML, function(err) {
        if (err) {
          console.log(err);
        }
      });
      if (err) {
        console.log(data);
      }
    });
  });
};

const createElement = data => {
  const {
    elementName,
    elementSymbol,
    elementAtomicNumber,
    elementDescription
  } = data;

  const addedHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements - ${elementName}</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>

  <body>
    <h1>${elementName}</h1>
    <h2>${elementSymbol}</h2>
    <h3>Atomic number ${elementAtomicNumber}</h3>
    <p>
      ${elementDescription}
    </p>
    <p><a href="/">back</a></p>
  </body>
</html>`;
  return addedHTML;
};

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
