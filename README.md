# Turn_Test_Page

A simple WebRTC page that start an echo test with the selected TURN server.

## Motivation

Test the configuration and the stability of a Turn server and your network to this server.

## Usage

Set you default TURN configuration in config/config.js and put the src file in a webserver.

```
> cp config/config_ref.js config/config.js
> vi config/config.js
```

You can run the provided Nginx server docker if you don't have a webserver somewhere. 

```
docker build -t turn-test-page .
docker run -it --rm -d -p 8080:80 --name webTurn turn-test-page
```

Open http://127.0.0.1:8080/ and clic "RUN test".