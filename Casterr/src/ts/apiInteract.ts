
export default class APIInteract {
  public readonly WebSocket = require("ws");
  private static _instance: APIInteract;

  private ws: any;
  private connTries: number = 0;

  public static get Instance()
  {
    return this._instance || (this._instance = new this());
  }

  public connect(): void {
    this.ws = new WebSocket("ws://127.0.0.1:8099/");

    // If can't connect to websocket server, try 5 more times before giving up
    this.ws.addEventListener("error", () => {
      let tryConnectingAgain;

      console.log(`Couldn't connect to websocket server, tries remaining: ${5 - this.connTries}`);

      if (this.connTries >= 5) {
        console.error(`Can't connect to websocket server. Tries: ${this.connTries}`);
        clearTimeout(tryConnectingAgain);
      }
      else {
        tryConnectingAgain = setTimeout(() => { this.connect() }, 3000);
      }

      this.connTries++;
    });

    this.ws.addEventListener("open", () => {
      console.log("ws conn open");
    
      // ws.send(JSON.stringify({
      //   operation: 1
      // }));
    });
    
    this.ws.addEventListener("message", (e: any) => {
      console.log("msg recieved");
    
      var msg = JSON.parse(e.data);
    
      switch (msg.operation) {
        case 2:
          console.log(msg.video.thumb);
          break;
      }
    });

    console.log(this.ws);
  }

  public send(msg: object): void {
    console.log(this.ws);
    this.ws.send(JSON.stringify(msg));
  }
}
