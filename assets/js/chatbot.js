// Chatbot knowledge base
var kb={
  skills:"Dhanya's core stack: Azure, AWS, Terraform, Ubuntu Linux, Grafana, Prometheus, OpenSearch, CloudWatch, ServiceNow, ITIL, Shell scripting, Python, LDAP, Zscaler, DNS and VPN configuration, Wireshark.",
  certs:"Three active certifications:\n- AWS Certified Cloud Practitioner (CLF-C02)\n- Microsoft Azure Fundamentals (AZ-900)\n- HashiCorp Terraform Associate 003\nAll verified on Credly or Microsoft Learn.",
  open:"Yes, Dhanya is open to cloud and DevOps opportunities, particularly those with international scope. For a prompt response, reach out on LinkedIn. For formal enquiries, email dhanyasukanth@gmail.com.",
  contact:"LinkedIn: linkedin.com/in/dhanya-sukanth-b-k (prompt responses)\nEmail: dhanyasukanth@gmail.com (formal correspondence)\nGitHub: github.com/dhanyasukanth\nLocation: Bengaluru, India",
  connect:"For a prompt response, reach out via LinkedIn at linkedin.com/in/dhanya-sukanth-b-k.\nFor formal correspondence such as opportunities, proposals, or documentation, email dhanyasukanth@gmail.com.",
  exp:"Dhanya is currently a Senior Cloud Engineer at Microland (March 2024 to present), managing GE's global MyApps infrastructure across Azure and AWS. Previously, he worked as an IoT Engineer at Knowx Solutions.",
  hey:"Hello! I am Dhanya's portfolio assistant. I can provide information about his skills, certifications, experience, or how to get in touch.",
  def:"I can help with information about Dhanya's technical skills, certifications, work experience, or contact details. What would you like to know?"
};

function reply(m){
  var q=m.toLowerCase();
  if(q.match(/^(hey|hi|hello|good)/))return kb.hey;
  if(q.includes('skill')||q.includes('tech')||q.includes('stack'))return kb.skills;
  if(q.includes('cert')||q.includes('badge'))return kb.certs;
  if(q.includes('hire')||q.includes('open')||q.includes('job')||q.includes('opportunit')||q.includes('available'))return kb.open;
  if(q.includes('connect')||q.includes('reach')||q.includes('dm'))return kb.connect;
  if(q.includes('contact')||q.includes('email')||q.includes('linkedin')||q.includes('github'))return kb.contact;
  if(q.includes('exp')||q.includes('work')||q.includes('microland')||q.includes('career'))return kb.exp;
  return kb.def;
}

function toggleChat(){document.getElementById('chatwin').classList.toggle('open')}

function addMsg(t,f){
  var m=document.getElementById('chm'),d=document.createElement('div');
  d.className='msg '+f;d.textContent=t;m.appendChild(d);m.scrollTop=m.scrollHeight;
}

function showTyp(){
  var m=document.getElementById('chm'),d=document.createElement('div');
  d.className='msg bot typ';d.id='typ';
  d.innerHTML='<span></span><span></span><span></span>';
  m.appendChild(d);m.scrollTop=m.scrollHeight;
}

function sendMsg(){
  var inp=document.getElementById('chinp'),t=(inp.value||'').trim();
  if(!t)return;
  addMsg(t,'usr');
  inp.value='';
  document.getElementById('chq').style.display='none';
  showTyp();
  setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(t),'bot');},750);
}

function qa(q){
  document.getElementById('chq').style.display='none';
  addMsg(q,'usr');
  showTyp();
  setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(q),'bot');},750);
}
