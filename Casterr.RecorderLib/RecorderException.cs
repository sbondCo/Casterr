using System;

namespace Casterr.RecorderLib
{
  class RecorderException : Exception
  {
    public RecorderException() { }
    
    public RecorderException(string msg) : base(msg) { }
  }
}
