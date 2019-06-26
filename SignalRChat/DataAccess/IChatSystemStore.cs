using LiteDB;
using System;
using System.IO;

namespace SignalRChat.DataAccess
{
    public interface IChatSystemStore
    {
        bool ValidateUser(StoreLoginCredentials loginCredentials);
    }

    class ChatSystemStore : IChatSystemStore
    {
        public ChatSystemStore()
        {
            const string fileName = "ChatSystem.db";
            bool dbExist = File.Exists(fileName);
            _database = new LiteDatabase(fileName);
            if (!dbExist)
            {
                InitializeDatabase();
            }
        }

        private void InitializeDatabase()
        {
            var users = _database.GetCollection<User>("users");
            // var channel = _database.GetCollection<Channel>("channels");

            var user1 = new User
            {
                Name = "JohnDoe",
                Password = "1234"
            };
            users.Insert(user1);
        }

        public bool ValidateUser(StoreLoginCredentials loginCredentials)
        {
            throw new NotImplementedException();
         
        }
        private LiteDatabase _database;
    }

    public class StoreLoginCredentials
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
