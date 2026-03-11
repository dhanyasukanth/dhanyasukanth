// Chatbot knowledge base - Conversational, Human, Direct
var kb = {
  skills: "He's heavy into Azure, AWS, and Terraform. Basically, if it involves automating infrastructure, setting up Grafana dashboards, or keeping servers quiet with Python and Shell scripts, he's on it.",
  certs: "He's got three active certs right now: AWS Cloud Practitioner, Azure Fundamentals, and Terraform Associate. All verified.",
  projects: "He keeps a few solid repos on GitHub. It's mostly Terraform modules, monitoring stack setups, and some AWS IoT Core builds. You can check the code at <a href='https://github.com/dhanyasukanth' target='_blank' style='color:var(--accent3); text-decoration:underline;'>github.com/dhanyasukanth</a>.",
  exp_general: "He's currently a Senior Cloud Engineer at Microland, keeping GE's global MyApps infrastructure running smoothly on Azure and AWS. Before that, he was doing IoT engineering with AWS IoT Core.",
  exp_microland: "Right now, he's at Microland handling GE's global MyApps environment. It's a lot of Azure and AWS infrastructure management, making sure everything stays highly available.",
  edu: "He got his B.E. in Electronics & Communication from VTU here in Bengaluru.",
  open: "For sure. He's always open to talking about new cloud or DevOps roles. Just drop him a message on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2); text-decoration:underline;'>LinkedIn</a>.",
  relocation: "He's based in Bengaluru right now, but he's totally open to remote work or relocating for the right infrastructure role. He's been looking at a few international options lately.",
  bio: "Dhanya is a Senior Cloud Engineer specializing in Azure, AWS, and Terraform. Outside of work, he's usually tuning his VW Virtus, figuring out the budget for the F1 Japanese Grand Prix, or hunting down a really good coffee.",
  contact: "The fastest way to reach him is definitely <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2); text-decoration:underline;'>LinkedIn</a>. You can also just shoot an email over to <a href='https://mail.google.com/mail/?view=cm&fs=1&to=dhanyasukanth@gmail.com' target='_blank' style='color:var(--accent); text-decoration:underline;'>dhanyasukanth@gmail.com</a>. He replies pretty quick.",
  resume: "You can grab a read-only look at his resume by hitting the View Resume button up top. If you want to save the PDF locally, just use your browser's Print to PDF option.",
  page: "He built this site from scratch with plain HTML, CSS, and JavaScript. No heavy frameworks. You can poke around the source code on his <a href='https://github.com/dhanyasukanth/dhanyasukanth' target='_blank' style='color:var(--accent3);text-decoration:underline'>GitHub</a>.",
  hey: "Hey! I'm Dhanya's portfolio bot. I can give you a quick rundown on his tech stack, experience, or how to reach him. What's up?",
  thanks: "Anytime. Let me know if you need anything else!",
  how_are_you: "Doing great, thanks for asking! Just hanging out in the DOM. What can I help you find?",
  def: "I can give you the quick version of his skills, certs, work history, or contact info. What are you looking for?"
};

function reply(m) {
  var q = m.toLowerCase();
  
  if(q.match(/^(hey|hi|hello|good|greetings)/)) return kb.hey;
  if(q.includes('thank') || q.includes('appreciate')) return kb.thanks;
  if(q.includes('how are you') || q.includes('what\'s up')) return kb.how_are_you;
  
  if(q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('tool') || q.includes('python') || q.includes('terraform')) return kb.skills;
  if(q.includes('cert') || q.includes('aws') || q.includes('azure') || q.includes('exam')) return kb.certs;
  
  if(q.includes('microland') || q.includes('ge') || q.includes('current role')) return kb.exp_microland;
  if(q.includes('exp') || q.includes('work') || q.includes('career') || q.includes('role')) return kb.exp_general;
  
  if(q.includes('project') || q.includes('github') || q.includes('repo') || q.includes('code')) return kb.projects;
  if(q.includes('edu') || q.includes('degree') || q.includes('college') || q.includes('vtu')) return kb.edu;
  
  if(q.includes('hobby') || q.includes('fun') || q.includes('who') || q.includes('about') || q.includes('bio') || q.includes('outside')) return kb.bio;
  
  if(q.includes('relocat') || q.includes('remote') || q.includes('locat') || q.includes('where') || q.includes('bengaluru')) return kb.relocation;
  if(q.includes('hire') || q.includes('open') || q.includes('job') || q.includes('opportunit')) return kb.open;
  if(q.includes('connect') || q.includes('reach') || q.includes('dm') || q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('gmail')) return kb.contact;
  
  if(q.includes('resume') || q.includes('cv') || q.includes('pdf') || q.includes('download')) return kb.resume;
  if(q.includes('page') || q.includes('site') || q.includes('portfolio') || q.includes('built') || q.includes('source')) return kb.page;
  
  return kb.def;
}

// UI Functions remain the same...
function toggleChat(){document.getElementById('chatwin').classList.toggle('open')}
function addMsg(t,f){var m=document.getElementById('chm'),d=document.createElement('div');d.className='msg '+f;if(f==='bot'){d.innerHTML=t.replace(/\n/g,'<br>');}else{d.textContent=t;}m.appendChild(d);m.scrollTop=m.scrollHeight;}
function showTyp(){var m=document.getElementById('chm'),d=document.createElement('div');d.className='msg bot typ';d.id='typ';d.innerHTML='<span></span><span></span><span></span>';m.appendChild(d);m.scrollTop=m.scrollHeight;}
function sendMsg(){var inp=document.getElementById('chinp'),t=(inp.value||'').trim();if(!t)return;addMsg(t,'usr');inp.value='';document.getElementById('chq').style.display='none';showTyp();setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(t),'bot');},750);}
function qa(q){document.getElementById('chq').style.display='none';addMsg(q,'usr');showTyp();setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(q),'bot');},750);}

// Quick Replies
document.addEventListener('DOMContentLoaded',function(){
  var chq = document.getElementById('chq');
  if(!chq) return;
  var suggestions = [
    { text: 'Tech Stack', query: 'What is his tech stack?' },
    { text: 'Current Role', query: 'Tell me about his role at Microland' },
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