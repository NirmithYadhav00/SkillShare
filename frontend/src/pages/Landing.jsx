import { useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
:root{
  --bg:#fff;--surface:#f8f7f4;--surface2:#f0ede6;
  --a1:#0056d2;--a2:#1a73e8;--a3:#e8f0fe;
  --txt:#1f1f1f;--txt2:#5f5f5f;--txt3:#9e9e9e;
  --bdr:rgba(0,0,0,0.10);--bdr2:rgba(0,86,210,0.18);
  --r:14px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
.bl{font-family:'Inter',sans-serif;background:var(--bg);color:var(--txt);overflow-x:hidden;line-height:1.6;}
@keyframes blUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes blPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,86,210,.5)}50%{box-shadow:0 0 0 6px rgba(0,86,210,0)}}

.bl-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 5%;height:64px;background:rgba(255,255,255,.94);backdrop-filter:blur(18px);border-bottom:1px solid var(--bdr);transition:box-shadow .3s;}
.bl-nav.sc{box-shadow:0 2px 16px rgba(0,0,0,.08);}
.bl-logo{display:flex;align-items:center;gap:9px;font-family:'Source Serif 4',serif;font-weight:700;font-size:1.3rem;color:var(--txt);text-decoration:none;letter-spacing:-.01em;}
.bl-logo-icon{width:32px;height:32px;border-radius:8px;background:var(--a1);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,86,210,.3);}
.bl-ghost{padding:7px 18px;border-radius:8px;font-weight:600;font-size:.88rem;color:var(--txt2);background:transparent;border:1.5px solid var(--bdr);cursor:pointer;text-decoration:none;transition:all .2s;}
.bl-ghost:hover{color:var(--a1);border-color:var(--bdr2);background:var(--a3);}
.bl-cta{padding:8px 20px;border-radius:8px;font-weight:700;font-size:.88rem;color:#fff;background:var(--a1);border:none;cursor:pointer;text-decoration:none;box-shadow:0 3px 12px rgba(0,86,210,.3);transition:all .2s;}
.bl-cta:hover{background:var(--a2);transform:translateY(-1px);box-shadow:0 5px 18px rgba(0,86,210,.4);}

.bl-hero{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;padding:90px 5% 80px;overflow:hidden;background:linear-gradient(160deg,#f0f4ff 0%,#fff 55%,#fff8f0 100%);}
.bl-hero::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(0,86,210,.06),transparent 70%);top:-160px;left:-120px;pointer-events:none;}
.bl-badge{position:relative;z-index:1;display:inline-flex;align-items:center;gap:7px;padding:5px 14px 5px 9px;background:var(--a3);border:1px solid var(--bdr2);border-radius:999px;font-size:.75rem;font-weight:600;color:var(--a1);margin-bottom:24px;animation:blUp .6s ease both;}
.bl-badge-dot{width:7px;height:7px;border-radius:50%;background:var(--a1);animation:blPulse 2s ease infinite;}
.bl-h1{position:relative;z-index:1;font-family:'Source Serif 4',serif;font-weight:700;font-size:clamp(2.6rem,6vw,4.8rem);letter-spacing:-.03em;line-height:1.08;color:var(--txt);margin-bottom:20px;animation:blUp .7s .1s ease both;}
.bl-h1 .hl{color:var(--a1);}
.bl-sub{position:relative;z-index:1;font-size:clamp(.95rem,1.8vw,1.15rem);color:var(--txt2);max-width:500px;margin-bottom:36px;font-weight:400;line-height:1.65;animation:blUp .7s .2s ease both;}
.bl-btns{position:relative;z-index:1;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;animation:blUp .7s .3s ease both;}
.bl-btn-main{padding:13px 30px;border-radius:10px;font-weight:700;font-size:.95rem;color:#fff;background:var(--a1);border:none;cursor:pointer;text-decoration:none;box-shadow:0 5px 20px rgba(0,86,210,.32);transition:all .22s;display:inline-flex;align-items:center;gap:7px;}
.bl-btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,86,210,.42);}
.bl-btn-sec{padding:12px 26px;border-radius:10px;font-weight:600;font-size:.95rem;color:var(--txt2);background:#fff;border:1.5px solid var(--bdr);cursor:pointer;text-decoration:none;transition:all .22s;}
.bl-btn-sec:hover{color:var(--a1);border-color:var(--bdr2);background:var(--a3);}

.bl-mock-wrap{position:relative;z-index:1;margin-top:60px;width:100%;max-width:780px;animation:blUp .8s .4s ease both;}
.bl-mock{background:#fff;border-radius:18px;border:1px solid var(--bdr);box-shadow:0 20px 60px rgba(0,0,0,.1),0 2px 8px rgba(0,0,0,.05);overflow:hidden;}
.bl-mock-bar{display:flex;align-items:center;gap:6px;padding:12px 16px;border-bottom:1px solid var(--bdr);background:var(--surface);}
.dot-r{width:10px;height:10px;border-radius:50%;background:#ff5f57;}
.dot-y{width:10px;height:10px;border-radius:50%;background:#febc2e;}
.dot-g{width:10px;height:10px;border-radius:50%;background:#27c93f;}
.bl-mock-ttl{margin-left:8px;font-size:.75rem;font-weight:600;color:var(--txt3);}
.bl-mock-body{display:grid;grid-template-columns:210px 1fr;height:340px;}
.bl-sidebar{border-right:1px solid var(--bdr);padding:14px 10px;background:var(--surface);display:flex;flex-direction:column;gap:3px;}
.bl-sb-lbl{font-size:.62rem;font-weight:700;color:var(--txt3);letter-spacing:.08em;text-transform:uppercase;padding:3px 8px 7px;}
.bl-user{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:9px;cursor:pointer;transition:background .15s;}
.bl-user:hover{background:var(--surface2);}
.bl-user.on{background:var(--a3);}
.bl-av{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:#fff;flex-shrink:0;position:relative;}
.bl-odot{position:absolute;bottom:1px;right:1px;width:7px;height:7px;border-radius:50%;background:#22c55e;border:2px solid var(--surface);}
.bl-uname{font-size:.75rem;font-weight:600;color:var(--txt);}
.bl-ulast{font-size:.67rem;color:var(--txt3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.bl-chat{display:flex;flex-direction:column;padding:14px;gap:10px;overflow:hidden;}
.bl-chat-hdr{display:flex;align-items:center;gap:8px;padding-bottom:11px;border-bottom:1px solid var(--bdr);}
.bl-chat-name{font-size:.82rem;font-weight:700;}
.bl-chat-st{font-size:.67rem;color:#22c55e;font-weight:600;}
.bl-msgs{flex:1;display:flex;flex-direction:column;gap:9px;overflow:hidden;}
.bl-msg{display:flex;gap:7px;align-items:flex-end;}
.bl-msg.me{flex-direction:row-reverse;}
.bl-mav{width:22px;height:22px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.55rem;font-weight:700;color:#fff;}
.bl-bbl{max-width:72%;padding:7px 12px;font-size:.75rem;line-height:1.5;font-weight:500;}
.bl-bbl.them{background:var(--surface);color:var(--txt);border-radius:12px 12px 12px 3px;}
.bl-bbl.mine{background:var(--a1);color:#fff;border-radius:12px 12px 3px 12px;}
.bl-inp{display:flex;gap:7px;align-items:center;padding:9px 12px;background:var(--surface);border-radius:10px;border:1px solid var(--bdr);margin-top:6px;}
.bl-inp-ph{flex:1;font-size:.72rem;color:var(--txt3);}
.bl-inp-send{width:26px;height:26px;border-radius:7px;background:var(--a1);display:flex;align-items:center;justify-content:center;}

.bl-sec{padding:80px 5%;position:relative;z-index:1;}
.bl-lbl{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--a1);margin-bottom:12px;}
.bl-hd{font-family:'Source Serif 4',serif;font-weight:700;font-size:clamp(1.8rem,3.5vw,2.6rem);letter-spacing:-.03em;line-height:1.18;color:var(--txt);margin-bottom:12px;}
.bl-st{font-size:1rem;color:var(--txt2);max-width:480px;font-weight:400;line-height:1.65;}
.bl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:48px;}
.bl-card{background:#fff;border:1px solid var(--bdr);border-radius:var(--r);padding:28px 24px;transition:all .25s;position:relative;overflow:hidden;}
.bl-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--a1);opacity:0;transition:opacity .25s;}
.bl-card:hover{transform:translateY(-4px);box-shadow:0 10px 36px rgba(0,0,0,.1);border-color:var(--bdr2);}
.bl-card:hover::after{opacity:1;}
.bl-ci{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:18px;font-size:1.3rem;background:var(--a3);border:1px solid var(--bdr2);}
.bl-ct{font-family:'Source Serif 4',serif;font-weight:600;font-size:1.05rem;margin-bottom:8px;color:var(--txt);}
.bl-cd{font-size:.88rem;color:var(--txt2);line-height:1.65;}

.bl-how{background:var(--surface);border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);}
.bl-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:28px;margin-top:48px;position:relative;}
.bl-steps::before{content:'';position:absolute;top:26px;left:0;right:0;height:1px;background:repeating-linear-gradient(90deg,var(--bdr2) 0,var(--bdr2) 8px,transparent 8px,transparent 18px);z-index:0;}
.bl-step{position:relative;z-index:1;display:flex;flex-direction:column;}
.bl-sn{width:52px;height:52px;border-radius:50%;background:var(--a1);color:#fff;font-family:'Source Serif 4',serif;font-weight:700;font-size:1.2rem;display:flex;align-items:center;justify-content:center;margin-bottom:18px;box-shadow:0 4px 16px rgba(0,86,210,.3);border:3px solid var(--surface);}
.bl-stitle{font-family:'Source Serif 4',serif;font-weight:600;font-size:1rem;margin-bottom:7px;color:var(--txt);}
.bl-sdesc{font-size:.87rem;color:var(--txt2);line-height:1.65;}

.bl-cta-sec{display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;overflow:hidden;}
.bl-cta-sec::before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,var(--a3),rgba(232,240,254,.4));border-radius:20px;border:1px solid var(--bdr2);}
.bl-cta-in{position:relative;z-index:1;max-width:560px;}
.bl-cta-h2{font-family:'Source Serif 4',serif;font-weight:700;font-size:clamp(1.9rem,3.5vw,2.6rem);letter-spacing:-.03em;line-height:1.15;margin-bottom:14px;color:var(--txt);}
.bl-cta-h2 .hl{color:var(--a1);}
.bl-cta-p{font-size:1rem;color:var(--txt2);margin-bottom:32px;}
.bl-cta-avs{display:flex;align-items:center;gap:10px;margin-top:24px;justify-content:center;}
.bl-avrow{display:flex;}
.bl-ca{width:30px;height:30px;border-radius:50%;border:2px solid #fff;margin-left:-7px;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;color:#fff;}
.bl-ca:first-child{margin-left:0;}
.bl-cnt{font-size:.82rem;color:var(--txt2);font-weight:600;}
.bl-cnt span{color:var(--a1);}

.bl-footer{padding:40px 5%;border-top:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:18px;z-index:1;}
.bl-fl{font-family:'Source Serif 4',serif;font-weight:700;font-size:1.05rem;color:var(--txt);display:flex;align-items:center;gap:8px;text-decoration:none;}
.bl-fl-icon{width:26px;height:26px;border-radius:6px;background:var(--a1);display:flex;align-items:center;justify-content:center;}
.bl-flinks{display:flex;gap:24px;flex-wrap:wrap;}
.bl-flinks a{font-size:.85rem;font-weight:500;color:var(--txt3);text-decoration:none;transition:color .2s;}
.bl-flinks a:hover{color:var(--a1);}
.bl-fcopy{font-size:.8rem;color:var(--txt3);}

@media(max-width:700px){
  .bl-mock-body{grid-template-columns:1fr;}
  .bl-sidebar{display:none;}
  .bl-steps::before{display:none;}
  .bl-footer{flex-direction:column;align-items:flex-start;}
}
`;

const USERS = [
  {i:"AM",g:"linear-gradient(135deg,#0056d2,#1a73e8)",n:"Alex M.",l:"Great idea! Let's try it.",o:true,a:true},
  {i:"SR",g:"linear-gradient(135deg,#e8505b,#f97316)",n:"Sara R.",l:"Sent you the doc 📎",o:true,a:false},
  {i:"JK",g:"linear-gradient(135deg,#059669,#0891b2)",n:"James K.",l:"How does it work?",o:false,a:false},
  {i:"PL",g:"linear-gradient(135deg,#7c3aed,#a78bfa)",n:"Priya L.",l:"Thanks for sharing!",o:true,a:false},
];
const MSGS = [
  {f:"AM",g:"linear-gradient(135deg,#0056d2,#1a73e8)",t:"Hey! Have you tried the new knowledge sharing feature?",me:false},
  {f:"ME",g:"linear-gradient(135deg,#e8505b,#f97316)",t:"Yes! It's super smooth. Love how it works ",me:true},
  {f:"AM",g:"linear-gradient(135deg,#0056d2,#1a73e8)",t:"Agreed — the real-time sync is instant!",me:false},
  {f:"ME",g:"linear-gradient(135deg,#e8505b,#f97316)",t:"Let's set up a session with the whole team 💡",me:true},
];
const FEATS = [
  {e:"⚡",t:"Real-Time Messaging",d:"Instant message delivery with zero lag. See replies appear live with typing indicators."},
  {e:"🟢",t:"Online Presence",d:"Always know who's available. Real-time status lets you reach the right people instantly."},
  {e:"✨",t:"Intuitive Interface",d:"A clean, distraction-free chat UI so you can focus on ideas, not the tool itself."},
  {e:"🔒",t:"Secure Conversations",d:"All messages are encrypted in transit. Your conversations are private and protected."},
];
const STEPS = [
  {n:"1",t:"Create your account",d:"Sign up in seconds with just your email. No credit card, no friction — instant access."},
  {n:"2",t:"Find & connect",d:"Browse users, explore skills, and connect with people who share your interests."},
  {n:"3",t:"Start chatting",d:"Jump into real-time conversations. Share knowledge and build meaningful connections."},
];
const AVTS = [
  {g:"linear-gradient(135deg,#0056d2,#1a73e8)",l:"AM"},
  {g:"linear-gradient(135deg,#e8505b,#f97316)",l:"SR"},
  {g:"linear-gradient(135deg,#059669,#0891b2)",l:"JK"},
  {g:"linear-gradient(135deg,#7c3aed,#a78bfa)",l:"PL"},
  {g:"linear-gradient(135deg,#f59e0b,#ef4444)",l:"+"},
];

const Logo = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#fff"/>
  </svg>
);
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const Send = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="#fff"/>
  </svg>
);

export default function BrainLink() {
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle("sc", window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".bl-card,.bl-step,.bl-mock-wrap");
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e, i) => {
        if (e.isIntersecting) { e.target.style.animation = `blUp .55s ${i*.08}s ease both`; io.unobserve(e.target); }
      }), { threshold: 0.12 });
    els.forEach(el => { el.style.opacity="0"; io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="bl">

        <nav className="bl-nav" ref={navRef}>
          <a href="/" className="bl-logo">
            <div className="bl-logo-icon"><Logo /></div>
            Brain Link
          </a>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <a href="/login"    className="bl-ghost">Login</a>
            <a href="/Signup" className="bl-cta">Sign Up</a>
          </div>
        </nav>

        <section className="bl-hero">
          <h1 className="bl-h1">Connect. Learn. <span className="hl">Share.</span></h1>
          <p className="bl-sub">Chat in real-time, exchange ideas, and grow together — all in one beautifully simple platform.</p>
          <div className="bl-btns">
            <a href="/Signup" className="bl-btn-main">Get Started Free <Arrow/></a>
            <a href="/login"    className="bl-btn-sec">Sign In</a>
          </div>

          <div className="bl-mock-wrap">
            <div className="bl-mock">
              <div className="bl-mock-bar">
                <span className="dot-r"/><span className="dot-y"/><span className="dot-g"/>
                <span className="bl-mock-ttl">Brain Link — Conversations</span>
              </div>
              <div className="bl-mock-body">
                <div className="bl-sidebar">
                  <div className="bl-sb-lbl">Recent Chats</div>
                  {USERS.map(u => (
                    <div key={u.i} className={`bl-user${u.a?" on":""}`}>
                      <div className="bl-av" style={{background:u.g}}>
                        {u.i}{u.o && <span className="bl-odot"/>}
                      </div>
                      <div style={{minWidth:0}}>
                        <div className="bl-uname">{u.n}</div>
                        <div className="bl-ulast">{u.l}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bl-chat">
                  <div className="bl-chat-hdr">
                    <div className="bl-av" style={{background:"linear-gradient(135deg,#0056d2,#1a73e8)",width:26,height:26,fontSize:".6rem"}}>AM</div>
                    <div><div className="bl-chat-name">Alex M.</div><div className="bl-chat-st">● Online</div></div>
                  </div>
                  <div className="bl-msgs">
                    {MSGS.map((m,i) => (
                      <div key={i} className={`bl-msg${m.me?" me":""}`}>
                        <div className="bl-mav" style={{background:m.g}}>{m.f}</div>
                        <div className={`bl-bbl ${m.me?"mine":"them"}`}>{m.t}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bl-inp">
                    <span className="bl-inp-ph">Type a message…</span>
                    <div className="bl-inp-send"><Send/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bl-sec" id="features">
          <span className="bl-lbl">Why Brain Link</span>
          <h2 className="bl-hd">Everything you need to<br/>communicate &amp; grow</h2>
          <p className="bl-st">Built for teams, learners, and creators — all in a simple, focused chat experience.</p>
          <div className="bl-grid">
            {FEATS.map(f => (
              <div key={f.t} className="bl-card">
                <div className="bl-ci">{f.e}</div>
                <div className="bl-ct">{f.t}</div>
                <p className="bl-cd">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bl-sec bl-how" id="how-it-works">
          <span className="bl-lbl">How It Works</span>
          <h2 className="bl-hd">Up and running in<br/>three simple steps</h2>
          <p className="bl-st">From sign-up to your first conversation in under a minute.</p>
          <div className="bl-steps">
            {STEPS.map(s => (
              <div key={s.n} className="bl-step">
                <div className="bl-sn">{s.n}</div>
                <div className="bl-stitle">{s.t}</div>
                <p className="bl-sdesc">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bl-sec bl-cta-sec">
          <div className="bl-cta-in">
            <h2 className="bl-cta-h2">Start your journey with<br/><span className="hl">Brain Link</span> today</h2>
            <p className="bl-cta-p">Join thousands of learners and experts already connecting, sharing, and growing together.</p>
            <a href="/Signup" className="bl-btn-main">Join Now — It&apos;s Free <Arrow/></a>
            <div className="bl-cta-avs">
              <div className="bl-avrow">
                {AVTS.map(a => <div key={a.l} className="bl-ca" style={{background:a.g}}>{a.l}</div>)}
              </div>
              <div className="bl-cnt"><span>2,400+</span> people already onboard</div>
            </div>
          </div>
        </section>

        <footer className="bl-footer">
          <a href="/" className="bl-fl">
            <div className="bl-fl-icon"><Logo size={14}/></div>
            Brain Link
          </a>
          <div className="bl-flinks">
            {[["#features","Features"],["#how-it-works","How it works"],["/login","Login"],["/Signup","Sign Up"],["#","Privacy"],["#","Terms"]].map(([h,l]) =>
              <a key={l} href={h}>{l}</a>
            )}
          </div>
          <div className="bl-fcopy">© 2026 Brain Link. All rights reserved.</div>
        </footer>

      </div>
    </>
  );
}