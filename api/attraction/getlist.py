from flask import Blueprint,request,make_response,jsonify
from ..mydb import cnxpool
from mysql.connector import Error
attractions_bp = Blueprint("attractions_name",__name__)

@attractions_bp.route("/api/attractions",methods = ["GET"])
def getList():
    try:
        keyword = request.args.get("keyword",None)
        if keyword:                                 #if keyword != None:
            page = request.args.get("page",None)    #page為一字串
            if not page:
                page = 0
            else:
                try:
                    page = int(page)
                except ValueError:                  # Can not convert data to an integer.
                    response = make_response(jsonify({
                        "error": True,
                        "message": "無效的頁數輸入,請輸入整數"
                    }),400)
                    return response
            try:
                cnx = cnxpool.get_connection()            #也可以用一次取12+1筆來確定有沒有下一頁，就不用Count(*)了
                connected = cnx.is_connected()
                if connected == False:
                    cnxpool.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("SELECT COUNT(*) FROM `taipei` WHERE `name` LIKE %s")
                params = ("%"+keyword+"%",)
                cursor.execute(query,params)
                count = cursor.fetchone()[0]
            except Error as err:
                cursor.close()
                cnx.close()
                print("Error:{}".format(err))
                response = make_response(jsonify({
                    "error": True,
                    "message": err
                }),500)
                return response   
            if count == 0:
                cursor.close()
                cnx.close()
                response = make_response(jsonify({"nextpage":None,"data":[]}),200)
                return response
            else:    
                query = ("SELECT * FROM `taipei` WHERE `name`LIKE %s ORDER BY `id` ASC LIMIT 12 OFFSET %s")
                params = ("%"+keyword+"%",12*page)      # 不可以用「'」 代替 「"」
                cursor.execute(query,params)
                datas = cursor.fetchall()               # datas為list
                cursor.close()
                cnx.close()
                if count <= (page+1)*12:
                    slist = {"nextpage":None,"data":[]}
                else:
                    slist = {"nextpage":page+1,"data":[]}
                
                for r in datas:
                    r = list(r)              # r 原本為一tuple,要先list()才可以對他進行split的操作
                    r[9] = r[9].split("\n")
                    
                    site = {
                        "id": r[0],
                        "name":r[1],
                        "category":r[2],
                        "description":r[3],
                        "address":r[4],
                        "transport":r[5],
                        "mrt":r[6],
                        "latitude":r[7],
                        "longitude":r[8],
                        "images":r[9]
                    }
                    slist["data"].append(site)
                    
                response = make_response(jsonify(slist),200)
                return response
            
            
        else:
            page = request.args.get("page","")   #page為一字串
            if  page == "":
                page = 0
            else:
                try:
                    page = int(page)
                except ValueError:
                    response = make_response(jsonify({
                        "error": True,
                        "message": "無效的頁數輸入,請輸入整數"
                    }),400)
                    return response
            try:
                cnx = cnxpool.get_connection()
                connected = cnx.is_connected()
                if connected == False:
                    cnx.reconnect(attempts = 3, delay = 4)
                cursor = cnx.cursor()
                query = ("SELECT * FROM `taipei` LIMIT 12 OFFSET %s")
                params = (12*page,)
                cursor.execute(query,params)
                datas = cursor.fetchall()     # datas為list
                cursor.execute("SELECT COUNT(id) FROM `taipei`")
                total = cursor.fetchone()[0]
            except Error as err:
                print("Error:{}".format(err))
                response = make_response(jsonify({
                    "error": True,
                    "message": err
                }),500)
                return response
            finally:
                cursor.close()
                cnx.close()
            if datas == []:
                response = make_response(jsonify({"nextpage":None,"data":[]}),200)
                return response
            else:
                if total - (page+1)*12 <= 0 :
                    slist = {"nextpage":None,"data":[]}
                else:
                    slist = {"nextpage":page+1,"data":[]}
                for r in datas:
                    r = list(r)              # r 原本為一tuple,要先list()才可以對他進行split的操作
                    r[9] = r[9].split("\n")
                    
                    site = {
                        "id": r[0],
                        "name":r[1],
                        "category":r[2],
                        "description":r[3],
                        "address":r[4],
                        "transport":r[5],
                        "mrt":r[6],
                        "latitude":r[7],
                        "longitude":r[8],
                        "images":r[9]
                    }
                    slist["data"].append(site)
                response = make_response(jsonify(slist),200)
                return response   
    except Exception as e:
        response = make_response(jsonify({
            "error": True,
            "message": e
        }),500)
        return response

    
