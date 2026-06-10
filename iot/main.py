from machine import Pin, ADC
import dht
import time
try:
    import urequests as requests
except ImportError:
    requests = None

DHT_PIN = 15
POT_PIN = 34
LED_VERDE = Pin(25, Pin.OUT)
LED_AMARELO = Pin(26, Pin.OUT)
LED_VERMELHO = Pin(27, Pin.OUT)

sensor = dht.DHT22(Pin(DHT_PIN))
pot = ADC(Pin(POT_PIN))
pot.atten(ADC.ATTN_11DB)

BACKEND_URL = "https://cardioia-fase.onrender.com"

def mapear_bpm(valor_adc):
    return int(50 + (valor_adc / 4095) * 140)

def feedback_visual(risco):
    LED_VERDE.off(); LED_AMARELO.off(); LED_VERMELHO.off()
    if risco == "Alto":
        LED_VERMELHO.on()
    elif risco == "Moderado":
        LED_AMARELO.on()
    else:
        LED_VERDE.on()

def classificar_local(temp, bpm):
    if bpm > 140 or temp > 38:
        return "Alto"
    if bpm > 110 or temp > 37.2:
        return "Moderado"
    return "Baixo"

while True:
    try:
        sensor.measure()
        temperatura = sensor.temperature()
        bpm = mapear_bpm(pot.read())
        risco_local = classificar_local(temperatura, bpm)
        feedback_visual(risco_local)

        payload = {
            "patient_id": "paciente-wokwi",
            "temperatura": temperatura,
            "bpm": bpm,
            "spo2": 98,
            "origem": "esp32-micropython"
        }
        print("Leitura:", payload, "Risco local:", risco_local)

        if requests:
            try:
                r = requests.post(BACKEND_URL, json=payload)
                print("Backend:", r.text)
                r.close()
            except Exception as e:
                print("Sem envio HTTP:", e)

    except Exception as erro:
        print("Erro de leitura:", erro)

    time.sleep(5)
