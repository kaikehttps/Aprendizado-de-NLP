"""
KRONOS - API de transcrição
============================
Uso: python backend.py
API: http://127.0.0.1:8000
Endpoint: POST /transcrever (envie arquivo de áudio no campo "file")
"""

import os           # caminhos de arquivo, PATH
import subprocess   # rodar ffmpeg para converter áudio
import tempfile     # pasta temporária para o áudio
import uvicorn      # servidor HTTP da API
from fastapi import FastAPI, UploadFile, File
from starlette.middleware.cors import CORSMiddleware

# Local: aumenta limite de upload para ~10MB (2–5 min de áudio)
# Só funciona em Starlette < 0.44; em versões novas use: pip install "starlette>=0.38"
try:
    from starlette.formparsers import MultiPartParser
    MultiPartParser.max_part_size = 10 * 1024 * 1024  # 10MB
except Exception:
    pass
from fastapi.responses import JSONResponse 
from transformers import pipeline #biblioteca
import torch

from static_ffmpeg import add_paths
from extracao import extrair

add_paths()
os.environ["PATH"] += os.path.dirname(os.path.realpath(__file__))

# --- API ---
app = FastAPI(title="Kronos API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

device = "cuda:0" if torch.cuda.is_available() else "cpu"

# --- Modelo Whisper (transformer áudio em texto) ---
print("⏳ Carregando...")
transcritor = pipeline(
    "automatic-speech-recognition",
    model="franciscombaa/whisper-small-pt",
    device=device,
    generate_kwargs={"language": "<|pt|>", "task": "transcribe"},
)
print("✅ Pronto!")


def converter_wav(entrada: str, saida: str) -> None:
    """Converte webm/mp3 para WAV 16kHz (Whisper precisa disso)."""
    subprocess.run(
        ["ffmpeg", "-y", "-i", entrada, "-acodec", "pcm_s16le", "-ac", "1", "-ar", "16000", saida],
        capture_output=True,
        check=True,
    )


@app.post("/transcrever")
async def transcrever(file: UploadFile = File(...)):
    """Recebe áudio, transcreve e extrai dados para o prontuário."""
    try:
        with tempfile.TemporaryDirectory() as tmp:
            fn = file.filename or "audio.webm"
            ext = os.path.splitext(fn)[1].lower() or ".webm"
            if ext not in (".webm", ".m4a", ".mp4", ".mp3", ".wav", ".ogg"):
                ext = ".webm"
            path_in = os.path.join(tmp, f"audio{ext}")
            path_wav = os.path.join(tmp, "audio.wav")

            with open(path_in, "wb") as f:
                f.write(await file.read())

            converter_wav(path_in, path_wav)
            resultado = transcritor(path_wav, return_timestamps=True)
            texto = resultado.get("text", "")

            dados = extrair(texto)
            return JSONResponse(dados)

    except subprocess.CalledProcessError as e:
        return JSONResponse({"erro": "Erro ao converter áudio. Verifique se o ffmpeg está instalado."}, status_code=500)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse({"erro": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
