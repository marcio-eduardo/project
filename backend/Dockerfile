# FROM python:3.10-slim

# WORKDIR /app

# COPY requirements.txt requirements.txt

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# CMD ["python", "app.py"]


# Usa a imagem base leve do Python
FROM python:3.10-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências para o contêiner
COPY requirements.txt .

# Instala as dependências com pip
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código do projeto para o contêiner
COPY . .

# Expõe a porta usada pelo Flask (5000 por padrão)
EXPOSE 5000

# # Define a variável de ambiente para o Flask
# ENV FLASK_RUN_HOST=0.0.0.0

# Comando para iniciar o aplicativo
CMD ["python", "app.py"]
