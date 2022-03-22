from flask import Flask,Blueprint,session,jsonify,request
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

        response = jsonify({
            "data":{
                "id": "1",
                "name": "qqq",
                "email": "qqq"
            }
        }),200
        return response




    def post(self):       #註冊
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["passsword"]

        if not name or not email or not password:
            response = jsonify({'message' : "請輸入資料"})
            return  response




        response = jsonify({
            "ok": True
        }),200

        response = jsonify({
            "error": True,
            "message": "自訂訊息"
        }),400

        response = jsonify({
            "error": True,
            "message": "自訂訊息"
        }),500

        return response



    def patch(self):
        try:
            req = request.get_json()
            reqEmail = req["email"]
            reqPassword = req["password"]

            if not reqEmail or not reqPassword:
                response = jsonify({
                    "error": True,
                    "message": "請輸入帳號密碼"
                }),400
                return response
            else:    
                cnx = cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ('SELECT `password` FROM `members` WHERE `email` = %s ')
                params = (reqEmail,)
                cursor.execute(query,params)
                password = cursor.fetchone()
                cursor.close()
                cnx.close()
                if not password: 
                    response = jsonify({
                    "error": True,
                    "message": "登入失敗，查無此帳號"
                    }),400
                    return response

                elif reqPassword == password:
                    token = jwt.endoce({"email":reqEmail}, secret, algorithm = 'HS256')
                    #把token存到cookie
                    response.set_cookie(key = 'user', value = token, expires = datetime.datetime.utcnow() + datetime.timedelta(seconds=15))
                    response = jsonify({
                        "ok": True
                    }),200
                    return response
                else:
                    response = jsonify({
                    "error": True,
                    "message": "登入失敗，帳號密碼錯誤"
                    }),400
                    return response
            
        except Exception as e:    
            response = jsonify({
                "error": True,
                "message": e
            }),500

            return response


        
    def delete(self):
        response = jsonify({
            "ok": True
        }),200
        return response






api.add_resource(User,"/api/user")