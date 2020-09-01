using System;
using System.Diagnostics;

namespace Casterr.RecorderLib
{
  public delegate void ShouldChangeStateHandler();

  public static class RecordingStatus
  {
    public static event ShouldChangeStateHandler ShouldChangeState;
    public static Stopwatch RecordingWatch = new Stopwatch();
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
      // Reset stopwatch before doing anything else
      RecordingWatch.Reset();

      switch (status)
      {
        case Status.Idle:
          ElapsedClass = "hidden";
          CircleClass = "idle";
          break;
        case Status.Recording:
          ElapsedClass = "";
          CircleClass = "safety";

          // Start stopwatch if status is Recording
          RecordingWatch.Start();
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
