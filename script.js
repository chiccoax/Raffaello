const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const DID_API_KEY = 'YOUR_DID_API_KEY';
const IMAGE_URL = 'YOUR_IMAGE_URL';

const startBtn = document.getElementById('start');
const statusText = document.getElementById('status');
const avatar = document.getElementById('avatar');

startBtn.addEventListener('click', () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'it-IT';
  recognition.start();
  statusText.textContent = 'Sto ascoltando...';

  recognition.onresult = async (event) => {
    const question = event.results[0][0].transcript;
    statusText.textContent = 'Domanda: ' + question;

    const reply = await askChatGPT(question);
    statusText.textContent = 'Risposta: ' + reply;

    const videoUrl = await createAvatarVideo(reply);
    avatar.src = videoUrl;
  };
});

async function askChatGPT(text) {
  const res = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: text })
  });
  const data = await res.json();
  return data.reply;
}

async function createAvatarVideo(text) {
  const res = await fetch('/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  return data.url;
}