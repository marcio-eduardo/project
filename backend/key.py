import os
import binascii

from dotenv import load_dotenv 

load_dotenv()

# Gera uma chave aleatória de 32 bytes
# secret_key = binascii.hexlify(os.urandom(24)).decode()
# print(secret_key)



# Verificar se as variáveis de ambiente estão sendo carregadas corretamente
print("SECRET_KEY:", os.getenv('SECRET_KEY'))
print("JWT_SECRET_KEY:", os.getenv('JWT_SECRET_KEY'))
print("MONGO_URI:", os.getenv('MONGO_URI'))
print("DB_NAME:", os.getenv('DB_NAME'))

# Continue com o restante do seu código...
