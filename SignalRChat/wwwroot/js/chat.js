import { connect } from "tls";

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
var user = document.getElementById("userInput").value;
var message = document.getElementById("messageInput").value;

connection.on("ReceivedMessage", (user, message) => {
    const encodedMsg = user + " says " + message;
    const li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});


document.getElementById("sendButton").addEventListener("click", event => {
    connection.invoke("SendMessageToChannel", user, message).catch(err => console.error(err.toString()));
    event.preventDefault();
});

document.getElementById("joinChannel").addEventListener("click", event => {
    connection.invoke("JoinChannel", groupValue).catch(err => console.error(err.toString()));
    event.preventDefault();
});

document.getElementById("leftChannel").addEventListener("click", event => {
    connection.invoke("LeftChannel", groupValue).catch(err => console.error(err.toString()));
    event.preventDefault();
});

document.getElementById("getChannel").addEventListener("click", event => {
    connection.invoke("GetChannel", groupValue).catch(err => console.error(err.toString()));
    event.preventDefault();
});

connection.start().catch(err => console.error(err.toString()));