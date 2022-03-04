import os 
from dotenv import load_dotenv   
load_dotenv()  
from mysql.connector import Error
from mysql.connector import pooling

cnxpool= pooling.MySQLConnectionPool(
                                pool_name="mynative_pool",
                                pool_size=5,
                                pool_reset_session=True,
                                host=os.getenv('DBHOST'),
                                port=os.getenv('DBPORT'),
                                user=os.getenv('DBUSER'),
                                password=os.getenv('DBPASSWORD'),
                                database=os.getenv('DBDB'))
print("Printing connection pool properties ")
print("Connection Pool Name - ", cnxpool.pool_name)
print("Connection Pool Size - ", cnxpool.pool_size)
cnx=cnxpool.get_connection()

#     if cnx.is_connected():
#         db_Info = cnx.get_server_info()
#         print("Connected to MySQL database using connection pool ... MySQL Server version on ", db_Info)
#         cursor=cnx.cursor()
#         cursor.execute("select * from taipei")

# except Error as e:
#     print("Error while connecting to MySQL using Connection pool ", e)
# finally:
#     if cnx.is_connected():
#         cursor.close()
#         cnx.close()
#         print("MySQL connection is closed")
