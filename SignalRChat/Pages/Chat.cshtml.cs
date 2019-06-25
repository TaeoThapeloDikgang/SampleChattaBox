using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SignalRChat.Pages
{
    public class ChatModel : PageModel
    {
        public string Message { get; set; } = "Initial Request";
        public void OnGet()
        {
        }
        public void OnPost()
        {
            Message = "Form Posted";
        }
        public void OnPostDelete()
        {
            Message = "Delete handler fired";
        }
        public void OnPostEdit(int id)
        {
            Message = "Edit handler fired";
        }
        public void OnPostView(int id)
        {
            Message = "View handler fired";
        }
    }
}