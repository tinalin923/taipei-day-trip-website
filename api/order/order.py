from flask import Blueprint,make_response,jsonify
from ..mydb import cnxpool
from mysql.connector import Error

order_bp = Blueprint("order_name",__name__)

@order_bp.route("/api/orders",methods=["POST"])
def newOrder():
    if True:
        res = 0
    else:
        res = 1
    response = make_response(jsonify(res))
    return response
    

@order_bp.route("/api/order/<orderNumber>",methods=["GET"])
def getOrder(orderNumber):
    if True:
        res = 0
    else:
        res = 1
    response = make_response(jsonify(res))
    return response
