namespace Casterr.Services.KeyBinds
{
  public class KeyBinds
  {
    public void RegisterAll()
    {
      // Bind Classes
      RecordingBinds rb = new RecordingBinds();

      // Register all hotkeys in all classes
      rb.RegisterAll();
    }
  }
}
