from flask import Blueprint,make_response,jsonify,request
from flask_restful import Api, Resource
from ..mydb import cnxpool
import datetime
import jwt
import os
from dotenv import load_dotenv   
load_dotenv()  
secret = os.getenv('SECRET')


user_bp = Blueprint("user_name",__name__)

api = Api(user_bp)


cnx = cnxpool.get_connection()

class User(Resource):
    def get(self):
        token = request.cookies.get('user')
        print(token)
        if not token:
            response = make_response(jsonify({
                "data": None
            }),200)
            return response
        else:
            user = jwt.decode(token,secret,algorithms = ['HS512'])
            id = user['id']
            name = user['name']
            email = user['email']
            response = make_response(jsonify({
                "data":{
                    "id": id,
                    "name": name,
                    "email": email
                }
            }),200)
            return response


    def post(self):       #註冊
        try:    
            req = request.get_json()
            reqName = req["name"]
            reqEmail = req["email"]
            reqPassword = req["password"]

            if not reqName or not reqEmail or not reqPassword:
                response = make_response(jsonify({
                    "error": True,
                    "message" : "請輸入資料"
                }),400)
                return  response

            else:
                cnx = cnxpool.get_connection()
                cursor = cnx.cursor()
                query = (
                    'INSERT INTO `members` (`name`, `email`, `password`) '
                    'VALUES (%s, %s, %s) '
                    'ON DUPLICATE KEY UPDATE `email` = VALUES(email)'
                    )
                params = (reqName, reqEmail, reqPassword)
                cursor.execute(query,params)
                cnx.commit()
                newId = cursor.lastrowid
                cursor.close()
                if not newId:  
                    cnx.close()
                    response = make_response(jsonify({
                        "error": True,
                        "message": "Email已被註冊"
                    }),400)
                    return response
                    
                else:       #可以註冊
                    
                    cnx.close()
                    response = make_response(jsonify({
                        "ok": True
                    }),200)
                    return response

        except Exception as e:
            response = make_response(jsonify({
                "error": True,
                "message": e
            }),500)

            return response


    def patch(self):
        try:
            req = request.get_json()
            reqEmail = req["email"]
            print(reqEmail)
            reqPassword = req["password"]

            if not reqEmail or not reqPassword:
                response = make_response(jsonify({
                    "error": True,
                    "message": "請輸入帳號密碼"
                }),400)
                return response
            else:    
                cnx = cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ('SELECT `id`,`name`,`password` FROM `members` WHERE `email` = %s ')
                params = (reqEmail,)
                cursor.execute(query,params)
                user = cursor.fetchone()   # password = ('123',)
                cursor.close()
                cnx.close()
                if not user: 
                    response = make_response(jsonify({
                    "error": True,
                    "message": "登入失敗，查無此帳號"
                    }),400)
                    return response
                elif reqPassword != user[2]:
                    
                    response = make_response(jsonify({
                    "error": True,
                    "message": "登入失敗，帳號密碼錯誤"
                    }),400)
                    return response
                else:
                    print(user[2])
                    print(reqPassword)
                    message = {"id":user[0], "name":user[1], "email":reqEmail}
                    token = jwt.encode(message, secret, algorithm = 'HS512')
                    response = make_response(jsonify({
                        "ok": True
                    }),200)
                    #把token存到cookie
                    response.set_cookie(key = 'user', value = token, expires = datetime.datetime.utcnow() + datetime.timedelta(seconds=15))
                    return response
                
            
        except Exception as e:    
            response = make_response(jsonify({
                "error": True,
                "message": e
            }),500,{'Content-type':'application/json'})

            return response


        
    def delete(self):
        
        response = make_response(jsonify({
            "ok": True
        }),200)
        response.set_cookie(key='user', value='', expires=0)
        return response






api.add_resource(User,"/api/user")