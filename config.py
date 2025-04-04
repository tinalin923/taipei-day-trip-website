import os
from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))
class Config():
    # SECRET_KEY = environ.get('SECRET_KEY')
    STATIC_FOLDER = 'static'
    TEMPLATES_FOLDER = 'templates'
    

class DevConfig(Config):
    ENV = 'development'
    DEBUG = True
    TESTING = True
    
    # SQLALCHEMY_TRACK_MODIFICATIONS=False
    # SQLALCHEMY_DATABASE_URI = environ.get('DEV_DATABASE_URI')


