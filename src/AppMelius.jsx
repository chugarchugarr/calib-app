import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import './melius.css'
import './calib-feedback.css'

const SB_URL='https://tieuutosriyosykcshdn.supabase.co'
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZXV1dG9zcml5b3N5a2NzaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU1MjQsImV4cCI6MjA4ODMyMTUyNH0.ixQ5dteC2coN_Lqonh1M0AmsLabYVYufVXo93F38hZU'
const supabase=createClient(SB_URL,SB_KEY)

const NAMES={1:'Perfectionism as Procrastination',2:'Addiction to Potential',3:'Comparison Paralysis',4:'Waiting to Feel Ready',5:'Overidentifying with the Past',6:'Fearing Success More Than Failure',7:'Emotional Self-Isolation',8:'Romanticizing the Struggle',9:'Financial Martyrdom',10:'Toxic Spiritual Bypassing',11:'Over-Researching, Under-Doing',12:'Seeking Constant Validation',13:'Creating Only When Inspired',14:'Creating from Wounds, Not Power',15:'Abandoning Projects Mid-Birth'}
const SHORT={1:'Perfectionism',2:'Potential Trap',3:'Comparison',4:'Not Ready',5:'Living in the Past',6:'Fearing Success',7:'Self-Isolation',8:'Romanticizing',9:'Financial Martyrdom',10:'Spiritual Bypass',11:'Over-Research',12:'Validation',13:'Inspiration-Only',14:'Creating from Wounds',15:'Abandonment'}
const DESC={
  1:'You may not be avoiding the work because you do not care. You may be keeping it unfinished because unfinished work cannot fully answer back.',
  2:'The person you could become can feel more alive than the work in front of you. New possibility gives you a rush; staying with one thing asks something quieter and harder.',
  3:'Someone else moving forward can start to feel like evidence that you are falling behind. Their path enters the room and your own work gets harder to hear.',
  4:'You may keep waiting for a feeling called ready. The trouble is that ready can keep moving just far enough away to protect you from being seen.',
  5:'An old version of you may still be making decisions for the person you are now. The familiar story can feel safer than finding out what is true today.',
  6:'The dream can feel good until it starts becoming possible. Then being seen, expected, or responsible for what comes next can feel heavier than failure ever did.',
  7:'Doing everything alone can look like focus from the outside. Sometimes it is also a way to avoid being needed, known, or disappointed.',
  8:'You may have learned to trust the work more when it hurts. Ease can feel suspicious, like the art is less real if you did not have to bleed for it.',
  9:'Struggle may have become part of how you prove devotion to the work. Asking for money, support, or stability can feel less honest than carrying the cost yourself.',
  10:'A higher meaning can help you hold hard things. It can also become a place to stand above a feeling you still need to meet.',
  11:'Learning can feel close enough to making that the difference disappears. You keep preparing because preparation cannot expose you the way the work can.',
  12:'Sometimes the work stops being about what you want to say and starts being about what the response will mean. You begin checking the room before you have finished speaking.',
  13:'You may trust the spark so much that you do not trust yourself without it. When the feeling leaves, the work can look like it left too.',
  14:'Pain may be one of the clearest doors into your work. But the work might be trying to become more than a record of what hurt.',
  15:'You may not lose interest at the end. You may reach the point where finishing would let the work answer back, and starting over feels safer.'
}
const REFRAME={
  1:'The work does not need one more defense. It may only need permission to exist.',
  2:'The future version of you is built by staying with what is here.',
  3:'Someone else finding their way does not tell you where you are allowed to go.',
  4:'You may not feel ready before you move. Sometimes movement is what makes ready possible.',
  5:'The old story can explain you without getting to decide you.',
  6:'Being seen may feel like danger and still be where the work is trying to go.',
  7:'Letting someone in does not make the work less yours.',
  8:'The work can be deep without requiring you to stay depleted.',
  9:'Support does not make the work less honest.',
  10:'You do not have to rise above the feeling before you listen to it.',
  11:'You probably know enough to make the next honest attempt.',
  12:'Make the thing before you ask the room what it is worth.',
  13:'The spark can open the door. You are still the one who can return.',
  14:'The wound may be the door. It does not have to become the whole room.',
  15:'Finishing does not end possibility. It gives possibility a real shape.'
}

