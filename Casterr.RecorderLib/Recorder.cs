using Casterr.RecorderLib.FFmpeg;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Casterr.RecorderLib
{
    public class Recorder
    {
        public async Task Start()
        {
            FindFFmpeg ff = new FindFFmpeg();
            await ff.GetPath();
        }
    }
}
