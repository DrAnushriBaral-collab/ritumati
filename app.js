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
['Aditi','Class 10, Ranchi','I feel more confident and prepared now.','assets/photos/testimonials/testimonial-1.jpg'],
['Pooja','Class 9, Dhanbad','Now I know my body better and I’m not afraid.','assets/photos/testimonials/testimonial-2.jpg'],
['Neha','Class 8, Bokaro','The session was very helpful and easy to understand.','assets/photos/testimonials/testimonial-3.jpg'],
['Sunita','Teacher, Hazaribagh','We can now talk about periods without shame.','assets/photos/testimonials/testimonial-4.jpg'],
['Rani','Class 9, Jamshedpur','This programme really cares about us.','assets/photos/testimonials/testimonial-5.jpg'],
['Kavya','Class 10, Giridih','I learned so much, and I’ve shared it with my friends.','assets/photos/testimonials/testimonial-6.jpg']
];

const galleryData=[
['Community session','assets/photos/gallery/gallery-1.jpg'],
['Health education','assets/photos/gallery/gallery-2.jpg'],
['Volunteer engagement','assets/photos/gallery/gallery-3.jpg'],
['Periods are normal','assets/photos/gallery/gallery-4.jpg'],
['School outreach','assets/photos/gallery/gallery-5.jpg']
];

function text(id,v){const e=document.getElementById(id);if(e)e.textContent=v??'—'}
function parseCSV(csv){const rows=[];let row=[],cell='',q=false;for(let i=0;i<csv.length;i++){const c=csv[i],n=csv[i+1];if(c==='"'){if(q&&n==='"'){cell+='"';i++}else q=!q}else if(c===','&&!q){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(v=>v!==''))rows.push(row);row=[]}else cell+=c}if(cell!==''||row.length){row.push(cell);if(row.some(v=>v!==''))rows.push(row)}if(!rows.length)return[];const headers=rows.shift().map(x=>x.trim());return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]??'').trim()])))}}
async function fetchSheet(name){if(!ready)return[];const u=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.spreadsheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('Could not read '+name);return parseCSV(await r.text())}
function applyStats(s){text('womenReached',Number(s.women_reached||0).toLocaleString('en-IN')+'+');text('sessions',Number(s.sessions||0).toLocaleString('en-IN')+'+');text('districtsReached',s.districts_reached);text('satisfaction',(s.satisfaction||0)+'%')}
function normalizeDistricts(rows){if(!rows.length)return fallbackDistricts.map(x=>({name:x[0],alias:x[1],priority:x[2],pads:x[3],people:x[4],active:true}));return rows.map(r=>{const name=(r.name||'').trim();return{name,alias:name==='Bokaro'?'':(r.city_alias||''),priority:String(r.priority).toUpperCase()==='TRUE',pads:Number(r.pads_distributed||0),people:Number(r.people_helped||0),active:String(r.active).toUpperCase()!=='FALSE'}}).filter(x=>x.active)}
let districts=[];
function focusCard(d){const bg=focusImages[d.name]||focusImages.Ranchi;const alias=d.name==='Bokaro'?'':d.alias;return `<article class="focus-card"><div class="focus-photo" style="background-image:url('${bg}')"><strong>${d.name}${alias?`<span>(${alias})</span>`:''}</strong></div><div class="focus-metrics"><div class="metric-row"><div class="metric-icon">♧</div><div><b>${d.pads.toLocaleString('en-IN')}</b><small>Pads distributed</small></div></div><div class="metric-row"><div class="metric-icon">♙</div><div><b>${d.people.toLocaleString('en-IN')}</b><small>People helped</small></div></div></div></article>`}
function miniCard(d){const alias=d.name==='Bokaro'?'':d.alias;return `<article class="mini"><strong>${d.name}${alias?` (${alias})`:''}</strong><div class="mini-metrics"><span><b>${d.pads.toLocaleString('en-IN')}</b> pads distributed</span><span><b>${d.people.toLocaleString('en-IN')}</b> people helped</span></div></article>`}
function renderDistricts(rows){districts=normalizeDistricts(rows);const focus=districts.filter(d=>d.priority).slice(0,6);document.getElementById('priorityDistricts').innerHTML=focus.map(focusCard).join('');document.getElementById('allDistricts').innerHTML=districts.map(miniCard).join('')}
function renderContent(){document.getElementById('testimonials').innerHTML=testimonialData.map(x=>`<article class="story"><img src="${x[3]}" alt="${x[0]}"><p>“${x[2]}”</p><div class="who">— ${x[0]} · ${x[1]}</div></article>`).join('');document.getElementById('galleryGrid').innerHTML=galleryData.map(x=>`<figure><img loading="lazy" src="${x[1]}" alt="${x[0]}"><figcaption>${x[0]}</figcaption></figure>`).join('')}

/* V11-only visual fixes requested:
   1) Make the Ritumati logo a little larger.
   2) Hide the duplicate district-name text baked into the district photos
      by making the existing lower photo gradient opaque. The visible district
      name remains the single HTML label on top. */
function applyV11VisualFixes(){
  if(document.getElementById('v11-visual-fixes'))return;
  const s=document.createElement('style');
  s.id='v11-visual-fixes';
  s.textContent=`
    .brand img{width:60px!important;height:60px!important}
    .focus-photo:after{
      inset:0!important;
      background:linear-gradient(
        to bottom,
        rgba(25,8,20,0) 0%,
        rgba(25,8,20,0.04) 28%,
        rgba(25,8,20,0.82) 56%,
        rgba(25,8,20,0.97) 100%
      )!important;
    }
    .focus-photo strong{z-index:2!important}
  `;
  document.head.appendChild(s);
}

async function load(){applyV11VisualFixes();renderContent();applyStats(fallbackStats);renderDistricts([]);if(!ready)return;try{const [s,d]=await Promise.all([fetchSheet('Dashboard'),fetchSheet('Districts')]);if(s[0])applyStats(s[0]);if(d.length)renderDistricts(d)}catch(e){console.warn('Google Sheets unavailable; showing starter data.',e)}}
load();