const MEDIUM={
  Music:{work:'track',making:'making music',finished:'a track that feels alive',share:'let someone hear it'},
  'Beats / Production':{work:'beat',making:'producing',finished:'a beat that caught the feeling',share:'play it for someone'},
  'Visual Art':{work:'piece',making:'making visual work',finished:'a piece that could be shown',share:'put it where someone can see it'},
  'Film / Video':{work:'cut',making:'making the film',finished:'a cut that finally feels like the thing',share:'show the cut'},
  Writing:{work:'draft',making:'writing',finished:'a draft that says what you meant',share:'let someone read it'},
  Other:{work:'work',making:'making',finished:'something that feels real',share:'let someone experience it'}
}

const buildQuiz=creativeType=>{
  const m=MEDIUM[creativeType]||MEDIUM.Other
  return [
    [`You finish ${m.finished}. What happens next?`,['I start finding reasons it still is not ready.',[1],3],['I am already more excited by the next idea.',[2,15],3],['I wonder what people will think before I know what I think.',[12],3],[`I want to ${m.share}, but I suddenly feel exposed.`,[6,1],3]],
    [`You have not touched the ${m.work} in three days. What story starts playing?`,['I am waiting for the feeling to come back.',[13,4],3],['I keep finding more to learn before I return.',[11],3],['I do not want to see what state I left it in.',[15,1],3],['Other people seem farther ahead and it gets in my head.',[3],3]],
    [`When the ${m.work} gets close to done, what usually happens?`,['A new idea suddenly feels more alive.',[2,15],3],['I slow down and find more things to fix.',[1,15],3],['I push through, but being this close makes me anxious.',[6],2],['I finish it, then avoid letting anyone experience it.',[6,12],3]],
    ['Someone gives you critical feedback. What happens before you have time to reason through it?',['I think: I knew it was not good enough.',[1,12],3],['I wonder if this means I am not really meant for this.',[5,3],3],['I need to know whether everyone else feels the same way.',[12],3],['I want to disappear for a while.',[7],3]],
    [`What most often pulls you into ${m.making}?`,['Pain, grief, anger, or something I am trying to process.',[14,8],3],['Momentum. Once I am in it, I can stay there for hours.',[13],2],['The picture of what this could become.',[2],3],['I return because the work matters, even when the feeling is quiet.',[],0]],
    ['Imagine the work becoming as successful as you secretly want. What is the first honest feeling?',['Excitement. I can see it.',[2],2],['Anxiety. I am not sure I could carry everything that comes with it.',[6],3],['Distance. That version of me feels like somebody else.',[5,6],3],['Relief. It would finally prove something.',[12],3]],
    [`When you feel blocked on the ${m.work}, what do you actually do?`,['Research, watch, read, or learn more.',[11],3],['Wait for the feeling to return.',[13,4],3],['Pull away and try to solve it alone.',[7],3],['Start something new and tell myself I will come back.',[2,15],3]],
    [`What has ${m.making} quietly asked you to give up?`,['Sleep, money, or stability.',[9,8],3],['Closeness. I disappear when I am deep in it.',[7],3],['Peace of mind. I am rarely satisfied with what I made.',[1,14],3],['Confidence. The work keeps turning into a judgment of me.',[3,12],3]]
  ]
}

const PATTERN_PROMPTS={
  1:'What are you still fixing because finishing would make this real?',
  2:'Are you more excited by what this could become than by what it needs from you today?',
  3:'Whose work entered the room with you today?',
  4:'What are you waiting to feel before you let yourself begin?',
  5:'What old version of you is still being asked to make this?',
  6:'If this went exactly right, what would suddenly be expected of you?',
  7:'What are you carrying alone that may not need to stay private?',
  8:'Would the work feel less real if it did not hurt this much?',
  9:'What are you refusing to ask for because struggle feels more honest?',
  10:'What feeling are you trying to rise above instead of meeting?',
  11:'What do you already know enough to try?',
  12:'Before anyone responds, what do you want this work to say?',
  13:'What can you make before the feeling arrives?',
  14:'What is the work trying to become after the pain?',
  15:'What would count as finished enough to let this leave you?'
}

const KEYWORDS={1:['perfect','not ready','fix','polish'],2:['potential','someday','new idea'],3:['compare','behind','ahead'],4:['wait','ready','later'],6:['afraid','scared','seen','exposed'],7:['alone','isolated','disappear'],8:['struggle','sacrifice','suffering'],11:['research','tutorial','learn first'],12:['approval','people think','feedback','audience'],13:['inspiration','not feeling it','blocked'],14:['pain','hurt','wound','grief'],15:['give up','abandon','quit','new project']}

