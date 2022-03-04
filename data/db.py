import os 
from dotenv import load_dotenv   
load_dotenv()  
import mysql.connector 
connection= mysql.connector.connect(host=os.getenv('DBHOST'),
                                    port=os.getenv('DBPORT'),
                                    user=os.getenv('DBUSER'),
                                    password=os.getenv('DBPASSWORD'),
                                    database=os.getenv('DBDB'))
