namespace Casterr.MediaLib
{
  public class Recording
  {
    public string VideoPath { get; set; }
    public long FileSize { get; set; } = 0;
    
    #nullable enable
    public string? ThumbPath { get; set; }
    #nullable disable
  }
}
