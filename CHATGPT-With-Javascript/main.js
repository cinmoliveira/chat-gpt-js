const apiKey = "Enter your API key here.";
//Constant created with the api key.

function sendMessage(){
    var message = document.getElementById('message-input'); //Accessing the input
    if(!message.value) //If there is no message, then:
    {
        message.style.border = '1px solid red'; //Border turns red
        return;
    }
    message.style.border = 'none';

    var status = document.getElementById('status'); //Access to input status
    var buttonSubmit = document.getElementById('buttonSubmit'); //Access to the send button

    status.style.display = 'block';
    status.innerHTML = 'Carregando...'; //Shows the message 'Loading' when the send button is clicked
    buttonSubmit.disable = true; //Disable the send button after it is used
    buttonSubmit.style.cursor = 'not-allowed'; //Pointer changes when hovering over send
    message.disabled = true; //Disables what was written

    //Starting ChatGPT integration:
    fetch("https://api.openai.com/v1/chat/completions",{
        method:'POST',
        headers:{
            Accept: "application/json",
            "Content-Type":"application/json",
            Authorization: 'Bearer '+apiKey //You can also use craze: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini", //Here you use the version of the chat
            
            max_tokens: 2048,
            temperature: 0.5,
            messages: [ //Instead of prompt, i used 'message.value' it was necessary to update to messages
                {
                    role: 'user',
                    content: message.value,
                }
            ],
        })
    }) //Completions: Complete as you ask
    .then((response) => response.json())
    .then((response) => {
        let r = response.choices[0]['message'] //Then complete the response like this: response.choices[0]['text']
        status.style.display = 'none'
        showHistoric(message.value,r)
    })
    .catch((e) => {
        console.log('Error ->',e) //Show if there is an error
    })
    .finally(() =>{
        buttonSubmit.disable = false
        buttonSubmit.style.cursor = 'pointer'
        message.disabled = false
    });
}

function showHistoric(message, response){
    var historic = document.getElementById('historic');

    //Part 1: My messages:
    var boxMyMessage = document.createElement('div');
    boxMyMessage.className = 'box-my-message';

    var myMessage = document.createElement('p');
    myMessage.className = 'my-message';
    myMessage.innerHTML = message;

    boxMyMessage.appendChild(myMessage);
    historic.appendChild(boxMyMessage);

    //Part 2: Answers offered by chat.
    var boxResponseMessage = document.createElement('div');
    boxResponseMessage.className = 'box-response-message';

    var chatResponse = document.createElement('p');
    chatResponse.className = 'chat-message';
    chatResponse.innerHTML = response.content; //The 'content' string is inside the 'response' object

    boxResponseMessage.appendChild(chatResponse);
    historic.appendChild(boxResponseMessage);

    //Taking the scroll to the end of the conversation:
    historic.scrollTop = historic.scrollHeight;

    document.getElementById('message-input').value = ''; //Here clears the box after the message sent
}

//Binds the keydown event (key pressed) to the message input element
document.getElementById('message-input').addEventListener("keydown", function(evt) {
    if (evt.code === "Enter") {  //Checks if the key captured in the event was <enter>
        sendMessage(); //Calls the function to send the message
    }
});