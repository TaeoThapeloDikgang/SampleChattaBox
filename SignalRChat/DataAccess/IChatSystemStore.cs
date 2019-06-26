using System;

namespace SignalRChat.DataAccess
{
    public interface IChatSystemStore
    {
        bool ValidateUser(StoreLoginCredentials loginCredentials);
    }
}
