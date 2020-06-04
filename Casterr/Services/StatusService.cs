using System;

namespace Casterr.Services
{
    public delegate void ShouldChangeStateHandler();

    public class StatusService
    {
        public event ShouldChangeStateHandler ShouldChangeState;
        public string ElapsedClass = "hidden";
        public string CircleClass = "danger";

        public void ChangeStatus(int status)
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
