from flask import Blueprint,request,make_response,jsonify
from.db import cnx

attraction_bp = Blueprint("attraction_name",__name__)

@attraction_bp.route("/api/attraction/<attractionId>",methods=["GET"])
def idGetList(attractionId):
    try:
        attractionId = int(attractionId)
    except ValueError:
        response = make_response(jsonify({
        "error": True,
        "message": "請輸入數字"
        }),400)
        return response
    cursor=cnx.cursor()
    query = ("SELECT * FROM `taipei` WHERE `id`= %s")
    params = (attractionId,) 
    cursor.execute(query,params)
    data = cursor.fetchone()
    cursor.close()
    if data == None:
        response = make_response(jsonify({
                "error": True,
                "message": "查無資料"
                }),500)
        return response
    else:
        data=list(data)
        data[9]=data[9].split("\n")
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
        response=make_response(jsonify(site),200)
        return response