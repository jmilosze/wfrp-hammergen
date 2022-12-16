from datetime import datetime
import pickle
from pymongo import MongoClient
from flask_bcrypt import generate_password_hash

PSWD = ''
SOURCE_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'
TARGET_DB = f'mongodb+srv://Jacek:{PSWD}@cluster0-5sck7.azure.mongodb.net/test?retryWrites=true&w=majority'

s_client = MongoClient(SOURCE_DB, 27017)
t_client = MongoClient(TARGET_DB, 27017)

s_collection = s_client.Warhammer.ApplicationUsers
t_collection = t_client.hammergen.user

random_string = 'cfdgh&%$$^65sdfhy87237y0985ryhf087gf08HJGKHJGFO*&^)*&Ug'

s_users = s_collection.find()

try:
    with open('translation_table.pkl', 'rb') as file:
        translation_table = pickle.load(file)
except:
    translation_table = {}

for s_user in s_users:
    try:
        insert_result = t_collection.insert_one({'username': s_user['UserName'].lower(),
                                                 'name': '',
                                                 'created_on': datetime.now(),
                                                 'claims': ['user'],
                                                 'password_hash': generate_password_hash(random_string),
                                                 'last_auth_on': datetime.now()})
        translation_table[str(s_user['_id'])] = str(insert_result.inserted_id)
    except Exception as exp:
        print('Skipping username ', s_user['UserName'])

with open('translation_table.pkl', 'wb') as file:
    pickle.dump(translation_table, file)
