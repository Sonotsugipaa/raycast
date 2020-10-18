# Sonotsugipaa / Raycast

**Raycast** is a very simple Javascript-based 2D application
that showcases... well, the ancient technique of ray-casting. <br/>
It's basically a web application that runs on Node.js.

## Requirements

- Node.js
  - npm

## Prepare and run

Before being able to run the web app, the Node package needs to
(locally) install its dependencies. <br/>
In order to do that, run "`npm install`" in your shell.

To start the server, run "`node index.js <PORT>`" or "`node . <PORT>`"
where `<PORT>` is the port you want the server to listen to. <br/>
The default port is 80, and common ports usually need the program to
be run as root / administrator.

To use the application, use your web browser to visit the server. <br/>
For example, if the server has been started using the command "`node . 3000`",
the application's URL is `http://localhost:3000/raycast/index.html`, but
visiting `http://localhost:3000/` is supposed to redirect you to the
correct page. <br/>
If you want to specify a resolution, use the "`res`" query field, for
example using the URL
"`http://localhost:3000/raycast/index.html?res=1600x900`".
