from flask import Flask, jsonify, request
import functools
from flask_cors import CORS
from flask_jwt_extended import get_jwt, JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient, ASCENDING
from bson.objectid import ObjectId
from bson.errors import InvalidId
from werkzeug.security import generate_password_hash, check_password_hash
import datetime  # Para manipular datas
import pytz
from datetime import datetime, timedelta, date
from dotenv import load_dotenv
import os

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)
#CORS(app, origins=["http://localhost:3000"])  # Habilita o CORS para permitir requisições do frontend
CORS(app, resources={r"/*": {"origins": "*"}})  # Permite requisições de qualquer origem

client = MongoClient('mongodb://mongo:27017/')
db = client.ongdb  # Conecta ao banco de dados chamado "ongdb"
patients_collection = db.patients  # Conecta à coleção "patients"
employees_collection = db.employees  # Conecta à coleção "employees"
reports_collection = db.reports  # Conecta à coleção "reports"
users_collection = db.users  # Conecta à coleção "users"
services_collection = db.services  # Coleção de serviços
assigned_services_collection = db.assigned_services  # Coleção de serviços atribuídos

# Configurar o fuso horário local (Brasil - UTC-3)
brasil_tz = pytz.timezone('America/Sao_Paulo')

# Etapa 1: Data no fuso horário local
data_local = datetime.now(brasil_tz)  # Obtenha a hora local corretamente

# Etapa 2: Converter para UTC
data_utc = data_local.astimezone(pytz.utc)  # Converta para UTC antes de salvar

# Salvar no MongoDB
document = {"data_geracao": data_utc}

print("Data salva em UTC:", data_utc)

# Taxa de comissão (exemplo de 10% do valor do serviço)
COMMISSION_RATE = 0.10

# Configuração do Flask para o JWT
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')  # Chave secreta para o JWT

# Inicializando o JWTManager com a instância da aplicação
jwt = JWTManager(app)


#------------- USUÁRIOS --------------
# Middleware para verificar nível de acesso
def admin_required(fn):
    @functools.wraps(fn)  # Preserva o nome da função original
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        user = users_collection.find_one({"_id": ObjectId(current_user)})
        if user and user.get('tipo') == 'admin':
            return fn(*args, **kwargs)
        return jsonify({"error": "Acesso negado. Apenas administradores têm permissão."}), 403
    return wrapper

# Rota para adicionar um novo usuário (não requer autenticação)
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "tipo": data.get('tipo', 'comum')  # Define o tipo de usuário, padrão é 'comum'
    }
    result = users_collection.insert_one(new_user)
    return jsonify({"message": "Usuário adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para criar um novo usuário administrador (somente administradores podem acessar)
@app.route('/users/admin', methods=['POST'], endpoint='add_admin_user')
@admin_required
def add_admin():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'])
    new_admin = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "tipo": "admin"
    }
    result = users_collection.insert_one(new_admin)
    return jsonify({"message": "Administrador criado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para listar todos os usuários (somente administradores podem acessar)
@app.route('/users', methods=['GET'], endpoint='list_users')
@admin_required
def get_users():
    users = list(users_collection.find({}))
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users), 200

# Rota para visualizar detalhes de um usuário específico (requer autenticação)
@app.route('/users/<user_id>', methods=['GET'], endpoint='view_user')
@jwt_required()
def get_user(user_id):
    current_user = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({"error": "Usuário não encontrado"}), 404

# Rota para atualizar um usuário (somente administradores podem acessar)
@app.route('/users/<user_id>', methods=['PUT'], endpoint='update_user')
@admin_required
def update_user(user_id):
    data = request.get_json()
    updated_data = {}

    if 'name' in data:
        updated_data['name'] = data['name']
    if 'email' in data:
        updated_data['email'] = data['email']
    if 'password' in data:
        updated_data['password'] = generate_password_hash(data['password'])
    if 'tipo' in data:
        updated_data['tipo'] = data['tipo']

    if updated_data:
        result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updated_data})
        if result.modified_count > 0:
            return jsonify({"message": "Usuário atualizado com sucesso"}), 200
        else:
            return jsonify({"message": "Nenhuma modificação realizada"}), 200
    else:
        return jsonify({"error": "Nenhum dado fornecido para atualização"}), 400

