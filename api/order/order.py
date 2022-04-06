from ast import Try
from asyncio.windows_events import NULL
from flask import Blueprint,request,make_response,jsonify
import json
import requests
from ..mydb import cnxpool
from mysql.connector import Error
from dotenv import load_dotenv
import os
load_dotenv()
secret = os.getenv("SECRET")
partnerkey = os.getenv("PARTNERKEY")
merchantid = os.getenv("MERCHANTID")
import jwt
from datetime import datetime


order_bp = Blueprint("order_name",__name__)

@order_bp.route("/api/orders",methods=["POST"])
def newOrder():
    try:
        token = request.cookies.get("user")
        if not token:
            res = {
                "error":True,
                "message":"未登入系統，拒絕存取"
            }
            status = 403
        else:
            user = jwt.decode(token, secret, algorithms = ['HS512'])
            uId = str(user['id'])
            now_utc = datetime.now()
            now_utc = now_utc.strftime("%Y%m%d%H%M%S")   #更改時間表示法，從物件變字串
            ordernumber = now_utc + uId 
            order_data = request.get_json()
            email = order_data['order']['contact']['email']
            name = order_data['order']['contact']['name']
            phone = order_data['order']['contact']['phone']
            attractionId = order_data['order']['trip']['attraction']['id']
            date = order_data['order']['trip']['date']
            time = order_data['order']['trip']['time']
            price = order_data['order']['price']
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnx.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("INSERT INTO `order` VALUES (%s,1,%s,%s,%s,%s,%s,%s,%s)")
                params = (ordernumber,email,name,phone,attractionId,date,time,price)
                cursor.execute(query,params)
                cnx.commit()
                cursor.close()
                cnx.close()
            except Error as e:
                print("Error: {}".format(e))
                res = {
                    "error": True,
                    "message": "訂單建立失敗"
                }
                status = 400
                response = make_response(jsonify(res),status)
                return response
                
            prime = order_data['prime']
            post_data = json.dumps({
                "prime":prime,
                "partner_key": partnerkey,
                "merchant_id": merchantid,
                "order_number": ordernumber,
                "details": "trip",
                "amount": price,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email": email
                }
            })
            headers = {'Content-Type':'application/json','x-api-key':partnerkey}
            tp_response = requests.post('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime',
                data = post_data, headers = headers)
            tp_resp = tp_response.json()
            if tp_resp['status'] == 0:
                try:
                    cnx = cnxpool.get_connection()
                    connected = cnx.is_connected()
                    if connected == False:
                        cnx.reconnect(attempts = 3, delay = 4)
                    cursor = cnx.cursor()
                    query1 = ("UPDATE `order` SET `status`= 0 WHERE `orderNumber` = %s")
                    params1 = (ordernumber,)
                    cursor.execute(query1,params1)
                    query2 = ("DELETE FROM `booking` WHERE `email`= %s")
                    params2 = (email,)
                    cursor.execute(query2,params2)
                    cnx.commit()   
                    cursor.close()
                    cnx.close()
                except Error as e:
                    print("Error: {}".format(e))
                    res = {
                        "error": True,
                        "message": "付款成功但資料庫付款狀態更新失敗"
                    }
                    status = 500
                    response = make_response(jsonify(res),status)
                    return response
                    
                res = {
                    "data":{
                        "number":ordernumber,
                        "payment":{
                            "status": 0,
                            "message": "付款成功"
                        }
                    }
                }
                status = 200
            else:
                res = {
                    "data":{
                        "number":ordernumber,
                        "payment":{
                            "status": 1,
                            "message": "訂單建立成功但付款失敗"
                        }
                    }
                }
                status = 500
    except:
        res = {
                "error":True,
                "message":"伺服器內部錯誤"
            }
        status = 500  
    response = make_response(jsonify(res),status)
    print(res)
    return response
    

@order_bp.route("/api/order/<orderNumber>",methods=["GET"])
def getOrder(orderNumber):
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
            query = ("SELECT `price`, `attractionId`, `taipei`.`name`, `address`, `images`, `date`, `time`, "
                    "`order`.`name`, `email`, `phone`, `status`" 
                    "FROM `taipei` JOIN `order`" 
                    "ON `email`= %s AND `orderNumber`= %s AND `taipei`.`id` = `order`.`attractionId`")
            params = (user_email,orderNumber) 
            cursor.execute(query,params)
            data = cursor.fetchone()
            print(data)
            status = 200
            if data == None:
                res = {
                    "data":None
                }
            else:
                res = {
                    "data": {
                        "number": orderNumber,
                        "price": data[0],
                        "trip": {
                            "attraction": {
                                "id": data[1],
                                "name": data[2],
                                "address": data[3],
                                "image": data[4].split('\n')[0]
                            },
                            "date": data[5].isoformat(),
                            "time": data[6]
                        },
                        "contact":{
                            "name": data[7],
                            "email": data[8],
                            "phone": data[9]
                        },
                        "status": data[10]
                    }
                }
        except Error as e:
            cursor.close()
            cnx.close()
            print("Error: {}".format(e))
            res = {
                "error": True,
                "message": "存取資料庫失敗"
            }
            status = 400  
    response = make_response(jsonify(res),status)
    return response
