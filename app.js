const cfg = window.RITUMATI_CONFIG || {};
const ready = cfg.spreadsheetId && !cfg.spreadsheetId.includes('YOUR_');

const fallbackStats={women_reached:1200,sessions:18,districts_reached:7,satisfaction:92,annual_goal:2000,annual_completed:1440};

function text(el,v){const x=document.getElementById(el);if(x)x.textContent=v??'—';}
function parseCSV(csv){
  const rows=[];let row=[],cell='',q=false;
  for(let i=0;i<csv.length;i++){
    const c=csv[i],n=csv[i+1];
    if(c==='"'){if(q&&n==='"'){cell+='"';i++;}else q=!q;}
    else if(c===','&&!q){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!q){
      if(c==='\r'&&n==='\n')i++;
      row.push(cell);cell='';
      if(row.some(v=>v!==''))rows.push(row);
      row=[];
    } else cell+=c;
  }
  if(cell!==''||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row);}
  if(!rows.length)return[];
  const headers=rows.shift().map(x=>x.trim());
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])));
}
async function fetchSheet(sheetName){
  if(!ready)return [];
  const url=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.spreadsheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res=await fetch(url,{cache:'no-store'});
  if(!res.ok)throw new Error(`Could not read ${sheetName} sheet`);
  return parseCSV(await res.text());
}
async function sheet(){
  const rows=await fetchSheet('Dashboard');
  return rows[0]||null;
}
async function districtSheet(){
  return fetchSheet('Districts');
}
function applyStats(s){
  text('womenReached',s.women_reached);
  text('sessions',s.sessions);
  text('districtsReached',s.districts_reached);
  text('satisfaction',`${s.satisfaction}%`);
  const pct=s.annual_goal?Math.min(100,Math.round((Number(s.annual_completed)/Number(s.annual_goal))*100)):0;
  text('goalPct',`${pct}%`);
  const bar=document.getElementById('goalBar');if(bar)bar.style.width=pct+'%';
}
const fallbackDistricts=[
 ['Bokaro','', 'TRUE','Community outreach, awareness and health support.','TRUE',180,95],
 ['Chatra','', 'FALSE','Community outreach, awareness and health support.','TRUE',90,48],
 ['Deoghar','', 'FALSE','Community outreach, awareness and health support.','TRUE',120,62],
 ['Dhanbad','', 'TRUE','Community outreach, awareness and health support.','TRUE',260,135],
 ['Dumka','', 'FALSE','Community outreach, awareness and health support.','TRUE',110,58],
 ['East Singhbhum','Jamshedpur','TRUE','Community outreach, awareness and health support.','TRUE',300,155],
 ['Garhwa','', 'FALSE','Community outreach, awareness and health support.','TRUE',75,41],
 ['Giridih','', 'TRUE','Community outreach, awareness and health support.','TRUE',220,118],
 ['Godda','', 'FALSE','Community outreach, awareness and health support.','TRUE',85,44],
 ['Gumla','', 'FALSE','Community outreach, awareness and health support.','TRUE',95,50],
 ['Hazaribagh','', 'TRUE','Community outreach, awareness and health support.','TRUE',240,126],
 ['Jamtara','', 'FALSE','Community outreach, awareness and health support.','TRUE',80,43],
 ['Khunti','', 'FALSE','Community outreach, awareness and health support.','TRUE',70,38],
 ['Koderma','', 'FALSE','Community outreach, awareness and health support.','TRUE',85,45],
 ['Latehar','', 'FALSE','Community outreach, awareness and health support.','TRUE',75,40],
 ['Lohardaga','', 'FALSE','Community outreach, awareness and health support.','TRUE',90,47],
 ['Pakur','', 'FALSE','Community outreach, awareness and health support.','TRUE',70,36],
 ['Palamu','', 'FALSE','Community outreach, awareness and health support.','TRUE',150,78],
 ['Ramgarh','', 'FALSE','Community outreach, awareness and health support.','TRUE',100,52],
 ['Ranchi','', 'TRUE','Community outreach, awareness and health support.','TRUE',320,170],
 ['Sahibganj','', 'FALSE','Community outreach, awareness and health support.','TRUE',90,46],
 ['Seraikela-Kharsawan','', 'FALSE','Community outreach, awareness and health support.','TRUE',115,60],
 ['Simdega','', 'FALSE','Community outreach, awareness and health support.','TRUE',80,42],
 ['West Singhbhum','', 'FALSE','Community outreach, awareness and health support.','TRUE',130,68]
];
let districtData=[];
function districtName(d){return d.name + (d.city_alias ? ` (${d.city_alias})` : '');}
function renderDistricts(rows){
  const normalized=rows.length ? rows.map(r=>({name:r.name,city_alias:r.city_alias||'',priority:String(r.priority).toUpperCase()==='TRUE',description:r.description||'Community outreach, awareness and health support.',pads:Number(r.pads_distributed||0),people:Number(r.people_helped||0),active:String(r.active).toUpperCase()!=='FALSE'})) : fallbackDistricts.map(r=>({name:r[0],city_alias:r[1],priority:r[2]==='TRUE',description:r[3],active:r[4]==='TRUE',pads:r[5],people:r[6]}));
  districtData=normalized.filter(d=>d.active);
  const card=d=>`<button class="district" data-district="${d.name}"><strong>${districtName(d)}</strong>${d.priority?'<span class="badge">Priority</span>':''}<div class="district-metrics"><div class="district-metric"><b>${d.pads.toLocaleString('en-IN')}</b><span>Pads distributed</span></div><div class="district-metric"><b>${d.people.toLocaleString('en-IN')}</b><span>People helped</span></div></div></button>`;
  const priority=document.getElementById('priorityDistricts'); if(priority)priority.innerHTML=districtData.filter(d=>d.priority).map(card).join('');
  const all=document.getElementById('allDistricts'); if(all){ all.innerHTML=districtData.map(card).join(''); all.classList.add('collapsed'); }
  const toggle=document.getElementById('toggleAllDistricts');
  if(toggle){ toggle.onclick=()=>{ const open=all && !all.classList.contains('collapsed'); if(all)all.classList.toggle('collapsed'); toggle.textContent=open?'View all 24 districts →':'Hide all districts ↑'; if(!open) all?.scrollIntoView({behavior:'smooth',block:'nearest'}); }; }
  document.querySelectorAll('[data-district]').forEach(el=>el.addEventListener('click',()=>selectDistrict(el.dataset.district)));
  selectDistrict('Ranchi');
}
function selectDistrict(name){
  const d=districtData.find(x=>x.name===name)||districtData[0]; if(!d)return;
  text('districtTitle',districtName(d)); text('districtText',d.description); text('districtPads',d.pads.toLocaleString('en-IN')); text('districtPeople',d.people.toLocaleString('en-IN'));
  document.querySelectorAll('[data-district]').forEach(el=>el.classList.toggle('active',el.dataset.district===d.name));
}
const localTestimonials=[
 ['Asha','Community participant','The session gave me a safe place to ask questions I had been too shy to ask before.','assets/photos/testimonials/testimonial-1.svg'],
 ['Priya','Adolescent participant','I understood what is normal during periods and when it is important to seek help.','assets/photos/testimonials/testimonial-2.svg'],
 ['Neha','Women’s group member','The volunteers explained everything simply and without judgement.','assets/photos/testimonials/testimonial-3.svg'],
 ['Kavita','School participant','The conversation made menstrual health feel much less embarrassing.','assets/photos/testimonials/testimonial-4.svg'],
 ['Riya','Volunteer','The programme helped us turn questions into practical health actions.','assets/photos/testimonials/testimonial-5.svg'],
 ['Sunita','Community participant','Knowing where to go for a health concern has made a real difference.','assets/photos/testimonials/testimonial-6.svg']
];
const localGallery=[
 ['Community session','assets/photos/gallery/gallery-1.svg','Replace with programme photo'],
 ['Health education','assets/photos/gallery/gallery-2.svg','Replace with programme photo'],
 ['Volunteer engagement','assets/photos/gallery/gallery-3.svg','Replace with programme photo'],
 ['Learning together','assets/photos/gallery/gallery-4.svg','Replace with programme photo'],
 ['School outreach','assets/photos/gallery/gallery-5.svg','Replace with programme photo'],
 ['Community voices','assets/photos/gallery/gallery-6.svg','Replace with programme photo']
];
function renderLocalContent(){
 const t=document.getElementById('testimonials');
 if(t)t.innerHTML=localTestimonials.map(x=>`<article class="card story"><img src="${x[3]}" alt="${x[0]}"><p>${x[2]}</p><div class="who">— ${x[0]} · ${x[1]}</div></article>`).join('');
 const g=document.getElementById('galleryGrid');
 if(g)g.innerHTML=localGallery.map(x=>`<figure><img loading="lazy" src="${x[1]}" alt="${x[0]}"><figcaption>${x[0]} · ${x[2]}</figcaption></figure>`).join('');
}
async function load(){
  renderLocalContent();
  applyStats(fallbackStats);
  renderDistricts([]);
  if(!ready)return;
  try{
    const [s,rows]=await Promise.all([sheet(),districtSheet()]);
    if(s)applyStats(s);
    if(rows&&rows.length)renderDistricts(rows);
  }catch(e){console.warn('Google Sheet data could not be loaded; showing starter numbers.',e);}
}
load();
