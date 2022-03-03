from flask import Blueprint,request,make_response,jsonify
from .mydb import cnxpool

attractions_bp = Blueprint("attractions_name",__name__)

@attractions_bp.route("/api/attractions",methods = ["GET"])
def getList():
    try:
        keyword = request.args.get("keyword",None)
        if keyword != None:
            page = request.args.get("page",None)   #page為一字串
            if not page:
                page = 0
            else:
                try:
                    page = int(page)
                except ValueError:         # Could not convert data to an integer.
                    response = make_response(jsonify({
                    "error": True,
                    "message": "無效的頁數輸入,請輸入整數"
                    }),400)
                    return response
            if page == 0:
                cnx=cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ("SELECT COUNT(*) FROM `taipei` WHERE `name` LIKE %s")
                params = ("%"+keyword+"%",)
                cursor.execute(query,params)
                count = cursor.fetchone()[0]
                count=int(count)
                if count == 0:
                    cursor.close()
                    cnx.close()
                    response = make_response(jsonify({"nextpage":None,"data":[]}),200)
                    return response
                else:    
                    query = ("SELECT * FROM `taipei` WHERE `name`LIKE %s ORDER BY `id` ASC LIMIT 12 ")
                    params = ("%"+keyword+"%",)      # 不可以用「'」 代替 「"」
                    cursor.execute(query,params)
                    datas = cursor.fetchall()     # datas為list
                    cursor.close()
                    cnx.close()
                    if count <= 12:
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
            
            if page > 0 :
                cnx=cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ("SELECT COUNT(*) FROM `taipei` WHERE `name` LIKE %s")
                params = ("%"+keyword+"%",)
                cursor.execute(query,params)
                count = cursor.fetchone()[0]
                count=int(count)
                if count == 0:
                    cursor.close()
                    cnx.close()
                    response = make_response(jsonify({"nextpage":None,"data":[]}),200)
                    return response
                else:    
                    query = ("SELECT * FROM `taipei` WHERE `name` LIKE %s ORDER BY `id` ASC LIMIT 12 OFFSET %s")
                    params = ("%"+keyword+"%",12*page)      # 不可以用「'」 代替 「"」
                    cursor.execute(query,params)
                    datas = cursor.fetchall()     # datas為list
                    cursor.close()
                    cnx.close()
                    if count <= (page+1)*12:
                        slist = {"nextpage":None,"data":[]}
                    else:
                        slist = {"nextpage":page+1,"data":[]}
                    for r in datas:
                        r = list(r)              # r 原本為一tuple,要先list()才可以對他進行split的操作
                        r[9]=r[9].split("\n")
                        
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
                    page=int(page)
                except ValueError:
                    response = make_response(jsonify({
                    "error": True,
                    "message": "無效的頁數輸入,請輸入整數"
                    }),400)
                    return response
            if page == 0:
                cnx=cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ("SELECT * FROM `taipei` LIMIT 12")
                cursor.execute(query)
                datas=cursor.fetchall()     # datas為list
                cursor.close()
                cnx.close()
                slist = {"nextpage":1,"data":[]}
                
                for r in datas:
                    r=list(r)              # r 原本為一tuple,要先list()才可以對他進行split的操作
                    r[9]=r[9].split("\n")
                    
                    site={
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
                # print(slist) 有依照我想要的順序排列
                response = make_response(jsonify(slist),200)
                return response
            
            if page > 0:

                cnx=cnxpool.get_connection()
                cursor = cnx.cursor()
                query = ("SELECT * FROM `taipei` LIMIT 12 OFFSET %s")
                params = (12*page,)
                cursor.execute(query,params)
                datas = cursor.fetchall()     # datas為list
                cursor.close()
                cnx.close()
                if datas == []:
                    response = make_response(jsonify({"nextpage":None,"data":[]}),200)
                    return response
                else:
                    if len(datas) <= (page+1)*12:
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

    
