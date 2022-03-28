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

class User(Resource):
    def get(self):                  #檢查登入狀態
        token = request.cookies.get('user')
        if not token:
            response = make_response(jsonify({
                "data": None
            }),200)
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response
        else:
            try:
                user = jwt.decode(token, secret, algorithms = ['HS512'])
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
                response.headers['Access-Control-Allow-Origin'] = '*'
                return response
            except jwt.exceptions.DecodeError as e:
                response = make_response(jsonify({
                    "error": True,
                    "message": e
                }),500)
                response.headers['Access-Control-Allow-Origin'] = '*'
                return response

    def post(self):                 #註冊
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
                response.headers['Access-Control-Allow-Orign'] = '*'
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
                
                newId = cursor.lastrowid
                
                if not newId:  
                    cursor.close()
                    cnx.close()
                    response = make_response(jsonify({
                        "error": True,
                        "message": "Email已被註冊"
                    }),400)
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    return response    
                else:               #可以註冊
                    cnx.commit()
                    cursor.close()
                    cnx.close()
                    response = make_response(jsonify({
                        "ok": True
                    }),200)
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    return response

        except Exception as e:
            response = make_response(jsonify({
                "error": True,
                "message": e
            }),500)
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response

    def patch(self):                #登入
        try:
            req = request.get_json()
            reqEmail = req["email"]
            reqPassword = req["password"]

            if not reqEmail or not reqPassword:
                response = make_response(jsonify({
                    "error": True,
                    "message": "請輸入信箱密碼"
                }),400)
                response.headers['Access-Control-Allow-Origin'] = '*'
                return response
            else:    
                cnx = cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ('SELECT `id`,`name`,`password` FROM `members` WHERE `email` = %s ')
                params = (reqEmail,)
                cursor.execute(query,params)
                user = cursor.fetchone()   
                cursor.close()
                cnx.close()
                if not user: 
                    response = make_response(jsonify({
                    "error": True,
                    "message": "登入失敗，查無此帳號"
                    }),400)
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    return response
                elif reqPassword != user[2]:
                    response = make_response(jsonify({
                    "error": True,
                    "message": "登入失敗，信箱密碼錯誤"
                    }),400)
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    return response
                else:
                    message = {"id":user[0], "name":user[1], "email":reqEmail}
                    token = jwt.encode(message, secret, algorithm = 'HS512')
                    response = make_response(jsonify({
                        "ok": True
                    }),200)
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    #把token存到cookie
                    response.set_cookie(key = 'user', value = token, expires = datetime.datetime.utcnow() + datetime.timedelta(minutes=30))
                    return response     
        except Exception as e:    
            response = make_response(jsonify({
                "error": True,
                "message": e
            }),500)
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response

    def delete(self):               #登出
        response = make_response(jsonify({
            "ok": True
        }),200)
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.set_cookie(key='user', value='', expires=0)
        return response


api.add_resource(User,"/api/user")