from werkzeug.security import generate_password_hash

senha = "sua_senha_admin"
hash_senha = generate_password_hash(senha)
print(hash_senha)