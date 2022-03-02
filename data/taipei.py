from db import connection
import re      #用python正規表示法去掉字串中的空格:re.sub(r"\s+","",參數)
import json
with open("taipei-attractions.json",mode="r",encoding="utf-8") as file:
    data=json.load(file) 
list=data["result"]["results"]

cursor=connection.cursor()
for i in range(len(list)):
                                        #讓ID AUTO_INCREMENT
    name=list[i]["stitle"]
    category=list[i]["CAT2"]
    description=list[i]["xbody"]

    addr=list[i]["address"]
    address=re.sub(r"\s+","",addr)

    transport=list[i]["info"]
    mrt=list[i]["MRT"]
    latitude=list[i]["latitude"]
    longitude=list[i]["longitude"]

    imag=list[i]["file"].lower()    #都變小寫
    images=imag.split("https")      #將每個景點的file內容分隔成一列表   
    total=len(images)           #取得每個景點的列表個數(尚未剔除mp3.flv.第一個空白項目)
    mp3=imag.count("mp3")       #計算每個景點file內含有幾個mp3檔
    flv=imag.count("flv")        #計算每個景點file內含有幾個flv檔
    jpg=total-mp3-flv
    for n in range(1,jpg):
        images[n]=images[n].replace(":","https:")
    images=images[1:jpg]                    #整理好的images列表
    images_string='\n'.join(map(str,images))       #將列表(images)轉為字串(str)  # join() 可將序列中的元素以指定的字符(\n)連接生成一個新的字符串
    # print(images_string)
    query="INSERT INTO `taipei`(name,category,description,address,transport,mrt,latitude,longitude,images)VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s) "
    params=(name,category,description,address,transport,mrt,latitude,longitude,images_string)
    cursor.execute(query,params)
    

cursor.close()
connection.commit()
connection.close()

print("執行成功")






# id依照 原json檔取得
# from db import connection
# import re      #用python正規表示法去掉字串中的空格:re.sub(r"\s+","",參數)
# import json
# with open("taipei-attractions.json",mode="r",encoding="utf-8") as file:
#     data=json.load(file) 
# list=data["result"]["results"]

# cursor=connection.cursor()
# for i in range(len(list)):
#     id=list[i]["_id"]
#     name=list[i]["stitle"]
#     category=list[i]["CAT2"]
#     description=list[i]["xbody"]

#     addr=list[i]["address"]
#     address=re.sub(r"\s+","",addr)

#     transport=list[i]["info"]
#     mrt=list[i]["MRT"]
#     latitude=list[i]["latitude"]
#     longitude=list[i]["longitude"]

#     imag=list[i]["file"].lower()    #都變小寫
#     images=imag.split("https")      #將每個景點的file內容分隔成一列表   
#     total=len(images)           #取得每個景點的列表個數(尚未剔除mp3.flv.第一個空白項目)
#     mp3=imag.count("mp3")       #計算每個景點file內含有幾個mp3檔
#     flv=imag.count("flv")        #計算每個景點file內含有幾個flv檔
#     jpg=total-mp3-flv
#     for n in range(1,jpg):
#         images[n]=images[n].replace(":","https:")
#     images=images[1:jpg]                    #整理好的images列表
#     images_string='\n'.join(map(str,images))       #將列表(images)轉為字串(str)  # join() 可將序列中的元素以指定的字符(\n)連接生成一個新的字符串
#     # print(images_string)
#     query="INSERT INTO `taipei` VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) "
#     params=(id,name,category,description,address,transport,mrt,latitude,longitude,images_string)
#     cursor.execute(query,params)
    

# cursor.close()
# connection.commit()
# connection.close()

# print("執行成功")














# i=57
# id=list[i]["_id"]
# name=list[i]["stitle"]
# category=list[i]["CAT2"]
# description=list[i]["xbody"]

# addr=list[i]["address"]
# address=re.sub(r"\s+","",addr)

# transport=list[i]["info"]
# mrt=list[i]["MRT"]
# latitude=list[i]["latitude"]
# longitude=list[i]["longitude"]

# imag=list[i]["file"].lower()    #都變小寫
# images=imag.split("https")      #將每個景點的file內容分隔成一列表   
# total=len(images)           #取得每個景點的列表個數(尚未剔除mp3.flv.第一個空白項目)
# mp3=imag.count("mp3")       #計算每個景點file內含有幾個mp3檔
# flv=imag.count("flv")       #計算每個景點file內含有幾個flv檔
# jpg=total-mp3-flv           #列表中jpg的照片張數(未剔除第一個空白項目)
# # jpgPic=images[1:jpg]      #剔除列表中的第一個空白項目
# # listNum=len(jpgPic)       #列表中的照片張數
# print(images[1])
# for n in range(1,jpg):
#     print(images[n].replace(":","https:"))
#     images[n]=images[n].replace(":","https:")
    
# images=images[1:jpg]
# print(images)
# mystring=''.join(map(str,images))
# print(mystring)