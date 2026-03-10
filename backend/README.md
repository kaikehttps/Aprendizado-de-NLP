# ApexVet - Backend

API de transcrição de áudio para prontuário veterinário.

## Como usar

```bash
cd backend
pip install -r requirements.txt
python backend.py
```

A API ficará em **http://127.0.0.1:8000**

## Arquivos

| Arquivo | Função |
|---------|--------|
| `backend.py` | API FastAPI, carrega Whisper + PTT5, endpoint `/transcrever` |
| `extracao.py` | Extrai dados do texto: nome do pet, peso, serviços, parasitas, lesões |
| `requirements.txt` | Dependências Python |

## Endpoint

**POST /transcrever**

- Envia: arquivo de áudio (form-data, campo `file`)
- Formatos: webm, mp3, wav
- Retorna: JSON com transcrição + dados extraídos

### Exemplo de resposta

```json
{
  "transcription": "Bom dia, o nome dele é Bidu. Ele veio para banho padrão e tosa bebê...",
  "petName": "Bidu",
  "species": "canino",
  "weight": "8",
  "tutorName": "",
  "tutorCPF": "123.456.789-00",
  "bathServices": { "padrao": true, "hidratacao": false, "selagem": false },
  "groomingServices": { "tosaBebe": true, ... },
  "parasites": { "pulgas": false, "carrapatos": false },
  "lesions": { "secrecao": true, "ouvido": true, ... },
  "analysisNotes": "Resumo gerado pelo PTT5"
}
```

## Palavras-chave que a extração reconhece

- **Peso**: "pesa 8kg", "8 kg", "peso de 10"
- **Banho**: "banho padrão", "hidratação", "selagem"
- **Tosa**: "tosa bebê", "tosa da raça", "máquina", "tesoura", "higienica", "desembolo"
- **Parasitas**: "pulgas", "carrapatos"
- **Lesões**: "secreção", "ouvido", "olho", "pele"
