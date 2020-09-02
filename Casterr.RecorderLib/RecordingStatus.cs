using System;
using System.Diagnostics;

namespace Casterr.RecorderLib
{
  public delegate void ShouldChangeStateHandler();

  public static class RecordingStatus
  {
    public static bool IsRecording { get; set; } = false;
    public static event ShouldChangeStateHandler ShouldChangeState;
    public static Stopwatch RecordingWatch = new Stopwatch();
    public static string ElapsedClass = "hidden";
    public static string CircleClass = "idle";

    public enum Status
    {
      Idle,
      Recording,
      Error
    }

    public static void ChangeStatus(Status status)
    {
      // Default to is not recording so it only needs
      // to be changed in Status.Recording case
      IsRecording = false;

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
          IsRecording = true;

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