# Rota para deletar um usuário (somente administradores podem acessar)
@app.route('/users/<user_id>', methods=['DELETE'], endpoint='delete_user')
@admin_required
def delete_user(user_id):
    result = users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Usuário deletado com sucesso"}), 200
    return jsonify({"error": "Usuário não encontrado"}), 404

# Rota de login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({"email": data['email']})

    if user and check_password_hash(user['password'], data['password']):
        token = create_access_token(identity=str(user['_id']))
        return jsonify({"token": token, "tipo": user['tipo']}), 200

    return jsonify({"error": "Credenciais inválidas"}), 401
   
# Definição da BLOCKLIST
BLOCKLIST = set()

# Rota de logout
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Pega o ID do token atual
    BLOCKLIST.add(jti)      # Adiciona o token à blocklist
    return jsonify(msg="Logout realizado com sucesso"), 200

# Callback para verificar se o token está na blocklist
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLOCKLIST

#------------- SERVIÇOS --------------    
# Função para converter todos os ObjectId para string
def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    return obj
   
# Rota para listar todos os serviços
@app.route('/services', methods=['GET'])
def get_services():
    services = list(db.services.find({}))  # Recupera todos os serviços do MongoDB
    services = [convert_objectid(service) for service in services]  # Converte todos os ObjectId para string

    # Garantir a codificação correta da resposta JSON
    response = jsonify(services)
    response.headers['Content-Type'] = 'application/json; charset=utf-8'


    return jsonify(services), 200

#Rota para adicionar um novo serviço
@app.route('/services', methods=['POST'])
def add_service():
    data = request.get_json()
    new_service = {
        "name": data["name"],
        "description": data["description"],
        "price": data["price"],
        "date": datetime.now(),
        "employee_id": None,  # Inicialmente, sem atribuição
        "patient_id": None    # Inicialmente, sem atribuição
    }
    result = db.services.insert_one(new_service)  # Insere o novo serviço no MongoDB
    return jsonify(str(result.inserted_id)), 201


# Rota POST para atribuir um serviço a um funcionário e paciente
@app.route('/assign_service', methods=['POST'])
def assign_service():
    data = request.json
    service_id = data["service_id"]
    employee_id = data["employee_id"]
    patient_id = data["patient_id"]

    try:
        service = services_collection.find_one({"_id": ObjectId(service_id)})
        employee = employees_collection.find_one({"_id": ObjectId(employee_id)})
        patient = patients_collection.find_one({"_id": ObjectId(patient_id)})
    except Exception as e:
        return jsonify({"message": f"Erro na busca: {str(e)}"}), 400

    if not service:
        return jsonify({"message": "Serviço não encontrado"}), 404
    if not employee:
        return jsonify({"message": "Funcionário não encontrado"}), 404
    if not patient:
        return jsonify({"message": "Paciente não encontrado"}), 404

    # Calcular a comissão do serviço (10% do preço do serviço)
    commission = service.get("price", 0) * COMMISSION_RATE

    # Criar um novo registro de serviço atribuído
    assigned_service = {
        "service_id": ObjectId(service_id),
        "employee_id": ObjectId(employee_id),
        "patient_id": ObjectId(patient_id),
        "date": datetime.now().isoformat(),
        "employee_name": employee.get("nome", "Nome não disponível"),
        "patient_name": patient.get("nome", "Nome não disponível"),
        "name": service.get("name", ""),
        "description": service.get("description", "Descrição não disponível"),
        "price": service.get("price", 0),
        "commission": commission
    }

    try:
        assigned_services_collection.insert_one(assigned_service)
        return jsonify({"message": "Serviço atribuído com sucesso", "comissao": commission}), 200
    except Exception as e:
        return jsonify({"message": f"Erro ao atribuir serviço: {str(e)}"}), 500

