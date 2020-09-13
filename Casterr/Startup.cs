using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ElectronNET.API;
using ElectronNET.API.Entities;
using Casterr.RecorderLib;
using Casterr.SettingsLib;
using Casterr.Services.KeyBinds;
using Casterr.RecorderLib.FFmpeg;

namespace Casterr
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddRazorPages();
      services.AddServerSideBlazor();

      services.AddTransient<DeviceManager>();
      services.AddTransient<SettingsManager>();

      services.AddSingleton<Recorder>();
      services.AddSingleton<GeneralSettings>();
      services.AddSingleton<RecordingSettings>();
      services.AddSingleton<KeyBindingSettings>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseStaticFiles();

      app.UseRouting();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapBlazorHub();
        endpoints.MapFallbackToPage("/_Host");
      });

      // Window options
      var options = new BrowserWindowOptions
      {
        // Relative path to icon from Casterr exe is wwwroot/logo.png ...
        // ... But need to get full path so browserWindows.js can see it
        Icon = Path.GetFullPath(Path.Join("wwwroot", "logo.png")),

        // Applications title, currently overwritten by <title> in _Host.cshtml
        Title = "Casterr",
        
        Width = 1200,
        Height = 650,
        MinWidth = 800,
        MinHeight = 500,
        Frame = false,
        Show = false
      };

      // Open Electron window
      Task.Run(async () =>
      {
        var mainWindow = await Electron.WindowManager.CreateWindowAsync(options);
        mainWindow.OnReadyToShow += () => mainWindow.Show();
      });

      // Setup all keybinds
      KeyBinds kb = new KeyBinds();
      kb.RegisterAll();

      // Run some tasks before fully closing program
      Electron.App.WillQuit += (args) => Task.Run(() =>
      {
        // Unregister all keybinds created
        Electron.GlobalShortcut.UnregisterAll();
      });
    }
  }
}
