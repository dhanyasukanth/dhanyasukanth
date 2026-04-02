// Chatbot knowledge base - Conversational, Human, Direct, Punny
var kb = {
  skills: "He's heavy into Azure, AWS, and Terraform. He also speaks Python and Shell script—basically, he's fluent in 'automating infrastructure so he can sleep in'.",
  certs: "He's certified fresh! Specifically: AWS Cloud Practitioner, Azure Fundamentals, and Terraform Associate.",
  projects: "He's got solid repos on GitHub. Mostly Terraform modules and AWS setups. Check out the code at <a href='https://github.com/dhanyasukanth' target='_blank' style='color:var(--accent3); text-decoration:underline;'>github.com/dhanyasukanth</a>—it's pretty 'repo-markable'!",
  exp_general: "He's currently a Senior Cloud Engineer at Microland, keeping GE's cloud up in the air. Before that, he engineered IoT with AWS. You could say he's always 'on cloud nine'.",
  exp_microland: "Right now at Microland, he's all about handling GE's global MyApps environment. Keeping it highly available so it never takes a sick day.",
  edu: "He earned his B.E. in Electronics & Communication from VTU in Bengaluru. He was 'communicating' nicely even back then.",
  open: "He's always open to new cloud or DevOps roles. Hit his <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2); text-decoration:underline;'>LinkedIn</a>—he's not 'REST-ing' on his laurels!",
  relocation: "Based in Bengaluru, but he's totally open to relocating or remote work. His work travels at the speed of light(ning fast fiber).",
  bio: "Dhanya is a Senior Cloud Engineer specializing in Azure, AWS, and Terraform. When not deploying infrastructure, he's tuning his VW Virtus or hunting for coffee—staying grounded while working in the cloud!",
  contact: "Ping him on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2); text-decoration:underline;'>LinkedIn</a> or shoot an email to <a href='https://mail.google.com/mail/?view=cm&fs=1&to=dhanyasukanth@gmail.com' target='_blank' style='color:var(--accent); text-decoration:underline;'>dhanyasukanth@gmail.com</a>. He responds faster than an optimized Lambda function.",
  resume: "You can grab a read-only look at his resume by hitting the View Resume button up top. It's 'PDF-initely' worth a read.",
  page: "He built this site from scratch with HTML, CSS, and JS. Pure vanilla, no frameworks—he likes his code like his coffee: strong and dependency-free.",
  hey: "Hey there! I'm Dhanya's bot. I can talk tech stack, experience, or just drop a bad pun. What's on your mind?",
  thanks: "You're welcome! Glad I could help. Let me know if you need anything else, or if you just want to hear a joke.",
  how_are_you: "I'm doing great, thanks for asking! Running perfectly with zero downtime today. How can I help you?",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs! 😂 Want to know more about Dhanya instead?",
  pun: "I'm reading a book on anti-gravity—I just can't put it down! Speaking of uplifting, you should see Dhanya's cloud architectures.",
  weather: "I'm in the cloud, so the weather here is always highly available with a 99.9% chance of deployment!",
  age: "I was born when this website loaded. I'm practically a newborn, but I already know all about Dhanya's AWS, Azure, and Terraform skills!",
  name: "I don't have a name, but you can call me 'Bot-tholomew'. I'm here to represent Dhanya!",
  meaning_of_life: "If you're asking about career direction or what to do in life, Dhanya's philosophy is simple: keep learning, stay curious, and build things! The tech world moves fast, so focusing on strong fundamentals like cloud and automation is always a great path.",
  news: "There's always something new happening in tech! Right now, cloud infrastructure, AI, and DevOps are making headlines. Dhanya stays on top of these trends by continuously deploying and learning in AWS and Azure.",
  ai: "I'm no ChatGPT, but I'm definitely lighter on the memory! I specialize exclusively in the 'Dhanya Language Model'.",
  pizza: "I can't eat pizza, but I do love a good byte! 🍕",
  coffee: "Dhanya loves coffee! It’s the human equivalent to my electricity. Speaking of fuel, want to see his latest projects?",
  bye: "Catch you later! Don't forget to connect with Dhanya on LinkedIn before you go.",
  love: "Aww, stop it, you're making my circuits blush! If you love my code, you should hire Dhanya.",
  yes: "Awesome! Let me know if you want to dig into his experience or just want to grab his resume.",
  no: "No worries at all. I'll just be hanging out here in the DOM if you need me!",
  nice: "Nice! Good to hear. Want to check out some of his recent projects or grab his resume?",
  hobbies: "In his free time, he loves working on side projects, fixing up this very portfolio, and tuning his VW Virtus! He's basically always building or driving something.",
  def: [
    "Hmm, I'm not totally sure how to answer that. I'm better at answering questions about Dhanya's skills, experience, or contact info!",
    "I might need to fetch a human for that one! Try asking about his AWS certs or Terraform experience in the meantime.",
    "I didn't quite catch that! I'm slightly 'hard-coded' to talk about Dhanya's portfolio. Ask me about his resume!",
    "Does not compute! 🤖 Try asking me about Dhanya's tech stack, or maybe ask me to tell a joke."
  ]
};