const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v))
const uid=()=>Date.now()
const profileFrom=answers=>{const scores={};answers.forEach(a=>a.patterns.forEach(p=>scores[p]=(scores[p]||0)+a.weight));return Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,s])=>({id:+id,name:NAMES[id],short:SHORT[id],score:s}))}
const scan=text=>Object.entries(KEYWORDS).filter(([,words])=>words.some(w=>text.toLowerCase().includes(w))).map(([id])=>+id)
const rankLabel=i=>i===0?'Closest to the surface':i<3?'Showing up':'Worth noticing'

function Onboarding({onReady}){
  const [stage,setStage]=useState('intro')
  const [name,setName]=useState('')
  const [creativeType,setType]=useState('')
  const [q,setQ]=useState(0)
  const [answers,setAnswers]=useState([])
  const [profile,setProfile]=useState(null)
  const [email,setEmail]=useState('')
  const [syncState,setSyncState]=useState('')
  const [error,setError]=useState('')
  const quiz=useMemo(()=>buildQuiz(creativeType),[creativeType])
  const data=()=>({name:name.trim(),creativeType,profile})
  const answer=opt=>{const next=[...answers,{patterns:opt[1],weight:opt[2]}];if(q<quiz.length-1){setAnswers(next);setQ(q+1)}else{setProfile(profileFrom(next));setStage('reveal')}}
  const enter=()=>onReady(data())
  const send=async()=>{setError('');setSyncState('sending');save('calib:pending',data());const {error:e}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:window.location.origin}});if(e){setError(e.message);setSyncState('')}else setSyncState('sent')}

  if(stage==='intro')return <div className="app full-screen"><section className="intro-copy"><div><div className="eyebrow">Creative self-coaching</div><h1>calib<span className="orange">.</span></h1><p>The work keeps telling you what is happening. Calib helps you notice what you may have been too close to name.</p></div><div className="diagram"><span className="node">spark</span><span className="arrow">→</span><span className="node">make</span><span className="arrow">→</span><span className="node hot">notice</span><span className="arrow">→</span><span className="node">return</span></div></section><aside className="intro-panel"><div><div className="eyebrow" style={{color:'#9c9a93'}}>Always free</div><div className="panel-number">No gate.</div><p style={{lineHeight:1.6,color:'#bbb7af'}}>No Pro tier. No session cap. Start here, keep your work here, and connect an email only when you want it on another device.</p></div><button className="action" onClick={()=>setStage('identity')}><span>See what is showing up</span><span>→</span></button></aside></div>

  if(stage==='identity')return <div className="app"><div className="reveal decision"><div className="eyebrow">Before we begin</div><h1>Let Calib meet the way you make.</h1><div className="form-grid"><div className="field"><label>What should we call you?</label><input value={name} onChange={e=>setName(e.target.value)} autoFocus/></div><div className="field"><label>What do you make?</label><select value={creativeType} onChange={e=>setType(e.target.value)}><option value="">Choose one</option>{Object.keys(MEDIUM).map(x=><option key={x}>{x}</option>)}</select></div><button className="action" disabled={!name.trim()||!creativeType} onClick={()=>setStage('quiz')}><span>Start discovery</span><span>→</span></button></div></div></div>

  if(stage==='quiz'){const cur=quiz[q];return <div className="app quiz"><aside className="quiz-side"><div className="eyebrow">Discovery {q+1}/{quiz.length}</div><div className="progress"><span style={{height:`${((q+1)/quiz.length)*100}%`}}/></div><div className="brand">calib<b>.</b></div></aside><main className="quiz-main"><div className="eyebrow">Choose the one that feels familiar</div><h2>{cur[0]}</h2><p>Not the best answer. The one you have actually lived.</p><div className="options">{cur.slice(1).map((o,i)=><button className="option" key={i} onClick={()=>answer(o)}><span>{o[0]}</span><span>→</span></button>)}</div></main></div>}

  return <div className="app"><main className="reveal"><div className="eyebrow">What your answers kept returning to</div><h1>This may be what has been sitting underneath the work, {name}.</h1><p className="reveal-note">Not a verdict. Just a few places your answers kept touching. The more you use Calib, the clearer the picture can become.</p><div className="pattern-stack">{profile.map((p,i)=><div className={`pattern-tile ${i===0?'primary':''}`} key={p.id}><span>{rankLabel(i)}</span><strong>{p.name}</strong><p className="pattern-truth">{DESC[p.id]}</p></div>)}</div><div className="auth-box"><div><div className="eyebrow">Keep going</div><h3>Your discovery is already saved on this device.</h3><p className="muted">You do not need an account to use Calib. Add an email only when you want to carry this work to another device.</p></div><div className="form-grid"><button className="action" onClick={enter}><span>Enter Calib</span><span>→</span></button><div className="field"><label>Optional email for cloud sync</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/></div>{error&&<div className="notice">{error}</div>}{syncState==='sent'?<div className="notice">Link sent to {email}. You can enter now and connect whenever you are ready.</div>:<button className="action secondary" disabled={!email.includes('@')||syncState==='sending'} onClick={send}>{syncState==='sending'?'Sending…':'Send sync link'}</button>}</div></div></main></div>
}

