window.onload = function () {
    var connection = new WebSocket('ws://10.103.51.80:8000');

    var userName = document.querySelector("#userName");
    var text = document.querySelector("#text");
    var posts = document.querySelector("#posts");

    document.querySelector("#send").addEventListener('click', sendMessage);

    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
            var docFrag = document.createDocumentFragment();
            var messageElement = document.createElement("p");
            messageElement.appendChild(document.createTextNode(json.data));
            messageElement.style.color = json.color;
            docFrag.appendChild(messageElement);
            posts.appendChild(docFrag);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
        }
    };

    function sendMessage() {
        connection.send(userName.value + " : " + text.value);
    }
};