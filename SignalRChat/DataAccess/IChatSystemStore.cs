using System;
using System.Collections.Generic;

namespace SignalRChat.DataAccess
{
    public interface IChatSystemStore
    {
        bool ValidateUser(StoreLoginCredentials loginCredentials);
        List<Channel> GetChannels();
    }
}
