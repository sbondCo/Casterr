using System;

namespace Casterr.HelpersLib
{
  public delegate void ShouldChangeStateHandler();

  public static class StatusService
  {
    public static event ShouldChangeStateHandler ShouldChangeState;
    public static string ElapsedClass = "hidden";
    public static string CircleClass = "danger";

    public enum Status
    {
      Idle,
      Recording,
      Error
    }

    public static void ChangeStatus(Status status)
    {
      // Status States:
      // 0 = Idle
      // 1 = Recording
      // 2 = There has been an error

      switch (status)
      {
        case Status.Idle:
          ElapsedClass = "hidden";
          CircleClass = "idle";
          break;
        case Status.Recording:
          ElapsedClass = "";
          CircleClass = "safety";
          break;
        case Status.Error:
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
