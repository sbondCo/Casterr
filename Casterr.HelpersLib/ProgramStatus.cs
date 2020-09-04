using System;

namespace Casterr.HelpersLib
{
  public delegate void TaskRunning(bool done, string description);

  public static class ProgramStatus
  {
    public static event TaskRunning TaskRunning;

    public static void DoingSomething(bool done, string description = "")
    {
      TaskRunning?.Invoke(done, description);
    }
  }
}
