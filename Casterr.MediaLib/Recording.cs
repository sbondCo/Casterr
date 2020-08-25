namespace Casterr.MediaLib
{
  public class Recording
  {
    public string VideoPath { get; set; }
    public string ThumbPath { get; set; }
    public long FileSize { get; set; } = 0;
    public string FPS { get; set; } = null;
    public string Duration { get; set; } = null;
  }
}
