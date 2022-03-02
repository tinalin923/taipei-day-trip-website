from flask import Flask,request,make_response,jsonify
app=Flask(__name__)
from attractions.db import cnx
app.config["JSON_AS_ASCII"]=False    #加上這個response才不會出現unicode
app.config['JSON_SORT_KEYS'] = False  #加上這個response的呈現順序才不會改變

@app.route("/")
def home():
    return "hello"

@app.route("/api/attractions",methods=["GET"])
def getlist():
    page = request.args.get("page",None)   #page為一字串
    if page == "0" or None:
        cursor = cnx.cursor()
        if cnx.is_connected():
            db_Info = cnx.get_server_info()
            print("Connected to MySQL database using connection pool ... MySQL Server version on ", db_Info)
        else:
            print("Not connected")
        query = ("SELECT * FROM `taipei` WHERE `id`<=12")
        cursor.execute(query)
        datas=cursor.fetchall()     # datas為list
        cursor.close()
        # cnx.close()  會讓連線不穩定
        slist={"nextpage":1,"data":[]}
        
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
    else:
        response = make_response(jsonify({
            "error": True,
            "message": "自訂的錯誤訊息"
        }),500)
        return response


if __name__=="__main__":
	print(app.url_map)
	app.run(port=3000, debug=True)