using System;
using System.Collections.Generic;
using System.Text;

namespace Casterr.RecorderLib
{
  class RecorderException : Exception
  {
    public RecorderException()
    {

    }

    public RecorderException(string msg) : base(msg)
    {

    }
  }
}