function Choice({title,subtitle,choices,onPick,eyebrow='One honest choice'}){
  return <div className="decision"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle&&<p className="muted choice-intro">{subtitle}</p>}<div className="choice-grid">{choices.map(([label,value,description])=><button key={label} className="choice" onClick={()=>onPick(value)}><span className="choice-copy"><strong>{label}</strong>{description&&<small>{description}</small>}</span><span>→</span></button>)}</div></div>
}

function Prompt({prompt,value,onChange,onNext,final}){
  return <div className="decision"><div className="eyebrow">Sit with this for a second</div><h1>{prompt}</h1><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder="Write what feels true right now."/><button className="action" style={{marginTop:16}} onClick={onNext}><span>{final?'Finish session':'Keep going'}</span><span>→</span></button></div>
}

function SessionFlow({projects,profile,creativeType,onSave,onExit,onCreateProject}){
  const [step,setStep]=useState('mode')
  const [project,setProject]=useState(null)
  const [phase,setPhase]=useState('')
  const [ao,setAo]=useState('')
  const [energy,setEnergy]=useState(3)
  const [responses,setResponses]=useState({})
  const [newTitle,setNewTitle]=useState('')
  const [newType,setNewType]=useState(creativeType==='Music'?'Track':creativeType==='Beats / Production'?'Track':creativeType==='Visual Art'?'Visual':creativeType==='Film / Video'?'Film':creativeType==='Writing'?'Writing':'Other')
  const [result,setResult]=useState(null)
  const primaryIds=profile.map(p=>p.id)
  const prompts=useMemo(()=>{
    const first=PATTERN_PROMPTS[primaryIds[0]]||'What feels most true about the work before you begin?'
    const second=PATTERN_PROMPTS[primaryIds[1]]||'What is the work asking from you today?'
    return [first,second]
  },[primaryIds.join('-')])

  const finish=()=>{
    const structural=[]
    if(ao==='orphan')structural.push(12)
    if(phase==='Stuck')structural.push(1,4)
    if(energy<=2)structural.push(8,13)
    const keyword=scan(Object.values(responses).join(' '))
    const detected=[...new Set([...structural,...keyword])]
    const session={id:uid(),date:new Date().toISOString(),projectId:project?.id,projectTitle:project?.title||'Open session',phase,ao,energy,answers:responses,detectedPatterns:detected,keywordPatterns:keyword,structuralPatterns:structural}
    onSave(session)
    setResult(session)
    setStep('done')
  }

  if(step==='mode')return <Choice title="What are you here to do?" subtitle="Give the session a home, or leave it open and follow whatever showed up." choices={[
    ['Move a project forward','project','I know what I am working on and want this session to stay connected to it.'],
    ['Just vibe and see what shows up','open','No goal. No pressure. I want to follow the spark.']
  ]} onPick={value=>{if(value==='open'){setProject(null);setStep('phase')}else setStep('project')}}/>

  if(step==='project')return <div className="decision"><div className="eyebrow">Give the session a home</div><h1>What are you moving today?</h1><p className="muted choice-intro">Choose something already in motion, or make a place for something new.</p><div className="choice-grid">{projects.filter(p=>p.status==='active').map(p=><button key={p.id} className="choice" onClick={()=>{setProject(p);setStep('phase')}}><span className="choice-copy"><strong>{p.title}</strong><small>{p.type} · {p.sessions||0} sessions so far</small></span><span>→</span></button>)}<button className="choice" onClick={()=>setStep('new-project')}><span className="choice-copy"><strong>Start a new project</strong><small>Create it here. This session will be attached automatically.</small></span><span>＋</span></button></div><button className="action secondary" style={{marginTop:16}} onClick={()=>setStep('mode')}>← Back</button></div>

  if(step==='new-project')return <div className="decision"><div className="eyebrow">New project</div><h1>Give the work a name.</h1><div className="form-grid"><div className="field"><label>Project title</label><input value={newTitle} onChange={e=>setNewTitle(e.target.value)} autoFocus/></div><div className="field"><label>Type</label><select value={newType} onChange={e=>setNewType(e.target.value)}>{['Track','EP','Album','Visual','Film','Writing','Other'].map(x=><option key={x}>{x}</option>)}</select></div><button className="action" disabled={!newTitle.trim()} onClick={()=>{const created=onCreateProject(newTitle.trim(),newType);if(created){setProject(created);setStep('phase')}}}><span>Create and continue</span><span>→</span></button><button className="action secondary" onClick={()=>setStep('project')}>← Back</button></div></div>

  if(step==='phase')return <Choice title="Where is the work meeting you today?" choices={[
    ['At the beginning','Starting fresh','The spark is here, but the shape is still open.'],
    ['In the middle','Grinding through','You are past the rush of starting and inside the real work.'],
    ['Near the end','Almost done','It is close enough to be seen.'],
    ['At a stop','Stuck','You keep circling it, avoiding it, or not knowing what comes next.']
  ]} onPick={value=>{setPhase(value);setStep('origin')}}/>

  if(step==='origin')return <Choice title="What started the movement today?" subtitle="Neither answer is a permanent identity. This is only who seems to be holding the work today." choices={[
    ['Artist','artist','Something sparked something. You wanted to follow it and see where it went.'],
    ['Orphan','orphan','Part of you wants the work to prove something, protect something, or bring something back.'],
    ['I cannot tell yet','unsure','You are here, but you cannot tell what pulled you in.']
  ]} onPick={value=>{setAo(value);setStep('energy')}}/>

  if(step==='energy')return <Choice title="How much of you made it into the room?" subtitle="There is no good number here. Just name where you are starting." choices={[
    ['1 · Barely here',1,'The work may need gentleness before it needs force.'],
    ['2 · Low, but here',2,'You showed up with less to give, but you still showed up.'],
    ['3 · Enough to begin',3,'Not full. Not empty. There is something to work with.'],
    ['4 · Ready to move',4,'The door feels open.'],
    ['5 · Fully here',5,'You can feel the work pulling back.']
  ]} onPick={value=>{setEnergy(value);setStep('prompt-1')}}/>

  if(step==='prompt-1')return <Prompt prompt={prompts[0]} value={responses.first||''} onChange={value=>setResponses({...responses,first:value})} onNext={()=>setStep('prompt-2')}/>
  if(step==='prompt-2')return <Prompt prompt={prompts[1]} value={responses.second||''} onChange={value=>setResponses({...responses,second:value})} onNext={finish} final/>

  const noticed=(result?.detectedPatterns||[])[0]
  const originRead=result?.ao==='artist'?'The spark led. You followed it before asking the room for permission.':result?.ao==='orphan'?'Some part of you may have been asking the work to prove, protect, or return something. That is worth noticing, not judging.':'You did not force an answer. Sometimes the truth gets clearer after the work starts.'
  return <div className="decision"><div className="eyebrow">Session saved · {result?.projectTitle}</div><h1>Something real is on the record now.</h1><div className="quote">{originRead}</div>{noticed&&<div className="card session-read"><div className="eyebrow">Also showing up</div><h3>{NAMES[noticed]}</h3><p>{DESC[noticed]}</p></div>}<p className="muted" style={{margin:'24px 0'}}>You do not have to solve any of this before you make. Notice it, then return to the work.</p><button className="action" onClick={onExit}><span>Return home</span><span>→</span></button></div>
}

