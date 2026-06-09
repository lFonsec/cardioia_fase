# CardioIA - Fase Final

## Links da entrega
- URL pública Vercel: `INSERIR_URL_DA_VERCEL`
- Link do APK no Expo/EAS: `INSERIR_LINK_DO_BUILD`
- Link Wokwi MicroPython: `INSERIR_LINK_WOKWI`
- Vídeo demonstrativo: `INSERIR_LINK_VIDEO`

## Estrutura
```text
web/       React + Vite publicado na Vercel
mobile/    React Native + Expo, build APK por EAS
backend/   FastAPI integrando UI, modelos preditivos e recomendações
IoT/       MicroPython para ESP32/Wokwi
```

## Deploy Web - Vercel
1. Subir o projeto para GitHub privado.
2. Importar o repositório na Vercel.
3. Configurar o projeto Web com framework Vite.
4. Garantir o arquivo `web/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
5. A cada push no GitHub, a Vercel executará o deploy automático.

## Build Mobile - APK via EAS
Dentro da pasta `mobile`:
```bash
npm install -g eas-cli
npm install
npx eas login
npx eas build:configure
npx eas build -p android --profile preview
```

Arquivos obrigatórios:
- `app.json` com `android.package`: `br.com.cardioia.app`
- `eas.json` com `preview.android.buildType = apk`

## Backend Integrador
Dentro da pasta `backend`:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Endpoint principal:
```http
POST /api/sinais
```

Exemplo:
```json
{
  "patient_id": "paciente-demo",
  "temperatura": 38.5,
  "bpm": 145,
  "spo2": 91,
  "origem": "micropython"
}
```

## UX dos indicadores de risco
- Verde: baixo risco, indicadores estáveis.
- Amarelo: risco moderado, exige monitoramento.
- Vermelho: alto risco, recomenda avaliação clínica imediata.
- Tela inicial deve priorizar: BPM, temperatura, SpO2, nível de risco e recomendação.

## Validação
- Testar login.
- Visualizar leituras cardíacas.
- Testar rota direta da SPA, exemplo `/dashboard`.
- Instalar APK em dispositivo Android real.
- Simular sinal no Wokwi e verificar atualização no backend/UI.
