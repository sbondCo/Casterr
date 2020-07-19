using System.Collections.Generic;
using System.IO;

namespace Casterr.HelpersLib
{
    public class RecordingPath
    {
        public string VideoPath { get; set; }
        public string ThumbPath { get; set; }
    }

    public static class RecordingPaths
    {
        public static List<RecordingPath> Get(string videoPath, string thumbPath)
        {
            List<RecordingPath> ri = new List<RecordingPath>();
            
            foreach (string f in Directory.GetFiles(videoPath, "*.mp4", SearchOption.AllDirectories))
            {
                // Path that should be to the thumbnail, unless it has been moved/name changed
                string tPath = $"{thumbPath}\\{Path.GetFileName(f)}.png";

                // If thumbnail does not exist, make it an empty string for List
                if (!File.Exists(tPath))
                {
                    tPath = "";
                }

                // Add paths to list
                ri.Add(new RecordingPath { VideoPath = f, ThumbPath = tPath});
            }

            return ri;
        }
    }
}
