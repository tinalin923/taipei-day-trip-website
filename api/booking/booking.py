from flask import Blueprint,make_response,request,jsonify
from flask_restful import Api, Resource
from ..mydb import cnxpool
from mysql.connector import Error
import jwt
import os
from dotenv import load_dotenv
load_dotenv()
secret = os.getenv("SECRET")

booking_bp = Blueprint("booking_name",__name__)

api = Api(booking_bp)

class Booking(Resource):
    def get(self):
        token = request.cookies.get("user")
        if not token:
            res = {
                "error":True,
                "message":"未登入系統，拒絕存取"
            }
            status = 403
        else:
            status = 200
            user = jwt.decode(token, secret, algorithms = ['HS512'])
            email = user['email']
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnx.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor(buffered = True)
                query = ("SELECT `taipei`.`id`, `name`, `address`, `images`, `date`, `time`, `price`"
                        "FROM `taipei` JOIN `booking` "
                        "ON `booking`.`attractionId` = `taipei`.`id` AND `booking`.`email`= %s"
                )
                params = (email,)
            
                cursor.execute(query,params)
                data = cursor.fetchone()
                cursor.close()
                cnx.close()
                # data = list(data)   #不用讓tuple變成list,也可進行split操作
                if data == None:
                    res = {
                    "data":None
                }
                else:  
                    id = data[0]
                    name = data[1]
                    address = data[2]
                    image = data[3]             # 此時的image為字串，不好取出完整的一個image url
                    image = image.split("\n")   # 所以需要 " .split() " 將字串分割成list
                    image = image[0]
                    date = data[4]
                    date = date.isoformat()    #讓date的type(class?)從 datetime.date變成string
                    time = data[5]
                    price = data[6]
                    res = {
                        "data":{
                            "attraction":{
                                "id":id,
                                "name":name,
                                "address":address,
                                "image":image
                            },
                            "date":date,
                            "time":time,
                            "price":price
                        }
                    }
            except Error as e:
                print("Error:{}".format(e))
                res = {
                    "data":None
                }
            
        response = make_response(jsonify(res),status)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response


    def post(self):
        try:
            token = request.cookies.get("user")
            if not token:
                res = {
                    "error":True,
                    "message":"未登入系統，拒絕存取"
                }
                status = 403
            user = jwt.decode(token, secret, algorithms = ['HS512'])
            email = user['email']

            booking_data = request.get_json()
            attractionId = booking_data['attractionId']
            date = booking_data['date']
            time = booking_data['time']
            price = booking_data['price']
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnx.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("INSERT INTO `booking` (`email`,`attractionId`,`date`,`time`,`price`)"
                        "VALUES (%s, %s, %s, %s, %s)"
                        "ON DUPLICATE KEY UPDATE `attractionId`= VALUES(`attractionId`),"
                        "`date`= VALUES(`date`),`time`= VALUES(`time`),`price`= VALUES(`price`)"
                )
                params = (email,attractionId,date,time,price)
                cursor.execute(query,params)
                cnx.commit()
                res = {
                    "ok":True
                }
                status = 200
            except Error as e:
                res = {
                    "error":True,
                    "message":"建立失敗，不支援的輸入"
                }
                status = 400
                print("Error: {}".format(e))
                # raise
            finally:
                cursor.close()
                cnx.close()

        except:
            res = {
                "error":True,
                "message":"伺服器內部錯誤"
            }
            status = 500
            
        response = make_response(jsonify(res),status)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response


    def delete(self):
        token = request.cookies.get("user")
        if not token:
            res = {
                "error":True,
                "message":"未登入系統，拒絕存取"
            }
            status = 403
        else:
            user = jwt.decode(token, secret, algorithms = ['HS512'])
            email = user['email']
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnx.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("DELETE FROM `booking` WHERE `email` = %s")
                params = (email,)
                cursor.execute(query,params)
                cursor.close()
                cnx.commit()
                cnx.close()
                res = {
                    "ok": True
                }    
                status = 200
            except Error as e:
                res = {
                    "error":True,
                    "message":"刪除失敗"
                }
                status = 400
                print("Error: {}".format(e))

        response = make_response(jsonify(res),status)
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

api.add_resource(Booking,"/api/booking")
