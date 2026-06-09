import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';

const API_URL = 'https://SEU-BACKEND.onrender.com';

export default function App() {
  const [logado, setLogado] = useState(false);
  const [bpm, setBpm] = useState('88');
  const [temperatura, setTemperatura] = useState('36.8');
  const [spo2, setSpo2] = useState('98');
  const [resultado, setResultado] = useState(null);

  async function analisar() {
    try {
      const r = await fetch(`${API_URL}/api/sinais`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({patient_id:'paciente-mobile', bpm:Number(bpm), temperatura:Number(temperatura), spo2:Number(spo2), origem:'mobile'}) });
      setResultado(await r.json());
    } catch { setResultado({risco:'Offline', recomendacao:'Configure o API_URL do backend publicado.'}); }
  }

  if (!logado) return <SafeAreaView style={s.container}><View style={s.card}><Text style={s.title}>CardioIA</Text><TextInput style={s.input} placeholder="E-mail" value="tutor@cardioia.com"/><TextInput style={s.input} placeholder="Senha" secureTextEntry value="123456"/><Pressable style={s.btn} onPress={()=>setLogado(true)}><Text style={s.btnText}>Entrar</Text></Pressable></View></SafeAreaView>;

  return <SafeAreaView style={s.container}><ScrollView><Text style={s.title}>Dashboard CardioIA</Text><View style={s.card}><Text>BPM</Text><TextInput style={s.input} value={bpm} onChangeText={setBpm} keyboardType="numeric"/><Text>Temperatura</Text><TextInput style={s.input} value={temperatura} onChangeText={setTemperatura} keyboardType="numeric"/><Text>SpO₂</Text><TextInput style={s.input} value={spo2} onChangeText={setSpo2} keyboardType="numeric"/><Pressable style={s.btn} onPress={analisar}><Text style={s.btnText}>Analisar sinais</Text></Pressable></View>{resultado && <View style={[s.card, s.result]}><Text style={s.risk}>Risco: {resultado.risco}</Text><Text>{resultado.recomendacao}</Text></View>}</ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({container:{flex:1,backgroundColor:'#eef4f8',padding:20,justifyContent:'center'},card:{backgroundColor:'#fff',padding:22,borderRadius:18,marginBottom:16},title:{fontSize:30,fontWeight:'bold',color:'#14213d',marginBottom:20},input:{borderWidth:1,borderColor:'#cbd5e1',borderRadius:12,padding:12,marginVertical:8},btn:{backgroundColor:'#dc2626',padding:14,borderRadius:12,alignItems:'center',marginTop:8},btnText:{color:'#fff',fontWeight:'bold'},risk:{fontSize:24,fontWeight:'bold'},result:{borderLeftWidth:8,borderLeftColor:'#dc2626'}});
