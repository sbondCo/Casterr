using System;

namespace Casterr.HelpersLib
{
  public delegate void TaskRunning(bool doing, string description);

  public static class ProgramStatus
  {
    public static event TaskRunning TaskRunning;

    public static void DoingSomething(bool doing, string description = "")
    {
      TaskRunning?.Invoke(doing, description);
    }
  }
}
