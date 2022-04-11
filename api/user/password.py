from flask import Blueprint,make_response,jsonify,request
from flask_restful import Api, Resource
from ..mydb import cnxpool
from mysql.connector import Error
import jwt
import os
from dotenv import load_dotenv   
load_dotenv()  
secret = os.getenv('SECRET')

password_bp = Blueprint("password_name",__name__)

api = Api(password_bp)

class Password(Resource):
    def get(self):
        token = request.cookies.get('user')
        if not token:
            res = {
                "error": True,
                "message":"未登入系統，拒絕存取"
            }
            status = 403
        else:
            user = jwt.decode(token, secret, algorithms = ['HS512'])
            user_email = user['email']
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnxpool.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("SELECT `password` FROM `members` WHERE `email` = %s")
                params = (user_email,) 
                cursor.execute(query,params)
                data = cursor.fetchone()
                cursor.close()
                cnx.close()
                if data == None:
                    res = {
                        "error": True,
                        "message": "錯誤的存取"
                    }
                    status = 403
                else:
                    res = {
                        "password":data[0]
                    }
                    status = 200
            except Error as e:
                cursor.close()
                cnx.close()
                print("Error: {}".format(e))
                res = {
                    "error": True,
                    "message": "存取資料庫失敗"
                }
                status = 500 

        response = make_response(jsonify(res),status)
        return response

    def patch(self):
        token = request.cookies.get('user')
        if not token:
            res = {
                "error": True,
                "message":"未登入系統，拒絕存取"
            }
            status = 403
        else:
            user = jwt.decode(token, secret, algorithms = ['HS512'])
            user_email = user['email']
            new_password = request.get_json()
            new_password = new_password['newPassword']
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnxpool.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("UPDATE `members` SET `password` = %s WHERE `email` = %s")
                params = (new_password,user_email) 
                cursor.execute(query,params)
                cnx.commit()
                cursor.close()
                cnx.close()
                res = {
                    "ok":True
                }
                status = 200
            except Error as e:
                cursor.close()
                cnx.close()
                print("Error: {}".format(e))
                res = {
                    "error": True,
                    "message": "更新資料庫失敗"
                }
                status = 500

        response = make_response(jsonify(res),status)
        return response

api.add_resource(Password,"/api/password")