# Rota para exibir todos os serviços atribuídos
@app.route('/assign_services', methods=['GET'])
def fetch_assigned_services():
    try:
        services = db.assigned_services.find()
        assigned_services = []
        for service in services:
            date = datetime.fromisoformat(service["date"]) if "date" in service else None
            assigned_services.append({
                "_id": str(service["_id"]),
                "date": date.strftime("%d/%m/%Y") if date else "Data desconhecida",
                "employee_name": service["employee_name"],
                "name": service["name"],
                "patient_name": service["patient_name"],
                "price": f'R$ {service.get("price", 0):.2f}',
                "commission": f'R$ {service.get("commission", 0):.2f}'
            })
        return jsonify(assigned_services), 200
    except Exception as e:
        return jsonify({"message": f"Erro ao buscar serviços atribuídos: {str(e)}"}), 500

# Rota para visualizar detalhes de um serviço específico
@app.route('/services/<service_id>', methods=['GET'])
def get_service(service_id):
    if not ObjectId.is_valid(service_id):
        return jsonify({"error": "ID de serviço inválido"}), 400

    service = db.assigned_services.find_one({"_id": ObjectId(service_id)})
    if not service:
        return jsonify({"message": "Serviço não encontrado"}), 404

    service['_id'] = str(service['_id'])
    if 'date' in service and service['date']:
        try:
            date = datetime.fromisoformat(service['date'])
            service['date'] = date.strftime("%d/%m/%Y")
        except ValueError:
            service['date'] = service['date']

    # Procurar o funcionário e paciente associados ao serviço atribuído
    employee = db.employees.find_one({"_id": ObjectId(service['employee_id'])}) if service.get('employee_id') else None
    patient = db.patients.find_one({"_id": ObjectId(service['patient_id'])}) if service.get('patient_id') else None

    service_data = {
        "service": {
            "id": service['_id'],
            "name": service.get("name"),
            "description": service.get("description", "Descrição não disponível"),
            "price": service.get("price", 0),
            "date": service.get("date", "Data não disponível"),
            "employee": {
                "id": str(employee["_id"]) if employee else None,
                "name": employee.get("nome") if employee else None
            },
            "patient": {
                "id": str(patient["_id"]) if patient else None,
                "name": patient.get("nome") if patient else None
            }
        }
    }

    return jsonify(service_data), 200

# Rota para remover um serviço do MongoDB
@app.route('/services/<service_id>', methods=['DELETE'])
def delete_service(service_id):
    result = db.services.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Serviço deletado com sucesso"}), 200
    return jsonify({"error": "Serviço não encontrado"}), 404

