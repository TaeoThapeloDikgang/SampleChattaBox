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
    const encodedMsg = username + ": " + message;
    const messageDiv = document.createElement("div");
    messageDiv.textContent = encodedMsg;
    document.getElementById("messages").appendChild(messageDiv);
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
                //channelsElement.setAttribute("style", "background-color: lightgray;");
                for (var i = 0; i < channels.length; i++) {
                    const channelDiv = document.createElement("div");
                    channelDiv.attributes["class"] = "channel";
                    //channelDiv.setAttribute("style", "background-color: lightgray; border - radius: 4px; padding: 8px; margin - bottom: 4px;");
                    const channelNameDiv = document.createElement("div");
                    channelNameDiv.attributes["class"] = "channel-name";
                    const channelNameLink = document.createElement("a");
                    channelNameLink.attributes["href"] = "#";
                    let channelName = channels[i].name;
                    let channelDescription = channels[i].description;
              
                    channelNameLink.innerText = channelName;
                    channelNameLink.addEventListener('click', function (event) {
                        fetchChannelUsers(channelName);
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
