using LiteDB;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace SignalRChat.DataAccess
{
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
            InitializeUsers();
            InitializeChannels();
        }

        private void InitializeChannels()
        {
            var channel = _database.GetCollection<Channel>("channels");
            var channel1 = new Channel
            {
                Name = "Sports"
            };
            channel.Insert(channel1);

            var channel2 = new Channel
            {
                Name = "Anime"
            };
            channel.Insert(channel2);

            var channel3 = new Channel
            {
                Name = "Politics"
            };
            channel.Insert(channel3);

            var channel4 = new Channel
            {
                Name = "Music"
            };
            channel.Insert(channel4);

            var channel5 = new Channel
            {
                Name = "Fitness"
            };
            channel.Insert(channel5);
        }

        private void InitializeUsers()
        {
            var users = _database.GetCollection<User>("users");
            var user1 = new User
            {
                Name = "Shareen",
                Password = GetHash("1234"),

            };
            users.Insert(user1);

            var user2 = new User
            {
                Name = "Thapelo",
                Password = GetHash("1235"),
            };
            users.Insert(user2);

            var user3 = new User
            {
                Name = "Nkosi",
                Password = GetHash("1236"),
            };
            users.Insert(user3);

            var user4 = new User
            {
                Name = "Khals",
                Password = GetHash("1237"),
            };
            users.Insert(user4);

            var user5 = new User
            {
                Name = "Sydney",
                Password = GetHash("1238"),
            };
            users.Insert(user5);
        }

        public bool ValidateUser(StoreLoginCredentials loginCredentials)
        {
            LiteCollection<User> users = _database.GetCollection<User>("users");
            LiteCollection<User> channel = _database.GetCollection<User>("channels");
            string passwordHash = GetHash(loginCredentials.Password);

            IEnumerable<User> results = users.Find(x => x.Name == loginCredentials.Username && x.Password == passwordHash);
            return results.Any();
        }

        private LiteDatabase _database;
        private User user;
           
        public static string GetHash(string text)
        {
            string salt = "Chatta";
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(text + salt));
                // Get the hashed string.  
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                    
            }
        }
    }

}