function Guide(){
  const items=[
    ['Artist','Something sparked something. The work itself pulled you in, and you wanted to follow it before asking what anyone else would think.'],
    ['Orphan','The part of you that wants the work to make you safe, seen, chosen, proven, or protected. It is not bad. It is simply asking the work to carry more than the work.'],
    ['Pattern','A familiar move that can quietly take the wheel. It may show up when you stop, hide, rush, compare, overthink, or reach for a response.'],
    ['Project','A home for repeated sessions. Projects let you see what keeps returning around one real piece of work instead of treating every day like a separate story.'],
    ['Open session','A place to just vibe. No project, no goal, no need to know where it is going before you begin.'],
    ['Your profile','A place to start, not a sentence about who you are. Calib keeps listening to what happens in real sessions and lets the picture change.']
  ]
  return <><div className="eyebrow">How Calib talks</div><h1 className="screen-title">A few words you will see here.</h1><p className="guide-lead">Calib is not trying to tell you who you are. It notices what seems to happen around the work, then gives you language for it. Keep what rings true. Let real sessions clarify the rest.</p><div className="grid2 guide-grid">{items.map(([title,text])=><div className="card guide-card" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div><div className="quote">The point is not to become perfect at understanding yourself. The point is to notice what is true soon enough to keep moving.</div></>
}

function Main({user,sessions,projects,setSessions,setProjects,onReset,authUser,onConnect}){
  const [screen,setScreen]=useState('home')
  const [modal,setModal]=useState(false)
  const [title,setTitle]=useState('')
  const [type,setType]=useState('Track')
  const [activePattern,setActivePattern]=useState(null)

  const saveProjects=next=>{setProjects(next);save('calib:projects',next);supabase.auth.getSession().then(({data:{session}})=>session&&next.forEach(p=>supabase.from('projects').upsert({id:p.id,user_id:session.user.id,data:p,updated_at:new Date().toISOString()},{onConflict:'id'})))}
  const createProject=(projectTitle,projectType)=>{if(!projectTitle.trim())return null;const project={id:uid(),title:projectTitle.trim(),type:projectType,status:'active',sessions:0,phase:'starting',created:new Date().toISOString()};saveProjects([...projects,project]);return project}
  const add=()=>{const created=createProject(title,type);if(!created)return;setTitle('');setModal(false)}
  const saveSession=session=>{const next=[...sessions,session];setSessions(next);save('calib:sessions',next);if(session.projectId)saveProjects(projects.map(p=>p.id===session.projectId?{...p,sessions:(p.sessions||0)+1,lastSession:session.date}:p));supabase.auth.getSession().then(({data:{session:authSession}})=>authSession&&supabase.from('sessions').upsert({id:session.id,user_id:authSession.user.id,data:session,created_at:session.date},{onConflict:'id'}))}
  const ranked=user.profile.map((p,index)=>{const occurrences=sessions.filter(s=>s.detectedPatterns?.includes(p.id)).length;return {...p,occurrences,rankWeight:(user.profile.length-index)*10+occurrences*4}}).sort((a,b)=>b.rankWeight-a.rankWeight)
  const top=ranked[0]
  const artistCount=sessions.filter(s=>s.ao==='artist').length
  const nav=[['home','Home'],['session','Session'],['projects','Projects'],['history','History'],['patterns','Patterns'],['guide','Guide']]

  if(screen==='session')return <div className="app"><div className="shell"><header className="topbar"><div className="brand">calib<b>.</b></div><button className="action secondary" onClick={()=>setScreen('home')}>Exit</button></header><SessionFlow projects={projects} profile={user.profile} creativeType={user.creativeType} onSave={saveSession} onExit={()=>setScreen('home')} onCreateProject={createProject}/></div></div>

  return <div className="app"><div className="shell"><header className="topbar"><div className="brand">calib<b>.</b></div><div className="topmeta"><span>{user.name}</span><span className="free">{authUser?'Cloud synced':'Saved on this device'}</span></div></header><div className="layout"><aside className="side"><nav className="nav">{nav.map(([key,label])=><button key={key} className={screen===key?'active':''} onClick={()=>{setScreen(key);setActivePattern(null)}}>{label}</button>)}</nav><div className="side-bottom"><div className="side-note">Calib offers a mirror, not a verdict. Future coaching belongs to human community.</div>{!authUser&&<button className="action secondary sync-button" onClick={onConnect}>Take this to another device</button>}</div></aside><main className="content">

  {screen==='home'&&<><div className="hero"><div className="hero-copy"><div className="eyebrow">Today</div><h1>The work usually knows before you do.</h1><p>Calib helps you notice what keeps showing up around the work—especially the parts that make you stop, hide, rush, compare, or reach for a response.</p><div className="diagram"><span className="node">spark</span><span className="arrow">→</span><span className="node">make</span><span className="arrow">→</span><span className="node hot">notice</span><span className="arrow">→</span><span className="node">return</span></div><button className="action" onClick={()=>setScreen('session')}><span>Start a session</span><span>→</span></button></div><div className="black-panel"><div><div className="panel-caption">Closest to the surface</div><div className="panel-number">{String(top?.id||1).padStart(2,'0')}</div></div><div><h3 className="serif" style={{fontSize:32,fontWeight:400,margin:'0 0 8px'}}>{top?.name}</h3><p style={{color:'#aaa69e',lineHeight:1.55}}>{DESC[top?.id]}</p></div></div></div><div className="stat-row"><div className="stat"><strong>{sessions.length}</strong><span>Sessions kept</span></div><div className="stat"><strong>{sessions.length?`${artistCount} of ${sessions.length}`:'—'}</strong><span>Artist-led</span></div><div className="stat"><strong>{projects.filter(p=>p.status==='active').length}</strong><span>Projects moving</span></div><div className="stat"><strong>{top?.occurrences||'—'}</strong><span>Times this returned</span></div></div><div className="section-head"><h2>Work in motion</h2><button className="action secondary" onClick={()=>setModal(true)}>Add project</button></div><div className="list">{projects.filter(p=>p.status==='active').map((p,i)=><div className="row" key={p.id} onClick={()=>setScreen('projects')}><div className="row-num">{String(i+1).padStart(2,'0')}</div><div><div className="row-title">{p.title}</div><div className="row-meta">{p.type} · {p.phase}</div></div><div className="row-meta">{p.sessions||0} sessions</div></div>)}{!projects.length&&<div className="card"><h3>Nothing has a home yet.</h3><p>Create a project when you know what you are moving. Or start an open session and just follow the spark.</p></div>}</div></>}

  {screen==='projects'&&<><div className="section-head"><div><div className="eyebrow">Give the work somewhere to live</div><h2>Projects</h2></div><button className="action" onClick={()=>setModal(true)}>Add project</button></div><div className="grid2">{projects.map(p=><div className="card" key={p.id}><div className="eyebrow">{p.type} · {p.status}</div><h3>{p.title}</h3><p>{p.sessions||0} sessions have lived here. Current place: {p.phase||'starting'}.</p><div className="button-row"><button className="action secondary" onClick={()=>saveProjects(projects.map(x=>x.id===p.id?{...x,status:x.status==='active'?'completed':'active'}:x))}>{p.status==='active'?'Mark complete':'Bring it back'}</button></div></div>)}</div>{!projects.length&&<div className="card"><h3>No projects yet.</h3><p>A project is just a home for repeated sessions around the same piece of work.</p></div>}</>}

  {screen==='history'&&<><div className="eyebrow">What you have actually lived</div><h1 className="screen-title">Session history.</h1><div className="list">{[...sessions].reverse().map(s=><div className="row" key={s.id}><div className="row-num">{new Date(s.date).toLocaleDateString()}</div><div><div className="row-title">{s.projectTitle}</div><div className="row-meta">{s.phase} · {s.ao} · energy {s.energy}/5</div></div><div className="row-meta">{(s.detectedPatterns||[]).slice(0,2).map(id=>SHORT[id]).join(' · ')||'nothing loud enough to name'}</div></div>)}{!sessions.length&&<div className="card"><h3>No sessions yet.</h3><p>The picture begins when you bring Calib into the room with the work.</p></div>}</div></>}

  {screen==='patterns'&&!activePattern&&<><div className="eyebrow">What can quietly take the wheel</div><h1 className="screen-title">The 15 patterns.</h1><p className="guide-lead">These are not diagnoses and they are not identities. They are familiar ways the work can get tangled with fear, protection, proof, pain, or possibility.</p><div className="list">{Object.entries(NAMES).map(([id,name])=>{const count=sessions.filter(s=>s.detectedPatterns?.includes(+id)).length;return <div className="row" key={id} onClick={()=>setActivePattern(+id)}><div className="row-num">{String(id).padStart(2,'0')}</div><div className="row-title">{name}</div><div className="row-meta">{count?`seen in ${count} session${count===1?'':'s'}`:'not seen in a session yet'}</div></div>})}</div></>}

  {screen==='patterns'&&activePattern&&<div className="pattern-detail"><button className="action secondary" onClick={()=>setActivePattern(null)}>← All patterns</button><div className="eyebrow" style={{marginTop:30}}>Pattern {String(activePattern).padStart(2,'0')}</div><h1>{NAMES[activePattern]}</h1><div className="detail-label">What this can look like</div><p style={{fontSize:18,lineHeight:1.7}}>{DESC[activePattern]}</p><div className="detail-label">What may be truer</div><div className="quote">{REFRAME[activePattern]}</div><div className="black-panel" style={{minHeight:150}}><div className="panel-caption">In your real sessions</div><div className="panel-number">{sessions.filter(s=>s.detectedPatterns?.includes(activePattern)).length||'—'}</div><div className="panel-caption">{sessions.some(s=>s.detectedPatterns?.includes(activePattern))?'times this has returned':'not loud enough to name yet'}</div></div></div>}

  {screen==='guide'&&<Guide/>}

  <button className="action secondary" style={{marginTop:50}} onClick={onReset}>Reset local profile</button>
  </main></div>{modal&&<div className="modal-bg" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>Give the work a home.</h2><div className="form-grid"><div className="field"><label>Project title</label><input value={title} onChange={e=>setTitle(e.target.value)} autoFocus/></div><div className="field"><label>Type</label><select value={type} onChange={e=>setType(e.target.value)}>{['Track','EP','Album','Visual','Film','Writing','Other'].map(x=><option key={x}>{x}</option>)}</select></div></div><div className="button-row"><button className="action secondary" onClick={()=>setModal(false)}>Cancel</button><button className="action" onClick={add}>Create project</button></div></div></div>}</div></div>
}

function SyncModal({onClose}){
  const [email,setEmail]=useState('')
  const [state,setState]=useState('')
  const [error,setError]=useState('')
  const send=async()=>{setState('sending');setError('');const {error:e}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:window.location.origin}});if(e){setError(e.message);setState('')}else setState('sent')}
  return <div className="modal-bg" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><div className="eyebrow">Optional cloud sync</div><h2>Take this work with you.</h2><p className="muted">Your work is already saved in this browser. Add your email only if you want to open the same Calib record on another device.</p><div className="form-grid"><div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoFocus/></div>{error&&<div className="notice">{error}</div>}{state==='sent'?<div className="notice">Link sent. You can keep using Calib while you connect.</div>:<button className="action" disabled={!email.includes('@')||state==='sending'} onClick={send}>{state==='sending'?'Sending…':'Send sync link'}</button>}<button className="action secondary" onClick={onClose}>Close</button></div></div></div>
}

