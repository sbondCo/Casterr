using System;

namespace Casterr.HelpersLib
{
  public delegate void ShouldChangeStateHandler();

  public static class StatusService
  {
    public static event ShouldChangeStateHandler ShouldChangeState;
    public static string ElapsedClass = "hidden";
    public static string CircleClass = "danger";

    public static void ChangeStatus(int status)
    {
      // Status States:
      // 0 = Idle
      // 1 = Recording
      // 2 = There has been an error

      switch (status)
      {
        case 0:
          ElapsedClass = "hidden";
          CircleClass = "idle";
          break;
        case 1:
          ElapsedClass = "";
          CircleClass = "safety";
          break;
        case 2:
          ElapsedClass = "hidden";
          CircleClass = "danger";
          break;
        default:
          ElapsedClass = "hidden";
          CircleClass = "idle";
          break;
      }

      Console.WriteLine($"{status} Elapsed: {ElapsedClass}, Circle: {CircleClass}");

      // Fire event
      ShouldChangeState?.Invoke();
    }
  }
}