# Rota para atualizar um serviço
@app.route('/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    updated_data = request.get_json()
    result = db.services.update_one({"_id": ObjectId(service_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Serviço atualizado com sucesso"}), 200
    return jsonify({"error": "Serviço não encontrado"}), 404

# Rota para remover um serviço atribuído do MongoDB
@app.route('/assigned_services/<service_id>', methods=['DELETE'])
def delete_assigned_service(service_id):
    if not ObjectId.is_valid(service_id):
        return jsonify({"error": "ID de serviço atribuído inválido"}), 400

    result = db.assigned_services.delete_one({"_id": ObjectId(service_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Serviço atribuído deletado com sucesso"}), 200
    return jsonify({"error": "Serviço atribuído não encontrado"}), 404


# ---------------- PACIENTES ---------------- #
# Rota para adicionar um novo paciente
@app.route('/patients', methods=['POST'])
def add_patient():
    new_patient = request.get_json()  # Pega os dados enviados no corpo da requisição
    result = patients_collection.insert_one(new_patient)  # Insere o novo paciente no MongoDB
    return jsonify({"message": "Paciente adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para listar todos os pacientes
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = list(patients_collection.find({}))  # Recupera todos os pacientes do MongoDB
    for patient in patients:
        patient['_id'] = str(patient['_id'])  # Converte ObjectId para string
    return jsonify(patients), 200    

# Rota para visualizar detalhes de um paciente específico
@app.route('/patients/<patient_id>', methods=['GET'])
def get_patient_details(patient_id):
    patient = patients_collection.find_one({"_id": ObjectId(patient_id)})
    if patient:
        patient['_id'] = str(patient['_id'])
        return jsonify(patient), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

# Rota para remover um paciente do MongoDB
@app.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    result = patients_collection.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Paciente deletado com sucesso"}), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

# Rota para atualizar os dados de um paciente 
@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    updated_data = request.get_json()  # Pega os dados enviados no corpo da requisição

    # Remover o campo _id do corpo da requisição
    if '_id' in updated_data:
        del updated_data['_id']

    # Realiza a atualização
    result = patients_collection.update_one({"_id": ObjectId(patient_id)}, {"$set": updated_data})
    
    if result.modified_count > 0:
        return jsonify({"message": "Paciente atualizado com sucesso"}), 200
    return jsonify({"error": "Paciente não encontrado ou nenhum dado foi alterado"}), 404   


# ---------------- FUNCIONÁRIOS ---------------- #
# Rota para listar todos os funcionários
@app.route('/employees', methods=['GET'])
def get_employees():
    employees = list(employees_collection.find({}))  # Recupera todos os funcionários do MongoDB
    for employee in employees:
        employee['_id'] = str(employee['_id'])  # Converte ObjectId para string
    return jsonify(employees), 200

#Adicionar um funcionário
@app.route('/employees', methods=['POST'])
def add_employee():
    new_employee = request.get_json()

    # Processa o campo 'data_contratacao'
    if 'data_contratacao' in new_employee and new_employee['data_contratacao']:
        try:
            # Converte para o formato correto (YYYY-MM-DD) e remove a hora
            new_employee['data_contratacao'] = datetime.strptime(new_employee['data_contratacao'], '%Y-%m-%d').date().isoformat()
        except ValueError:
            return jsonify({"error": "Data de contratação inválida. O formato correto é YYYY-MM-DD."}), 400
    else:
        # Define a data atual se não for enviada
        new_employee['data_contratacao'] = date.today().isoformat()

    # Processa o campo 'data_nascimento'
    if 'data_nascimento' in new_employee:
        try:
            # Converte para o formato correto (YYYY-MM-DD)
            new_employee['data_nascimento'] = datetime.strptime(new_employee['data_nascimento'], '%Y-%m-%d').date().isoformat()
        except ValueError:
            return jsonify({"error": "Data de nascimento inválida. O formato correto é YYYY-MM-DD."}), 400


    # Insere o novo funcionário no MongoDB
    result = employees_collection.insert_one(new_employee)

    return jsonify({"message": "Funcionário adicionado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para visualizar detalhes de um funcionário específico
@app.route('/employees/<employee_id>', methods=['GET'])
def get_employee_details(employee_id):
    try:
        # Busca o funcionário pelo ID
        employee = employees_collection.find_one({"_id": ObjectId(employee_id)})
        if employee:
            employee['_id'] = str(employee['_id'])

            # Formata as datas no formato 'YYYY-MM-DD'
            if 'data_contratacao' in employee:
                employee['data_contratacao'] = datetime.strptime(employee['data_contratacao'], '%Y-%m-%d').strftime('%d/%m/%Y')

            if 'data_nascimento' in employee:
                employee['data_nascimento'] = datetime.strptime(employee['data_nascimento'], '%Y-%m-%d').strftime('%d/%m/%Y')

            return jsonify(employee), 200

        return jsonify({"error": "Funcionário não encontrado"}), 404
    except Exception as e:
        return jsonify({"error": "Erro ao processar a solicitação", "details": str(e)}), 500

# Rota para remover um funcionário do MongoDB
@app.route('/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    result = employees_collection.delete_one({"_id": ObjectId(employee_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Funcionário deletado com sucesso"}), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404

# Rota para atualizar um funcionário
@app.route('/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    updated_data = request.get_json()
    result = employees_collection.update_one({"_id": ObjectId(employee_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Funcionário atualizado com sucesso"}), 200
    return jsonify({"error": "Funcionário não encontrado"}), 404



# ---------------- RELATÓRIOS ---------------- #

# Função para validar e converter datas no formato "dd/mm/yyyy"
def validate_and_convert_date(date_str):
    try:
        # Tentar converter a data no formato "dd/mm/yyyy" para datetime
        date_obj = datetime.strptime(date_str, "%d/%m/%Y")
        return date_obj
    except ValueError:
        raise ValueError(f"Data no formato inválido: {date_str}")


# Rota para criar relatório de serviços
@app.route('/create_report', methods=['POST'])
def create_report():
    data = request.json
    start_date_str = data.get("start_date")
    end_date_str = data.get("end_date")

    # Verificar se as datas foram fornecidas
    if not start_date_str or not end_date_str:
        return jsonify({"message": "As datas de início e fim são obrigatórias"}), 400

    # Validar e converter as datas
    try:
        start_date = validate_and_convert_date(start_date_str)
        end_date = validate_and_convert_date(end_date_str)
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    # Buscar todos os serviços atribuídos no intervalo de datas
    assigned_services = assigned_services_collection.find({
        "date": {"$gte": start_date.isoformat(), "$lte": end_date.isoformat()}
    })

    # Agrupar serviços por nome e calcular as estatísticas
    report_data = {}
    total_patients = set()  # Para garantir que contaremos cada paciente apenas uma vez

    for service in assigned_services:
        service_name = service["name"]
        patient_id = service["patient_id"]
        price = service["price"]
        commission = service["commission"]

        if service_name not in report_data:
            report_data[service_name] = {
                "service_count": 0,
                "total_revenue": 0,
                "total_commission": 0
            }

        report_data[service_name]["service_count"] += 1
        report_data[service_name]["total_revenue"] += price
        report_data[service_name]["total_commission"] += commission
        total_patients.add(patient_id)

    # Configura o fuso horário do Brasil (Horário de Brasília - UTC-3)
    brasil_tz = pytz.timezone('America/Sao_Paulo')
    # Data de criação (data_geracao) em formato datetime
    data_geracao = datetime.now(brasil_tz)  # Salvando a data de criação como datetime

    # Subtrai 3 horas de data_geracao
    data_geracao_minus_3_hours = data_geracao - timedelta(hours=3)

    # Preparar o relatório final
    report = {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "data_geracao": data_geracao_minus_3_hours,  # Salvando a data com 3 horas subtraídas no banco
        "total_patients": len(total_patients),
        "services": []
    }

    for service_name, data in report_data.items():
        report["services"].append({
            "service_name": service_name,
            "service_count": data["service_count"],
            "total_revenue": data["total_revenue"],
            "total_commission": data["total_commission"]
        })

    # Inserir o relatório na coleção de relatórios
    try:
        report["_id"] = reports_collection.insert_one(report).inserted_id
        return jsonify({"message": "Relatório criado com sucesso", "report_id": str(report["_id"])}), 200
    except Exception as e:
        return jsonify({"message": f"Erro ao criar relatório: {str(e)}"}), 500

# Função auxiliar para formatar datas corretamente
def format_date(date, include_time=False):
    if isinstance(date, datetime):
        if include_time:
            return date.strftime('%d/%m/%Y - %H:%M')  # Formato completo com hora
        else:
            return date.strftime('%d/%m/%Y')  # Formato apenas de data
    elif isinstance(date, str):  # Se for string, verificar o formato
        try:
            # Tenta converter de 'yyyy-mm-dd' ou 'yyyy-mm-ddT00:00:00' para datetime e depois formata
            dt = datetime.strptime(date.split("T")[0], '%Y-%m-%d')
            if include_time:
                return dt.strftime('%d/%m/%Y - %H:%M')  # Formato completo com hora
            else:
                return dt.strftime('%d/%m/%Y')  # Formato apenas de data
        except ValueError:
            # Caso o formato não seja esperado, retornar None ou outro valor padrão
            return None
    return None  # Se for None ou um formato inesperado

# Rota para buscar todos os relatórios de serviços
@app.route('/get_reports', methods=['GET'])
def get_reports():
    reports = []

    # Busca todos os relatórios criados
    for report in reports_collection.find():
        # Formatar as datas do relatório
        data_geracao_formatada = format_date(report.get('data_geracao'), include_time=True)  # Formato completo com hora
        data_inicio_formatada = format_date(report.get('start_date'))
        data_fim_formatada = format_date(report.get('end_date'))

        # Inicializando a receita total
        total_receita = 0

        report_data = {
            'id': str(report['_id']),
            'data_geracao': data_geracao_formatada,  # Exibe a data de criação com hora
            'data_inicio': data_inicio_formatada,
            'data_fim': data_fim_formatada,
            'total_receita': total_receita,  # Inicializa como 0
            'pacientes_atendidos': report.get('total_patients', 0),
            'servicos': []
        }

        # Detalhes dos serviços atribuídos
        for servico in report.get('services', []):
            service_name = servico.get('service_name')
            service_details = services_collection.find_one({"name": service_name})

            if service_details:
                # Calculando o total de receita para este serviço
                preco_unitario = service_details.get('price', 0)
                quantidade = servico['service_count']
                receita_servico = preco_unitario * quantidade

                # Atualizando o total de receita
                total_receita += receita_servico

                report_data['servicos'].append({
                    'servico_nome': servico['service_name'],
                    'quantidade': servico['service_count'],
                    'preco_unitario': preco_unitario,  # Preço unitário do serviço
                    'total_receita': receita_servico  # Receita do serviço
                })

        # Atualiza o total de receita no relatório
        report_data['total_receita'] = total_receita

        reports.append(report_data)

    return jsonify(reports), 200

# Rota para remover um relatório do MongoDB
@app.route('/reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    result = reports_collection.delete_one({"_id": ObjectId(report_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Relatório deletado com sucesso"}), 200
    return jsonify({"error": "Relatório não encontrado"}), 404

# # Rota para buscar um relatório específico por ID
# @app.route('/reports/<report_id>', methods=['GET'])
# def get_report(report_id):
    report = reports_collection.find_one({"_id": ObjectId(report_id)})
    if not report:
        return jsonify({"error": "Relatório não encontrado"}), 404

    report_data = {
        'id': str(report['_id']),
        'data_geracao': report.get('data_geracao'),
        'data_inicio': report.get('data_inicio'),
        'data_fim': report.get('data_fim'),
        'total_receita': report.get('total_receita', 0),
        'comissoes': report.get('comissoes', {}),
        'servicos': []
    }

    # Recuperar detalhes de cada serviço
    for servico in report.get('servicos', []):
        servico_detalhes = services_collection.find_one({"_id": ObjectId(servico['servico_id'])})
        if servico_detalhes:
            paciente = patients_collection.find_one({"_id": servico_detalhes.get('paciente_id')})
            funcionario = employees_collection.find_one({"_id": servico_detalhes.get('funcionario_id')})
            report_data['servicos'].append({
                'servico_id': str(servico_detalhes['_id']),
                'tipo': servico_detalhes.get('tipo_servico'),
                'preco': servico_detalhes.get('preco'),
                'paciente': paciente['nome'] if paciente else None,
                'funcionario': funcionario['nome'] if funcionario else None
            })
    
    return jsonify(report_data), 200

# # Rota para atualizar um relatório
# @app.route('/reports/<report_id>', methods=['PUT'])
# def update_report(report_id):
    updated_data = request.get_json()
    result = reports_collection.update_one({"_id": ObjectId(report_id)}, {"$set": updated_data})
    if result.modified_count > 0:
        return jsonify({"message": "Relatório atualizado com sucesso"}), 200
    return jsonify({"error": "Relatório não encontrado"}), 404  

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)