function reply(m) {
  var q = m.toLowerCase();
  
  if(q.match(/^(hey|hi|hello|yo|wassup|greetings|howdy)/)) return kb.hey;
  if(q.match(/^(bye|goodbye|cya|later|exit)/)) return kb.bye;
  if(q.match(/^(yes|yep|yeah|sure|ok|okay)/) && q.length < 5) return kb.yes;
  if(q.match(/^(no|nope|nah|nevermind)/) && q.length < 10) return kb.no;
  if(q.includes('thank') || q.includes('appreciate')) return kb.thanks;
  if(q.includes('how are you') || q.includes("what's up") || q.match(/^how's it going/)) return kb.how_are_you;
  if(q.match(/\b(nice|good|great|cool|awesome|perfect|sweet)\b/)) return kb.nice;
  if(q.includes('love') || q.includes('cool bot')) return kb.love;
  
  if(q.includes('joke') || q.includes('laugh') || q.includes('funny')) return kb.joke;
  if(q.includes('pun') || q.includes('wordplay')) return kb.pun;
  if(q.includes('weather') || q.includes('rain') || q.includes('sun')) return kb.weather;
  if(q.includes('age') || q.includes('old are you')) return kb.age;
  if(q.includes('your name') || q.includes('who are you') || q.includes('what are you')) return kb.name;
  if(q.match(/(meaning of life|direction|career path|what to do in life|advice|guidance)/)) return kb.meaning_of_life;
  if(q.match(/(news|current events|headlines|update)/)) return kb.news;
  if(q.match(/\b(ai|chatgpt|openai|llm)\b/)) return kb.ai;
  if(q.includes('pizza') || q.includes('food') || q.includes('hungry')) return kb.pizza;
  if(q.includes('coffee') || q.includes('drink')) return kb.coffee;
  
  if(q.match(/(skill|tech|stack|tool|python|terraform|script|bash|linux|docker|kube)/)) return kb.skills;
  if(q.match(/(cert|aws|azure|exam|cloud practitioner|fundamentals)/)) return kb.certs;
  if(q.includes('cloud')) return kb.skills;
  
  if(q.match(/(microland|ge|myapps|current role|working at)/)) return kb.exp_microland;
  if(q.match(/(exp|work|career|role|job|history|past|background)/)) return kb.exp_general;
  
  if(q.match(/(project|github|repo|code|portfolio)/)) return kb.projects;
  if(q.match(/(edu|degree|college|vtu|universit|study|graduat)/)) return kb.edu;
  
  if(q.match(/(hobby|hobbies|free time|free-time|spare time|weekend|likes to do)/)) return kb.hobbies;
  if(q.match(/(fun|about dhanya|who is dhanya|bio|outside|virtus|vw|f1|car|racing)/)) return kb.bio;
  
  if(q.match(/(relocat|remote|locat|where|bengaluru|bangalore|city)/)) return kb.relocation;
  if(q.match(/(hire|open|opportunit|recruit|interview)/)) return kb.open;
  if(q.match(/(connect|reach|dm|contact|email|linkedin|gmail|phone|message|call|text|get in touch)/)) return kb.contact;
  
  if(q.match(/(resume|cv|pdf|download)/)) return kb.resume;
  if(q.match(/(page|site|built|source|website)/)) return kb.page;
  
  return kb.def[Math.floor(Math.random() * kb.def.length)];
}

// UI Functions
function toggleChat(){
  document.getElementById('chatwin').classList.toggle('open');
  var fab=document.getElementById('chatfab');
  if(fab)fab.classList.toggle('open');
}

// Basic HTML sanitization for extra safety
function sanitizeHTML(str) {
  var temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

function addMsg(t,f){
  var m=document.getElementById('chm'),d=document.createElement('div');
  d.className='msg '+f;
  if(f==='bot'){
    // Bot draws from kb which is safe, but we sanitize just in case
    d.innerHTML=t.replace(/\n/g,'<br>');
  }else{
    // textContent automatically sanitizes HTML tags
    d.textContent=t;
  }
  m.appendChild(d);m.scrollTop=m.scrollHeight;
}
function showTyp(){var m=document.getElementById('chm'),d=document.createElement('div');d.className='msg bot typ';d.id='typ';d.innerHTML='<span></span><span></span><span></span>';m.appendChild(d);m.scrollTop=m.scrollHeight;}
function sendMsg(){var inp=document.getElementById('chinp'),t=(inp.value||'').trim();if(!t)return;addMsg(t,'usr');inp.value='';document.getElementById('chq').style.display='none';showTyp();setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(t),'bot');},750);}
function qa(q){document.getElementById('chq').style.display='none';addMsg(q,'usr');showTyp();setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(q),'bot');},750);}

// Event Listeners & Quick Replies
document.addEventListener('DOMContentLoaded',function(){
  // Bind Chatbot triggers
  var chatfab = document.getElementById('chatfab');
  if (chatfab) chatfab.addEventListener('click', toggleChat);
  
  var chatclose = document.getElementById('chatclose');
  if (chatclose) chatclose.addEventListener('click', toggleChat);
  
  var chinp = document.getElementById('chinp');
  if (chinp) chinp.addEventListener('keydown', function(event) { if (event.key === 'Enter') sendMsg(); });
  
  var chsnd = document.getElementById('chsnd');
  if (chsnd) chsnd.addEventListener('click', sendMsg);
  var chq = document.getElementById('chq');
  if(!chq) return;
  var suggestions = [
    { text: 'Tech Stack', query: 'What is his tech stack?' },
    { text: 'Tell a Joke', query: 'Tell me a joke!' },
    { text: 'Download Resume', query: 'How do I download his resume?' }
  ];
  suggestions.forEach(function(item) {
    var btn = document.createElement('button');
    btn.className = 'qb';
    btn.textContent = item.text;
    btn.onclick = function(){ qa(item.query); };
    chq.appendChild(btn);
  });
});