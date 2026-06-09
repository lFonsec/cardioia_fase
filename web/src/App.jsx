import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, HeartPulse, Thermometer, ShieldAlert } from 'lucide-react';
import './style.css';

//const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function riskClass(risco) {
  return risco === 'Alto' ? 'alto' : risco === 'Moderado' ? 'moderado' : 'baixo';
}

function App() {
  const [logado, setLogado] = useState(false);
  const [email, setEmail] = useState('tutor@cardioia.com');
  const [senha, setSenha] = useState('123456');
  const [dados, setDados] = useState({ temperatura: 36.8, bpm: 82, spo2: 98 });
  const [resultado, setResultado] = useState(null);
  const [leituras, setLeituras] = useState([]);

function analisar(payload = dados) {
  const bpm = payload.bpm;
  const temperatura = payload.temperatura;
  const spo2 = payload.spo2;

  let risco = 'Baixo';
  let probabilidade = 0.12;
  let recomendacao = 'Sinais estáveis. Manter acompanhamento preventivo.';

  if (bpm > 140 || temperatura > 38 || spo2 < 90) {
    risco = 'Alto';
    probabilidade = 0.92;
    recomendacao = 'Risco elevado. Recomenda-se avaliação clínica imediata.';
  } else if (bpm > 110 || temperatura > 37.5 || spo2 < 94) {
    risco = 'Moderado';
    probabilidade = 0.58;
    recomendacao = 'Atenção: sinais alterados. Monitorar o paciente.';
  }

  const saida = {
    entrada: payload,
    saida: {
      risco,
      probabilidade,
      recomendacao,
      timestamp: new Date().toLocaleString('pt-BR')
    },
    risco,
    probabilidade,
    recomendacao
  };

  setResultado(saida);
  setLeituras(prev => [...prev, saida]);
}

  async function carregarLeituras() {
    try {
      const resp = await fetch(`${API_URL}/api/leituras`);
      setLeituras(await resp.json());
    } catch {}
  }

  useEffect(() => { if (logado) analisar(); }, [logado]);

  if (!logado) return <main className="login"><section className="card login-card"><h1>CardioIA</h1><p>Monitoramento cardíaco com IA em tempo real</p><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail"/><input value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" type="password"/><button onClick={()=>setLogado(true)}>Entrar</button></section></main>;

  return <main className="app"><header><div><h1>Dashboard CardioIA</h1><p>Paciente demo • integração Web + Backend + IoT</p></div><button onClick={()=>analisar()}>Atualizar análise</button></header>
    <section className="grid">
      <div className="card metric"><HeartPulse/><span>BPM</span><strong>{dados.bpm}</strong><input type="range" min="50" max="190" value={dados.bpm} onChange={e=>setDados({...dados,bpm:Number(e.target.value)})}/></div>
      <div className="card metric"><Thermometer/><span>Temperatura</span><strong>{dados.temperatura.toFixed(1)}°C</strong><input type="range" min="35" max="41" step="0.1" value={dados.temperatura} onChange={e=>setDados({...dados,temperatura:Number(e.target.value)})}/></div>
      <div className="card metric"><Activity/><span>SpO₂</span><strong>{dados.spo2}%</strong><input type="range" min="85" max="100" value={dados.spo2} onChange={e=>setDados({...dados,spo2:Number(e.target.value)})}/></div>
      <div className={`card resultado ${riskClass(resultado?.risco)}`}><ShieldAlert/><span>Risco</span><strong>{resultado?.risco || 'Analisando'}</strong><p>{resultado?.recomendacao}</p></div>
    </section>
    <section className="card"><h2>Últimas leituras</h2><table><tbody>{leituras.slice().reverse().map((l,i)=><tr key={i}><td>{l.entrada?.bpm} bpm</td><td>{l.entrada?.temperatura}°C</td><td>{l.saida?.risco}</td><td>{l.saida?.timestamp}</td></tr>)}</tbody></table></section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
