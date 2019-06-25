using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SignalRChat.Controllers
{
    public class LoginCredentials
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginCredentials credentials)
        {
            if (false)
            {
                RedirectToAction("Index", "Chat");
            }
            else
            {
                ViewBag.ErrorMessage = "Login failed.";
                return View();
            }
        }
    }
}