using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SignalRChat.DataAccess;

namespace SignalRChat.Controllers
{
    public class HomeController : Controller
    {
        private readonly IChatSystemStore _store;

        public HomeController(IChatSystemStore store)
        {
            _store = store;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginCredentials credentials)
        {
            if (_store.ValidateUser(new StoreLoginCredentials { Username = credentials.Username, Password = credentials.Password }))
            {
                return RedirectToAction("Index", "Chat");
            }
            else
            {
                ViewBag.ErrorMessage = "Login failed.";
                return View();
            }
        }
    }
}