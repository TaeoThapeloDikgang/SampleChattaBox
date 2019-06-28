//import { create } from "domain";

//import { connect } from "tls";

    // The following sample code uses modern ECMAScript 6 features 
// that aren't supported in Internet Explorer 11.
// To convert the sample for environments that do not support ECMAScript 6, 
// such as Internet Explorer 11, use a transpiler such as 
// Babel at http://babeljs.io/. 
//
// See Es5-chat.js for a Babel transpiled version of the following code:

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

/*connection.on("UserConnection", function (connectionId) {
    var groupElement = document.getElementById("group");
    var option = document.createElement("option");
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);

});

connection.on("UserDisconnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    for (var i = 0; i < groupElement.length; i++) {
        if (groupElement.option[i].value == connectionId) {
            groupElement.remove(i);
        }
    }
});*/

connection.on("receivedMessage", function (username, message) {
    console.log("Received message! " + message);
    const lengthm = message.length;
    const encodedMsg = username + ": " + message;
    const nameDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    const wDiv = document.createElement("div");

    wDiv.appendChild(nameDiv);
    wDiv.appendChild(messageDiv);

    nameDiv.textContent = username.toString();
    messageDiv.innerHTML = message.toString();

    nameDiv.setAttribute("class", "message-user");
    messageDiv.setAttribute("class", "message-text");

    wDiv.setAttribute("class", "message")


    document.getElementById("messages").appendChild(wDiv);

    //messageDiv.setAttribute("style", "color:red");
    //messageDiv.textContent = encodedMsg;
    /*document.getElementById("messages").appendChild(messageDiv);*/
});


function addUserToUserList(username) {

    var channelUserElement = document.getElementById("channel-users");

    const userChannelDiv = document.createElement("div");
    userChannelDiv.attributes["class"] = "channel-user";
    const channelUsernameDiv = document.createElement("div");
    channelUsernameDiv.attributes["class"] = "channel-username";
    channelUsernameDiv.innerText = username;

    channelUserElement.appendChild(userChannelDiv.appendChild(channelUsernameDiv));
}

function fetchChannelUsers(channelName) {
    connection.invoke("JoinChannel", channelName, myUsername)
        .then(function () {
            $("#messages").empty();
            $("#channel-users").empty();

            var channelUserElement = document.getElementById("channel-users");
            var joinChannelElementHeader = document.getElementById("chat-channel-name");
            joinChannelElementHeader.innerText = channelName;
            //channelUserElement.setAttribute("style", "background-color: lightgray; border - radius: 4px; padding: 8px; margin - bottom: 4px;");
            connection.invoke("GetUsersInAChannel", channelName)
                .then(function (users) {

                    for (var i = 0; i < users.length; i++) {
                        var username = users[i].username;
                        addUserToUserList(username);
                    }
                });
        }).catch(err => console.error(err.toString()));
}

connection.on("joinedChannel", function (username) {
    addUserToUserList(username);
});

connection.on("leftChannel", function (username, channelName) {
    fetchChannelUsers(channelName);
});

//document.getElementById("sendMessageButton").addEventListener("click", event => {
//    connection.invoke("SendMessageToChannel", user, message).catch(err => console.error(err.toString()));
//    event.preventDefault();
//});

//document.getElementById("joinChannel").addEventListener("click", event => {
//    connection.invoke("JoinChannel", groupValue).catch(err => console.error(err.toString()));
//    event.preventDefault();
//});

//document.getElementById("leftChannel").addEventListener("click", event => {
//    connection.invoke("LeftChannel", groupValue).catch(err => console.error(err.toString()));
//    event.preventDefault();
//});

//document.getElementById("getChannel").addEventListener("click", event => {
//    connection.invoke("GetChannel", groupValue).catch(err => console.error(err.toString()));
//    event.preventDefault();
//});

connection.start()
    .then(function () {
        console.log('connection started');

        var messageInput = document.getElementById("messageText");
        messageInput.focus();

        document.getElementById('sendMessageButton').addEventListener('click', function (event) {
            var message = messageInput.value;
            // Call the Send method on the hub.
            connection.invoke("SendMessageToChannel", message).catch(err => console.error(err.toString()));
            // Clear text box and reset focus for next comment.
            messageInput.value = '';
            messageInput.focus();
            event.preventDefault();
        });

        //connection.invoke("SendMessageToChannel", user, message).catch(err => console.error(err.toString()));

        connection.invoke("GetChannels")
            .then(function (channels) {
                var channelsElement = document.getElementById("channels");

                for (var i = 0; i < channels.length; i++) {
                    const channelDiv = document.createElement("div");
                    channelDiv.setAttribute("class", "channel");

                    const channelNameDiv = document.createElement("div");
                    const channelNameLink = document.createElement("a");
                    channelNameLink.setAttribute("href", "#");
                    channelNameLink.setAttribute("class", "channel-name");
                    let channelName = channels[i].name;

                    channelDiv.setAttribute("class", "channel"); //"background-color: lightpink; width: 100%; border-radius:1px; padding: 8px; margin-bottom: 4px");

                    let channelDescription = channels[i].description;
                    //hannelDescription.setAttribute("style", "background-color:black");
              
                    channelNameLink.innerText = channelName;
                    channelNameLink.addEventListener('click', function (event) {
                        connection.invoke("JoinChannel", channelName, myUsername)
                            .then(function () {
                                //$(document).ready(function () {
                                $("#messages").empty();
                                $("#channel-users").empty();
                                // }
                            
                                var channelUserElement = document.getElementById("channel-users");
                                //channelUserElement.setAttribute("style", "background-color:purple; width=10px");
                                var joinChannelElementHeader = document.getElementById("chat-channel-name");
                                joinChannelElementHeader.innerText = channelName;
                                //joinChannelElementHeader.setAttribute("style", "background-color:purple; width=10px");

                                connection.invoke("GetUsersInAChannel", channelName)
                                    .then(function (users) {
                                        for (var i = 0; i < users.length; i++) {
                                            const userChannelDiv = document.createElement("div");
       
                                            userChannelDiv.attributes["class"] = "channel-user";
                                            const channelUsernameDiv = document.createElement("div");
                                            channelUsernameDiv.setAttribute("style", "background-color: lightgray; width: 100%; border-radius:1px; padding: 8px; margin-bottom: 4px");
                                            channelUsernameDiv.attributes["class"] = "channel-username";
                                            channelUsernameDiv.innerText = users[i].username;

                                            channelUserElement.appendChild(userChannelDiv.appendChild(channelUsernameDiv));
                                        }
                                    });
                            })//.catch(err => console.error(err.toString()));
                    });
                    
                    channelNameDiv.appendChild(channelNameLink);
                    channelDiv.appendChild(channelNameDiv);

                    const channelDescriptionDiv = document.createElement("div");
                    channelDescriptionDiv.attributes["class"] = "channel-description";
                    channelDescriptionDiv.innerText = channelDescription;
                    channelDiv.appendChild(channelDescriptionDiv);

                    channelsElement.appendChild(channelDiv);
                }
            })
            .catch(err => console.error(err.toString()));
    })
    .catch(err => console.error(err.toString()));


function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
