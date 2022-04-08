from flask import Blueprint,make_response,jsonify
from ..mydb import cnxpool
from mysql.connector import Error
attraction_bp = Blueprint("attraction_name",__name__)

@attraction_bp.route("/api/attraction/<attractionId>",methods=["GET"])
def idGetList(attractionId):
    try:
        attractionId = int(attractionId)
    except ValueError:
        response = make_response(jsonify({
            "error": True,
            "message": "請輸入整數"
        }),400)
    except Exception as e:
        response = make_response(jsonify({
            "error": True,
            "message": e
        }),500)

    try:
        cnx = cnxpool.get_connection()
        connected = cnx.is_connected()
        if connected == False:
            cnxpool.reconnect(attempts = 3, delay = 4)
        cursor = cnx.cursor()
        query = ("SELECT * FROM `taipei` WHERE `id`= %s")
        params = (attractionId,) 
        cursor.execute(query,params)
        data = cursor.fetchone()
        
    except Error as err:
        response = make_response(jsonify({
            "error": True,
            "message": err
        }),500)
    finally:
        cursor.close()
        cnx.close()
    if data == None:
        response = make_response(jsonify({
            "error": True,
            "message": None
        }),200)
    else:
        data = list(data)
        data[9] = data[9].split("\n")
        site = {"data": {
                "id": data[0],
                "name":data[1],
                "category":data[2],
                "description":data[3],
                "address":data[4],
                "transport":data[5],
                "mrt":data[6],
                "latitude":data[7],
                "longitude":data[8],
                "images":data[9]
                }
            }
        response = make_response(jsonify(site),200)

    return response
    