const cfg=window.RITUMATI_CONFIG||{};
const ready=cfg.spreadsheetId&&!cfg.spreadsheetId.includes('YOUR_');
const fallbackStats={women_reached:1200,sessions:85,districts_reached:12,satisfaction:92};
const fallbackDistricts=[
['Bokaro','',true,180,95],['Chatra','',false,90,48],['Deoghar','',false,120,62],['Dhanbad','',true,260,135],['Dumka','',false,110,58],['East Singhbhum','Jamshedpur',true,300,155],['Garhwa','',false,75,41],['Giridih','',true,220,118],['Godda','',false,85,44],['Gumla','',false,95,50],['Hazaribagh','',true,240,126],['Jamtara','',false,80,43],['Khunti','',false,70,38],['Koderma','',false,85,45],['Latehar','',false,75,40],['Lohardaga','',false,90,47],['Pakur','',false,70,36],['Palamu','',false,150,78],['Ramgarh','',false,100,52],['Ranchi','',true,320,170],['Sahibganj','',false,90,46],['Seraikela-Kharsawan','',false,115,60],['Simdega','',false,80,42],['West Singhbhum','',false,130,68]
];
const focusImages={
Ranchi:'assets/photos/districts/district-1.jpg',
'East Singhbhum':'assets/photos/districts/district-2.jpg',
Dhanbad:'assets/photos/districts/district-3.jpg',
Bokaro:'assets/photos/districts/district-4.jpg',
Hazaribagh:'assets/photos/districts/district-5.jpg',
Giridih:'assets/photos/districts/district-6.jpg'
};
const testimonialData=[
['Shreya & Amrita','The session helped us understand menstrual health in a more open and comfortable way.','assets/photos/testimonials/shreya-amrita.jpg'],
['Ritika','I learned practical ways to take care of my menstrual hygiene and ask questions without feeling awkward.','assets/photos/testimonials/ritika.jpg'],
['Disha','It was helpful to learn what is normal during periods and when to seek advice.','assets/photos/testimonials/disha.jpg'],
['Khushi Kumari','I feel more informed about periods and more comfortable talking about them.','assets/photos/testimonials/khushi-kumari.jpg'],
['Annanya Kumari','The information was easy to understand, and I can share it with people close to me.','assets/photos/testimonials/annanya-kumari.jpg'],
['Sanvi Singh','I learned that menstrual health is nothing to be ashamed of.','assets/photos/testimonials/sanvi-singh.jpg'],
['Aarti Kumari','The session answered questions I had been hesitant to ask.','assets/photos/testimonials/aarti-kumari.jpg'],
['Ruchika Kumari','I learned more about hygiene and how to look after myself during periods.','assets/photos/testimonials/ruchika-kumari.jpg'],
['Nishu Kumari','I liked that we could learn and talk about menstrual health openly.','assets/photos/testimonials/nishu-kumari.jpg'],
['Rakhi Mahato','The session gave me useful information that I can remember and share.','assets/photos/testimonials/rakhi-mahato.jpg'],
['Tannu Namta','I feel better prepared to understand my body and take care of my health.','assets/photos/testimonials/tannu-namta.jpg']
];
const galleryData=[
['Community session','assets/photos/gallery/gallery-1.jpg'],
['Health education','assets/photos/gallery/gallery-2.jpg'],
['Community outreach – Ritumati volunteers','assets/photos/gallery/gallery-6.jpg'],
['Menstrual health awareness at school','assets/photos/gallery/gallery-7.jpg'],
['Building awareness, together','assets/photos/gallery/gallery-9.jpg']
];
function text(id,v){const e=document.getElementById(id);if(e)e.textContent=v??'—'}
function parseCSV(csv){const rows=[];let row=[],cell='',q=false;for(let i=0;i<csv.length;i++){const c=csv[i],n=csv[i+1];if(c==='"'){if(q&&n==='"'){cell+='"';i++}else q=!q}else if(c===','&&!q){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(v=>v!==''))rows.push(row);row=[]}else cell+=c}if(cell!==''||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row)}if(!rows.length)return[];const headers=rows.shift().map(x=>x.trim());return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])))}
async function fetchSheet(name){if(!ready)return[];const u=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.spreadsheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('Could not read '+name);return parseCSV(await r.text())}
function applyStats(s){text('womenReached',Number(s.women_reached||0).toLocaleString('en-IN')+'+');text('sessions',Number(s.sessions||0).toLocaleString('en-IN')+'+');text('districtsReached',s.districts_reached);text('satisfaction',(s.satisfaction||0)+'%')}
function normalizeDistricts(rows){if(!rows.length)return fallbackDistricts.map(x=>({name:x[0],alias:x[0]==='Bokaro'?'':x[1],priority:x[2],pads:x[3],people:x[4],active:true}));return rows.map(r=>{const name=(r.name||'').trim();return {name,alias:name==='Bokaro'?'':(r.city_alias||''),priority:String(r.priority).toUpperCase()==='TRUE',pads:Number(r.pads_distributed||0),people:Number(r.people_helped||0),active:String(r.active).toUpperCase()!=='FALSE'}}).filter(x=>x.active)}
let districts=[];
function focusCard(d){const bg=focusImages[d.name]||focusImages.Ranchi;const alias=d.name==='Bokaro'?'':d.alias;return `<article class="focus-card"><div class="focus-photo" style="background-image:url('${bg}')"><strong>${d.name}${alias?`<span>(${alias})</span>`:''}</strong></div><div class="focus-metrics"><div class="metric-row"><div class="metric-icon">♧</div><div><b>${d.pads.toLocaleString('en-IN')}</b><small>Pads distributed</small></div></div><div class="metric-row"><div class="metric-icon">♙</div><div><b>${d.people.toLocaleString('en-IN')}</b><small>People helped</small></div></div></div></article>`}
function miniCard(d){const alias=d.name==='Bokaro'?'':d.alias;return `<article class="mini"><strong>${d.name}${alias?` (${alias})`:''}</strong><div class="mini-metrics"><span><b>${d.pads.toLocaleString('en-IN')}</b> pads distributed</span><span><b>${d.people.toLocaleString('en-IN')}</b> people helped</span></div></article>`}
function renderDistricts(rows){districts=normalizeDistricts(rows);const focus=districts.filter(d=>d.priority).slice(0,6);document.getElementById('priorityDistricts').innerHTML=focus.map(focusCard).join('');document.getElementById('allDistricts').innerHTML=districts.map(miniCard).join('')}
function renderContent(){document.getElementById('testimonials').innerHTML=testimonialData.map(x=>`<article class="story"><img src="${x[2]}" alt="${x[0]}"><p>“${x[1]}”</p><div class="who">— ${x[0]}</div></article>`).join('');document.getElementById('galleryGrid').innerHTML=galleryData.map(x=>`<figure><img loading="lazy" src="${x[1]}" alt="${x[0]}"><figcaption>${x[0]}</figcaption></figure>`).join('')}
async function load(){renderContent();applyStats(fallbackStats);renderDistricts([]);if(!ready)return;try{const [s,d]=await Promise.all([fetchSheet('Dashboard'),fetchSheet('Districts')]);if(s[0])applyStats(s[0]);if(d.length)renderDistricts(d)}catch(e){console.warn('Google Sheets unavailable; showing starter data.',e)}}load();
