using System;

namespace SignalRChat.DataAccess
{
    public interface IChatSystemStore
    {
        bool ValidateUser(StoreLoginCredentials loginCredentials);
    }

    class ChatSystemStore : IChatSystemStore
    {
        public bool ValidateUser(StoreLoginCredentials loginCredentials)
        {
            throw new NotImplementedException();
        }
    }

    public class StoreLoginCredentials
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
