# Usamos uma imagem oficial do Python (versão slim para ser leve)
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala dependências do sistema que bibliotecas de IA ou áudio podem precisar
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de dependências do Python
COPY requirements.txt .

# Instala as bibliotecas (FastAPI, suparbaseCliente, etc.)
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código do seu backend para o container
COPY . .

# Expõe a porta que o FastAPI usa por padrão
EXPOSE 8000

# Comando para rodar o servidor Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]