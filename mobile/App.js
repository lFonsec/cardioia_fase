import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';


export default function App() {
  const [logado, setLogado] = useState(false);
  const [bpm, setBpm] = useState('88');
  const [temperatura, setTemperatura] = useState('36.8');
  const [spo2, setSpo2] = useState('98');
  const [resultado, setResultado] = useState(null);

function analisar() {
  const bpmNum = Number(bpm);
  const tempNum = Number(temperatura);
  const spo2Num = Number(spo2);

  let risco = 'Baixo';
  let probabilidade = 0.12;
  let recomendacao = 'Sinais estáveis. Manter acompanhamento preventivo.';

  if (bpmNum > 140 || tempNum > 38 || spo2Num < 90) {
    risco = 'Alto';
    probabilidade = 0.92;
    recomendacao = 'Risco elevado. Recomenda-se avaliação clínica imediata.';
  } else if (bpmNum > 110 || tempNum > 37.5 || spo2Num < 94) {
    risco = 'Moderado';
    probabilidade = 0.58;
    recomendacao = 'Atenção: sinais alterados. Monitorar o paciente.';
  }

  setResultado({
    risco,
    probabilidade,
    recomendacao
  });
}

  if (!logado) return <SafeAreaView style={s.container}><View style={s.card}>
    <Text style={s.title}>CardioIA</Text><TextInput style={s.input} placeholder="E-mail" value="tutor@cardioia.com"/>
    <TextInput style={s.input} placeholder="Senha" secureTextEntry value="123456"/><Pressable style={s.btn} onPress={()=>setLogado(true)}>
    <Text style={s.btnText}>Entrar</Text></Pressable></View></SafeAreaView>;

  return <SafeAreaView style={s.container}><ScrollView>
    <Text style={s.title}>Dashboard CardioIA</Text>
    <View style={s.card}><Text>BPM</Text>
    <TextInput style={s.input} value={bpm} onChangeText={setBpm} keyboardType="numeric"/><Text>Temperatura</Text>
    <TextInput style={s.input} value={temperatura} onChangeText={setTemperatura} keyboardType="numeric"/><Text>SpO₂</Text>
    <TextInput style={s.input} value={spo2} onChangeText={setSpo2} keyboardType="numeric"/><Pressable style={s.btn} onPress={analisar}><Text style={s.btnText}>Analisar sinais</Text></Pressable></View>{resultado && <View style={[s.card, s.result]}>
    <Text style={s.risk}>Risco: {resultado.risco}</Text><Text>{resultado.recomendacao}</Text></View>}</ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({container:{flex:1,backgroundColor:'#eef4f8',padding:20,justifyContent:'center'},
  card:{backgroundColor:'#fff',padding:22,borderRadius:18,marginBottom:16},title:{fontSize:30,fontWeight:'bold',color:'#14213d',marginBottom:20},
  input:{borderWidth:1,borderColor:'#cbd5e1',borderRadius:12,padding:12,marginVertical:8},btn:{backgroundColor:'#dc2626',padding:14,borderRadius:12,alignItems:'center',marginTop:8},
  btnText:{color:'#fff',fontWeight:'bold'},risk:{fontSize:24,fontWeight:'bold'},result:{borderLeftWidth:8,borderLeftColor:'#dc2626'}});
