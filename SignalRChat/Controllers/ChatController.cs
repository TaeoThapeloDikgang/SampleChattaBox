﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SignalRChat.Controllers
{
    public class ChatController : Controller
    {
        public IActionResult Index(string username)
        {
            ViewBag.Username = username;
            return View();
        }
    }
}