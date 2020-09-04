using System;

namespace Casterr.HelpersLib
{
  public delegate void TaskRunning(bool doing, string description, int percentComplete);

  public static class ProgramStatus
  {
    public static event TaskRunning TaskRunning;

    public static void DoingSomething(bool doing, string description = "", int percentComplete = 0)
    {
      TaskRunning?.Invoke(doing, description, percentComplete);
    }
  }
}