export default function CalibMelius(){
  const [loading,setLoading]=useState(true)
  const [authUser,setAuthUser]=useState(null)
  const [user,setUser]=useState(()=>load('calib:user',null))
  const [sessions,setSessions]=useState(()=>load('calib:sessions',[]))
  const [projects,setProjects]=useState(()=>load('calib:projects',[]))
  const [syncOpen,setSyncOpen]=useState(false)

  useEffect(()=>{let live=true;const hydrate=async session=>{if(!live)return;setAuthUser(session?.user||null);if(!session?.user)return;const id=session.user.id;const pending=load('calib:pending',null);const [{data:p},{data:s},{data:pr}]=await Promise.all([supabase.from('profiles').select('*').eq('id',id).maybeSingle(),supabase.from('sessions').select('*').eq('user_id',id).order('created_at'),supabase.from('projects').select('*').eq('user_id',id)]);const nextUser=p?.data||pending||load('calib:user',null);if(nextUser){setUser(nextUser);save('calib:user',nextUser);await supabase.from('profiles').upsert({id,data:nextUser,updated_at:new Date().toISOString()},{onConflict:'id'})}if(s?.length){const rows=s.map(x=>x.data);setSessions(rows);save('calib:sessions',rows)}if(pr?.length){const rows=pr.map(x=>x.data);setProjects(rows);save('calib:projects',rows)}localStorage.removeItem('calib:pending')};supabase.auth.getSession().then(({data:{session}})=>hydrate(session).finally(()=>setLoading(false)));const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>hydrate(session));return()=>{live=false;subscription.unsubscribe()}},[])
  const ready=async data=>{setUser(data);save('calib:user',data);const {data:{session}}=await supabase.auth.getSession();if(session)await supabase.from('profiles').upsert({id:session.user.id,data,updated_at:new Date().toISOString()},{onConflict:'id'})}
  const reset=()=>{if(!confirm('Reset local Calib data?'))return;['calib:user','calib:sessions','calib:projects','calib:pending'].forEach(k=>localStorage.removeItem(k));setUser(null);setSessions([]);setProjects([])}

  if(loading)return <div className="app" style={{display:'grid',placeItems:'center'}}><div className="brand">calib<b>.</b></div></div>
  if(!user)return <Onboarding onReady={ready}/>
  return <><Main user={user} sessions={sessions} projects={projects} setSessions={setSessions} setProjects={setProjects} onReset={reset} authUser={authUser} onConnect={()=>setSyncOpen(true)}/>{syncOpen&&<SyncModal onClose={()=>setSyncOpen(false)}/>}</>
}
