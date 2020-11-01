using System;

namespace Casterr.API
{
  class Program
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Starting API Server");

      WebSocketServer.Start();
    }
  }
}
