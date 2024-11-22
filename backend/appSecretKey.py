import secrets
from dotenv import load_dotenv
import os

# Gera a chave secreta e a salva no arquivo `.env` (se ainda não estiver configurada)
def generate_secret_key():
    # Nome do arquivo de ambiente
    env_file = ".env"

    # Verifica se o arquivo .env já existe
    if not os.path.exists(env_file):
        with open(env_file, "w") as file:
            file.write("")

    # Carrega as variáveis existentes no .env
    load_dotenv(env_file)

    # Verifica se a chave já está configurada
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        # Gera uma nova chave secreta
        secret_key = secrets.token_hex(32)
        # Adiciona a chave ao arquivo .env
        with open(env_file, "a") as file:
            file.write(f"SECRET_KEY={secret_key}\n")
        print(f"Nova chave secreta gerada: {secret_key}")
    else:
        print(f"Chave secreta existente carregada: {secret_key}")

    return secret_key

# Chama a função para configurar ou carregar a chave secreta
SECRET_KEY = generate_secret_key()

# Exemplo de uso no Flask
from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

@app.route("/")
def home():
    return "A aplicação está protegida com uma chave secreta!"

if __name__ == "__main__":
    app.run(debug=True)
